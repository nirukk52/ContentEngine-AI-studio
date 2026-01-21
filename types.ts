export enum AgentType {
  COPYWRITER = 'copywriter',
  VISUAL_ARTIST = 'visual_artist',
  VOICE_ACTOR = 'voice_actor',
  EDITOR = 'editor'
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  settings?: UserSettings;
}

export interface UserSettings {
  elevenLabsKey?: string;
  elevenLabsVoiceId?: string;
  heyGenKey?: string;
  heyGenAvatarId?: string;
}

export interface ScriptSegment {
  id: string;
  order: number;
  duration: number; // in seconds
  scriptText: string;
  visualPrompt: string;
  visualType: 'image' | 'video' | 'avatar' | 'avatar_video';
  visualUrl?: string;
  audioUrl?: string;
  isGenerating?: boolean;
}

export interface Project {
  id: string;
  title: string;
  topic: string;
  aspectRatio: '9:16';
  segments: ScriptSegment[];
  systemPrompts: {
    copywriter: string;
    visual: string;
  };
  createdAt: Date; // stored as string in JSON, needs parsing
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface FeedbackItem {
  id: string;
  segmentId: string;
  visualUrl?: string;
  scriptText: string;
  rating: 'like' | 'dislike';
  notes?: string;
  timestamp: Date;
}

export type ChatMode = 'script' | 'visual' | 'audio' | 'avatar' | 'avatar_video' | 'combo';