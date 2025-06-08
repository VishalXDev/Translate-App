<template>
  <div class="translation-form">
    <div class="form-group">
      <label for="sourceText">
        <span class="label-icon">📝</span>
        Enter English text to translate:
      </label>
      <div class="textarea-container">
        <textarea 
          id="sourceText" 
          v-model="sourceText" 
          @keydown.ctrl.enter="onTranslate"
          @keydown.meta.enter="onTranslate"
          @input="onInputChange"
          placeholder="Type or paste your English text here..."
          :disabled="isLoading"
          rows="4"
          class="form-control"
          maxlength="5000"
        ></textarea>
        <div class="textarea-footer">
          <span class="char-count" :class="{ 'limit-warning': sourceText.length > 4500 }">
            {{ sourceText.length }}/5000
          </span>
          <span class="keyboard-hint">Ctrl+Enter to translate</span>
        </div>
      </div>
    </div>
    
    <div class="form-actions">
      <div class="language-selector">
        <label for="targetLanguage">
          <span class="label-icon">🌍</span>
          Translate to:
        </label>
        <div class="select-wrapper">
          <select id="targetLanguage" v-model="targetLanguage" class="form-select" :disabled="isLoading">
            <option v-for="lang in languageOptions" :key="lang.code" :value="lang.code">
              {{ lang.flag }} {{ lang.name }}
            </option>
          </select>
        </div>
      </div>
      
      <div class="action-buttons">
        <button 
          @click="onTranslate" 
          :disabled="!canTranslate || isLoading" 
          class="btn btn-translate"
        >
          <span v-if="!isLoading" class="btn-content">
            <span class="btn-icon">🔄</span>
            Translate
          </span>
          <span v-else class="btn-content">
            <span class="btn-spinner"></span>
            Translating...
          </span>
        </button>
        
        <button 
          @click="clearText" 
          :disabled="!sourceText.trim() || isLoading" 
          class="btn btn-clear"
          title="Clear text (Esc)"
        >
          <span class="btn-icon">🗑️</span>
          Clear
        </button>
        
        <button 
          @click="pasteFromClipboard" 
          :disabled="isLoading" 
          class="btn btn-paste"
          title="Paste from clipboard"
        >
          <span class="btn-icon">📋</span>
          Paste
        </button>
      </div>
    </div>

    <!-- Quick language switcher -->
    <div class="quick-languages">
      <span class="quick-label">Quick select:</span>
      <button 
        v-for="lang in popularLanguages" 
        :key="lang.code"
        @click="targetLanguage = lang.code"
        :class="['quick-lang-btn', { active: targetLanguage === lang.code }]"
        :disabled="isLoading"
      >
        {{ lang.flag }} {{ lang.name }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TranslationForm',

  props: {
    isLoading: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      sourceText: '',
      targetLanguage: 'hi',
      languageOptions: [
        { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
        { code: 'es', name: 'Spanish', flag: '🇪🇸' },
        { code: 'fr', name: 'French', flag: '🇫🇷' },
        { code: 'de', name: 'German', flag: '🇩🇪' },
        { code: 'zh-CN', name: 'Chinese', flag: '🇨🇳' },
        { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
        { code: 'ru', name: 'Russian', flag: '🇷🇺' },
        { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
        { code: 'ko', name: 'Korean', flag: '🇰🇷' }
      ]
    };
  },

  computed: {
    canTranslate() {
      return this.sourceText.trim().length > 0 && this.sourceText.trim().length <= 5000;
    },
    
    popularLanguages() {
      return this.languageOptions.slice(0, 5);
    }
  },

  mounted() {
    // Add keyboard shortcuts
    document.addEventListener('keydown', this.handleKeydown);
  },

  beforeUnmount() {
    document.removeEventListener('keydown', this.handleKeydown);
  },

  methods: {
    onTranslate() {
      if (this.canTranslate && !this.isLoading) {
        this.$emit('translate', {
          text: this.sourceText.trim(),
          targetLang: this.targetLanguage
        });
      }
    },

    clearText() {
      this.sourceText = '';
      this.$nextTick(() => {
        this.$el.querySelector('#sourceText').focus();
      });
    },

    async pasteFromClipboard() {
      try {
        const text = await navigator.clipboard.readText();
        if (text) {
          this.sourceText = text.slice(0, 5000); // Respect character limit
          this.$nextTick(() => {
            this.$el.querySelector('#sourceText').focus();
          });
        }
      } catch (err) {
        console.error('Failed to read clipboard contents: ', err);
      }
    },

    onInputChange() {
      // Auto-resize textarea would be nice, but keeping it simple for now
      this.$emit('input-change', this.sourceText);
    },

    handleKeydown(event) {
      // ESC to clear
      if (event.key === 'Escape' && this.sourceText.trim()) {
        this.clearText();
      }
    }
  }
};
</script>

<style scoped>
.translation-form {
  margin-bottom: 30px;
  max-width: 100%;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-weight: 600;
  font-size: 1rem;
  color: #2c3e50;
}

.label-icon {
  font-size: 1.2rem;
}

.textarea-container {
  position: relative;
}

.form-control {
  width: 100%;
  padding: 15px;
  border: 2px solid #e1e8ed;
  border-radius: 12px;
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  min-height: 120px;
  transition: all 0.3s ease;
  background: #fafbfc;
  line-height: 1.5;
}

.form-control:focus {
  outline: none;
  border-color: #667eea;
  background: white;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-control:disabled {
  background: #f5f5f5;
  cursor: not-allowed;
}

.textarea-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 5px;
  font-size: 0.85rem;
  color: #6c757d;
}

.char-count {
  font-weight: 500;
}

.char-count.limit-warning {
  color: #e74c3c;
}

.keyboard-hint {
  opacity: 0.7;
}

.select-wrapper {
  position: relative;
}

.form-select {
  width: 100%;
  padding: 12px 15px;
  border: 2px solid #e1e8ed;
  border-radius: 10px;
  font-size: 1rem;
  background: #fafbfc;
  cursor: pointer;
  transition: all 0.3s ease;
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 12px center;
  background-repeat: no-repeat;
  background-size: 16px;
  padding-right: 45px;
}

.form-select:focus {
  outline: none;
  border-color: #667eea;
  background-color: white;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-actions {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 20px;
  align-items: end;
}

.language-selector {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.action-buttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.btn {
  padding: 12px 20px;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  flex-grow: 1;
  min-width: 110px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

.btn:not(:disabled):hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.2);
}

.btn-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-icon {
  font-size: 1.1rem;
}

.btn-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.btn-translate {
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.btn-clear {
  background: linear-gradient(45deg, #ff7675, #fd79a8);
  color: white;
  box-shadow: 0 4px 15px rgba(255, 118, 117, 0.3);
}

.btn-paste {
  background: linear-gradient(45deg, #00b894, #00cec9);
  color: white;
  box-shadow: 0 4px 15px rgba(0, 184, 148, 0.3);
}

.quick-languages {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
  padding: 15px;
  background: linear-gradient(45deg, #f8f9fa, #e9ecef);
  border-radius: 12px;
  flex-wrap: wrap;
}

.quick-label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #6c757d;
  margin-right: 5px;
}

.quick-lang-btn {
  padding: 8px 12px;
  border: 2px solid transparent;
  border-radius: 20px;
  background: white;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  white-space: nowrap;
}

.quick-lang-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 3px 10px rgba(0,0,0,0.15);
}

.quick-lang-btn.active {
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  border-color: #667eea;
}

/* Mobile Responsiveness */
@media (max-width: 768px) {
  .form-actions {
    grid-template-columns: 1fr;
    gap: 15px;
  }
  
  .action-buttons {
    justify-content: stretch;
  }
  
  .btn {
    min-width: 100%;
  }
  
  .quick-languages {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .form-control {
    padding: 12px;
    min-height: 100px;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .quick-languages {
    flex-direction: column;
    align-items: stretch;
    text-align: center;
  }
  
  .quick-lang-btn {
    justify-content: center;
  }
}
</style>