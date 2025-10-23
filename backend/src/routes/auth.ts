import express from 'express';
import { login, logout, getCurrentUser } from '../controllers/auth-controller';
import { authenticate } from '../middlewares/auth';
import { validateBody } from '../middlewares/validation';
import { z } from 'zod';

const router = express.Router();

// 검증 스키마
const loginSchema = z.object({
  username: z.string().min(3).max(50),
  password: z.string().min(6).max(100),
});

/**
 * POST /api/auth/login
 * 사용자 인증 및 JWT 쿠키 설정
 */
router.post('/login', validateBody(loginSchema), login);

/**
 * POST /api/auth/logout
 * JWT 쿠키 제거
 */
router.post('/logout', logout);

/**
 * GET /api/auth/me
 * 현재 인증된 사용자 조회
 */
router.get('/me', authenticate, getCurrentUser);

export default router;



