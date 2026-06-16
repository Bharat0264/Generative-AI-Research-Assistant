import fs from 'fs/promises';
import pdf from 'pdf-parse';
import { AppError } from '../utils/errors.js';

export async function extractPdfText(filePath) {
  const buffer = await fs.readFile(filePath);
  const parsed = await pdf(buffer);
  const text = parsed.text.replace(/\s+/g, ' ').trim();

  if (!text) {
    throw new AppError('No readable text was found in this PDF', 422);
  }

  return text;
}
