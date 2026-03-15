# Discord Music Bot (No DB)

MongoDB 없이 돌아가는 버전입니다.

## 포함 기능
- /음악채널만들기
- 음악 전용 채널 생성
- 대시보드 생성
- 음악채널에 제목/링크 입력 시 자동재생 시도
- 유저 입력 메시지 자동삭제
- 봇 안내 메시지 2초 뒤 삭제
- 버튼: 종료 / 스킵 / 대기열 / 섞기 / 자동재생 / 반복재생
- Render Web Service용 포트 서버 포함

## Render 설정
- Service Type: Web Service
- Build Command: npm install
- Start Command: node src/index.js

## 환경변수
- DISCORD_TOKEN
- CLIENT_ID
- GUILD_ID
- LAVALINK_HOST
- LAVALINK_PORT
- LAVALINK_PASSWORD
- LAVALINK_SECURE

## 주의
- MongoDB가 없어서 재배포/재시작하면 음악채널 ID, 반복재생, 자동재생 상태가 초기화될 수 있습니다.
- Render 무료 플랜은 일정 시간 후 잠들 수 있습니다.
