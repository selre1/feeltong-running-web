import { useState } from 'react'
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
  onLeave?: () => void
  onRoomUpdate?: (data: { name: string; description: string }) => void
  room: MeetingRoom
}

export default function ChatRoom({ currentUser, onLeave, onRoomUpdate, room }: ChatRoomProps) {
  const navigate = useNavigate()
  const {
    messages,
    connected,
    onlineCount,
    typers,
    hasMore,
    loadingMore,
    sendMessage,
    sendTyping,
    loadMore,
  } = useChatRoom(room.id)
  const [showEditForm, setShowEditForm] = useState(false)

  const isOwner = room.creatorId === currentUser.id
  const typingNicknames = [...typers.values()]

  const handleLeave = () => {
    onLeave?.()
    navigate('/meeting')
  }

  const handleEditSubmit = (data: { name: string; description: string }) => {
    onRoomUpdate?.(data)
    setShowEditForm(false)
  }

  return (
    <>
      <div className="ChatRoom">
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
