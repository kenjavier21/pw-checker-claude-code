import { mount } from '@vue/test-utils';
import PasswordChecker from '../src/components/PasswordChecker.vue';

// Mock the passwordStrength utility
jest.mock('../src/utils/passwordStrength.js', () => ({
  checkPasswordStrength: jest.fn()
}));

import { checkPasswordStrength } from '../src/utils/passwordStrength.js';

describe('PasswordChecker Component', () => {
  let wrapper;

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    
    // Default mock implementation
    checkPasswordStrength.mockReturnValue({
      strength: 'weak',
      score: 2,
      feedback: ['Add uppercase letters (A-Z)'],
      requirements: {
        minLength: true,
        hasUppercase: false,
        hasLowercase: true,
        hasNumbers: true,
        hasSpecialChars: false,
        notCommon: true
      }
    });
  });

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
    }
  });

  describe('Component Mounting', () => {
    test('should mount successfully', () => {
      wrapper = mount(PasswordChecker);
      expect(wrapper.exists()).toBe(true);
    });

    test('should have initial empty password', () => {
      wrapper = mount(PasswordChecker);
      const input = wrapper.find('.password-input');
      expect(input.element.value).toBe('');
    });

    test('should have password hidden initially', () => {
      wrapper = mount(PasswordChecker);
      const input = wrapper.find('.password-input');
      expect(input.attributes('type')).toBe('password');
    });
  });

  describe('Password Input', () => {
    test('should update password value on input', async () => {
      wrapper = mount(PasswordChecker);
      const input = wrapper.find('.password-input');
      
      await input.setValue('testpassword');
      expect(input.element.value).toBe('testpassword');
    });

    test('should call checkPasswordStrength when password changes', async () => {
      wrapper = mount(PasswordChecker);
      const input = wrapper.find('.password-input');
      
      await input.setValue('testpassword');
      
      expect(checkPasswordStrength).toHaveBeenCalledWith('testpassword');
    });

    test('should trigger input event and call checkStrength', async () => {
      wrapper = mount(PasswordChecker);
      const input = wrapper.find('.password-input');
      
      await input.trigger('input');
      
      // Since input is initially empty, checkPasswordStrength shouldn't be called
      // but the method should handle it gracefully
      expect(wrapper.vm.password).toBeDefined();
    });
  });

  describe('Password Visibility Toggle', () => {
    test('should toggle password visibility', async () => {
      wrapper = mount(PasswordChecker);
      const toggleButton = wrapper.find('.toggle-password');
      const input = wrapper.find('.password-input');
      
      expect(input.attributes('type')).toBe('password');
      
      await toggleButton.trigger('click');
      expect(input.attributes('type')).toBe('text');
      
      await toggleButton.trigger('click');
      expect(input.attributes('type')).toBe('password');
    });

    test('should update eye icon when toggling visibility', async () => {
      wrapper = mount(PasswordChecker);
      const toggleButton = wrapper.find('.toggle-password');
      const eyeIcon = wrapper.find('.eye-icon');
      
      expect(eyeIcon.text()).toBe('🙈');
      
      await toggleButton.trigger('click');
      expect(eyeIcon.text()).toBe('👁️');
    });

    test('should update aria-label when toggling visibility', async () => {
      wrapper = mount(PasswordChecker);
      const toggleButton = wrapper.find('.toggle-password');
      
      expect(toggleButton.attributes('aria-label')).toBe('Show password');
      
      await toggleButton.trigger('click');
      expect(toggleButton.attributes('aria-label')).toBe('Hide password');
    });
  });

  describe('Strength Indicator', () => {
    test('should display strength text correctly', async () => {
      checkPasswordStrength.mockReturnValue({
        strength: 'strong',
        score: 7,
        feedback: [],
        requirements: {
          minLength: true,
          hasUppercase: true,
          hasLowercase: true,
          hasNumbers: true,
          hasSpecialChars: true,
          notCommon: true
        }
      });

      wrapper = mount(PasswordChecker);
      const input = wrapper.find('.password-input');
      
      await input.setValue('StrongPassword123!');
      await wrapper.vm.$nextTick();
      
      const strengthText = wrapper.find('.strength-text');
      expect(strengthText.text()).toBe('Strong');
    });

    test('should apply correct CSS class for strength level', async () => {
      checkPasswordStrength.mockReturnValue({
        strength: 'medium',
        score: 5,
        feedback: [],
        requirements: {
          minLength: true,
          hasUppercase: true,
          hasLowercase: true,
          hasNumbers: true,
          hasSpecialChars: false,
          notCommon: true
        }
      });

      wrapper = mount(PasswordChecker);
      const input = wrapper.find('.password-input');
      
      await input.setValue('MediumPassword123');
      await wrapper.vm.$nextTick();
      
      const strengthFill = wrapper.find('.strength-fill');
      const strengthText = wrapper.find('.strength-text');
      
      expect(strengthFill.classes()).toContain('medium');
      expect(strengthText.classes()).toContain('medium');
    });

    test('should calculate strength percentage correctly', async () => {
      checkPasswordStrength.mockReturnValue({
        strength: 'medium',
        score: 4,
        feedback: [],
        requirements: {
          minLength: true,
          hasUppercase: true,
          hasLowercase: true,
          hasNumbers: true,
          hasSpecialChars: false,
          notCommon: true
        }
      });

      wrapper = mount(PasswordChecker);
      const input = wrapper.find('.password-input');
      
      await input.setValue('Password123');
      await wrapper.vm.$nextTick();
      
      const strengthFill = wrapper.find('.strength-fill');
      // Score 4 out of 8 max = 50%
      expect(strengthFill.attributes('style')).toContain('width: 50%');
    });
  });

  describe('Requirements Display', () => {
    test('should show requirements when password is entered', async () => {
      wrapper = mount(PasswordChecker);
      const input = wrapper.find('.password-input');
      
      // Initially no requirements shown
      expect(wrapper.find('.requirements').exists()).toBe(false);
      
      await input.setValue('password');
      await wrapper.vm.$nextTick();
      
      expect(wrapper.find('.requirements').exists()).toBe(true);
    });

    test('should display all requirement items', async () => {
      wrapper = mount(PasswordChecker);
      const input = wrapper.find('.password-input');
      
      await input.setValue('password');
      await wrapper.vm.$nextTick();
      
      const requirements = wrapper.findAll('.requirements li');
      expect(requirements).toHaveLength(6); // All requirement items
    });

    test('should mark met requirements correctly', async () => {
      checkPasswordStrength.mockReturnValue({
        strength: 'medium',
        score: 4,
        feedback: [],
        requirements: {
          minLength: true,
          hasUppercase: false,
          hasLowercase: true,
          hasNumbers: true,
          hasSpecialChars: false,
          notCommon: true
        }
      });

      wrapper = mount(PasswordChecker);
      const input = wrapper.find('.password-input');
      
      await input.setValue('password123');
      await wrapper.vm.$nextTick();
      
      const requirements = wrapper.findAll('.requirements li');
      
      // Check that met requirements have the 'met' class
      expect(requirements[0].classes()).toContain('met'); // minLength
      expect(requirements[1].classes()).not.toContain('met'); // hasUppercase
      expect(requirements[2].classes()).toContain('met'); // hasLowercase
      expect(requirements[3].classes()).toContain('met'); // hasNumbers
      expect(requirements[4].classes()).not.toContain('met'); // hasSpecialChars
      expect(requirements[5].classes()).toContain('met'); // notCommon
    });

    test('should show correct checkmarks for met requirements', async () => {
      checkPasswordStrength.mockReturnValue({
        strength: 'medium',
        score: 4,
        feedback: [],
        requirements: {
          minLength: true,
          hasUppercase: false,
          hasLowercase: true,
          hasNumbers: true,
          hasSpecialChars: false,
          notCommon: true
        }
      });

      wrapper = mount(PasswordChecker);
      const input = wrapper.find('.password-input');
      
      await input.setValue('password123');
      await wrapper.vm.$nextTick();
      
      const checkmarks = wrapper.findAll('.requirements .check');
      
      expect(checkmarks[0].text()).toBe('✓'); // minLength met
      expect(checkmarks[1].text()).toBe('✗'); // hasUppercase not met
      expect(checkmarks[2].text()).toBe('✓'); // hasLowercase met
      expect(checkmarks[3].text()).toBe('✓'); // hasNumbers met
      expect(checkmarks[4].text()).toBe('✗'); // hasSpecialChars not met
      expect(checkmarks[5].text()).toBe('✓'); // notCommon met
    });
  });

  describe('Feedback Display', () => {
    test('should show feedback when available', async () => {
      checkPasswordStrength.mockReturnValue({
        strength: 'weak',
        score: 2,
        feedback: ['Add uppercase letters (A-Z)', 'Add special characters (!@#$%^&*)'],
        requirements: {
          minLength: true,
          hasUppercase: false,
          hasLowercase: true,
          hasNumbers: true,
          hasSpecialChars: false,
          notCommon: true
        }
      });

      wrapper = mount(PasswordChecker);
      const input = wrapper.find('.password-input');
      
      await input.setValue('password123');
      await wrapper.vm.$nextTick();
      
      const feedback = wrapper.find('.feedback');
      expect(feedback.exists()).toBe(true);
      
      const feedbackItems = wrapper.findAll('.feedback li');
      expect(feedbackItems).toHaveLength(2);
      expect(feedbackItems[0].text()).toBe('Add uppercase letters (A-Z)');
      expect(feedbackItems[1].text()).toBe('Add special characters (!@#$%^&*)');
    });

    test('should not show feedback section when no feedback available', async () => {
      checkPasswordStrength.mockReturnValue({
        strength: 'strong',
        score: 8,
        feedback: [],
        requirements: {
          minLength: true,
          hasUppercase: true,
          hasLowercase: true,
          hasNumbers: true,
          hasSpecialChars: true,
          notCommon: true
        }
      });

      wrapper = mount(PasswordChecker);
      const input = wrapper.find('.password-input');
      
      await input.setValue('StrongPassword123!');
      await wrapper.vm.$nextTick();
      
      const feedback = wrapper.find('.feedback');
      expect(feedback.exists()).toBe(false);
    });
  });

  describe('Password Generation', () => {
    test('should show password generator for non-strong passwords', async () => {
      checkPasswordStrength.mockReturnValue({
        strength: 'weak',
        score: 2,
        feedback: ['Add uppercase letters (A-Z)'],
        requirements: {
          minLength: true,
          hasUppercase: false,
          hasLowercase: true,
          hasNumbers: true,
          hasSpecialChars: false,
          notCommon: true
        }
      });

      wrapper = mount(PasswordChecker);
      const input = wrapper.find('.password-input');
      
      await input.setValue('password123');
      await wrapper.vm.$nextTick();
      
      const generator = wrapper.find('.password-generator');
      expect(generator.exists()).toBe(true);
    });

    test('should not show password generator for strong passwords', async () => {
      checkPasswordStrength.mockReturnValue({
        strength: 'strong',
        score: 8,
        feedback: [],
        requirements: {
          minLength: true,
          hasUppercase: true,
          hasLowercase: true,
          hasNumbers: true,
          hasSpecialChars: true,
          notCommon: true
        }
      });

      wrapper = mount(PasswordChecker);
      const input = wrapper.find('.password-input');
      
      await input.setValue('StrongPassword123!');
      await wrapper.vm.$nextTick();
      
      const generator = wrapper.find('.password-generator');
      expect(generator.exists()).toBe(false);
    });

    test('should generate and display suggested passwords', async () => {
      wrapper = mount(PasswordChecker);
      const input = wrapper.find('.password-input');
      
      await input.setValue('weak');
      await wrapper.vm.$nextTick();
      
      const suggestions = wrapper.findAll('.password-suggestion');
      expect(suggestions.length).toBeGreaterThan(0);
    });

    test('should use generated password when clicking "Use This" button', async () => {
      wrapper = mount(PasswordChecker);
      const input = wrapper.find('.password-input');
      
      await input.setValue('weak');
      await wrapper.vm.$nextTick();
      
      const useButton = wrapper.find('.use-password-btn');
      await useButton.trigger('click');
      
      // Password should be updated
      expect(wrapper.vm.password).not.toBe('weak');
      expect(wrapper.vm.password.length).toBeGreaterThan(0);
    });

    test('should generate more passwords when clicking "Generate More"', async () => {
      wrapper = mount(PasswordChecker);
      const input = wrapper.find('.password-input');
      
      await input.setValue('weak');
      await wrapper.vm.$nextTick();
      
      const initialPasswords = wrapper.vm.generatedPasswords;
      const generateButton = wrapper.find('.generate-more-btn');
      
      await generateButton.trigger('click');
      await wrapper.vm.$nextTick();
      
      const newPasswords = wrapper.vm.generatedPasswords;
      expect(newPasswords).not.toEqual(initialPasswords);
    });
  });

  describe('Breach Check Display', () => {
    test('should show breach check when password is entered', async () => {
      wrapper = mount(PasswordChecker);
      const input = wrapper.find('.password-input');
      
      expect(wrapper.find('.breach-check').exists()).toBe(false);
      
      await input.setValue('password');
      await wrapper.vm.$nextTick();
      
      expect(wrapper.find('.breach-check').exists()).toBe(true);
    });

    test('should display checking state initially', async () => {
      wrapper = mount(PasswordChecker);
      const input = wrapper.find('.password-input');
      
      await input.setValue('password');
      await wrapper.vm.$nextTick();
      
      const breachStatus = wrapper.find('.breach-status');
      expect(breachStatus.classes()).toContain('checking');
      expect(breachStatus.text()).toContain('Checking breach databases...');
    });

    test('should show loading dots during breach check', async () => {
      wrapper = mount(PasswordChecker);
      const input = wrapper.find('.password-input');
      
      await input.setValue('password');
      await wrapper.vm.$nextTick();
      
      const loadingDots = wrapper.find('.loading-dots');
      expect(loadingDots.exists()).toBe(true);
    });
  });

  describe('Accessibility', () => {
    test('should have proper labels', () => {
      wrapper = mount(PasswordChecker);
      
      const label = wrapper.find('label[for="password"]');
      const input = wrapper.find('#password');
      
      expect(label.exists()).toBe(true);
      expect(input.exists()).toBe(true);
      expect(label.text()).toBe('Enter Password:');
    });

    test('should have proper aria-label for toggle button', () => {
      wrapper = mount(PasswordChecker);
      const toggleButton = wrapper.find('.toggle-password');
      
      expect(toggleButton.attributes('aria-label')).toBeDefined();
    });
  });

  describe('Component State Management', () => {
    test('should maintain reactive state correctly', async () => {
      wrapper = mount(PasswordChecker);
      
      // Test that reactive properties work as expected
      expect(wrapper.vm.password).toBe('');
      expect(wrapper.vm.showPassword).toBe(false);
      expect(wrapper.vm.generatedPasswords).toBeDefined();
      expect(wrapper.vm.breachStatus).toBeDefined();
    });

    test('should handle multiple rapid password changes', async () => {
      wrapper = mount(PasswordChecker);
      const input = wrapper.find('.password-input');
      
      // Simulate rapid typing
      await input.setValue('p');
      await input.setValue('pa');
      await input.setValue('pas');
      await input.setValue('pass');
      await input.setValue('password');
      
      expect(wrapper.vm.password).toBe('password');
    });
  });
});