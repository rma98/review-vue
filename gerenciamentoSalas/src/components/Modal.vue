<template>
  <div v-if="visible" class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <span class="close" @click="close">&times;</span>
      <h2>{{ title }}</h2>
      <p>{{ message }}</p>
      <div class="modal-actions">
        <button @click="confirm">Confirmar</button>
        <button @click="close">Cancelar</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: "Confirmar Exclusão",
    },
    message: {
      type: String,
      default: "Você tem certeza que deseja realizar esta ação?",
    },
    visible: {
      type: Boolean,
      required: true,
    },
  },
  methods: {
    confirm() {
      this.$emit("confirm"); // Dispara o evento de confirmação
      this.close();
    },
    close() {
      this.$emit("close"); // Dispara o evento de fechamento
    },
  },
};
</script>

<style scoped>
.modal-overlay {
  display: block;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}

.modal-content {
  background-color: #fff;
  margin: 15% auto;
  padding: 20px;
  width: 300px;
  border-radius: 8px;
  text-align: center;
  position: relative;
}

.close {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 24px;
  cursor: pointer;
}

.modal-actions {
  margin-top: 20px;
}

.modal-actions button {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  margin-right: 10px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.modal-actions button:hover {
  background-color: #3d8b40;
}
</style>
