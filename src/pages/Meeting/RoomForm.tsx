import { useEffect, useRef, useState } from 'react'
import type { MeetingRoom } from './types'
import './RoomForm.css'

interface RoomFormProps {
  room?: MeetingRoom | null
  onClose: () => void
  onSubmit: (data: { name: string; description: string }) => void
}

export default function RoomForm({ room, onClose, onSubmit }: RoomFormProps) {
  const isEdit = Boolean(room)
  const [name, setName] = useState(room?.name ?? '')
  const [description, setDescription] = useState(room?.description ?? '')
  const nameRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    nameRef.current?.focus()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    onSubmit({ name: name.trim(), description: description.trim() })
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target !== e.currentTarget) return
    const isDirty = name !== (room?.name ?? '') || description !== (room?.description ?? '')
    if (isDirty && !window.confirm('입력한 내용이 사라집니다. 닫으시겠어요?')) return
    onClose()
  }

  return (
    <div className="RoomForm__backdrop" onClick={handleBackdropClick}>
      <div className="RoomForm__sheet" role="dialog" aria-modal="true">
        <div className="RoomForm__handle" aria-hidden="true" />
        <h2 className="RoomForm__title">{isEdit ? '방 수정' : '방 만들기'}</h2>

        <form className="RoomForm__form" onSubmit={handleSubmit}>
          <div className="RoomForm__field">
            <label className="RoomForm__label" htmlFor="room-name">
              방 이름 <span aria-hidden="true">*</span>
            </label>
            <input
              ref={nameRef}
              className="RoomForm__input"
              id="room-name"
              maxLength={30}
              onChange={(e) => setName(e.target.value)}
              placeholder="예: 한강 새벽런"
              type="text"
              value={name}
            />
          </div>

          <div className="RoomForm__field">
            <label className="RoomForm__label" htmlFor="room-desc">
              소개 <span className="RoomForm__optional">선택</span>
            </label>
            <textarea
              className="RoomForm__input RoomForm__input--textarea"
              id="room-desc"
              maxLength={100}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="모임을 간단하게 소개해주세요"
              rows={3}
              value={description}
            />
          </div>

          <div className="RoomForm__actions">
            <button className="RoomForm__btn RoomForm__btn--cancel" onClick={onClose} type="button">
              취소
            </button>
            <button
              className="RoomForm__btn RoomForm__btn--submit"
              disabled={!name.trim()}
              type="submit"
            >
              {isEdit ? '저장' : '만들기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
