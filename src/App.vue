<template>
  <div class="app-container">
    <header>
      <h1>🌐 Language Translator</h1>
      <h2>🔁 Translate English to Hindi & 8 other languages</h2>
    </header>

    <main>
      <TranslationForm ref="translationForm" @translate="handleTranslation" />

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
      maxHistoryItems: 10,
    };
  },

  mounted() {
    this.loadHistoryFromStorage();
  },

  methods: {
    async handleTranslation({ text, targetLang }) {
      this.isLoading = true;
      this.errorMessage = "";
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
        } else {
          this.errorMessage = `❗ Error (${result.error.type}): ${result.error.message}`;
        }
      } catch (unexpectedError) {
        this.errorMessage = `🚨 Unexpected error: ${unexpectedError.message}`;
      } finally {
        this.isLoading = false;
        if (this.$refs.translationForm) {
          this.$refs.translationForm.resetLoadingState();
        }
      }
    },

    addToHistory(translationItem) {
      this.translationHistory.unshift(translationItem);
      if (this.translationHistory.length > this.maxHistoryItems) {
        this.translationHistory = this.translationHistory.slice(
          0,
          this.maxHistoryItems
        );
      }
      this.saveHistoryToStorage();
    },

    clearHistory() {
      this.translationHistory = [];
      localStorage.removeItem("translationHistory");
    },

    deleteHistoryItem(index) {
      this.translationHistory.splice(index, 1);
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
        localStorage.setItem(
          "translationHistory",
          JSON.stringify(this.translationHistory)
        );
      } catch (error) {
        console.error("❌ Failed to save history:", error);
      }
    },

    loadHistoryFromStorage() {
      try {
        const savedHistory = localStorage.getItem("translationHistory");
        if (savedHistory) {
          this.translationHistory = JSON.parse(savedHistory);
        }
      } catch (error) {
        console.error("❌ Failed to load history:", error);
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
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
  color: #333;
  background-color: #f8f8f8;
}

.app-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}

header {
  text-align: center;
  margin-bottom: 30px;
}

h1 {
  font-size: 2.5rem;
  color: #222;
  margin-bottom: 8px;
}

h2 {
  font-size: 1.1rem;
  color: #444;
}

main {
  background-color: #fff;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 2px 14px rgba(0, 0, 0, 0.1);
}

/* Mobile Responsiveness */
@media (max-width: 768px) {
  .app-container {
    padding: 15px;
  }

  main {
    padding: 20px;
  }

  h1 {
    font-size: 1.8rem;
  }

  h2 {
    font-size: 0.95rem;
  }
}

@media (max-width: 480px) {
  h1 {
    font-size: 1.6rem;
  }

  h2 {
    font-size: 0.9rem;
  }

  main {
    padding: 15px;
  }
}
</style>
