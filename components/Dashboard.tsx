import React, { useState } from 'react';
import { TrendingUp, Clock, Users, Video, Zap, HardDrive, Calendar, ArrowRight, CheckCircle2 } from 'lucide-react';

const Dashboard = () => {
  const [autoPilot, setAutoPilot] = useState(true);

  const stats = [
    { label: 'Videos Generated', value: '24', icon: Video, color: 'text-blue-500' },
    { label: 'Avg. Engagement', value: '+14%', icon: TrendingUp, color: 'text-green-500' },
    { label: 'Saved Time', value: '18h', icon: Clock, color: 'text-purple-500' },
    { label: 'Cloud Storage', value: '4.2GB', icon: HardDrive, color: 'text-cyan-500' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
       {/* Hero Section */}
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
         <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
              Agent Control Center
            </h1>
            <p className="text-slate-400 mt-2">Your multi-agent pipeline is producing viral shorts daily.</p>
         </div>
         
         {/* Daily Auto-Pilot Toggle */}
         <div className="flex items-center gap-4 bg-slate-800/80 border border-slate-700/50 p-3 rounded-2xl backdrop-blur-sm">
            <div className={`p-2.5 rounded-xl ${autoPilot ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-700 text-slate-500'}`}>
                <Zap size={20} className={autoPilot ? 'fill-current' : ''} />
            </div>
            <div className="mr-4">
                <p className="text-xs font-bold text-white uppercase tracking-widest">Daily Auto-Pilot</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                   <div className={`h-1.5 w-1.5 rounded-full ${autoPilot ? 'bg-green-500 animate-pulse' : 'bg-slate-500'}`}></div>
                   <p className="text-[10px] text-slate-400">{autoPilot ? 'Next Short: Today at 09:00 AM' : 'Automation Paused'}</p>
                </div>
            </div>
            <button 
                onClick={() => setAutoPilot(!autoPilot)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 focus:outline-none ${autoPilot ? 'bg-indigo-600 shadow-[0_0_10px_rgba(79,70,229,0.5)]' : 'bg-slate-700'}`}
            >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${autoPilot ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
         </div>
       </div>

       {/* Stats Grid */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="bg-slate-800/40 border border-slate-700/50 p-6 rounded-2xl hover:bg-slate-800/60 transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-xl bg-slate-900 group-hover:scale-110 transition-transform ${stat.color}`}>
                    <Icon size={24} />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
                <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">{stat.label}</p>
              </div>
            )
          })}
       </div>

       {/* Drive & Production Management */}
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quick Production Card */}
            <div className="lg:col-span-2 relative overflow-hidden bg-gradient-to-br from-indigo-900/40 to-slate-900 border border-indigo-500/20 rounded-3xl p-8 group">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                   <Video size={160} />
                </div>
                <div className="relative z-10">
                    <h2 className="text-2xl font-bold text-white mb-3">Produce 40-Sec Short</h2>
                    <p className="text-slate-400 max-w-md mb-8 leading-relaxed">
                       Ready to go manual? Override the daily schedule and produce an end-to-end short now using your current RAG preferences.
                    </p>
                    <button 
                        onClick={() => {
                          const btn = document.getElementById('tab-btn-copywriter');
                          if (btn) (btn as any).click();
                        }} 
                        className="group flex items-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold shadow-xl shadow-indigo-600/30 transition-all hover:-translate-y-1 active:scale-95"
                    >
                        <span>Start New Production</span>
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>

            {/* Google Drive Health */}
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-3xl p-6 flex flex-col justify-between">
                 <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-400 border border-blue-500/20">
                            <HardDrive size={24} />
                        </div>
                        <div>
                            <h3 className="text-white font-bold">Google Drive</h3>
                            <div className="flex items-center gap-1.5 text-[10px] text-green-400 font-bold uppercase tracking-widest mt-0.5">
                                <CheckCircle2 size={10} />
                                <span>Vault Connected</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800/50">
                            <div className="flex justify-between text-[11px] mb-2 font-bold uppercase tracking-widest">
                                <span className="text-slate-500">Destination</span>
                                <span className="text-indigo-400">/Flow/Daily_Shorts</span>
                            </div>
                            <div className="flex justify-between text-[11px] mb-2 font-bold uppercase tracking-widest">
                                <span className="text-slate-500">Auto-Backup</span>
                                <span className="text-green-400">Enabled</span>
                            </div>
                            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-4">
                                <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full w-[45%]"></div>
                            </div>
                        </div>
                    </div>
                 </div>

                 <button className="w-full mt-6 py-3 border border-slate-700 hover:border-indigo-500/50 text-slate-400 hover:text-indigo-400 text-xs font-bold uppercase tracking-widest rounded-xl transition-all">
                    Manage Storage
                 </button>
            </div>
       </div>
    </div>
  );
};

export default Dashboard;