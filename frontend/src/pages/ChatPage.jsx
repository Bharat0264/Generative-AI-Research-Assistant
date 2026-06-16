import { Send } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import api, { getErrorMessage } from '../api/client';
import Button from '../components/Button';
import Loading from '../components/Loading';
import Textarea from '../components/Textarea';
import { useToast } from '../contexts/ToastContext';

export default function ChatPage() {
  const { id } = useParams();
  const [document, setDocument] = useState(null);
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const { notify } = useToast();
  const bottomRef = useRef(null);

  useEffect(() => {
    Promise.all([api.get(`/documents/${id}`), api.get(`/chat/history/${id}`)])
      .then(([docRes, chatRes]) => {
        setDocument(docRes.data.document);
        setMessages(chatRes.data.chats);
      })
      .catch((error) => notify(getErrorMessage(error), 'error'))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!question.trim()) return;
    const nextQuestion = question.trim();
    setQuestion('');
    setSending(true);
    try {
      const res = await api.post(`/chat/${id}`, { question: nextQuestion });
      setMessages((items) => [...items, res.data.chat]);
    } catch (error) {
      notify(getErrorMessage(error), 'error');
    } finally {
      setSending(false);
    }
  }

  if (loading) return <Loading label="Loading chat" />;

  return (
    <section className="mx-auto flex h-[calc(100vh-3rem)] max-w-5xl flex-col rounded-md border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <header className="border-b border-slate-200 px-5 py-4 dark:border-slate-800">
        <h1 className="font-bold text-ink dark:text-white">AI Chat</h1>
        <p className="text-sm text-slate-500 dark:text-slate-300">{document?.title}</p>
      </header>

      <div className="flex-1 overflow-y-auto p-5 scrollbar-thin">
        {messages.length === 0 && (
          <div className="mx-auto mt-20 max-w-md text-center text-sm text-slate-500 dark:text-slate-300">
            Ask a question. Answers are generated from the most relevant uploaded-document chunks.
          </div>
        )}
        <div className="space-y-5">
          {messages.map((message) => (
            <div key={message._id} className="space-y-3">
              <div className="ml-auto max-w-[82%] rounded-md bg-brand px-4 py-3 text-sm text-white">
                {message.question}
              </div>
              <div className="max-w-[88%] rounded-md bg-slate-100 px-4 py-3 text-sm leading-6 text-slate-800 dark:bg-slate-950 dark:text-slate-100">
                <p className="whitespace-pre-wrap">{message.answer}</p>
                {message.sources?.length > 0 && (
                  <div className="mt-3 border-t border-slate-200 pt-3 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
                    Sources: {message.sources.map((source) => `chunk ${source.index + 1}`).join(', ')}
                  </div>
                )}
              </div>
            </div>
          ))}
          {sending && <Loading label="Generating answer" />}
          <div ref={bottomRef} />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="border-t border-slate-200 p-4 dark:border-slate-800">
        <div className="flex gap-3">
          <Textarea
            className="min-h-12 resize-none"
            placeholder="Ask from this document..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <Button disabled={sending} className="self-end px-4 py-3" title="Send question">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </section>
  );
}
