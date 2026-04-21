import { useEffect, useState } from 'react'
import apiClient from '../../hooks/useApi/axios'
import type { MeetingRoom } from './types'

export default function useMeetingRooms() {
  const [rooms, setRooms] = useState<MeetingRoom[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [fetchKey, setFetchKey] = useState(0)

  useEffect(() => {
    setLoading(true)
    setError(null)
    apiClient
      .get<MeetingRoom[]>('/rooms')
      .then((res) => setRooms(res.data))
      .catch(() => setError('방 목록을 불러오지 못했습니다.'))
      .finally(() => setLoading(false))
  }, [fetchKey])

  const refetch = () => setFetchKey((k) => k + 1)

  const createRoom = async (data: { name: string; description: string }) => {
    const res = await apiClient.post<MeetingRoom>('/rooms', data)
    setRooms((prev) => [res.data, ...prev])
  }

  const updateRoom = async (roomId: string, data: { name: string; description: string }) => {
    const snapshot = rooms.find((r) => r.id === roomId)
    setRooms((prev) => prev.map((r) => (r.id === roomId ? { ...r, ...data } : r)))
    try {
      const res = await apiClient.patch<MeetingRoom>(`/rooms/${roomId}`, data)
      setRooms((prev) => prev.map((r) => (r.id === roomId ? res.data : r)))
    } catch (err) {
      if (snapshot) setRooms((prev) => prev.map((r) => (r.id === roomId ? snapshot : r)))
      throw err
    }
  }

  const deleteRoom = async (roomId: string) => {
    const snapshot = [...rooms]
    setRooms((prev) => prev.filter((r) => r.id !== roomId))
    try {
      await apiClient.delete(`/rooms/${roomId}`)
    } catch (err) {
      setRooms(snapshot)
      throw err
    }
  }

  const toggleJoin = async (room: MeetingRoom) => {
    const endpoint = room.isJoined ? `/rooms/${room.id}/leave` : `/rooms/${room.id}/join`
    setRooms((prev) =>
      prev.map((r) =>
        r.id === room.id
          ? { ...r, isJoined: !room.isJoined, memberCount: room.memberCount + (room.isJoined ? -1 : 1) }
          : r,
      ),
    )
    try {
      const res = await apiClient.post<{ memberCount: number }>(endpoint)
      setRooms((prev) =>
        prev.map((r) =>
          r.id === room.id ? { ...r, isJoined: !room.isJoined, memberCount: res.data.memberCount } : r,
        ),
      )
    } catch (err) {
      setRooms((prev) =>
        prev.map((r) =>
          r.id === room.id ? { ...r, isJoined: room.isJoined, memberCount: room.memberCount } : r,
        ),
      )
      throw err
    }
  }

  return { rooms, loading, error, refetch, createRoom, updateRoom, deleteRoom, toggleJoin }
}
