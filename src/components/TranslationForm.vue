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
          onComplete: this.resetLoadingState // Pass reset callback
        });

        // Optional fallback timeout
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
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: 600;
}

.form-control {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  font-family: inherit;
}

.form-select {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  min-width: 150px;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.language-selector {
  display: flex;
  align-items: center;
  gap: 10px;
}

.action-buttons {
  display: flex;
  gap: 10px;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s;
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
</style>
