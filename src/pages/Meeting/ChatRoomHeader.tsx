import { useEffect, useRef, useState } from 'react'
import type { MeetingRoom } from './types'

interface ChatRoomHeaderProps {
  connected: boolean
  isOwner: boolean
  onlineCount: number
  room: MeetingRoom
  onBack: () => void
  onEditRoom: () => void
  onLeave: () => void
}

export default function ChatRoomHeader({
  connected,
  isOwner,
  onlineCount,
  room,
  onBack,
  onEditRoom,
  onLeave,
}: ChatRoomHeaderProps) {
  const [showMenu, setShowMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!showMenu) return
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setShowMenu(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [showMenu])

  const statusLabel = connected
    ? onlineCount > 0
      ? `온라인 ${onlineCount}명`
      : '연결됨'
    : '연결 중…'

  return (
    <div className="ChatRoom__header">
      <button aria-label="뒤로가기" className="ChatRoom__backBtn" onClick={onBack} type="button">
        <svg aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
          <path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div className="ChatRoom__headerCenter">
        <strong className="ChatRoom__roomName">{room.name}</strong>
        <span className={`ChatRoom__status ${connected ? 'is-connected' : ''}`}>{statusLabel}</span>
      </div>

      <div className="ChatRoom__headerRight" ref={menuRef}>
        {isOwner ? (
          <button
            aria-label="방 설정"
            className="ChatRoom__menuBtn"
            onClick={() => setShowMenu((v) => !v)}
            type="button"
          >
            <svg aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="5" r="1.5" />
              <circle cx="12" cy="12" r="1.5" />
              <circle cx="12" cy="19" r="1.5" />
            </svg>
          </button>
        ) : (
          <button className="ChatRoom__leaveBtn" onClick={onLeave} type="button">
            나가기
          </button>
        )}

        {showMenu && (
          <div className="ChatRoom__menu">
            <button
              className="ChatRoom__menuItem"
              onClick={() => { setShowMenu(false); onEditRoom() }}
              type="button"
            >
              <svg aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5Z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              방 수정
            </button>
            <button
              className="ChatRoom__menuItem ChatRoom__menuItem--danger"
              onClick={() => { setShowMenu(false); onLeave() }}
              type="button"
            >
              <svg aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              방 나가기
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
