<template>
  <div class="translation-history">
    <div class="history-header">
      <h3>Translation History</h3>
      <button 
        @click="$emit('clear-history')" 
        class="clear-btn" 
        :disabled="!hasHistory"
      >
        Clear History
      </button>
    </div>
    
    <div v-if="!hasHistory" class="empty-history">
      <p>No translation history yet.</p>
    </div>
    
    <ul v-else class="history-list">
      <li v-for="(item, index) in history" :key="index" class="history-item">
        <div class="history-content">
          <p><strong>* English:</strong> {{ item.sourceText }}</p>
          <p><strong>{{ getLanguageName(item.targetLang) }}:</strong> {{ item.translatedText }}</p>
        </div>
        <div class="history-actions">
          <button 
            @click="$emit('reuse', item)" 
            class="action-btn reuse-btn" 
            title="Reuse this translation"
          >
            ↩️
          </button>
          <button 
            @click="$emit('delete-item', index)" 
            class="action-btn delete-btn" 
            title="Delete this translation"
          >
            🗑️
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { getLanguageOptions } from '@/services/translationService';

export default {
  name: 'TranslationHistory',
  
  props: {
    history: {
      type: Array,
      default: () => []
    }
  },
  
  data() {
    return {
      languageOptions: getLanguageOptions()
    };
  },
  
  computed: {
    hasHistory() {
      return this.history.length > 0;
    }
  },
  
  methods: {
    getLanguageName(langCode) {
      const lang = this.languageOptions.find(l => l.code === langCode);
      return lang ? lang.name : langCode;
    }
  }
};
</script>

<style scoped>
.translation-history {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #e0e0e0;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  padding-left: 15px;
  padding-right: 15px;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  flex-wrap: wrap;
  gap: 10px;
}

h3 {
  margin: 0;
  color: #333;
  flex-grow: 1;
}

.clear-btn {
  background-color: #f1f1f1;
  color: #333;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
  min-width: 120px;
}

.clear-btn:not(:disabled):hover {
  background-color: #e1e1e1;
}

.clear-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.empty-history {
  color: #757575;
  font-style: italic;
}

.history-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.history-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 10px 0;
  border-bottom: 1px solid #eeeeee;
  flex-wrap: wrap;
  gap: 10px;
}

.history-item:last-child {
  border-bottom: none;
}

.history-content {
  flex-grow: 1;
  min-width: 200px;
}

.history-content p {
  margin: 5px 0;
  font-size: 0.95rem;
  word-break: break-word;
}

.history-actions {
  display: flex;
  gap: 5px;
  flex-shrink: 0;
}

.action-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  padding: 5px;
  border-radius: 4px;
  transition: background-color 0.2s;
  user-select: none;
}

.action-btn:hover {
  background-color: #e0e0e0;
}

.delete-btn {
  color: #e53935;
}

@media (max-width: 480px) {
  .history-item {
    flex-direction: column;
    align-items: stretch;
  }
  .history-actions {
    justify-content: flex-start;
  }
}
</style>
