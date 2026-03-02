export const MessageRole = {
  SYSTEM: 'system',
  USER: 'user',
  ASSISTANT: 'assistant',
} as const

export type Role = typeof MessageRole[keyof typeof MessageRole]

export type AgentEvent
  = | {
    type: 'thought'
    content: string
  }
  | {
    type: 'tool_call'
    name: string
    args: any
  }
  | {
    type: 'tool_result'
    content: any
  }
  | {
    type: 'text'
    content: string
  }
  | {
    type: 'session_created'
    sessionId: string
    sessionName: string
  }
  | {
    type: 'session_title_updated'
    sessionId: string
    sessionName: string
  }

export interface Message {
  id: string
  role: Role
  content: AgentEvent[]
}

export interface Session {
  id: string
  name: string
  messages: Message[]
  createdAt: number
  updatedAt: number
}
