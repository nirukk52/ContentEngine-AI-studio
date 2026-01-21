import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Bot, User, Sparkles, Film, Image as ImageIcon, Music, UserCircle2 } from 'lucide-react';
import { ChatMode, ScriptSegment } from '../types';
import { chatWithAgent } from '../services/geminiService';

interface ChatOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  mode: ChatMode;
  segment: ScriptSegment;
  onExecute: (action: string, prompt: string) => void;
}

const ChatOverlay: React.FC<ChatOverlayProps> = ({ isOpen, onClose, mode, segment, onExecute }) => {
  const [messages, setMessages] = useState<{role: 'user'|'model', text: string}[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      const initialMessage = `I am your ${mode} specialist. I see the current script is: "${segment.scriptText}". 
      ${segment.visualPrompt ? `Visual idea: ${segment.visualPrompt}` : ''}. 
      How would you like to proceed with the ${mode} generation?`;
      
      setMessages([{ role: 'model', text: initialMessage }]);
    }
  }, [isOpen, mode, segment]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      const systemPrompt = `You are a specialist AI agent for creating ${mode} content for short-form video.
      Context: 
      - Script: "${segment.scriptText}"
      - Current Visual Prompt: "${segment.visualPrompt}"
      
      Your goal is to refine the prompt with the user or confirm execution.
      If the user says "Go" or "Generate", or agrees to a prompt, ask them to click the Action Button below, or guide them on what the prompt will be.
      Keep responses concise and chatty.`;

      const response = await chatWithAgent(messages, userMsg, systemPrompt);
      setMessages(prev => [...prev, { role: 'model', text: response }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'model', text: "Error connecting to agent." }]);
    } finally {
      setIsTyping(false);
    }
  };

  if (!isOpen) return null;

  const getIcon = () => {
    switch(mode) {
      case 'avatar': return <UserCircle2 className="text-pink-400" />;
      case 'avatar_video': return <UserCircle2 className="text-purple-400" />;
      case 'audio': return <Music className="text-green-400" />;
      case 'visual': return <ImageIcon className="text-blue-400" />;
      case 'combo': return <Film className="text-orange-400" />;
      default: return <Bot className="text-indigo-400" />;
    }
  };

  const getActionLabel = () => {
    switch(mode) {
      case 'avatar': return "Generate Avatar Image";
      case 'avatar_video': return "Generate Talking Video";
      case 'audio': return "Synthesize Audio";
      case 'combo': return "Generate Audio & Video";
      default: return "Generate Visual";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm transition-opacity">
      <div className="w-full md:w-[500px] h-full bg-slate-900 border-l border-slate-700 shadow-2xl flex flex-col animate-slide-in-right">
        
        {/* Header */}
        <div className="h-16 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-900">
          <div className="flex items-center space-x-3">
            {getIcon()}
            <div>
              <h3 className="font-semibold text-white capitalize">{mode.replace('_', ' ')} Agent</h3>
              <p className="text-xs text-slate-400">Context: Segment #{segment.order + 1}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4" ref={scrollRef}>
           {messages.map((msg, idx) => (
             <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
               <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                 msg.role === 'user' 
                   ? 'bg-indigo-600 text-white rounded-br-none' 
                   : 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700'
               }`}>
                 {msg.text}
               </div>
             </div>
           ))}
           {isTyping && (
             <div className="flex justify-start">
               <div className="bg-slate-800 rounded-2xl px-4 py-3 rounded-bl-none border border-slate-700 flex space-x-1">
                 <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"></div>
                 <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-75"></div>
                 <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-150"></div>
               </div>
             </div>
           )}
        </div>

        {/* Action Bar */}
        <div className="p-4 border-t border-slate-800 bg-slate-900 space-y-3">
           
           {/* Quick Action Button - Context Aware */}
           <button 
             onClick={() => onExecute(mode, messages[messages.length - 1]?.role === 'user' ? messages[messages.length - 1].text : segment.visualPrompt)}
             className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-xl font-bold text-white shadow-lg shadow-indigo-500/20 flex items-center justify-center space-x-2 transition-all"
           >
             <Sparkles size={18} />
             <span>{getActionLabel()} based on Chat</span>
           </button>

           {/* Input */}
           <div className="flex space-x-2">
             <input
               value={input}
               onChange={(e) => setInput(e.target.value)}
               onKeyDown={(e) => e.key === 'Enter' && handleSend()}
               placeholder="Refine prompt or ask for changes..."
               className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-indigo-500"
             />
             <button 
               onClick={handleSend}
               disabled={!input.trim()}
               className="p-3 bg-slate-700 hover:bg-slate-600 rounded-xl text-white disabled:opacity-50 transition-colors"
             >
               <Send size={18} />
             </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ChatOverlay;
