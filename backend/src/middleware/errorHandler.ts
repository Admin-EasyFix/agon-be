import { Request, Response, NextFunction } from 'express';

interface AppError extends Error {
  status?: number;
}

export const errorHandler = (err: AppError | unknown, req: Request, res: Response, next: NextFunction) => {
  const normalized = ((): AppError => {
    if (err instanceof Error) return err as AppError;
    return { name: 'Error', message: 'Unexpected error', status: 500 } as AppError;
  })();

  const status = normalized.status && Number.isInteger(normalized.status) ? normalized.status : 500;
  const message = normalized.message || 'Something went wrong';

  if (process.env.NODE_ENV !== 'production') {
    console.error(normalized.stack || normalized);
  } else {
    // In production, log a less verbose error.
    console.error(`Error ${status}: ${message}`);
  }

  res.status(status).json({ status, message });
};