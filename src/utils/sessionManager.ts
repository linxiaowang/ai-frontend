import type { Message, Session } from '@/types'

const sessions = new Map<string, Session>()

export function getSession(id: string): Session {
  if (!sessions.has(id)) {
    sessions.set(id, {
      id,
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    })
  }
  return sessions.get(id)!
}

export function appendMessage(sessionId: string, message: Message) {
  const session = getSession(sessionId)
  session.messages.push(message)
  session.updatedAt = Date.now()
}
