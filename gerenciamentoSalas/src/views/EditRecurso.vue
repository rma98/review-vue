<template>
  <div class="form-container">
    <!-- Exibe uma mensagem de carregamento enquanto os dados do recurso são carregados -->
    <div v-if="loading">Carregando...</div>

    <!-- Verifica se o recurso foi carregado antes de renderizar o formulário -->
    <form v-else @submit.prevent="submitEditRecurso">
      <div class="header">
        <i class="fas fa-edit"></i>
        <!-- Exibe o título usando a função computed 'formTitle' -->
        <h2>{{ formTitle }}</h2>
      </div>

      <!-- Campo de Nome do Recurso -->
      <label for="editRecursoName">Nome do Recurso:</label>
      <input v-model="recurso.nome" required /><br /><br />

      <!-- Campo de Descrição -->
      <label for="editRecursoDescription">Descrição:</label>
      <textarea v-model="recurso.descricao" required></textarea><br /><br />

      <!-- Campo de Capacidade -->
      <label for="editRecursoCapacity">Capacidade:</label>
      <input v-model.number="recurso.capacidade" type="number" required /><br /><br />

      <!-- Campo de Status -->
      <label for="editRecursoStatus">Status:</label>
      <select v-model="recurso.status" required>
        <option value="DISPONIVEL">Disponível</option>
        <option value="MANUTENCAO">Manutenção</option>
        <option value="INATIVA">Inativa</option>
      </select><br /><br />

      <!-- Novo campo: Localização -->
      <label for="editRecursoLocation">Localização:</label>
      <input v-model="recurso.localizacao" required /><br /><br />

      <!-- Botão para Salvar -->
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
      recurso: {
        nome: "",
        descricao: "",
        capacidade: null,
        status: "",
        localizacao: "", // Campo de Localização
        tipoRecurso: "", // Adicionando tipoRecurso na definição inicial
      },
      recursoTipo: "", // Tipo do recurso (Sala ou Laboratório)
      loading: true, // Controle de carregamento
      message: "",
      messageType: "", // Tipo de mensagem ("success" ou "error")
    };
  },
  computed: {
    formTitle() {
      // Se o recurso tiver nome, exibe o nome. Caso contrário, exibe o tipo de recurso.
      if (this.recurso.nome) {
        return `Editar: ${this.recurso.nome}`;
      }
      return this.recurso.tipoRecurso === "SALA"
        ? "Editar Sala"
        : this.recurso.tipoRecurso === "LABORATORIO"
          ? "Editar Laboratório"
          : "Editar Recurso";
    },

    // Obtenção do recurso a partir do Vuex usando o id do recurso
    recursoId() {
      return this.$route.params.id;
    },
    recursoData() {
      return this.$store.state.resources.find(
        (resource) => resource.id === parseInt(this.recursoId)
      );
    },
  },
  watch: {
    recursoData(newData) {
      if (newData) {
        this.recurso = { ...newData }; // Preenche o formulário com os dados do recurso
        this.recursoTipo = newData.tipoRecurso === 'SALA' ? 'Sala' : 'Laboratório'; // Define o tipo
        this.loading = false;
      }
    },
  },
  mounted() {
    this.fetchRecurso();
  },
  methods: {
    async fetchRecurso() {
      this.loading = true;
      await this.$store.dispatch("fetchRecursos"); // Atualiza a lista de recursos no Vuex
    },

    // Função para submeter as alterações do recurso
    async submitEditRecurso() {
      try {
        const recursoId = this.recurso.id;
        // Envia os dados do recurso, incluindo o campo de localização
        const response = await fetch(
          `http://localhost:8080/api/recursos/${recursoId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(this.recurso),
          }
        );
        if (!response.ok) {
          throw new Error(`Erro ao salvar as alterações do recurso.`);
        }

        // Atualiza a lista de recursos no Vuex
        this.$store.commit('updateResource', this.recurso);

        this.message = `${this.recurso.nome} atualizado com sucesso!`;
        this.messageType = "success";
        setTimeout(() => {
          this.$router.push(`/view-${this.recursoTipo.toLowerCase()}`); // Redireciona para a lista após salvar
        }, 2000);
      } catch (error) {
        this.showError(error.message);
      }
    },

    // Função para exibir mensagem de erro
    showError(message) {
      this.message = message;
      this.messageType = "error";
    },
  },
};
</script>

<style scoped></style>
