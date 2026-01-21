
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import LoginScreen from './components/LoginScreen';
import SegmentCard from './components/segments/SegmentCard';
import ChatOverlay from './components/ChatOverlay';
import HistoryTab from './components/HistoryTab';
import SettingsTab from './components/SettingsTab';
import { generateScript, generateSegmentImage, generateSegmentVideo, generateSegmentAudio } from './services/geminiService';
import { generateElevenLabsAudio, generateHeyGenVideo } from './services/integrationService';
import { saveUserData, loadUserData } from './services/storageService';
import { playSmartAudio } from './utils/audioUtils';
import { Project, ScriptSegment, ChatMode, FeedbackItem, UserProfile, UserSettings } from './types';
import { Sparkles, Loader2, PlayCircle, AlertTriangle, History as HistoryIcon, HardDrive, CheckCircle2 } from 'lucide-react';

const DEFAULT_SYSTEM_PROMPT = `You are an expert social media scriptwriter for short-form video (TikTok/Reels/Shorts). 
Your goal is 100% retention. Use powerful hooks, rhythmic pacing, and visually descriptive prompts.`;

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isDriveConnecting, setIsDriveConnecting] = useState(false);
  const [isDriveConnected, setIsDriveConnected] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [topic, setTopic] = useState('');
  const [pastTopics, setPastTopics] = useState<string[]>([]);
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);
  const [project, setProject] = useState<Project | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userSettings, setUserSettings] = useState<UserSettings>({});
  
  const [chatOverlay, setChatOverlay] = useState<{ isOpen: boolean; mode: ChatMode; segment: ScriptSegment | null }>({
    isOpen: false,
    mode: 'visual',
    segment: null
  });
  
  const [feedbackHistory, setFeedbackHistory] = useState<FeedbackItem[]>([]);
  const [ragContext, setRagContext] = useState<string>("");

  useEffect(() => {
    if (user) {
        const data = loadUserData(user.id);
        setProject(data.project);
        setFeedbackHistory(data.history);
        setPastTopics(data.pastTopics);
        setRagContext(data.ragContext);
        setUserSettings(data.settings || {});
        setTopic("");
    }
  }, [user]);

  useEffect(() => {
    if (user) {
        saveUserData(user.id, {
            project,
            history: feedbackHistory,
            pastTopics,
            ragContext,
            settings: userSettings
        });
    }
  }, [project, feedbackHistory, pastTopics, ragContext, user, userSettings]);

  const ensurePaidApiKey = async () => {
    const aiStudio = (window as any).aistudio;
    if (aiStudio && aiStudio.openSelectKey) {
       const hasKey = await aiStudio.hasSelectedApiKey();
       if(!hasKey) {
           await aiStudio.openSelectKey();
       }
    }
  };

  const handleLogin = (newUser: UserProfile) => {
    setUser(newUser);
    setTimeout(() => setIsDriveConnecting(true), 600);
  };

  const handleDriveConnect = () => {
      // Simulation of Google Drive OAuth 2.0
      setTimeout(() => {
          setIsDriveConnected(true);
          setIsDriveConnecting(false);
      }, 1800);
  };

  const handleLogout = () => {
    setUser(null);
    setProject(null);
    setFeedbackHistory([]);
    setIsDriveConnected(false);
  };

  // Added handleSaveSettings to fix the missing reference error
  const handleSaveSettings = (newSettings: UserSettings) => {
    setUserSettings(newSettings);
  };

  const handleCreateScript = async () => {
    if (!topic) return;
    if (!pastTopics.includes(topic)) {
      setPastTopics(prev => [topic, ...prev].slice(0, 8));
    }
    setIsGeneratingScript(true);
    setError(null);
    try {
      await ensurePaidApiKey();
      const segments = await generateScript(topic, DEFAULT_SYSTEM_PROMPT, ragContext);
      setProject({
        id: Date.now().toString(),
        title: topic,
        topic: topic,
        aspectRatio: '9:16',
        segments,
        systemPrompts: { copywriter: DEFAULT_SYSTEM_PROMPT, visual: '' },
        createdAt: new Date()
      });
      setActiveTab('copywriter'); 
    } catch (err: any) {
      setError("Automation failed to generate script. Check your API Key.");
    } finally {
      setIsGeneratingScript(false);
    }
  };

  const updateSegment = (id: string, updates: Partial<ScriptSegment>) => {
    if (!project) return;
    setProject({
      ...project,
      segments: project.segments.map(s => s.id === id ? { ...s, ...updates } : s)
    });
  };

  const handleGenerateVisual = async (segment: ScriptSegment) => {
    if (!project) return;
    updateSegment(segment.id, { isGenerating: true });
    try {
      let url: string;
      if (segment.visualType === 'avatar_video' && userSettings.heyGenKey) {
        let audioBlob = undefined;
        if (segment.audioUrl) {
            const response = await fetch(segment.audioUrl);
            audioBlob = await response.blob();
        }
        url = await generateHeyGenVideo(segment.scriptText, userSettings.heyGenKey, userSettings.heyGenAvatarId, audioBlob);
      } else {
          await ensurePaidApiKey();
          if (segment.visualType.includes('video')) {
            url = await generateSegmentVideo(segment.visualPrompt);
          } else {
            url = await generateSegmentImage(segment.visualPrompt, segment.visualType === 'avatar');
          }
      }
      updateSegment(segment.id, { visualUrl: url, isGenerating: false });
    } catch (err) {
      updateSegment(segment.id, { isGenerating: false });
      setError("Visual artist agent failed.");
    }
  };

  const handleGenerateAudio = async (segment: ScriptSegment) => {
    try {
        let audioUrl: string;
        if (userSettings.elevenLabsKey) {
            const result = await generateElevenLabsAudio(segment.scriptText, userSettings.elevenLabsKey, userSettings.elevenLabsVoiceId);
            audioUrl = result.base64;
        } else {
            await ensurePaidApiKey();
            audioUrl = await generateSegmentAudio(segment.scriptText);
        }
        updateSegment(segment.id, { audioUrl: audioUrl });
    } catch(err) {
        setError("Voice agent failed synthesis.");
    }
  };

  const handleExecuteChatAction = async (mode: string, refinedPrompt: string) => {
    if (!chatOverlay.segment || !project) return;
    const segment = chatOverlay.segment;
    setChatOverlay(prev => ({ ...prev, isOpen: false }));
    updateSegment(segment.id, { isGenerating: true, visualPrompt: refinedPrompt });
    try {
      let updates: Partial<ScriptSegment> = { isGenerating: false };
      await ensurePaidApiKey();
      if (mode === 'visual' || mode === 'combo') {
        const isVideo = refinedPrompt.toLowerCase().includes('video');
        updates.visualUrl = isVideo ? await generateSegmentVideo(refinedPrompt) : await generateSegmentImage(refinedPrompt);
        updates.visualType = isVideo ? 'video' : 'image';
      }
      updateSegment(segment.id, updates);
    } catch (err) {
      updateSegment(segment.id, { isGenerating: false });
      setError("Manual override failed.");
    }
  };

  const handleLike = (segment: ScriptSegment, isLike: boolean) => {
    const newItem: FeedbackItem = {
      id: Date.now().toString(),
      segmentId: segment.id,
      visualUrl: segment.visualUrl,
      scriptText: segment.scriptText,
      rating: isLike ? 'like' : 'dislike',
      timestamp: new Date()
    };
    setFeedbackHistory(prev => [newItem, ...prev]);
  };

  const handleSyncRag = () => {
    const likes = feedbackHistory.filter(f => f.rating === 'like');
    const context = `USER PREFERENCES:\n${likes.map(l => `- Loved script: "${l.scriptText.substring(0, 40)}..."`).join('\n')}`;
    setRagContext(context);
    alert("Knowledge Base Synced! Agents updated.");
  };

  if (!user) return <LoginScreen onLogin={handleLogin} />;
  
  if (isDriveConnecting) {
     return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-[2.5rem] p-12 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500 animate-pulse"></div>
                <div className="w-24 h-24 bg-blue-600/10 rounded-full flex items-center justify-center mx-auto mb-8 text-blue-400 border border-blue-500/10 scale-110">
                    <HardDrive size={48} strokeWidth={1.5} />
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">Connect Google Drive</h2>
                <p className="text-slate-400 text-lg leading-relaxed mb-10 max-w-sm mx-auto">
                    ContentFlow automatically syncs your daily 30-40s shorts to your private Drive vault.
                </p>
                <button 
                  onClick={handleDriveConnect} 
                  className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-[1.5rem] font-bold text-lg shadow-2xl shadow-blue-600/20 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3"
                >
                  <img src="https://upload.wikimedia.org/wikipedia/commons/1/12/Google_Drive_icon_%282020%29.svg" className="w-6 h-6" alt="Drive" />
                  Continue with Google Drive
                </button>
                <p className="mt-6 text-[10px] text-slate-600 font-bold uppercase tracking-widest">Enterprise Encrypted Storage Only</p>
            </div>
        </div>
     );
  }

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab} user={user} onLogout={handleLogout}>
      {activeTab === 'dashboard' && <Dashboard />}
      {activeTab === 'copywriter' && (
        <div className="max-w-4xl mx-auto space-y-8 pb-32 animate-fade-in">
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-3xl p-8 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-6">
               <div className="p-2.5 bg-indigo-500/10 rounded-xl text-indigo-400">
                  <Sparkles size={24} />
               </div>
               <h3 className="text-xl font-bold text-white">Daily Automation Queue</h3>
            </div>
            <div className="flex gap-4">
              <input 
                type="text" 
                value={topic} 
                onChange={(e) => setTopic(e.target.value)} 
                placeholder="Topic for today's shorts (e.g. Daily Stoic Wisdom)..." 
                className="flex-1 bg-slate-900 border border-slate-700 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-indigo-500 transition-all shadow-inner placeholder:text-slate-600" 
                onKeyDown={(e) => e.key === 'Enter' && handleCreateScript()} 
              />
              <button 
                onClick={handleCreateScript} 
                disabled={isGeneratingScript || !topic} 
                className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white px-8 py-4 rounded-2xl font-bold transition-all hover:shadow-lg hover:shadow-indigo-600/20 flex items-center gap-2"
              >
                {isGeneratingScript ? <Loader2 className="animate-spin" /> : <span>Produce</span>}
              </button>
            </div>
          </div>
          {project && (
            <div className="space-y-6">
               <div className="flex justify-between items-center px-4">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">Generated Script Segments</h4>
                  <span className="text-[10px] text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded font-mono">38s TOTAL</span>
               </div>
               {project.segments.map(s => (
                 <SegmentCard 
                   key={s.id} 
                   segment={s} 
                   onUpdate={updateSegment} 
                   onOpenChat={(mode, seg) => setChatOverlay({ isOpen: true, mode, segment: seg })} 
                   onLike={handleLike} 
                   isProcessing={s.isGenerating || false} 
                 />
               ))}
            </div>
          )}
        </div>
      )}
      {activeTab === 'visuals' && (
        <div className="max-w-6xl mx-auto space-y-8 pb-32 animate-fade-in">
           <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {project?.segments.map(seg => (
                <div key={seg.id} className="relative aspect-[9/16] bg-slate-800 rounded-2xl overflow-hidden border border-slate-700/50 group">
                   {seg.visualUrl ? (
                     <img src={seg.visualUrl} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-700" alt="Asset" />
                   ) : (
                     <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
                        <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center text-slate-700 mb-4">
                           <HardDrive size={20} />
                        </div>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Pending Asset</p>
                        <button 
                          onClick={() => handleGenerateVisual(seg)} 
                          className="px-4 py-2 bg-indigo-600/10 hover:bg-indigo-600 text-indigo-400 hover:text-white rounded-lg text-xs font-bold transition-all"
                        >
                          Generate
                        </button>
                     </div>
                   )}
                   <div className="absolute top-4 left-4">
                      <span className="bg-black/40 backdrop-blur-md text-[9px] text-white px-2 py-1 rounded-full font-bold border border-white/10 uppercase tracking-tighter">SEG {seg.order + 1}</span>
                   </div>
                </div>
              ))}
           </div>
        </div>
      )}
      {activeTab === 'audio' && (
        <div className="max-w-4xl mx-auto space-y-4 pb-32 animate-fade-in">
          {project?.segments.map(seg => (
            <div key={seg.id} className="bg-slate-800/40 p-6 rounded-[2rem] border border-slate-700/50 flex justify-between items-center group hover:bg-slate-800 transition-all">
              <div className="flex-1 mr-8">
                 <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">VOICEOVER SEGMENT {seg.order + 1}</p>
                 <p className="text-slate-200 text-sm leading-relaxed">{seg.scriptText}</p>
              </div>
              <button 
                onClick={() => seg.audioUrl ? playSmartAudio(seg.audioUrl) : handleGenerateAudio(seg)} 
                className={`p-4 rounded-2xl transition-all ${seg.audioUrl ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20'}`}
              >
                {seg.audioUrl ? <PlayCircle size={28} /> : <span className="text-xs font-bold uppercase">Sync</span>}
              </button>
            </div>
          ))}
        </div>
      )}
      {activeTab === 'settings' && <SettingsTab settings={userSettings} onSave={handleSaveSettings} />}
      {activeTab === 'history' && <HistoryTab history={feedbackHistory} onSyncRag={handleSyncRag} ragContext={ragContext} />}
      {chatOverlay.segment && (
        <ChatOverlay 
          isOpen={chatOverlay.isOpen} 
          onClose={() => setChatOverlay(prev => ({ ...prev, isOpen: false }))} 
          mode={chatOverlay.mode} 
          segment={chatOverlay.segment} 
          onExecute={handleExecuteChatAction} 
        />
      )}
    </Layout>
  );
}
