import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { Chrome, Lock, Sparkles, ShieldCheck, AlertTriangle } from 'lucide-react';
import { UserProfile } from '../types';
import { jwtDecode } from 'jwt-decode';

interface LoginScreenProps {
  onLogin: (user: UserProfile) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSuccess = (credentialResponse: any) => {
    try {
      if (!credentialResponse.credential) {
        setError("No credential received from Google.");
        return;
      }

      const decoded: any = jwtDecode(credentialResponse.credential);

      const user: UserProfile = {
        id: decoded.sub,
        email: decoded.email,
        name: decoded.name,
        avatarUrl: decoded.picture
      };

      onLogin(user);
    } catch (err) {
      console.error("Login Failed", err);
      setError("Failed to process login token.");
    }
  };

  const handleGoogleError = () => {
    setError("Google Sign-In was unsuccessful. Please try again.");
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px]"></div>
      </div>

      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl relative z-10 flex flex-col items-center">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/20">
            <span className="font-bold text-3xl text-white">C</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Welcome to ContentFlow</h1>
          <p className="text-slate-400 text-sm">Autonomous AI Content Orchestration</p>
        </div>

        {error && (
          <div className="w-full mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-400 text-xs">
            <AlertTriangle size={14} />
            <span>{error}</span>
          </div>
        )}

        <div className="w-full flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            theme="filled_black"
            shape="pill"
            size="large"
            width="100%"
            text="continue_with"
            useOneTap
            auto_select
          />
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800 w-full">
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

      <p className="mt-8 text-slate-600 text-xs text-center relative z-10 max-w-sm leading-relaxed">
        By signing in, you agree to allow ContentFlow to access your Google Drive App Data folder for syncing your projects securely.
      </p>
    </div>
  );
};

export default LoginScreen;