<template>
  <div class="perfil-page">
    <h2>Perfil do Usuário</h2>
    <div v-if="user">
      <p><strong>Nome:</strong> {{ user.nome }}</p>
      <p><strong>Email:</strong> {{ user.email }}</p>
      <p><strong>Tipo:</strong> {{ user.tipo }}</p>
    </div>
    <div v-else>
      <p>Carregando informações do usuário...</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      user: null, // Armazenará os dados do usuário autenticado
    };
  },
  async created() {
    try {
      const token = localStorage.getItem("token");
      const email = localStorage.getItem("userEmail"); // Agora você tem o email armazenado
      if (token && email) {
        const response = await axios.get(`/api/usuarios/perfil?email=${email}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        this.user = response.data;
      } else {
        this.$router.push("/login");
      }
    } catch (error) {
      console.error("Erro ao carregar dados do perfil:", error);
      this.$router.push("/login");
    }
  },
};
</script>

<style scoped>
</style>
