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
</style>
