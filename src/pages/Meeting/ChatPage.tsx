import { useEffect } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import ChatRoom from './ChatRoom'
import type { MeetingRoom } from './types'

export default function ChatPage() {
  const { roomId } = useParams<{ roomId: string }>()
  const { state } = useLocation()
  const { isAuthenticated, user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated) navigate('/meeting', { replace: true })
  }, [isAuthenticated, navigate])

  if (!isAuthenticated || !user || !roomId) return null

  // Room data comes from navigation state; falls back to a stub when accessed directly
  const room: MeetingRoom = (state as { room?: MeetingRoom } | null)?.room ?? {
    id: roomId,
    name: '채팅방',
    description: '',
    creatorId: '',
    creatorNickname: '',
    memberCount: 0,
    createdAt: Date.now(),
    isJoined: true,
  }

  return (
    <ChatRoom
      currentUser={user}
      onLeave={() => navigate('/meeting')}
      room={room}
    />
  )
}
