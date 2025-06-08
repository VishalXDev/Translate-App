<template>
  <div class="translation-history">
    <div class="history-header">
      <div class="header-content">
        <div class="title-section">
          <div class="history-icon">📚</div>
          <h3>Translation History</h3>
          <div class="history-count" v-if="hasHistory">{{ history.length }}</div>
        </div>
        <button 
          @click="$emit('clear-history')" 
          class="clear-btn" 
          :class="{ 'shake': clearShake }"
          :disabled="!hasHistory"
          @animationend="clearShake = false"
        >
          <span class="btn-icon">🗑️</span>
          Clear All
        </button>
      </div>
    </div>
    
    <transition name="fade" mode="out-in">
      <div v-if="!hasHistory" class="empty-history" key="empty">
        <div class="empty-icon">🌟</div>
        <p>Your translation journey starts here!</p>
        <p class="empty-subtitle">Start translating to build your history</p>
      </div>
      
      <div v-else class="history-container" key="history">
        <transition-group name="history-item" tag="ul" class="history-list">
          <li 
            v-for="(item, index) in history" 
            :key="`${item.sourceText}-${item.targetLang}-${index}`" 
            class="history-item"
            :style="{ '--item-index': index }"
          >
            <div class="item-card">
              <div class="card-header">
                <div class="language-badge source">EN</div>
                <div class="arrow-icon">→</div>
                <div class="language-badge target">{{ getLanguageCode(item.targetLang) }}</div>
                <div class="item-actions">
                  <button 
                    @click="handleReuse(item)" 
                    class="action-btn reuse-btn" 
                    title="Reuse this translation"
                  >
                    <span class="btn-icon">↩️</span>
                  </button>
                  <button 
                    @click="handleDelete(index)" 
                    class="action-btn delete-btn" 
                    title="Delete this translation"
                  >
                    <span class="btn-icon">❌</span>
                  </button>
                </div>
              </div>
              
              <div class="card-content">
                <div class="text-section source-section">
                  <div class="text-content">{{ item.sourceText }}</div>
                </div>
                
                <div class="divider"></div>
                
                <div class="text-section target-section">
                  <div class="text-content">{{ item.translatedText }}</div>
                  <div class="language-name">{{ getLanguageName(item.targetLang) }}</div>
                </div>
              </div>
            </div>
          </li>
        </transition-group>
      </div>
    </transition>
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
      languageOptions: getLanguageOptions(),
      clearShake: false
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
    },
    
    getLanguageCode(langCode) {
      // Return first 2-3 characters of language code in uppercase
      return langCode.substring(0, 3).toUpperCase();
    },
    
    handleReuse(item) {
      this.$emit('reuse', item);
    },
    
    handleDelete(index) {
      this.clearShake = true;
      this.$emit('delete-item', index);
    }
  }
};
</script>

<style scoped>
.translation-history {
  margin-top: 40px;
  padding: 0 20px;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.history-header {
  margin-bottom: 30px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
  padding: 20px 30px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
  animation: slideInDown 0.6s ease-out;
}

.title-section {
  display: flex;
  align-items: center;
  gap: 15px;
  color: white;
}

.history-icon {
  font-size: 28px;
  animation: bounce 2s infinite;
}

h3 {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  background: linear-gradient(45deg, #fff, #e0e7ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.history-count {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  min-width: 30px;
  text-align: center;
  animation: pulse 2s infinite;
}

.clear-btn {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 15px;
  padding: 12px 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 140px;
  justify-content: center;
}

.clear-btn:not(:disabled):hover {
  background: rgba(255, 255, 255, 0.25);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

.clear-btn:not(:disabled):active {
  transform: translateY(0);
}

.clear-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.clear-btn.shake {
  animation: shake 0.5s ease-in-out;
}

.btn-icon {
  font-size: 16px;
}

.empty-history {
  text-align: center;
  padding: 60px 20px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 20px;
  animation: fadeIn 0.6s ease-out;
}

.empty-icon {
  font-size: 60px;
  margin-bottom: 20px;
  animation: float 3s ease-in-out infinite;
}

.empty-history p {
  margin: 10px 0;
  color: #4a5568;
  font-size: 18px;
  font-weight: 600;
}

.empty-subtitle {
  color: #718096 !important;
  font-size: 14px !important;
  font-weight: 400 !important;
}

.history-container {
  animation: fadeIn 0.6s ease-out;
}

.history-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.history-item {
  animation: slideInUp 0.6s ease-out;
  animation-delay: calc(var(--item-index) * 0.1s);
  animation-fill-mode: both;
}

.item-card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  overflow: hidden;
  transition: all 0.3s ease;
  position: relative;
}

.item-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #667eea, #764ba2, #f093fb, #f5828f);
  background-size: 300% 100%;
  animation: gradient 3s ease infinite;
}

.item-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.card-header {
  padding: 20px 25px 15px;
  display: flex;
  align-items: center;
  gap: 15px;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
}

.language-badge {
  padding: 8px 16px;
  border-radius: 25px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.5px;
  min-width: 50px;
  text-align: center;
}

.language-badge.source {
  background: linear-gradient(135deg, #4299e1, #3182ce);
  color: white;
}

.language-badge.target {
  background: linear-gradient(135deg, #48bb78, #38a169);
  color: white;
}

.arrow-icon {
  font-size: 20px;
  color: #64748b;
  animation: pulse 2s infinite;
}

.item-actions {
  margin-left: auto;
  display: flex;
  gap: 10px;
}

.action-btn {
  background: rgba(255, 255, 255, 0.8);
  border: 2px solid transparent;
  border-radius: 12px;
  padding: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
}

.action-btn:hover {
  transform: scale(1.1);
}

.reuse-btn:hover {
  background: #e6fffa;
  border-color: #38b2ac;
  box-shadow: 0 4px 12px rgba(56, 178, 172, 0.3);
}

.delete-btn:hover {
  background: #fed7d7;
  border-color: #e53e3e;
  box-shadow: 0 4px 12px rgba(229, 62, 62, 0.3);
}

.card-content {
  padding: 20px 25px 25px;
}

.text-section {
  margin-bottom: 20px;
}

.text-section:last-child {
  margin-bottom: 0;
}

.text-content {
  font-size: 16px;
  line-height: 1.6;
  color: #2d3748;
  word-break: break-word;
  padding: 15px 20px;
  border-radius: 12px;
  position: relative;
}

.source-section .text-content {
  background: linear-gradient(135deg, #ebf8ff, #bee3f8);
  border-left: 4px solid #4299e1;
}

.target-section .text-content {
  background: linear-gradient(135deg, #f0fff4, #c6f6d5);
  border-left: 4px solid #48bb78;
}

.divider {
  height: 2px;
  background: linear-gradient(90deg, transparent, #e2e8f0, transparent);
  margin: 20px 0;
}

.language-name {
  text-align: right;
  font-size: 12px;
  color: #718096;
  font-weight: 500;
  margin-top: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Animations */
@keyframes slideInDown {
  from {
    transform: translateY(-100px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes slideInUp {
  from {
    transform: translateY(50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-10px); }
  60% { transform: translateY(-5px); }
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

@keyframes gradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* Transition animations */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.history-item-enter-active {
  transition: all 0.6s ease;
}

.history-item-leave-active {
  transition: all 0.4s ease;
}

.history-item-enter-from {
  opacity: 0;
  transform: translateX(-100px) scale(0.8);
}

.history-item-leave-to {
  opacity: 0;
  transform: translateX(100px) scale(0.8);
}

.history-item-move {
  transition: transform 0.4s ease;
}

/* Responsive Design */
@media (max-width: 768px) {
  .translation-history {
    padding: 0 15px;
  }
  
  .header-content {
    padding: 15px 20px;
    flex-direction: column;
    align-items: stretch;
    gap: 15px;
  }
  
  .title-section {
    justify-content: center;
  }
  
  .clear-btn {
    align-self: center;
    min-width: 120px;
  }
  
  .card-header {
    padding: 15px 20px 10px;
    flex-direction: column;
    gap: 10px;
  }
  
  .item-actions {
    margin-left: 0;
    justify-content: center;
  }
  
  .card-content {
    padding: 15px 20px 20px;
  }
  
  h3 {
    font-size: 20px;
  }
}

@media (max-width: 480px) {
  .language-badge {
    padding: 6px 12px;
    font-size: 11px;
    min-width: 40px;
  }
  
  .text-content {
    font-size: 14px;
    padding: 12px 15px;
  }
  
  .action-btn {
    width: 40px;
    height: 40px;
  }
}</style>