import { NextRequest, NextResponse } from 'next/server';
import { SpeechClient } from '@google-cloud/speech';
import { protos } from '@google-cloud/speech';

// Configure route for static export
export const dynamic = 'force-static';

// Define types for the Speech API
type RecognizeRequest = protos.google.cloud.speech.v1.IRecognizeRequest;
type RecognizeResponse = protos.google.cloud.speech.v1.IRecognizeResponse;

// Initialize the Speech client
const speechClient = new SpeechClient();

export async function POST(req: NextRequest) {
  try {
    const { audioData, languageCode = 'en-US' } = await req.json();
    
    if (!audioData) {
      return NextResponse.json(
        { error: 'Audio data is required' },
        { status: 400 }
      );
    }
    
    // Decode base64 audio data
    const audioBuffer = Buffer.from(audioData, 'base64');
    
    // Configure the request
    const request: RecognizeRequest = {
      audio: {
        content: audioBuffer.toString('base64'),
      },
      config: {
        encoding: 'LINEAR16' as const,
        sampleRateHertz: 16000,
        languageCode: languageCode,
        // Enable language detection if languageCode is "auto"
        alternativeLanguageCodes: languageCode === 'auto' ? 
          ['en-US', 'es-ES', 'fr-FR', 'de-DE', 'zh-CN', 'ja-JP', 'ru-RU', 'ar-SA', 'hi-IN'] : 
          [],
        model: 'default',
        // Enable automatic punctuation
        enableAutomaticPunctuation: true,
      },
    };
    
    // Make the API call
    const [response] = await speechClient.recognize(request);
    
    if (!response.results || response.results.length === 0) {
      return NextResponse.json(
        { error: 'No speech detected' },
        { status: 400 }
      );
    }
    
    // Extract the transcription from the response
    const transcription = response.results
      .map(result => result.alternatives?.[0]?.transcript || '')
      .join(' ');
      
    // Extract the detected language if available
    const detectedLanguage = response.results[0]?.languageCode || languageCode;
    
    return NextResponse.json({ transcription, detectedLanguage });
  } catch (error) {
    console.error('Speech-to-Text API error:', error);
    return NextResponse.json(
      { error: 'Failed to process audio' },
      { status: 500 }
    );
  }
}
