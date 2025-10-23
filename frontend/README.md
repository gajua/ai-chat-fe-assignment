# Frontend - AI 채팅 서비스

React + TypeScript + Vite + Tailwind CSS로 구축된 프론트엔드 애플리케이션입니다.

## 🚀 빠른 시작

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

```bash
cp .env.example .env
```

`.env` 파일을 열고 백엔드 URL을 확인하세요:
```env
VITE_API_BASE_URL=http://localhost:4000
```

### 3. 개발 서버 실행

```bash
npm run dev
```

앱이 http://localhost:3000 에서 실행됩니다.

## 📁 프로젝트 구조

```
src/
├── components/       # 재사용 가능한 컴포넌트
├── config/          # 앱 설정
├── hooks/           # Custom React Hooks
├── pages/           # 페이지 컴포넌트
├── services/        # API 서비스
├── store/           # Zustand 상태 관리
├── styles/          # 글로벌 스타일 (Tailwind)
├── types/           # TypeScript 타입
├── utils/           # 유틸리티 함수
├── App.tsx          # 앱 루트
└── main.tsx         # 엔트리포인트
```

## 🎨 주요 기능

- **인증**: JWT 기반 로그인/로그아웃
- **캐릭터 관리**: AI 캐릭터 조회 및 생성
- **실시간 채팅**: AI와 대화
- **상태 관리**: Zustand를 통한 전역 상태
- **라우팅**: React Router를 통한 페이지 네비게이션

## 🛠 Scripts

- `npm run dev` - 개발 서버 실행
- `npm run build` - 프로덕션 빌드
- `npm run preview` - 빌드된 앱 미리보기
- `npm run lint` - ESLint 실행

## 📦 주요 의존성

- **react** - UI 라이브러리
- **react-router-dom** - 라우팅
- **zustand** - 상태 관리
- **axios** - HTTP 클라이언트
- **date-fns** - 날짜 포맷팅
- **vite** - 빌드 도구
- **tailwindcss v4** - 스타일링 프레임워크

## 🎨 스타일링

### Tailwind CSS v4
- `@import "tailwindcss"` 방식 사용 (v4 신규 방식)
- CSS 변수로 커스텀 색상 정의
- @layer 지시어로 컴포넌트 및 유틸리티 클래스 생성
- 반응형 디자인 (mobile-first)

### 커스텀 클래스
```css
.btn              /* 기본 버튼 */
.btn-primary      /* 주요 버튼 (보라색) */
.btn-secondary    /* 보조 버튼 (회색) */
.input            /* 입력 필드 */
.card             /* 카드 컨테이너 */
.fade-in          /* 페이드인 애니메이션 */
.loading-dot      /* 로딩 애니메이션 */
.scrollbar-thin   /* 얇은 스크롤바 */
```

### 색상 팔레트
```
Primary: #6366f1 (보라색)
Primary Hover: #4f46e5
Primary Light: #818cf8
```

## 🌐 브라우저 지원

- Chrome (최신)
- Firefox (최신)
- Safari (최신)
- Edge (최신)

## 📝 주석 언어

모든 주석이 **한글**로 작성되어 있어 이해하기 쉽습니다.

## 🔍 트러블슈팅

### 스타일이 적용되지 않는 경우

1. **브라우저 캐시 클리어**: Cmd/Ctrl + Shift + R
2. **Vite 캐시 삭제**: `rm -rf node_modules/.vite`
3. **서버 재시작**: `npm run dev`
4. **Tailwind import 확인**: `src/styles/index.css` 첫 줄에 `@import "tailwindcss";`

### 포트 충돌

포트 3000이 사용 중이면 자동으로 다른 포트(3001)를 사용합니다.

## 🎓 코드 스타일

- TypeScript strict mode
- Functional components
- Early returns for errors
- Descriptive variable names (예: `isLoading`, `hasError`)
- JSDoc 주석 (한글)

---

**상세 정보는 프로젝트 루트의 [README.md](../README.md)를 참고하세요.**
