import { Response } from 'express';
import { prisma } from '../db/client';
import { AuthRequest } from '../types';

/**
 * GET /api/characters
 * 모든 캐릭터 조회 (기본 + 사용자 생성)
 */
export const getAllCharacters = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const characters = await prisma.character.findMany({
      where: {
        OR: [
          { isDefault: true },
          { createdById: req.userId },
        ],
      },
      orderBy: [
        { isDefault: 'desc' },
        { createdAt: 'desc' },
      ],
      select: {
        id: true,
        name: true,
        prompt: true,
        thumbnail: true,
        isDefault: true,
        createdAt: true,
      },
    });

    res.json({
      success: true,
      data: characters,
    });
  } catch (error) {
    console.error('Get characters error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch characters',
    });
  }
};

/**
 * POST /api/characters
 * 새 캐릭터 생성
 */
export const createCharacter = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { name, prompt, thumbnail } = req.body;

    const character = await prisma.character.create({
      data: {
        name,
        prompt,
        thumbnail,
        createdById: req.userId!,
        isDefault: false,
      },
      select: {
        id: true,
        name: true,
        prompt: true,
        thumbnail: true,
        isDefault: true,
        createdAt: true,
      },
    });

    res.status(201).json({
      success: true,
      data: character,
      message: 'Character created successfully',
    });
  } catch (error) {
    console.error('Create character error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create character',
    });
  }
};

/**
 * PUT /api/characters/:id
 * 캐릭터 수정
 */
export const updateCharacter = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, prompt, thumbnail } = req.body;

    // 캐릭터 존재 여부 및 소유권 확인
    const character = await prisma.character.findUnique({
      where: { id },
    });

    if (!character) {
      res.status(404).json({
        success: false,
        error: 'Character not found',
      });
      return;
    }

    if (character.isDefault) {
      res.status(403).json({
        success: false,
        error: 'Cannot modify default characters',
      });
      return;
    }

    if (character.createdById !== req.userId) {
      res.status(403).json({
        success: false,
        error: 'Not authorized to modify this character',
      });
      return;
    }

    // 캐릭터 업데이트
    const updatedCharacter = await prisma.character.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(prompt && { prompt }),
        ...(thumbnail !== undefined && { thumbnail }),
      },
      select: {
        id: true,
        name: true,
        prompt: true,
        thumbnail: true,
        isDefault: true,
        createdAt: true,
      },
    });

    res.json({
      success: true,
      data: updatedCharacter,
      message: 'Character updated successfully',
    });
  } catch (error) {
    console.error('Update character error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update character',
    });
  }
};

/**
 * DELETE /api/characters/:id
 * 캐릭터 삭제
 */
export const deleteCharacter = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    // 캐릭터 존재 여부 및 소유권 확인
    const character = await prisma.character.findUnique({
      where: { id },
    });

    if (!character) {
      res.status(404).json({
        success: false,
        error: 'Character not found',
      });
      return;
    }

    if (character.isDefault) {
      res.status(403).json({
        success: false,
        error: 'Cannot delete default characters',
      });
      return;
    }

    if (character.createdById !== req.userId) {
      res.status(403).json({
        success: false,
        error: 'Not authorized to delete this character',
      });
      return;
    }

    // 캐릭터 삭제 (연관된 메시지도 자동 삭제됨)
    await prisma.character.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: 'Character deleted successfully',
    });
  } catch (error) {
    console.error('Delete character error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete character',
    });
  }
};






