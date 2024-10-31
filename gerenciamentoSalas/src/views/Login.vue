<template>
  <div class="form-container">
    <LoginForm @show-message="showWelcomeMessage" />
    <div v-if="welcomeMessage" :class="welcomeClass" id="welcomeMessage">
      <i :class="welcomeIconClass"></i> {{ welcomeMessage }}
    </div>
  </div>
</template>

<script>
import LoginForm from '../components/LoginForm.vue';

export default {
  components: {
    LoginForm,
  },
  data() {
    return {
      welcomeMessage: '',
      welcomeClass: '',
      welcomeIconClass: '',
    };
  },
  methods: {
    showWelcomeMessage(message, type) {
      this.welcomeMessage = message;
      this.welcomeClass = `welcome-message ${type}`;
      this.welcomeIconClass = type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle';

      // Limpa a mensagem após 3 segundos
      setTimeout(() => {
        this.welcomeMessage = '';
      }, 3000);
    },
  },
};
</script>

<style scoped>
/* Animação de descer */
@keyframes slideDown {
  from {
    transform: translateY(-50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
