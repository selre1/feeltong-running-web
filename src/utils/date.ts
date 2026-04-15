export const formatKoreanDate = (timestamp: number) =>
  new Date(timestamp).toLocaleDateString('ko-KR')

export const formatKoreanTime = (timestamp: number) =>
  new Date(timestamp).toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
  })

export const formatKoreanDateTime = (timestamp: number) =>
  `${formatKoreanDate(timestamp)} ${formatKoreanTime(timestamp)}`

