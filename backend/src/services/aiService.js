import { env } from '../config/env.js';

const OPENAI_CHAT_MODEL = process.env.OPENAI_CHAT_MODEL || 'gpt-4o-mini';
const OPENAI_EMBEDDING_MODEL = process.env.OPENAI_EMBEDDING_MODEL || 'text-embedding-3-small';
const GEMINI_CHAT_MODEL = process.env.GEMINI_CHAT_MODEL || 'gemini-1.5-flash';
const GEMINI_EMBEDDING_MODEL = process.env.GEMINI_EMBEDDING_MODEL || 'text-embedding-004';

function localEmbedding(text, dimensions = 256) {
  const vector = new Array(dimensions).fill(0);
  const tokens = text.toLowerCase().match(/[a-z0-9]+/g) || [];

  for (const token of tokens) {
    let hash = 2166136261;
    for (let i = 0; i < token.length; i += 1) {
      hash ^= token.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    vector[Math.abs(hash) % dimensions] += 1;
  }

  const norm = Math.sqrt(vector.reduce((sum, value) => sum + value * value, 0)) || 1;
  return vector.map((value) => value / norm);
}

async function openAiEmbedding(input) {
  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.openAiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ model: OPENAI_EMBEDDING_MODEL, input })
  });

  if (!response.ok) throw new Error('OpenAI embedding request failed');
  const data = await response.json();
  return data.data[0].embedding;
}

async function geminiEmbedding(input) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_EMBEDDING_MODEL}:embedContent?key=${env.geminiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: `models/${GEMINI_EMBEDDING_MODEL}`,
        content: { parts: [{ text: input }] }
      })
    }
  );

  if (!response.ok) throw new Error('Gemini embedding request failed');
  const data = await response.json();
  return data.embedding.values;
}

export async function generateEmbedding(input) {
  if (env.openAiKey) {
    try {
      return await openAiEmbedding(input);
    } catch (error) {
      console.error('OpenAI embedding failed, using local fallback:', error.message);
    }
  }

  if (env.geminiKey) {
    try {
      return await geminiEmbedding(input);
    } catch (error) {
      console.error('Gemini embedding failed, using local fallback:', error.message);
    }
  }

  return localEmbedding(input);
}

export async function generateEmbeddings(chunks) {
  const embedded = [];

  for (const chunk of chunks) {
    const embedding = await generateEmbedding(chunk.text);
    embedded.push({ ...chunk, embedding });
  }

  return embedded;
}

async function openAiText(prompt, temperature = 0.2) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.openAiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: OPENAI_CHAT_MODEL,
      temperature,
      messages: [
        {
          role: 'system',
          content:
            'You are a research assistant. Use only the provided document context. If context is insufficient, say so clearly.'
        },
        { role: 'user', content: prompt }
      ]
    })
  });

  if (!response.ok) throw new Error('OpenAI text generation request failed');
  const data = await response.json();
  return data.choices[0].message.content.trim();
}

async function geminiText(prompt, temperature = 0.2) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_CHAT_MODEL}:generateContent?key=${env.geminiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        generationConfig: { temperature },
        contents: [{ role: 'user', parts: [{ text: prompt }] }]
      })
    }
  );

  if (!response.ok) throw new Error('Gemini text generation request failed');
  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
}

function localText(prompt) {
  const contextMatch = prompt.match(/DOCUMENT CONTEXT:\s*([\s\S]*?)(?:\n\nQUESTION:|\n\nTASK:|$)/i);
  const context = contextMatch?.[1]?.replace(/\s+/g, ' ').trim() || prompt.replace(/\s+/g, ' ').trim();
  const sentences = context.match(/[^.!?]+[.!?]+/g) || [context];
  return sentences.slice(0, 5).join(' ').trim();
}

export async function generateText(prompt, options = {}) {
  if (env.openAiKey) {
    try {
      return await openAiText(prompt, options.temperature);
    } catch (error) {
      console.error('OpenAI text generation failed, using local fallback:', error.message);
    }
  }

  if (env.geminiKey) {
    try {
      return await geminiText(prompt, options.temperature);
    } catch (error) {
      console.error('Gemini text generation failed, using local fallback:', error.message);
    }
  }

  return localText(prompt);
}
