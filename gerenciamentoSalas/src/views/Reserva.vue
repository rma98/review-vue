<template>
  <div class="form-container">
    <form @submit.prevent="submitReserva">
      <div class="header">
        <i class="fas fa-calendar-check"></i>
        <h2>Adicionar Reserva</h2>
      </div>

      <label for="data">Data:</label>
      <input
        type="date"
        v-model="reservaData.data"
        required
        @input="validateData"
      />
      <small v-if="errors.data" class="error-message">{{ errors.data }}</small>

      <label for="hora">Hora:</label>
      <input
        type="time"
        v-model="reservaData.hora"
        required
        @input="validateHora"
      />
      <small v-if="errors.hora" class="error-message">{{ errors.hora }}</small>

      <!-- Dropdown para selecionar o recurso -->
      <label for="itemId">Item:</label>
      <select v-model="reservaData.itemId" required>
        <option
          v-for="item in reservaData.itens"
          :key="item.id"
          :value="item.id"
        >
          {{ item.nome }}
        </option>
      </select>
      <small v-if="!reservaData.itemId" class="error-message">Por favor, selecione um item.</small>

      <button type="submit" :disabled="hasErrors">
        Adicionar Reserva
      </button>
    </form>

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
      reservaData: {
        data: "",
        hora: "",
        itemId: null, // ID do item selecionado
        itens: [], // Lista de itens para preencher o dropdown
      },
      errors: {
        data: "",
        hora: "",
      },
      message: "",
      messageType: "",
    };
  },
  computed: {
    hasErrors() {
      return Object.values(this.errors).some((error) => error !== "");
    },
  },
  async created() {
    // Obter a lista de itens disponíveis no backend
    try {
      const response = await fetch("http://localhost:8080/api/itens"); // Alterar para a URL que retorna os itens
      const itens = await response.json();
      this.reservaData.itens = itens;
    } catch (error) {
      this.showError("Erro ao carregar os itens.");
    }
  },
  methods: {
    validateData() {
      const data = this.reservaData.data;
      if (!data) {
        this.errors.data = "A data é obrigatória.";
      } else {
        this.errors.data = "";
      }
    },
    validateHora() {
      const hora = this.reservaData.hora;
      if (!hora) {
        this.errors.hora = "A hora é obrigatória.";
      } else {
        this.errors.hora = "";
      }
    },
    async submitReserva() {
      this.validateData();
      this.validateHora();

      if (this.hasErrors) {
        this.showError("Por favor, corrija os erros antes de enviar.");
        return;
      }

      try {
        const reservaDTO = { ...this.reservaData };

        const response = await fetch(
          "http://localhost:8080/api/reservas",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(reservaDTO),
          }
        );

        await this.handleResponse(response);
      } catch (error) {
        this.showError(error.message);
      }
    },
    async handleResponse(response) {
      const responseText = await response.text();

      if (response.ok) {
        this.message = "Reserva realizada com sucesso!";
        this.messageType = "success";
        this.resetForm();
        setTimeout(() => {
          this.$router.push("/"); // Redirecionar após sucesso
        }, 2000);
      } else {
        try {
          const err = JSON.parse(responseText);
          throw new Error(err.message || "Erro ao realizar a reserva");
        } catch (error) {
          throw new Error("Erro inesperado: " + responseText);
        }
      }
    },
    resetForm() {
      this.reservaData = {
        data: "",
        hora: "",
        itemId: null, // Resetar o itemId após o envio
      };
    },
    showError(message) {
      this.message = message;
      this.messageType = "error";
    },
  },
};
</script>

<style>
.error-message {
  color: red;
  font-size: 0.85rem;
  margin-top: 5px;
}
</style>
