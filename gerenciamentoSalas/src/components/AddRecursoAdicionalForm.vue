<template>
  <div class="form-container">
    <form @submit.prevent="submitRecursoAdicional">
      <div class="header">
        <i class="fas fa-plus-circle"></i>
        <h2>Adicionar Recurso Adicional</h2>
      </div>

      <label for="nome">Nome:</label>
      <input
        type="text"
        v-model="recursoAdicionalData.nome"
        required
        @input="validateNome"
      />
      <small v-if="errors.nome" class="error-message">{{ errors.nome }}</small>

      <label for="descricao">Descrição:</label>
      <textarea
        v-model="recursoAdicionalData.descricao"
        required
        @input="validateDescricao"
      ></textarea>
      <small v-if="errors.descricao" class="error-message">{{
        errors.descricao
      }}</small>

      <!-- Dropdown para selecionar o recurso -->
      <label for="recursoId">Recurso:</label>
      <select v-model="recursoAdicionalData.recursoId" required>
        <option
          v-for="recurso in recursoAdicionalData.recursos"
          :key="recurso.id"
          :value="recurso.id"
        >
          {{ recurso.nome }}
        </option>
      </select>
      <small v-if="!recursoAdicionalData.recursoId" class="error-message"
        >Por favor, selecione um recurso.</small
      >

      <button type="submit" :disabled="hasErrors">
        Adicionar Recurso Adicional
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
      recursoAdicionalData: {
        nome: "",
        descricao: "",
        recursoId: null, // ID do recurso selecionado
        recursos: [], // Lista de recursos para preencher o dropdown
      },
      errors: {
        nome: "",
        descricao: "",
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
    // Obter a lista de recursos disponíveis no backend
    try {
      const response = await fetch("http://localhost:8080/api/recursos"); // Alterar para a URL que retorna os recursos
      const recursos = await response.json();
      this.recursoAdicionalData.recursos = recursos;
    } catch (error) {
      this.showError("Erro ao carregar os recursos.");
    }
  },
  methods: {
    validateNome() {
      const nome = this.recursoAdicionalData.nome;
      if (nome.length < 3) {
        this.errors.nome = "O nome deve ter pelo menos 3 caracteres.";
      } else if (nome.length > 50) {
        this.errors.nome = "O nome deve ter no máximo 50 caracteres.";
      } else {
        this.errors.nome = "";
      }
    },
    validateDescricao() {
      const descricao = this.recursoAdicionalData.descricao;
      if (descricao.length < 10) {
        this.errors.descricao =
          "A descrição deve ter pelo menos 10 caracteres.";
      } else if (descricao.length > 200) {
        this.errors.descricao =
          "A descrição deve ter no máximo 200 caracteres.";
      } else {
        this.errors.descricao = "";
      }
    },
    async submitRecursoAdicional() {
      this.validateNome();
      this.validateDescricao();

      if (this.hasErrors) {
        this.showError("Por favor, corrija os erros antes de enviar.");
        return;
      }

      try {
        const recursoAdicionalDTO = { ...this.recursoAdicionalData };

        const response = await fetch(
          "http://localhost:8080/api/recursos-adicionais",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(recursoAdicionalDTO),
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
        this.message = "Recurso adicional adicionado com sucesso!";
        this.messageType = "success";
        this.resetForm();
        setTimeout(() => {
          this.$router.push("/"); // Redirecionar após sucesso
        }, 2000);
      } else {
        try {
          const err = JSON.parse(responseText);
          throw new Error(
            err.message || "Erro ao adicionar o recurso adicional"
          );
        } catch (error) {
          throw new Error("Erro inesperado: " + responseText);
        }
      }
    },
    resetForm() {
      this.recursoAdicionalData = {
        nome: "",
        descricao: "",
        recursoId: null, // Resetar o recursoId após o envio
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
