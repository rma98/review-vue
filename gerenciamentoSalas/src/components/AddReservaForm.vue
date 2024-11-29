<template>
  <div class="form-container">
    <h2>Criar Reserva</h2>
    <form @submit.prevent="submitReserva">
      <!-- Seleção do Recurso -->
      <label for="recurso">Recurso:</label>
      <select v-model="reserva.recursoId" required>
        <option v-for="recurso in recursos" :key="recurso.id" :value="recurso.id">
          {{ recurso.nome }}
        </option>
      </select>

      <!-- Seleção do Recurso Adicional -->
      <label for="recursoAdicional">Recurso Adicional:</label>
      <select v-model="reserva.recursoAdicionalId">
        <option value="">Nenhum</option>
        <option v-for="adicional in recursosAdicionais" :key="adicional.id" :value="adicional.id">
          {{ adicional.nome }}
        </option>
      </select>

      <!-- Seleção de Data e Hora -->
      <label for="dataInicio">Data e Hora de Início:</label>
      <input type="datetime-local" v-model="reserva.dataInicio" required />

      <label for="dataFim">Data e Hora de Fim:</label>
      <input type="datetime-local" v-model="reserva.dataFim" required />

      <!-- Botão de Submissão -->
      <button type="submit">Criar Reserva</button>
    </form>

    <!-- Mensagem de sucesso ou erro -->
    <div v-if="message" :class="messageType === 'success' ? 'success-message' : 'error-message'">
      {{ message }}
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      reserva: {
        recursoId: "",
        recursoAdicionalId: "",
        dataInicio: "",
        dataFim: "",
      },
      recursos: [], // Lista de recursos
      recursosAdicionais: [], // Lista de recursos adicionais
      message: "",
      messageType: "",
    };
  },
  mounted() {
    this.fetchRecursos();
    this.fetchRecursosAdicionais();
  },
  methods: {
    // Buscar recursos da API
    async fetchRecursos() {
      const response = await fetch("http://localhost:8080/api/recursos");
      this.recursos = await response.json();
    },
    // Buscar recursos adicionais da API
    async fetchRecursosAdicionais() {
      const response = await fetch("http://localhost:8080/api/recursosAdicionais");
      this.recursosAdicionais = await response.json();
    },
    // Submeter reserva para API
    async submitReserva() {
      try {
        const response = await fetch("http://localhost:8080/api/reservas", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(this.reserva),
        });
        if (!response.ok) {
          throw new Error("Erro ao criar a reserva.");
        }
        this.message = "Reserva criada com sucesso!";
        this.messageType = "success";
        this.resetForm();
      } catch (error) {
        this.message = error.message;
        this.messageType = "error";
      }
    },
    // Resetar formulário após sucesso
    resetForm() {
      this.reserva = {
        recursoId: "",
        recursoAdicionalId: "",
        dataInicio: "",
        dataFim: "",
      };
    },
  },
};
</script>

<style scoped>
.form-container {
  max-width: 500px;
  margin: 0 auto;
}

.success-message {
  color: green;
}

.error-message {
  color: red;
}
</style>
