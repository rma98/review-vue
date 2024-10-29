<template>
  <div>
    <h2>Adicionar Sala</h2>
    <form @submit.prevent="submitRoom">
      <label for="roomName">Nome da Sala:</label>
      <input type="text" v-model="roomData.nome" required />

      <label for="roomDescription">Descrição:</label>
      <textarea v-model="roomData.descricao" required></textarea>

      <label for="roomCapacity">Capacidade:</label>
      <input type="number" v-model="roomData.capacidade" required />

      <label for="roomStatus">Status:</label>
      <select v-model="roomData.status" required>
        <option value="DISPONIVEL">Disponível</option>
        <option value="MANUTENCAO">Manutenção</option>
        <option value="INATIVA">Inativa</option>
      </select>

      <button type="submit">Adicionar Sala</button>
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
      roomData: {
        nome: "",
        descricao: "",
        capacidade: 0,
        status: "DISPONIVEL",
      },
      message: "",
      messageType: "", // Tipo de mensagem ("success" ou "error")
    };
  },
  methods: {
    async submitRoom() {
      try {
        const response = await fetch("http://localhost:8080/api/salas", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(this.roomData),
        });

        await this.handleResponse(response);
      } catch (error) {
        this.showError(error.message);
      }
    },
    async handleResponse(response) {
      if (response.ok) {
        this.message = "Sala adicionada com sucesso!";
        this.messageType = "success";
        this.resetForm();
        setTimeout(() => {
          this.$router.push("/view-room");
        }, 2000);
      } else {
        const err = await response.json();
        throw new Error(err.message || "Erro ao adicionar a sala");
      }
    },
    resetForm() {
      this.roomData = {
        nome: "",
        descricao: "",
        capacidade: 0,
        status: "DISPONIVEL",
      };
    },
    showError(message) {
      this.message = message;
      this.messageType = "error";
    },
  },
};
</script>

<style scoped>
h2 {
  font-size: 2rem;
}
</style>
