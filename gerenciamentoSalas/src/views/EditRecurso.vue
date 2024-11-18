<template>
  <div class="form-container">
    <!-- Exibe uma mensagem de carregamento enquanto os dados do recurso são carregados -->
    <div v-if="loading">Carregando...</div>

    <!-- Verifica se o recurso foi carregado antes de renderizar o formulário -->
    <form v-else @submit.prevent="submitEditRecurso">
      <div class="header">
        <i class="fas fa-edit"></i>
        <h2>Editar {{ recursoTipo }}</h2>
      </div>
      <label for="editRecursoName">Nome do Recurso:</label>
      <input v-model="recurso.nome" required /><br /><br />

      <label for="editRecursoDescription">Descrição:</label>
      <textarea v-model="recurso.descricao" required></textarea><br /><br />

      <label for="editRecursoCapacity">Capacidade:</label>
      <input
        v-model.number="recurso.capacidade"
        type="number"
        required
      /><br /><br />

      <label for="editRecursoStatus">Status:</label>
      <select v-model="recurso.status" required>
        <option value="DISPONIVEL">Disponível</option>
        <option value="MANUTENCAO">Manutenção</option>
        <option value="INATIVA">Inativa</option></select
      ><br /><br />

      <button type="submit">Salvar Alterações</button>
    </form>

    <!-- Exibe a mensagem de sucesso ou erro com base no tipo -->
    <div
      v-if="message"
      :class="messageType === 'success' ? 'success-message' : 'error-message'"
    >
      {{ message }}
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      recurso: {
        nome: "",
        descricao: "",
        capacidade: null,
        status: "",
      },
      recursoTipo: "", // Tipo do recurso (Sala ou Laboratório)
      loading: true, // Controle de carregamento
      message: "",
      messageType: "", // Tipo de mensagem ("success" ou "error")
    };
  },
  async mounted() {
    await this.loadRecurso();
  },
  methods: {
    async loadRecurso() {
      try {
        const recursoId = this.$route.params.id;
        const recursoTipo = this.$route.params.tipo; // Passa o tipo do recurso (sala ou laboratório)
        this.recursoTipo =
          recursoTipo.charAt(0).toUpperCase() + recursoTipo.slice(1); // Exibe o tipo no título

        // Alteração do método para GET
        const response = await fetch(
          `http://localhost:8080/api/recursos/${recursoId}` // Remove o tipo da URL aqui
        );
        if (!response.ok) {
          throw new Error(`Erro ao carregar os dados do ${recursoTipo}.`);
        }
        this.recurso = await response.json();
      } catch (error) {
        this.showError(error.message);
      } finally {
        this.loading = false;
      }
    },
    // Função para submeter as alterações do recurso
    async submitEditRecurso() {
      try {
        const recursoId = this.recurso.id; // O ID já está presente no objeto
        // Não é mais necessário o recursoTipo na URL, pois a URL usará o ID diretamente
        const response = await fetch(
          `http://localhost:8080/api/recursos/${recursoId}`, // Usando apenas o ID do recurso
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(this.recurso),
          }
        );
        if (!response.ok) {
          throw new Error(`Erro ao salvar as alterações do recurso.`);
        }
        this.message = `${this.recursoTipo} atualizado com sucesso!`;
        this.messageType = "success";
        setTimeout(() => {
          this.$router.push(`/view-${this.recursoTipo.toLowerCase()}`); // Redireciona para a lista após salvar
        }, 2000);
      } catch (error) {
        this.showError(error.message);
      }
    },
    // Função para exibir mensagem de erro
    showError(message) {
      this.message = message;
      this.messageType = "error";
    },
  },
};
</script>

<style scoped>
</style>
