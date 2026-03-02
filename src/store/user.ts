import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface UserState {
  userId: string
}

export const useUserStore = create<UserState>()(
  devtools(
    persist(
      () => ({
        userId: '',
      }),
      {
        name: 'user-storage',
      },
    ),
  ),
)

export const useUserId = () => useUserStore(state => state.userId)
