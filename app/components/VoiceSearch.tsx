"use client";

import React, { useState, useCallback, useRef, useEffect } from 'react';
import geoLocationService from '../services/ai/geoLocationService';

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
  
  // Detect user's language based on geolocation on component mount
  useEffect(() => {
    const detectLanguage = async () => {
      try {
        const detectedLanguage = await geoLocationService.detectUserLanguage();
        if (detectedLanguage && detectedLanguage !== selectedLanguage) {
          onLanguageDetected(detectedLanguage);
        }
      } catch (error) {
        console.error('Error detecting user language:', error);
      }
    };
    
    // Only run detection if we're using the default language
    if (selectedLanguage === 'en-US' || selectedLanguage === 'auto') {
      detectLanguage();
    }
  }, [selectedLanguage, onLanguageDetected]);
  
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
  
  // Stop recording and process audio with enhanced error handling
  const stopRecording = async () => {
    if (!isListening || !audioContextRef.current) return;
    
    setIsListening(false);
    setIsProcessing(true);
    
    try {
      // Play a subtle sound to indicate end of listening
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // A4 note
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime); // Low volume
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.1); // Very short beep
      } catch (audioErr) {
        console.error('Error playing audio feedback:', audioErr);
        // Non-critical error, continue with processing
      }
      
      // Convert audio data to the right format for Google Speech API
      const audioData = convertAudioToWav(audioChunksRef.current, audioContextRef.current.sampleRate);
      
      // Check if we have enough audio data
      if (audioChunksRef.current.length < 5) {
        throw new Error('Recording too short. Please speak longer.');
      }
      
      // Use the AI voice search service for processing
      const voiceSearchService = await import('../services/ai/voiceSearchService').then(module => module.default);
      
      try {
        // Send to server for processing via the voice search service
        const result = await voiceSearchService.transcribeAudio(
          arrayBufferToBase64(audioData),
          selectedLanguage === 'auto' ? 'auto' : selectedLanguage
        );
        
        if (!result.success) {
          throw new Error('Failed to process speech');
        }
        
        // Update with transcription and detected language
        if ('transcription' in result) {
          // Play success sound
          try {
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(880, audioContext.currentTime); // A5 note
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime); // Low volume
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.05);
            
            setTimeout(() => {
              const oscillator2 = audioContext.createOscillator();
              oscillator2.type = 'sine';
              oscillator2.frequency.setValueAtTime(1320, audioContext.currentTime); // E6 note
              oscillator2.connect(gainNode);
              oscillator2.start();
              oscillator2.stop(audioContext.currentTime + 0.05);
            }, 100);
          } catch (audioErr) {
            // Non-critical error, continue
            console.error('Error playing success audio:', audioErr);
          }
          
          onTranscript(result.transcription);
          
          if ('detectedLanguage' in result && result.detectedLanguage) {
            onLanguageDetected(result.detectedLanguage);
          }
        }
      } catch (apiError) {
        console.warn('Primary voice service failed, trying fallback:', apiError);
        
        // Fallback to direct API call if service fails
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
          const errorText = await response.text();
          throw new Error(`API error (${response.status}): ${errorText || 'Failed to process speech'}`);
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
      }
    } catch (err) {
      console.error('Error processing speech:', err);
      
      // Play error sound
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(220, audioContext.currentTime); // A3 note (low)
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime); // Low volume
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.2);
      } catch (audioErr) {
        // Non-critical error
        console.error('Error playing error audio:', audioErr);
      }
      
      // More user-friendly error messages
      if (err instanceof Error) {
        if (err.message.includes('getUserMedia') || err.message.includes('Permission')) {
          setError('Microphone access denied. Please allow microphone access and try again.');
        } else if (err.message.includes('too short')) {
          setError('Recording too short. Please speak longer.');
        } else if (err.message.includes('no speech')) {
          setError('No speech detected. Please speak clearly and try again.');
        } else {
          setError(`${err.message || 'Error processing speech'}. Please try again.`);
        }
      } else {
        setError('Error processing speech. Please try again.');
      }
      
      // Auto-clear error after 5 seconds
      setTimeout(() => {
        setError(null);
      }, 5000);
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
  
  // Toggle recording with feedback
  const toggleListening = useCallback(() => {
    if (isListening) {
      stopRecording();
    } else {
      // Provide audio feedback when starting to listen
      try {
        // Play a subtle sound to indicate start of listening
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(880, audioContext.currentTime); // A5 note
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime); // Low volume
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.15); // Short beep
        
        // Small delay before actually starting recording
        setTimeout(() => {
          startRecording();
        }, 150);
      } catch (err) {
        console.error('Error playing audio feedback:', err);
        // If audio feedback fails, just start recording
        startRecording();
      }
    }
  }, [isListening, startRecording, stopRecording]);
  
  return (
    <div className="relative">
      {/* Voice search button with enhanced visual states */}
      <button 
        type="button"
        onClick={toggleListening}
        className={`absolute right-8 top-1/2 transform -translate-y-1/2 ${
          isListening 
            ? 'bg-red-500 ring-4 ring-red-200' 
            : isProcessing 
              ? 'bg-yellow-500 ring-2 ring-yellow-200' 
              : 'bg-primary hover:bg-primary-dark'
        } text-white p-1 rounded-full w-6 h-6 flex items-center justify-center shadow-sm transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary`}
        aria-label={isListening ? 'Stop listening' : 'Start voice search'}
        disabled={isProcessing || (!!error && error.includes('does not support'))}
        title={isListening ? 'Click to stop listening' : isProcessing ? 'Processing speech...' : 'Click to start voice search'}
      >
        <img 
          src="/assets/icons/microphone-icon.svg" 
          alt="Microphone" 
          className={`w-3 h-3 ${
            isListening 
              ? 'animate-pulse' 
              : isProcessing 
                ? 'animate-spin-slow' 
                : 'transform transition-transform duration-300 group-hover:scale-110'
          }`}
        />
      </button>
      
      {/* Enhanced visual feedback for listening state - multiple rings */}
      {isListening && (
        <>
          <div className="absolute right-8 top-1/2 transform -translate-y-1/2 w-10 h-10 -m-2 rounded-full bg-red-500 bg-opacity-20 animate-ping"></div>
          <div className="absolute right-8 top-1/2 transform -translate-y-1/2 w-14 h-14 -m-4 rounded-full bg-red-500 bg-opacity-10 animate-ping animation-delay-300"></div>
          <div className="absolute right-8 top-1/2 transform -translate-y-1/2 w-18 h-18 -m-6 rounded-full bg-red-500 bg-opacity-5 animate-ping animation-delay-600"></div>
        </>
      )}
      
      {/* Processing animation */}
      {isProcessing && (
        <div className="absolute right-8 top-1/2 transform -translate-y-1/2 w-10 h-10 -m-2 rounded-full border-2 border-yellow-500 border-t-transparent animate-spin"></div>
      )}
      
      {/* Enhanced error message tooltip with icon */}
      {error && (
        <div className="absolute right-16 top-1/2 transform -translate-y-1/2 bg-white border border-red-200 rounded-md shadow-md p-2 text-xs text-red-500 w-56 z-10 flex items-start space-x-2 animate-fade-in">
          <svg className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span>{error}</span>
        </div>
      )}
      
      {/* Enhanced "Hi Emi" prompt tooltip with microphone icon */}
      {isListening && (
        <div className="absolute right-16 top-1/2 transform -translate-y-1/2 bg-white border border-green-200 rounded-md shadow-md p-2 text-xs text-gray-700 w-56 z-10 flex items-start space-x-2 animate-fade-in">
          <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
          </svg>
          <div>
            <span className="font-medium text-green-600 block mb-0.5">Listening...</span>
            Say <span className="font-bold">"Hi Emi"</span> followed by your question
            <span className="block mt-1 text-gray-500 text-2xs">Example: "Hi Emi find plumbers in Lagos"</span>
          </div>
        </div>
      )}
      
      {/* Language indicator when processing */}
      {isProcessing && (
        <div className="absolute right-16 top-1/2 transform -translate-y-1/2 mt-8 bg-white border border-yellow-200 rounded-md shadow-md p-2 text-xs text-gray-700 z-10 animate-fade-in">
          <span className="text-yellow-600">Processing speech in </span>
          <span className="font-medium">{selectedLanguage === 'auto' ? 'auto-detect' : selectedLanguage}</span>
        </div>
      )}
    </div>
  );
};

export default VoiceSearch;
