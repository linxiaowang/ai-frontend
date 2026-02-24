import type { FormEvent } from 'react'
import { useEffect, useRef, useState } from 'react'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3030'
const CHAT_URL = `${API_BASE}/api/chat`

type Role = 'user' | 'assistant'

interface Message {
  id: string
  role: Role
  content: string
}

const createId = () => Math.random().toString(36).slice(2)

const SESSION_STORAGE_KEY = 'chat_session_id'

function createNewSessionId() {
  if (typeof window === 'undefined')
    return createId()

  const id = (window.crypto?.randomUUID && window.crypto.randomUUID()) || createId()
  window.localStorage.setItem(SESSION_STORAGE_KEY, id)
  return id
}

function loadInitialSessionId() {
  if (typeof window === 'undefined')
    return createId()

  const stored = window.localStorage.getItem(SESSION_STORAGE_KEY)
  if (stored)
    return stored

  return createNewSessionId()
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: createId(),
    role: 'assistant',
    content: '你好，我是你的 AI 助手，有什么可以帮你？',
  },
]

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES)
  const [input, setInput] = useState('')
  const [sessionId, setSessionId] = useState<string>(() => loadInitialSessionId())
  const [isStreaming, setIsStreaming] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const question = input.trim()

    if (!question || isStreaming)
      return

    setInput('')

    const userMessage: Message = {
      id: createId(),
      role: 'user',
      content: question,
    }

    const assistantMessage: Message = {
      id: createId(),
      role: 'assistant',
      content: '',
    }

    setMessages(prev => [...prev, userMessage, assistantMessage])
    setIsStreaming(true)

    try {
      const response = await fetch(CHAT_URL, {
        method: 'POST',
        headers: {
          Accept: 'text/event-stream',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          message: question,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text().catch(() => '')
        const errorMessage = errorText || `请求失败：${response.status}`

        setMessages(prev =>
          prev.map(message =>
            message.id === assistantMessage.id
              ? { ...message, content: errorMessage }
              : message,
          ),
        )
        return
      }

      if (!response.body)
        throw new Error('当前浏览器不支持流式响应')

      const reader = response.body.getReader()
      const decoder = new TextDecoder('utf-8')

      let done = false

      while (!done) {
        const { value, done: doneReading } = await reader.read()
        done = doneReading

        if (!value)
          continue

        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (!line.startsWith('data: '))
            continue

          const data = line.slice(6).trim()
          if (!data)
            continue

          if (data === '[DONE]') {
            done = true
            break
          }

          if (data === '[ERROR]') {
            setMessages(prev =>
              prev.map(message =>
                message.id === assistantMessage.id
                  ? {
                      ...message,
                      content: '请求出错了，请稍后重试。',
                    }
                  : message,
              ),
            )
            done = true
            break
          }

          setMessages(prev =>
            prev.map(message =>
              message.id === assistantMessage.id
                ? { ...message, content: message.content + data }
                : message,
            ),
          )
        }
      }
    }
    catch (error) {
      console.error(error)
      setMessages(prev =>
        prev.map(message =>
          message.id === assistantMessage.id
            ? {
                ...message,
                content: '请求出错了，请稍后重试。',
              }
            : message,
        ),
      )
    }
    finally {
      setIsStreaming(false)
    }
  }

  function handleNewChat() {
    if (isStreaming)
      return

    const newId = createNewSessionId()
    setSessionId(newId)
    setMessages(INITIAL_MESSAGES)
    setInput('')
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] items-center justify-center px-4">
      <div className="flex h-full w-full max-w-2xl flex-col rounded-lg border bg-background p-4 shadow-sm">
        <header className="mb-4 flex items-center justify-between border-b pb-3 gap-2">
          <div>
            <h1 className="text-lg font-semibold">AI 聊天</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              使用右下方输入框向 AI 提问，回答将以流式方式显示。
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleNewChat}
            disabled={isStreaming}
          >
            新对话
          </Button>
        </header>

        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {messages.map((message) => {
            const isUser = message.role === 'user'

            return (
              <div
                key={message.id}
                className={cn(
                  'flex gap-3',
                  isUser ? 'justify-end text-right' : 'justify-start',
                )}
              >
                {!isUser && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                )}

                <div
                  className={cn(
                    'max-w-[80%] rounded-lg px-3 py-2 text-sm whitespace-pre-wrap',
                    isUser
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-foreground',
                  )}
                >
                  {message.content
                    || (!isUser && isStreaming && 'AI 正在思考中…')}
                </div>

                {isUser && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>我</AvatarFallback>
                  </Avatar>
                )}
              </div>
            )
          })}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
          <Input
            value={input}
            onChange={event => setInput(event.target.value)}
            placeholder="请输入你的问题，然后回车发送…"
            disabled={isStreaming}
          />
          <Button
            type="submit"
            disabled={!input.trim() || isStreaming}
          >
            {isStreaming ? '回答中…' : '发送'}
          </Button>
        </form>
      </div>
    </div>
  )
}
