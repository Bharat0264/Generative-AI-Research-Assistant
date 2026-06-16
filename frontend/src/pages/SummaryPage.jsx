import { Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api, { getErrorMessage } from '../api/client';
import Button from '../components/Button';
import Loading from '../components/Loading';
import { useToast } from '../contexts/ToastContext';

export default function SummaryPage() {
  const { id } = useParams();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const { notify } = useToast();

  async function loadDocument() {
    setLoading(true);
    try {
      const res = await api.get(`/documents/${id}`);
      setDocument(res.data.document);
    } catch (error) {
      notify(getErrorMessage(error), 'error');
    } finally {
      setLoading(false);
    }
  }

  async function generateSummary() {
    setGenerating(true);
    try {
      const res = await api.post(`/summary/${id}`);
      setDocument(res.data.document);
      notify('Summary generated');
    } catch (error) {
      notify(getErrorMessage(error), 'error');
    } finally {
      setGenerating(false);
    }
  }

  useEffect(() => {
    loadDocument();
  }, [id]);

  if (loading) return <Loading label="Loading summary" />;

  return (
    <section className="mx-auto max-w-5xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink dark:text-white">Summary</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">{document?.title}</p>
        </div>
        <Button onClick={generateSummary} disabled={generating}>
          <Sparkles className="h-4 w-4" />
          {generating ? 'Generating...' : 'Generate summary'}
        </Button>
      </div>

      <div className="mt-6 rounded-md border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="font-semibold text-ink dark:text-white">Document Summary</h2>
        <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-600 dark:text-slate-300">
          {document?.summary || 'Generate a summary to see a document-level overview here.'}
        </p>
      </div>

      <div className="mt-6 rounded-md border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="font-semibold text-ink dark:text-white">Important Keywords</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {(document?.keywords || []).length === 0 && (
            <p className="text-sm text-slate-500 dark:text-slate-300">No keywords extracted yet.</p>
          )}
          {(document?.keywords || []).map((keyword) => (
            <span key={keyword} className="rounded-md bg-blue-50 px-3 py-1.5 text-sm font-medium text-brand dark:bg-blue-950">
              {keyword}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
