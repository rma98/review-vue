<template>
  <div class="form-container">
    <form @submit.prevent="handleSubmit">
      <div class="header">
        <i class="fas fa-sign-in-alt"></i>
        <h2>Login</h2>
      </div>
      <div class="input-group">
        <label for="email"><i class="fas fa-envelope"></i> Email</label>
        <input
          type="email"
          v-model="credentials.email"
          placeholder="Digite seu email"
          required
        />
      </div>
      <div class="input-group">
        <label for="password"><i class="fas fa-lock"></i> Senha</label>
        <input
          type="password"
          v-model="credentials.senha"
          placeholder="Digite sua senha"
          required
        />
      </div>
      <button type="submit" class="btn">Entrar</button>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    </form>
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
</style>
