import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { SessionUser } from '../../hooks/useAuthSession'
import RoomForm from './RoomForm'
import type { ChatMessage, MeetingRoom } from './types'
import './ChatRoom.css'

const DEMO_MESSAGES: ChatMessage[] = [
  {
    id: '1',
    senderId: 'demo-user-1',
    senderNickname: '달리는곰',
    content: '오늘 러닝 몇 시에 나갈 예정이에요?',
    sentAt: Date.now() - 1000 * 60 * 10,
  },
  {
    id: '2',
    senderId: 'demo-user-2',
    senderNickname: '새벽러너',
    content: '저는 6시 한강공원 앞에서 출발할 생각이에요!',
    sentAt: Date.now() - 1000 * 60 * 8,
  },
  {
    id: '3',
    senderId: 'demo-user-1',
    senderNickname: '달리는곰',
    content: '6시 좋네요 ㄱㄱ',
    sentAt: Date.now() - 1000 * 60 * 7,
  },
]

const formatTime = (ts: number) => {
  const d = new Date(ts)
  const h = d.getHours()
  const m = d.getMinutes().toString().padStart(2, '0')
  return `${h < 12 ? '오전' : '오후'} ${h % 12 || 12}:${m}`
}

interface ChatRoomProps {
  currentUser: SessionUser
  onLeave?: () => void
  onRoomUpdate?: (data: { name: string; description: string }) => void
  room: MeetingRoom
}

export default function ChatRoom({ currentUser, onLeave, onRoomUpdate, room }: ChatRoomProps) {
  const navigate = useNavigate()
  const [messages, setMessages] = useState<ChatMessage[]>(DEMO_MESSAGES)
  const [input, setInput] = useState('')
  const [connected, setConnected] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const isOwner = room.creatorId === currentUser.id

  // TODO: replace with real WebSocket
  useEffect(() => {
    const t = setTimeout(() => setConnected(true), 600)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Close menu on outside click
  useEffect(() => {
    if (!showMenu) return
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [showMenu])

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
    const ta = e.target
    ta.style.height = 'auto'
    ta.style.height = `${Math.min(ta.scrollHeight, 96)}px`
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !('ontouchstart' in window)) {
      e.preventDefault()
      sendMessage()
    }
  }

  const sendMessage = () => {
    const content = input.trim()
    if (!content) return
    const msg: ChatMessage = {
      id: String(Date.now()),
      senderId: currentUser.id,
      senderNickname: currentUser.nickname,
      content,
      sentAt: Date.now(),
    }
    // TODO: send via WebSocket
    setMessages((prev) => [...prev, msg])
    setInput('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
  }

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
        {/* Header */}
        <div className="ChatRoom__header">
          <button
            aria-label="뒤로가기"
            className="ChatRoom__backBtn"
            onClick={() => navigate('/meeting')}
            type="button"
          >
            <svg aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
              <path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div className="ChatRoom__headerCenter">
            <strong className="ChatRoom__roomName">{room.name}</strong>
            <span className={`ChatRoom__status ${connected ? 'is-connected' : ''}`}>
              {connected ? '연결됨' : '연결 중…'}
            </span>
          </div>

          <div className="ChatRoom__headerRight" ref={menuRef}>
            {isOwner ? (
              <button
                aria-label="방 설정"
                className="ChatRoom__menuBtn"
                onClick={() => setShowMenu((v) => !v)}
                type="button"
              >
                <svg aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="5" r="1.5" />
                  <circle cx="12" cy="12" r="1.5" />
                  <circle cx="12" cy="19" r="1.5" />
                </svg>
              </button>
            ) : (
              <button
                className="ChatRoom__leaveBtn"
                onClick={handleLeave}
                type="button"
              >
                나가기
              </button>
            )}

            {showMenu && (
              <div className="ChatRoom__menu">
                <button
                  className="ChatRoom__menuItem"
                  onClick={() => { setShowMenu(false); setShowEditForm(true) }}
                  type="button"
                >
                  <svg aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5Z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  방 수정
                </button>
                <button
                  className="ChatRoom__menuItem ChatRoom__menuItem--danger"
                  onClick={handleLeave}
                  type="button"
                >
                  <svg aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path d="M3 6h18M8 6V4h8v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  방 나가기
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="ChatRoom__messages">
          {messages.map((msg, index) => {
            const isOwn = msg.senderId === currentUser.id
            const prevMsg = messages[index - 1]
            const nextMsg = messages[index + 1]
            const showSender = !isOwn && msg.senderId !== prevMsg?.senderId
            const isGroupEnd = !nextMsg || nextMsg.senderId !== msg.senderId

            return (
              <div
                key={msg.id}
                className={[
                  'ChatMessage',
                  isOwn ? 'ChatMessage--mine' : 'ChatMessage--other',
                  isGroupEnd ? 'ChatMessage--end' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                {showSender && (
                  <span className="ChatMessage__sender">{msg.senderNickname}</span>
                )}
                <div className="ChatMessage__row">
                  <div className="ChatMessage__bubble">{msg.content}</div>
                  {isGroupEnd && (
                    <span className="ChatMessage__time">{formatTime(msg.sentAt)}</span>
                  )}
                </div>
              </div>
            )
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Composer */}
        <div className="ChatRoom__composer">
          <textarea
            ref={textareaRef}
            className="ChatRoom__input"
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder="메시지를 입력하세요"
            rows={1}
            value={input}
          />
          <button
            aria-label="전송"
            className={`ChatRoom__send ${input.trim() ? 'is-active' : ''}`}
            disabled={!input.trim()}
            onClick={sendMessage}
            type="button"
          >
            <svg aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3.4 2.8 21.6 11a1 1 0 0 1 0 1.8L3.4 20.8a1 1 0 0 1-1.4-.8l.8-6.1L18 12 2.8 8.6 2 2.6a1 1 0 0 1 1.4-.8Z" />
            </svg>
          </button>
        </div>
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
