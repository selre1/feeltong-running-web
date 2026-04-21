interface RoomDeleteConfirmProps {
  roomName: string
  onCancel: () => void
  onConfirm: () => void
}

export default function RoomDeleteConfirm({ roomName, onCancel, onConfirm }: RoomDeleteConfirmProps) {
  return (
    <div className="MeetingPage__deleteConfirm">
      <p><strong>{roomName}</strong>을(를) 삭제할까요?</p>
      <div className="MeetingPage__deleteActions">
        <button
          className="MeetingPage__confirmBtn MeetingPage__confirmBtn--cancel"
          onClick={onCancel}
          type="button"
        >
          취소
        </button>
        <button
          className="MeetingPage__confirmBtn MeetingPage__confirmBtn--delete"
          onClick={onConfirm}
          type="button"
        >
          삭제
        </button>
      </div>
    </div>
  )
}
