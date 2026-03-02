import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { ErrorBoundary } from './components/ErrorBoundary'
import { Toaster } from './components/ui/sonner'
import './styles/index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <Toaster />
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
