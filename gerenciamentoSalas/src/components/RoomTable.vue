<template>
  <div>
    <h3>Visualização de Salas</h3>
    <!-- Mensagem de feedback -->
    <div
      v-if="message"
      :class="[
        'message',
        messageType === 'success' ? 'success-message' : 'error',
      ]"
    >
      {{ message }}
    </div>
    <div class="table-container" v-if="rooms.length">
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Descrição</th>
            <th>Capacidade</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="room in rooms" :key="room.id">
            <td>{{ room.nome }}</td>
            <td>{{ room.descricao }}</td>
            <td>{{ room.capacidade }}</td>
            <td
              :class="{
                'status-disponivel': room.status === 'DISPONIVEL',
                'status-manutencao': room.status === 'MANUTENCAO',
                'status-inativa': room.status === 'INATIVA',
              }"
            >
              {{ room.status }}
            </td>
            <td>
              <i
                class="fas fa-edit fa-lg"
                @click="editRoom(room.id)"
                title="Editar"
              ></i>
              <i
                class="fas fa-trash delete-room-btn fa-lg"
                @click="openRoomModal(room.id)"
                title="Excluir"
              ></i>
              <Reserva v-if="room.status === 'DISPONIVEL'" :roomId="room.id" />
            </td>
          </tr>
        </tbody>
      </table>

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

export default {
  components: {
    Modal,
    Reserva,
  },
  data() {
    return {
      rooms: [], // Lista de salas
      message: "", // Mensagens de erro
      showDeleteModal: false, // Controle do modal de exclusão
      roomIdToDelete: null, // Armazena o ID da sala a ser excluída
    };
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
        this.message = "";
        this.messageType = "";
      }, 2000);
    },
    showError(message) {
      this.message = message;
      this.messageType = "error";

      setTimeout(() => {
        this.message = "";
        this.messageType = "";
      }, 2000);
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
            this.showDeleteModal = false;
            console.log("Sala excluída com sucesso!");
          } else {
            throw new Error("Erro ao excluir a sala");
          }
        } catch (error) {
          console.error(error.message);
        }
      }
    },
  },
};
</script>

<style scoped>
h3 {
  font-size: 2rem;
}
</style>
