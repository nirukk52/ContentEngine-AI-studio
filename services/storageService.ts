import { Project, FeedbackItem, UserSettings } from "../types";

const STORAGE_PREFIX = 'contentflow_user_';

interface UserData {
  project: Project | null;
  history: FeedbackItem[];
  pastTopics: string[];
  ragContext: string;
  settings?: UserSettings;
}

export const saveUserData = (userId: string, data: UserData) => {
  try {
    const key = `${STORAGE_PREFIX}${userId}`;
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error("Failed to save user data", e);
  }
};

export const loadUserData = (userId: string): UserData => {
  const defaultData: UserData = {
    project: null,
    history: [],
    pastTopics: [],
    ragContext: "",
    settings: {
      elevenLabsVoiceId: "21m00Tcm4TlvDq8ikWAM", // Default Rachel
      heyGenAvatarId: "Daisy-inskirt-20220818", // Default Daisy
    }
  };

  try {
    const key = `${STORAGE_PREFIX}${userId}`;
    const stored = localStorage.getItem(key);
    if (!stored) return defaultData;

    const parsed = JSON.parse(stored);

    // Revive dates
    if (parsed.project) {
        parsed.project.createdAt = new Date(parsed.project.createdAt);
    }
    if (parsed.history) {
        parsed.history = parsed.history.map((h: any) => ({
            ...h,
            timestamp: new Date(h.timestamp)
        }));
    }

    return { ...defaultData, ...parsed };
  } catch (e) {
    console.error("Failed to load user data", e);
    return defaultData;
  }
};

export const clearUserData = (userId: string) => {
    try {
        localStorage.removeItem(`${STORAGE_PREFIX}${userId}`);
    } catch(e) {
        console.error(e);
    }
};