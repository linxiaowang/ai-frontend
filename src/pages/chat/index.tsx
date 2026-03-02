import type { FormEvent } from 'react'
import type { Message, Session } from '@/types'

import { useMount } from 'ahooks'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { getSessions, streamChat } from '@/api'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { useUserId } from '@/store/user'
import { SessionList } from './components/SessionList'

const createId = () => Math.random().toString(36).slice(2)

const SESSION_STORAGE_KEY = 'chat_session_id'

function loadInitialSessionId() {
  const stored = window.localStorage.getItem(SESSION_STORAGE_KEY)
  if (stored)
    return stored

  return ''
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: createId(),
    role: 'assistant',
    content: [{ type: 'text', content: '你好，我是你的 AI 助手，有什么可以帮你？' }],
  },
]

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES)
  const [input, setInput] = useState('')
  const [sessionId, setSessionId] = useState<string>(() => loadInitialSessionId())
  const [isStreaming, setIsStreaming] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const userId = useUserId()
  const [sessions, setSessions] = useState<Session[]>([])

  const activeSession = sessions.find(session => session.id === sessionId)
  const sessionTitle = activeSession?.name || 'AI 聊天'

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
      content: [{ type: 'text', content: question }],
    }

    const assistantMessage: Message = {
      id: createId(),
      role: 'assistant',
      content: [{ type: 'text', content: '' }],
    }

    setMessages(prev => [...prev, userMessage, assistantMessage])
    setIsStreaming(true)

    try {
      await streamChat(
        { sessionId: sessionId || undefined, message: question, userId },
        (json: unknown) => {
          const event = json as { type?: string, sessionId?: string, sessionName?: string, content?: string }
          if (event?.type === 'text' && event.content !== undefined) {
            setMessages(prev =>
              prev.map(message =>
                message.id === assistantMessage.id
                  ? { ...message, content: [...message.content, { type: 'text', content: event.content! }] }
                  : message,
              ),
            )
          }
          if (event?.type === 'session_created' && event.sessionId) {
            setSessionId(event.sessionId)
            window.localStorage.setItem(SESSION_STORAGE_KEY, event.sessionId)
            setSessions((prev) => {
              const exists = prev.some(session => session.id === event.sessionId)
              if (exists)
                return prev
              const next: Session = {
                id: event.sessionId!,
                name: event.sessionName ?? '新对话',
                messages: [],
                createdAt: Date.now(),
                updatedAt: Date.now(),
              }
              return [...prev, next]
            })
          }
          if (event?.type === 'session_title_updated' && event.sessionId) {
            setSessions(prev =>
              prev.map(session =>
                session.id === event.sessionId
                  ? { ...session, name: event.sessionName ?? session.name, updatedAt: Date.now() }
                  : session,
              ),
            )
          }
        },
      )
    }
    catch {
      toast.error('请求出错了，请稍后重试。', { position: 'top-center' })
      setMessages(prev =>
        prev.map(message =>
          message.id === assistantMessage.id
            ? { ...message, content: [{ type: 'text', content: '请求出错了，请稍后重试。' }] }
            : message,
        ),
      )
    }
    finally {
      setIsStreaming(false)
    }
  }

  useMount(async () => {
    try {
      const list = await getSessions(userId)
      setSessions(list)
    }
    catch {
      // 错误已由 request 层 toast
    }
  })

  function handleNewChat() {
    if (isStreaming)
      return

    setSessionId('')
    window.localStorage.removeItem(SESSION_STORAGE_KEY)
    setMessages(INITIAL_MESSAGES)
    setInput('')
  }

  function handleSelectSession(session: Session) {
    if (isStreaming)
      return

    setSessionId(session.id)
    window.localStorage.setItem(SESSION_STORAGE_KEY, session.id)
    setMessages(session.messages)
    setInput('')
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] px-4 gap-4">
      <div className="h-full w-64 rounded-lg border bg-background">
        <SessionList
          sessions={sessions}
          activeId={sessionId}
          onSelect={handleSelectSession}
          onNewChat={handleNewChat}
        />
      </div>

      <div className="flex h-full flex-1 flex-col rounded-lg border bg-background p-4 shadow-sm">
        <header className="mb-4 flex items-center justify-between border-b pb-3 gap-2">
          <div>
            <h1 className="text-lg font-semibold">{sessionTitle}</h1>
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
                  {message.content && message.content.length > 0
                    ? message.content.map((event) => {
                        if (event.type === 'text') {
                          return event.content
                        }
                        return null
                      })
                    : (!isUser && isStreaming && 'AI 正在思考中…')}
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
