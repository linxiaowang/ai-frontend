import { Link } from 'react-router'

export default function NotFound() {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background px-4">
      <div className="mx-auto max-w-md text-center">
        <div className="mb-8 text-9xl font-bold text-muted-foreground/20">
          404
        </div>
        <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
          页面未找到
        </h1>
        <p className="mb-8 text-lg text-muted-foreground">
          抱歉，我们无法找到您要访问的页面。
        </p>
        <div className="flex justify-center gap-4">
          <Link
            to="/"
            className="rounded-lg bg-primary px-6 py-3 text-primary-foreground transition-colors hover:bg-primary/90"
          >
            返回首页
          </Link>
        </div>
      </div>
    </div>
  )
}
