export async function translateText(text, targetLang = 'hi') {
  if (!text.trim()) {
    return {
      success: true,
      data: { translatedText: '', detectedLanguage: 'en' }
    };
  }

  try {
    const endpoint = 'https://api.mymemory.translated.net/get';
    const url = new URL(endpoint);
    url.searchParams.append('q', text);
    url.searchParams.append('langpair', `en|${targetLang}`);

    const response = await fetch(url);

    if (!response.ok) {
      return {
        success: false,
        error: { type: 'http', message: `HTTP Error: ${response.status}` }
      };
    }

    const data = await response.json();

    if (data.responseStatus !== 200) {
      return {
        success: false,
        error: { type: 'api', message: data.responseDetails || 'Translation failed' }
      };
    }

    return {
      success: true,
      data: {
        translatedText: data.responseData.translatedText,
        detectedLanguage: 'en',
        confidence: data.responseData.match
      }
    };
  } catch (error) {
    return {
      success: false,
      error: { type: 'network', message: error.message || 'Network error' }
    };
  }
}

export function getLanguageOptions() {
  return [
    { code: 'hi', name: 'Hindi' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'zh-CN', name: 'Chinese (Simplified)' },
    { code: 'ar', name: 'Arabic' },
    { code: 'ru', name: 'Russian' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' }
  ];
}

export function speakText(text, lang = 'hi') {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  speechSynthesis.speak(utterance);
}