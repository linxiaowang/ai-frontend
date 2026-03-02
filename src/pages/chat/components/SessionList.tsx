import type { Session } from '@/types'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface SessionListProps {
  sessions: Session[]
  activeId: string
  onSelect: (session: Session) => void
  onNewChat?: () => void
}

export function SessionList(props: SessionListProps) {
  const { sessions, activeId, onSelect, onNewChat } = props

  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center justify-between border-b px-3 py-2">
        <div>
          <h2 className="text-sm font-semibold">会话列表</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            点击左侧会话继续对话
          </p>
        </div>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={onNewChat}
        >
          新对话
        </Button>
      </header>

      <div className="flex-1 overflow-y-auto">
        <div className="px-2 py-2 space-y-1">
          {sessions.length === 0 && (
            <p className="px-2 py-1 text-xs text-muted-foreground">
              暂无会话，点击右上角开始新对话
            </p>
          )}

          {sessions.map(session => (
            <button
              key={session.id}
              type="button"
              onClick={() => onSelect(session)}
              className={cn(
                'w-full rounded-md px-2 py-1.5 text-left text-sm transition-colors',
                'hover:bg-muted',
                activeId === session.id && 'bg-muted',
              )}
            >
              <div className="truncate font-medium">
                {session.name || '未命名会话'}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
