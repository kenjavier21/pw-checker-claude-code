<template>
  <div id="app">
    <div class="container">
      <h1>Password Strength Checker</h1>
      <PasswordChecker />
    </div>
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

<style>
#app {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  text-align: center;
  color: #1a1a1a;
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding: 24px 0;
}

.container {
  max-width: 640px;
  margin: 0 auto;
  padding: 0 20px;
}

@media (max-width: 768px) {
  .container {
    padding: 0 16px;
  }
}

@media (max-width: 480px) {
  #app {
    padding: 16px 0;
  }
  
  .container {
    padding: 0 12px;
  }
}

h1 {
  background: linear-gradient(135deg, #6366f1, #8b5cf6, #a855f7);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 40px;
  font-size: 2.5rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1.2;
}

@media (max-width: 768px) {
  h1 {
    font-size: 2.2rem;
    margin-bottom: 32px;
  }
}

@media (max-width: 480px) {
  h1 {
    font-size: 1.8rem;
    margin-bottom: 24px;
  }
}
</style>