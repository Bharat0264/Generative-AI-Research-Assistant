import { Download, FileText } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api, { getErrorMessage } from '../api/client';
import Button from '../components/Button';
import Input from '../components/Input';
import Loading from '../components/Loading';
import { useToast } from '../contexts/ToastContext';

const sections = [
  ['introduction', 'Introduction'],
  ['literatureReview', 'Literature Review'],
  ['methodology', 'Methodology'],
  ['keyFindings', 'Key Findings'],
  ['conclusion', 'Conclusion']
];

export default function ReportPage() {
  const { id } = useParams();
  const [document, setDocument] = useState(null);
  const [report, setReport] = useState(null);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const { notify } = useToast();

  useEffect(() => {
    api
      .get(`/documents/${id}`)
      .then((res) => {
        setDocument(res.data.document);
        setReport(res.data.report);
        setTitle(res.data.report?.title || `${res.data.document.title} Research Report`);
      })
      .catch((error) => notify(getErrorMessage(error), 'error'))
      .finally(() => setLoading(false));
  }, [id]);

  async function generateReport() {
    setGenerating(true);
    try {
      const res = await api.post(`/report/${id}`, { title });
      setReport(res.data.report);
      notify('Report generated');
    } catch (error) {
      notify(getErrorMessage(error), 'error');
    } finally {
      setGenerating(false);
    }
  }

  async function downloadReport() {
    if (!report?._id) return;
    try {
      const res = await api.get(`/report/download/${report._id}`, { responseType: 'blob' });
      const url = URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const link = window.document.createElement('a');
      link.href = url;
      link.download = `${report.title.replace(/[^a-z0-9]/gi, '-')}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      notify(getErrorMessage(error), 'error');
    }
  }

  if (loading) return <Loading label="Loading report" />;

  return (
    <section className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink dark:text-white">Report Generation</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">{document?.title}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={generateReport} disabled={generating}>
            <FileText className="h-4 w-4" />
            {generating ? 'Generating...' : 'Generate report'}
          </Button>
          <Button variant="secondary" onClick={downloadReport} disabled={!report}>
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </div>

      <div className="mt-6 rounded-md border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <Input label="Report title" value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>

      <div className="mt-6 rounded-md border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-3xl">
          <p className="text-center text-sm uppercase tracking-widest text-slate-500 dark:text-slate-400">Research Report Preview</p>
          <h2 className="mt-3 text-center text-3xl font-bold text-ink dark:text-white">{report?.title || title}</h2>
          <div className="mt-8 space-y-7">
            {sections.map(([key, label]) => (
              <section key={key}>
                <h3 className="border-b border-slate-200 pb-2 text-lg font-semibold text-ink dark:border-slate-800 dark:text-white">
                  {label}
                </h3>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-600 dark:text-slate-300">
                  {report?.[key] || 'This section will appear after report generation.'}
                </p>
              </section>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
