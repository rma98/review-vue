<template>
  <div class="form-container">
    <form @submit.prevent="submitReserva">
      <div class="header">
        <i class="fas fa-calendar-check"></i>
        <h2>Adicionar Reserva</h2>
      </div>

      <!-- Data de início -->
      <label for="dataInicio">Data Início:</label>
      <input type="datetime-local" v-model="reservaData.dataInicio" required @input="validateDataInicio" />
      <small v-if="errors.dataInicio" class="error-message">{{ errors.dataInicio }}</small>

      <!-- Data de fim -->
      <label for="dataFim">Data Fim:</label>
      <input type="datetime-local" v-model="reservaData.dataFim" required @input="validateDataFim" />
      <small v-if="errors.dataFim" class="error-message">{{ errors.dataFim }}</small>

      <!-- Dropdown para selecionar o usuário -->
      <label for="usuarioId">Usuário:</label>
      <select v-model="reservaData.usuarioId" required @change="validateUsuarioId">
        <option v-for="usuario in usuarios" :key="usuario.id" :value="usuario.id">
          {{ usuario.nome }}
        </option>
      </select>
      <small v-if="errors.usuarioId" class="error-message">{{ errors.usuarioId }}</small>

      <!-- Dropdown para selecionar o recurso -->
      <label for="recursoId">Recurso:</label>
      <select v-model="reservaData.recursoId" required @change="validateRecursoId">
        <option v-for="recurso in recursos" :key="recurso.id" :value="recurso.id">
          {{ recurso.nome }}
        </option>
      </select>
      <small v-if="errors.recursoId" class="error-message">{{ errors.recursoId }}</small>

      <!-- Recurso adicional -->
      <label for="recursoAdicional">Recurso Adicional:</label>
      <input type="text" v-model="reservaData.recursoAdicional"
        placeholder="Descreva um recurso adicional, se necessário" />

      <button type="submit" :disabled="hasErrors">
        Adicionar Reserva
      </button>
    </form>

    <div v-if="message" :class="messageType === 'success' ? 'success-message' : 'error-message'">
      {{ message }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    itemId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      reservaData: {
        dataInicio: "",
        dataFim: "",
        usuarioId: null,  // ID do usuário selecionado
        recursoId: null,  // ID do recurso selecionado
        recursoAdicional: "", // Descrição do recurso adicional
      },
      recursos: [],  // Lista de recursos disponíveis
      usuarios: [],  // Lista de usuários (se necessário)
      errors: {
        dataInicio: "",
        dataFim: "",
        usuarioId: "",
        recursoId: "",
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
    try {
      // Carregar recursos
      const recursosResponse = await fetch("http://localhost:8080/api/recursos");
      this.recursos = await recursosResponse.json();

      // Carregar usuários
      const usuariosResponse = await fetch("http://localhost:8080/api/usuarios");
      this.usuarios = await usuariosResponse.json();
    } catch (error) {
      this.showError("Erro ao carregar recursos e usuários.");
    }
  },
  methods: {
    validateDataInicio() {
      const dataInicio = this.reservaData.dataInicio;
      if (!dataInicio) {
        this.errors.dataInicio = "A data de início é obrigatória.";
      } else {
        this.errors.dataInicio = "";
      }
    },
    validateDataFim() {
      const dataFim = this.reservaData.dataFim;
      if (!dataFim) {
        this.errors.dataFim = "A data de fim é obrigatória.";
      } else {
        this.errors.dataFim = "";
      }
    },
    validateUsuarioId() {
      if (!this.reservaData.usuarioId) {
        this.errors.usuarioId = "Por favor, selecione um usuário.";
      } else {
        this.errors.usuarioId = "";
      }
    },
    validateRecursoId() {
      if (!this.reservaData.recursoId) {
        this.errors.recursoId = "Por favor, selecione um recurso.";
      } else {
        this.errors.recursoId = "";
      }
    },
    async submitReserva() {
      this.validateDataInicio();
      this.validateDataFim();
      this.validateUsuarioId();
      this.validateRecursoId();

      if (this.hasErrors) {
        this.showError("Por favor, corrija os erros antes de enviar.");
        return;
      }

      try {
        const reservaDTO = {
          dataInicio: this.reservaData.dataInicio,
          dataFim: this.reservaData.dataFim,
          usuarioId: this.reservaData.usuarioId,
          recursoId: this.reservaData.recursoId,
          recursoAdicional: this.reservaData.recursoAdicional,
        };

        // Fazendo a requisição com o DTO correto
        const response = await fetch("http://localhost:8080/api/reservas", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(reservaDTO), // Envia o ReservaDTO para o backend
        });

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
          this.$emit("close"); // Emitir evento para fechar o modal
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
        dataInicio: "",
        dataFim: "",
        usuarioId: null,
        recursoId: null,
        recursoAdicional: "",
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
