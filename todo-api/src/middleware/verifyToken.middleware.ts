import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import jsonwebtoken from 'jsonwebtoken';

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction,
): Response | void => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: 'Unauthorized' });
  }
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jsonwebtoken.verify(
      token,
      process.env.JWT_SECRET_KEY as string,
    );
    (req as any).user = decoded;
    return next();
  } catch (err) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: 'Invalid token' });
  }
};
