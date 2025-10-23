# Backend - AI 채팅 서비스

Express + TypeScript + Prisma + OpenAI로 구축된 백엔드 서버입니다.

## 🚀 빠른 시작

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

```bash
cp .env.example .env
```

`.env` 파일을 열고 다음 값을 설정하세요:
- `OPENAI_API_KEY`: OpenAI API 키
- `JWT_SECRET`: JWT 서명 키 (랜덤 문자열)

### 3. 데이터베이스 설정

```bash
# Prisma 클라이언트 생성
npm run prisma:generate

# 데이터베이스 마이그레이션
npm run prisma:push

# 시드 데이터 삽입
npm run prisma:seed
```

또는 한 번에:
```bash
npm run setup
```

### 4. 개발 서버 실행

```bash
npm run dev
```

서버가 http://localhost:4000 에서 실행됩니다.

## 📚 API 엔드포인트

### Authentication
- `POST /api/auth/login` - 로그인
- `POST /api/auth/logout` - 로그아웃
- `GET /api/auth/me` - 현재 사용자 조회

### Characters
- `GET /api/characters` - 캐릭터 목록 조회
- `POST /api/characters` - 캐릭터 생성
- `PUT /api/characters/:id` - 캐릭터 수정
- `DELETE /api/characters/:id` - 캐릭터 삭제

### Chat
- `GET /api/chat/messages/:characterId` - 메시지 조회
- `POST /api/chat/messages` - 메시지 전송

## 🛠 Scripts

- `npm run dev` - 개발 서버 실행 (Hot reload)
- `npm run build` - 프로덕션 빌드
- `npm start` - 프로덕션 서버 실행
- `npm run prisma:generate` - Prisma 클라이언트 생성
- `npm run prisma:push` - DB 스키마 푸시
- `npm run prisma:seed` - 시드 데이터 삽입
- `npm run setup` - 전체 설정 (generate + push + seed)

## 📦 주요 의존성

- **express** - 웹 프레임워크
- **prisma** - ORM
- **openai** - OpenAI API 클라이언트
- **jsonwebtoken** - JWT 인증
- **bcrypt** - 비밀번호 해싱
- **zod** - 스키마 검증









