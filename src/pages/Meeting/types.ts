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

export type WsServerEvent =
  | { type: 'history'; data: ChatMessage[]; hasMore: boolean }
  | { type: 'message'; data: ChatMessage }
  | { type: 'typing'; senderId: string; senderNickname: string }
  | { type: 'online_count'; count: number }
