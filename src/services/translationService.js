// translationService.js
// This service handles translation requests using the MyMemory Translation API
// Documentation: https://mymemory.translated.net/doc/spec.php

/**
 * Translates text from English to the target language using the MyMemory Translation API
 * @param {string} text - The text to translate
 * @param {string} targetLang - The target language code (e.g., 'hi' for Hindi)
 * @returns {Promise<Object>} - Promise resolving to the translation response
 */
export async function translateText(text, targetLang = 'hi') {
  // Don't attempt to translate empty text
  if (!text.trim()) {
    return { translatedText: '', detectedLanguage: 'en' };
  }
  
  try {
    // MyMemory API endpoint
    const endpoint = 'https://api.mymemory.translated.net/get';
    
    // Build the URL with query parameters
    const url = new URL(endpoint);
    url.searchParams.append('q', text);
    url.searchParams.append('langpair', `en|${targetLang}`);
    
    // Make the API request
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Translation API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Check for API errors
    if (data.responseStatus !== 200) {
      throw new Error(data.responseDetails || 'Translation failed');
    }
    
    return {
      translatedText: data.responseData.translatedText,
      detectedLanguage: 'en', // Source language is English in our case
      confidence: data.responseData.match
    };
  } catch (error) {
    console.error('Translation error:', error);
    throw error;
  }
}

/**
 * Gets available language options for translation
 * @returns {Array} - Array of language objects with code and name
 */
export function getLanguageOptions() {
  return [
    { code: 'hi', name: 'Hindi' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'ru', name: 'Russian' },
    { code: 'zh', name: 'Chinese' },
    { code: 'ja', name: 'Japanese' },
    { code: 'it', name: 'Italian' },
    { code: 'ar', name: 'Arabic' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'ko', name: 'Korean' },
    { code: 'tr', name: 'Turkish' }
  ];
}

/**
 * Use browser's text-to-speech API to speak the translated text
 * @param {string} text - Text to be spoken
 * @param {string} lang - Language code
 */
export function speakText(text, lang) {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    speechSynthesis.speak(utterance);
  } else {
    console.warn('Text-to-speech not supported in this browser');
  }
}