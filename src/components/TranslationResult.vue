<template>
  <div class="translation-result" v-if="translatedText || errorMessage">
    <div class="result-header">
      <h3>
        <span class="header-icon">✨</span>
        Translation Result
      </h3>
      <div v-if="translatedText && !errorMessage" class="result-actions">
        <button 
          @click="copyToClipboard" 
          class="action-btn copy-btn"
          :class="{ 'copied': copied }"
          title="Copy translation"
        >
          <span v-if="!copied">📋</span>
          <span v-else>✅</span>
          {{ copied ? 'Copied!' : 'Copy' }}
        </button>
        <button 
          @click="speakText" 
          class="action-btn speak-btn"
          :disabled="isSpeaking"
          title="Speak translation"
        >
          <span v-if="!isSpeaking">🔊</span>
          <span v-else>🔇</span>
          {{ isSpeaking ? 'Speaking...' : 'Speak' }}
        </button>
      </div>
    </div>

    <div v-if="errorMessage" class="error-container">
      <div class="error-message">
        <span class="error-icon">❌</span>
        <div class="error-content">
          <strong>Translation Failed</strong>
          <p>{{ errorMessage }}</p>
        </div>
      </div>
      <button @click="retry" class="retry-btn">
        <span>🔄</span>
        Try Again
      </button>
    </div>

    <div v-else-if="translatedText" class="translation-content">
      <div class="translation-box">
        <div class="language-info">
          <span class="language-tag">{{ targetLanguage }}</span>
          <span class="confidence-badge" v-if="confidence">
            Confidence: {{ Math.round(confidence * 100) }}%
          </span>
        </div>
        <div class="translated-text" :lang="getLanguageCode(targetLanguage)">
          {{ translatedText }}
        </div>
        <div class="translation-meta" v-if="wordCount || translationTime">
          <span v-if="wordCount" class="meta-item">
            📊 {{ wordCount }} words
          </span>
          <span v-if="translationTime" class="meta-item">
            ⏱️ {{ translationTime }}ms
          </span>
        </div>
      </div>

      <!-- Alternative translations if available -->
      <div v-if="alternatives && alternatives.length > 0" class="alternatives-section">
        <h4>Alternative Translations:</h4>
        <div class="alternatives-list">
          <button 
            v-for="(alt, index) in alternatives" 
            :key="index"
            @click="selectAlternative(alt)"
            class="alternative-item"
          >
            {{ alt }}
          </button>
        </div>
      </div>
    </div>

    <!-- Toast notification -->
    <div v-if="showToast" class="toast-notification" :class="toastType">
      {{ toastMessage }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'TranslationResult',
  props: {
    translatedText: {
      type: String,
      default: ''
    },
    errorMessage: {
      type: String,
      default: ''
    },
    targetLanguage: {
      type: String,
      default: 'Hindi'
    },
    confidence: {
      type: Number,
      default: null
    },
    wordCount: {
      type: Number,
      default: null
    },
    translationTime: {
      type: Number,
      default: null
    },
    alternatives: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      copied: false,
      isSpeaking: false,
      showToast: false,
      toastMessage: '',
      toastType: 'success'
    }
  },
  methods: {
    async copyToClipboard() {
      try {
        await navigator.clipboard.writeText(this.translatedText)
        this.copied = true
        this.showToastNotification('Text copied to clipboard!', 'success')
        setTimeout(() => {
          this.copied = false
        }, 2000)
      } catch (err) {
        console.error('Failed to copy text: ', err)
        this.showToastNotification('Failed to copy text', 'error')
      }
    },
    
    speakText() {
      if ('speechSynthesis' in window) {
        // Stop any ongoing speech
        window.speechSynthesis.cancel()
        
        const utterance = new SpeechSynthesisUtterance(this.translatedText)
        utterance.lang = this.getLanguageCode(this.targetLanguage)
        utterance.rate = 0.8
        utterance.pitch = 1
        
        utterance.onstart = () => {
          this.isSpeaking = true
        }
        
        utterance.onend = () => {
          this.isSpeaking = false
        }
        
        utterance.onerror = () => {
          this.isSpeaking = false
          this.showToastNotification('Speech synthesis failed', 'error')
        }
        
        window.speechSynthesis.speak(utterance)
      } else {
        this.showToastNotification('Speech synthesis not supported', 'error')
      }
    },
    
    retry() {
      this.$emit('retry')
    },
    
    selectAlternative(alternative) {
      this.$emit('select-alternative', alternative)
      this.showToastNotification('Alternative selected', 'success')
    },
    
    getLanguageCode(language) {
      const languageCodes = {
        'Hindi': 'hi-IN',
        'Spanish': 'es-ES',
        'French': 'fr-FR',
        'German': 'de-DE',
        'Italian': 'it-IT',
        'Portuguese': 'pt-PT',
        'Russian': 'ru-RU',
        'Japanese': 'ja-JP',
        'Korean': 'ko-KR',
        'Chinese': 'zh-CN',
        'Arabic': 'ar-SA'
      }
      return languageCodes[language] || 'en-US'
    },
    
    showToastNotification(message, type = 'success') {
      this.toastMessage = message
      this.toastType = type
      this.showToast = true
      
      setTimeout(() => {
        this.showToast = false
      }, 3000)
    }
  }
}
</script>

<style scoped>
.translation-result {
  margin-top: 2rem;
  animation: slideInUp 0.4s ease-out;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e2e8f0;
}

.result-header h3 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #2d3748;
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.header-icon {
  font-size: 1.5rem;
}

.result-actions {
  display: flex;
  gap: 0.75rem;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: 2px solid transparent;
  border-radius: 0.75rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  transform: translateY(0);
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.action-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.copy-btn.copied {
  background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
}

.error-container {
  background: linear-gradient(135deg, #fed7d7 0%, #feb2b2 100%);
  border: 2px solid #fc8181;
  border-radius: 1rem;
  padding: 1.5rem;
  text-align: center;
}

.error-message {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1rem;
  text-align: left;
}

.error-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.error-content strong {
  color: #c53030;
  display: block;
  margin-bottom: 0.5rem;
}

.error-content p {
  color: #742a2a;
  margin: 0;
}

.retry-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #e53e3e 0%, #c53030 100%);
  color: white;
  border: none;
  border-radius: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  margin: 0 auto;
}

.retry-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(229, 62, 62, 0.3);
}

.translation-content {
  space-y: 1.5rem;
}

.translation-box {
  background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
  border: 2px solid #e2e8f0;
  border-radius: 1.25rem;
  padding: 2rem;
  position: relative;
  overflow: hidden;
}

.translation-box::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
}

.language-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.language-tag {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.confidence-badge {
  background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 500;
}

.translated-text {
  font-size: 1.25rem;
  line-height: 1.6;
  color: #2d3748;
  background: white;
  padding: 1.5rem;
  border-radius: 0.75rem;
  border: 1px solid #e2e8f0;
  min-height: 4rem;
  word-wrap: break-word;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
}

.translation-meta {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: #718096;
  font-size: 0.875rem;
}

.alternatives-section {
  margin-top: 2rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, #ebf8ff 0%, #bee3f8 100%);
  border-radius: 1rem;
  border: 2px solid #90cdf4;
}

.alternatives-section h4 {
  color: #2c5282;
  margin: 0 0 1rem 0;
  font-size: 1.125rem;
  font-weight: 600;
}

.alternatives-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.alternative-item {
  padding: 0.5rem 1rem;
  background: white;
  border: 2px solid #90cdf4;
  border-radius: 0.75rem;
  color: #2c5282;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.alternative-item:hover {
  background: linear-gradient(135deg, #3182ce 0%, #2c5282 100%);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(49, 130, 206, 0.3);
}

.toast-notification {
  position: fixed;
  top: 2rem;
  right: 2rem;
  padding: 1rem 1.5rem;
  border-radius: 0.75rem;
  color: white;
  font-weight: 500;
  z-index: 1000;
  animation: slideInRight 0.3s ease-out;
}

.toast-notification.success {
  background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
}

.toast-notification.error {
  background: linear-gradient(135deg, #e53e3e 0%, #c53030 100%);
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(100px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@media (max-width: 768px) {
  .result-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .result-actions {
    width: 100%;
    justify-content: center;
  }
  
  .language-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .translation-meta {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .alternatives-list {
    justify-content: center;
  }
  
  .toast-notification {
    top: 1rem;
    right: 1rem;
    left: 1rem;
    right: 1rem;
  }
}
</style>