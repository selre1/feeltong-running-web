export interface MeetingRoom {
  id: string
  name: string
  description: string
  creatorId: string
  creatorNickname: string
  memberCount: number
  createdAt: number
  isJoined: boolean
}

export interface ChatMessage {
  id: string
  senderId: string
  senderNickname: string
  content: string
  sentAt: number
}
