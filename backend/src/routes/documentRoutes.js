import { Router } from 'express';
import { body, param } from 'express-validator';
import {
  deleteDocument,
  getDocument,
  listDocuments,
  uploadDocument
} from '../controllers/documentController.js';
import { protect } from '../middleware/auth.js';
import { uploadPdf } from '../middleware/upload.js';
import { validate } from '../middleware/validate.js';

const router = Router();

router.use(protect);

router.post(
  '/upload',
  uploadPdf.single('pdf'),
  [body('title').optional().trim().isLength({ max: 160 }).withMessage('Title is too long')],
  validate,
  uploadDocument
);

router.get('/', listDocuments);

router.get('/:id', [param('id').isMongoId().withMessage('Invalid document id')], validate, getDocument);

router.delete('/:id', [param('id').isMongoId().withMessage('Invalid document id')], validate, deleteDocument);

export default router;
