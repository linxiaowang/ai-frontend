import { lazy } from 'react'
import { createBrowserRouter, Outlet } from 'react-router'
import Loading from '@/components/Loading'

// 懒加载页面组件
const Home = lazy(() => import('@/pages/home'))
const About = lazy(() => import('@/pages/about'))
const NotFound = lazy(() => import('@/pages/404'))
const Chat = lazy(() => import('@/pages/chat'))

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Outlet />,
    children: [
      {
        index: true,
        Component: Home,
        hydrateFallbackElement: <Loading />,
      },
      {
        path: 'about',
        Component: About,
        hydrateFallbackElement: <Loading />,
      },
      {
        path: 'chat',
        Component: Chat,
        hydrateFallbackElement: <Loading />,
      },
      {
        path: '*',
        Component: NotFound,
        hydrateFallbackElement: <Loading />,
      },
    ],
  },
])
