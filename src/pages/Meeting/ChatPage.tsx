import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import apiClient from '../../hooks/useApi/axios'
import ChatRoom from './ChatRoom'
import type { MeetingRoom } from './types'

export default function ChatPage() {
  const { roomId } = useParams<{ roomId: string }>()
  const { state } = useLocation()
  const { isAuthenticated, user } = useAuth()
  const navigate = useNavigate()

  const [room, setRoom] = useState<MeetingRoom | null>(
    (state as { room?: MeetingRoom } | null)?.room ?? null,
  )

  useEffect(() => {
    if (!isAuthenticated) navigate('/meeting', { replace: true })
  }, [isAuthenticated, navigate])

  // Direct URL access: fetch room info from API
  useEffect(() => {
    if (room || !roomId) return
    apiClient
      .get<MeetingRoom>(`/rooms/${roomId}`)
      .then((res) => setRoom(res.data))
      .catch(() => navigate('/meeting', { replace: true }))
  }, [room, roomId, navigate])

  const handleLeave = async () => {
    await apiClient.post(`/rooms/${roomId}/leave`).catch(() => {})
  }

  const handleRoomUpdate = (data: { name: string; description: string }) => {
    setRoom((prev) => (prev ? { ...prev, ...data } : prev))
  }

  if (!isAuthenticated || !user || !roomId || !room) return null

  return (
    <ChatRoom
      currentUser={user}
      onLeave={handleLeave}
      onRoomUpdate={handleRoomUpdate}
      room={room}
    />
  )
}
