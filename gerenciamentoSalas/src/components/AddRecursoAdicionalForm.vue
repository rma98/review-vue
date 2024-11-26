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

      <!-- Dropdown para selecionar o recurso -->
      <label for="recurso_id">Recurso:</label>
      <select v-model="recursoAdicionalData.recurso_id" required>
        <option v-for="recurso in recursoAdicionalData.recursos" :key="recurso.id" :value="recurso.id">
          {{ recurso.nome }}
        </option>
      </select>
      <small v-if="!recursoAdicionalData.recurso_id" class="error-message">
        Por favor, selecione um recurso.
      </small>

      <button type="submit" :disabled="hasErrors">Adicionar Recurso Adicional</button>
    </form>

    <div v-if="message" :class="messageType === 'success' ? 'success-message' : 'error-message'">
      {{ message }}
    </div>

    <!-- Botão para visualizar os recursos adicionais -->
    <button class="view-resources-btn" @click="toggleRecursoList">Ver Recursos Adicionais</button>

    <!-- Lista de recursos adicionais -->
    <div v-if="showResourcesList" class="resource-list">
      <ul>
        <li v-for="recurso in recursosAdicionais" :key="recurso.id">
          {{ recurso.nome }}
          <button @click="editRecurso(recurso.id)">Editar</button>
          <button @click="deleteRecurso(recurso.id)">Excluir</button>
        </li>
      </ul>
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
        recurso_id: null,
        recursos: [],
        recursosAdicionais: [], // Lista de recursos adicionais carregados
      },
      errors: {
        nome: "",
        descricao: "",
      },
      message: "",
      messageType: "",
      showResourceList: false, // Controle para mostrar ou ocultar a lista de recursos adicionais
    };
  },
  computed: {
    hasErrors() {
      return Object.values(this.errors).some((error) => error !== "");
    },
  },
  created() {
    this.loadRecursos();
    this.loadRecursosAdicionais(); // Carregar os recursos adicionais ao iniciar
  },
  methods: {
    // Função para carregar os recursos
    async loadRecursos() {
      try {
        const response = await fetch("http://localhost:8080/api/recursos");
        const recursos = await response.json();
        this.recursoAdicionalData.recursos = recursos;
      } catch (error) {
        this.showError("Erro ao carregar os recursos.");
      }
    },

    // Função para carregar os recursos adicionais
    async loadRecursosAdicionais() {
      try {
        const response = await fetch("http://localhost:8080/api/recurso-adicional");
        const recursosAdicionais = await response.json();
        this.recursoAdicionalData.recursosAdicionais = recursosAdicionais;
      } catch (error) {
        this.showError("Erro ao carregar os recursos adicionais.");
      }
    },

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
        const recursoAdicionalDTO = {
          nome: this.recursoAdicionalData.nome,
          descricao: this.recursoAdicionalData.descricao,
          recurso: { id: this.recursoAdicionalData.recurso_id },
        };

        const response = await fetch(
          "http://localhost:8080/api/recurso-adicional",
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

        // Recarregar os recursos adicionais
        this.loadRecursosAdicionais();

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
        recurso_id: null,
      };
    },

    showError(message) {
      this.message = message;
      this.messageType = "error";
    },

    toggleRecursoList() {
      this.showResourceList = !this.showResourceList;
    },

    editRecurso(id) {
      // Lógica para editar o recurso
      console.log("Editando recurso com ID:", id);
      // Você pode redirecionar para outra página de edição ou abrir um modal de edição
    },

    async deleteRecurso(id) {
      if (confirm("Tem certeza de que deseja excluir este recurso?")) {
        try {
          const response = await fetch(
            `http://localhost:8080/api/recurso-adicional/${id}`,
            {
              method: "DELETE",
            }
          );

          if (response.ok) {
            this.message = "Recurso excluído com sucesso!";
            this.messageType = "success";
            this.loadRecursosAdicionais(); // Recarregar a lista de recursos após exclusão
          } else {
            this.showError("Erro ao excluir o recurso.");
          }
        } catch (error) {
          this.showError("Erro ao excluir o recurso.");
        }
      }
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

button {
  background-color: #4caf50;
  /* Cor de fundo verde */
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin: 10px 0;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

button:hover:not(:disabled) {
  background-color: #45a049;
  /* Cor mais escura no hover */
}

button:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(72, 136, 255, 0.6);
  /* Efeito de foco */
}

/* Estilos específicos para o botão "Ver Recursos Adicionais" */
.view-resources-btn {
  background-color: #007bff;
  /* Cor azul para o botão de ver recursos */
  margin-top: 20px;
  /* Margem para separar do formulário */
}

.view-resources-btn:hover:not(:disabled) {
  background-color: #0056b3;
  /* Cor mais escura no hover */
}

.resource-list {
  margin-top: 20px;
}

.resource-list ul {
  list-style-type: none;
  padding: 0;
}

.resource-list li {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.resource-list button {
  margin-left: 10px;
}
</style>
