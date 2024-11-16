<template>
  <section class="section-cards">
    <!-- Itera sobre as salas -->
    <div v-for="(room, index) in rooms" :key="'room-' + index" class="card" 
         :class="{
           'status-disponivel': room.status === 'DISPONIVEL',
           'status-manutencao': room.status === 'MANUTENCAO',
           'status-inativa': room.status === 'INATIVA',
         }">
      <div class="card-header">
        <h4>{{ room.nome }}</h4>
        <span class="status-icon">
          <i
            :class="{
              'fas fa-check-circle': room.status === 'DISPONIVEL',
              'fas fa-cogs': room.status === 'MANUTENCAO',
              'fas fa-times-circle': room.status === 'INATIVA',
            }"
            :title="room.status"
          ></i>
        </span>
      </div>
      <p><strong>Descrição:</strong> {{ room.descricao }}</p>
      <p><strong>Capacidade:</strong> {{ room.capacidade }}</p>
      <div class="actions">
        <i
          v-if="isLoggedIn && userRole === 'COORDENADOR'"
          class="fas fa-edit"
          @click="editItem(room.id, 'sala')"
          title="Editar"
        ></i>
        <i
          v-if="isLoggedIn && userRole === 'COORDENADOR'"
          class="fas fa-trash delete-item-btn"
          @click="openModal(room.id)"
          title="Excluir"
        ></i>
        <Reserva
          v-if="isLoggedIn && (userRole === 'COORDENADOR' || userRole === 'PROFESSOR') && room.status === 'DISPONIVEL'"
          :itemId="room.id"
        />
      </div>
    </div>

    <!-- Itera sobre os laboratórios -->
    <div v-for="(lab, index) in labs" :key="'lab-' + index" class="card"
         :class="{
           'status-disponivel': lab.status === 'DISPONIVEL',
           'status-manutencao': lab.status === 'MANUTENCAO',
           'status-inativa': lab.status === 'INATIVA',
         }">
      <div class="card-header">
        <h4>{{ lab.nome }}</h4>
        <span class="status-icon">
          <i
            :class="{
              'fas fa-check-circle': lab.status === 'DISPONIVEL',
              'fas fa-cogs': lab.status === 'MANUTENCAO',
              'fas fa-times-circle': lab.status === 'INATIVA',
            }"
            :title="lab.status"
          ></i>
        </span>
      </div>
      <p><strong>Descrição:</strong> {{ lab.descricao }}</p>
      <p><strong>Capacidade:</strong> {{ lab.capacidade }}</p>
      <div class="actions">
        <i
          v-if="isLoggedIn && userRole === 'COORDENADOR'"
          class="fas fa-edit"
          @click="editItem(lab.id, 'laboratorio')"
          title="Editar"
        ></i>
        <i
          v-if="isLoggedIn && userRole === 'COORDENADOR'"
          class="fas fa-trash delete-item-btn"
          @click="openModal(lab.id)"
          title="Excluir"
        ></i>
        <Reserva
          v-if="isLoggedIn && (userRole === 'COORDENADOR' || userRole === 'PROFESSOR') && lab.status === 'DISPONIVEL'"
          :itemId="lab.id"
        />
      </div>
    </div>
  </section>
</template>

<script>
import Reserva from "../views/Reserva.vue";
import { mapState } from "vuex";

export default {
  components: {
    Reserva,
  },
  props: {
    rooms: Array,
    labs: Array,
  },
  computed: {
    ...mapState({
      isLoggedIn: (state) => !!state.user.name,
      userRole: (state) => state.user.role,
    }),
  },
  methods: {
    editItem(id, type) {
      this.$router.push(`/${type === 'sala' ? 'edit-room' : 'edit-lab'}/${id}`);
    },
    openModal(id) {
      this.$emit("openModal", id); // Emite o evento para o componente pai
    },
  },
};
</script>

<style scoped>
.section-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-top: 30px;
}

.card {
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
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
}

.status-icon {
  font-size: 1.5rem;
  color: var(--primary-color);
}
</style>
