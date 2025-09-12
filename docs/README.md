# Password Strength Checker Documentation

## Overview

The Password Strength Checker is a comprehensive Vue 3 component that provides real-time password strength analysis, breach detection simulation, and password generation. It offers users a sophisticated interface to create and validate secure passwords.

## Features

- **Real-time Password Strength Analysis**: Evaluates passwords based on multiple criteria
- **Visual Strength Indicators**: Animated progress bars with color-coded strength levels
- **Requirements Tracking**: Clear checklist of password requirements with visual feedback
- **Breach Database Simulation**: Mock breach checking functionality
- **Password Generation**: Automatic generation of strong, readable passwords
- **Accessibility**: Full keyboard navigation and screen reader support
- **Responsive Design**: Mobile-first responsive layout

## Component API

### Props

The `PasswordChecker` component currently doesn't accept any props, making it a self-contained solution.

### Events

The component doesn't emit any custom events but handles all interactions internally.

### Exposed Methods

None - the component is designed to be fully self-contained.

## Installation and Setup

### Prerequisites

- Node.js 16+ 
- Vue 3.4+
- Modern browser with ES6+ support

### Installation

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build

# Run tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### Basic Usage

```vue
<template>
  <div id="app">
    <PasswordChecker />
  </div>
</template>

<script>
import PasswordChecker from './components/PasswordChecker.vue'

export default {
  name: 'App',
  components: {
    PasswordChecker
  }
}
</script>
```

## Password Strength Algorithm

### Scoring System

The password strength is calculated using a points-based system with a maximum score of 8 points:

#### Base Requirements (6 points max)
- **Minimum Length** (1 point): At least 8 characters
- **Uppercase Letters** (1 point): Contains A-Z
- **Lowercase Letters** (1 point): Contains a-z  
- **Numbers** (1 point): Contains 0-9
- **Special Characters** (1 point): Contains `!@#$%^&*()_+-=[]{}|;:'\"\\,.<>?`
- **Not Common Password** (1 point): Not in the common passwords list

#### Length Bonuses (2 points max)
- **12+ Characters** (1 point): Additional security for longer passwords
- **16+ Characters** (1 point): Extra bonus for very long passwords

#### Pattern Penalties (3 points max deduction)
- **Sequential Characters** (-1 point): Patterns like "123", "abc", "qwerty"
- **Repeated Characters** (-1 point): Patterns like "aaa", "111"  
- **Keyboard Patterns** (-1 point): Common keyboard sequences

### Strength Levels

- **Weak**: 0-3 points (Red indicator)
- **Medium**: 4-6 points (Orange indicator)
- **Strong**: 7-8 points (Green indicator)

### Example Calculations

```javascript
// Weak password example
checkPasswordStrength('password') 
// Score: 1 (length) + 0 (no uppercase) + 1 (lowercase) + 0 (no numbers) 
//        + 0 (no special) + 0 (common) = 2 points → WEAK

// Medium password example  
checkPasswordStrength('Password123!')
// Score: 1 (length) + 1 (uppercase) + 1 (lowercase) + 1 (numbers)
//        + 1 (special) + 1 (not common) - 1 (sequential "123") = 5 points → MEDIUM

// Strong password example
checkPasswordStrength('MyVerySecurePasswordWithoutPatterns849@')
// Score: 1 (length) + 1 (uppercase) + 1 (lowercase) + 1 (numbers)
//        + 1 (special) + 1 (not common) + 1 (12+ chars) + 1 (16+ chars) = 8 points → STRONG
```

## Password Strength Utility API

### `checkPasswordStrength(password: string)`

**Parameters:**
- `password` (string): The password to analyze

**Returns:**
```typescript
{
  strength: 'weak' | 'medium' | 'strong',
  score: number, // 0-8
  feedback: string[], // Array of improvement suggestions
  requirements: {
    minLength: boolean,
    hasUppercase: boolean,
    hasLowercase: boolean,
    hasNumbers: boolean,
    hasSpecialChars: boolean,
    notCommon: boolean
  }
}
```

**Example Usage:**
```javascript
import { checkPasswordStrength } from './utils/passwordStrength.js'

const result = checkPasswordStrength('MyPassword123!')
console.log(result.strength) // 'medium'
console.log(result.score) // 6
console.log(result.feedback) // ['Avoid sequential characters (123, abc)', ...]
```

## Component Structure

### Template Structure

```html
<div class="password-checker">
  <!-- Input Section -->
  <div class="input-container">
    <label for="password">Enter Password:</label>
    <div class="password-field">
      <input class="password-input" />
      <button class="toggle-password" />
    </div>
  </div>
  
  <!-- Strength Indicator -->
  <div class="strength-indicator">
    <div class="strength-label">Password Strength:</div>
    <div class="strength-bar">
      <div class="strength-fill" />
    </div>
    <div class="strength-text" />
  </div>
  
  <!-- Breach Check -->
  <div class="breach-check">
    <div class="breach-status" />
  </div>
  
  <!-- Requirements -->
  <div class="requirements">
    <ul><!-- Requirement items --></ul>
  </div>
  
  <!-- Feedback -->
  <div class="feedback">
    <ul><!-- Feedback items --></ul>
  </div>
  
  <!-- Password Generator -->
  <div class="password-generator">
    <!-- Generated password suggestions -->
  </div>
</div>
```

### CSS Classes

#### Layout Classes
- `.password-checker` - Main container
- `.input-container` - Password input wrapper
- `.password-field` - Input field with toggle button
- `.strength-indicator` - Strength visualization container
- `.requirements` - Requirements checklist container
- `.feedback` - Feedback suggestions container
- `.password-generator` - Password generation section

#### State Classes
- `.weak` - Applied to weak strength elements (red)
- `.medium` - Applied to medium strength elements (orange)  
- `.strong` - Applied to strong strength elements (green)
- `.met` - Applied to satisfied requirements (green checkmark)
- `.checking` - Applied during breach check loading
- `.safe` - Applied when password not found in breaches
- `.breach` - Applied when password found in breach database

## Breach Detection Simulation

The component includes a simulated breach detection system that mimics real-world password breach checking:

### Simulation Logic

```javascript
// Passwords flagged as breached:
// 1. Common passwords: 'password', '123456', 'qwerty', etc.
// 2. Sequential patterns: contains '123', '234', '345', etc.
// 3. Repeated characters: contains 'aaa', '111', etc.  
// 4. Random chance: 20% probability for passwords < 12 characters
```

### Breach Status States

- **Checking**: Initial loading state with animated dots
- **Safe**: Password not found in simulated breach database (green)
- **Breach**: Password found in simulated breach database (red with warning)

## Testing

### Test Coverage

The project includes comprehensive test suites covering:

#### Password Strength Logic Tests (`tests/passwordStrength.test.js`)
- ✅ Basic requirement detection (55+ test cases)
- ✅ Strength level classification
- ✅ Pattern detection (sequential, repeated, keyboard)
- ✅ Length bonuses and penalties
- ✅ Feedback generation
- ✅ Edge cases (empty passwords, very long passwords)
- ✅ Performance validation

#### Vue Component Tests (`tests/PasswordChecker.test.js`)
- ✅ Component mounting and initialization
- ✅ Password input and reactivity
- ✅ Visibility toggle functionality
- ✅ Strength indicator updates
- ✅ Requirements display and state changes
- ✅ Feedback rendering
- ✅ Password generation features
- ✅ Breach check display states
- ✅ Accessibility features
- ✅ State management

### Running Tests

```bash
# Run all tests
npm test

# Run with coverage report
npm run test:coverage

# Run in watch mode for development
npm run test:watch

# Run specific test file
npx jest tests/passwordStrength.test.js
```

### Test Environment Setup

The project uses:
- **Jest** for test running and assertions
- **Vue Test Utils** for Vue component testing
- **jsdom** for DOM simulation
- **Babel** for ES6+ transpilation in tests

## Customization

### Styling Customization

The component uses scoped CSS with CSS custom properties for easy theming:

```css
.password-checker {
  /* Color scheme variables */
  --weak-color: #ef4444;
  --medium-color: #f59e0b; 
  --strong-color: #10b981;
  --background-color: #ffffff;
  --border-color: #e8e8e8;
  
  /* Spacing variables */
  --spacing-sm: 12px;
  --spacing-md: 24px;
  --spacing-lg: 32px;
}
```

### Password Generation Customization

Modify the generation logic in the component:

```javascript
// Customize character sets
const lowercase = 'abcdefghijklmnopqrstuvwxyz'
const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'  
const numbers = '0123456789'
const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?'

// Customize readable word lists
const words = ['Moon', 'Star', 'Sun', ...] // Add your own words
```

### Requirements Customization

Modify the password requirements in `passwordStrength.js`:

```javascript
// Adjust minimum length
const minLength = 8; // Change to desired minimum

// Modify special character set
const specialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>?]/;

// Update common passwords list
const COMMON_PASSWORDS = [
  // Add or remove common passwords
];
```

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

### Required Features
- ES6+ JavaScript support
- CSS Grid and Flexbox
- CSS Custom Properties
- Vue 3 Composition API

## Performance Considerations

### Optimization Features
- **Debounced breach checking**: Prevents excessive API simulation calls
- **Computed properties**: Efficient reactive updates
- **CSS animations**: Hardware-accelerated transforms
- **Scoped styles**: Prevents style conflicts
- **Tree-shakable imports**: Reduces bundle size

### Memory Management
- Proper cleanup of timeouts
- Efficient reactive state management
- Minimal DOM manipulations

## Accessibility Features

### Keyboard Navigation
- Tab navigation through all interactive elements
- Enter/Space activation for buttons
- Escape key dismissal for suggestions

### Screen Reader Support
- Semantic HTML structure
- ARIA labels for interactive elements
- Live regions for dynamic content updates
- Descriptive form labels

### Visual Accessibility  
- High contrast color schemes
- Scalable text and interfaces
- Focus indicators
- Color-independent status indicators

## Security Considerations

### Client-Side Only
This implementation is for UI/UX purposes only. For production applications:

- **Never store passwords** in client-side code
- **Use HTTPS** for all password-related communications
- **Implement server-side validation** for all security checks
- **Use proper authentication** and session management
- **Follow OWASP guidelines** for password security

### Simulated Breach Checking
The breach checking is simulated and should be replaced with real services like:
- Have I Been Pwned API
- Custom breach databases
- Enterprise security services

## Troubleshooting

### Common Issues

**Tests not running:**
```bash
# Clear Jest cache
npx jest --clearCache

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

**Component not displaying:**
- Check Vue version compatibility (3.4+)
- Verify proper component registration
- Check browser console for errors

**Styles not loading:**
- Ensure scoped styles are supported
- Check for CSS conflicts
- Verify viewport meta tag

### Development Tips

1. Use Vue DevTools for debugging reactive state
2. Test with various password patterns
3. Verify accessibility with screen readers
4. Test on multiple devices and browsers
5. Monitor performance with browser dev tools

## Contributing

When contributing to this component:

1. Follow the existing code style
2. Add tests for new features
3. Update documentation for API changes
4. Ensure accessibility compliance
5. Test across supported browsers

## License

This component is part of the Password Strength Checker application and follows the project's licensing terms.