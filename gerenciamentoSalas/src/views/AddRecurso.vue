<template>
  <div class="view-container">
    <div class="login-container">
      <!-- Formulário -->
      <div class="form-wrapper">
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
          <small v-if="errors.descricao" class="error-message">{{ errors.descricao }}</small>

          <label for="capacidade">Capacidade:</label>
          <input type="number" v-model="recursoData.capacidade" required @input="validateCapacidade" />
          <small v-if="errors.capacidade" class="error-message">{{ errors.capacidade }}</small>

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

          <label for="localizacao">Localização:</label>
          <input type="text" v-model="recursoData.localizacao" required @input="validateLocalizacao" />
          <small v-if="errors.localizacao" class="error-message">{{ errors.localizacao }}</small>

          <button type="submit" :disabled="hasErrors">{{ buttonText }}</button>
        </form>

        <!-- Mensagem de feedback -->
        <div v-if="message" :class="messageType === 'success' ? 'success-message' : 'error-message'">
          {{ message }}
        </div>
      </div>

      <!-- Div do vídeo -->
      <div class="video-wrapper">
        <video autoplay loop muted>
          <source src="../assets/video/Setup.mp4" type="video/mp4" />
          Seu navegador não suporta o formato de vídeo.
        </video>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      recursoData: {
        nome: "",
        descricao: "",
        capacidade: 0,
        status: "DISPONIVEL",
        tipoRecurso: "SALA",
        localizacao: "",
      },
      errors: {
        nome: "",
        descricao: "",
        capacidade: "",
        localizacao: "",
      },
      message: "",
      messageType: "",
    };
  },
  computed: {
    ...mapGetters(["getStatusOpts", "getTipoRecursoOpts"]),
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
        this.errors.descricao = "A descrição deve ter pelo menos 10 caracteres.";
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
    validateLocalizacao() {
      const localizacao = this.recursoData.localizacao;
      if (localizacao.length < 3) {
        this.errors.localizacao =
          "A localização deve ter pelo menos 3 caracteres.";
      } else if (localizacao.length > 100) {
        this.errors.localizacao =
          "A localização deve ter no máximo 100 caracteres.";
      } else {
        this.errors.localizacao = "";
      }
    },
    async submitRecurso() {
      this.validateNome();
      this.validateDescricao();
      this.validateCapacidade();
      this.validateLocalizacao();

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
      if (response.ok) {
        this.message = "Recurso adicionado com sucesso!";
        this.messageType = "success";
        this.resetForm();
        setTimeout(() => {
          this.$router.push("/");
        }, 2000);
      } else {
        const errorData = await response.json();
        this.showError(errorData.message || "Erro ao adicionar recurso.");
      }
    },
    resetForm() {
      this.recursoData = {
        nome: "",
        descricao: "",
        capacidade: 0,
        status: "DISPONIVEL",
        tipoRecurso: "SALA",
        localizacao: "",
      };
    },
    showError(message) {
      this.message = message;
      this.messageType = "error";
    },
  },
};
</script>

<style scoped>
/* Base */
body {
  font-family: 'Arial', sans-serif;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* Layout Principal */
.login-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  height: 100vh;
  background: linear-gradient(135deg, #4a90e2 0%, #f9f9f9 60%, #ccc 100%);
}

/* Formulário */
.form-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px;
  background: linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
}

.form-wrapper form {
  width: 100%;
  max-width: 400px;
  padding: 30px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Header */
.header {
  text-align: center;
  margin-bottom: 20px;
}

.header i {
  font-size: 2.5rem;
  color: #4a90e2;
}

.header h2 {
  font-size: 2rem;
  color: #333;
}

/* Inputs */
input,
textarea,
select {
  width: 100%;
  padding: 12px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

input:focus,
textarea:focus,
select:focus {
  outline: none;
  border-color: #4a90e2;
  box-shadow: 0 0 5px rgba(74, 144, 226, 0.5);
}

/* Botão */
button {
  width: 100%;
  padding: 12px;
  font-size: 1rem;
  background-color: #4a90e2;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-top: 20px;
  /* Distanciamento entre o botão e os campos */
}

button:hover {
  background-color: #357abd;
}

/* Mensagens */
.success-message {
  color: #4caf50;
  background-color: #e8f5e9;
  padding: 10px;
  border-radius: 5px;
  margin-top: 20px;
}

.error-message {
  color: #f44336;
  background-color: #ffebee;
  padding: 10px;
  border-radius: 5px;
  margin-top: 20px;
}

/* Vídeo */
.video-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

.video-wrapper video {
  width: 100%;
  height: auto;
  border-radius: 10px;
  object-fit: cover;
}

/* Responsividade */
@media (max-width: 768px) {
  .login-container {
    grid-template-columns: 1fr;
  }

  .video-wrapper {
    height: 40vh;
    /* Ajuste para o vídeo em telas menores */
  }
}

@media (max-width: 480px) {
  .form-wrapper form {
    padding: 20px;
  }

  .video-wrapper {
    height: 30vh;
    /* Ajuste em telas muito pequenas */
  }
}
</style>