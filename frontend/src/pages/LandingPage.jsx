import { ArrowRight, FileSearch, Lock, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-paper text-ink dark:bg-slate-950 dark:text-white">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
        <Link to="/" className="flex items-center gap-3 font-bold">
          <span className="grid h-10 w-10 place-items-center rounded-md bg-brand text-white">
            <FileSearch className="h-5 w-5" />
          </span>
          ResearchAI
        </Link>
        <div className="flex gap-2">
          <Link to="/login">
            <Button variant="ghost">Login</Button>
          </Link>
          <Link to="/register">
            <Button>Register</Button>
          </Link>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <p className="mb-4 inline-flex items-center gap-2 rounded-md bg-white px-3 py-1 text-sm font-medium text-brand shadow-sm dark:bg-slate-900">
            <Sparkles className="h-4 w-4" />
            Document-grounded research intelligence
          </p>
          <h1 className="max-w-3xl text-4xl font-bold leading-tight sm:text-5xl">
            Generative AI Research Assistant
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
            Upload research papers, build document embeddings, ask grounded questions, summarize findings, and produce report-ready research drafts from your own PDFs.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/register">
              <Button className="px-5 py-3">
                Start workspace <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="secondary" className="px-5 py-3">
                Open dashboard
              </Button>
            </Link>
          </div>
        </div>

        <div className="rounded-md border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm font-semibold">RAG pipeline</span>
            <span className="rounded-md bg-emerald-50 px-2 py-1 text-xs font-semibold text-mint dark:bg-emerald-950">
              Secure
            </span>
          </div>
          {[
            'PDF text extraction',
            'Chunking with overlap',
            'Embedding generation',
            'Vector retrieval',
            'Context-only AI answers',
            'PDF report export'
          ].map((item, index) => (
            <div key={item} className="flex items-center gap-3 border-t border-slate-100 py-3 dark:border-slate-800">
              <span className="grid h-7 w-7 place-items-center rounded-md bg-blue-50 text-sm font-bold text-brand dark:bg-blue-950">
                {index + 1}
              </span>
              <span className="text-sm text-slate-700 dark:text-slate-200">{item}</span>
            </div>
          ))}
          <div className="mt-4 flex items-center gap-2 rounded-md bg-slate-50 p-3 text-sm text-slate-600 dark:bg-slate-950 dark:text-slate-300">
            <Lock className="h-4 w-4 text-mint" />
            JWT protected routes and per-user document ownership checks.
          </div>
        </div>
      </section>
    </main>
  );
}
