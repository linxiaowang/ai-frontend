export const MessageRole = {
  SYSTEM: 'system',
  USER: 'user',
  ASSISTANT: 'assistant',
} as const

export type Role = typeof MessageRole[keyof typeof MessageRole]

export interface Message {
  id: string
  role: Role
  content: string
  createdAt: number
}

export interface Session {
  id: string
  messages: Message[]
  createdAt: number
  updatedAt: number
}
