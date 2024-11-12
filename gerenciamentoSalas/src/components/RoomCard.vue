<template>
  <div class="room-card-carousel">
    <div v-if="rooms.length" class="carousel-container">
      <div
        class="room-card"
        v-for="room in rooms"
        :key="room.id"
        :class="{
          'status-disponivel': room.status === 'DISPONIVEL',
          'status-manutencao': room.status === 'MANUTENCAO',
          'status-inativa': room.status === 'INATIVA',
        }"
      >
        <div class="room-card-header">
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
            @click="editRoom(room.id)"
            title="Editar"
          ></i>
          <i
            v-if="isLoggedIn && userRole === 'COORDENADOR'"
            class="fas fa-trash delete-room-btn"
            @click="openRoomModal(room.id)"
            title="Excluir"
          ></i>
          <Reserva
            v-if="isLoggedIn && (userRole === 'COORDENADOR' || userRole === 'PROFESSOR') && room.status === 'DISPONIVEL'"
            :roomId="room.id"
          />
        </div>
      </div>
      <!-- Usando o componente Modal -->
      <Modal
        v-if="showDeleteModal"
        :visible="showDeleteModal"
        :message="modalMessage"
        @confirm="confirmDeleteRoom"
        @close="closeRoomModal"
      />
    </div>
    <div v-else>
      <p>Nenhuma sala encontrada.</p>
    </div>
  </div>
</template>

<script>
import Modal from "../components/Modal.vue";
import Reserva from "../views/Reserva.vue";
import { mapState } from "vuex"; // Importando mapState para computar isLoggedIn e userRole

export default {
  components: {
    Modal,
    Reserva,
  },
  data() {
    return {
      rooms: [], // Lista de salas
      message: "", // Mensagens de erro
      messageType: "", // Tipo de mensagem
      showDeleteModal: false, // Controle do modal de exclusão
      modalMessage: "", // Mensagem do modal
      roomIdToDelete: null, // Armazena o ID da sala a ser excluída
    };
  },
  computed: {
    ...mapState({
      isLoggedIn: (state) => !!state.user.name, // Usuário logado se houver um nome
      userRole: (state) => state.user.role, // Obtemos o papel do usuário
    }),
  },
  created() {
    this.loadRooms();
  },
  methods: {
    async loadRooms() {
      try {
        const response = await fetch("http://localhost:8080/api/salas");
        if (!response.ok) {
          throw new Error("Erro ao carregar as salas");
        }
        this.rooms = await response.json();
      } catch (error) {
        this.showError(error.message);
      }
    },
    showSuccessMessage(message) {
      this.message = message;
      this.messageType = "success";
      setTimeout(() => {
        this.clearMessage();
      }, 2000);
    },
    showError(message) {
      this.message = message;
      this.messageType = "error";
      setTimeout(() => {
        this.clearMessage();
      }, 2000);
    },
    clearMessage() {
      this.message = "";
      this.messageType = "";
    },
    editRoom(id) {
      this.$router.push(`/edit-room/${id}`);
    },
    openRoomModal(id) {
      this.roomIdToDelete = id;
      this.showDeleteModal = true; // Exibe o modal ao clicar no botão de excluir
      this.modalMessage = "Você tem certeza que deseja excluir esta sala?";
    },
    closeRoomModal() {
      this.showDeleteModal = false; // Fecha o modal
      this.roomIdToDelete = null; // Limpa o ID da sala
    },
    async confirmDeleteRoom() {
      if (this.roomIdToDelete) {
        try {
          const response = await fetch(
            `http://localhost:8080/api/salas/${this.roomIdToDelete}`,
            {
              method: "DELETE",
            }
          );

          if (response.ok) {
            this.showSuccessMessage("Sala excluída com sucesso!");
            await this.loadRooms();
            this.closeRoomModal();
            console.log("Sala excluída com sucesso!");
          } else {
            throw new Error("Erro ao excluir a sala");
          }
        } catch (error) {
          this.showError("Erro ao excluir a sala");
          console.error(error.message);
        }
      }
    },
  },
};
</script>

<style scoped>
.room-card-carousel {
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

.room-card {
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  width: 280px;
  padding: 20px;
  transition: transform 0.3s ease;
}

.room-card:hover {
  transform: scale(1.05);
}

.room-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.1em;
  margin-bottom: 10px;
}

.status-icon {
  font-size: 1.3em;
}

.room-card p {
  font-size: 1em;
  margin-bottom: 10px;
}

.actions {
  display: flex;
  justify-content: space-around;
}

.actions i {
  cursor: pointer;
  font-size: 1.2em;
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
  .room-card {
    width: 100%;
    max-width: 350px;
  }
}
</style>
