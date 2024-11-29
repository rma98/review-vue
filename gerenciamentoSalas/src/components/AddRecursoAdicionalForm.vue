<template>
  <div class="form-container">
    <form @submit.prevent="submitRecursoAdicional">
      <div class="header">
        <i class="fas fa-plus-circle"></i>
        <h2>Adicionar Recurso Adicional</h2>
      </div>

      <label for="nome">Nome:</label>
      <input type="text" v-model="recursoAdicionalData.nome" required @input="validateNome" />
      <small v-if="errors.nome" class="error-message">{{ errors.nome }}</small>

      <label for="descricao">Descrição:</label>
      <textarea v-model="recursoAdicionalData.descricao" required @input="validateDescricao"></textarea>
      <small v-if="errors.descricao" class="error-message">{{ errors.descricao }}</small>

      <label for="quantidade">Quantidade:</label>
      <input type="number" v-model="recursoAdicionalData.quantidade" required min="1" />
      <small v-if="errors.quantidade" class="error-message">{{ errors.quantidade }}</small>

      <button type="submit" :disabled="hasErrors || isLoading">Adicionar Recurso Adicional</button>
    </form>

    <!-- Mensagem de sucesso ou erro -->
    <div v-if="message" :class="messageType === 'success' ? 'success-message' : 'error-message'">
      {{ message }}
    </div>

    <!-- Itens adicionados -->
    <div v-if="isAdded" class="added-info">
      <h3>Recursos Adicionados</h3>
      <ul>
        <li v-for="(item, index) in addedRecursos" :key="index">
          <p>{{ item.nome }} - {{ item.descricao }} - {{ item.quantidade }} unidades
            <button @click="deleteRecurso(index)" class="delete-btn">
              <i class="fas fa-trash-alt"></i>
            </button>
          </p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    recursoAdicionalData() {
      return this.$store.getters.getRecursoAdicionalData;
    },
    message() {
      return this.$store.getters.getMessage;
    },
    messageType() {
      return this.$store.getters.getMessageType;
    },
    addedRecursos() {
      return this.$store.getters.getAddedRecursos;
    },
    hasErrors() {
      return Object.values(this.errors).some((error) => error !== "");
    },
  },
  data() {
    return {
      errors: {
        nome: "",
        descricao: "",
        quantidade: "",
      },
      isLoading: false,
      isAdded: false,
    };
  },
  methods: {
    async submitRecursoAdicional() {
      this.validateNome();
      this.validateDescricao();
      this.validateQuantidade();

      if (this.hasErrors) {
        this.showError("Por favor, corrija os erros antes de enviar.");
        return;
      }

      const recursoAdicionalDTO = {
        nome: this.recursoAdicionalData.nome,
        descricao: this.recursoAdicionalData.descricao,
        quantidade: this.recursoAdicionalData.quantidade,
      };

      this.isLoading = true;

      try {
        await this.$store.dispatch('addRecursoAdicional', recursoAdicionalDTO);

        this.resetForm();
        this.isAdded = true;
        this.showSuccess("Recurso Adicional Adicionado com Sucesso!");

        setTimeout(() => {
          this.$store.commit("setMessage", { message: "", messageType: "" });
        }, 3000);
      } catch (error) {
        this.showError("Erro ao adicionar o recurso adicional.");
      } finally {
        this.isLoading = false;
      }
    },
    resetForm() {
      this.$store.dispatch('resetRecursoAdicionalData');
    },
    showSuccess(message) {
      this.$store.commit("setMessage", { message, messageType: "success" });
    },
    showError(message) {
      this.$store.commit("setMessage", { message, messageType: "error" });
    },
    validateNome() {
      this.errors.nome = this.recursoAdicionalData.nome ? "" : "O nome é obrigatório.";
    },
    validateDescricao() {
      this.errors.descricao = this.recursoAdicionalData.descricao ? "" : "A descrição é obrigatória.";
    },
    validateQuantidade() {
      this.errors.quantidade = this.recursoAdicionalData.quantidade > 0 ? "" : "A quantidade deve ser maior que zero.";
    },
    deleteRecurso(index) {
      this.$store.dispatch('deleteRecursoAdicional', index);
    },
  },
};
</script>

<style scoped>
.error-message {
  color: red;
  font-size: 0.85rem;
  margin-top: 5px;
}

.success-message {
  color: green;
  font-size: 1rem;
  margin-top: 10px;
}

.added-info {
  margin-top: 20px;
  padding: 10px;
  background-color: #f9f9f9;
  border: 1px solid #ccc;
}

.added-info p {
  margin: 5px 0;
}

.delete-btn {
  background: none;
  border: none;
  color: red;
  cursor: pointer;
  margin-left: 10px;
}
</style>
