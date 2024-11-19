<template>
  <div class="login-container">
    <!-- Campos do formulário -->
    <div class="form-wrapper">
      <form @submit.prevent="handleSubmit">
        <div class="header">
          <i class="fas fa-sign-in-alt"></i>
          <h2>Login</h2>
        </div>
        <div class="input-group">
          <label for="email"><i class="fas fa-envelope"></i> Email</label>
          <input type="email" v-model="credentials.email" placeholder="Digite seu email" required />
        </div>
        <div class="input-group">
          <label for="password"><i class="fas fa-lock"></i> Senha</label>
          <input type="password" v-model="credentials.senha" placeholder="Digite sua senha" required />
        </div>
        <button type="submit" class="btn">Entrar</button>
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      </form>
    </div>

    <!-- Vídeo à direita -->
    <div class="video-wrapper">
      <video autoplay loop muted>
        <source src="../assets/video/Setup.mp4" type="video/mp4" />
        Seu navegador não suporta o vídeo.
      </video>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      credentials: {
        email: "",
        senha: "",
      },
      errorMessage: "",
    };
  },
  methods: {
    async handleSubmit() {
      try {
        const response = await fetch(
          "http://localhost:8080/api/usuarios/login",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(this.credentials),
          }
        );

        if (!response.ok) {
          throw new Error("Falha no login");
        }

        const data = await response.json();
        const usuario = data.usuario;

        // Armazenar informações no Vuex
        this.$store.dispatch("login", {
          name: usuario.nome,
          role: usuario.tipo,
          email: this.credentials.email,
        });

        // Exibe a mensagem de boas-vindas
        this.$emit(
          "show-message",
          `Bem-vindo ${usuario.tipo} ${usuario.nome}!`,
          "success"
        );

        // Redireciona após 2 segundos
        setTimeout(() => {
          this.$router.push("/"); // Redireciona para a página inicial ou dashboard
        }, 2000);
      } catch (error) {
        this.errorMessage = `Erro: ${error.message}`;
        this.$emit("show-message", this.errorMessage, "error");
      }
    },
  },
};
</script>

<style scoped>
/* Layout principal */
.login-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  /* Campos | Vídeo */
  height: 100vh;
  width: 100%;
  background: linear-gradient(135deg, #388e3c 0%, #f9f9f9 60%, #ccc 100%);
}

.form-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px;
  background: linear-gradient(135deg, #388e3c 0%, #f9f9f9 60%, #ccc 100%);
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.form-wrapper form {
  width: 100%;
  max-width: 400px;
  padding: 20px;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.video-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  background: transparent; /* Para herdar o gradiente do pai */
}

video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
}

/* Mensagem de boas-vindas */
.welcome-message {
  display: flex;
  align-items: center;
  padding: 10px;
  margin-top: 20px;
  border-radius: 5px;
  font-size: 1.2em;
  animation: slideDown 0.5s ease;
}

.welcome-message.success {
  color: #4caf50;
  background-color: #e8f5e9;
}

.welcome-message.error {
  color: #f44336;
  background-color: #ffebee;
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

/* Responsividade */
@media (max-width: 768px) {
  .login-container {
    grid-template-columns: 1fr;
    /* Empilha vídeo e formulário */
  }

  .form-wrapper {
    order: 2;
    /* Coloca o formulário abaixo do vídeo */
  }

  .video-wrapper {
    height: 50vh;
  }
}

@media (max-width: 480px) {
  .form-wrapper form {
    max-width: 300px;
    padding: 15px;
  }
}
</style>