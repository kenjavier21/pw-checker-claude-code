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
        <li :class="{ met: hasMinLength }">
          <span class="check">{{ hasMinLength ? '✓' : '✗' }}</span>
          At least 8 characters
        </li>
        <li :class="{ met: hasUppercase }">
          <span class="check">{{ hasUppercase ? '✓' : '✗' }}</span>
          Contains uppercase letter
        </li>
        <li :class="{ met: hasLowercase }">
          <span class="check">{{ hasLowercase ? '✓' : '✗' }}</span>
          Contains lowercase letter
        </li>
        <li :class="{ met: hasNumber }">
          <span class="check">{{ hasNumber ? '✓' : '✗' }}</span>
          Contains number
        </li>
        <li :class="{ met: hasSpecialChar }">
          <span class="check">{{ hasSpecialChar ? '✓' : '✗' }}</span>
          Contains special character
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  name: 'PasswordChecker',
  setup() {
    const password = ref('')
    
    const hasMinLength = computed(() => password.value.length >= 8)
    const hasUppercase = computed(() => /[A-Z]/.test(password.value))
    const hasLowercase = computed(() => /[a-z]/.test(password.value))
    const hasNumber = computed(() => /\d/.test(password.value))
    const hasSpecialChar = computed(() => /[!@#$%^&*(),.?":{}|<>]/.test(password.value))
    
    const strengthScore = computed(() => {
      let score = 0
      if (hasMinLength.value) score++
      if (hasUppercase.value) score++
      if (hasLowercase.value) score++
      if (hasNumber.value) score++
      if (hasSpecialChar.value) score++
      return score
    })
    
    const strengthText = computed(() => {
      if (password.value.length === 0) return ''
      switch (strengthScore.value) {
        case 0:
        case 1: return 'Very Weak'
        case 2: return 'Weak'
        case 3: return 'Fair'
        case 4: return 'Good'
        case 5: return 'Strong'
        default: return ''
      }
    })
    
    const strengthClass = computed(() => {
      switch (strengthScore.value) {
        case 0:
        case 1: return 'very-weak'
        case 2: return 'weak'
        case 3: return 'fair'
        case 4: return 'good'
        case 5: return 'strong'
        default: return ''
      }
    })
    
    const strengthPercentage = computed(() => {
      return (strengthScore.value / 5) * 100
    })
    
    const checkStrength = () => {
      // This method is called on input but the reactive computed properties
      // handle the strength calculation automatically
    }
    
    return {
      password,
      hasMinLength,
      hasUppercase,
      hasLowercase,
      hasNumber,
      hasSpecialChar,
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

.very-weak {
  background-color: #ff4757;
  color: #ff4757;
}

.weak {
  background-color: #ff6b3d;
  color: #ff6b3d;
}

.fair {
  background-color: #ffa726;
  color: #ffa726;
}

.good {
  background-color: #66bb6a;
  color: #66bb6a;
}

.strong {
  background-color: #4caf50;
  color: #4caf50;
}

.requirements {
  text-align: left;
}

.requirements h3 {
  color: #333;
  margin-bottom: 15px;
}

.requirements ul {
  list-style: none;
  padding: 0;
}

.requirements li {
  padding: 8px 0;
  color: #666;
  transition: color 0.3s;
}

.requirements li.met {
  color: #4caf50;
}

.check {
  display: inline-block;
  width: 20px;
  font-weight: bold;
  margin-right: 10px;
}
</style>