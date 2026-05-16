import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, RefreshCw, Brain, Clock, Target, Lightbulb } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { coachMessages } from '../../data/mockData';
import { useInsights, useProductivityScore, useDailyStats } from '../../hooks/useTauri';
import type { ChatMessage } from '../../types';

// Same response logic as dashboard AI Coach
function generateResponse(
  input: string,
  score?: number | null,
  screenTime?: string | null,
  insights?: Array<{ title: string; description: string }> | null,
): string {
  const q = input.toLowerCase();

  if (q.includes('productivity') || q.includes('productive') || q.includes('score')) {
    if (score) return `Your productivity score is ${score}/100. ${score >= 80 ? "Outstanding work! 🚀" : score >= 60 ? "Good progress — try a deep focus block to push higher. 💪" : "Consider closing distracting apps and trying Pomodoro. 🎯"}`;
    return "I'll check your patterns once we have enough tracking data!";
  }

  if (q.includes('screen') || q.includes('time') || q.includes('how long')) {
    if (screenTime) return `You've been at your screen for ${screenTime} today. Remember to take regular breaks! 🌿`;
    return "Start the tracker to see your screen time stats.";
  }

  if (q.includes('focus') || q.includes('distract') || q.includes('concentrate')) {
    return "Try the Pomodoro technique: 25 minutes focused work, 5 minutes break. I can start a session for you — head to the Focus page! 🧘";
  }

  if (q.includes('break') || q.includes('rest') || q.includes('tired')) {
    return "Rest is productive! Try the 20-20-20 rule: every 20 min, look at something 20 feet away for 20 seconds. Walk if you can. 🌱";
  }

  if (q.includes('insight') || q.includes('pattern')) {
    if (insights && insights.length > 0) return `Here's an insight: "${insights[0].title}" — ${insights[0].description}`;
    return "Check back after more tracking data accumulates! 📊";
  }

  if (q.includes('hi') || q.includes('hello') || q.includes('hey')) {
    return "Hey there! 👋 Ask me anything about productivity, focus tips, screen time, or your work patterns.";
  }

  const defaults = [
    "Based on common patterns, scheduling deep work in the morning and meetings in the afternoon can improve focus. 💡",
    "Try batching communication — check messages 3 times a day instead of constantly. 📱",
    "Your environment matters! Close unnecessary tabs and mute notifications during focus blocks. 🔕",
    "Would you like me to analyze your peak productivity hours? Check the Insights page! 📈",
  ];
  return defaults[Math.floor(Math.random() * defaults.length)];
}

const quickActions = [
  { label: "What's my score?", icon: <Target className="w-3 h-3" /> },
  { label: "Focus tips", icon: <Brain className="w-3 h-3" /> },
  { label: "Screen time?", icon: <Clock className="w-3 h-3" /> },
  { label: "Any insights?", icon: <Lightbulb className="w-3 h-3" /> },
];

export function CoachPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(coachMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: liveScore } = useProductivityScore(30000);
  const { data: liveStats } = useDailyStats(30000);
  const { data: liveInsights } = useInsights(60000);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  const handleSend = (text?: string) => {
    const content = (text || input).trim();
    if (!content) return;
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const response = generateResponse(
        content,
        liveScore?.score ? Math.round(liveScore.score) : null,
        liveStats?.screen_time || null,
        liveInsights,
      );
      setMessages((prev) => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }]);
      setIsTyping(false);
    }, 600 + Math.random() * 600);
  };

  return (
    <div className="flex flex-col h-full p-5 gap-4">
      <div className="mb-1">
        <h1 className="text-[22px] font-bold text-[var(--color-text-primary)] flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-500" />
          AI Coach
        </h1>
        <p className="text-[13px] text-[var(--color-text-muted)]">
          Your personal productivity assistant
        </p>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-2">
        {quickActions.map((action) => (
          <motion.button
            key={action.label}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleSend(action.label)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass text-[11px] font-medium text-[var(--color-text-secondary)] hover:bg-white/60 transition-colors"
          >
            {action.icon} {action.label}
          </motion.button>
        ))}
      </div>

      {/* Chat Area */}
      <GlassCard padding="none" className="flex-1 flex flex-col overflow-hidden">
        <div ref={scrollRef} className="flex-1 px-5 py-4 space-y-4 overflow-y-auto">
          <AnimatePresence>
            {messages.map((msg, i) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.3 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'ai' && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center flex-shrink-0 mr-3 mt-1">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                )}
                <div className={`rounded-2xl px-4 py-2.5 max-w-[70%] ${
                  msg.role === 'user'
                    ? 'bg-indigo-500 text-white rounded-br-md'
                    : 'bg-gray-100/70 text-[var(--color-text-primary)] rounded-bl-md'
                }`}>
                  <p className="text-[13px] leading-relaxed">{msg.content}</p>
                  <p className={`text-[10px] mt-1 ${msg.role === 'user' ? 'text-white/50' : 'text-[var(--color-text-muted)]'}`}>
                    {msg.timestamp}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center">
                <RefreshCw className="w-4 h-4 text-white animate-spin" />
              </div>
              <div className="bg-gray-100/70 rounded-2xl px-4 py-2.5">
                <div className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Input */}
        <div className="px-5 pb-4 pt-2 border-t border-gray-200/30">
          <div className="flex items-center gap-3 rounded-xl bg-gray-100/50 border border-gray-200/40 px-4 py-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              placeholder="Ask anything about your digital habits..."
              className="flex-1 bg-transparent text-[13px] text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] outline-none"
            />
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleSend()}
              disabled={!input.trim() || isTyping}
              className="w-9 h-9 rounded-xl flex items-center justify-center bg-indigo-500 text-white disabled:opacity-30"
            >
              <Send className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
