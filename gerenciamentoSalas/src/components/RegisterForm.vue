<template>
  <div class="form-container">
    <form @submit.prevent="handleSubmit">
      <div class="header">
        <i class="fas fa-user-plus"></i>
        <h2>Cadastro</h2>
      </div>
      <div class="input-group">
        <label for="name"><i class="fas fa-user"></i> Nome Completo</label>
        <input type="text" v-model="formData.nome" @input="validateNome" placeholder="Digite seu nome completo"
          required />
        <p v-if="errors.nome" class="error-message">{{ errors.nome }}</p>
      </div>
      <div class="input-group">
        <label for="email"><i class="fas fa-envelope"></i> Email</label>
        <input type="email" v-model="formData.email" @input="validateEmail" placeholder="Digite seu email" required />
        <p v-if="errors.email" class="error-message">{{ errors.email }}</p>
      </div>
      <div class="input-group">
        <label for="password"><i class="fas fa-lock"></i> Senha</label>
        <input type="password" v-model="formData.senha" @input="validateSenha" placeholder="Digite sua senha"
          required />
        <p v-if="errors.senha" class="error-message">{{ errors.senha }}</p>
      </div>
      <div class="input-group">
        <label for="type"><i class="fas fa-user-tag"></i> Tipo</label>
        <select v-model="formData.tipo" @change="validateTipo" required>
          <option value="PROFESSOR">Professor</option>
          <option value="COORDENADOR">Coordenador</option>
          <option value="ALUNO">Aluno</option>
        </select>
        <p v-if="errors.tipo" class="error-message">{{ errors.tipo }}</p>
      </div>
      <button :disabled="isFormInvalid" type="submit" class="btn">Cadastrar</button>

      <!-- Link para página de login -->
      <p class="redirect-login">
        Já possui uma conta?
        <router-link to="/login" class="link">Acesse.</router-link>
      </p>
    </form>
  </div>
</template>

<script>
export default {
  props: {
    onSubmit: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      formData: {
        nome: "",
        email: "",
        senha: "",
        tipo: "PROFESSOR",
      },
      errors: {
        nome: null,
        email: null,
        senha: null,
        tipo: null,
      },
    };
  },
  computed: {
    isFormInvalid() {
      return (
        this.errors.nome ||
        this.errors.email ||
        this.errors.senha ||
        this.errors.tipo
      );
    },
  },
  methods: {
    validateNome() {
      const nome = this.formData.nome.trim();
      if (!nome) {
        this.errors.nome = "O nome completo é obrigatório.";
      } else if (nome.split(" ").length < 2) {
        this.errors.nome = "Informe pelo menos nome e sobrenome.";
      } else {
        this.errors.nome = null;
      }
    },
    validateEmail() {
      const email = this.formData.email.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email) {
        this.errors.email = "O email é obrigatório.";
      } else if (!emailRegex.test(email)) {
        this.errors.email = "O formato do email é inválido.";
      } else {
        this.errors.email = null;
      }
    },
    validateSenha() {
      const senha = this.formData.senha;
      const senhaRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!senha) {
        this.errors.senha = "A senha é obrigatória.";
      } else if (!senhaRegex.test(senha)) {
        this.errors.senha =
          "A senha deve ter no mínimo 8 caracteres, incluindo uma letra, um número e um caractere especial.";
      } else {
        this.errors.senha = null;
      }
    },
    validateTipo() {
      const tipo = this.formData.tipo;
      if (!tipo) {
        this.errors.tipo = "O tipo é obrigatório.";
      } else {
        this.errors.tipo = null;
      }
    },
    handleSubmit() {
      // Validar os campos novamente antes de enviar
      this.validateNome();
      this.validateEmail();
      this.validateSenha();
      this.validateTipo();

      if (this.isFormInvalid) return;

      this.onSubmit(this.formData);
      this.resetForm();
    },
    resetForm() {
      this.formData = {
        nome: "",
        email: "",
        senha: "",
        tipo: "PROFESSOR",
      };
    },
  },
};
</script>

<style>
.error-message {
  color: red;
  font-size: 1.2rem;
  margin-top: 5px;
}

.redirect-login {
  text-align: center;
  margin-top: 20px;
  font-size: 14px;
}

.redirect-login .link {
  color: #007bff;
  text-decoration: none;
}

.redirect-login .link:hover {
  text-decoration: underline;
}
</style>
