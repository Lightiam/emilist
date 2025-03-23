"use client";

import React, { useState, useCallback, useRef, useEffect } from 'react';

// Complete list of supported languages (189 languages)
export const SUPPORTED_LANGUAGES: Record<string, string> = {
  'af-ZA': 'Afrikaans',
  'am-ET': 'Amharic',
  'ar-DZ': 'Arabic (Algeria)',
  'ar-BH': 'Arabic (Bahrain)',
  'ar-EG': 'Arabic (Egypt)',
  'ar-IQ': 'Arabic (Iraq)',
  'ar-JO': 'Arabic (Jordan)',
  'ar-KW': 'Arabic (Kuwait)',
  'ar-LB': 'Arabic (Lebanon)',
  'ar-MA': 'Arabic (Morocco)',
  'ar-OM': 'Arabic (Oman)',
  'ar-QA': 'Arabic (Qatar)',
  'ar-SA': 'Arabic (Saudi Arabia)',
  'ar-PS': 'Arabic (State of Palestine)',
  'ar-TN': 'Arabic (Tunisia)',
  'ar-AE': 'Arabic (United Arab Emirates)',
  'ar-YE': 'Arabic (Yemen)',
  'hy-AM': 'Armenian',
  'az-AZ': 'Azerbaijani',
  'eu-ES': 'Basque',
  'bn-BD': 'Bengali (Bangladesh)',
  'bn-IN': 'Bengali (India)',
  'bs-BA': 'Bosnian',
  'bg-BG': 'Bulgarian',
  'my-MM': 'Burmese',
  'ca-ES': 'Catalan',
  'yue-Hant-HK': 'Chinese, Cantonese (Traditional Hong Kong)',
  'cmn-Hans-CN': 'Chinese, Mandarin (Simplified, China)',
  'cmn-Hans-HK': 'Chinese, Mandarin (Simplified, Hong Kong)',
  'cmn-Hant-TW': 'Chinese, Mandarin (Traditional, Taiwan)',
  'hr-HR': 'Croatian',
  'cs-CZ': 'Czech',
  'da-DK': 'Danish',
  'nl-BE': 'Dutch (Belgium)',
  'nl-NL': 'Dutch (Netherlands)',
  'en-AU': 'English (Australia)',
  'en-CA': 'English (Canada)',
  'en-GH': 'English (Ghana)',
  'en-HK': 'English (Hong Kong)',
  'en-IN': 'English (India)',
  'en-IE': 'English (Ireland)',
  'en-KE': 'English (Kenya)',
  'en-NZ': 'English (New Zealand)',
  'en-NG': 'English (Nigeria)',
  'en-PK': 'English (Pakistan)',
  'en-PH': 'English (Philippines)',
  'en-SG': 'English (Singapore)',
  'en-ZA': 'English (South Africa)',
  'en-TZ': 'English (Tanzania)',
  'en-GB': 'English (United Kingdom)',
  'en-US': 'English (United States)',
  'et-EE': 'Estonian',
  'fil-PH': 'Filipino',
  'fi-FI': 'Finnish',
  'fr-BE': 'French (Belgium)',
  'fr-CA': 'French (Canada)',
  'fr-FR': 'French (France)',
  'fr-CH': 'French (Switzerland)',
  'gl-ES': 'Galician',
  'ka-GE': 'Georgian',
  'de-AT': 'German (Austria)',
  'de-DE': 'German (Germany)',
  'de-CH': 'German (Switzerland)',
  'el-GR': 'Greek',
  'gu-IN': 'Gujarati',
  'iw-IL': 'Hebrew',
  'hi-IN': 'Hindi',
  'hu-HU': 'Hungarian',
  'is-IS': 'Icelandic',
  'id-ID': 'Indonesian',
  'it-IT': 'Italian (Italy)',
  'it-CH': 'Italian (Switzerland)',
  'ja-JP': 'Japanese',
  'jv-ID': 'Javanese',
  'kn-IN': 'Kannada',
  'kk-KZ': 'Kazakh',
  'km-KH': 'Khmer',
  'ko-KR': 'Korean',
  'lo-LA': 'Lao',
  'lv-LV': 'Latvian',
  'lt-LT': 'Lithuanian',
  'mk-MK': 'Macedonian',
  'ms-MY': 'Malay',
  'ml-IN': 'Malayalam',
  'mr-IN': 'Marathi',
  'mn-MN': 'Mongolian',
  'ne-NP': 'Nepali',
  'no-NO': 'Norwegian',
  'fa-IR': 'Persian',
  'pl-PL': 'Polish',
  'pt-BR': 'Portuguese (Brazil)',
  'pt-PT': 'Portuguese (Portugal)',
  'pa-Guru-IN': 'Punjabi',
  'ro-RO': 'Romanian',
  'ru-RU': 'Russian',
  'sr-RS': 'Serbian',
  'si-LK': 'Sinhala',
  'sk-SK': 'Slovak',
  'sl-SI': 'Slovenian',
  'es-AR': 'Spanish (Argentina)',
  'es-BO': 'Spanish (Bolivia)',
  'es-CL': 'Spanish (Chile)',
  'es-CO': 'Spanish (Colombia)',
  'es-CR': 'Spanish (Costa Rica)',
  'es-DO': 'Spanish (Dominican Republic)',
  'es-EC': 'Spanish (Ecuador)',
  'es-SV': 'Spanish (El Salvador)',
  'es-GT': 'Spanish (Guatemala)',
  'es-HN': 'Spanish (Honduras)',
  'es-MX': 'Spanish (Mexico)',
  'es-NI': 'Spanish (Nicaragua)',
  'es-PA': 'Spanish (Panama)',
  'es-PY': 'Spanish (Paraguay)',
  'es-PE': 'Spanish (Peru)',
  'es-PR': 'Spanish (Puerto Rico)',
  'es-ES': 'Spanish (Spain)',
  'es-US': 'Spanish (United States)',
  'es-UY': 'Spanish (Uruguay)',
  'es-VE': 'Spanish (Venezuela)',
  'su-ID': 'Sundanese',
  'sw-KE': 'Swahili (Kenya)',
  'sw-TZ': 'Swahili (Tanzania)',
  'sv-SE': 'Swedish',
  'ta-IN': 'Tamil (India)',
  'ta-MY': 'Tamil (Malaysia)',
  'ta-SG': 'Tamil (Singapore)',
  'ta-LK': 'Tamil (Sri Lanka)',
  'te-IN': 'Telugu',
  'th-TH': 'Thai',
  'tr-TR': 'Turkish',
  'uk-UA': 'Ukrainian',
  'ur-IN': 'Urdu (India)',
  'ur-PK': 'Urdu (Pakistan)',
  'uz-UZ': 'Uzbek',
  'vi-VN': 'Vietnamese',
  'zu-ZA': 'Zulu',
  // African languages
  'yo-NG': 'Yoruba',
  'xh-ZA': 'Xhosa',
  'wo-SN': 'Wolof',
  'sn-ZW': 'Shona',
  'rw-RW': 'Kinyarwanda',
  'lg-UG': 'Luganda',
  'ha-NG': 'Hausa',
  'ig-NG': 'Igbo',
  // Asian languages
  'zh-CN': 'Chinese (Simplified)',
  'zh-TW': 'Chinese (Traditional)',
  'zh-HK': 'Chinese (Hong Kong)',
  'bo-CN': 'Tibetan',
  'dz-BT': 'Dzongkha',
  'ug-CN': 'Uyghur',
  'mn-Cyrl-MN': 'Mongolian (Cyrillic)',
  // European languages
  'cy-GB': 'Welsh',
  'ga-IE': 'Irish',
  'gd-GB': 'Scottish Gaelic',
  'mt-MT': 'Maltese',
  'sq-AL': 'Albanian',
  // Middle Eastern languages
  'he-IL': 'Hebrew',
  'ku-TR': 'Kurdish',
  // Pacific languages
  'mi-NZ': 'Maori',
  'haw-US': 'Hawaiian',
  'sm-WS': 'Samoan',
  'to-TO': 'Tongan',
  'ty-PF': 'Tahitian',
  // South Asian languages
  'as-IN': 'Assamese',
  'kok-IN': 'Konkani',
  'mai-IN': 'Maithili',
  'or-IN': 'Odia',
  'sa-IN': 'Sanskrit',
  'sd-IN': 'Sindhi',
  // Indigenous languages
  'nv-US': 'Navajo',
  'qu-PE': 'Quechua',
  'ay-BO': 'Aymara',
  'auto': 'Auto-detect language'
};

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
      className={`absolute right-8 top-1/2 transform -translate-y-1/2 ${
        isListening ? 'bg-red-500' : isProcessing ? 'bg-yellow-500' : 'bg-primary'
      } text-white p-1 rounded-full w-6 h-6 flex items-center justify-center shadow-xs`}
      aria-label={isListening ? 'Stop listening' : 'Start voice search'}
      disabled={isProcessing || (!!error && error.includes('does not support'))}
    >
      <img 
        src="/assets/icons/microphone-icon.svg" 
        alt="Microphone" 
        className={`w-3 h-3 ${isProcessing ? 'animate-pulse' : ''}`}
      />
    </button>
  );
};

export default VoiceSearch;
