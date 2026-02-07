import { Request, Response, NextFunction } from 'express';
import {
  getReasonPhrase,
  StatusCodes,
} from 'http-status-codes';

interface IResponse {
  status: 'succes' | 'error';
  statusCode: number;
  message: string;
  data?: any;
  error?: any;
  meta?: any;
}

export function responseFormatter(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // grabbing the original json
  const originalJson = res.json.bind(res);

  // modifying the jsonfunction
  res.json = (data: any): Response => {
    const statusCode = res.statusCode
      ? res.statusCode
      : StatusCodes.OK;
    const response: IResponse = {
      status:
        statusCode >= 200 && statusCode < 300
          ? 'succes'
          : 'error',
      statusCode: statusCode,
      // set the message based on statuscode
      message: getReasonPhrase(statusCode),
    };
    if (statusCode >= 200 && statusCode < 300) {
      response.data = data.meta ? data.data : data;
    }
    if (statusCode >= 300) {
      // data = response from controller
      response.error = data;
    }
    if (data.meta) {
      response.meta = data.meta;
    }
    return originalJson(response);
  };
  next();
}
