// --- ElevenLabs Integration ---

export const generateElevenLabsAudio = async (
  text: string, 
  apiKey: string, 
  voiceId: string = "21m00Tcm4TlvDq8ikWAM"
): Promise<{ base64: string, blob: Blob }> => {
  try {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': apiKey
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_monolingual_v1",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75
        }
      })
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.detail?.message || "ElevenLabs API Error");
    }

    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result as string;
        resolve({ base64: base64data, blob });
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("ElevenLabs Generation Failed", error);
    throw error;
  }
};

// --- HeyGen Integration ---

// Helper: Poll for video completion
const pollHeyGenVideo = async (videoId: string, apiKey: string): Promise<string> => {
  let attempts = 0;
  const maxAttempts = 60; // 5 minutes approx

  while (attempts < maxAttempts) {
    await new Promise(r => setTimeout(r, 5000)); // Wait 5s
    
    const statusResponse = await fetch(`https://api.heygen.com/v1/video_status.get?video_id=${videoId}`, {
      headers: { 'X-Api-Key': apiKey }
    });
    
    if (statusResponse.ok) {
      const data = await statusResponse.json();
      const status = data.data.status;
      
      if (status === 'completed') {
        return data.data.video_url;
      } else if (status === 'failed') {
        throw new Error("HeyGen Video Processing Failed");
      }
    }
    attempts++;
  }
  throw new Error("HeyGen Video Timeout");
};

// Helper: Upload Asset (Audio)
const uploadAudioToHeyGen = async (audioBlob: Blob, apiKey: string): Promise<string> => {
  const renameFile = new File([audioBlob], "audio.mp3", { type: "audio/mpeg" });

  const initResponse = await fetch(`https://api.heygen.com/v1/asset/upload`, {
    method: 'POST',
    headers: {
      'X-Api-Key': apiKey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: `audio_${Date.now()}.mp3`,
      content_type: "audio/mpeg"
    })
  });

  if (!initResponse.ok) throw new Error("HeyGen Upload Init Failed");
  const initData = await initResponse.json();
  const uploadUrl = initData.data.upload_url;
  const assetId = initData.data.id;

  const uploadResponse = await fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': 'audio/mpeg'
    },
    body: renameFile
  });

  if (!uploadResponse.ok) throw new Error("HeyGen Asset Upload Failed");

  return assetId;
};

// Main: Generate Video
export const generateHeyGenVideo = async (
  scriptText: string,
  apiKey: string,
  avatarId: string = "Daisy-inskirt-20220818",
  audioBlob?: Blob
): Promise<string> => {
  try {
    let audioAssetId = null;

    if (audioBlob) {
        audioAssetId = await uploadAudioToHeyGen(audioBlob, apiKey);
    }

    const payload: any = {
      video_inputs: [
        {
          character: {
            type: "avatar",
            avatar_id: avatarId,
            scale: 1.0
          },
          voice: audioAssetId ? {
            type: "audio",
            audio_asset_id: audioAssetId
          } : {
            type: "text",
            input_text: scriptText,
            voice_id: "1bd001e7e50f421d891986aad5158bc8"
          },
          background: {
            type: "color",
            value: "#000000"
          }
        }
      ],
      dimension: {
        width: 720,
        height: 1280
      }
    };

    const genResponse = await fetch(`https://api.heygen.com/v2/video/generate`, {
      method: 'POST',
      headers: {
        'X-Api-Key': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!genResponse.ok) {
        const err = await genResponse.json();
        throw new Error(err.message || "HeyGen Generation Failed");
    }

    const genData = await genResponse.json();
    const videoId = genData.data.video_id;

    return await pollHeyGenVideo(videoId, apiKey);

  } catch (error) {
    console.error("HeyGen Integration Error", error);
    throw error;
  }
};