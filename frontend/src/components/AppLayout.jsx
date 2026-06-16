import {
  FileUp,
  FolderOpen,
  Home,
  LogOut,
  Moon,
  Search,
  Sun,
  User,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import Button from './Button';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: Home },
  { to: '/upload', label: 'Upload', icon: FileUp },
  { to: '/documents', label: 'Documents', icon: FolderOpen },
  { to: '/profile', label: 'Profile', icon: User }
];

export default function AppLayout() {
  const { logout, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const sidebar = (
    <aside className="flex h-full w-72 flex-col border-r border-slate-200 bg-white px-4 py-5 dark:border-slate-800 dark:bg-slate-950">
      <button className="flex items-center gap-3 px-2 text-left" onClick={() => navigate('/dashboard')}>
        <span className="grid h-10 w-10 place-items-center rounded-md bg-brand text-white">
          <Search className="h-5 w-5" />
        </span>
        <span>
          <span className="block font-bold text-ink dark:text-white">ResearchAI</span>
          <span className="text-xs text-slate-500">RAG document workspace</span>
        </span>
      </button>

      <nav className="mt-8 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition ${
                isActive
                  ? 'bg-blue-50 text-brand dark:bg-blue-950'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900'
              }`
            }
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto space-y-3 border-t border-slate-200 pt-4 dark:border-slate-800">
        <div className="px-2 text-sm">
          <p className="font-semibold text-ink dark:text-white">{user?.name}</p>
          <p className="truncate text-slate-500 dark:text-slate-400">{user?.email}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" className="flex-1 px-3" onClick={toggleTheme}>
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            Theme
          </Button>
          <Button
            variant="ghost"
            className="px-3"
            onClick={() => {
              logout();
              navigate('/');
            }}
            title="Log out"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-paper dark:bg-slate-950">
      <div className="lg:hidden">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-950">
          <button className="font-bold text-ink dark:text-white" onClick={() => navigate('/dashboard')}>
            ResearchAI
          </button>
          <Button variant="ghost" className="px-2" onClick={() => setOpen((value) => !value)}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </header>
      </div>
      <div className="flex min-h-screen">
        <div className="hidden lg:block">{sidebar}</div>
        {open && <div className="fixed inset-y-0 left-0 z-40 lg:hidden">{sidebar}</div>}
        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
