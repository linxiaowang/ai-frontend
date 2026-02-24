import type { ReactNode } from 'react'
import type { ErrorBoundaryProps, FallbackProps } from 'react-error-boundary'
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background px-4">
      <div className="mx-auto max-w-md text-center">
        <div className="mb-8 text-6xl">⚠️</div>
        <h1 className="mb-4 text-2xl font-bold tracking-tight">
          出错了
        </h1>
        <p className="mb-4 text-muted-foreground">
          抱歉，应用遇到了一些问题。
        </p>
        {error != null && (
          <details className="mb-6 text-left">
            <summary className="cursor-pointer text-sm text-muted-foreground">
              查看错误详情
            </summary>
            <pre className="mt-2 overflow-auto rounded-lg bg-muted p-4 text-xs">
              {String(error)}
            </pre>
          </details>
        )}
        <div className="flex justify-center gap-4">
          <button
            type="button"
            onClick={resetErrorBoundary}
            className="rounded-lg bg-primary px-6 py-3 text-primary-foreground transition-colors hover:bg-primary/90"
          >
            重试
          </button>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="rounded-lg border border-input bg-background px-6 py-3 transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            刷新页面
          </button>
        </div>
      </div>
    </div>
  )
}

export function ErrorBoundary({ children, fallback }: Props) {
  const onError: ErrorBoundaryProps['onError'] = (error) => {
    // 可以在这里上报错误到日志服务
    console.error('ErrorBoundary caught an error:', error)
  }

  return (
    <ReactErrorBoundary
      FallbackComponent={fallback ? () => <>{fallback}</> : ErrorFallback}
      onError={onError}
    >
      {children}
    </ReactErrorBoundary>
  )
}
