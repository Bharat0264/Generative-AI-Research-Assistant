import { FileText } from 'lucide-react';
import Button from './Button';

export default function EmptyState({ title, description, action, onAction }) {
  return (
    <div className="rounded-md border border-dashed border-slate-300 bg-white p-10 text-center dark:border-slate-700 dark:bg-slate-900">
      <FileText className="mx-auto mb-4 h-10 w-10 text-slate-400" />
      <h2 className="text-lg font-semibold text-ink dark:text-white">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-slate-500 dark:text-slate-300">{description}</p>
      {action && (
        <Button className="mt-5" onClick={onAction}>
          {action}
        </Button>
      )}
    </div>
  );
}
