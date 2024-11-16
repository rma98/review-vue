<!-- ItemCard.vue -->
<template>
  <div
    class="card"
    :class="{
      'status-disponivel': item.status === 'DISPONIVEL',
      'status-manutencao': item.status === 'MANUTENCAO',
      'status-inativa': item.status === 'INATIVA',
    }"
  >
    <div class="card-header">
      <h4>{{ item.nome }}</h4>
      <span class="status-icon">
        <i
          :class="{
            'fas fa-check-circle': item.status === 'DISPONIVEL',
            'fas fa-cogs': item.status === 'MANUTENCAO',
            'fas fa-times-circle': item.status === 'INATIVA',
          }"
          :title="item.status"
        ></i>
      </span>
    </div>
    <p><strong>Descrição:</strong> {{ item.descricao }}</p>
    <p><strong>Capacidade:</strong> {{ item.capacidade }}</p>
    <div class="actions">
      <i
        v-if="isLoggedIn && userRole === 'COORDENADOR'"
        class="fas fa-edit"
        @click="editItem(item.id)"
        title="Editar"
      ></i>
      <i
        v-if="isLoggedIn && userRole === 'COORDENADOR'"
        class="fas fa-trash delete-item-btn"
        @click="openModal(item.id)"
        title="Excluir"
      ></i>
      <Reserva
        v-if="isLoggedIn && (userRole === 'COORDENADOR' || userRole === 'PROFESSOR') && item.status === 'DISPONIVEL'"
        :itemId="item.id"
      />
    </div>
  </div>
</template>

<script>
import Reserva from "../views/Reserva.vue";
import { mapState } from "vuex";

export default {
  components: {
    Reserva,
  },
  props: {
    item: Object, // Para receber a sala ou laboratório
    type: String, // Define se é "sala" ou "laboratorio"
  },
  computed: {
    ...mapState({
      isLoggedIn: (state) => !!state.user.name,
      userRole: (state) => state.user.role,
    }),
  },
  methods: {
    editItem(id) {
      this.$router.push(`/${this.type === 'sala' ? 'edit-room' : 'edit-lab'}/${id}`);
    },
    openModal(id) {
      this.$emit("openModal", id); // Emite o evento para o componente pai
    },
  },
};
</script>

<style scoped>
/* Estilos comuns para lab-card e room-card */
.card-carousel {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
  padding: 20px;
}

.carousel-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
}

.card {
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  width: 280px;
  padding: 20px;
  transition: transform 0.3s ease;
}

.card:hover {
  transform: scale(1.05);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.6rem;
  margin-bottom: 10px;
}

.status-icon {
  font-size: 1.3rem;
}

.card p {
  font-size: 1.5rem;
  margin-bottom: 10px;
}

.actions {
  display: flex;
  justify-content: space-around;
}

.actions i {
  cursor: pointer;
  font-size: 1.3em;
}

.status-disponivel {
  border-left: 5px solid #4caf50;
}

.status-manutencao {
  border-left: 5px solid #ff9800;
}

.status-inativa {
  border-left: 5px solid #f44336;
}

@media (max-width: 768px) {
  .card {
    width: 100%;
    max-width: 350px;
  }
}
</style>
