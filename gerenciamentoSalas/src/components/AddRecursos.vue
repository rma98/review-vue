<!-- AddRecursos.vue -->
<template>
  <div class="form-container">
    <form @submit.prevent="addRecurso">
      <div class="header">
        <i class="fas fa-plus-circle"></i>
        <h2>Adicionar Recurso</h2>
      </div>
      <label for="nome">Nome do Recurso:</label>
      <input type="text" v-model="nome" required />

      <label for="descricao">Descrição:</label>
      <textarea v-model="descricao"></textarea>

      <button type="submit">Adicionar Recurso</button>
    </form>

    <div
      v-if="message"
      :class="{ 'success-message': isSuccess, 'error-message': !isSuccess }"
    >
      {{ message }}
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      nome: "",
      descricao: "",
      message: "",
      isSuccess: false,
    };
  },
  methods: {
    async addRecurso() {
      try {
        await axios.post("/api/recursos", {
          nome: this.nome,
          descricao: this.descricao,
        });
        this.message = "Recurso adicionado com sucesso!";
        this.isSuccess = true;
        this.nome = "";
        this.descricao = "";
      } catch (error) {
        console.error("Erro ao adicionar recurso:", error);
        this.message = "Erro ao adicionar recurso.";
        this.isSuccess = false;
      }
    },
  },
};
</script>

<style scoped>
</style>
