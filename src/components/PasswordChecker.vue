<template>
  <div class="password-checker">
    <div class="input-container">
      <label for="password">Enter Password:</label>
      <div class="password-field">
        <input
          id="password"
          v-model="password"
          :type="showPassword ? 'text' : 'password'"
          placeholder="Type your password here..."
          class="password-input"
          @input="checkStrength"
        />
        <button
          type="button"
          class="toggle-password"
          @click="togglePasswordVisibility"
          :aria-label="showPassword ? 'Hide password' : 'Show password'"
        >
          <span class="eye-icon">{{ showPassword ? '👁️' : '🙈' }}</span>
        </button>
      </div>
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

    <div class="breach-check" v-if="password.length > 0">
      <div class="breach-status" :class="breachStatus.type">
        <div class="breach-header">
          <span class="breach-icon">{{ breachStatus.icon }}</span>
          <span class="breach-text">{{ breachStatus.message }}</span>
        </div>
        <div v-if="breachStatus.loading" class="loading-dots">
          <span></span><span></span><span></span>
        </div>
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

    <div class="password-generator" v-if="password.length > 0 && strengthData.strength !== 'strong'">
      <h3>💡 Suggested Strong Passwords:</h3>
      <div class="suggested-passwords">
        <div 
          v-for="(suggestion, index) in generatedPasswords" 
          :key="index"
          class="password-suggestion"
          @click="useGeneratedPassword(suggestion)"
        >
          <span class="suggested-password">{{ suggestion }}</span>
          <button class="use-password-btn" @click.stop="useGeneratedPassword(suggestion)">
            Use This
          </button>
        </div>
      </div>
      <button class="generate-more-btn" @click="generateMorePasswords">
        🔄 Generate More
      </button>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue'
import { checkPasswordStrength } from '../utils/passwordStrength.js'

export default {
  name: 'PasswordChecker',
  setup() {
    const password = ref('')
    const showPassword = ref(false)
    const generatedPasswords = ref([])
    const breachStatus = ref({
      type: 'checking',
      message: 'Checking breach databases...',
      icon: '🔍',
      loading: true
    })
    let breachCheckTimeout = null
    
    const togglePasswordVisibility = () => {
      showPassword.value = !showPassword.value
    }
    
    const generatePassword = (length = 16) => {
      const lowercase = 'abcdefghijklmnopqrstuvwxyz'
      const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
      const numbers = '0123456789'
      const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?'
      const allChars = lowercase + uppercase + numbers + symbols
      
      let result = ''
      // Ensure at least one character from each category
      result += lowercase[Math.floor(Math.random() * lowercase.length)]
      result += uppercase[Math.floor(Math.random() * uppercase.length)]
      result += numbers[Math.floor(Math.random() * numbers.length)]
      result += symbols[Math.floor(Math.random() * symbols.length)]
      
      // Fill the rest randomly
      for (let i = 4; i < length; i++) {
        result += allChars[Math.floor(Math.random() * allChars.length)]
      }
      
      // Shuffle the result
      return result.split('').sort(() => 0.5 - Math.random()).join('')
    }
    
    const generateReadablePassword = () => {
      const words = ['Moon', 'Star', 'Sun', 'Ocean', 'River', 'Forest', 'Mountain', 'Eagle', 'Wolf', 'Tiger', 'Dragon', 'Phoenix', 'Thunder', 'Lightning', 'Storm', 'Fire', 'Ice', 'Snow', 'Rain', 'Wind', 'Earth', 'Sky', 'Cloud', 'Rock', 'Tree', 'Flower', 'Rose', 'Dawn', 'Sunset', 'Night', 'Dream', 'Hope', 'Peace', 'Joy', 'Love', 'Power', 'Magic', 'Quest', 'Journey', 'Victory']
      const word1 = words[Math.floor(Math.random() * words.length)]
      const word2 = words[Math.floor(Math.random() * words.length)]
      const number = Math.floor(Math.random() * 999) + 100
      const symbol = '!@#$%^&*'[Math.floor(Math.random() * 8)]
      return `${word1}${word2}${number}${symbol}`
    }
    
    const generateMorePasswords = () => {
      const newPasswords = []
      // Generate mix of random and readable passwords
      newPasswords.push(generatePassword(16))
      newPasswords.push(generatePassword(18))
      newPasswords.push(generateReadablePassword())
      newPasswords.push(generateReadablePassword())
      generatedPasswords.value = newPasswords
    }
    
    const useGeneratedPassword = (suggestedPassword) => {
      password.value = suggestedPassword
    }
    
    // Generate initial passwords when component mounts
    const initializePasswords = () => {
      generateMorePasswords()
    }
    
    // Generate initial passwords
    initializePasswords()
    
    // Mock breach database checking
    const checkPasswordBreach = (passwordToCheck) => {
      // Clear previous timeout
      if (breachCheckTimeout) {
        clearTimeout(breachCheckTimeout)
      }
      
      // Reset to checking state
      breachStatus.value = {
        type: 'checking',
        message: 'Checking breach databases...',
        icon: '🔍',
        loading: true
      }
      
      // Simulate API call delay
      breachCheckTimeout = setTimeout(() => {
        // Mock logic: common passwords are "found" in breaches
        const commonPasswords = ['password', '123456', 'qwerty', 'admin', 'letmein', 'password123']
        const isCommon = commonPasswords.includes(passwordToCheck.toLowerCase())
        
        // Simulate additional breach patterns
        const hasSequentialNumbers = /123|234|345|456|567|678|789/.test(passwordToCheck)
        const hasRepeatedChars = /(.)\1{2,}/.test(passwordToCheck)
        
        // Random chance for simulation (20% chance of breach for non-obvious cases)
        const randomBreach = Math.random() < 0.2
        
        if (isCommon || hasSequentialNumbers || hasRepeatedChars || (randomBreach && passwordToCheck.length < 12)) {
          breachStatus.value = {
            type: 'breach',
            message: 'Password found in breach databases! ⚠️',
            icon: '🚨',
            loading: false
          }
        } else {
          breachStatus.value = {
            type: 'safe',
            message: 'Password not found in known breaches ✨',
            icon: '✅',
            loading: false
          }
        }
      }, 1500) // 1.5 second delay to simulate API call
    }
    
    // Watch password changes and trigger breach check
    watch(password, (newPassword) => {
      if (newPassword.length > 0) {
        checkPasswordBreach(newPassword)
      }
    })
    
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
      showPassword,
      generatedPasswords,
      breachStatus,
      strengthData,
      strengthText,
      strengthClass,
      strengthPercentage,
      checkStrength,
      togglePasswordVisibility,
      generateMorePasswords,
      useGeneratedPassword
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

.password-field {
  position: relative;
  display: flex;
  align-items: center;
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
  padding: 16px 60px 16px 20px;
  font-size: 16px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  box-sizing: border-box;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: #fafafa;
  color: #1a1a1a;
}

.toggle-password {
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  z-index: 1;
}

.toggle-password:hover {
  background: rgba(0, 0, 0, 0.05);
  transform: scale(1.1);
}

.toggle-password:active {
  transform: scale(0.95);
}

.eye-icon {
  font-size: 18px;
  user-select: none;
  transition: all 0.2s ease;
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
    padding: 14px 50px 14px 16px;
    font-size: 16px;
  }
  
  .toggle-password {
    right: 8px;
    padding: 6px;
  }
  
  .eye-icon {
    font-size: 16px;
  }
}

.strength-indicator {
  margin-bottom: 24px;
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
  transition: width 0.8s cubic-bezier(0.23, 1, 0.32, 1), 
              background 0.5s cubic-bezier(0.4, 0, 0.2, 1),
              box-shadow 0.3s ease;
  border-radius: 8px;
  position: relative;
  overflow: hidden;
  transform-origin: left center;
  animation: strengthPulse 0.6s ease-out;
}

@keyframes strengthPulse {
  0% {
    transform: scaleX(0);
  }
  50% {
    transform: scaleX(1.05);
  }
  100% {
    transform: scaleX(1);
  }
}

.strength-fill::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, 
    rgba(255, 255, 255, 0.1) 25%, 
    transparent 25%, 
    transparent 50%, 
    rgba(255, 255, 255, 0.1) 50%, 
    rgba(255, 255, 255, 0.1) 75%, 
    transparent 75%);
  background-size: 20px 20px;
  animation: barberPole 1s linear infinite;
  opacity: 0.6;
}

@keyframes barberPole {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 20px 20px;
  }
}

.strength-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  animation: shimmer 2.5s infinite;
  border-radius: 8px;
}

@keyframes shimmer {
  0% { 
    left: -100%; 
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% { 
    left: 100%; 
    opacity: 0;
  }
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
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
  animation: weakPulse 2s infinite;
}

@keyframes weakPulse {
  0%, 100% {
    box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
  }
  50% {
    box-shadow: 0 4px 16px rgba(239, 68, 68, 0.5);
  }
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
  box-shadow: 0 2px 8px rgba(245, 158, 11, 0.3);
  animation: mediumGlow 1.5s ease-in-out infinite alternate;
}

@keyframes mediumGlow {
  from {
    box-shadow: 0 2px 8px rgba(245, 158, 11, 0.3);
  }
  to {
    box-shadow: 0 4px 12px rgba(245, 158, 11, 0.6);
  }
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
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
  animation: strongSpark 3s ease-in-out infinite;
}

@keyframes strongSpark {
  0%, 100% {
    box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
    filter: brightness(1);
  }
  50% {
    box-shadow: 0 6px 20px rgba(16, 185, 129, 0.6);
    filter: brightness(1.1);
  }
}

.strong .strength-text {
  background: #ecfdf5;
  color: #059669;
  border-color: #a7f3d0;
}

.breach-check {
  margin-bottom: 24px;
  animation: slideIn 0.4s ease-out;
}

.breach-status {
  padding: 16px 20px;
  border-radius: 12px;
  border: 2px solid;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.breach-status.checking {
  background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
  border-color: #94a3b8;
  color: #475569;
}

.breach-status.safe {
  background: linear-gradient(135deg, #ecfdf5, #d1fae5);
  border-color: #a7f3d0;
  color: #059669;
  animation: safeGlow 2s ease-in-out;
}

@keyframes safeGlow {
  0%, 100% {
    box-shadow: 0 2px 8px rgba(16, 185, 129, 0.2);
  }
  50% {
    box-shadow: 0 4px 16px rgba(16, 185, 129, 0.4);
  }
}

.breach-status.breach {
  background: linear-gradient(135deg, #fef2f2, #fee2e2);
  border-color: #fca5a5;
  color: #dc2626;
  animation: breachAlert 1s ease-in-out infinite alternate;
}

@keyframes breachAlert {
  0% {
    box-shadow: 0 2px 8px rgba(220, 38, 38, 0.3);
  }
  100% {
    box-shadow: 0 4px 16px rgba(220, 38, 38, 0.6);
  }
}

.breach-header {
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 600;
  font-size: 14px;
}

.breach-icon {
  font-size: 18px;
  animation: iconPulse 2s ease-in-out infinite;
}

@keyframes iconPulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.breach-text {
  flex: 1;
}

.loading-dots {
  display: flex;
  gap: 4px;
  margin-top: 8px;
}

.loading-dots span {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #94a3b8;
  animation: loadingPulse 1.4s ease-in-out infinite both;
}

.loading-dots span:nth-child(1) {
  animation-delay: -0.32s;
}

.loading-dots span:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes loadingPulse {
  0%, 80%, 100% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
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

.password-generator {
  text-align: left;
  margin-bottom: 24px;
  background: linear-gradient(135deg, #f8fafc, #e8f4f8);
  padding: 24px;
  border-radius: 16px;
  border: 1px solid #cbd5e1;
  animation: slideInUp 0.6s ease-out;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.password-generator h3 {
  color: #1e293b;
  margin-bottom: 20px;
  font-size: 18px;
  font-weight: 600;
  letter-spacing: -0.01em;
  display: flex;
  align-items: center;
  gap: 8px;
}

.suggested-passwords {
  display: grid;
  gap: 12px;
  margin-bottom: 20px;
}

.password-suggestion {
  background: #ffffff;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.password-suggestion:hover {
  border-color: #6366f1;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  background: linear-gradient(135deg, #ffffff, #f8fafc);
}

.password-suggestion::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.1), transparent);
  transition: left 0.5s ease;
}

.password-suggestion:hover::before {
  left: 100%;
}

.suggested-password {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  background: #f1f5f9;
  padding: 8px 12px;
  border-radius: 8px;
  letter-spacing: 0.5px;
  word-break: break-all;
  flex: 1;
  margin-right: 12px;
  border: 1px solid #e2e8f0;
}

.use-password-btn {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 4px rgba(99, 102, 241, 0.2);
}

.use-password-btn:hover {
  background: linear-gradient(135deg, #5855eb, #7c3aed);
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(99, 102, 241, 0.3);
}

.use-password-btn:active {
  transform: scale(0.95);
}

.generate-more-btn {
  width: 100%;
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
}

.generate-more-btn:hover {
  background: linear-gradient(135deg, #059669, #047857);
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(16, 185, 129, 0.3);
}

.generate-more-btn:active {
  transform: translateY(0);
}

@media (max-width: 768px) {
  .password-generator {
    padding: 20px;
  }
  
  .password-generator h3 {
    font-size: 16px;
  }
  
  .password-suggestion {
    padding: 14px;
    flex-direction: column;
    gap: 12px;
  }
  
  .suggested-password {
    margin-right: 0;
    margin-bottom: 0;
    font-size: 13px;
    text-align: center;
    width: 100%;
  }
}

@media (max-width: 480px) {
  .password-generator {
    padding: 16px;
    margin-bottom: 20px;
  }
  
  .suggested-password {
    font-size: 12px;
    padding: 6px 10px;
  }
  
  .use-password-btn {
    padding: 6px 12px;
    font-size: 11px;
  }
  
  .generate-more-btn {
    padding: 10px 16px;
    font-size: 13px;
  }
}
</style>