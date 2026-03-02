import axios from 'axios'
import { toast } from 'sonner'
import { env } from '@/env'

const instance = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 15_000,
  headers: {
    'Content-Type': 'application/json',
  },
})

instance.interceptors.response.use(
  response => response.data,
  (error) => {
    const message = getErrorMessage(error)
    toast.error(message, { position: 'top-center' })
    return Promise.reject(error)
  },
)

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string, error?: string } | undefined
    if (data?.message)
      return data.message
    if (data?.error)
      return data.error
    if (error.message)
      return error.message
    if (error.code === 'ECONNABORTED')
      return '请求超时，请稍后重试'
    if (error.code === 'ERR_NETWORK')
      return '网络异常，请稍后重试'
  }
  if (error instanceof Error)
    return error.message
  return '请求失败，请稍后重试'
}

export const request = {
  get: <T = unknown>(url: string, config?: Parameters<typeof instance.get>[1]) =>
    instance.get<unknown, T>(url, config),
  post: <T = unknown>(url: string, data?: unknown, config?: Parameters<typeof instance.post>[2]) =>
    instance.post<unknown, T>(url, data, config),
}

export interface StreamErrorEvent {
  type: 'error'
  message: string
}

export async function streamPost(
  url: string,
  body: Record<string, unknown>,
  onEvent: (event: unknown) => void,
): Promise<void> {
  const res = await fetch(`${env.apiBaseUrl}${url}`, {
    method: 'POST',
    headers: { 'Accept': 'text/event-stream', 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    let msg = text
    try {
      const data = JSON.parse(text) as { message?: string, error?: string }
      msg = (data.message ?? data.error ?? text) || `请求失败：${res.status}`
    }
    catch {
      msg = msg || `请求失败：${res.status}`
    }
    toast.error(msg, { position: 'top-center' })
    throw new Error(msg)
  }

  if (!res.body)
    throw new Error('当前浏览器不支持流式响应')

  const reader = res.body.getReader()
  const decoder = new TextDecoder('utf-8')
  let buffer = ''

  while (true) {
    const { value, done } = await reader.read()
    if (done)
      break
    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() ?? ''

    for (const line of lines) {
      if (!line.startsWith('data: '))
        continue
      const raw = line.slice(6).trim()
      if (!raw)
        continue
      if (raw === '[DONE]')
        return
      if (raw === '[ERROR]') {
        toast.error('服务异常，请稍后重试', { position: 'top-center' })
        return
      }
      try {
        const event = JSON.parse(raw) as StreamErrorEvent | Record<string, unknown>
        if (event && typeof event === 'object' && 'type' in event && event.type === 'error' && 'message' in event) {
          toast.error(String((event as StreamErrorEvent).message), { position: 'top-center' })
          return
        }
        onEvent(event)
      }
      catch {
        // 忽略单行解析失败
      }
    }
  }
}

export default instance
