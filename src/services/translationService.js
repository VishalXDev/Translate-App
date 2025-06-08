// Translation service using MyMemory API
const API_BASE_URL = 'https://api.mymemory.translated.net/get'
const RATE_LIMIT_DELAY = 100 // ms between requests
let lastRequestTime = 0

// Rate limiting helper
function rateLimit() {
  const now = Date.now()
  const timeSinceLastRequest = now - lastRequestTime
  
  if (timeSinceLastRequest < RATE_LIMIT_DELAY) {
    return new Promise(resolve => {
      setTimeout(resolve, RATE_LIMIT_DELAY - timeSinceLastRequest)
    })
  }
  
  lastRequestTime = now
  return Promise.resolve()
}

export async function translateText(text, targetLang = 'hi', sourceLang = 'en') {
  // Handle empty text
  if (!text || !text.trim()) {
    return {
      success: true,
      data: { 
        translatedText: '', 
        detectedLanguage: sourceLang,
        confidence: 1
      }
    }
  }

  // Apply rate limiting
  await rateLimit()

  try {
    const url = new URL(API_BASE_URL)
    url.searchParams.set('q', text.trim())
    url.searchParams.set('langpair', `${sourceLang}|${targetLang}`)
    
    // Add email for higher usage limits (optional)
    // url.searchParams.set('de', 'your-email@example.com')

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Language Translator App'
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()

    // Check API response status
    if (data.responseStatus !== 200) {
      return {
        success: false,
        error: { 
          type: 'api', 
          message: data.responseDetails || 'Translation API error',
          code: data.responseStatus
        }
      }
    }

    // Validate response data
    if (!data.responseData || !data.responseData.translatedText) {
      return {
        success: false,
        error: { 
          type: 'data', 
          message: 'Invalid response format from translation API'
        }
      }
    }

    return {
      success: true,
      data: {
        translatedText: data.responseData.translatedText,
        detectedLanguage: sourceLang,
        confidence: data.responseData.match || 0,
        quotaUsed: data.quotaUsed || null,
        mtLangSupported: data.mtLangSupported || null
      }
    }

  } catch (error) {
    console.error('Translation error:', error)
    
    return {
      success: false,
      error: { 
        type: error.name === 'TypeError' ? 'network' : 'unknown',
        message: error.message || 'An unexpected error occurred',
        details: error.stack
      }
    }
  }
}

// Batch translation for multiple texts
export async function translateBatch(texts, targetLang = 'hi', sourceLang = 'en') {
  const results = []
  
  for (const text of texts) {
    try {
      const result = await translateText(text, targetLang, sourceLang)
      results.push({ text, result })
    } catch (error) {
      results.push({ 
        text, 
        result: { 
          success: false, 
          error: { type: 'batch', message: error.message }
        }
      })
    }
  }
  
  return results
}

// Get supported language options
export function getLanguageOptions() {
  return [
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
    { code: 'es', name: 'Spanish', nativeName: 'Español' },
    { code: 'fr', name: 'French', nativeName: 'Français' },
    { code: 'de', name: 'German', nativeName: 'Deutsch' },
    { code: 'zh-CN', name: 'Chinese (Simplified)', nativeName: '简体中文' },
    { code: 'zh-TW', name: 'Chinese (Traditional)', nativeName: '繁體中文' },
    { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
    { code: 'ru', name: 'Russian', nativeName: 'Русский' },
    { code: 'ja', name: 'Japanese', nativeName: '日本語' },
    { code: 'ko', name: 'Korean', nativeName: '한국어' },
    { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
    { code: 'it', name: 'Italian', nativeName: 'Italiano' },
    { code: 'nl', name: 'Dutch', nativeName: 'Nederlands' },
    { code: 'pl', name: 'Polish', nativeName: 'Polski' },
    { code: 'tr', name: 'Turkish', nativeName: 'Türkçe' },
    { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt' },
    { code: 'th', name: 'Thai', nativeName: 'ไทย' },
    { code: 'sv', name: 'Swedish', nativeName: 'Svenska' },
    { code: 'da', name: 'Danish', nativeName: 'Dansk' },
    { code: 'no', name: 'Norwegian', nativeName: 'Norsk' }
  ]
}

// Get source language options
export function getSourceLanguageOptions() {
  return [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'auto', name: 'Auto Detect', nativeName: 'Auto' },
    ...getLanguageOptions()
  ]
}

// Text-to-speech functionality
export function speakText(text, lang = 'hi', options = {}) {
  if (!text || !text.trim()) return Promise.resolve()

  return new Promise((resolve, reject) => {
    // Check if speech synthesis is supported
    if (!('speechSynthesis' in window)) {
      reject(new Error('Speech synthesis not supported in this browser'))
      return
    }

    // Cancel any ongoing speech
    speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text.trim())
    
    // Configure utterance
    utterance.lang = lang === 'zh-CN' ? 'zh-CN' : lang
    utterance.rate = options.rate || 0.9
    utterance.pitch = options.pitch || 1
    utterance.volume = options.volume || 1

    // Event handlers
    utterance.onend = () => resolve()
    utterance.onerror = (event) => reject(new Error(`Speech synthesis error: ${event.error}`))
    utterance.onstart = () => console.log('Speech started')

    // Find appropriate voice
    const voices = speechSynthesis.getVoices()
    const preferredVoice = voices.find(voice => 
      voice.lang.startsWith(lang) || voice.lang.startsWith(lang.split('-')[0])
    )
    
    if (preferredVoice) {
      utterance.voice = preferredVoice
    }

    try {
      speechSynthesis.speak(utterance)
    } catch (error) {
      reject(error)
    }
  })
}

// Stop any ongoing speech
export function stopSpeech() {
  if ('speechSynthesis' in window) {
    speechSynthesis.cancel()
  }
}

// Get available voices for a language
export function getVoicesForLanguage(lang) {
  if (!('speechSynthesis' in window)) return []
  
  const voices = speechSynthesis.getVoices()
  return voices.filter(voice => 
    voice.lang.startsWith(lang) || voice.lang.startsWith(lang.split('-')[0])
  )
}

// Utility function to detect language (basic heuristics)
export function detectLanguage(text) {
  if (!text || !text.trim()) return 'en'
  
  // Simple heuristics for common languages
  const patterns = {
    'hi': /[\u0900-\u097F]/, // Devanagari script
    'ar': /[\u0600-\u06FF]/, // Arabic script
    'zh': /[\u4e00-\u9fff]/, // Chinese characters
    'ja': /[\u3040-\u309f\u30a0-\u30ff]/, // Hiragana/Katakana
    'ko': /[\uac00-\ud7af]/, // Hangul
    'ru': /[\u0400-\u04FF]/, // Cyrillic
    'th': /[\u0e00-\u0e7f]/, // Thai
  }
  
  for (const [lang, pattern] of Object.entries(patterns)) {
    if (pattern.test(text)) return lang
  }
  
  return 'en' // Default to English
}

// Translation history management
export class TranslationHistory {
  constructor(maxItems = 50) {
    this.maxItems = maxItems
    this.storageKey = 'translation-history'
  }

  getHistory() {
    try {
      const history = localStorage.getItem(this.storageKey)
      return history ? JSON.parse(history) : []
    } catch (error) {
      console.error('Error loading translation history:', error)
      return []
    }
  }

  addTranslation(originalText, translatedText, sourceLang, targetLang) {
    try {
      const history = this.getHistory()
      const newItem = {
        id: Date.now(),
        originalText,
        translatedText,
        sourceLang,
        targetLang,
        timestamp: new Date().toISOString()
      }

      // Remove duplicate if exists
      const filtered = history.filter(item => 
        !(item.originalText === originalText && 
          item.sourceLang === sourceLang && 
          item.targetLang === targetLang)
      )

      // Add new item to beginning
      filtered.unshift(newItem)

      // Keep only maxItems
      const trimmed = filtered.slice(0, this.maxItems)

      localStorage.setItem(this.storageKey, JSON.stringify(trimmed))
      return newItem
    } catch (error) {
      console.error('Error saving translation history:', error)
      return null
    }
  }

  clearHistory() {
    try {
      localStorage.removeItem(this.storageKey)
      return true
    } catch (error) {
      console.error('Error clearing translation history:', error)
      return false
    }
  }

  removeItem(id) {
    try {
      const history = this.getHistory()
      const filtered = history.filter(item => item.id !== id)
      localStorage.setItem(this.storageKey, JSON.stringify(filtered))
      return true
    } catch (error) {
      console.error('Error removing translation item:', error)
      return false
    }
  }
}