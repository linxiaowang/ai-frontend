export default function Loading() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center">
      <div className="text-center">
        <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-muted-foreground">加载中...</p>
      </div>
    </div>
  )
}
