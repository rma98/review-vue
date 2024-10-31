<template>
  <div class="form-container">
    <h2>Editar Sala</h2>

    <!-- Exibe uma mensagem de carregamento enquanto os dados da sala são carregados -->
    <div v-if="loading">Carregando...</div>

    <!-- Verifica se a sala foi carregada antes de renderizar o formulário -->
    <form v-else @submit.prevent="submitEditRoom">
      <label for="editRoomName">Nome da Sala:</label>
      <input v-model="room.nome" required /><br /><br />

      <label for="editRoomDescription">Descrição:</label>
      <textarea v-model="room.descricao" required></textarea><br /><br />

      <label for="editRoomCapacity">Capacidade:</label>
      <input
        v-model.number="room.capacidade"
        type="number"
        required
      /><br /><br />

      <label for="editRoomStatus">Status:</label>
      <select v-model="room.status" required>
        <option value="DISPONIVEL">Disponível</option>
        <option value="MANUTENCAO">Manutenção</option>
        <option value="INATIVA">Inativa</option></select
      ><br /><br />

      <button type="submit">Salvar Alterações</button>
    </form>

    <!-- Exibe a mensagem de sucesso ou erro com base no tipo -->
    <div v-if="message" :class="messageType === 'success' ? 'success-message' : 'error-message'">
      {{ message }}
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      room: {
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
    await this.loadRoom();
  },
  methods: {
    async loadRoom() {
      try {
        const response = await fetch(
          `http://localhost:8080/api/salas/${this.$route.params.id}`
        );
        if (!response.ok) {
          throw new Error("Erro ao carregar os dados da sala.");
        }
        this.room = await response.json();
      } catch (error) {
        this.showError(error.message);
      } finally {
        this.loading = false;
      }
    },
    async submitEditRoom() {
      try {
        const response = await fetch(
          `http://localhost:8080/api/salas/${this.room.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(this.room),
          }
        );
        if (!response.ok) {
          throw new Error("Erro ao salvar as alterações.");
        }
        this.message = "Sala atualizada com sucesso!";
        this.messageType = "success";
        setTimeout(() => {
          this.$router.push("/view-room");
        }, 2000);
      } catch (error) {
        this.showError(error.message);
      }
    },
    showError(message) {
      this.message = message;
      this.messageType = "error";
    },
  },
};
</script>

<style scoped>
</style>
