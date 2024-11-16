<template>
  <div class="form-container">
    <form @submit.prevent="submitForm" id="editLabForm">
      <div class="header">
        <i class="fas fa-edit"></i>
        <h2>Editar Laboratório</h2>
      </div>
      <label for="editLabName">Nome do Laboratório:</label>
      <input type="text" id="editLabName" v-model="lab.nome" required />

      <label for="editLabDescription">Descrição:</label>
      <textarea
        id="editLabDescription"
        v-model="lab.descricao"
        required
      ></textarea>

      <label for="editLabCapacity">Capacidade:</label>
      <input
        type="number"
        id="editLabCapacity"
        v-model.number="lab.capacidade"
        required
      />

      <label for="editLabStatus">Status:</label>
      <select id="editLabStatus" v-model="lab.status" required>
        <option value="DISPONIVEL">Disponível</option>
        <option value="MANUTENCAO">Manutenção</option>
        <option value="INATIVA">Inativa</option>
      </select>

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
      lab: {
        nome: "",
        descricao: "",
        capacidade: null,
        status: "",
      },
      loading: true, // Controle de carregamento
      message: "",
      messageType: "", // Tipo de mensagem ("success" ou "error")
    };
  },
  async mounted() {
    await this.loadLab();
  },
  methods: {
    async loadLab() {
      const id = this.$route.params.id; // Obtém o ID do laboratório da rota
      try {
        const response = await fetch(
          `http://localhost:8080/api/laboratorios/${id}`
        );
        if (!response.ok) {
          throw new Error("Erro ao carregar os dados do laboratório");
        }
        this.lab = await response.json();
      } catch (error) {
        this.showError(error.message);
      } finally {
        this.loading = false; // Conclui o carregamento
      }
    },
    async submitForm() {
      const id = this.$route.params.id; // Obtém o ID do laboratório da rota
      try {
        const response = await fetch(
          `http://localhost:8080/api/laboratorios/${id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(this.lab),
          }
        );

        if (!response.ok) {
          throw new Error("Erro ao salvar as alterações");
        }

        // Exibe uma mensagem de sucesso
        this.message = "Laboratório atualizado com sucesso!";
        this.messageType = "success"; // Define o tipo da mensagem
        setTimeout(() => {
          this.$router.push("/view-lab");
        }, 2000);
      } catch (error) {
        this.showError(error.message);
      }
    },
    showError(message) {
      this.message = message;
      this.messageType = "error"; // Define o tipo de mensagem como erro
    },
  },
};
</script>

<style scoped>
</style>
