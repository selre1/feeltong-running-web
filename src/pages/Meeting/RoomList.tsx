import RoomCard from './RoomCard'
import RoomDeleteConfirm from './RoomDeleteConfirm'
import type { MeetingRoom } from './types'

interface RoomListProps {
  currentUserId: string
  deleteConfirmId: string | null
  rooms: MeetingRoom[]
  onDelete: (roomId: string) => void
  onDeleteCancel: () => void
  onDeleteConfirm: (roomId: string) => void
  onEdit: (room: MeetingRoom) => void
  onEnter: (room: MeetingRoom) => void
  onToggleJoin: (room: MeetingRoom) => void
}

export default function RoomList({
  currentUserId,
  deleteConfirmId,
  rooms,
  onDelete,
  onDeleteCancel,
  onDeleteConfirm,
  onEdit,
  onEnter,
  onToggleJoin,
}: RoomListProps) {
  return (
    <div className="MeetingPage__list">
      {rooms.map((room) =>
        deleteConfirmId === room.id ? (
          <RoomDeleteConfirm
            key={room.id}
            roomName={room.name}
            onCancel={onDeleteCancel}
            onConfirm={() => onDeleteConfirm(room.id)}
          />
        ) : (
          <RoomCard
            currentUserId={currentUserId}
            key={room.id}
            onDelete={() => onDelete(room.id)}
            onEdit={() => onEdit(room)}
            onEnter={() => onEnter(room)}
            onToggleJoin={() => onToggleJoin(room)}
            room={room}
          />
        ),
      )}
    </div>
  )
}
