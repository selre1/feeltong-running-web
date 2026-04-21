import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AdaptiveDiv from '../../components/AdaptiveDiv'
import AuthRequiredCard from '../../components/AuthRequiredCard'
import Header from '../../components/Header'
import { useAuth } from '../../contexts/AuthContext'
import { meetingCopy } from '../../tools/pageText'
import RoomForm from './RoomForm'
import RoomList from './RoomList'
import type { MeetingRoom } from './types'
import useMeetingRooms from './useMeetingRooms'
import './index.css'

export default function MeetingPage() {
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuth()
  const { rooms, loading, error, refetch, createRoom, updateRoom, deleteRoom, toggleJoin } =
    useMeetingRooms()

  const [showForm, setShowForm] = useState(false)
  const [editingRoom, setEditingRoom] = useState<MeetingRoom | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [opError, setOpError] = useState<string | null>(null)
  const opErrTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const showOpError = (msg: string) => {
    if (opErrTimerRef.current) clearTimeout(opErrTimerRef.current)
    setOpError(msg)
    opErrTimerRef.current = setTimeout(() => setOpError(null), 3000)
  }

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

  const handleCreate = async (data: { name: string; description: string }) => {
    try {
      await createRoom(data)
      setShowForm(false)
    } catch {
      showOpError('방을 만들지 못했습니다.')
    }
  }

  const handleEdit = async (data: { name: string; description: string }) => {
    if (!editingRoom) return
    try {
      await updateRoom(editingRoom.id, data)
      setEditingRoom(null)
      setShowForm(false)
    } catch {
      showOpError('방 수정에 실패했습니다.')
    }
  }

  const handleDelete = async (roomId: string) => {
    try {
      await deleteRoom(roomId)
    } catch {
      showOpError('방 삭제에 실패했습니다.')
    } finally {
      setDeleteConfirmId(null)
    }
  }

  const handleToggleJoin = async (room: MeetingRoom) => {
    try {
      await toggleJoin(room)
    } catch {
      showOpError(room.isJoined ? '방 나가기에 실패했습니다.' : '참여에 실패했습니다.')
    }
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
        <button className="MeetingPage__createBtn" onClick={() => setShowForm(true)} type="button">
          <svg aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
            <path d="M12 5v14M5 12h14" strokeLinecap="round" />
          </svg>
          방 만들기
        </button>
      </div>

      {opError && <p className="MeetingPage__opError">{opError}</p>}

      {loading && <p className="MeetingPage__status">불러오는 중…</p>}

      {error && (
        <div className="MeetingPage__errorRow">
          <p className="MeetingPage__status MeetingPage__status--error">{error}</p>
          <button className="MeetingPage__retryBtn" onClick={refetch} type="button">
            다시 시도
          </button>
        </div>
      )}

      {!loading && !error && rooms.length === 0 && (
        <div className="MeetingPage__empty">
          <p>아직 모임방이 없어요.</p>
          <p>첫 번째 방을 만들어 함께 달려보세요!</p>
        </div>
      )}

      {rooms.length > 0 && (
        <RoomList
          currentUserId={user.id}
          deleteConfirmId={deleteConfirmId}
          rooms={rooms}
          onDelete={setDeleteConfirmId}
          onDeleteCancel={() => setDeleteConfirmId(null)}
          onDeleteConfirm={handleDelete}
          onEdit={openEdit}
          onEnter={handleEnter}
          onToggleJoin={handleToggleJoin}
        />
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
