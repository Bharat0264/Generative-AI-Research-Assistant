import { Router } from 'express';
import { body, param } from 'express-validator';
import { downloadReport, generateReport } from '../controllers/reportController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();

router.use(protect);

router.post(
  '/:documentId',
  [
    param('documentId').isMongoId().withMessage('Invalid document id'),
    body('title').optional().trim().isLength({ max: 160 }).withMessage('Title is too long')
  ],
  validate,
  generateReport
);

router.get(
  '/download/:reportId',
  [param('reportId').isMongoId().withMessage('Invalid report id')],
  validate,
  downloadReport
);

export default router;
