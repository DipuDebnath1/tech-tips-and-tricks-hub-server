/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express';

const globalErrorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const statusCode = (err as any).statusCode || 500;
  const message = (err as any).message || 'something went wrong';

  return res.status(statusCode).json({
    success: false,
    message,
    error: err,
  });
};
export default globalErrorHandler;
