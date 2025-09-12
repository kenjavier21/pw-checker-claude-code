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
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
}

.input-container {
  margin-bottom: 30px;
}

label {
  display: block;
  margin-bottom: 10px;
  font-weight: bold;
  color: #333;
}

.password-input {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  border: 2px solid #ddd;
  border-radius: 8px;
  box-sizing: border-box;
  transition: border-color 0.3s;
}

.password-input:focus {
  outline: none;
  border-color: #42b883;
}

.strength-indicator {
  margin-bottom: 30px;
}

.strength-label {
  font-weight: bold;
  margin-bottom: 10px;
  color: #333;
}

.strength-bar {
  width: 100%;
  height: 20px;
  background-color: #f0f0f0;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 10px;
}

.strength-fill {
  height: 100%;
  transition: width 0.3s ease, background-color 0.3s ease;
  border-radius: 10px;
}

.strength-text {
  font-weight: bold;
  font-size: 18px;
}

.weak {
  background-color: #ff4757;
  color: #ff4757;
}

.medium {
  background-color: #ffa726;
  color: #ffa726;
}

.strong {
  background-color: #4caf50;
  color: #4caf50;
}

.requirements, .feedback {
  text-align: left;
  margin-bottom: 20px;
}

.requirements h3, .feedback h3 {
  color: #333;
  margin-bottom: 15px;
}

.requirements ul, .feedback ul {
  list-style: none;
  padding: 0;
}

.requirements li, .feedback li {
  padding: 8px 0;
  color: #666;
  transition: color 0.3s;
}

.requirements li.met {
  color: #4caf50;
}

.feedback li {
  padding: 5px 0;
  color: #555;
  font-size: 14px;
}

.check {
  display: inline-block;
  width: 20px;
  font-weight: bold;
  margin-right: 10px;
}
</style>