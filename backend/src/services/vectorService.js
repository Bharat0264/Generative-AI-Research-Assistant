import { generateEmbedding } from './aiService.js';

function cosineSimilarity(a, b) {
  const length = Math.min(a.length, b.length);
  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < length; i += 1) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  return dot / ((Math.sqrt(normA) || 1) * (Math.sqrt(normB) || 1));
}

export async function retrieveRelevantChunks(document, query, limit = 5) {
  const queryEmbedding = await generateEmbedding(query);

  return document.chunks
    .map((chunk) => ({
      index: chunk.index,
      text: chunk.text,
      score: cosineSimilarity(queryEmbedding, chunk.embedding)
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
