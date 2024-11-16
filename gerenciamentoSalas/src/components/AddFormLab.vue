<template>
  <div class="form-container">
    <form @submit.prevent="submitLab">
      <div class="header">
        <i class="fas fa-plus-circle"></i>
        <h2>Adicionar Laboratório</h2>
      </div>
      <label for="labName">Nome do Laboratório:</label>
      <input type="text" v-model="labData.nome" required />

      <label for="labDescription">Descrição:</label>
      <textarea v-model="labData.descricao" required></textarea>

      <label for="labCapacity">Capacidade:</label>
      <input type="number" v-model="labData.capacidade" required />

      <label for="labStatus">Status:</label>
      <select v-model="labData.status" required>
        <option value="DISPONIVEL">Disponível</option>
        <option value="MANUTENCAO">Manutenção</option>
        <option value="INATIVA">Inativa</option>
      </select>

      <button type="submit">Adicionar Laboratório</button>
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
      labData: {
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
    async submitLab() {
      try {
        const response = await fetch("http://localhost:8080/api/laboratorios", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(this.labData),
        });

        await this.handleResponse(response);
      } catch (error) {
        this.showError(error.message);
      }
    },
    async handleResponse(response) {
      if (response.ok) {
        this.message = "Laboratório adicionado com sucesso!";
        this.messageType = "success";
        this.resetForm();
        setTimeout(() => {
          this.$router.push("/view-lab");
        }, 2000);
      } else {
        const err = await response.json();
        throw new Error(err.message || "Erro ao adicionar o laboratório");
      }
    },
    resetForm() {
      this.labData = {
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
</style>
