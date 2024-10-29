<!-- Reserva.vue -->
<template>
  <div>
    <ReservaForm
      v-if="showForm"
      :roomId="roomId"
      @submit-reserva="handleReserva"
    />
    <button v-else @click="toggleForm" class="reserve-button">
      Reservar
    </button>
    <p v-if="message" :class="messageType">{{ message }}</p>
  </div>
</template>

<script>
import axios from "axios";
import ReservaForm from "../components/ReservaForm.vue";

export default {
  components: {
    ReservaForm,
  },
  props: {
    roomId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      showForm: false,
      message: "",
      messageType: "",
    };
  },
  methods: {
    toggleForm() {
      this.showForm = !this.showForm;
    },
    async handleReserva(reservaData) {
      try {
        const response = await axios.post("/api/reservas", {
          ...reservaData,
          usuarioId: this.$store.state.usuario.id, // ID do usuário logado
        });
        this.message = response.data;
        this.messageType = "success";
        this.showForm = false;
      } catch (error) {
        this.message = error.response?.data || "Erro ao reservar a sala.";
        this.messageType = "error";
      }
    },
  },
};
</script>

<style scoped>
.reserve-button {
    font-size: 1.4rem;
    background-color: #4caf50;
    color: white;
    border: none;
    padding: 5px 10px;
    cursor: pointer;
    margin-left: 5px;
    border-radius: 4px;
}
.reserve-button:hover {
    background-color: #45a049;
}
.success {
  color: green;
}
.error {
  color: red;
}
</style>
