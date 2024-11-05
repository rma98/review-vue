<template>
  <div class="perfil-page">
    <h2>Perfil do Usuário</h2>
    <div v-if="user">
      <p><strong>Nome:</strong> {{ user.name }}</p>
      <p><strong>Email:</strong> {{ user.email }}</p>
      <p><strong>Tipo:</strong> {{ user.role }}</p>
    </div>
    <div v-else>
      <p>Carregando informações do usuário...</p>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    // Recupera as informações do usuário a partir do Vuex
    user() {
      return this.$store.state.user;
    },
  },
  created() {
    // Redireciona para a página de login se o usuário não estiver autenticado
    if (!this.user || !this.user.email) {
      this.$router.push("/login");
    }
  },
};
</script>

<style scoped>
.perfil-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  font-family: Arial, sans-serif;
  color: #333;
  background-color: #f7f9fc;
  min-height: 100vh;
}

h2 {
  font-size: 1.8em;
  font-weight: bold;
  color: #4a90e2;
  margin-bottom: 20px;
}

p {
  font-size: 1em;
  margin: 5px 0;
  color: #555;
}

strong {
  color: #333;
}

.perfil-page > div {
  background-color: #ffffff;
  border: 1px solid #e0e4e8;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
  text-align: center;
}

@media (max-width: 600px) {
  h2 {
    font-size: 1.6em;
  }

  .perfil-page > div {
    padding: 15px;
  }

  p {
    font-size: 0.95em;
  }
}
</style>