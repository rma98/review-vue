<template>
  <div class="form-container">
    <!-- Div do vídeo e formulário, ambos centralizados -->
    <div class="content-wrapper">
      <!-- Div do vídeo -->
      <div class="video-wrapper">
        <video autoplay loop muted>
          <source src="../assets/video/Setup.mp4" type="video/mp4" />
          Seu navegador não suporta o formato de vídeo.
        </video>
      </div>

      <!-- Formulário -->
      <div class="form-wrapper">
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
            <option value="INDISPONIVEL">Indisponível</option>
            <option value="RESERVADO">Reservado</option>
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

<style scoped>
/* Estilos gerais para a área de vídeo e formulário lado a lado */
.content-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  /* Espaçamento entre o vídeo e o formulário */
  padding: 20px;
  flex-wrap: wrap;
  /* Permite que eles se ajustem em telas pequenas */
}

.video-wrapper {
  flex: 1 1 45%;
  /* O vídeo ocupa até 45% da largura disponível */
  display: flex;
  justify-content: center;
  align-items: center;
}

.video-wrapper video {
  width: 100%;
  height: auto;
  border-radius: 10px;
  object-fit: cover;
}

.form-wrapper {
  flex: 1 1 45%;
  /* O formulário ocupa até 45% da largura disponível */
  max-width: 500px;
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.form-wrapper .header {
  text-align: center;
  margin-bottom: 20px;
}

.form-wrapper .header i {
  font-size: 2.5rem;
  color: #4a90e2;
}

.form-wrapper .header h2 {
  font-size: 2rem;
  color: #333;
}

input,
textarea,
select {
  width: 100%;
  padding: 12px;
  margin-top: 5px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

input:focus,
textarea:focus,
select:focus {
  outline: none;
  border-color: #4a90e2;
  box-shadow: 0 0 5px rgba(74, 144, 226, 0.5);
}

button {
  width: 100%;
  padding: 12px;
  font-size: 1rem;
  background-color: #4a90e2;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;
}

button:hover {
  background-color: #357abd;
}

.success-message,
.error-message {
  padding: 10px;
  border-radius: 5px;
  margin-top: 20px;
}

.success-message {
  background-color: #e8f5e9;
  color: #4caf50;
}

.error-message {
  background-color: #ffebee;
  color: #f44336;
}

/* Responsividade */
@media (max-width: 768px) {

  .video-wrapper,
  .form-wrapper {
    flex: 1 1 100%;
    /* Faz com que o vídeo e o formulário ocupem 100% da largura em telas menores */
    max-width: 100%;
  }
}
</style>
