import React, { useState } from 'react';
import { Play, Image as ImageIcon, Film, Loader2, Music, UserCircle2, MoreVertical, MessageSquare } from 'lucide-react';
import { ScriptSegment, ChatMode } from '../../types';
import { playSmartAudio } from '../../utils/audioUtils';

interface SegmentCardProps {
  segment: ScriptSegment;
  onUpdate: (id: string, updates: Partial<ScriptSegment>) => void;
  onOpenChat: (mode: ChatMode, segment: ScriptSegment) => void;
  onLike: (segment: ScriptSegment, isLike: boolean) => void;
  isProcessing: boolean;
}

const SegmentCard: React.FC<SegmentCardProps> = ({ segment, onUpdate, onOpenChat, onLike, isProcessing }) => {
  const [showMenu, setShowMenu] = useState(false);
  
  const handlePlayAudio = () => {
    if (segment.audioUrl) {
      playSmartAudio(segment.audioUrl);
    }
  };

  const menuOptions = [
    { label: 'Create First Image Frame', icon: ImageIcon, mode: 'visual' as ChatMode },
    { label: 'Create Audio & Video', icon: Film, mode: 'combo' as ChatMode },
    { label: 'Create Audio Only', icon: Music, mode: 'audio' as ChatMode },
    { label: 'Create Video Only', icon: Film, mode: 'visual' as ChatMode },
    { label: 'Create Avatar', icon: UserCircle2, mode: 'avatar' as ChatMode },
    { label: 'Create Avatar Talking Video', icon: UserCircle2, mode: 'avatar_video' as ChatMode },
  ];

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden hover:border-slate-600 transition-colors flex flex-col md:flex-row h-auto min-h-[180px] group relative">
      
      {/* Visual Preview Area - 9:16 Aspect Ratio emphasis */}
      <div className="w-full md:w-[100px] bg-black relative shrink-0 aspect-[9/16] md:aspect-[9/16] self-center md:self-auto md:ml-4 my-4 md:my-0 rounded-lg overflow-hidden border border-slate-800 shadow-lg">
        {segment.visualUrl ? (
          (segment.visualType === 'video' || segment.visualType === 'avatar_video') ? (
             <video src={segment.visualUrl} className="w-full h-full object-cover" controls />
          ) : (
             <img src={segment.visualUrl} alt="Visual" className="w-full h-full object-cover" />
          )
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-600 p-2 text-center bg-slate-900">
             {segment.isGenerating ? (
               <Loader2 className="animate-spin mb-2 text-indigo-500" />
             ) : (
               <div className="space-y-1">
                 <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center mx-auto">
                    {segment.visualType.includes('video') ? <Film size={14} /> : <ImageIcon size={14} />}
                 </div>
                 <span className="text-[9px] block">No Asset</span>
               </div>
             )}
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="flex-1 p-4 flex flex-col space-y-3">
        
        {/* Header */}
        <div className="flex justify-between items-start">
           <div className="flex items-center space-x-2">
             <span className="bg-indigo-900/50 text-indigo-300 text-xs font-mono px-2 py-1 rounded border border-indigo-500/30">
               {(segment.duration).toFixed(1)}s
             </span>
             <span className="text-slate-500 text-xs font-mono">Segment {segment.order + 1}</span>
           </div>
           
           <div className="flex items-center space-x-2 relative">
             <button onClick={() => onLike(segment, true)} className="p-1.5 hover:bg-green-900/30 text-slate-600 hover:text-green-400 rounded transition-colors" title="Like result">
                <span className="text-xs">👍</span>
             </button>
             <button onClick={() => onLike(segment, false)} className="p-1.5 hover:bg-red-900/30 text-slate-600 hover:text-red-400 rounded transition-colors" title="Dislike result">
                <span className="text-xs">👎</span>
             </button>
             
             <div className="h-4 w-px bg-slate-700 mx-1"></div>

             <div className="relative">
                <button 
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-1.5 hover:bg-slate-700 rounded text-slate-400 transition-colors"
                >
                  <MoreVertical size={16} />
                </button>
                
                {/* Dropdown Menu */}
                {showMenu && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)}></div>
                    <div className="absolute right-0 top-full mt-2 w-56 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-20 overflow-hidden">
                      {menuOptions.map((opt, idx) => {
                        const Icon = opt.icon;
                        return (
                          <button
                            key={idx}
                            onClick={() => {
                              onOpenChat(opt.mode, segment);
                              setShowMenu(false);
                            }}
                            className="w-full px-4 py-3 text-left text-sm text-slate-300 hover:bg-indigo-600 hover:text-white flex items-center space-x-3 transition-colors border-b border-slate-700/50 last:border-0"
                          >
                            <Icon size={16} />
                            <span>{opt.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}
             </div>
           </div>
        </div>

        {/* Script & Prompt */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1">
          <div className="space-y-1 flex flex-col">
            <label className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">Voiceover Script</label>
            <textarea
              value={segment.scriptText}
              onChange={(e) => onUpdate(segment.id, { scriptText: e.target.value })}
              className="w-full flex-1 bg-slate-900/50 border border-slate-700 rounded p-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 resize-none min-h-[60px]"
            />
             {segment.audioUrl && (
              <button onClick={handlePlayAudio} className="flex items-center space-x-2 text-xs text-green-400 hover:underline mt-1">
                <Play size={10} /> <span>Play Audio</span>
              </button>
            )}
          </div>

          <div className="space-y-1 flex flex-col">
            <label className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">Visual Prompt</label>
            <textarea
              value={segment.visualPrompt}
              onChange={(e) => onUpdate(segment.id, { visualPrompt: e.target.value })}
              className="w-full flex-1 bg-slate-900/50 border border-slate-700 rounded p-2 text-sm text-slate-400 focus:outline-none focus:border-indigo-500 resize-none min-h-[60px] font-mono"
            />
            <div className="flex justify-end">
               <button 
                 onClick={() => onOpenChat('visual', segment)} 
                 className="text-[10px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
               >
                 <MessageSquare size={10} /> Refine in Chat
               </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SegmentCard;