<template>
  <div class="app-container">
    <header>
      <h1>Language-Bridge</h1>
    </header>
    
    <main>
      <TranslationForm 
        ref="translationForm"
        @translate="handleTranslation" 
      />
      
      <TranslationResult 
        :translatedText="translatedText"
        :targetLanguage="currentTargetLang"
        :errorMessage="errorMessage"
      />
      
      <TranslationHistory 
        :history="translationHistory"
        @clear-history="clearHistory"
        @reuse="reuseTranslation"
        @delete-item="deleteHistoryItem"
      />
    </main>
  </div>
</template>

<script>
import TranslationForm from './components/TranslationForm.vue';
import TranslationResult from './components/TranslationResult.vue';
import TranslationHistory from './components/TranslationHistory.vue';
import { translateText } from './services/translationService';

export default {
  name: 'App',
  
  components: {
    TranslationForm,
    TranslationResult,
    TranslationHistory
  },
  
  data() {
    return {
      translatedText: '',
      currentTargetLang: 'hi',
      errorMessage: '',
      translationHistory: [],
      isLoading: false,
      maxHistoryItems: 10
    };
  },
  
  mounted() {
    // Try to load translation history from localStorage
    this.loadHistoryFromStorage();
  },
  
  methods: {
    async handleTranslation({ text, targetLang }) {
      this.isLoading = true;
      this.errorMessage = '';
      this.currentTargetLang = targetLang;
      
      try {
        const result = await translateText(text, targetLang);
        this.translatedText = result.translatedText;
        
        // Add to history
        this.addToHistory({
          sourceText: text,
          translatedText: result.translatedText,
          targetLang: targetLang,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        console.error('Translation error:', error);
        this.errorMessage = `Translation failed: ${error.message || 'Unknown error'}`;
      } finally {
        this.isLoading = false;
        
        // Explicitly reset the loading state in the form component
        if (this.$refs.translationForm) {
          this.$refs.translationForm.resetLoadingState();
        }
      }
    },
    
    addToHistory(translationItem) {
      // Add to the beginning of the array
      this.translationHistory.unshift(translationItem);
      
      // Keep only the most recent maxHistoryItems
      if (this.translationHistory.length > this.maxHistoryItems) {
        this.translationHistory = this.translationHistory.slice(0, this.maxHistoryItems);
      }
      
      // Save to localStorage
      this.saveHistoryToStorage();
    },
    
    clearHistory() {
      this.translationHistory = [];
      localStorage.removeItem('translationHistory');
    },
    
    deleteHistoryItem(index) {
      // Remove the item at the specified index
      this.translationHistory.splice(index, 1);
      // Save the updated history to localStorage
      this.saveHistoryToStorage();
    },
    
    reuseTranslation(item) {
      if (this.$refs.translationForm) {
        this.$refs.translationForm.sourceText = item.sourceText;
        this.$refs.translationForm.targetLanguage = item.targetLang;
      }
    },
    
    saveHistoryToStorage() {
      try {
        localStorage.setItem('translationHistory', JSON.stringify(this.translationHistory));
      } catch (error) {
        console.error('Failed to save history to localStorage:', error);
      }
    },
    
    loadHistoryFromStorage() {
      try {
        const savedHistory = localStorage.getItem('translationHistory');
        if (savedHistory) {
          this.translationHistory = JSON.parse(savedHistory);
        }
      } catch (error) {
        console.error('Failed to load history from localStorage:', error);
        // If there's an error, just start with an empty history
        this.translationHistory = [];
      }
    }
  }
};
</script>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
  color: #333;
  background-color: #f8f8f8;
}

.app-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

header {
  text-align: center;
  margin-bottom: 30px;
}

h1 {
  color: #2c3e50;
}

main {
  background-color: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

/* Add some responsive adjustments */
@media (max-width: 600px) {
  .app-container {
    padding: 10px;
  }
  
  main {
    padding: 15px;
  }
  
  h1 {
    font-size: 24px;
  }
}
</style>