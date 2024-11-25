<template>
  <div class="form-container">
    <form @submit.prevent="submitRecurso">
      <div class="header">
        <i class="fas fa-plus-circle"></i>
        <h2>{{ formTitle }}</h2>
      </div>

      <label for="nome">Nome:</label>
      <input type="text" v-model="recursoData.nome" required @input="validateNome" />
      <small v-if="errors.nome" class="error-message">{{ errors.nome }}</small>

      <label for="descricao">Descrição:</label>
      <textarea v-model="recursoData.descricao" required @input="validateDescricao"></textarea>
      <small v-if="errors.descricao" class="error-message">{{
        errors.descricao
      }}</small>

      <label for="capacidade">Capacidade:</label>
      <input type="number" v-model="recursoData.capacidade" required @input="validateCapacidade" />
      <small v-if="errors.capacidade" class="error-message">{{
        errors.capacidade
      }}</small>

      <label for="status">Status:</label>
      <select v-model="recursoData.status" required>
        <option v-for="(label, value) in getStatusOpts" :key="value" :value="value">
          {{ label }}
        </option>
      </select>

      <label for="tipo">Tipo de Recurso:</label>
      <select v-model="recursoData.tipoRecurso" required>
        <option v-for="(label, value) in getTipoRecursoOpts" :key="value" :value="value">
          {{ label }}
        </option>
      </select>

      <button type="submit" :disabled="hasErrors">{{ buttonText }}</button>
    </form>

    <div v-if="message" :class="messageType === 'success' ? 'success-message' : 'error-message'">
      {{ message }}
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      recursoData: {
        nome: "",
        descricao: "",
        capacidade: 0,
        status: "DISPONIVEL",
        tipoRecurso: "SALA",
      },
      errors: {
        nome: "",
        descricao: "",
        capacidade: "",
      },
      message: "",
      messageType: "",
    };
  },
  computed: {
    ...mapGetters(['getStatusOpts', 'getTipoRecursoOpts']),
    formTitle() {
      return this.recursoData.tipoRecurso === "SALA"
        ? "Adicionar Sala"
        : "Adicionar Laboratório";
    },
    buttonText() {
      return this.recursoData.tipoRecurso === "SALA"
        ? "Adicionar Sala"
        : "Adicionar Laboratório";
    },
    hasErrors() {
      return Object.values(this.errors).some((error) => error !== "");
    },
  },
  methods: {
    validateNome() {
      const nome = this.recursoData.nome;
      if (nome.length < 3) {
        this.errors.nome = "O nome deve ter pelo menos 3 caracteres.";
      } else if (nome.length > 50) {
        this.errors.nome = "O nome deve ter no máximo 50 caracteres.";
      } else if (!/^[a-zA-Z0-9áàãâäéèêëíìîïóòôöúùûüç\s]+$/.test(nome)) {
        this.errors.nome =
          "O nome deve conter apenas letras, números e espaços.";
      } else {
        this.errors.nome = "";
      }
    },
    validateDescricao() {
      const descricao = this.recursoData.descricao;
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
    validateCapacidade() {
      const capacidade = this.recursoData.capacidade;
      if (capacidade < 1) {
        this.errors.capacidade = "A capacidade deve ser pelo menos 1.";
      } else if (capacidade > 1000) {
        this.errors.capacidade = "A capacidade deve ser no máximo 1000.";
      } else {
        this.errors.capacidade = "";
      }
    },
    async submitRecurso() {
      this.validateNome();
      this.validateDescricao();
      this.validateCapacidade();

      if (this.hasErrors) {
        this.showError("Por favor, corrija os erros antes de enviar.");
        return;
      }

      try {
        const recursoDTO = { ...this.recursoData };

        const response = await fetch("http://localhost:8080/api/recursos", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(recursoDTO),
        });

        await this.handleResponse(response);
      } catch (error) {
        this.showError(error.message);
      }
    },
    async handleResponse(response) {
      const responseText = await response.text();
      console.log("Response Text:", responseText);

      if (response.ok) {
        this.message = "Recurso adicionado com sucesso!";
        this.messageType = "success";
        this.resetForm();
        setTimeout(() => {
          this.$router.push("/");
        }, 2000);
      } else {
        try {
          const err = JSON.parse(responseText);
          throw new Error(err.message || "Erro ao adicionar o recurso");
        } catch (error) {
          throw new Error("Erro inesperado: " + responseText);
        }
      }
    },
    resetForm() {
      this.recursoData = {
        nome: "",
        descricao: "",
        capacidade: 0,
        status: "DISPONIVEL",
        tipoRecurso: "SALA",
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
