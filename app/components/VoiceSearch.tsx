"use client";

import React, { useState, useCallback, useRef, useEffect } from 'react';

interface VoiceSearchProps {
  onTranscript: (text: string) => void;
  onLanguageDetected: (language: string) => void;
  selectedLanguage?: string;
}

const VoiceSearch: React.FC<VoiceSearchProps> = ({ 
  onTranscript, 
  onLanguageDetected,
  selectedLanguage = 'en-US'
}) => {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Audio recording references
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const audioChunksRef = useRef<Float32Array[]>([]);
  
  // Clean up function for audio resources
  const cleanupAudio = useCallback(() => {
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(console.error);
      audioContextRef.current = null;
    }
    
    audioChunksRef.current = [];
  }, []);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      cleanupAudio();
    };
  }, [cleanupAudio]);
  
  // Start recording
  const startRecording = async () => {
    try {
      setError(null);
      
      // Get user media (microphone)
      mediaStreamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Create audio context
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Create source node
      const source = audioContextRef.current.createMediaStreamSource(mediaStreamRef.current);
      
      // Create processor for recording
      processorRef.current = audioContextRef.current.createScriptProcessor(4096, 1, 1);
      
      // Connect nodes
      source.connect(processorRef.current);
      processorRef.current.connect(audioContextRef.current.destination);
      
      // Handle audio processing
      processorRef.current.onaudioprocess = (e) => {
        const audioData = e.inputBuffer.getChannelData(0);
        audioChunksRef.current.push(new Float32Array(audioData));
      };
      
      setIsListening(true);
    } catch (err) {
      console.error('Error starting recording:', err);
      setError('Error accessing microphone');
      cleanupAudio();
    }
  };
  
  // Stop recording and process audio
  const stopRecording = async () => {
    if (!isListening || !audioContextRef.current) return;
    
    setIsListening(false);
    setIsProcessing(true);
    
    try {
      // Convert audio data to the right format for Google Speech API
      const audioData = convertAudioToWav(audioChunksRef.current, audioContextRef.current.sampleRate);
      
      // Send to server for processing
      const response = await fetch('/api/speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          audioData: arrayBufferToBase64(audioData),
          languageCode: selectedLanguage === 'auto' ? 'auto' : selectedLanguage,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to process speech');
      }
      
      const result = await response.json();
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      // Update with transcription and detected language
      onTranscript(result.transcription);
      
      if (result.detectedLanguage) {
        onLanguageDetected(result.detectedLanguage);
      }
    } catch (err) {
      console.error('Error processing speech:', err);
      setError('Error processing speech. Please try again.');
    } finally {
      cleanupAudio();
      setIsProcessing(false);
    }
  };
  
  // Convert audio data to WAV format
  const convertAudioToWav = (audioChunks: Float32Array[], sampleRate: number): ArrayBuffer => {
    // Combine all chunks
    const totalLength = audioChunks.reduce((acc, chunk) => acc + chunk.length, 0);
    const audioData = new Float32Array(totalLength);
    
    let offset = 0;
    for (const chunk of audioChunks) {
      audioData.set(chunk, offset);
      offset += chunk.length;
    }
    
    // Resample to 16kHz for Google Speech API
    const targetSampleRate = 16000;
    const resampledData = resampleAudio(audioData, sampleRate, targetSampleRate);
    
    // Convert to 16-bit PCM
    const pcmData = new Int16Array(resampledData.length);
    for (let i = 0; i < resampledData.length; i++) {
      const s = Math.max(-1, Math.min(1, resampledData[i]));
      pcmData[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    }
    
    // Create WAV header
    const wavHeader = createWavHeader(pcmData.length * 2, targetSampleRate);
    
    // Combine header and audio data
    const wavFile = new Uint8Array(wavHeader.length + pcmData.length * 2);
    wavFile.set(wavHeader, 0);
    
    // Add PCM data
    const pcmBytes = new Uint8Array(pcmData.buffer);
    wavFile.set(pcmBytes, wavHeader.length);
    
    return wavFile.buffer;
  };
  
  // Create WAV header
  const createWavHeader = (dataLength: number, sampleRate: number): Uint8Array => {
    const header = new ArrayBuffer(44);
    const view = new DataView(header);
    
    // RIFF identifier
    writeString(view, 0, 'RIFF');
    // file length minus RIFF identifier length and file description length
    view.setUint32(4, 36 + dataLength, true);
    // WAVE identifier
    writeString(view, 8, 'WAVE');
    // format chunk identifier
    writeString(view, 12, 'fmt ');
    // format chunk length
    view.setUint32(16, 16, true);
    // sample format (1 is PCM)
    view.setUint16(20, 1, true);
    // mono (1 channel)
    view.setUint16(22, 1, true);
    // sample rate
    view.setUint32(24, sampleRate, true);
    // byte rate (sample rate * block align)
    view.setUint32(28, sampleRate * 2, true);
    // block align (channel count * bytes per sample)
    view.setUint16(32, 2, true);
    // bits per sample
    view.setUint16(34, 16, true);
    // data chunk identifier
    writeString(view, 36, 'data');
    // data chunk length
    view.setUint32(40, dataLength, true);
    
    return new Uint8Array(header);
  };
  
  // Helper to write string to DataView
  const writeString = (view: DataView, offset: number, string: string): void => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };
  
  // Resample audio
  const resampleAudio = (audioData: Float32Array, fromSampleRate: number, toSampleRate: number): Float32Array => {
    if (fromSampleRate === toSampleRate) {
      return audioData;
    }
    
    const ratio = fromSampleRate / toSampleRate;
    const newLength = Math.round(audioData.length / ratio);
    const result = new Float32Array(newLength);
    
    for (let i = 0; i < newLength; i++) {
      const posOriginal = i * ratio;
      const index = Math.floor(posOriginal);
      const fraction = posOriginal - index;
      
      if (index + 1 < audioData.length) {
        result[i] = audioData[index] * (1 - fraction) + audioData[index + 1] * fraction;
      } else {
        result[i] = audioData[index];
      }
    }
    
    return result;
  };
  
  // Helper to convert ArrayBuffer to base64
  const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };
  
  // Toggle recording
  const toggleListening = useCallback(() => {
    if (isListening) {
      stopRecording();
    } else {
      startRecording();
    }
  }, [isListening]);
  
  return (
    <button 
      type="button"
      onClick={toggleListening}
      className={`absolute right-12 top-1/2 transform -translate-y-1/2 ${
        isListening ? 'bg-red-500' : isProcessing ? 'bg-yellow-500' : 'bg-primary'
      } text-white p-2 rounded-full w-10 h-10 flex items-center justify-center shadow-md`}
      aria-label={isListening ? 'Stop listening' : 'Start voice search'}
      disabled={isProcessing || (!!error && error.includes('does not support'))}
    >
      <img 
        src="/assets/icons/microphone-icon.svg" 
        alt="Microphone" 
        className={`w-5 h-5 ${isProcessing ? 'animate-pulse' : ''}`}
      />
    </button>
  );
};

export default VoiceSearch;
