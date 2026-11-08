'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, 
  MessageSquare, 
  Send, 
  Paperclip, 
  Settings, 
  Trash2, 
  Bot, 
  User, 
  Copy, 
  Check, 
  Menu, 
  X, 
  Key, 
  Zap, 
  Sparkles,
  Image as ImageIcon
} from 'lucide-react';

export default function App() {
  const [messages, setMessages] = useState([
    {
      id: 'm1',
      role: 'assistant',
      content: 'Hello! I am your AI assistant. How can I help you today? You can type a message or attach an image.',
      time: 'Just now'
    }
  ]);
  const [input, setInput] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Handle Send Message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() && !image) return;

    const userMessageContent = input;
    const userImage = image ? URL.createObjectURL(image) : null;
    
    const newUserMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: userMessageContent,
      image: userImage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);
    setInput('');
    setImage(null);
    setLoading(true);

    try {
      // Backend API Route call kora (OpenAI ba simulation)
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: updatedMessages.map(m => ({ role: m.role, content: m.content })),
          apiKey: apiKey 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const aiResponse = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.reply || "I received your message!",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, aiResponse]);
      } else {
        throw new Error(data.error || "Failed to fetch response");
      }
    } catch (error) {
      console.error("API Error:", error);
      const errorResponse = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Connection Error: ${error.message}. Please check terminal logs.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setLoading(false);
    }
  };

  const handleNewChat = () => {
    setMessages([
      {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Started a new chat session. How can I help?',
        time: 'Just now'
      }
    ]);
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex h-screen w-full bg-slate-950 text-slate-100 font-sans overflow-hidden select-none">
      {/* Background Glow */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-10 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-slate-900/80 backdrop-blur-xl border-r border-slate-800/60 flex flex-col transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-4 flex items-center justify-between border-b border-slate-800/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white shadow-lg shadow-blue-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Gemini AI</span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-1.5 rounded-lg hover:bg-slate-800 text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-3">
          <button onClick={handleNewChat} className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-all shadow-lg shadow-blue-600/20">
            <Plus className="w-4 h-4" />
            <span>New Chat</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-3 py-2">Recent Conversations</div>
          <div className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-slate-800/50 text-slate-200 text-sm cursor-pointer border border-slate-700/40">
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <MessageSquare className="w-4 h-4 shrink-0 text-blue-400" />
              <span className="truncate">AI Assistant Session</span>
            </div>
          </div>
        </div>

        {/* API Settings Trigger */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/40">
          <button onClick={() => setIsSettingsOpen(true)} className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/60 transition-colors text-sm">
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-slate-400" />
              <div className="text-left">
                <div className="font-medium text-slate-200">API Settings</div>
                <div className="text-[10px] text-slate-500">{apiKey ? 'API Connected' : 'Simulated Mode'}</div>
              </div>
            </div>
            <Settings className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full bg-slate-950/50 relative overflow-hidden">
        {/* Header */}
        <header className="h-14 border-b border-slate-800/60 bg-slate-900/40 backdrop-blur-xl px-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-slate-800 text-slate-400">
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-medium text-slate-300">Gemini-2.5 Flash / GPT Ready</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-[11px] text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1 rounded-full">
              <Zap className="w-3.5 h-3.5 text-yellow-400" />
              <span>Active Workspace</span>
            </span>
          </div>
        </header>

        {/* Chat Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-3 sm:gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-md">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className={`flex flex-col max-w-[85%] sm:max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`p-4 rounded-2xl text-sm leading-relaxed ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-br-xs' : 'bg-slate-900/90 border border-slate-800 text-slate-100 rounded-bl-xs shadow-xl'}`}>
                    {msg.image && (
                      <div className="mb-3">
                        <img src={msg.image} alt="Uploaded attachment" className="max-h-48 rounded-lg object-cover border border-slate-700/50" />
                      </div>
                    )}
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                  </div>

                  <div className="flex items-center gap-2 mt-1 px-1 text-[11px] text-slate-500">
                    <span>{msg.time}</span>
                    {msg.role === 'assistant' && (
                      <button onClick={() => copyToClipboard(msg.content, msg.id)} className="hover:text-slate-300 transition-colors flex items-center gap-1">
                        {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        {copiedId === msg.id ? 'Copied' : 'Copy'}
                      </button>
                    )}
                  </div>
                </div>

                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-4 justify-start">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shrink-0">
                  <Bot className="w-4 h-4 animate-spin" />
                </div>
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl text-slate-400 text-sm flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 border-t border-slate-800/80 bg-slate-900/60 backdrop-blur-xl">
          <div className="max-w-3xl mx-auto">
            {image && (
              <div className="mb-2 relative inline-block">
                <img src={URL.createObjectURL(image)} alt="Preview" className="w-16 h-16 object-cover rounded-xl border border-slate-700" />
                <button onClick={() => setImage(null)} className="absolute -top-2 -right-2 bg-slate-800 text-slate-200 border border-slate-700 rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600">×</button>
              </div>
            )}

            <form onSubmit={handleSendMessage} className="relative flex items-center bg-slate-950/80 border border-slate-800 rounded-2xl p-2 shadow-inner focus-within:border-blue-500/50 transition-all">
              <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} className="hidden" id="imageUpload" />
              <label htmlFor="imageUpload" className="p-2.5 rounded-xl hover:bg-slate-800/80 text-slate-400 hover:text-slate-200 cursor-pointer transition-colors">
                <Paperclip className="w-5 h-5" />
              </label>

              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e);
                  }
                }}
                placeholder="Ask anything or attach an image..."
                rows={1}
                className="flex-1 bg-transparent text-slate-100 placeholder-slate-500 text-sm px-3 py-2 outline-none resize-none max-h-32"
              />

              <button 
                type="submit" 
                disabled={(!input.trim() && !image) || loading}
                className={`p-2.5 rounded-xl transition-all ${(!input.trim() && !image) || loading ? 'bg-slate-800 text-slate-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20'}`}
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 px-1">
              <span>Press Enter to send, Shift + Enter for new line.</span>
              <span>Gemini Multimodal UI</span>
            </div>
          </div>
        </div>
      </main>

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-semibold text-lg text-slate-200">API Configuration</h3>
              <button onClick={() => setIsSettingsOpen(false)} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-400">OpenAI / Gemini API Key</label>
              <input 
                type="password" 
                value={apiKey} 
                onChange={(e) => setApiKey(e.target.value)} 
                placeholder="sk-..." 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 outline-none focus:border-blue-500"
              />
              <p className="text-[11px] text-slate-500">Your key is kept locally in browser state or handled via `.env.local` backend.</p>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setIsSettingsOpen(false)} className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium">Save & Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}