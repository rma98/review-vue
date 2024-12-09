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
        <button :disabled="isFormInvalid" type="submit" class="btn">Entrar</button>
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

        <!-- Link para página de cadastro -->
        <p class="redirect-register">
          Não possui uma conta?
          <router-link to="/register" class="link">Cadastre-se.</router-link>
        </p>
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
      errors: {
        email: null,
        senha: null,
      },
      errorMessage: "",
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
        this.errors.senha = "A senha deve conter pelo menos uma letra, um número e um caractere especial.";
      } else if (!/[A-Za-z]/.test(senha) || !/\d/.test(senha)) {
        this.errors.senha =
          "A senha deve conter pelo menos uma letra, um número e um caractere especial.";
      } else {
        this.errors.senha = null;
      }
    },
    async handleSubmit() {
      // Validar os campos novamente antes de enviar
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
          // Verifica o status de erro para mensagens específicas
          if (response.status === 401 || response.status === 403) {
            throw new Error("Email ou senha inválidos.");
          }
          throw new Error("Falha no login. Tente novamente.");
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
        // Atualiza a mensagem de erro exibida ao usuário
        this.errorMessage = error.message;
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
  background: transparent;
  /* Para herdar o gradiente do pai */
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

.error-message {
  color: red;
  font-size: 1.2rem;
  margin-top: 5px;
}

.forgot-password {
  text-align: right;
  margin: 5px 0 15px;
}

.forgot-password a {
  color: #007bff;
  text-decoration: none;
  font-size: 1.2rem;
}

.forgot-password a:hover {
  text-decoration: underline;
}

.redirect-register {
  text-align: center;
  margin-top: 20px;
  font-size: 14px;
}

.redirect-register .link {
  color: #007bff;
  text-decoration: none;
}

.redirect-register .link:hover {
  text-decoration: underline;
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