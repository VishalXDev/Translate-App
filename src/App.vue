<template>
  <div class="app-container">
    <header>
      <div class="header-content">
        <div class="logo-section">
          <div class="logo-icon">🌐</div>
          <div class="title-section">
            <h1>Language Translator</h1>
            <p class="subtitle">Translate English to 9 different languages instantly</p>
          </div>
        </div>
        <div class="stats-section">
          <div class="stat-item">
            <span class="stat-number">{{ translationHistory.length }}</span>
            <span class="stat-label">Translations</span>
          </div>
        </div>
      </div>
    </header>

    <main>
      <!-- Loading overlay -->
      <div v-if="isLoading" class="loading-overlay">
        <div class="loading-spinner"></div>
        <p>Translating...</p>
      </div>

      <TranslationForm 
        ref="translationForm" 
        @translate="handleTranslation"
        :isLoading="isLoading"
      />

      <TranslationResult
        :translatedText="translatedText"
        :targetLanguage="currentTargetLang"
        :errorMessage="errorMessage"
        :isLoading="isLoading"
      />

      <TranslationHistory
        :history="translationHistory"
        @clear-history="clearHistory"
        @reuse="reuseTranslation"
        @delete-item="deleteHistoryItem"
      />
    </main>

    <!-- Toast notification -->
    <div v-if="toast.show" :class="['toast', toast.type]">
      {{ toast.message }}
    </div>
  </div>
</template>

<script>
import TranslationForm from "./components/TranslationForm.vue";
import TranslationResult from "./components/TranslationResult.vue";
import TranslationHistory from "./components/TranslationHistory.vue";
import { translateText } from "./services/translationService";

export default {
  name: "App",

  components: {
    TranslationForm,
    TranslationResult,
    TranslationHistory,
  },

  data() {
    return {
      translatedText: "",
      currentTargetLang: "hi",
      errorMessage: "",
      translationHistory: [],
      isLoading: false,
      maxHistoryItems: 15,
      toast: {
        show: false,
        message: "",
        type: "success"
      }
    };
  },

  mounted() {
    this.loadHistoryFromStorage();
  },

  methods: {
    async handleTranslation({ text, targetLang }) {
      this.isLoading = true;
      this.errorMessage = "";
      this.translatedText = "";
      this.currentTargetLang = targetLang;

      try {
        const result = await translateText(text, targetLang);
        if (result.success) {
          const { translatedText } = result.data;
          this.translatedText = translatedText;

          this.addToHistory({
            sourceText: text,
            translatedText,
            targetLang,
            timestamp: new Date().toISOString(),
          });

          this.showToast("Translation completed successfully!", "success");
        } else {
          this.errorMessage = `Translation failed: ${result.error.message}`;
          this.showToast("Translation failed. Please try again.", "error");
        }
      } catch (unexpectedError) {
        this.errorMessage = `Unexpected error: ${unexpectedError.message}`;
        this.showToast("Something went wrong. Please try again.", "error");
      } finally {
        this.isLoading = false;
      }
    },

    addToHistory(translationItem) {
      // Check if similar translation already exists
      const existingIndex = this.translationHistory.findIndex(
        item => item.sourceText.toLowerCase() === translationItem.sourceText.toLowerCase() 
        && item.targetLang === translationItem.targetLang
      );

      if (existingIndex !== -1) {
        // Remove existing and add updated one to top
        this.translationHistory.splice(existingIndex, 1);
      }

      this.translationHistory.unshift(translationItem);
      
      if (this.translationHistory.length > this.maxHistoryItems) {
        this.translationHistory = this.translationHistory.slice(0, this.maxHistoryItems);
      }
      
      this.saveHistoryToStorage();
    },

    clearHistory() {
      this.translationHistory = [];
      localStorage.removeItem("translationHistory");
      this.showToast("History cleared successfully!", "success");
    },

    deleteHistoryItem(index) {
      this.translationHistory.splice(index, 1);
      this.saveHistoryToStorage();
      this.showToast("Translation removed from history", "success");
    },

    reuseTranslation(item) {
      if (this.$refs.translationForm) {
        this.$refs.translationForm.sourceText = item.sourceText;
        this.$refs.translationForm.targetLanguage = item.targetLang;
        this.showToast("Translation loaded for editing", "info");
      }
    },

    showToast(message, type = "success") {
      this.toast = { show: true, message, type };
      setTimeout(() => {
        this.toast.show = false;
      }, 3000);
    },

    saveHistoryToStorage() {
      try {
        localStorage.setItem("translationHistory", JSON.stringify(this.translationHistory));
      } catch (error) {
        console.error("Failed to save history:", error);
      }
    },

    loadHistoryFromStorage() {
      try {
        const savedHistory = localStorage.getItem("translationHistory");
        if (savedHistory) {
          this.translationHistory = JSON.parse(savedHistory);
        }
      } catch (error) {
        console.error("Failed to load history:", error);
        this.translationHistory = [];
      }
    },
  },
};
</script>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  line-height: 1.6;
  color: #2c3e50;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

.app-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  min-height: 100vh;
}

header {
  margin-bottom: 30px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 20px 30px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  flex-wrap: wrap;
  gap: 20px;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 15px;
}

.logo-icon {
  font-size: 3rem;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
}

.title-section h1 {
  font-size: 2.5rem;
  color: white;
  margin: 0;
  font-weight: 700;
  text-shadow: 0 2px 10px rgba(0,0,0,0.3);
}

.subtitle {
  color: rgba(255, 255, 255, 0.8);
  font-size: 1rem;
  margin: 5px 0 0 0;
  font-weight: 400;
}

.stats-section {
  display: flex;
  gap: 20px;
}

.stat-item {
  text-align: center;
  background: rgba(255, 255, 255, 0.1);
  padding: 15px 20px;
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.stat-number {
  display: block;
  font-size: 1.8rem;
  font-weight: bold;
  color: white;
}

.stat-label {
  display: block;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

main {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  padding: 40px;
  border-radius: 25px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  position: relative;
  overflow: hidden;
}

main::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4);
  background-size: 300% 100%;
  animation: shimmer 3s ease-in-out infinite;
}

@keyframes shimmer {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(5px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 100;
  border-radius: 25px;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 15px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-overlay p {
  color: #667eea;
  font-weight: 600;
  font-size: 1.1rem;
}

.toast {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 15px 25px;
  border-radius: 10px;
  color: white;
  font-weight: 500;
  z-index: 1000;
  animation: slideIn 0.3s ease-out;
  max-width: 300px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.2);
}

.toast.success {
  background: linear-gradient(45deg, #4ecdc4, #44a08d);
}

.toast.error {
  background: linear-gradient(45deg, #ff6b6b, #ee5a52);
}

.toast.info {
  background: linear-gradient(45deg, #45b7d1, #4da6d9);
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Mobile Responsiveness */
@media (max-width: 768px) {
  .app-container {
    padding: 15px;
  }

  .header-content {
    flex-direction: column;
    text-align: center;
    padding: 20px;
  }

  .title-section h1 {
    font-size: 2rem;
  }

  .logo-icon {
    font-size: 2.5rem;
  }

  main {
    padding: 25px;
  }

  .toast {
    right: 15px;
    left: 15px;
    max-width: none;
  }
}

@media (max-width: 480px) {
  .title-section h1 {
    font-size: 1.8rem;
  }

  .subtitle {
    font-size: 0.9rem;
  }

  main {
    padding: 20px;
  }
}
</style>