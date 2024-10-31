<!-- RegisterForm.vue -->
<template>
  <div class="form-container">
    <h2>Cadastro</h2>
    <form @submit.prevent="handleSubmit">
      <div class="input-group">
        <label for="name"><i class="fas fa-user"></i> Nome Completo</label>
        <input
          type="text"
          v-model="formData.nome"
          placeholder="Digite seu nome completo"
          required
        />
      </div>
      <div class="input-group">
        <label for="email"><i class="fas fa-envelope"></i> Email</label>
        <input
          type="email"
          v-model="formData.email"
          placeholder="Digite seu email"
          required
        />
      </div>
      <div class="input-group">
        <label for="password"><i class="fas fa-lock"></i> Senha</label>
        <input
          type="password"
          v-model="formData.senha"
          placeholder="Digite sua senha"
          required
        />
      </div>
      <div class="input-group">
        <label for="type"><i class="fas fa-user-tag"></i> Tipo</label>
        <select v-model="formData.tipo" required>
          <option value="PROFESSOR">Professor</option>
          <option value="COORDENADOR">Coordenador</option>
          <option value="ALUNO">Aluno</option>
        </select>
      </div>
      <button type="submit" class="btn">Cadastrar</button>
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
    };
  },
  methods: {
    handleSubmit() {
      // Você pode adicionar validação adicional aqui se desejar
      this.onSubmit(this.formData);

      // Limpar os campos do formulário após a submissão
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

<style scoped>
</style>
