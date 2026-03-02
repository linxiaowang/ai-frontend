import { RouterProvider } from 'react-router'
import { router } from './router'
import { useUserStore } from './store/user'

export default function App() {
  const { userId } = useUserStore()
  if (!userId) {
    const userId = crypto.randomUUID()
    localStorage.setItem('userId', userId)
    useUserStore.setState({ userId })
  }
  return <RouterProvider router={router} />
}
