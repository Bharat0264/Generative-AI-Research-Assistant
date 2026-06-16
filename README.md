# Generative AI Research Assistant

A full-stack RAG application for uploading PDF research papers, extracting text, generating embeddings, asking document-grounded questions, summarizing papers, extracting keywords, generating literature-review style reports, and downloading reports as PDF.

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, React Router
- Backend: Node.js, Express, MongoDB, Mongoose
- Auth: JWT and bcrypt password hashing
- PDF processing: `pdf-parse`
- AI: OpenAI API or Gemini API
- Vector search: MongoDB-stored chunk embeddings with cosine-similarity retrieval
- PDF export: `pdfkit`

## Project Structure

```txt
backend/
  src/
    config/
    controllers/
    middleware/
    models/
    routes/
    services/
  uploads/
frontend/
  src/
    api/
    components/
    contexts/
    pages/
    utils/
```

## Features

- User registration and login
- JWT protected API routes
- Upload PDF documents with type and size validation
- Extract PDF text and split it into overlapping chunks
- Generate embeddings for every chunk
- Retrieve relevant chunks for RAG chat answers
- Generate summaries and important keywords
- Generate literature review and research report sections
- Chat history per document
- Dashboard with uploaded document cards
- Document deletion with related chats and reports
- Download generated reports as PDF
- Responsive professional UI with dark and light mode

## Setup

1. Copy the environment template:

```bash
cp .env.example backend/.env
cp .env.example frontend/.env
```

2. Edit `backend/.env`:

```env
MONGO_URI=mongodb://127.0.0.1:27017/generative-ai-research-assistant
JWT_SECRET=replace-with-a-long-random-secret
PORT=5000
CLIENT_URL=http://localhost:5173
OPENAI_API_KEY=
GEMINI_API_KEY=
```

3. Edit `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

4. Install and run the backend:

```bash
cd backend
npm install
npm run dev
```

5. Install and run the frontend:

```bash
cd frontend
npm install
npm run dev
```

6. Open:

```txt
http://localhost:5173
```

## API Routes

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/documents/upload`
- `GET /api/documents`
- `GET /api/documents/:id`
- `DELETE /api/documents/:id`
- `POST /api/chat/:documentId`
- `GET /api/chat/history/:documentId`
- `POST /api/summary/:documentId`
- `POST /api/report/:documentId`
- `GET /api/report/download/:reportId`

## RAG Workflow

1. The user uploads a PDF.
2. The backend extracts readable text with `pdf-parse`.
3. Text is split into overlapping chunks.
4. Each chunk is embedded with OpenAI, Gemini, or the local development fallback.
5. Chunks and embeddings are stored on the `Document`.
6. A question is embedded.
7. Cosine similarity retrieves the most relevant chunks.
8. Only retrieved chunks are sent to the AI model.
9. The answer and source previews are saved in chat history.

## Notes

- Add either `OPENAI_API_KEY` or `GEMINI_API_KEY` for production-quality generation.
- Without an AI key, the project still runs with local fallback embeddings and extractive responses for development testing.
- File uploads are stored in `backend/uploads`.
- Users can only access documents, chats, and reports that belong to their own account.

## Test PDF Source

Use arXiv to download open research PDFs for testing. Example:

```txt
https://arxiv.org/pdf/1706.03762
```

## Deployment

### Backend on Render

1. Push this repository to GitHub.
2. In Render, create a new Blueprint or Web Service from this repo.
3. Render can use `render.yaml`, which points to the `backend` folder.
4. Set these Render environment variables:

```env
MONGO_URI=your-mongodb-atlas-uri
JWT_SECRET=your-long-random-secret
CLIENT_URL=https://your-vercel-app.vercel.app
GEMINI_API_KEY=your-gemini-key
GEMINI_CHAT_MODEL=gemini-1.5-flash
GEMINI_EMBEDDING_MODEL=text-embedding-004
MAX_FILE_SIZE_MB=15
```

5. After deploy, confirm:

```txt
https://your-render-service.onrender.com/api/health
```

### Frontend on Vercel

1. Import the GitHub repository in Vercel.
2. Use the root project. `vercel.json` builds the `frontend` folder.
3. Set this Vercel environment variable:

```env
VITE_API_URL=https://your-render-service.onrender.com/api
```

4. Redeploy the frontend after setting the Render API URL.

### Connect Frontend and Backend

After both URLs exist:

- In Render, set `CLIENT_URL` to your Vercel URL.
- In Vercel, set `VITE_API_URL` to your Render backend URL plus `/api`.
- If you also want local development allowed, set Render `CLIENT_URL` as comma-separated origins:

```env
CLIENT_URL=http://localhost:5173,https://your-vercel-app.vercel.app
```
