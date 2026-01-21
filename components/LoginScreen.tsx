import React, { useState } from 'react';
import { UserProfile } from '../types';
import { Chrome, Lock, Sparkles, ShieldCheck } from 'lucide-react';

interface LoginScreenProps {
  onLogin: (user: UserProfile) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSimulatedGoogleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) return;

    setIsLoading(true);
    
    // Simulate network delay
    setTimeout(() => {
      const mockUser: UserProfile = {
        id: email.toLowerCase().trim(), // In a real app, this would be a UID from Auth provider
        email: email,
        name: name,
        avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff`
      };
      onLogin(mockUser);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
         <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px]"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px]"></div>
      </div>

      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl relative z-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/20">
             <span className="font-bold text-3xl text-white">C</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Welcome to ContentFlow</h1>
          <p className="text-slate-400 text-sm">Autonomous AI Content Orchestration</p>
        </div>

        <form onSubmit={handleSimulatedGoogleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Name</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
          
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-white hover:bg-slate-100 text-slate-900 font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 mt-6 relative overflow-hidden"
          >
            {isLoading ? (
               <span className="flex items-center gap-2">
                 <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                 Authenticating...
               </span>
            ) : (
               <>
                 <Chrome size={20} className="text-blue-500" />
                 <span>Sign in with Google</span>
               </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-800">
           <div className="flex items-center justify-center gap-6 text-slate-500">
              <div className="flex items-center gap-1.5 text-xs">
                 <Lock size={12} />
                 <span>Secure</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs">
                 <ShieldCheck size={12} />
                 <span>Encrypted</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs">
                 <Sparkles size={12} />
                 <span>AI Powered</span>
              </div>
           </div>
        </div>
      </div>
      
      <p className="mt-8 text-slate-600 text-xs text-center relative z-10 max-w-sm">
        By signing in, you agree to access your private workspace. All scripts, visuals, and audio generations are tied to your unique user ID.
      </p>
    </div>
  );
};

export default LoginScreen;