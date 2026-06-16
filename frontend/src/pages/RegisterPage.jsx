import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import Button from '../components/Button';
import Input from '../components/Input';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { getErrorMessage } from '../api/client';

export default function RegisterPage() {
  const { register } = useAuth();
  const { notify } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    try {
      await register(form);
      notify('Account created');
      navigate('/dashboard');
    } catch (error) {
      notify(getErrorMessage(error), 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-paper px-4 dark:bg-slate-950">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-md bg-white p-8 shadow-soft dark:bg-slate-900">
        <h1 className="text-2xl font-bold text-ink dark:text-white">Create Account</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">Build a private library of searchable papers.</p>
        <div className="mt-6 space-y-4">
          <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <Input label="Password" type="password" minLength={8} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        </div>
        <Button className="mt-6 w-full" disabled={loading}>
          <UserPlus className="h-4 w-4" />
          {loading ? 'Creating...' : 'Register'}
        </Button>
        <p className="mt-5 text-center text-sm text-slate-500">
          Already have an account? <Link to="/login" className="font-semibold text-brand">Login</Link>
        </p>
      </form>
    </main>
  );
}
