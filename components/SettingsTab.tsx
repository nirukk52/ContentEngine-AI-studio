import React, { useState, useEffect } from 'react';
import { UserSettings } from '../types';
import { Save, Key, User, Mic } from 'lucide-react';

interface SettingsTabProps {
  settings: UserSettings;
  onSave: (newSettings: UserSettings) => void;
}

const SettingsTab: React.FC<SettingsTabProps> = ({ settings, onSave }) => {
  const [localSettings, setLocalSettings] = useState<UserSettings>(settings);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleChange = (key: keyof UserSettings, value: string) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
    setIsSaved(false);
  };

  const handleSave = () => {
    onSave(localSettings);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto pb-20 space-y-8">
       <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
         <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
               <Key className="text-indigo-400" />
               External Integrations
            </h2>
            <button 
               onClick={handleSave}
               className={`px-6 py-2 rounded-xl font-medium flex items-center gap-2 transition-all ${
                 isSaved 
                  ? 'bg-green-600 text-white' 
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white'
               }`}
            >
               <Save size={18} />
               {isSaved ? 'Saved!' : 'Save Configuration'}
            </button>
         </div>

         <div className="space-y-8">
            {/* ElevenLabs Section */}
            <div className="space-y-4 border-b border-slate-700 pb-8">
               <h3 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
                  <Mic size={18} className="text-purple-400" /> ElevenLabs (Audio)
               </h3>
               <p className="text-xs text-slate-400">Required for high-quality TTS. Leave blank to use Gemini TTS.</p>
               
               <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">API Key</label>
                    <input 
                      type="password" 
                      value={localSettings.elevenLabsKey || ''}
                      onChange={(e) => handleChange('elevenLabsKey', e.target.value)}
                      placeholder="xi-..."
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Voice ID</label>
                    <input 
                      type="text" 
                      value={localSettings.elevenLabsVoiceId || ''}
                      onChange={(e) => handleChange('elevenLabsVoiceId', e.target.value)}
                      placeholder="e.g. 21m00Tcm4TlvDq8ikWAM"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
               </div>
            </div>

            {/* HeyGen Section */}
            <div className="space-y-4">
               <h3 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
                  <User size={18} className="text-pink-400" /> HeyGen (Avatar Video)
               </h3>
               <p className="text-xs text-slate-400">Required for Lip-Sync Avatar Videos. Leave blank to use Gemini/Veo.</p>

               <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">API Key</label>
                    <input 
                      type="password" 
                      value={localSettings.heyGenKey || ''}
                      onChange={(e) => handleChange('heyGenKey', e.target.value)}
                      placeholder="heygen-..."
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Avatar ID</label>
                    <input 
                      type="text" 
                      value={localSettings.heyGenAvatarId || ''}
                      onChange={(e) => handleChange('heyGenAvatarId', e.target.value)}
                      placeholder="e.g. Daisy-inskirt-20220818"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500"
                    />
                  </div>
               </div>
            </div>
         </div>
       </div>
    </div>
  );
};

export default SettingsTab;