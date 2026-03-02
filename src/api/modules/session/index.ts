import type { Session } from './type'
import { request } from '@/api/request'

export async function getSessions(userId: string): Promise<Session[]> {
  const data = await request.get<{ sessions: Session[] }>('/api/sessions', {
    params: { userId },
  })
  return data.sessions
}
