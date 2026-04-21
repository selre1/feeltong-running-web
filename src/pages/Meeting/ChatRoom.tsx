import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { SessionUser } from '../../hooks/useAuthSession'
import ChatComposer from './ChatComposer'
import ChatMessageList from './ChatMessageList'
import ChatRoomHeader from './ChatRoomHeader'
import RoomForm from './RoomForm'
import type { MeetingRoom } from './types'
import useChatRoom from './useChatRoom'
import './ChatRoom.css'

interface ChatRoomProps {
  currentUser: SessionUser
  onLeave?: () => Promise<void> | void
  onRoomUpdate?: (data: { name: string; description: string }) => void
  room: MeetingRoom
}

export default function ChatRoom({ currentUser, onLeave, onRoomUpdate, room }: ChatRoomProps) {
  const navigate = useNavigate()
  const containerRef = useRef<HTMLDivElement>(null)
  const {
    messages,
    connected,
    onlineCount,
    sessionExpired,
    typers,
    hasMore,
    loadingMore,
    sendMessage,
    sendTyping,
    loadMore,
  } = useChatRoom(room.id)
  const [showEditForm, setShowEditForm] = useState(false)

  useEffect(() => {
    if (sessionExpired) navigate('/auth')
  }, [sessionExpired, navigate])

  // 모바일 가상 키보드 대응: visualViewport 기반으로 bottom 조정
  useEffect(() => {
    const el = containerRef.current
    const vv = window.visualViewport
    if (!el || !vv) return

    const baseHeight = vv.height

    const sync = () => {
      const keyboardOpen = vv.height < baseHeight - 50
      if (keyboardOpen) {
        // 키보드가 올라온 경우: 네비게이션 여백 제거, 키보드 바로 위까지 확장
        el.style.bottom = '0px'
      } else {
        // 키보드 없음: CSS 기본값으로 복원
        el.style.bottom = ''
      }
    }

    vv.addEventListener('resize', sync)
    vv.addEventListener('scroll', sync)
    sync()

    return () => {
      vv.removeEventListener('resize', sync)
      vv.removeEventListener('scroll', sync)
      el.style.bottom = ''
    }
  }, [])

  const isOwner = room.creatorId === currentUser.id
  const typingNicknames = [...typers.values()]

  const handleLeave = async () => {
    await onLeave?.()
    navigate('/meeting')
  }

  const handleEditSubmit = (data: { name: string; description: string }) => {
    onRoomUpdate?.(data)
    setShowEditForm(false)
  }

  return (
    <>
      <div ref={containerRef} className="ChatRoom">
        <ChatRoomHeader
          connected={connected}
          isOwner={isOwner}
          onlineCount={onlineCount}
          room={room}
          onBack={() => navigate('/meeting')}
          onEditRoom={() => setShowEditForm(true)}
          onLeave={handleLeave}
        />
        <ChatMessageList
          currentUserId={currentUser.id}
          hasMore={hasMore}
          loadingMore={loadingMore}
          messages={messages}
          typers={typingNicknames}
          onLoadMore={loadMore}
        />
        <ChatComposer onSend={sendMessage} onTyping={sendTyping} />
      </div>

      {showEditForm && (
        <RoomForm
          onClose={() => setShowEditForm(false)}
          onSubmit={handleEditSubmit}
          room={room}
        />
      )}
    </>
  )
}
