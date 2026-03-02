import type { StreamChatParams } from './type'
import { streamPost } from '@/api/request'

export async function streamChat(
  params: StreamChatParams,
  onEvent: (event: unknown) => void,
): Promise<void> {
  await streamPost(
    '/api/chat',
    {
      sessionId: params.sessionId ?? '',
      message: params.message,
      userId: params.userId,
    },
    onEvent,
  )
}
