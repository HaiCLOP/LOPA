import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, RefreshCw } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { coachMessages } from '../../data/mockData';
import { useInsights, useProductivityScore, useDailyStats } from '../../hooks/useTauri';
import type { ChatMessage } from '../../types';

// Context-aware response generator
function generateResponse(
  input: string,
  score?: number | null,
  screenTime?: string | null,
  insights?: Array<{ title: string; description: string }> | null,
): string {
  const q = input.toLowerCase();

  // Productivity questions
  if (q.includes('productivity') || q.includes('productive') || q.includes('score')) {
    if (score !== undefined && score !== null) {
      if (score >= 80) return `Your productivity score is ${score}/100 — excellent work today! You're in a great flow state. 🚀`;
      if (score >= 60) return `Your score is ${score}/100 — solid day! Try a 25-minute deep focus block to push even higher. 💪`;
      return `Your productivity score is ${score}/100. I'd recommend closing distracting apps and trying a Pomodoro session. Want me to start one? 🎯`;
    }
    return "I'll check your productivity patterns once we have enough data. Keep using your apps naturally!";
  }

  // Screen time questions
  if (q.includes('screen') || q.includes('time') || q.includes('how long')) {
    if (screenTime) return `You've been at your screen for ${screenTime} today. ${parseFloat(screenTime) > 6 ? "That's quite a lot — consider taking a break! 👀" : "Good balance so far. 🌿"}`;
    return "I'll start tracking your screen time once the tracker is running. Check the dashboard for live updates!";
  }

  // Focus questions
  if (q.includes('focus') || q.includes('distract') || q.includes('concentrate')) {
    return "Great question! Here are my tips: 1) Try a 25-min Pomodoro block, 2) Close social media, 3) Use noise-cancelling audio. Want me to start a focus session? 🧘";
  }

  // Break questions
  if (q.includes('break') || q.includes('rest') || q.includes('tired')) {
    return "Your body needs rest! I recommend the 20-20-20 rule: every 20 minutes, look at something 20 feet away for 20 seconds. Take a 5-minute walk now if you can. 🌱";
  }

  // Insights
  if (q.includes('insight') || q.includes('pattern') || q.includes('trend')) {
    if (insights && insights.length > 0) {
      return `Here's your top insight: "${insights[0].title}" — ${insights[0].description}`;
    }
    return "I'm still learning your patterns. Check back after a full day of tracking for personalized insights! 📊";
  }

  // Greeting
  if (q.includes('hi') || q.includes('hello') || q.includes('hey')) {
    return "Hey there! 👋 I'm your AI wellness coach. Ask me about your productivity, focus tips, or screen time habits.";
  }

  // Default
  const defaults = [
    "That's an interesting thought. Based on your patterns, I'd suggest scheduling your hardest tasks during your peak focus hours. 💡",
    "I'm here to help! Try asking about your productivity score, focus tips, or screen time. 🧠",
    "Good question! Let me think... For best results, try working in 25-minute blocks with 5-minute breaks between them. ⏱️",
    "I'd recommend checking your Insights page for detailed analysis of your work patterns. Shall I navigate there? 📈",
  ];
  return defaults[Math.floor(Math.random() * defaults.length)];
}

export function AICoach() {
  const [messages, setMessages] = useState<ChatMessage[]>(coachMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: liveScore } = useProductivityScore(30000);
  const { data: liveStats } = useDailyStats(30000);
  const { data: liveInsights } = useInsights(60000);

  // Auto scroll on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    const userInput = input.trim();
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Generate context-aware response
    setTimeout(() => {
      const response = generateResponse(
        userInput,
        liveScore?.score ? Math.round(liveScore.score) : null,
        liveStats?.screen_time || null,
        liveInsights,
      );

      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 800 + Math.random() * 600);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <GlassCard padding="none" delay={0.4} className="flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-4 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <h3 className="text-[14px] font-semibold text-[var(--color-text-primary)]">
            AI Coach
          </h3>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </div>
        <button className="text-[12px] font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors">
          See all
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 px-4 pb-3 space-y-3 overflow-y-auto max-h-[160px] min-h-[120px]">
        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.3 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'ai' && (
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center flex-shrink-0 mr-2 mt-1">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
              )}
              <div
                className={`rounded-xl px-3 py-2 max-w-[85%] ${
                  msg.role === 'user'
                    ? 'bg-indigo-500 text-white'
                    : 'bg-gray-100/70 text-[var(--color-text-primary)]'
                }`}
              >
                <p className="text-[12px] leading-relaxed">{msg.content}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2"
          >
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center flex-shrink-0">
              <RefreshCw className="w-3 h-3 text-white animate-spin" />
            </div>
            <div className="bg-gray-100/70 rounded-xl px-3 py-2">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Input */}
      <div className="px-4 pb-4">
        <div className="flex items-center gap-2 rounded-xl bg-gray-100/50 border border-gray-200/40 px-3 py-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about focus, productivity, habits..."
            className="flex-1 bg-transparent text-[12px] text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] outline-none"
          />
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="w-7 h-7 rounded-lg flex items-center justify-center bg-indigo-500 text-white disabled:opacity-30 transition-opacity"
          >
            <Send className="w-3.5 h-3.5" />
          </motion.button>
        </div>
      </div>
    </GlassCard>
  );
}
