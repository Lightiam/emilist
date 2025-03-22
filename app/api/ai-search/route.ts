import { NextRequest, NextResponse } from 'next/server';

// Configure route for static export
export const dynamic = 'force-static';

// In a production environment, you would use actual Google Cloud clients
// const { SpeechClient } = require('@google-cloud/speech');
// const { TranslationServiceClient } = require('@google-cloud/translate');

// Mock language codes for demonstration
const supportedLanguages = [
  { code: 'af-ZA', name: 'Afrikaans' },
  { code: 'am-ET', name: 'Amharic' },
  { code: 'ar-DZ', name: 'Arabic (Algeria)' },
  { code: 'ar-BH', name: 'Arabic (Bahrain)' },
  { code: 'ar-EG', name: 'Arabic (Egypt)' },
  { code: 'ar-IQ', name: 'Arabic (Iraq)' },
  { code: 'ar-JO', name: 'Arabic (Jordan)' },
  { code: 'ar-KW', name: 'Arabic (Kuwait)' },
  { code: 'ar-LB', name: 'Arabic (Lebanon)' },
  { code: 'ar-MA', name: 'Arabic (Morocco)' },
  { code: 'ar-OM', name: 'Arabic (Oman)' },
  { code: 'ar-QA', name: 'Arabic (Qatar)' },
  { code: 'ar-SA', name: 'Arabic (Saudi Arabia)' },
  { code: 'ar-PS', name: 'Arabic (State of Palestine)' },
  { code: 'ar-TN', name: 'Arabic (Tunisia)' },
  { code: 'ar-AE', name: 'Arabic (United Arab Emirates)' },
  { code: 'ar-YE', name: 'Arabic (Yemen)' },
  { code: 'hy-AM', name: 'Armenian' },
  { code: 'az-AZ', name: 'Azerbaijani' },
  { code: 'eu-ES', name: 'Basque' },
  // This is a subset of the 189 languages supported by Google Cloud Speech-to-Text
  // In production, you would include all supported languages
  { code: 'en-US', name: 'English (United States)' },
  { code: 'en-GB', name: 'English (United Kingdom)' },
  { code: 'en-AU', name: 'English (Australia)' },
  { code: 'en-CA', name: 'English (Canada)' },
  { code: 'en-IN', name: 'English (India)' },
  { code: 'en-IE', name: 'English (Ireland)' },
  { code: 'en-NZ', name: 'English (New Zealand)' },
  { code: 'en-PH', name: 'English (Philippines)' },
  { code: 'en-SG', name: 'English (Singapore)' },
  { code: 'en-ZA', name: 'English (South Africa)' },
  { code: 'es-AR', name: 'Spanish (Argentina)' },
  { code: 'es-BO', name: 'Spanish (Bolivia)' },
  { code: 'es-CL', name: 'Spanish (Chile)' },
  { code: 'es-CO', name: 'Spanish (Colombia)' },
  { code: 'es-CR', name: 'Spanish (Costa Rica)' },
  { code: 'es-DO', name: 'Spanish (Dominican Republic)' },
  { code: 'es-EC', name: 'Spanish (Ecuador)' },
  { code: 'es-SV', name: 'Spanish (El Salvador)' },
  { code: 'es-GT', name: 'Spanish (Guatemala)' },
  { code: 'es-HN', name: 'Spanish (Honduras)' },
  { code: 'es-MX', name: 'Spanish (Mexico)' },
  { code: 'es-NI', name: 'Spanish (Nicaragua)' },
  { code: 'es-PA', name: 'Spanish (Panama)' },
  { code: 'es-PY', name: 'Spanish (Paraguay)' },
  { code: 'es-PE', name: 'Spanish (Peru)' },
  { code: 'es-PR', name: 'Spanish (Puerto Rico)' },
  { code: 'es-ES', name: 'Spanish (Spain)' },
  { code: 'es-US', name: 'Spanish (United States)' },
  { code: 'es-UY', name: 'Spanish (Uruguay)' },
  { code: 'es-VE', name: 'Spanish (Venezuela)' },
  { code: 'fr-FR', name: 'French (France)' },
  { code: 'fr-CA', name: 'French (Canada)' },
  { code: 'fr-BE', name: 'French (Belgium)' },
  { code: 'fr-CH', name: 'French (Switzerland)' },
  { code: 'de-DE', name: 'German (Germany)' },
  { code: 'de-AT', name: 'German (Austria)' },
  { code: 'de-CH', name: 'German (Switzerland)' },
  { code: 'it-IT', name: 'Italian (Italy)' },
  { code: 'it-CH', name: 'Italian (Switzerland)' },
  { code: 'ja-JP', name: 'Japanese' },
  { code: 'ko-KR', name: 'Korean' },
  { code: 'zh-CN', name: 'Chinese (Simplified, China)' },
  { code: 'zh-TW', name: 'Chinese (Traditional, Taiwan)' },
  { code: 'zh-HK', name: 'Chinese (Traditional, Hong Kong)' },
  { code: 'pt-BR', name: 'Portuguese (Brazil)' },
  { code: 'pt-PT', name: 'Portuguese (Portugal)' },
  { code: 'ru-RU', name: 'Russian' },
  { code: 'hi-IN', name: 'Hindi' },
  { code: 'ur-PK', name: 'Urdu' },
  { code: 'bn-IN', name: 'Bengali' },
  { code: 'ar-EG', name: 'Arabic (Egypt)' },
  { code: 'sw-KE', name: 'Swahili' },
  { code: 'yo-NG', name: 'Yoruba' },
  { code: 'ha-NG', name: 'Hausa' },
  { code: 'zu-ZA', name: 'Zulu' },
  { code: 'xh-ZA', name: 'Xhosa' },
  { code: 'ig-NG', name: 'Igbo' },
];

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { audioData, languageCode = 'en-US' } = data;
    
    // In production, this would use Google Cloud Speech-to-Text API
    // For demonstration, we'll simulate the API response
    
    // Validate that the language code is supported
    const isLanguageSupported = supportedLanguages.some(lang => lang.code === languageCode);
    if (!isLanguageSupported && languageCode !== 'auto') {
      return NextResponse.json({
        success: false,
        error: 'Unsupported language code'
      }, { status: 400 });
    }
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate speech recognition result
    let transcription = '';
    let detectedLanguage = languageCode;
    
    // Mock transcription based on language
    if (languageCode === 'en-US' || languageCode === 'auto') {
      transcription = 'I need to find a plumber for my kitchen renovation';
      detectedLanguage = 'en-US';
    } else if (languageCode.startsWith('es')) {
      transcription = 'Necesito encontrar un plomero para la renovación de mi cocina';
      detectedLanguage = languageCode;
    } else if (languageCode.startsWith('fr')) {
      transcription = 'J\'ai besoin de trouver un plombier pour la rénovation de ma cuisine';
      detectedLanguage = languageCode;
    } else if (languageCode.startsWith('de')) {
      transcription = 'Ich muss einen Klempner für meine Küchenrenovierung finden';
      detectedLanguage = languageCode;
    } else if (languageCode.startsWith('zh')) {
      transcription = '我需要找一个水管工来装修我的厨房';
      detectedLanguage = languageCode;
    } else if (languageCode.startsWith('ja')) {
      transcription = '私のキッチンリフォームのために配管工を見つける必要があります';
      detectedLanguage = languageCode;
    } else if (languageCode.startsWith('ru')) {
      transcription = 'Мне нужно найти сантехника для ремонта моей кухни';
      detectedLanguage = languageCode;
    } else if (languageCode.startsWith('ar')) {
      transcription = 'أحتاج إلى العثور على سباك لتجديد مطبخي';
      detectedLanguage = languageCode;
    } else if (languageCode.startsWith('hi')) {
      transcription = 'मुझे अपने रसोई के नवीनीकरण के लिए एक प्लंबर ढूंढने की जरूरत है';
      detectedLanguage = languageCode;
    } else {
      // Default to English for other languages in this demo
      transcription = 'I need to find a plumber for my kitchen renovation';
      detectedLanguage = 'en-US';
    }
    
    // Return the transcribed text and detected language
    return NextResponse.json({
      success: true,
      transcription,
      detectedLanguage,
      supportedLanguages
    });
  } catch (error) {
    console.error('Speech API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to process speech'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  // Return the list of supported languages
  return NextResponse.json({
    success: true,
    supportedLanguages
  });
}
