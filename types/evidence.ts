export type AspectRatio = "9:16";

export interface Script {
    id: string;
    topic: string;
    aspectRatio: AspectRatio;
    scenes: Scene[];
    createdAt: string;
    updatedAt: string;
}

export interface Scene {
    id: string;
    order: number;
    segments: Segment[];
}

export type AvatarPosition = "bottom-right" | "bottom-left" | "hidden" | "full-screen";
export type CaptionStyle = "karaoke" | "minimal" | "standard";

export interface Segment {
    id: string;
    order: number;

    // The spoken script
    avatarLine: string;

    // Visual Configuration
    proofAsset: ProofAsset;

    // Avatar Configuration
    avatarConfig: {
        isVisible: boolean;
        position: AvatarPosition;
        captionStyle?: CaptionStyle;
    };

    // Optional AI filler context
    backgroundPrompt?: string;
}

export type ProofAssetType = "web_screenshot" | "video_clip" | "ai_generated_video" | "template";

export interface ProofAsset {
    type: ProofAssetType;
    // The source URL for the proof (article, video, etc.)
    url?: string;
    // title of the source
    sourceTitle?: string;
    // The captured visual URL (e.g. the Apify screenshot)
    visualUrl?: string;

    // For manual highlighting
    cropCoordinates?: {
        x: number;
        y: number;
        width: number;
        height: number;
    };

    // The text intended to be highlighted (for AI verification or fallback)
    highlightText?: string;

    // If "template", which ID
    templateId?: string;
}
