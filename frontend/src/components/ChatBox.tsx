import React, { useRef, useEffect } from 'react';
import { Sparkles, User, Loader2 } from 'lucide-react';
import { ChatMessage } from '../services/api';

interface ChatBoxProps {
  messages: ChatMessage[];
  loading: boolean;
}

export default function ChatBox({ messages, loading }: ChatBoxProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length > 0 || loading) {
      scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]);

  // A light-weight parser for rendering basic Markdown (bold, code, lists) safely
  const parseMarkdown = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, i) => {
      let content = line;
      
      // Headers
      if (content.startsWith('### ')) {
        return <h4 key={i} className="text-sm font-bold text-white mt-3 mb-1">{content.replace('### ', '')}</h4>;
      }
      if (content.startsWith('## ')) {
        return <h3 key={i} className="text-base font-bold text-white mt-4 mb-2">{content.replace('## ', '')}</h3>;
      }
      if (content.startsWith('# ')) {
        return <h2 key={i} className="text-lg font-bold text-white mt-4 mb-2">{content.replace('# ', '')}</h2>;
      }

      // Bullets
      if (content.startsWith('- ') || content.startsWith('* ')) {
        const formatted = formatInline(content.substring(2));
        return <li key={i} className="ml-4 list-disc text-xs text-zinc-300 my-1">{formatted}</li>;
      }

      // Checklists
      if (content.startsWith('✔ ') || content.startsWith('[x] ') || content.startsWith('x ')) {
        return <p key={i} className="text-xs text-emerald-400 font-mono flex items-center gap-1.5 my-1">✔ {content.replace(/^[✔x\[\]\s]+/, '')}</p>;
      }

      // Default paragraph
      return <p key={i} className="text-xs text-zinc-300 leading-relaxed my-1.5 min-h-[1em]">{formatInline(content)}</p>;
    });
  };

  // Helper to parse inline formats: **bold**, `code`, etc.
  const formatInline = (text: string): React.ReactNode[] | string => {
    if (!text) return '';
    const parts = [];
    let currentText = text;

    // Regex for bold and code
    const regex = /(\*\*.*?\*\*|`.*?`)/g;
    const matches = currentText.split(regex);

    if (matches.length === 1) return text;

    return matches.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="font-bold text-white">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return <code key={index} className="px-1.5 py-0.5 bg-black/40 border border-white/10 rounded font-mono text-[11px] text-cyber-blue">{part.slice(1, -1)}</code>;
      }
      return part;
    });
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 min-h-0">
      {messages.length === 0 && (
        <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto">
          <div className="p-4 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-cyber-accent mb-4 relative">
            <Sparkles className="w-8 h-8 animate-pulse" />
            <div className="absolute inset-0 bg-cyber-accent/20 blur-lg rounded-full" />
          </div>
          <h3 className="text-lg font-bold text-white">Knock AI Assistant</h3>
          <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
            I can analyze your security reports, check credentials, suggest remediation strategies, and explain vulnerability metrics. Try asking:
          </p>
          <div className="mt-4 flex flex-col gap-2 w-full">
            <div className="p-3 rounded-lg bg-white/5 border border-white/5 text-xs text-zinc-300 font-mono hover:border-white/10 transition-colors cursor-pointer text-left">
              "Is my Spotify account secure?"
            </div>
            <div className="p-3 rounded-lg bg-white/5 border border-white/5 text-xs text-zinc-300 font-mono hover:border-white/10 transition-colors cursor-pointer text-left">
              "What risks are identified on my GitHub account?"
            </div>
          </div>
        </div>
      )}

      {messages.map((message) => {
        const isAI = message.sender === 'ai';
        return (
          <div
            key={message.id}
            className={`flex gap-4 max-w-3xl ${isAI ? '' : 'ml-auto flex-row-reverse'}`}
          >
            {/* Avatar */}
            <div className={`w-9 h-9 rounded-full shrink-0 flex items-center justify-center text-sm font-mono border ${
              isAI 
                ? 'bg-emerald-500/10 border-emerald-500/20 text-cyber-accent' 
                : 'bg-cyber-blue/10 border-cyber-blue/20 text-cyber-blue'
            }`}>
              {isAI ? <Sparkles className="w-4 h-4" /> : <User className="w-4 h-4" />}
            </div>

            {/* Message Bubble */}
            <div className={`p-4 rounded-2xl border text-sm relative ${
              isAI 
                ? 'bg-zinc-900/60 border-white/5' 
                : 'bg-zinc-900 border-white/10'
            }`}>
              <div className="font-mono text-[9px] text-zinc-500 absolute top-2 right-3">
                {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
              <div className="mt-1 space-y-1">
                {parseMarkdown(message.text)}
              </div>
            </div>
          </div>
        );
      })}

      {loading && (
        <div className="flex gap-4 max-w-3xl">
          <div className="w-9 h-9 rounded-full shrink-0 flex items-center justify-center bg-emerald-500/10 border border-emerald-500/20 text-cyber-accent">
            <Loader2 className="w-4 h-4 animate-spin" />
          </div>
          <div className="p-4 rounded-2xl bg-zinc-900/60 border border-white/5 text-xs font-mono text-zinc-400 flex items-center gap-2">
            <span>Knock AI is analyzing security protocols...</span>
          </div>
        </div>
      )}

      <div ref={scrollRef} />
    </div>
  );
}
