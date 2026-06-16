import { FileUp, Library, MessageSquareText, ScrollText } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { getErrorMessage } from '../api/client';
import Button from '../components/Button';
import DocumentCard from '../components/DocumentCard';
import EmptyState from '../components/EmptyState';
import Loading from '../components/Loading';
import { useToast } from '../contexts/ToastContext';

export default function DashboardPage() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { notify } = useToast();
  const navigate = useNavigate();

  async function loadDocuments() {
    setLoading(true);
    try {
      const res = await api.get('/documents');
      setDocuments(res.data.documents);
    } catch (error) {
      notify(getErrorMessage(error), 'error');
    } finally {
      setLoading(false);
    }
  }

  async function deleteDocument(id) {
    if (!confirm('Delete this document and all related chats and reports?')) return;
    try {
      await api.delete(`/documents/${id}`);
      setDocuments((items) => items.filter((item) => item._id !== id));
      notify('Document deleted');
    } catch (error) {
      notify(getErrorMessage(error), 'error');
    }
  }

  useEffect(() => {
    loadDocuments();
  }, []);

  const stats = [
    { label: 'Documents', value: documents.length, icon: Library },
    { label: 'Chunked sources', value: documents.reduce((sum, doc) => sum + (doc.chunks?.length || 0), 0), icon: ScrollText },
    { label: 'Ready for chat', value: documents.filter((doc) => (doc.chunks?.length || 0) > 0).length, icon: MessageSquareText }
  ];

  return (
    <section className="mx-auto max-w-7xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink dark:text-white">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">Manage papers, summaries, chats, and reports.</p>
        </div>
        <Button onClick={() => navigate('/upload')}>
          <FileUp className="h-4 w-4" />
          Upload PDF
        </Button>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-md border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500 dark:text-slate-300">{stat.label}</p>
              <stat.icon className="h-5 w-5 text-brand" />
            </div>
            <p className="mt-3 text-3xl font-bold text-ink dark:text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8">
        {loading ? (
          <Loading label="Loading documents" />
        ) : documents.length === 0 ? (
          <EmptyState
            title="No documents yet"
            description="Upload a PDF research paper to extract text, generate embeddings, and start asking grounded questions."
            action="Upload PDF"
            onAction={() => navigate('/upload')}
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {documents.map((document) => (
              <DocumentCard key={document._id} document={document} onDelete={deleteDocument} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
