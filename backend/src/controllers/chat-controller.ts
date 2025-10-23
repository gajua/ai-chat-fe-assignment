import { Response } from 'express';
import { prisma } from '../db/client';
import { AuthRequest } from '../types';
import { getAIResponse } from '../services/openai-service';

/**
 * GET /api/chat/messages/:characterId
 * 특정 캐릭터의 모든 메시지 조회
 */
export const getMessages = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { characterId } = req.params;

    // 캐릭터 존재 여부 확인
    const character = await prisma.character.findUnique({
      where: { id: characterId },
    });

    if (!character) {
      res.status(404).json({
        success: false,
        error: 'Character not found',
      });
      return;
    }

    // 해당 캐릭터와 사용자의 메시지 조회
    const messages = await prisma.message.findMany({
      where: {
        characterId,
        userId: req.userId!,
      },
      orderBy: {
        createdAt: 'asc',
      },
      select: {
        id: true,
        content: true,
        role: true,
        createdAt: true,
      },
    });

    res.json({
      success: true,
      data: messages,
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch messages',
    });
  }
};

/**
 * POST /api/chat/messages
 * 메시지 전송 및 AI 응답 받기
 */
export const sendMessage = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { content, characterId } = req.body;
    const userId = req.userId!;

    // 캐릭터 존재 여부 확인
    const character = await prisma.character.findUnique({
      where: { id: characterId },
    });

    if (!character) {
      res.status(404).json({
        success: false,
        error: 'Character not found',
      });
      return;
    }

    // 사용자 메시지 저장
    const userMessage = await prisma.message.create({
      data: {
        content,
        role: 'user',
        characterId,
        userId,
      },
    });

    // 대화 컨텍스트를 위해 최근 메시지 조회 (최대 10개)
    const previousMessages = await prisma.message.findMany({
      where: {
        characterId,
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 9, // 방금 생성한 메시지를 제외한 최근 9개 메시지
      select: {
        content: true,
        role: true,
      },
    });

    // AI 응답 생성
    const aiResponseContent = await getAIResponse(
      character.prompt,
      content,
      previousMessages.reverse() // 시간순으로 정렬
    );

    // AI 응답 저장
    const aiMessage = await prisma.message.create({
      data: {
        content: aiResponseContent,
        role: 'assistant',
        characterId,
        userId,
      },
    });

    res.json({
      success: true,
      data: {
        userMessage: {
          id: userMessage.id,
          content: userMessage.content,
          role: userMessage.role,
          createdAt: userMessage.createdAt,
        },
        aiMessage: {
          id: aiMessage.id,
          content: aiMessage.content,
          role: aiMessage.role,
          createdAt: aiMessage.createdAt,
        },
      },
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send message',
    });
  }
};





