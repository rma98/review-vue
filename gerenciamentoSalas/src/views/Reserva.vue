<template>
  <div>
    <ReservaForm
      v-if="showForm"
      :itemId="itemId"
      :itemType="itemType"
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
    itemId: {
      type: Number,
      required: true,
    },
    itemType: {
      type: String,
      required: true, // "sala" ou "laboratorio"
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
        // Definir o endpoint dependendo do tipo do item (sala ou laboratório)
        const endpoint = this.itemType === "laboratorio" 
          ? `/api/laboratorios/${this.itemId}/reservas` 
          : `/api/salas/${this.itemId}/reservas`;

        const response = await axios.post(endpoint, {
          ...reservaData,
          usuarioId: this.$store.state.usuario.id, // ID do usuário logado
        });
        this.message = response.data;
        this.messageType = "success";
        this.showForm = false;
      } catch (error) {
        this.message = error.response?.data || "Erro ao reservar o item.";
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
