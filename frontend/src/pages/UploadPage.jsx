import { UploadCloud } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { getErrorMessage } from '../api/client';
import Button from '../components/Button';
import Input from '../components/Input';
import { useToast } from '../contexts/ToastContext';

export default function UploadPage() {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const { notify } = useToast();
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    if (!file) {
      notify('Select a PDF file first', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('pdf', file);
    if (title.trim()) formData.append('title', title.trim());

    setLoading(true);
    try {
      const res = await api.post('/documents/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      notify('PDF processed and indexed');
      navigate(`/documents/${res.data.document._id}`);
    } catch (error) {
      notify(getErrorMessage(error), 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold text-ink dark:text-white">Upload Document</h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">PDFs are parsed, chunked, embedded, and added to your private workspace.</p>

      <form onSubmit={handleSubmit} className="mt-6 rounded-md border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <Input label="Document title" placeholder="Optional title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <label className="mt-5 block rounded-md border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center transition hover:border-brand dark:border-slate-700 dark:bg-slate-950">
          <UploadCloud className="mx-auto h-10 w-10 text-brand" />
          <span className="mt-3 block font-semibold text-ink dark:text-white">
            {file ? file.name : 'Choose a PDF document'}
          </span>
          <span className="mt-1 block text-sm text-slate-500 dark:text-slate-300">PDF only, up to the backend file size limit.</span>
          <input
            type="file"
            accept="application/pdf"
            className="sr-only"
            onChange={(event) => setFile(event.target.files?.[0] || null)}
          />
        </label>
        <Button className="mt-6 w-full py-3" disabled={loading}>
          <UploadCloud className="h-4 w-4" />
          {loading ? 'Extracting, chunking, and embedding...' : 'Upload and index'}
        </Button>
      </form>
    </section>
  );
}
