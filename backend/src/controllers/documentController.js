import fs from 'fs/promises';
import Document from '../models/Document.js';
import Chat from '../models/Chat.js';
import Report from '../models/Report.js';
import { splitIntoChunks } from '../services/chunkService.js';
import { generateEmbeddings } from '../services/aiService.js';
import { extractPdfText } from '../services/pdfService.js';
import { AppError, asyncHandler } from '../utils/errors.js';

export async function findOwnedDocument(userId, documentId) {
  const document = await Document.findOne({ _id: documentId, userId });

  if (!document) {
    throw new AppError('Document not found', 404);
  }

  return document;
}

export const uploadDocument = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new AppError('PDF file is required', 400);
  }

  try {
    const extractedText = await extractPdfText(req.file.path);
    const chunks = splitIntoChunks(extractedText);
    const embeddedChunks = await generateEmbeddings(chunks);
    const title = req.body.title?.trim() || req.file.originalname.replace(/\.pdf$/i, '');

    const document = await Document.create({
      userId: req.user._id,
      title,
      fileUrl: `/uploads/${req.file.filename}`,
      originalName: req.file.originalname,
      extractedText,
      chunks: embeddedChunks
    });

    res.status(201).json({ document });
  } catch (error) {
    await fs.unlink(req.file.path).catch(() => {});
    throw error;
  }
});

export const listDocuments = asyncHandler(async (req, res) => {
  const documents = await Document.find({ userId: req.user._id })
    .select('-extractedText -chunks.embedding')
    .sort({ createdAt: -1 });

  res.json({ documents });
});

export const getDocument = asyncHandler(async (req, res) => {
  const document = await findOwnedDocument(req.user._id, req.params.id);
  const report = await Report.findOne({ userId: req.user._id, documentId: document._id }).sort({
    createdAt: -1
  });

  res.json({
    document: {
      ...document.toObject(),
      extractedText: undefined,
      chunks: document.chunks.map((chunk) => ({
        index: chunk.index,
        text: chunk.text,
        wordCount: chunk.text.split(/\s+/).length
      }))
    },
    report
  });
});

export const deleteDocument = asyncHandler(async (req, res) => {
  const document = await findOwnedDocument(req.user._id, req.params.id);
  const pathFromUrl = document.fileUrl.replace('/uploads/', '');

  await Promise.all([
    Chat.deleteMany({ userId: req.user._id, documentId: document._id }),
    Report.deleteMany({ userId: req.user._id, documentId: document._id }),
    document.deleteOne(),
    fs.unlink(`uploads/${pathFromUrl}`).catch(() => {})
  ]);

  res.json({ message: 'Document deleted' });
});
