import { Bot, Download, FileText, MessageSquare, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api, { getErrorMessage } from '../api/client';
import Button from '../components/Button';
import Loading from '../components/Loading';
import { useToast } from '../contexts/ToastContext';
import { fileApiUrl, formatDate } from '../utils/format';

export default function DocumentDetailsPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { notify } = useToast();

  useEffect(() => {
    api
      .get(`/documents/${id}`)
      .then((res) => setData(res.data))
      .catch((error) => notify(getErrorMessage(error), 'error'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loading label="Loading document" />;
  if (!data?.document) return null;

  const { document, report } = data;

  return (
    <section className="mx-auto max-w-6xl">
      <div className="rounded-md border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="mb-2 text-sm text-slate-500 dark:text-slate-300">Uploaded {formatDate(document.createdAt)}</p>
            <h1 className="text-2xl font-bold text-ink dark:text-white">{document.title}</h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">
              {document.chunks.length} searchable chunks created from {document.originalName}
            </p>
          </div>
          <a href={fileApiUrl(document.fileUrl)} target="_blank" rel="noreferrer">
            <Button variant="secondary">
              <Download className="h-4 w-4" />
              Open PDF
            </Button>
          </a>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <Link to={`/documents/${id}/chat`}>
            <Button className="w-full py-3">
              <MessageSquare className="h-4 w-4" />
              AI Chat
            </Button>
          </Link>
          <Link to={`/documents/${id}/summary`}>
            <Button variant="secondary" className="w-full py-3">
              <Sparkles className="h-4 w-4" />
              Summary
            </Button>
          </Link>
          <Link to={`/documents/${id}/report`}>
            <Button variant="secondary" className="w-full py-3">
              <FileText className="h-4 w-4" />
              Report
            </Button>
          </Link>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <div className="rounded-md border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="font-semibold text-ink dark:text-white">Summary</h2>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-600 dark:text-slate-300">
            {document.summary || 'No summary generated yet.'}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {(document.keywords || []).map((keyword) => (
              <span key={keyword} className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                {keyword}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-md border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="font-semibold text-ink dark:text-white">Latest Report</h2>
          {report ? (
            <div className="mt-3 text-sm text-slate-600 dark:text-slate-300">
              <p className="font-medium text-ink dark:text-white">{report.title}</p>
              <p className="mt-2 line-clamp-5">{report.keyFindings || report.introduction}</p>
              <Link to={`/documents/${id}/report`}>
                <Button className="mt-4" variant="secondary">View report</Button>
              </Link>
            </div>
          ) : (
            <div className="mt-4 flex items-start gap-3 rounded-md bg-slate-50 p-4 text-sm text-slate-600 dark:bg-slate-950 dark:text-slate-300">
              <Bot className="h-5 w-5 text-brand" />
              Generate a report from retrieved source chunks when you are ready.
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 rounded-md border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="font-semibold text-ink dark:text-white">Indexed Chunks</h2>
        <div className="mt-4 max-h-96 space-y-3 overflow-auto pr-2 scrollbar-thin">
          {document.chunks.map((chunk) => (
            <div key={chunk.index} className="rounded-md bg-slate-50 p-4 dark:bg-slate-950">
              <p className="text-xs font-semibold text-brand">Chunk {chunk.index + 1}</p>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{chunk.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
