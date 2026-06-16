import { Mail, UserCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { formatDate } from '../utils/format';

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <section className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold text-ink dark:text-white">Profile</h1>
      <div className="mt-6 rounded-md border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-4">
          <div className="grid h-16 w-16 place-items-center rounded-md bg-blue-50 text-brand dark:bg-blue-950">
            <UserCircle className="h-9 w-9" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-ink dark:text-white">{user?.name}</h2>
            <p className="mt-1 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-300">
              <Mail className="h-4 w-4" />
              {user?.email}
            </p>
          </div>
        </div>
        <dl className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-md bg-slate-50 p-4 dark:bg-slate-950">
            <dt className="text-sm text-slate-500 dark:text-slate-400">Member since</dt>
            <dd className="mt-1 font-semibold text-ink dark:text-white">{user?.createdAt ? formatDate(user.createdAt) : 'Today'}</dd>
          </div>
          <div className="rounded-md bg-slate-50 p-4 dark:bg-slate-950">
            <dt className="text-sm text-slate-500 dark:text-slate-400">Access</dt>
            <dd className="mt-1 font-semibold text-ink dark:text-white">Private document workspace</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
