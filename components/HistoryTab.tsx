import React from 'react';
import { ThumbsUp, ThumbsDown, RefreshCw, Database } from 'lucide-react';
import { FeedbackItem } from '../types';

interface HistoryTabProps {
  history: FeedbackItem[];
  onSyncRag: () => void;
  ragContext: string;
}

const HistoryTab: React.FC<HistoryTabProps> = ({ history, onSyncRag, ragContext }) => {
  return (
    <div className="max-w-6xl mx-auto pb-20 space-y-8">
       {/* RAG Status Section */}
       <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-indigo-900/50 rounded-xl flex items-center justify-center text-indigo-400">
               <Database size={24} />
             </div>
             <div>
                <h2 className="text-xl font-bold text-white">Knowledge Base (RAG)</h2>
                <p className="text-slate-400 text-sm">
                  {history.length} feedback items collected. Sync to improve next generation.
                </p>
             </div>
          </div>
          <button 
            onClick={onSyncRag}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium flex items-center gap-2 transition-all shadow-lg shadow-indigo-500/20"
          >
            <RefreshCw size={18} />
            <span>Sync Knowledge Base</span>
          </button>
       </div>

       {/* Current RAG Context Preview */}
       {ragContext && (
         <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Active Context Memory</h3>
            <p className="text-sm text-slate-300 font-mono whitespace-pre-wrap">{ragContext}</p>
         </div>
       )}

       {/* History List */}
       <div className="space-y-4">
         <h3 className="text-lg font-semibold text-slate-300">Generation History</h3>
         {history.length === 0 ? (
            <div className="text-center py-10 text-slate-500 bg-slate-800/30 rounded-xl border border-slate-800 border-dashed">
              No feedback history yet. Like or Dislike generated segments to build your personalized AI style.
            </div>
         ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {history.map((item) => (
                 <div key={item.id} className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex gap-4">
                    <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                      item.rating === 'like' ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'
                    }`}>
                      {item.rating === 'like' ? <ThumbsUp size={18} /> : <ThumbsDown size={18} />}
                    </div>
                    <div className="flex-1 overflow-hidden">
                       <p className="text-sm text-slate-300 font-medium line-clamp-2 mb-1">"{item.scriptText}"</p>
                       <p className="text-xs text-slate-500">
                         {new Date(item.timestamp).toLocaleDateString()} • {new Date(item.timestamp).toLocaleTimeString()}
                       </p>
                       {item.visualUrl && (
                          <div className="mt-2 w-16 h-24 bg-black rounded overflow-hidden">
                             <img src={item.visualUrl} className="w-full h-full object-cover opacity-70" />
                          </div>
                       )}
                    </div>
                 </div>
               ))}
            </div>
         )}
       </div>
    </div>
  );
};

export default HistoryTab;
