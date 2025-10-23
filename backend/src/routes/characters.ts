import express from 'express';
import {
  getAllCharacters,
  createCharacter,
  updateCharacter,
  deleteCharacter,
} from '../controllers/character-controller';
import { authenticate } from '../middlewares/auth';
import { validateBody } from '../middlewares/validation';
import { z } from 'zod';

const router = express.Router();

// 검증 스키마
const createCharacterSchema = z.object({
  name: z.string().min(1).max(100),
  prompt: z.string().min(10).max(2000),
  thumbnail: z.string().optional(),
});

const updateCharacterSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  prompt: z.string().min(10).max(2000).optional(),
  thumbnail: z.string().optional(),
});

/**
 * GET /api/characters
 * 모든 캐릭터 조회 (기본 + 사용자 생성)
 */
router.get('/', authenticate, getAllCharacters);

/**
 * POST /api/characters
 * 새 캐릭터 생성
 */
router.post('/', authenticate, validateBody(createCharacterSchema), createCharacter);

/**
 * PUT /api/characters/:id
 * 캐릭터 수정
 */
router.put('/:id', authenticate, validateBody(updateCharacterSchema), updateCharacter);

/**
 * DELETE /api/characters/:id
 * 캐릭터 삭제
 */
router.delete('/:id', authenticate, deleteCharacter);

export default router;



