import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../ui/GlassCard';
import { Sparkles, Send, ArrowRight } from 'lucide-react';
import { useProductivityScore } from '../../hooks/useTauri';
import type { ChatMessage } from '../../types';
import { useAppStore } from '../../stores/appStore';

const quickPrompts = ['Focus tips', 'Screen time', 'Break advice'];

function generateResponse(msg: string, score: number): string {
  const lower = msg.toLowerCase();
  if (lower.includes('focus') || lower.includes('productiv')) {
    return score >= 70
      ? `Your productivity score is ${Math.round(score)}. Solid work. Keep the momentum by scheduling deep-work blocks in the morning.`
      : `Score is ${Math.round(score)}. Try the 50-10 rule: 50 minutes of focused work, then a 10-minute break. Your brain needs the reset.`;
  }
  if (lower.includes('screen') || lower.includes('time')) {
    return `Track screen time patterns across the week. Consistent daily limits outperform aggressive one-day cutoffs.`;
  }
  if (lower.includes('break') || lower.includes('rest')) {
    return `The research is clear: 5-minute breaks every 50 minutes improve sustained attention by 30%. Step away from the screen.`;
  }
  return `Your current score is ${Math.round(score)}. Focused work windows, regular breaks, and limiting app-switching are the three highest-impact levers.`;
}

export function AICoach() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'assistant', content: 'What can I help you optimize?', timestamp: new Date() },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { setActiveNav } = useAppStore();
  const { data: liveScore } = useProductivityScore(30000);
  const score = liveScore?.score ?? 72;

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: text, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    setTimeout(() => {
      const response = generateResponse(text, score);
      const botMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: 'assistant', content: response, timestamp: new Date() };
      setMessages(prev => [...prev, botMsg]);
      setIsLoading(false);
    }, 800);
  };

  return (
    <GlassCard padding="none" delay={0.2} className="flex flex-col h-full min-h-[280px]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid var(--color-hairline)' }}>
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4" style={{ color: 'var(--color-m-blue)' }} />
          <span className="text-[11px] font-bold tracking-[1.5px] uppercase text-white">AI COACH</span>
        </div>
        <button
          onClick={() => setActiveNav('ai-coach')}
          className="text-[10px] font-bold tracking-[1px] uppercase flex items-center gap-1"
          style={{ color: 'var(--color-text-muted)' }}
        >
          EXPAND <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className="max-w-[85%] px-3 py-2 text-[12px]"
              style={{
                background: msg.role === 'user' ? 'var(--color-surface-elevated)' : 'transparent',
                border: msg.role === 'user' ? '1px solid var(--color-hairline)' : 'none',
                color: msg.role === 'user' ? '#fff' : 'var(--color-text-secondary)',
                fontWeight: msg.role === 'user' ? 500 : 300,
              }}
            >
              {msg.content}
            </div>
          </motion.div>
        ))}
        {isLoading && (
          <div className="flex gap-1 px-1 py-2">
            {[0, 1, 2].map(i => (
              <motion.span
                key={i}
                className="w-1.5 h-1.5"
                style={{ background: 'var(--color-text-muted)' }}
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.15 }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Quick Prompts */}
      <div className="flex gap-1.5 px-4 pb-2">
        {quickPrompts.map(p => (
          <button
            key={p}
            onClick={() => sendMessage(p)}
            className="px-2.5 py-1 text-[10px] font-bold tracking-[0.5px] uppercase transition-colors"
            style={{ border: '1px solid var(--color-hairline)', color: 'var(--color-text-muted)', background: 'transparent' }}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="flex items-center gap-2 px-4 py-3" style={{ borderTop: '1px solid var(--color-hairline)' }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
          placeholder="Ask something..."
          className="flex-1 text-[12px] py-2 px-3 outline-none"
          style={{ background: 'var(--color-surface-soft)', border: '1px solid var(--color-hairline)', color: '#fff' }}
        />
        <button
          onClick={() => sendMessage(input)}
          className="w-8 h-8 flex items-center justify-center"
          style={{ background: 'var(--color-m-blue)', color: '#fff' }}
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </GlassCard>
  );
}
