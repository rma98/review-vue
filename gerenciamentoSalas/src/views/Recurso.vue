<!-- Recurso.vue -->
<template>
  <div class="recurso-list">
    <label for="recursoAdicional">Recurso Adicional:</label>
    <select :value="selectedRecurso" @change="updateRecurso($event)" id="recursoAdicional">
      <option value="">Nenhum</option>
      <option v-for="recurso in recursos" :key="recurso.id" :value="recurso.id">
        {{ recurso.nome }}
      </option>
    </select>
  </div>
</template>

<script>
import axios from "axios";

export default {
  props: {
    selectedRecurso: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      recursos: [],
    };
  },
  mounted() {
    this.fetchRecursos();
  },
  methods: {
    async fetchRecursos() {
      try {
        const response = await axios.get("/api/recursos");
        this.recursos = response.data;
      } catch (error) {
        console.error("Erro ao carregar os recursos:", error);
      }
    },
    updateRecurso(event) {
      this.$emit("update:selectedRecurso", event.target.value);
    },
  },
};
</script>
