<template>
  <div>
    <LoginForm @show-message="showWelcomeMessage" />

    <!-- Mensagem de boas-vindas com ícone e classe dinâmicos -->
    <div v-if="welcomeMessage" :class="welcomeClass" class="message-container">
      <i :class="welcomeIconClass"></i>
      <span>{{ welcomeMessage }}</span>
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
      // Define a mensagem, classe e ícone com base no tipo da mensagem
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
/* Estilo da mensagem de boas-vindas */
.welcome-message {
  display: flex;
  align-items: center;
  padding: 10px;
  margin-top: 20px;
  border-radius: 5px;
  font-size: 1.2em;
}

.welcome-message.success {
  color: #4CAF50;
  background-color: #E8F5E9;
}

.welcome-message.error {
  color: #F44336;
  background-color: #FFEBEE;
}

.message-container i {
  margin-right: 8px;
}

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
