import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AdaptiveDiv from '../../components/AdaptiveDiv'
import AuthRequiredCard from '../../components/AuthRequiredCard'
import Header from '../../components/Header'
import { useAuth } from '../../contexts/AuthContext'
import { meetingCopy } from '../../tools/pageText'
import RoomCard from './RoomCard'
import RoomForm from './RoomForm'
import type { MeetingRoom } from './types'
import './index.css'

const INITIAL_ROOMS: MeetingRoom[] = [
  {
    id: 'room-demo-1',
    name: '한강 새벽런',
    description: '매일 오전 6시 한강공원 앞에서 출발해요. 페이스는 6분대 목표!',
    creatorId: 'demo-user-1',
    creatorNickname: '달리는곰',
    memberCount: 5,
    createdAt: Date.now() - 1000 * 60 * 60 * 3,
    isJoined: false,
  },
  {
    id: 'room-demo-2',
    name: '주말 10km 챌린지',
    description: '주말마다 함께 10km 달리기. 실력 무관 환영!',
    creatorId: 'demo-user-2',
    creatorNickname: '새벽러너',
    memberCount: 12,
    createdAt: Date.now() - 1000 * 60 * 60 * 24,
    isJoined: false,
  },
]

export default function MeetingPage() {
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuth()
  const [rooms, setRooms] = useState<MeetingRoom[]>(INITIAL_ROOMS)
  const [showForm, setShowForm] = useState(false)
  const [editingRoom, setEditingRoom] = useState<MeetingRoom | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

  if (!isAuthenticated || !user) {
    return (
      <AdaptiveDiv className="MeetingPage" type="center">
        <Header variant="page" subtitle={meetingCopy.subtitle} title={meetingCopy.title} />
        <AuthRequiredCard
          description="모임 기능은 로그인 후 사용할 수 있습니다."
          onLogin={() => navigate('/auth')}
          title="로그인이 필요합니다."
        />
      </AdaptiveDiv>
    )
  }

  const handleCreate = (data: { name: string; description: string }) => {
    const newRoom: MeetingRoom = {
      id: `room-${Date.now()}`,
      name: data.name,
      description: data.description,
      creatorId: user.id,
      creatorNickname: user.nickname,
      memberCount: 1,
      createdAt: Date.now(),
      isJoined: true,
    }
    setRooms((prev) => [newRoom, ...prev])
    setShowForm(false)
  }

  const handleEdit = (data: { name: string; description: string }) => {
    if (!editingRoom) return
    setRooms((prev) =>
      prev.map((r) =>
        r.id === editingRoom.id ? { ...r, name: data.name, description: data.description } : r,
      ),
    )
    setEditingRoom(null)
    setShowForm(false)
  }

  const handleDelete = (roomId: string) => {
    setRooms((prev) => prev.filter((r) => r.id !== roomId))
    setDeleteConfirmId(null)
  }

  const handleToggleJoin = (roomId: string) => {
    setRooms((prev) =>
      prev.map((r) =>
        r.id === roomId
          ? { ...r, isJoined: !r.isJoined, memberCount: r.memberCount + (r.isJoined ? -1 : 1) }
          : r,
      ),
    )
  }

  const handleEnter = (room: MeetingRoom) => {
    navigate(`/meeting/${room.id}`, { state: { room } })
  }

  const openEdit = (room: MeetingRoom) => {
    setEditingRoom(room)
    setShowForm(true)
  }

  const closeForm = () => {
    setShowForm(false)
    setEditingRoom(null)
  }

  return (
    <AdaptiveDiv className="MeetingPage" type="center">
      <div className="MeetingPage__header">
        <Header variant="page" subtitle={meetingCopy.subtitle} title={meetingCopy.title} />
        <button
          className="MeetingPage__createBtn"
          onClick={() => setShowForm(true)}
          type="button"
        >
          <svg aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
            <path d="M12 5v14M5 12h14" strokeLinecap="round" />
          </svg>
          방 만들기
        </button>
      </div>

      {rooms.length === 0 ? (
        <div className="MeetingPage__empty">
          <p>아직 모임방이 없어요.</p>
          <p>첫 번째 방을 만들어 함께 달려보세요!</p>
        </div>
      ) : (
        <div className="MeetingPage__list">
          {rooms.map((room) => (
            <div key={room.id}>
              {deleteConfirmId === room.id ? (
                <div className="MeetingPage__deleteConfirm">
                  <p>
                    <strong>{room.name}</strong>을(를) 삭제할까요?
                  </p>
                  <div className="MeetingPage__deleteActions">
                    <button
                      className="MeetingPage__confirmBtn MeetingPage__confirmBtn--cancel"
                      onClick={() => setDeleteConfirmId(null)}
                      type="button"
                    >
                      취소
                    </button>
                    <button
                      className="MeetingPage__confirmBtn MeetingPage__confirmBtn--delete"
                      onClick={() => handleDelete(room.id)}
                      type="button"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              ) : (
                <RoomCard
                  currentUserId={user.id}
                  onDelete={() => setDeleteConfirmId(room.id)}
                  onEdit={() => openEdit(room)}
                  onEnter={() => handleEnter(room)}
                  onToggleJoin={() => handleToggleJoin(room.id)}
                  room={room}
                />
              )}
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <RoomForm
          onClose={closeForm}
          onSubmit={editingRoom ? handleEdit : handleCreate}
          room={editingRoom}
        />
      )}
    </AdaptiveDiv>
  )
}
