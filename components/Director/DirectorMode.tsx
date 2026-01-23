import React, { useState } from 'react';
import { Script } from '../../types/evidence';
import { ResearchService } from '../../services/ResearchService';
import { Loader2, Sparkles, Video, Search, ChevronRight, Edit2, CheckCircle } from 'lucide-react';
import EvidenceEditor from './EvidenceEditor';

interface DirectorModeProps {
    apiKey: string;
}

export default function DirectorMode({ apiKey }: DirectorModeProps) {
    const [topic, setTopic] = useState('');
    const [isResearching, setIsResearching] = useState(false);
    const [script, setScript] = useState<Script | null>(null);
    const [logs, setLogs] = useState<string[]>([]);
    const [editingEvidence, setEditingEvidence] = useState<{ sceneIndex: number, segmentIndex: number, url: string, initialCrop?: any } | null>(null);

    const updateSegment = (sceneIdx: number, segIdx: number, updates: Partial<any>) => {
        if (!script) return;
        const newScript = { ...script };
        const seg = newScript.scenes[sceneIdx].segments[segIdx];
        newScript.scenes[sceneIdx].segments[segIdx] = { ...seg, ...updates };
        setScript(newScript);
    };

    const handleSaveCrop = (crop: any) => {
        if (editingEvidence) {
            const { sceneIndex, segmentIndex } = editingEvidence;
            // Update the proofAsset with crop coordinates
            const currentSeg = script?.scenes[sceneIndex].segments[segmentIndex];
            if (currentSeg) {
                updateSegment(sceneIndex, segmentIndex, {
                    proofAsset: {
                        ...currentSeg.proofAsset,
                        cropCoordinates: crop
                    }
                });
            }
            setEditingEvidence(null);
        }
    };

    const handleStartResearch = async () => {
        if (!topic) return;
        setIsResearching(true);
        setLogs([]);

        try {
            const service = new ResearchService(apiKey);
            // Simulate log streaming (in a real app, use an event emitter)
            setLogs(prev => [...prev, "🚀 Initializing Research Agent..."]);

            const result = await service.researchAndGenerateScript(topic);
            setScript(result.script);
            setLogs(result.logs);
        } catch (error: any) {
            console.error(error);
            setLogs(prev => [...prev, `❌ Error: ${error.message || error}`]);
        } finally {
            setIsResearching(false);
        }
    };

    if (script) {
        return (
            <div className="w-full h-full p-8 text-white">
                <div className="max-w-6xl mx-auto">
                    <header className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                                Director Mode
                            </h2>
                            <p className="text-slate-400 text-sm mt-1">Reviewing Evidence for: <span className="text-white font-medium">"{script.topic}"</span></p>
                        </div>
                        <button onClick={() => setScript(null)} className="px-4 py-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors text-sm">
                            New Research
                        </button>
                    </header>

                    {/* Placeholder for Timeline / Evidence Editor */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-6">
                            {script.scenes.map((scene, i) => (
                                <div key={scene.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                                    <div className="flex items-center gap-3 mb-4 text-slate-500 text-xs font-bold uppercase tracking-widest">
                                        <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
                                            {i + 1}
                                        </div>
                                        <span>Scene {i + 1}</span>
                                    </div>

                                    <div className="space-y-4">
                                        {scene.segments.map((seg, j) => (
                                            <div key={seg.id} className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 hover:border-indigo-500/30 transition-colors group">
                                                <div className="flex justify-between items-start gap-4">
                                                    <div className="flex-1">
                                                        <p className="text-indigo-300 text-sm font-medium mb-2">Avatar Narration</p>
                                                        <p className="text-white text-lg leading-relaxed font-light">"{seg.avatarLine}"</p>
                                                    </div>
                                                    <div className="w-32 aspect-[9/16] bg-black rounded-lg border border-slate-700 overflow-hidden relative group/thumb cursor-pointer hover:ring-2 ring-indigo-500 transition-all"
                                                        onClick={() => {
                                                            if (seg.proofAsset.type === 'web_screenshot' && seg.proofAsset.url) {
                                                                // Use a placeholder screenshot service if visualUrl is missing for demo
                                                                const visualUrl = seg.proofAsset.visualUrl || `https://image.thum.io/get/width/400/crop/800/noimage/${seg.proofAsset.url}`;
                                                                setEditingEvidence({
                                                                    sceneIndex: i,
                                                                    segmentIndex: j,
                                                                    url: visualUrl,
                                                                    initialCrop: seg.proofAsset.cropCoordinates
                                                                });
                                                            }
                                                        }}
                                                    >
                                                        {seg.proofAsset.type === 'web_screenshot' ? (
                                                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 text-slate-500 p-2 text-center">
                                                                {seg.proofAsset.cropCoordinates ? (
                                                                    <div className="absolute top-1 right-1 text-green-400">
                                                                        <CheckCircle size={14} />
                                                                    </div>
                                                                ) : null}
                                                                <Search size={16} className="mb-2 text-indigo-400" />
                                                                <span className="text-[9px] break-all leading-tight opacity-70">{seg.proofAsset.url || "No URL"}</span>
                                                                <div className="mt-2 text-[8px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded">
                                                                    {seg.proofAsset.cropCoordinates ? "Highlighted" : "Click to Crop"}
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 text-slate-500">
                                                                <Video size={16} className="mb-2" />
                                                                <span className="text-[9px] uppercase">{seg.proofAsset.type.replace(/_/g, ' ')}</span>
                                                            </div>
                                                        )}

                                                        {seg.proofAsset.type === 'web_screenshot' && (
                                                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/thumb:opacity-100 flex items-center justify-center transition-opacity">
                                                                <Edit2 className="text-white" size={20} />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Right Sidebar: Preview / Actions */}
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 h-fit sticky top-8">
                            <h3 className="text-lg font-bold text-white mb-4">Export Actions</h3>
                            <button className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 mb-4">
                                <Video size={18} />
                                Render Video (Cloud Run)
                            </button>
                            <p className="text-xs text-slate-500 text-center">Estimated Cost: $0.12</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen flex flex-col items-center justify-center p-8 bg-slate-950 text-white relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px]"></div>
            </div>

            {editingEvidence && (
                <EvidenceEditor
                    imageUrl={editingEvidence.url}
                    initialCrop={editingEvidence.initialCrop}
                    onSave={handleSaveCrop}
                    onCancel={() => setEditingEvidence(null)}
                />
            )}

            <div className="max-w-2xl w-full z-10 text-center space-y-10">
                <div className="space-y-4">
                    <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 tracking-tight">
                        Evidence Engine
                    </h1>
                    <p className="text-xl text-slate-400 max-w-lg mx-auto leading-relaxed">
                        Turn a prompt into a high-trust, documentary-style video. The AI researches, you direct, we render.
                    </p>
                </div>

                <div className="bg-slate-900/50 border border-slate-700/50 rounded-3xl p-2 backdrop-blur-xl shadow-2xl flex items-center gap-2 transition-all focus-within:ring-2 focus-within:ring-indigo-500/50 focus-within:border-indigo-500">
                    <div className="pl-6 text-slate-400">
                        <Search size={24} />
                    </div>
                    <input
                        type="text"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="What should we investigate today?"
                        className="flex-1 bg-transparent border-none text-xl p-4 text-white placeholder:text-slate-600 focus:outline-none"
                        onKeyDown={(e) => e.key === 'Enter' && handleStartResearch()}
                    />
                    <button
                        onClick={handleStartResearch}
                        disabled={isResearching || !topic}
                        className="bg-white text-black hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed px-8 py-4 rounded-2xl font-bold text-lg transition-all flex items-center gap-2"
                    >
                        {isResearching ? (
                            <Loader2 className="animate-spin" />
                        ) : (
                            <>
                                <span>Research</span>
                                <ChevronRight size={20} />
                            </>
                        )}
                    </button>
                </div>

                {/* Logs Area */}
                {logs.length > 0 && (
                    <div className="bg-black/40 rounded-xl p-6 text-left max-h-48 overflow-y-auto border border-slate-800/50 font-mono text-xs space-y-2 scrollbar-thin scrollbar-thumb-slate-700">
                        {logs.map((log, i) => (
                            <div key={i} className="text-slate-400 animate-fade-in">
                                <span className="text-slate-600 mr-2">[{new Date().toLocaleTimeString()}]</span>
                                {log}
                            </div>
                        ))}
                        {isResearching && (
                            <div className="text-indigo-400 animate-pulse">
                                <span className="text-slate-600 mr-2">...</span>
                                Thinking...
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
