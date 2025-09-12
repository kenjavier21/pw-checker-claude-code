const COMMON_PASSWORDS = [
  'password', '123456', '123456789', 'qwerty', 'abc123', 'password123',
  'admin', 'letmein', 'welcome', 'monkey', '1234567890', 'iloveyou',
  'princess', 'rockyou', '12345678', '123123', 'football', 'baseball',
  'welcome123', 'sunshine', 'master', 'shadow', 'dragon', 'passw0rd',
  '654321', 'superman', 'qazwsx', 'michael', 'hello', 'charlie',
  'aa123456', 'donald', 'password1', '1234567', 'login', 'jordan23'
];

export function checkPasswordStrength(password) {
  const result = {
    strength: 'weak',
    score: 0,
    feedback: [],
    requirements: {
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumbers: /\d/.test(password),
      hasSpecialChars: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>?]/.test(password),
      notCommon: !COMMON_PASSWORDS.includes(password.toLowerCase())
    }
  };

  // Calculate base score from requirements
  let score = 0;
  const requirements = result.requirements;

  if (requirements.minLength) score += 1;
  if (requirements.hasUppercase) score += 1;
  if (requirements.hasLowercase) score += 1;
  if (requirements.hasNumbers) score += 1;
  if (requirements.hasSpecialChars) score += 1;
  if (requirements.notCommon) score += 1;

  // Additional scoring factors
  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 1;

  // Check for patterns that reduce strength
  if (hasSequentialChars(password)) score -= 1;
  if (hasRepeatedChars(password)) score -= 1;
  if (hasKeyboardPatterns(password)) score -= 1;

  result.score = Math.max(0, score);

  // Determine strength level
  if (result.score >= 7) {
    result.strength = 'strong';
  } else if (result.score >= 4) {
    result.strength = 'medium';
  } else {
    result.strength = 'weak';
  }

  // Generate specific feedback
  result.feedback = generateFeedback(password, requirements, result.strength);

  return result;
}

function hasSequentialChars(password) {
  const sequences = ['0123456789', 'abcdefghijklmnopqrstuvwxyz', 'qwertyuiop', 'asdfghjkl', 'zxcvbnm'];
  return sequences.some(seq => {
    for (let i = 0; i <= seq.length - 3; i++) {
      const subseq = seq.substring(i, i + 3);
      if (password.toLowerCase().includes(subseq) || password.toLowerCase().includes(subseq.split('').reverse().join(''))) {
        return true;
      }
    }
    return false;
  });
}

function hasRepeatedChars(password) {
  const repeatedPattern = /(.)\1{2,}/;
  return repeatedPattern.test(password);
}

function hasKeyboardPatterns(password) {
  const patterns = ['qwerty', 'asdf', 'zxcv', '1234', 'qwertz', 'azerty'];
  return patterns.some(pattern => password.toLowerCase().includes(pattern));
}

function generateFeedback(password, requirements, strength) {
  const feedback = [];

  if (!requirements.minLength) {
    feedback.push('Password should be at least 8 characters long');
  }
  
  if (!requirements.hasUppercase) {
    feedback.push('Add uppercase letters (A-Z)');
  }
  
  if (!requirements.hasLowercase) {
    feedback.push('Add lowercase letters (a-z)');
  }
  
  if (!requirements.hasNumbers) {
    feedback.push('Add numbers (0-9)');
  }
  
  if (!requirements.hasSpecialChars) {
    feedback.push('Add special characters (!@#$%^&*)');
  }
  
  if (!requirements.notCommon) {
    feedback.push('Avoid common passwords');
  }

  if (hasSequentialChars(password)) {
    feedback.push('Avoid sequential characters (123, abc)');
  }
  
  if (hasRepeatedChars(password)) {
    feedback.push('Avoid repeated characters (aaa, 111)');
  }
  
  if (hasKeyboardPatterns(password)) {
    feedback.push('Avoid keyboard patterns (qwerty, asdf)');
  }

  if (password.length < 12) {
    feedback.push('Consider using 12+ characters for better security');
  }

  if (strength === 'strong' && feedback.length === 0) {
    feedback.push('Excellent! This is a strong password');
  } else if (strength === 'medium' && feedback.length <= 2) {
    feedback.push('Good password strength - consider the suggestions above');
  }

  return feedback;
}