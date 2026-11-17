import React, { useEffect, useRef, useState } from 'react';
import { MessageSquare, Send, X, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { fetchChatHistory, sendChatMessage } from '../services/api';
import type { ChatMessageItem } from '../types';

function getOrCreateSessionKey(): string {
  const existing = sessionStorage.getItem('farmer_chat_session_key');
  if (existing) return existing;
  const created = `guest_${Math.random().toString(36).slice(2, 11)}`;
  sessionStorage.setItem('farmer_chat_session_key', created);
  return created;
}

export const ChatbotWidget: React.FC<{ embedded?: boolean }> = ({ embedded = false }) => {
  const { i18n } = useTranslation();
  const { token } = useAuth();
  const [open, setOpen] = useState(embedded);
  const [messages, setMessages] = useState<ChatMessageItem[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionKey] = useState(getOrCreateSessionKey);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    fetchChatHistory(sessionKey, token)
      .then((hist) => {
        if (hist.length > 0) setMessages(hist);
      })
      .catch(() => {});
  }, [open, sessionKey, token]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, sending]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || sending) return;

    setError(null);
    setMessages((prev) => [...prev, { role: 'user', content: trimmed }]);
    setInput('');
    setSending(true);

    try {
      const reply = await sendChatMessage(
        { message: trimmed, language: i18n.language || 'en', sessionKey },
        token
      );
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to reach Farmer Assistant. Please try again.'
      );
    } finally {
      setSending(false);
    }
  };

  const quickPrompts = [
    'What are the benefits of PM-KISAN?',
    'Which documents are required for PMFBY?',
    'Tell me about Karnataka Krishi Bhagya',
    'How does Drip Irrigation save water?',
  ];

  const chatBody = (
    <div
      className={`flex flex-col bg-white border border-[#E5E7EB] ${
        embedded
          ? 'rounded-md h-[540px] w-full'
          : 'rounded-lg shadow-2xl w-[92vw] sm:w-[390px] h-[500px]'
      }`}
    >
      {/* Header */}
      <div className="bg-[#17613A] text-white px-4 py-3 flex items-center justify-between rounded-t-md">
        <div>
          <h3 className="text-sm font-bold">Farmer Scheme Assistant</h3>
          <p className="text-[11px] text-white/80">
            Grounded in verified portal knowledge
          </p>
        </div>
        {!embedded && (
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close Farmer Assistant"
            className="p-1.5 rounded hover:bg-[#207747] text-white"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#F5F8F5]">
        {messages.length === 0 && (
          <div className="bg-white border border-[#E5E7EB] rounded p-3.5 text-sm text-[#303030]">
            <p className="font-semibold text-[#17613A]">
              Namaste! How can I help you today?
            </p>
            <p className="mt-1 text-xs text-[#303030]/80 leading-relaxed">
              Ask about Central or Karnataka agricultural schemes, eligibility criteria, required documents, crops, soils, or irrigation technologies.
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {quickPrompts.map((qp) => (
                <button
                  key={qp}
                  type="button"
                  onClick={() => setInput(qp)}
                  className="text-left text-xs px-2.5 py-1.5 bg-[#F5F8F5] hover:bg-[#17613A] hover:text-white border border-[#E5E7EB] rounded transition-colors"
                >
                  {qp}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded px-3.5 py-2.5 text-sm whitespace-pre-wrap leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-[#17613A] text-white'
                  : 'bg-white border border-[#E5E7EB] text-[#303030]'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {sending && (
          <div className="flex justify-start">
            <div className="bg-white border border-[#E5E7EB] rounded px-3.5 py-2.5 text-sm text-[#17613A] inline-flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Checking verified portal records...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded p-2.5">
            {error}
          </div>
        )}
      </div>

      {/* Input */}
      <form
        onSubmit={handleSend}
        className="p-3 bg-white border-t border-[#E5E7EB] flex items-center gap-2 rounded-b-md"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about schemes, documents, crops..."
          className="flex-1 px-3 py-2 text-sm border border-[#E5E7EB] rounded focus:outline-none focus:border-[#17613A]"
        />
        <button
          type="submit"
          disabled={sending || !input.trim()}
          aria-label="Send message"
          className="px-3.5 py-2 bg-[#F47721] hover:bg-[#d96312] disabled:opacity-50 text-white rounded text-sm font-semibold inline-flex items-center gap-1.5 transition-colors"
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">Send</span>
        </button>
      </form>
    </div>
  );

  if (embedded) return chatBody;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {open ? (
        chatBody
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-3 bg-[#F47721] hover:bg-[#d96312] text-white font-semibold text-sm rounded-full shadow-lg transition-colors"
        >
          <MessageSquare className="w-4 h-4" aria-hidden="true" />
          <span>Ask Farmer Assistant</span>
        </button>
      )}
    </div>
  );
};
