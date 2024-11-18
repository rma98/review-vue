<!-- ReservaForm.vue -->
<template>
  <div class="reserva-form">
    <h3>Fazer Reserva</h3>
    <form @submit.prevent="submitReserva">
      <label for="dataInicio">Data e Hora de Início:</label>
      <input type="datetime-local" v-model="dataInicio" required />

      <label for="dataFim">Data e Hora de Fim:</label>
      <input type="datetime-local" v-model="dataFim" required />

      <!-- Passa o recurso selecionado e ouve o evento de atualização -->
      <Recurso
        :selectedRecurso="recursoAdicional"
        @update:selectedRecurso="recursoAdicional = $event"
      />

      <button type="submit">Reservar</button>
    </form>
  </div>
</template>

<script>
import Recurso from "../views/AddRecurso.vue";

export default {
  components: {
    Recurso,
  },
  props: {
    roomId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      dataInicio: "",
      dataFim: "",
      recursoAdicional: "", // Guarda o ID do recurso selecionado
    };
  },
  methods: {
    submitReserva() {
      const reservaData = {
        dataInicio: this.dataInicio,
        dataFim: this.dataFim,
        recursoId: this.recursoAdicional || null,
        salaId: this.roomId,
      };
      this.$emit("submit-reserva", reservaData);
    },
  },
};
</script>

<style scoped>
</style>
