<template>
  <div class="login-container">
    <div class="form-wrapper">
      <form @submit.prevent="handleSubmit" class="form">
        <div class="header">
          <i class="fas fa-sign-in-alt"></i>
          <h2>Login</h2>
        </div>
        <div class="input-group">
          <label for="email"><i class="fas fa-envelope"></i> Email</label>
          <input type="email" v-model="credentials.email" @input="validateEmail" placeholder="Digite seu email"
            required />
          <p v-if="errors.email" class="error-message">{{ errors.email }}</p>
        </div>
        <div class="input-group">
          <label for="password"><i class="fas fa-lock"></i> Senha</label>
          <input type="password" v-model="credentials.senha" @input="validatePassword" placeholder="Digite sua senha"
            required />
          <p v-if="errors.senha" class="error-message">{{ errors.senha }}</p>
        </div>
        <div class="forgot-password">
          <router-link to="/esqueceu-senha">Esqueceu sua senha?</router-link>
        </div>
        <button :disabled="isFormInvalid" type="submit" class="btn">
          Entrar
        </button>
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        <p class="redirect-register">
          Não possui uma conta?
          <router-link to="/register" class="link">Cadastre-se.</router-link>
        </p>
      </form>
    </div>
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
      errors: {
        email: null,
        senha: null,
      },
      errorMessage: "",
      welcomeMessage: "",
      welcomeClass: "",
      welcomeIconClass: "",
    };
  },
  computed: {
    isFormInvalid() {
      return this.errors.email || this.errors.senha;
    },
  },
  methods: {
    validateEmail() {
      const email = this.credentials.email;
      if (!email) {
        this.errors.email = "O email é obrigatório.";
      } else if (!/\S+@\S+\.\S+/.test(email)) {
        this.errors.email = "O formato do email é inválido.";
      } else {
        this.errors.email = null;
      }
    },
    validatePassword() {
      const senha = this.credentials.senha;
      if (!senha) {
        this.errors.senha = "A senha é obrigatória.";
      } else if (senha.length < 8) {
        this.errors.senha =
          "A senha deve conter pelo menos uma letra, um número e um caractere especial.";
      } else if (!/[A-Za-z]/.test(senha) || !/\d/.test(senha)) {
        this.errors.senha =
          "A senha deve conter pelo menos uma letra, um número e um caractere especial.";
      } else {
        this.errors.senha = null;
      }
    },
    async handleSubmit() {
      this.validateEmail();
      this.validatePassword();

      if (this.isFormInvalid) return;

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
          if (response.status === 401 || response.status === 403) {
            throw new Error("Email ou senha inválidos.");
          }
          throw new Error("Falha no login. Tente novamente.");
        }

        const data = await response.json();
        const usuario = data.usuario;

        this.$store.dispatch("login", {
          name: usuario.nome,
          role: usuario.tipo,
          email: this.credentials.email,
        });

        this.showWelcomeMessage(
          `Bem-vindo ${usuario.tipo} ${usuario.nome}!`,
          "success"
        );

        setTimeout(() => {
          this.$router.push("/"); // Redireciona para a página inicial
        }, 2000);
      } catch (error) {
        this.errorMessage = error.message;
        this.showWelcomeMessage(this.errorMessage, "error");
      }
    },
    showWelcomeMessage(message, type) {
      this.welcomeMessage = message;
      this.welcomeClass = `welcome-message ${type}`;
      this.welcomeIconClass =
        type === "success" ? "fas fa-check-circle" : "fas fa-exclamation-circle";

      setTimeout(() => {
        this.welcomeMessage = "";
      }, 3000);
    },
  },
};
</script>

<style scoped>
/* Base */
body {
  font-family: 'Arial', sans-serif;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* Layout Principal */
.login-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  height: 100vh;
  background: linear-gradient(135deg, #4a90e2 0%, #f9f9f9 60%, #ccc 100%);
}

/* Formulário */
.form-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px;
  background: linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
}

.form-wrapper form {
  width: 100%;
  max-width: 400px;
  padding: 30px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Header */
.header {
  text-align: center;
  margin-bottom: 20px;
}

.header i {
  font-size: 2.5rem;
  color: #4a90e2;
}

.header h2 {
  font-size: 2rem;
  color: #333;
}

/* Inputs */
.input-group {
  margin-bottom: 20px;
}

.input-group label {
  font-size: 1rem;
  color: #333;
}

.input-group input {
  width: 100%;
  padding: 12px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.input-group input:focus {
  outline: none;
  border-color: #4a90e2;
  box-shadow: 0 0 5px rgba(74, 144, 226, 0.5);
}

/* Botão */
.btn {
  width: 100%;
  padding: 12px;
  font-size: 1rem;
  background-color: #4a90e2;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn:hover {
  background-color: #357abd;
}

/* Links */
.forgot-password {
  text-align: right;
  margin-bottom: 20px;
}

.forgot-password a {
  color: #007bff;
  text-decoration: none;
  font-size: 0.9rem;
}

.forgot-password a:hover {
  text-decoration: underline;
}

.redirect-register {
  text-align: center;
  font-size: 0.9rem;
}

.redirect-register .link {
  color: #007bff;
  font-weight: bold;
}

.redirect-register .link:hover {
  text-decoration: underline;
}

/* Vídeo */
.video-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
}

.video-wrapper video {
  width: 100%;
  height: auto;
  border-radius: 10px;
  object-fit: cover;
}

/* Mensagem de boas-vindas */
.welcome-message {
  display: flex;
  align-items: center;
  padding: 15px;
  margin-top: 20px;
  border-radius: 5px;
  font-size: 1.2rem;
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
  margin-right: 10px;
}

/* Animação */
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
  }

  .video-wrapper {
    height: 40vh;
  }
}

@media (max-width: 480px) {
  .form-wrapper form {
    padding: 20px;
  }

  .video-wrapper {
    height: 30vh;
  }
}
</style>
