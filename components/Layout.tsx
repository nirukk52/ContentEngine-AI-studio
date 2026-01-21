import React from 'react';
import { LayoutDashboard, PenTool, Image as ImageIcon, Video, Mic, Share2, Settings, HardDrive, History, LogOut } from 'lucide-react';
import { UserProfile } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
  user: UserProfile;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange, user, onLogout }) => {
  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'copywriter', icon: PenTool, label: 'Copywriter' },
    { id: 'visuals', icon: ImageIcon, label: 'Visual Studio' },
    { id: 'audio', icon: Mic, label: 'Voice Lab' },
    { id: 'history', icon: History, label: 'History & RAG' },
    { id: 'export', icon: Share2, label: 'Export' },
  ];

  return (
    <div className="flex h-screen bg-slate-900 text-white overflow-hidden">
      {/* Sidebar */}
      <div className="w-20 lg:w-64 bg-slate-950 border-r border-slate-800 flex flex-col justify-between">
        <div>
          <div className="p-6 flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
              <span className="font-bold text-lg">C</span>
            </div>
            <span className="hidden lg:block font-bold text-xl tracking-tight">ContentFlow</span>
          </div>

          <nav className="mt-6 px-2 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                    isActive 
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                      : 'text-slate-400 hover:bg-slate-900 hover:text-indigo-400'
                  }`}
                >
                  <Icon size={20} />
                  <span className="hidden lg:block font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-4 space-y-4">
           {/* Drive Status */}
           <div className="px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center space-x-3 text-slate-400">
             <HardDrive size={18} />
             <div className="hidden lg:block">
                <p className="text-xs font-semibold text-slate-300">Google Drive</p>
                <p className="text-[10px] text-green-500">Connected</p>
             </div>
           </div>

           {/* User Profile */}
           <div className="pt-4 border-t border-slate-800">
             <div className="flex items-center space-x-3 px-2 mb-3">
               <img src={user.avatarUrl} alt={user.name} className="w-8 h-8 rounded-full bg-indigo-500" />
               <div className="hidden lg:block overflow-hidden">
                 <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                 <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
               </div>
             </div>
             
             <div className="space-y-2">
               <button 
                onClick={() => onTabChange('settings')}
                className={`w-full flex items-center space-x-3 px-4 py-2 rounded-xl transition-colors ${activeTab === 'settings' ? 'bg-slate-800 text-indigo-400' : 'text-slate-400 hover:bg-slate-800'}`}
               >
                 <Settings size={18} />
                 <span className="hidden lg:block font-medium text-sm">Settings</span>
               </button>

               <button 
                 onClick={onLogout}
                 className="w-full flex items-center space-x-3 px-4 py-2 rounded-xl text-slate-400 hover:bg-red-900/20 hover:text-red-400 transition-colors"
               >
                 <LogOut size={18} />
                 <span className="hidden lg:block font-medium text-sm">Sign Out</span>
               </button>
             </div>
           </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className="h-16 bg-slate-900/50 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-8 z-10">
          <h2 className="text-xl font-semibold capitalize text-slate-200">
            {navItems.find(n => n.id === activeTab)?.label || (activeTab === 'settings' ? 'Settings' : 'Workspace')}
          </h2>
          <div className="flex items-center space-x-4">
             <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
             <span className="text-sm text-slate-400 font-mono">SYSTEM ONLINE</span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 relative">
           {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;