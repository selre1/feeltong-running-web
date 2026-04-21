import { useEffect, useLayoutEffect, useRef } from 'react'
import type { ChatMessage } from './types'

interface ChatMessageListProps {
  currentUserId: string
  hasMore: boolean
  loadingMore: boolean
  messages: ChatMessage[]
  typers: string[]
  onLoadMore: () => void
}

const formatTime = (ts: number) => {
  const d = new Date(ts)
  const h = d.getHours()
  const m = d.getMinutes().toString().padStart(2, '0')
  const hour = (h % 12 || 12).toString().padStart(2, '0')
  return `${h < 12 ? '오전' : '오후'} ${hour}:${m}`
}

export default function ChatMessageList({
  currentUserId,
  hasMore,
  loadingMore,
  messages,
  typers,
  onLoadMore,
}: ChatMessageListProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const savedScrollHeightRef = useRef(0)
  const wasLoadingMoreRef = useRef(false)

  // Restore scroll position after messages are prepended
  useEffect(() => {
    if (wasLoadingMoreRef.current && !loadingMore) {
      const container = containerRef.current
      if (container && savedScrollHeightRef.current) {
        container.scrollTop = container.scrollHeight - savedScrollHeightRef.current
        savedScrollHeightRef.current = 0
      }
    }
    wasLoadingMoreRef.current = loadingMore
  }, [loadingMore])

  // Auto-scroll to bottom for new messages only if already near bottom
  useLayoutEffect(() => {
    if (loadingMore) return
    const container = containerRef.current
    if (!container) return
    const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 120
    if (isNearBottom) container.scrollTop = container.scrollHeight
  }, [messages, loadingMore])

  const handleScroll = () => {
    const container = containerRef.current
    if (!container || !hasMore || loadingMore) return
    if (container.scrollTop < 60) {
      savedScrollHeightRef.current = container.scrollHeight
      onLoadMore()
    }
  }

  return (
    <div ref={containerRef} className="ChatRoom__messages" onScroll={handleScroll}>
      {loadingMore && <div className="ChatRoom__loadingMore">불러오는 중…</div>}

      {messages.map((msg, index) => {
        const isOwn = msg.senderId === currentUserId
        const prevMsg = messages[index - 1]
        const nextMsg = messages[index + 1]
        const showSender = !isOwn && msg.senderId !== prevMsg?.senderId
        const isGroupEnd = !nextMsg || nextMsg.senderId !== msg.senderId

        return (
          <div
            key={msg.id}
            className={[
              'ChatMessage',
              isOwn ? 'ChatMessage--mine' : 'ChatMessage--other',
              isGroupEnd ? 'ChatMessage--end' : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {showSender && <span className="ChatMessage__sender">{msg.senderNickname}</span>}
            <div className="ChatMessage__row">
              <div className="ChatMessage__bubble">{msg.content}</div>
              {isGroupEnd && <span className="ChatMessage__time">{formatTime(msg.sentAt)}</span>}
            </div>
          </div>
        )
      })}

      {typers.length > 0 && (
        <div className="ChatRoom__typing">
          <span className="ChatRoom__typingDots">
            <span />
            <span />
            <span />
          </span>
          <span className="ChatRoom__typingText">
            {typers.length === 1
              ? `${typers[0]}님이 입력 중`
              : `${typers[0]} 외 ${typers.length - 1}명이 입력 중`}
          </span>
        </div>
      )}
    </div>
  )
}
