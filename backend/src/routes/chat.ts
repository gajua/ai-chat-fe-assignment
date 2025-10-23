import express from 'express';
import {
  getMessages,
  sendMessage,
} from '../controllers/chat-controller';
import { authenticate } from '../middlewares/auth';
import { validateBody } from '../middlewares/validation';
import { z } from 'zod';

const router = express.Router();

// 검증 스키마
const sendMessageSchema = z.object({
  content: z.string().min(1).max(200), // 요구사항에 따라 최대 200자
  characterId: z.string().uuid(),
});

/**
 * GET /api/chat/messages/:characterId
 * 특정 캐릭터의 모든 메시지 조회
 */
router.get('/messages/:characterId', authenticate, getMessages);

/**
 * POST /api/chat/messages
 * 메시지 전송 및 AI 응답 받기
 */
router.post('/messages', authenticate, validateBody(sendMessageSchema), sendMessage);

export default router;



