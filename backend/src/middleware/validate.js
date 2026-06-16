import { validationResult } from 'express-validator';
import { AppError } from '../utils/errors.js';

export function validate(req, _res, next) {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    const message = result.array().map((item) => item.msg).join(', ');
    return next(new AppError(message, 400));
  }

  next();
}
