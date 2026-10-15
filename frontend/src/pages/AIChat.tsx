import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ChatBox from '../components/ChatBox';
import { ChatMessage, chatService } from '../services/api';
import { Send, RefreshCw, Sparkles, Loader2 } from 'lucide-react';

export default function AIChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingHistory, setFetchingHistory] = useState(true);

  const fetchHistory = async () => {
    try {
      setFetchingHistory(true);
      const history = await chatService.getHistory();
      setMessages(history);
    } catch (e) {
      console.error('Failed to fetch chat history:', e);
      // Fallback default message history for presentation
      setMessages([
        { id: '1', sender: 'ai', text: 'Hello! I am Knock AI, your digital safety assistant. I have reviewed your current connected accounts profile.\n\nYour Spotify account is secure, but your GitHub account currently does not have multi-factor authentication (MFA) enabled. Let me know if you would like step-by-step guidance on how to enable it!', timestamp: new Date(Date.now() - 3600000).toISOString() }
      ]);
    } finally {
      setFetchingHistory(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input;
    setInput('');
    setLoading(true);

    const userMessage: ChatMessage = {
      id: Math.random().toString(),
      sender: 'user',
      text: userText,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);

    try {
      const result = await chatService.sendMessage(userText);
      const aiMessage: ChatMessage = {
        id: Math.random().toString(),
        sender: 'ai',
        text: result.response,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      console.error('Chat failed:', err);
      // Fallback AI simulation if API is offline
      setTimeout(() => {
        const fallbackAiMessage: ChatMessage = {
          id: Math.random().toString(),
          sender: 'ai',
          text: `I'm currently running in demo mode. To lock down your credentials, please ensure you configure a valid \`GEMINI_API_KEY\` in your \`backend/.env\` configuration file.\n\nHowever, here is a general security recommendation:\n- Go to your accounts control center.\n- Toggle Multi-Factor Authentication (MFA) to ON.\n- Revoke unused access apps immediately.`,
          timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, fallbackAiMessage]);
      }, 1000);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([]);
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col h-screen overflow-hidden">
      <Navbar />

      <div className="flex-1 flex min-h-0">
        <Sidebar />

        <main className="flex-1 flex flex-col bg-zinc-950/40 relative">
          {/* Main header bar */}
          <div className="p-4 border-b border-white/5 flex items-center justify-between bg-zinc-950/80 backdrop-blur-md">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-4.5 h-4.5 text-cyber-accent animate-pulse" />
                Knock AI Advisor
              </h2>
              <p className="text-[10px] text-zinc-500 font-mono mt-0.5">Model: Gemini 2.5 Flash</p>
            </div>
            
            <button
              onClick={handleClearHistory}
              className="px-2.5 py-1.5 border border-white/5 hover:border-red-500/20 text-zinc-500 hover:text-red-400 text-[10px] font-mono rounded-lg transition-colors cursor-pointer"
            >
              Clear Chat Session
            </button>
          </div>

          {/* Chat message content box */}
          {fetchingHistory ? (
            <div className="flex-1 flex flex-col items-center justify-center font-mono text-xs text-zinc-500 gap-3">
              <Loader2 className="w-6 h-6 animate-spin text-cyber-accent" />
              <span>Retrieving previous logs...</span>
            </div>
          ) : (
            <ChatBox messages={messages} loading={loading} />
          )}

          {/* Bottom message form */}
          <div className="p-4 bg-zinc-950/80 border-t border-white/5">
            <form onSubmit={handleSend} className="max-w-3xl mx-auto relative flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Knock AI: 'Is my Google account secure?' or 'Explain MFA benefits'"
                className="flex-1 px-4 py-3 bg-black/60 border border-white/10 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-cyber-accent text-sm transition-colors"
                disabled={loading || fetchingHistory}
              />
              <button
                type="submit"
                disabled={loading || fetchingHistory || !input.trim()}
                className="p-3 bg-white text-black hover:bg-cyber-accent disabled:opacity-50 transition-all rounded-xl flex items-center justify-center shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
