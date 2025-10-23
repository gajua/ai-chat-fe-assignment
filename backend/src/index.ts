import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import characterRoutes from './routes/characters';
import chatRoutes from './routes/chat';
import { errorHandler } from './middlewares/error-handler';

// 환경 변수 로드
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// 미들웨어 설정
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true, // 쿠키 허용
}));
app.use(express.json());
app.use(cookieParser());

// 헬스 체크 엔드포인트
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'AI Chat Backend is running' });
});

// API 라우트
app.use('/api/auth', authRoutes);
app.use('/api/characters', characterRoutes);
app.use('/api/chat', chatRoutes);

// 에러 처리 미들웨어 (가장 마지막에 위치해야 함)
app.use(errorHandler);

// 서버 시작
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 CORS enabled for: ${FRONTEND_URL}`);
});



