import Chat from '../models/Chat.js';
import { generateText } from '../services/aiService.js';
import { retrieveRelevantChunks } from '../services/vectorService.js';
import { asyncHandler } from '../utils/errors.js';
import { findOwnedDocument } from './documentController.js';

export const askQuestion = asyncHandler(async (req, res) => {
  const document = await findOwnedDocument(req.user._id, req.params.documentId);
  const relevantChunks = await retrieveRelevantChunks(document, req.body.question, 5);
  const context = relevantChunks
    .map((chunk) => `[Chunk ${chunk.index} | score ${chunk.score.toFixed(3)}]\n${chunk.text}`)
    .join('\n\n');

  const answer = await generateText(`DOCUMENT CONTEXT:
${context}

QUESTION:
${req.body.question}

Answer only from the document context. Include a short note when the answer is not supported.`);

  const chat = await Chat.create({
    userId: req.user._id,
    documentId: document._id,
    question: req.body.question,
    answer,
    sources: relevantChunks.map((chunk) => ({
      index: chunk.index,
      score: chunk.score,
      preview: chunk.text.slice(0, 240)
    }))
  });

  res.status(201).json({ chat });
});

export const getChatHistory = asyncHandler(async (req, res) => {
  await findOwnedDocument(req.user._id, req.params.documentId);
  const chats = await Chat.find({ userId: req.user._id, documentId: req.params.documentId }).sort({
    createdAt: 1
  });

  res.json({ chats });
});
