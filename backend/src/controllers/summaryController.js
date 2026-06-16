import Document from '../models/Document.js';
import { generateText } from '../services/aiService.js';
import { retrieveRelevantChunks } from '../services/vectorService.js';
import { asyncHandler } from '../utils/errors.js';
import { findOwnedDocument } from './documentController.js';

export const generateSummary = asyncHandler(async (req, res) => {
  const document = await findOwnedDocument(req.user._id, req.params.documentId);
  const chunks = await retrieveRelevantChunks(document, 'main contribution methodology findings keywords', 8);
  const context = chunks.map((chunk) => chunk.text).join('\n\n');
  const output = await generateText(`DOCUMENT CONTEXT:
${context}

TASK:
Create a concise research summary and list 8 to 12 important keywords.
Respond as JSON with keys "summary" and "keywords".`);

  let parsed;
  try {
    parsed = JSON.parse(output.replace(/```json|```/g, '').trim());
  } catch {
    parsed = {
      summary: output,
      keywords: Array.from(
        new Set(
          document.extractedText
            .toLowerCase()
            .match(/[a-z][a-z-]{4,}/g)
            ?.slice(0, 40) || []
        )
      ).slice(0, 12)
    };
  }

  const updated = await Document.findByIdAndUpdate(
    document._id,
    {
      summary: parsed.summary || '',
      keywords: Array.isArray(parsed.keywords) ? parsed.keywords : []
    },
    { new: true }
  ).select('-extractedText -chunks.embedding');

  res.json({ document: updated });
});
