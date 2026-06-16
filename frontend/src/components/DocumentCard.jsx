import { Calendar, FileText, MessageCircle, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDate } from '../utils/format';
import Button from './Button';

export default function DocumentCard({ document, onDelete }) {
  return (
    <article className="rounded-md border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start gap-4">
        <div className="rounded-md bg-blue-50 p-3 text-brand dark:bg-blue-950">
          <FileText className="h-6 w-6" />
        </div>
        <div className="min-w-0 flex-1">
          <Link
            to={`/documents/${document._id}`}
            className="line-clamp-2 font-semibold text-ink hover:text-brand dark:text-white"
          >
            {document.title}
          </Link>
          <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-500 dark:text-slate-300">
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {formatDate(document.createdAt)}
            </span>
            <span className="inline-flex items-center gap-1">
              <MessageCircle className="h-3.5 w-3.5" />
              {document.chunks?.length || 0} chunks
            </span>
          </div>
        </div>
      </div>
      <div className="mt-5 flex items-center justify-between gap-3">
        <Link to={`/documents/${document._id}/chat`} className="text-sm font-semibold text-brand">
          Ask questions
        </Link>
        <Button variant="ghost" className="px-2" onClick={() => onDelete(document._id)} title="Delete document">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </article>
  );
}
