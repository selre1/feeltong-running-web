import { useRef, useState } from 'react'
import useDeviceType from '../../hooks/useDeviceType'

interface ChatComposerProps {
  onSend: (content: string) => void
  onTyping?: () => void
}

export default function ChatComposer({ onSend, onTyping }: ChatComposerProps) {
  const [input, setInput] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const lastTypingRef = useRef(0)
  const deviceType = useDeviceType()

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
    const ta = e.target
    ta.style.height = 'auto'
    ta.style.height = `${Math.min(ta.scrollHeight, 96)}px`

    const now = Date.now()
    if (onTyping && now - lastTypingRef.current > 2000) {
      onTyping()
      lastTypingRef.current = now
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && deviceType === 'desktop') {
      e.preventDefault()
      handleSend()
    }
  }

  const handleSend = () => {
    const content = input.trim()
    if (!content) return
    onSend(content)
    setInput('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.focus()
    }
  }

  return (
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
        onClick={handleSend}
        type="button"
      >
        <svg aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
          <path d="M3.4 2.8 21.6 11a1 1 0 0 1 0 1.8L3.4 20.8a1 1 0 0 1-1.4-.8l.8-6.1L18 12 2.8 8.6 2 2.6a1 1 0 0 1 1.4-.8Z" />
        </svg>
      </button>
    </div>
  )
}
