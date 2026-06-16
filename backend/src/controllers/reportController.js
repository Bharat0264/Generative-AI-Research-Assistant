import Report from '../models/Report.js';
import { generateText } from '../services/aiService.js';
import { retrieveRelevantChunks } from '../services/vectorService.js';
import { createReportPdf } from '../services/reportPdfService.js';
import { AppError, asyncHandler } from '../utils/errors.js';
import { findOwnedDocument } from './documentController.js';

function fallbackReport(title, output) {
  return {
    title,
    introduction: output,
    literatureReview: '',
    methodology: '',
    keyFindings: '',
    conclusion: ''
  };
}

export const generateReport = asyncHandler(async (req, res) => {
  const document = await findOwnedDocument(req.user._id, req.params.documentId);
  const chunks = await retrieveRelevantChunks(
    document,
    'abstract introduction related work methodology results discussion conclusion',
    10
  );
  const context = chunks.map((chunk) => chunk.text).join('\n\n');
  const title = req.body.title?.trim() || `${document.title} Research Report`;

  const output = await generateText(`DOCUMENT CONTEXT:
${context}

TASK:
Generate a structured research report grounded only in the document. Respond as JSON with:
title, introduction, literatureReview, methodology, keyFindings, conclusion.
Use clear professional prose.`);

  let data;
  try {
    data = JSON.parse(output.replace(/```json|```/g, '').trim());
  } catch {
    data = fallbackReport(title, output);
  }

  const report = await Report.create({
    userId: req.user._id,
    documentId: document._id,
    title: data.title || title,
    introduction: data.introduction || '',
    literatureReview: data.literatureReview || '',
    methodology: data.methodology || '',
    keyFindings: data.keyFindings || '',
    conclusion: data.conclusion || ''
  });

  res.status(201).json({ report });
});

export const downloadReport = asyncHandler(async (req, res) => {
  const report = await Report.findOne({ _id: req.params.reportId, userId: req.user._id });

  if (!report) {
    throw new AppError('Report not found', 404);
  }

  await findOwnedDocument(req.user._id, report.documentId);
  const pdf = await createReportPdf(report);

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${report.title.replace(/[^a-z0-9]/gi, '-')}.pdf"`);
  res.send(pdf);
});
