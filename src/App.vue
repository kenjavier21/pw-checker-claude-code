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
  font-family: Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  color: #42b883;
  margin-bottom: 30px;
}
</style>