import { Request, Response, NextFunction } from 'express';

/**
 * 전역 에러 처리 미들웨어
 * 모든 에러를 잡아서 일관된 에러 응답 반환
 */
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error:', err);

  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;

  res.status(statusCode).json({
    success: false,
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};



