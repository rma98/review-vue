<!-- Register.vue -->
<template>
  <div class="register-page">
    <RegisterForm :onSubmit="registerUser" />
    <p v-if="message" :class="{'success-message': success, 'error-message': !success}">
      {{ message }}
    </p>
  </div>
</template>

<script>
import RegisterForm from "../components/RegisterForm.vue";
import axios from "axios";

export default {
  components: {
    RegisterForm,
  },
  data() {
    return {
      message: "",
      success: false,
    };
  },
  methods: {
    async registerUser(formData) {
      try {
        const response = await axios.post("http://localhost:8080/api/usuarios", formData);
        if (response.status === 201) {
          this.success = true;
          this.message = "Usuário cadastrado com sucesso!";
          setTimeout(() => {
            this.$router.push({ path: '/login' }); // Redireciona para a página de login
          }, 2000);
        }
      } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
          this.message = error.response.data.message; // Mensagem de erro detalhada
        } else {
          this.message = "Erro ao cadastrar o usuário. Tente novamente.";
        }
        this.success = false; // Marca a mensagem como erro
        console.error(error);
      }
    },
  },
};
</script>

<style scoped>
.success-message {
  color: green;
  animation: slideDown 0.3s ease-in-out;
}

.error-message {
  color: red;
  animation: slideDown 0.3s ease-in-out;
}

/* Animação para feedback visual */
@keyframes slideDown {
  from {
    transform: translateY(-10px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
