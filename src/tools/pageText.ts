export const meetingCopy = {
  title: '모임',
  subtitle: '같이 ㄱㄱ?',
  emptyTitle: '모임 페이지 준비 중',
  emptyDescription: '곧 함께 달릴 러너들을 위한 모임 기능이 찾아옵니다.',
}

export const myCopy = {
  title: '마이',
  subtitle: '뛰어서 상쾌한 하루를 시작하자.',
  profileLabel: '사용자 프로필',
  profileBio: (recordCount: number) => `총 러닝 ${recordCount}개`,
  settings: [
    ['알림 설정', '모임 알림 수신 여부를 설정합니다.'],
    ['권한 관리', '위치 권한과 실행 중 GPS 연동 상태를 확인합니다.'],
    ['단위 설정', '거리, 속도, 칼로리 표시 단위를 변경합니다.'],
    ['개인정보', '프로필 공개 범위와 데이터 보관 정책을 확인합니다.'],
  ] as const,
}

export const recordCopy = {
  title: '기록',
  runCountLabel: '운동',
  totalDistanceLabel: '총 Km',
  pointLabel: (count: number) => `${count} 지점`,
  emptyTitle: '현재 기록이 없습니다.',
  emptyDescription: '러닝을 시작하여 기록을 남겨보세요.',
}

