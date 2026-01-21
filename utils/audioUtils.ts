// Utility to play audio (supports both standard Data URIs and Gemini Raw PCM)
export const playSmartAudio = async (audioData: string, sampleRate = 24000) => {
  // Case 1: Standard Audio Formats (MP3/WAV/Blob) - Used by ElevenLabs & HeyGen
  if (audioData.startsWith('data:audio/') || audioData.startsWith('blob:') || audioData.startsWith('http')) {
    const audio = new Audio(audioData);
    await audio.play();
    return audio;
  }

  // Case 2: Raw PCM - Used by Gemini TTS
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({
    sampleRate
  });
  
  const binaryString = atob(audioData);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  // Convert Uint8Array to Int16Array (16-bit PCM)
  const dataInt16 = new Int16Array(bytes.buffer);
  
  // Create buffer
  const buffer = audioContext.createBuffer(1, dataInt16.length, sampleRate);
  const channelData = buffer.getChannelData(0);
  
  // Normalize to -1.0 to 1.0
  for (let i = 0; i < dataInt16.length; i++) {
    channelData[i] = dataInt16[i] / 32768.0;
  }

  const source = audioContext.createBufferSource();
  source.buffer = buffer;
  source.connect(audioContext.destination);
  source.start();
  
  return source; 
};