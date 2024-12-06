<template>
  <div v-if="show" class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <button class="close-button" @click="close">&times;</button>

      <!-- Exibindo o componente Reserva com feedback de carregamento -->
      <Reserva :itemId="itemId" @close="close" :loading="loading" />

      <!-- Exibindo mensagem de carregamento -->
      <div v-if="loading" class="loading-message">Carregando...</div>
    </div>
  </div>
</template>

<script>
import Reserva from "../views/Reserva.vue";

export default {
  components: { Reserva },
  props: {
    show: {
      type: Boolean,
      required: true,
    },
    itemId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      loading: false,
    };
  },
  methods: {
    close() {
      this.$emit("close");
    },
    // Método para atualizar o estado de carregamento
    setLoading(state) {
      this.loading = state;
    },
  },
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  transition: opacity 0.3s ease;
}

.modal-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  position: relative;
  animation: modal-in 0.3s ease-out;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}

.loading-message {
  margin-top: 20px;
  color: #666;
  font-size: 1rem;
  text-align: center;
}

/* Animação de entrada do modal */
@keyframes modal-in {
  from {
    transform: scale(0.8);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
