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
          @focus="onTextareaFocus"
          @blur="onTextareaBlur"
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
        v-for="(lang, index) in popularLanguages" 
        :key="lang.code"
        @click="targetLanguage = lang.code"
        :class="['quick-lang-btn', { active: targetLanguage === lang.code }]"
        :disabled="isLoading"
        :style="{ 'animation-delay': `${index * 0.1}s` }"
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
      isTextareaFocused: false,
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
    
    // Add staggered animation to form elements
    this.$nextTick(() => {
      const elements = this.$el.querySelectorAll('.form-group, .form-actions, .quick-languages');
      elements.forEach((el, index) => {
        el.style.animationDelay = `${index * 0.15}s`;
        el.classList.add('fade-in-up');
      });
    });
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
      this.$emit('input-change', this.sourceText);
    },

    onTextareaFocus() {
      this.isTextareaFocused = true;
    },

    onTextareaBlur() {
      this.isTextareaFocused = false;
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
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

@keyframes glow {
  0%, 100% {
    box-shadow: 0 0 20px rgba(102, 126, 234, 0.3);
  }
  50% {
    box-shadow: 0 0 30px rgba(102, 126, 234, 0.6);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-3px);
  }
}

.translation-form {
  margin-bottom: 30px;
  max-width: 100%;
}

.fade-in-up {
  animation: fadeInUp 0.6s ease-out forwards;
  opacity: 0;
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
  transition: color 0.3s ease;
}

.label-icon {
  font-size: 1.2rem;
  transition: transform 0.3s ease;
}

label:hover .label-icon {
  transform: scale(1.1);
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
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  background: #fafbfc;
  line-height: 1.5;
  position: relative;
  overflow: hidden;
}

.form-control::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.1), transparent);
  transition: left 0.6s;
}

.form-control:focus {
  outline: none;
  border-color: #667eea;
  background: white;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1), 0 8px 25px rgba(102, 126, 234, 0.15);
  transform: translateY(-2px);
}

.form-control:focus::before {
  left: 100%;
}

.form-control:disabled {
  background: #f5f5f5;
  cursor: not-allowed;
}

.textarea-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
  font-size: 0.85rem;
  color: #6c757d;
  animation: slideInLeft 0.5s ease-out 0.3s both;
}

.char-count {
  font-weight: 500;
  transition: all 0.3s ease;
}

.char-count.limit-warning {
  color: #e74c3c;
  animation: pulse 1s infinite;
}

.keyboard-hint {
  opacity: 0.7;
  transition: opacity 0.3s ease;
}

.keyboard-hint:hover {
  opacity: 1;
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
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
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
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1), 0 5px 15px rgba(102, 126, 234, 0.1);
  transform: translateY(-1px);
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
  gap: 8px;
  flex-wrap: wrap;
}

.btn {
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-weight: 600;
  flex: 1;
  min-width: 85px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);
}

.btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: left 0.5s;
}

.btn:hover::before {
  left: 100%;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

.btn:not(:disabled):hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

.btn:not(:disabled):active {
  transform: translateY(0) scale(0.98);
}

.btn-content {
  display: flex;
  align-items: center;
  gap: 6px;
  z-index: 1;
}

.btn-icon {
  font-size: 1rem;
  transition: transform 0.3s ease;
}

.btn:hover .btn-icon {
  transform: rotate(15deg);
}

.btn-spinner {
  width: 14px;
  height: 14px;
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
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.btn-translate:not(:disabled):hover {
  animation: glow 2s infinite;
}

.btn-clear {
  background: linear-gradient(135deg, #ff7675, #fd79a8);
  color: white;
  box-shadow: 0 4px 15px rgba(255, 118, 117, 0.3);
}

.btn-paste {
  background: linear-gradient(135deg, #00b894, #00cec9);
  color: white;
  box-shadow: 0 4px 15px rgba(0, 184, 148, 0.3);
}

.quick-languages {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 20px;
  padding: 15px;
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  border-radius: 12px;
  flex-wrap: wrap;
  border: 1px solid rgba(102, 126, 234, 0.1);
}

.quick-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #6c757d;
  margin-right: 5px;
  animation: float 3s ease-in-out infinite;
}

.quick-lang-btn {
  padding: 6px 12px;
  border: 2px solid transparent;
  border-radius: 16px;
  background: white;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-weight: 500;
  white-space: nowrap;
  position: relative;
  overflow: hidden;
  animation: slideInLeft 0.5s ease-out both;
}

.quick-lang-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.1), transparent);
  transition: left 0.4s;
}

.quick-lang-btn:hover:not(:disabled) {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.quick-lang-btn:hover::before {
  left: 100%;
}

.quick-lang-btn.active {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.quick-lang-btn.active::before {
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
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