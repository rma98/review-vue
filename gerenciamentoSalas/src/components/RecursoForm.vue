<template>
  <div class="form-container">
    <form @submit.prevent="submitRecurso">
      <div class="header">
        <i class="fas fa-plus-circle"></i>
        <h2>{{ formTitle }}</h2>
      </div>

      <label for="nome">Nome:</label>
      <input type="text" v-model="recursoData.nome" required />

      <label for="descricao">Descrição:</label>
      <textarea v-model="recursoData.descricao" required></textarea>

      <label for="capacidade">Capacidade:</label>
      <input type="number" v-model="recursoData.capacidade" required />

      <label for="status">Status:</label>
      <select v-model="recursoData.status" required>
        <option value="DISPONIVEL">Disponível</option>
        <option value="MANUTENCAO">Manutenção</option>
        <option value="INATIVA">Inativa</option>
      </select>

      <label for="tipo">Tipo de Recurso:</label>
      <select v-model="recursoData.tipoRecurso" required>
        <option value="SALA">Sala</option>
        <option value="LABORATORIO">Laboratório</option>
      </select>

      <button type="submit">{{ buttonText }}</button>
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
const STATUS_OPTS = {
  DISPONIVEL: "Disponível",
  MANUTENCAO: "Manutenção",
  INATIVA: "Inativa"
};

const TIPO_RECURSO_OPTS = {
  SALA: "Sala",
  LABORATORIO: "Laboratório"
};

export default {
  data() {
    return {
      recursoData: {
        nome: "",
        descricao: "",
        capacidade: 0,
        status: "DISPONIVEL",
        tipoRecurso: "SALA"
      },
      message: "",
      messageType: "", // Tipo de mensagem ("success" ou "error")
    };
  },
  computed: {
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
  },
  methods: {
    // Método para submeter o formulário
    async submitRecurso() {
      try {
        const recursoDTO = {
          nome: this.recursoData.nome,
          descricao: this.recursoData.descricao,
          capacidade: this.recursoData.capacidade,
          status: this.recursoData.status,
          tipoRecurso: this.recursoData.tipoRecurso,
        };

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
    // Método para lidar com a resposta da API
    async handleResponse(response) {
      const responseText = await response.text(); // Lê a resposta como texto
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
          const err = JSON.parse(responseText); // Tenta parsear a resposta como JSON
          throw new Error(err.message || "Erro ao adicionar o recurso");
        } catch (error) {
          // Caso não seja JSON, exibe a resposta bruta
          throw new Error("Erro inesperado: " + responseText);
        }
      }
    },
    // Método para resetar o formulário
    resetForm() {
      this.recursoData = {
        nome: "",
        descricao: "",
        capacidade: 0,
        status: "DISPONIVEL",
        tipoRecurso: "SALA",
      };
    },
    // Exibe mensagens de erro
    showError(message) {
      this.message = message;
      this.messageType = "error";
    },
  },
};
</script>

<style scoped>
</style>
