import { checkPasswordStrength } from '../src/utils/passwordStrength.js';

describe('Password Strength Checker', () => {
  describe('Basic Requirements', () => {
    test('should detect minimum length requirement', () => {
      const result1 = checkPasswordStrength('abc123');
      const result2 = checkPasswordStrength('abcdef12');

      expect(result1.requirements.minLength).toBe(false);
      expect(result2.requirements.minLength).toBe(true);
    });

    test('should detect uppercase letters', () => {
      const result1 = checkPasswordStrength('password123');
      const result2 = checkPasswordStrength('Password123');

      expect(result1.requirements.hasUppercase).toBe(false);
      expect(result2.requirements.hasUppercase).toBe(true);
    });

    test('should detect lowercase letters', () => {
      const result1 = checkPasswordStrength('PASSWORD123');
      const result2 = checkPasswordStrength('Password123');

      expect(result1.requirements.hasLowercase).toBe(false);
      expect(result2.requirements.hasLowercase).toBe(true);
    });

    test('should detect numbers', () => {
      const result1 = checkPasswordStrength('Password');
      const result2 = checkPasswordStrength('Password123');

      expect(result1.requirements.hasNumbers).toBe(false);
      expect(result2.requirements.hasNumbers).toBe(true);
    });

    test('should detect special characters', () => {
      const result1 = checkPasswordStrength('Password123');
      const result2 = checkPasswordStrength('Password123!');

      expect(result1.requirements.hasSpecialChars).toBe(false);
      expect(result2.requirements.hasSpecialChars).toBe(true);
    });

    test('should detect common passwords', () => {
      const result1 = checkPasswordStrength('password');
      const result2 = checkPasswordStrength('MyUniquePassword123!');

      expect(result1.requirements.notCommon).toBe(false);
      expect(result2.requirements.notCommon).toBe(true);
    });
  });

  describe('Strength Levels', () => {
    test('should classify weak passwords correctly', () => {
      const weakPasswords = [
        'pass',
        '123456',
        'password',
        'abc123'
      ];

      weakPasswords.forEach(password => {
        const result = checkPasswordStrength(password);
        expect(result.strength).toBe('weak');
        expect(result.score).toBeLessThan(4);
      });
    });

    test('should classify medium strength passwords correctly', () => {
      const mediumPasswords = [
        'Password123!', // Should have sequential chars penalty but meet requirements
        'MyPass1234@', // Sequential numbers penalty  
        'GoodPass111#' // Repeated chars penalty
      ];

      mediumPasswords.forEach(password => {
        const result = checkPasswordStrength(password);
        expect(result.strength).toBe('medium');
        expect(result.score).toBeGreaterThanOrEqual(4);
        expect(result.score).toBeLessThan(7);
      });
    });

    test('should classify strong passwords correctly', () => {
      const strongPasswords = [
        'MyVerySecurePassword123!',
        'Tr0ub4dor&3Complex',
        'SuperSecure2024#Amazing'
      ];

      strongPasswords.forEach(password => {
        const result = checkPasswordStrength(password);
        expect(result.strength).toBe('strong');
        expect(result.score).toBeGreaterThanOrEqual(7);
      });
    });
  });

  describe('Pattern Detection', () => {
    test('should penalize sequential characters', () => {
      const passwordWithSequence = 'Password123456!';
      const passwordWithoutSequence = 'Password139574!';

      const result1 = checkPasswordStrength(passwordWithSequence);
      const result2 = checkPasswordStrength(passwordWithoutSequence);

      expect(result1.score).toBeLessThan(result2.score);
      expect(result1.feedback).toContain('Avoid sequential characters (123, abc)');
    });

    test('should penalize repeated characters', () => {
      const passwordWithRepeated = 'Passwordddd123!';
      const passwordWithoutRepeated = 'Password123!';

      const result1 = checkPasswordStrength(passwordWithRepeated);
      const result2 = checkPasswordStrength(passwordWithoutRepeated);

      expect(result1.score).toBeLessThan(result2.score);
      expect(result1.feedback).toContain('Avoid repeated characters (aaa, 111)');
    });

    test('should penalize keyboard patterns', () => {
      const passwordWithPattern = 'Passwordqwerty123!';
      const passwordWithoutPattern = 'PasswordRandom123!';

      const result1 = checkPasswordStrength(passwordWithPattern);
      const result2 = checkPasswordStrength(passwordWithoutPattern);

      expect(result1.score).toBeLessThan(result2.score);
      expect(result1.feedback).toContain('Avoid keyboard patterns (qwerty, asdf)');
    });
  });

  describe('Length Bonuses', () => {
    test('should give bonus for passwords 12+ characters', () => {
      const shortPassword = 'Pass123!';
      const mediumPassword = 'Password123!';
      const longPassword = 'MyVeryLongPassword123!';

      const result1 = checkPasswordStrength(shortPassword);
      const result2 = checkPasswordStrength(mediumPassword);
      const result3 = checkPasswordStrength(longPassword);

      expect(result2.score).toBeGreaterThan(result1.score);
      expect(result3.score).toBeGreaterThan(result2.score);
    });

    test('should give additional bonus for passwords 16+ characters', () => {
      const mediumPassword = 'Password123!';
      const veryLongPassword = 'MyVeryVeryLongAndSecurePassword123!';

      const result1 = checkPasswordStrength(mediumPassword);
      const result2 = checkPasswordStrength(veryLongPassword);

      expect(result2.score).toBeGreaterThan(result1.score);
    });
  });

  describe('Feedback Generation', () => {
    test('should provide appropriate feedback for missing requirements', () => {
      const result = checkPasswordStrength('short');

      expect(result.feedback).toContain('Password should be at least 8 characters long');
      expect(result.feedback).toContain('Add uppercase letters (A-Z)');
      expect(result.feedback).toContain('Add numbers (0-9)');
      expect(result.feedback).toContain('Add special characters (!@#$%^&*)');
    });

    test('should suggest longer passwords for better security', () => {
      const result = checkPasswordStrength('Pass123!');

      expect(result.feedback).toContain('Consider using 12+ characters for better security');
    });

    test('should provide positive feedback for strong passwords', () => {
      const result = checkPasswordStrength('MyVerySecurePasswordWithoutPatterns849@');

      expect(result.feedback).toContain('Excellent! This is a strong password');
    });

    test('should provide encouraging feedback for medium passwords', () => {
      const result = checkPasswordStrength('Password123!');

      expect(result.feedback.some(feedback => 
        feedback.includes('Good password strength')
      )).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    test('should handle empty password', () => {
      const result = checkPasswordStrength('');

      expect(result.strength).toBe('weak');
      expect(result.score).toBeGreaterThanOrEqual(0);
      expect(result.requirements.minLength).toBe(false);
      expect(result.requirements.notCommon).toBe(true); // Empty string is not common
    });

    test('should handle very long passwords', () => {
      const longPassword = 'A'.repeat(100) + '1!';
      const result = checkPasswordStrength(longPassword);

      expect(result.requirements.minLength).toBe(true);
      expect(result.score).toBeGreaterThan(0);
    });

    test('should handle passwords with only special characters', () => {
      const result = checkPasswordStrength('!@#$%^&*()');

      expect(result.requirements.hasSpecialChars).toBe(true);
      expect(result.requirements.hasUppercase).toBe(false);
      expect(result.requirements.hasLowercase).toBe(false);
      expect(result.requirements.hasNumbers).toBe(false);
    });

    test('should be case insensitive for common password detection', () => {
      const result1 = checkPasswordStrength('PASSWORD');
      const result2 = checkPasswordStrength('Password');
      const result3 = checkPasswordStrength('password');

      expect(result1.requirements.notCommon).toBe(false);
      expect(result2.requirements.notCommon).toBe(false);
      expect(result3.requirements.notCommon).toBe(false);
    });
  });

  describe('Score Validation', () => {
    test('should ensure score never goes below 0', () => {
      const terriblePassword = '111aaa'; // has repeated chars, sequential numbers, no uppercase, etc.
      const result = checkPasswordStrength(terriblePassword);

      expect(result.score).toBeGreaterThanOrEqual(0);
    });

    test('should calculate score correctly for all requirements met', () => {
      const perfectPassword = 'MyVerySecurePassword123!@#';
      const result = checkPasswordStrength(perfectPassword);

      // Base requirements (6) + length 12+ (1) + length 16+ (1) = 8 max
      expect(result.score).toBeLessThanOrEqual(8);
    });
  });

  describe('All Special Characters', () => {
    const specialChars = '!@#$%^&*()_+-=[]{}|;:\'"\\,.<>?';
    
    test('should recognize all defined special characters', () => {
      specialChars.split('').forEach(char => {
        const password = `Password123${char}`;
        const result = checkPasswordStrength(password);
        expect(result.requirements.hasSpecialChars).toBe(true);
      });
    });
  });

  describe('Performance Tests', () => {
    test('should handle multiple password checks efficiently', () => {
      const passwords = [
        'Password123!',
        'AnotherPass456@',
        'ThirdPassword789#',
        'FourthPass000$',
        'FifthPassword111%'
      ];

      const startTime = Date.now();
      passwords.forEach(password => {
        checkPasswordStrength(password);
      });
      const endTime = Date.now();

      // Should complete all checks in under 100ms
      expect(endTime - startTime).toBeLessThan(100);
    });
  });
});