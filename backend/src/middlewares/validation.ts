import { Request, Response, NextFunction } from 'express';
import { z, ZodSchema } from 'zod';

/**
 * 검증 미들웨어 팩토리
 * 요청 본문을 Zod 스키마로 검증
 */
export const validateBody = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          error: 'Validation error',
          details: error.errors,
        });
        return;
      }
      next(error);
    }
  };
};



