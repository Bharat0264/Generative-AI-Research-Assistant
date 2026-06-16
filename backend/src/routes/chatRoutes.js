import { Router } from 'express';
import { body, param } from 'express-validator';
import { askQuestion, getChatHistory } from '../controllers/chatController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();

router.use(protect);

router.post(
  '/:documentId',
  [
    param('documentId').isMongoId().withMessage('Invalid document id'),
    body('question').trim().isLength({ min: 3, max: 1500 }).withMessage('Question must be 3-1500 characters')
  ],
  validate,
  askQuestion
);

router.get(
  '/history/:documentId',
  [param('documentId').isMongoId().withMessage('Invalid document id')],
  validate,
  getChatHistory
);

export default router;
