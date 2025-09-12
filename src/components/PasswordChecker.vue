<template>
  <div class="password-checker">
    <div class="input-container">
      <label for="password">Enter Password:</label>
      <input
        id="password"
        v-model="password"
        type="password"
        placeholder="Type your password here..."
        class="password-input"
        @input="checkStrength"
      />
    </div>
    
    <div class="strength-indicator">
      <div class="strength-label">Password Strength:</div>
      <div class="strength-bar">
        <div 
          class="strength-fill"
          :class="strengthClass"
          :style="{ width: strengthPercentage + '%' }"
        ></div>
      </div>
      <div class="strength-text" :class="strengthClass">
        {{ strengthText }}
      </div>
    </div>

    <div class="requirements" v-if="password.length > 0">
      <h3>Requirements:</h3>
      <ul>
        <li :class="{ met: strengthData.requirements.minLength }">
          <span class="check">{{ strengthData.requirements.minLength ? '✓' : '✗' }}</span>
          At least 8 characters
        </li>
        <li :class="{ met: strengthData.requirements.hasUppercase }">
          <span class="check">{{ strengthData.requirements.hasUppercase ? '✓' : '✗' }}</span>
          Contains uppercase letter
        </li>
        <li :class="{ met: strengthData.requirements.hasLowercase }">
          <span class="check">{{ strengthData.requirements.hasLowercase ? '✓' : '✗' }}</span>
          Contains lowercase letter
        </li>
        <li :class="{ met: strengthData.requirements.hasNumbers }">
          <span class="check">{{ strengthData.requirements.hasNumbers ? '✓' : '✗' }}</span>
          Contains number
        </li>
        <li :class="{ met: strengthData.requirements.hasSpecialChars }">
          <span class="check">{{ strengthData.requirements.hasSpecialChars ? '✓' : '✗' }}</span>
          Contains special character
        </li>
        <li :class="{ met: strengthData.requirements.notCommon }">
          <span class="check">{{ strengthData.requirements.notCommon ? '✓' : '✗' }}</span>
          Not a common password
        </li>
      </ul>
    </div>

    <div class="feedback" v-if="strengthData.feedback.length > 0">
      <h3>Suggestions:</h3>
      <ul>
        <li v-for="(suggestion, index) in strengthData.feedback" :key="index">
          {{ suggestion }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { checkPasswordStrength } from '../utils/passwordStrength.js'

export default {
  name: 'PasswordChecker',
  setup() {
    const password = ref('')
    
    const strengthData = computed(() => {
      if (password.value.length === 0) {
        return {
          strength: 'weak',
          score: 0,
          feedback: [],
          requirements: {
            minLength: false,
            hasUppercase: false,
            hasLowercase: false,
            hasNumbers: false,
            hasSpecialChars: false,
            notCommon: true
          }
        }
      }
      return checkPasswordStrength(password.value)
    })
    
    const strengthText = computed(() => {
      if (password.value.length === 0) return ''
      const strength = strengthData.value.strength
      return strength.charAt(0).toUpperCase() + strength.slice(1)
    })
    
    const strengthClass = computed(() => {
      return strengthData.value.strength
    })
    
    const strengthPercentage = computed(() => {
      if (password.value.length === 0) return 0
      const maxScore = 8
      return Math.min((strengthData.value.score / maxScore) * 100, 100)
    })
    
    const checkStrength = () => {
      // This method is called on input but the reactive computed properties
      // handle the strength calculation automatically
    }
    
    return {
      password,
      strengthData,
      strengthText,
      strengthClass,
      strengthPercentage,
      checkStrength
    }
  }
}
</script>

<style scoped>
.password-checker {
  max-width: 520px;
  margin: 0 auto;
  padding: 24px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  border: 1px solid #e8e8e8;
  transition: all 0.3s ease;
}

@media (max-width: 768px) {
  .password-checker {
    margin: 16px;
    padding: 20px;
    border-radius: 12px;
  }
}

@media (max-width: 480px) {
  .password-checker {
    margin: 12px;
    padding: 16px;
    border-radius: 8px;
  }
}

.input-container {
  margin-bottom: 32px;
  position: relative;
}

label {
  display: block;
  margin-bottom: 12px;
  font-weight: 600;
  color: #1a1a1a;
  font-size: 16px;
  letter-spacing: -0.01em;
}

@media (max-width: 480px) {
  label {
    font-size: 14px;
  }
}

.password-input {
  width: 100%;
  padding: 16px 20px;
  font-size: 16px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  box-sizing: border-box;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: #fafafa;
  color: #1a1a1a;
}

.password-input:focus {
  outline: none;
  border-color: #6366f1;
  background: #ffffff;
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
  transform: translateY(-1px);
}

.password-input::placeholder {
  color: #9ca3af;
  transition: opacity 0.3s ease;
}

.password-input:focus::placeholder {
  opacity: 0.5;
}

@media (max-width: 480px) {
  .password-input {
    padding: 14px 16px;
    font-size: 16px;
  }
}

.strength-indicator {
  margin-bottom: 32px;
  animation: slideIn 0.4s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.strength-label {
  font-weight: 600;
  margin-bottom: 12px;
  color: #1a1a1a;
  font-size: 16px;
  letter-spacing: -0.01em;
}

@media (max-width: 480px) {
  .strength-label {
    font-size: 14px;
  }
}

.strength-bar {
  width: 100%;
  height: 12px;
  background: linear-gradient(135deg, #f3f4f6, #e5e7eb);
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 16px;
  position: relative;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.06);
}

.strength-fill {
  height: 100%;
  transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1), 
              background 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 8px;
  position: relative;
  overflow: hidden;
}

.strength-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% { left: -100%; }
  100% { left: 100%; }
}

.strength-text {
  font-weight: 700;
  font-size: 18px;
  text-align: center;
  padding: 8px 16px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  letter-spacing: -0.01em;
  text-transform: capitalize;
}

@media (max-width: 480px) {
  .strength-text {
    font-size: 16px;
    padding: 6px 12px;
  }
}

.weak {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: #ffffff;
  border-color: #dc2626;
}

.weak .strength-text {
  background: #fef2f2;
  color: #dc2626;
  border-color: #fecaca;
}

.medium {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: #ffffff;
  border-color: #d97706;
}

.medium .strength-text {
  background: #fffbeb;
  color: #d97706;
  border-color: #fed7aa;
}

.strong {
  background: linear-gradient(135deg, #10b981, #059669);
  color: #ffffff;
  border-color: #059669;
}

.strong .strength-text {
  background: #ecfdf5;
  color: #059669;
  border-color: #a7f3d0;
}

.requirements, .feedback {
  text-align: left;
  margin-bottom: 24px;
  background: #f8fafc;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 480px) {
  .requirements, .feedback {
    padding: 16px;
  }
}

.requirements h3, .feedback h3 {
  color: #1e293b;
  margin-bottom: 16px;
  font-size: 18px;
  font-weight: 600;
  letter-spacing: -0.01em;
}

@media (max-width: 480px) {
  .requirements h3, .feedback h3 {
    font-size: 16px;
  }
}

.requirements ul, .feedback ul {
  list-style: none;
  padding: 0;
  display: grid;
  gap: 12px;
}

@media (min-width: 768px) {
  .requirements ul {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px 24px;
  }
}

.requirements li, .feedback li {
  padding: 12px 16px;
  color: #64748b;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: #ffffff;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: -0.01em;
}

.requirements li:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.requirements li.met {
  color: #059669;
  background: linear-gradient(135deg, #ecfdf5, #d1fae5);
  border-color: #a7f3d0;
  transform: scale(1.02);
}

.requirements li.met .check {
  color: #10b981;
  transform: scale(1.1);
}

.feedback li {
  padding: 12px 16px;
  color: #475569;
  font-size: 14px;
  background: #ffffff;
  border-left: 4px solid #f59e0b;
  border-radius: 0 8px 8px 0;
  grid-column: 1 / -1;
}

.check {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  font-weight: 700;
  margin-right: 12px;
  border-radius: 50%;
  background: #f1f5f9;
  color: #64748b;
  font-size: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;
}

.requirements li.met .check {
  background: linear-gradient(135deg, #10b981, #059669);
  color: #ffffff;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
}

@media (max-width: 480px) {
  .requirements li, .feedback li {
    padding: 10px 12px;
    font-size: 13px;
  }
  
  .check {
    width: 20px;
    height: 20px;
    margin-right: 10px;
    font-size: 11px;
  }
}
</style>