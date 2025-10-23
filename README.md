# 🤖 AI 캐릭터 채팅 서비스

AI 캐릭터와 대화할 수 있는 풀스택 웹 애플리케이션입니다.

## 📋 목차

- [주요 기능](#주요-기능)
- [기술 스택](#기술-스택)
- [프로젝트 구조](#프로젝트-구조)
- [시작하기](#시작하기)
- [API 문서](#api-문서)
- [환경 변수](#환경-변수)
- [개발 가이드](#개발-가이드)

## ✨ 주요 기능

### 필수 기능 (구현 완료)

- ✅ **사용자 인증**
  - 간단한 로그인/로그아웃 (JWT 기반)
  - 인증되지 않은 사용자는 로그인 페이지로 리디렉션

- ✅ **AI 캐릭터 관리**
  - 3개의 기본 캐릭터 (시드 데이터)
  - 사용자가 새로운 캐릭터 생성 가능
  - 캐릭터 목록 조회 및 선택
  - 각 캐릭터는 독립적인 대화 컨텍스트 유지

- ✅ **채팅 기능**
  - 메시지 전송 및 수신 (최대 200자)
  - 타임스탬프 표시
  - 로딩 상태 표시
  - 새로고침 시 대화 기록 복원
  - 캐릭터별 메시지 저장

- ✅ **데이터 영속성**
  - SQLite 데이터베이스 (Prisma ORM)
  - 캐릭터 및 채팅 기록 저장
  - 세션 유지

## 🛠 기술 스택

### Frontend
- **React 18** - UI 라이브러리
- **TypeScript** - 타입 안정성
- **Vite** - 빠른 개발 환경
- **React Router** - 라우팅
- **Zustand** - 상태 관리
- **Axios** - HTTP 클라이언트
- **date-fns** - 날짜 포맷팅

### Backend
- **Node.js** - 런타임
- **Express** - 웹 프레임워크
- **TypeScript** - 타입 안정성
- **Prisma** - ORM
- **SQLite** - 데이터베이스
- **JWT** - 인증
- **OpenAI API** - AI 응답 생성
- **Zod** - 스키마 검증

## 📁 프로젝트 구조

```
.
├── backend/
│   ├── prisma/
│   │   └── schema.prisma           # 데이터베이스 스키마
│   ├── src/
│   │   ├── controllers/            # 요청 핸들러
│   │   ├── db/                     # 데이터베이스 클라이언트 & 시드
│   │   ├── middlewares/            # Express 미들웨어
│   │   ├── routes/                 # API 라우트
│   │   ├── services/               # 비즈니스 로직
│   │   ├── types/                  # TypeScript 타입
│   │   └── index.ts                # 서버 엔트리포인트
│   ├── .env.example                # 환경 변수 예제
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── components/             # React 컴포넌트
│   │   ├── config/                 # 설정 파일
│   │   ├── hooks/                  # Custom React Hooks
│   │   ├── pages/                  # 페이지 컴포넌트
│   │   ├── services/               # API 서비스
│   │   ├── store/                  # Zustand 스토어
│   │   ├── styles/                 # 글로벌 스타일
│   │   ├── types/                  # TypeScript 타입
│   │   ├── utils/                  # 유틸리티 함수
│   │   ├── App.tsx                 # 앱 루트 컴포넌트
│   │   └── main.tsx                # 앱 엔트리포인트
│   ├── .env.example                # 환경 변수 예제
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── README.md                       # 프로젝트 문서
└── AI_USAGE.md                     # AI 사용 가이드
```

## 🚀 시작하기

### 사전 요구사항

- Node.js 18 이상
- npm 또는 yarn
- OpenAI API Key

### 1. 프로젝트 클론 및 설치

```bash
# Backend 설치
cd backend
npm install
```

```bash
# Frontend 설치 (새 터미널)
cd frontend
npm install
```

### 2. 환경 변수 설정

#### Backend (.env)
```bash
cd backend
cp .env.example .env
```

`.env` 파일을 열고 다음 값을 설정하세요:
```env
PORT=4000
NODE_ENV=development
DATABASE_URL="file:./dev.db"
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
OPENAI_API_KEY=sk-your-openai-api-key-here
FRONTEND_URL=http://localhost:3000
```

⚠️ **중요**: `OPENAI_API_KEY`에 실제 OpenAI API 키를 입력해야 합니다.

#### Frontend (.env)
```bash
cd frontend
cp .env.example .env
```

`.env` 파일을 열고 다음 값을 확인하세요:
```env
VITE_API_BASE_URL=http://localhost:4000
```

### 3. 데이터베이스 설정

```bash
cd backend

# Prisma 클라이언트 생성
npm run prisma:generate

# 데이터베이스 스키마 적용
npm run prisma:push

# 시드 데이터 생성 (기본 사용자 및 캐릭터)
npm run prisma:seed
```

이 과정에서 다음이 생성됩니다:
- **기본 사용자**: `demo` / `password123`
- **3개의 AI 캐릭터**: 친근한 친구, 전문 상담가, 유쾌한 코미디언

### 4. 서버 실행

#### Backend 실행
```bash
cd backend
npm run dev
```
서버가 http://localhost:4000 에서 실행됩니다.

#### Frontend 실행 (새 터미널)
```bash
cd frontend
npm run dev
```
앱이 http://localhost:3000 에서 실행됩니다.

### 5. 애플리케이션 사용

1. 브라우저에서 http://localhost:3000 접속
2. 다음 계정으로 로그인:
   - **사용자명**: `demo`
   - **비밀번호**: `password123`
3. AI 캐릭터를 선택하고 대화 시작!

## 📚 API 문서

### Authentication

#### POST /api/auth/login
로그인 및 JWT 쿠키 설정

**Request Body:**
```json
{
  "username": "demo",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user-uuid",
    "username": "demo"
  },
  "message": "Login successful"
}
```

#### POST /api/auth/logout
JWT 쿠키 제거

#### GET /api/auth/me
현재 인증된 사용자 정보 조회

### Characters

#### GET /api/characters
모든 캐릭터 조회 (기본 + 사용자 생성)

#### POST /api/characters
새 캐릭터 생성

**Request Body:**
```json
{
  "name": "캐릭터 이름",
  "prompt": "시스템 프롬프트...",
  "thumbnail": "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
}
```

#### PUT /api/characters/:id
캐릭터 수정

#### DELETE /api/characters/:id
캐릭터 삭제

### Chat

#### GET /api/chat/messages/:characterId
특정 캐릭터의 모든 메시지 조회

#### POST /api/chat/messages
메시지 전송 및 AI 응답 받기

**Request Body:**
```json
{
  "content": "안녕하세요!",
  "characterId": "character-uuid"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "userMessage": {
      "id": "msg-uuid-1",
      "content": "안녕하세요!",
      "role": "user",
      "createdAt": "2025-01-15T10:00:00Z"
    },
    "aiMessage": {
      "id": "msg-uuid-2",
      "content": "안녕하세요! 반가워요!",
      "role": "assistant",
      "createdAt": "2025-01-15T10:00:01Z"
    }
  }
}
```

## 🔐 환경 변수

### Backend

| 변수 | 설명 | 기본값 |
|------|------|--------|
| `PORT` | 서버 포트 | 4000 |
| `NODE_ENV` | 환경 (development/production) | development |
| `DATABASE_URL` | SQLite 데이터베이스 경로 | file:./dev.db |
| `JWT_SECRET` | JWT 서명 비밀키 | (필수 - 변경 필요) |
| `OPENAI_API_KEY` | OpenAI API 키 | (필수) |
| `FRONTEND_URL` | CORS를 위한 프론트엔드 URL | http://localhost:3000 |

### Frontend

| 변수 | 설명 | 기본값 |
|------|------|--------|
| `VITE_API_BASE_URL` | Backend API URL | http://localhost:4000 |

## 💻 개발 가이드

### 코드 스타일

- **Functional Components**: 클래스 컴포넌트 대신 함수형 컴포넌트 사용
- **TypeScript**: 모든 파일에 명시적 타입 지정
- **Early Returns**: 에러 조건은 early return 패턴 사용
- **Descriptive Names**: 의미 있는 변수명 사용 (예: `isLoading`, `hasError`)

### 상태 관리

- **Zustand**: 전역 상태 관리
- **React Hooks**: 로컬 상태 관리
- **Custom Hooks**: 재사용 가능한 로직 추출

### 에러 처리

- 모든 API 호출에 try-catch 블록
- 사용자에게 친화적인 에러 메시지
- 콘솔에 상세한 에러 로그

### 데이터베이스 마이그레이션

Prisma 스키마 변경 후:

```bash
cd backend
npm run prisma:push      # 개발 환경
# 또는
npx prisma migrate dev   # 마이그레이션 생성
```

### 빌드

#### Backend
```bash
cd backend
npm run build
npm start
```

#### Frontend
```bash
cd frontend
npm run build
npm run preview
```

## 🤝 기여 가이드

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

**더 자세한 AI 사용 정보는 [AI_USAGE.md](./AI_USAGE.md)를 참고하세요.**









