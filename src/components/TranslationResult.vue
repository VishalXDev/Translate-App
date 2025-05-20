<template>
  <div class="translation-result" v-if="translatedText || errorMessage">
    <h3>Translation:</h3>

    <div v-if="errorMessage" class="error-message">
      <p>{{ errorMessage }}</p>
    </div>

    <div v-else class="result-container">
      <p class="result-text">{{ translatedText }}</p>

      <div class="result-actions">
        <button 
          @click="speakTranslation" 
          class="action-btn speak-btn" 
          title="Listen to translation"
          :disabled="!canSpeak"
        >
          🔊
        </button>
        <button 
          @click="copyTranslation" 
          class="action-btn copy-btn" 
          title="Copy to clipboard"
        >
          📋
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { speakText } from '@/services/translationService';

export default {
  name: 'TranslationResult',

  props: {
    translatedText: {
      type: String,
      default: ''
    },
    targetLanguage: {
      type: String,
      default: 'hi'
    },
    errorMessage: {
      type: String,
      default: ''
    }
  },

  computed: {
    canSpeak() {
      return 'speechSynthesis' in window;
    }
  },

  methods: {
    speakTranslation() {
      if (this.translatedText && this.canSpeak) {
        speakText(this.translatedText, this.targetLanguage);
      }
    },

    copyTranslation() {
      if (this.translatedText) {
        navigator.clipboard.writeText(this.translatedText)
          .then(() => {
            console.log('Text copied to clipboard');
          })
          .catch(err => {
            console.error('Failed to copy text: ', err);
          });
      }
    }
  }
};
</script>

<style scoped>
.translation-result {
  margin: 20px auto;
  padding: 15px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  background-color: #f9f9f9;
  max-width: 600px;
  padding-left: 15px;
  padding-right: 15px;
  box-sizing: border-box;
}

h3 {
  margin-top: 0;
  margin-bottom: 10px;
  color: #333;
  font-size: 1.25rem;
}

.error-message {
  color: #d32f2f;
  font-weight: 500;
  font-size: 1rem;
}

.result-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
}

.result-text {
  margin: 0;
  font-size: 1.125rem;
  line-height: 1.5;
  flex-grow: 1;
  min-width: 200px;
  word-break: break-word;
}

.result-actions {
  display: flex;
  gap: 10px;
  margin-left: 15px;
  flex-shrink: 0;
}

.action-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: background-color 0.2s;
  user-select: none;
}

.action-btn:hover {
  background-color: #e0e0e0;
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 480px) {
  .result-container {
    flex-direction: column;
    align-items: stretch;
  }
  .result-actions {
    justify-content: flex-start;
    margin-left: 0;
  }
  .action-btn {
    font-size: 20px;
  }
}
</style>
