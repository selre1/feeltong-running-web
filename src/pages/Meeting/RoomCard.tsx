import type { MeetingRoom } from './types'
import './RoomCard.css'

interface RoomCardProps {
  currentUserId: string
  onDelete: () => void
  onEdit: () => void
  onEnter: () => void
  onToggleJoin: () => void
  room: MeetingRoom
}

const formatDate = (timestamp: number) => {
  const diff = Date.now() - timestamp
  const minutes = Math.floor(diff / 60000)
  if (minutes < 60) return `${minutes}분 전`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}시간 전`
  return `${Math.floor(hours / 24)}일 전`
}

export default function RoomCard({
  currentUserId,
  onDelete,
  onEdit,
  onEnter,
  onToggleJoin,
  room,
}: RoomCardProps) {
  const isOwner = room.creatorId === currentUserId

  return (
    <div className="RoomCard">
      <div className="RoomCard__top">
        <div className="RoomCard__meta">
          <h3 className="RoomCard__name">{room.name}</h3>
          <div className="RoomCard__badges">
            {room.isJoined && (
              <span className="RoomCard__badge RoomCard__badge--joined">참여 중</span>
            )}
            {isOwner && (
              <span className="RoomCard__badge RoomCard__badge--owner">방장</span>
            )}
          </div>
        </div>
        <div className="RoomCard__memberCount" aria-label={`${room.memberCount}명 참여 중`}>
          <svg aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm8 0a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM9.06 10.5c.07-.14.14-.28.22-.42A5 5 0 0 0 1 15h8a5 5 0 0 0 .06-4.5ZM15 10a5 5 0 0 1 5 5h-8a4.98 4.98 0 0 0-.98-3A5 5 0 0 1 15 10Z" />
          </svg>
          {room.memberCount}
        </div>
      </div>

      {room.description ? (
        <p className="RoomCard__description">{room.description}</p>
      ) : null}

      <div className="RoomCard__footer">
        <span className="RoomCard__creator">
          {room.creatorNickname} · {formatDate(room.createdAt)}
        </span>

        <div className="RoomCard__actions">
          {isOwner && (
            <>
              <button
                aria-label="방 수정"
                className="RoomCard__iconBtn"
                onClick={onEdit}
                type="button"
              >
                <svg aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5Z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button
                aria-label="방 삭제"
                className="RoomCard__iconBtn RoomCard__iconBtn--danger"
                onClick={onDelete}
                type="button"
              >
                <svg aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M3 6h18M8 6V4h8v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </>
          )}

          {room.isJoined ? (
            <button className="RoomCard__btn RoomCard__btn--enter" onClick={onEnter} type="button">
              입장
            </button>
          ) : (
            <button className="RoomCard__btn RoomCard__btn--join" onClick={onToggleJoin} type="button">
              참여하기
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
