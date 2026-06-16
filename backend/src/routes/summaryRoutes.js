import { Router } from 'express';
import { param } from 'express-validator';
import { generateSummary } from '../controllers/summaryController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();

router.use(protect);

router.post(
  '/:documentId',
  [param('documentId').isMongoId().withMessage('Invalid document id')],
  validate,
  generateSummary
);

export default router;
