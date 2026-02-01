
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { generateAcademicAdvice } from '../services/gemini.ts';
import { ChatMessage } from '../types.ts';

interface AIAdvisorProps {
  studentData: any;
}

const AIAdvisor: React.FC<AIAdvisorProps> = ({ studentData }) => {
  // Load chat history from localStorage
  const loadChatHistory = (): ChatMessage[] => {
    try {
      const saved = localStorage.getItem(`chat_history_${studentData.rollNumber}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
      }
    } catch (e) {
      console.error('Failed to load chat history:', e);
    }
    return [{
      role: 'assistant',
      content: `Hello ${studentData.name}! I'm your Student Compass AI. I've synced with your profile: ${studentData.branch} (Roll: ${studentData.rollNumber}). How can I help you navigate your URR24 regulations today?`,
      timestamp: new Date()
    }];
  };

  const [messages, setMessages] = useState<ChatMessage[]>(loadChatHistory);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Save chat history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`chat_history_${studentData.rollNumber}`, JSON.stringify(messages));
    } catch (e) {
      console.error('Failed to save chat history:', e);
    }
  }, [messages, studentData.rollNumber]);

  useEffect(() => {
    if (messages.length === 1) {
      setMessages([{
        role: 'assistant',
        content: `Sync complete! Hello ${studentData.name}. I am now processing regulations for ${studentData.branch} Semester ${studentData.semester}. How can I assist you?`,
        timestamp: new Date()
      }]);
    }
  }, [studentData.name, studentData.branch]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async (customInput?: string) => {
    const messageToSend = customInput || input;
    if (!messageToSend.trim() || loading) return;

    const userMsg: ChatMessage = { role: 'user', content: messageToSend, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const advice = await generateAcademicAdvice(messageToSend, studentData);
      setMessages(prev => [...prev, { role: 'assistant', content: advice, timestamp: new Date() }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "I'm having trouble connecting to the regulation database. Please check your internet connection.", 
        timestamp: new Date() 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-12rem)] flex flex-col space-y-4">
      <div className="flex-1 glass rounded-[2.5rem] p-6 lg:p-8 flex flex-col overflow-hidden border border-white/40 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 pb-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <Bot size={28} />
            </div>
            <div>
              <h3 className="font-black text-slate-800 tracking-tight">Regulation Expert</h3>
              <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Active Sync: {studentData.rollNumber}</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest">URR24 Ready</span>
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-6 pr-4 custom-scrollbar">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} items-start gap-4`}>
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 shrink-0 border border-slate-200">
                  <Bot size={18} />
                </div>
              )}
              <div className={`max-w-[85%] lg:max-w-[75%] rounded-[1.5rem] p-5 text-sm leading-relaxed shadow-sm ${
                msg.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-tr-none' 
                : 'bg-slate-50 text-slate-700 rounded-tl-none border border-slate-100'
              }`}>
                {msg.content.split('\n').map((line, idx) => (
                  <p key={idx} className={`${line.startsWith('-') || line.startsWith('1.') ? 'ml-4' : ''} ${idx > 0 ? 'mt-1' : ''}`}>
                    {line}
                  </p>
                ))}
              </div>
              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0 border border-indigo-200 overflow-hidden">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${studentData.name}`} alt="User" />
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex justify-start items-center gap-4">
              <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 animate-pulse border border-slate-200">
                <Bot size={18} />
              </div>
              <div className="bg-slate-50 px-5 py-3 rounded-2xl flex gap-1.5 border border-slate-100">
                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" />
                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
              placeholder="Query URR24 regulations..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-[1.5rem] px-6 py-4 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-800 transition-all font-medium placeholder:text-slate-400"
            />
            <button
              onClick={handleSend}
              disabled={loading}
              className="w-14 h-14 bg-indigo-600 text-white rounded-[1.5rem] flex items-center justify-center hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50 shadow-lg shadow-indigo-100"
            >
              <Send size={22} />
            </button>
          </div>
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2 scrollbar-hide">
            {[
              "Analyze my current performance",
              "What subjects need attention?",
              "Am I on track for promotion?",
              "Placement preparation roadmap",
              "Explain URR24 grading system"
            ].map((text) => (
              <button 
                key={text}
                onClick={() => handleSend(text)}
                className="whitespace-nowrap px-4 py-2 bg-white text-slate-500 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-indigo-50 hover:text-indigo-600 border border-slate-100 transition-colors"
              >
                {text}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-indigo-50 border border-indigo-100 rounded-[2rem] p-6 flex items-start gap-5">
        <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center shrink-0 shadow-md">
          <Sparkles size={20} />
        </div>
        <div>
          <h4 className="font-black text-indigo-900 text-xs uppercase tracking-widest mb-1">AI Recommendation for {studentData.name}</h4>
          <p className="text-xs text-indigo-700 leading-relaxed font-medium">
            Based on your {studentData.attendance}% attendance, you are currently in the {studentData.attendance < 75 ? 'danger zone' : 'safe zone'}. 
            {studentData.attendance < 75 ? ' I recommend submitting a medical certificate per Clause 4.2 immediately.' : ' Continue regular attendance to maintain honors eligibility.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIAdvisor;
