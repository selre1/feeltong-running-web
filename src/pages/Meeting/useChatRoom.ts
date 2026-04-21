import { useCallback, useEffect, useRef, useState } from 'react'
import apiClient from '../../hooks/useApi/axios'
import type { ChatMessage, WsServerEvent } from './types'

const RECONNECT_DELAYS = [1000, 2000, 4000, 8000, 16000, 30000]
const MESSAGE_LIMIT = 30
const TYPING_TIMEOUT_MS = 3000

export default function useChatRoom(roomId: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [connected, setConnected] = useState(false)
  const [hasMore, setHasMore] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [typers, setTypers] = useState<Map<string, string>>(new Map())
  const [onlineCount, setOnlineCount] = useState(0)

  const wsRef = useRef<WebSocket | null>(null)
  const retryRef = useRef(0)
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const typerTimersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())

  useEffect(() => {
    let destroyed = false

    function scheduleReconnect() {
      if (destroyed) return
      const delay = RECONNECT_DELAYS[Math.min(retryRef.current, RECONNECT_DELAYS.length - 1)]
      retryRef.current += 1
      retryTimerRef.current = setTimeout(connect, delay)
    }

    function connect() {
      if (destroyed) return
      const backUrl = import.meta.env.APP_BACK_WS_URL ?? ''
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
      const wsHost = backUrl ? backUrl.replace(/^(https?|wss?):\/\//, '') : window.location.host
      const ws = new WebSocket(`${protocol}//${wsHost}/ws/rooms/${roomId}`)
      wsRef.current = ws

      ws.onopen = () => {
        if (destroyed) return
        setConnected(true)
        retryRef.current = 0
      }

      ws.onclose = () => {
        if (destroyed) return
        setConnected(false)
        scheduleReconnect()
      }

      ws.onerror = () => ws.close()

      ws.onmessage = (e) => {
        if (destroyed) return
        try {
          const event = JSON.parse(e.data as string) as WsServerEvent
          switch (event.type) {
            case 'history':
              setMessages(event.data)
              setHasMore(event.hasMore ?? false)
              break
            case 'message':
              setMessages((prev) =>
                prev.some((m) => m.id === event.data.id) ? prev : [...prev, event.data],
              )
              break
            case 'typing': {
              const { senderId, senderNickname } = event
              setTypers((prev) => new Map(prev).set(senderId, senderNickname))
              const existing = typerTimersRef.current.get(senderId)
              if (existing) clearTimeout(existing)
              typerTimersRef.current.set(
                senderId,
                setTimeout(() => {
                  setTypers((prev) => {
                    const next = new Map(prev)
                    next.delete(senderId)
                    return next
                  })
                }, TYPING_TIMEOUT_MS),
              )
              break
            }
            case 'online_count':
              setOnlineCount(event.count)
              break
          }
        } catch {
          // ignore malformed frames
        }
      }
    }

    connect()

    return () => {
      destroyed = true
      if (retryTimerRef.current) clearTimeout(retryTimerRef.current)
      typerTimersRef.current.forEach(clearTimeout)
      wsRef.current?.close()
    }
  }, [roomId])

  const sendMessage = useCallback((content: string) => {
    const ws = wsRef.current
    if (!content.trim() || !ws || ws.readyState !== WebSocket.OPEN) return
    ws.send(JSON.stringify({ type: 'send_message', content }))
  }, [])

  const sendTyping = useCallback(() => {
    const ws = wsRef.current
    if (!ws || ws.readyState !== WebSocket.OPEN) return
    ws.send(JSON.stringify({ type: 'typing' }))
  }, [])

  const loadMore = useCallback(async () => {
    if (!hasMore || loadingMore || messages.length === 0) return
    setLoadingMore(true)
    try {
      const oldest = messages[0]
      const res = await apiClient.get<{ data: ChatMessage[]; hasMore: boolean }>(
        `/rooms/${roomId}/messages`,
        { params: { before_id: oldest.id, limit: MESSAGE_LIMIT } },
      )
      setMessages((prev) => {
        const existingIds = new Set(prev.map((m) => m.id))
        return [...res.data.data.filter((m) => !existingIds.has(m.id)), ...prev]
      })
      setHasMore(res.data.hasMore)
    } catch {
      // silent — user can retry by scrolling up again
    } finally {
      setLoadingMore(false)
    }
  }, [hasMore, loadingMore, messages, roomId])

  return {
    messages,
    connected,
    onlineCount,
    typers,
    hasMore,
    loadingMore,
    sendMessage,
    sendTyping,
    loadMore,
  }
}
