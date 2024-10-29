<template>
  <div v-if="showPopup" class="popup" @click.self="$emit('close-popup')">
    <div class="popup-content" @click.stop>
      <span class="close" @click="$emit('close-popup')">x</span>
      <h2>Por favor, faça login para continuar</h2>
      <div class="button-container">
        <button @click="redirectTo('login')">Login</button>
        <button @click="redirectTo('register')">Cadastro</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    showPopup: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    redirectTo(page) {
      this.$router.push(page);
    }
  }
};
</script>

<style scoped>
/* Estilização do Pop-up */
.popup {
  display: flex; /* Flex para centralizar */
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* Fundo semi-transparente */
  z-index: 1000; /* Coloca o pop-up acima de outros elementos */
  justify-content: center; /* Centraliza horizontalmente */
  align-items: center; /* Centraliza verticalmente */
}

/* Conteúdo do Pop-up */
.popup-content {
  background-color: #388e3c; /* Cor de fundo do conteúdo do pop-up */
  border-radius: 8px; /* Bordas arredondadas */
  max-width: 400px; /* Largura máxima do pop-up */
  padding: 15px 20px; /* Espaçamento interno */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2); /* Sombra ao redor do pop-up */
  text-align: center; /* Centraliza o texto dentro do pop-up */
}

/* Estilo do botão de fechar */
.close {
  color: white; /* Cor do botão de fechar */
  float: right; /* Alinha o botão de fechar à direita */
  font-size: 20px; /* Tamanho da fonte */
  font-weight: bold; /* Negrito */
  cursor: pointer; /* Cursor de ponteiro ao passar o mouse */
}

.close:hover {
  color: #4caf50; /* Cor ao passar o mouse */
}

h2 {
  color: white; /* Cor do título */
  margin-bottom: 15px; /* Espaçamento inferior do título */
}

/* Container dos Botões */
.button-container {
  display: flex; /* Flexbox para alinhar os botões */
  flex-direction: column; /* Alinha os botões em coluna */
  gap: 10px; /* Espaçamento entre os botões */
  margin-top: 15px; /* Espaçamento acima dos botões */
}

/* Botões */
button {
  background-color: #4caf50; /* Cor do botão */
  color: white; /* Cor do texto do botão */
  border: none; /* Remove borda */
  border-radius: 4px; /* Bordas arredondadas */
  padding: 10px; /* Espaçamento interno do botão */
  cursor: pointer; /* Cursor de ponteiro ao passar o mouse */
  transition: background-color 0.3s; /* Transição suave ao passar o mouse */
}

/* Efeito de passar o mouse nos botões */
button:hover {
  background-color: #388e3c; /* Cor do botão ao passar o mouse */
}
</style>
