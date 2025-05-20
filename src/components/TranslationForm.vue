<template>
  <div class="translation-form">
    <div class="form-group">
      <label for="sourceText">Enter English text:</label>
      <textarea 
        id="sourceText" 
        v-model="sourceText" 
        @keyup.enter="onTranslate"
        placeholder="Type English text here..."
        :disabled="isLoading"
        rows="3"
        class="form-control"
      ></textarea>
    </div>
    
    <div class="form-actions">
      <div class="language-selector">
        <label for="targetLanguage">Translate to:</label>
        <select id="targetLanguage" v-model="targetLanguage" class="form-select" :disabled="isLoading">
          <option v-for="lang in languageOptions" :key="lang.code" :value="lang.code">
            {{ lang.name }}
          </option>
        </select>
      </div>
      
      <div class="action-buttons">
        <button 
          @click="onTranslate" 
          :disabled="!canTranslate || isLoading" 
          class="btn btn-translate"
        >
          {{ isLoading ? 'Translating...' : 'Translate' }}
        </button>
        <button 
          @click="clearText" 
          :disabled="!sourceText.trim() || isLoading" 
          class="btn btn-clear"
        >
          Clear
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TranslationForm',

  data() {
    return {
      sourceText: '',
      targetLanguage: 'hi',
      isLoading: false,
      languageOptions: [
        { code: 'hi', name: 'Hindi' },
        { code: 'es', name: 'Spanish' },
        { code: 'fr', name: 'French' },
        { code: 'de', name: 'German' },
        { code: 'zh-CN', name: 'Chinese (Simplified)' },
        { code: 'ar', name: 'Arabic' },
        { code: 'ru', name: 'Russian' },
        { code: 'ja', name: 'Japanese' },
        { code: 'ko', name: 'Korean' }
      ]
    };
  },

  computed: {
    canTranslate() {
      return this.sourceText.trim().length > 0;
    }
  },

  methods: {
    onTranslate() {
      if (this.canTranslate && !this.isLoading) {
        this.isLoading = true;
        this.$emit('translate', {
          text: this.sourceText.trim(),
          targetLang: this.targetLanguage,
          onComplete: this.resetLoadingState
        });

        setTimeout(() => {
          this.resetLoadingState();
        }, 8000);
      }
    },

    clearText() {
      this.sourceText = '';
      this.$emit('clear');
    },

    resetLoadingState() {
      this.isLoading = false;
    }
  }
};
</script>

<style scoped>
.translation-form {
  margin-bottom: 20px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  padding: 0 15px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: 600;
  font-size: 1rem;
}

.form-control {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  min-height: 80px;
  box-sizing: border-box;
}

.form-select {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  min-width: 150px;
  box-sizing: border-box;
}

.form-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.language-selector {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1 1 auto;
  min-width: 150px;
}

.action-buttons {
  display: flex;
  gap: 10px;
  flex: 1 1 auto;
  justify-content: flex-end;
  min-width: 150px;
}

.btn {
  padding: 10px 18px;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
  flex-grow: 1;
  min-width: 100px;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-translate {
  background-color: #4caf50;
  color: white;
}

.btn-translate:not(:disabled):hover {
  background-color: #45a049;
}

.btn-clear {
  background-color: #f1f1f1;
  color: #333;
}

.btn-clear:not(:disabled):hover {
  background-color: #e1e1e1;
}

@media (max-width: 480px) {
  .form-actions {
    flex-direction: column;
    align-items: stretch;
  }
  .language-selector,
  .action-buttons {
    justify-content: stretch;
    min-width: 100%;
  }
  .btn {
    min-width: 100%;
  }
}
</style>
