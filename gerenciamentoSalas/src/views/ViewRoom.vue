<template>
  <div class="card-carousel">
    <div v-if="rooms.length" class="carousel-container">
      <ItemCard
        v-for="room in rooms"
        :key="room.id"
        :item="room"
        :type="'sala'"
        @openModal="openRoomModal"
        @itemDeleted="handleItemDeleted"
      />
    </div>
    <div v-else>
      <p>Nenhuma sala encontrada.</p>
    </div>

    <!-- Modal de Exclusão -->
    <ModalExcluir
      v-if="showDeleteModal"
      :visible="showDeleteModal"
      :itemName="modalMessage"
      @close="showDeleteModal = false"
      @confirm="deleteRoom"
    />
  </div>
</template>

<script>
import ItemCard from "../components/ItemCard.vue";
import ModalExcluir from "../components/ModalExcluir.vue";
import { mapState } from "vuex";

export default {
  components: {
    ItemCard,
    ModalExcluir,
  },
  data() {
    return {
      rooms: [], // Array que armazenará as salas
      showDeleteModal: false, // Controle do modal de exclusão
      modalMessage: "", // Mensagem do modal
      roomIdToDelete: null, // Armazena o id da sala a ser excluída
    };
  },
  computed: {
    ...mapState({
      isLoggedIn: (state) => !!state.user.name,
      userRole: (state) => state.user.role,
    }),
  },
  created() {
    this.loadRooms(); // Carregar as salas assim que o componente for criado
  },
  methods: {
    // Função para carregar as salas da API
    async loadRooms() {
      try {
        const response = await fetch("http://localhost:8080/api/salas"); // URL da API para buscar as salas

        if (!response.ok) {
          throw new Error("Erro ao carregar as salas");
        }

        const data = await response.json();
        this.rooms = data; // Preenche o array de salas com os dados recebidos

      } catch (error) {
        console.error(error);
        this.modalMessage = "Erro ao carregar as salas."; // Exibe uma mensagem de erro, se necessário
        this.showDeleteModal = true;
      }
    },

    // Função para abrir o modal de exclusão da sala
    openRoomModal(id) {
      this.roomIdToDelete = id;
      this.showDeleteModal = true;
      this.modalMessage = "Você tem certeza que deseja excluir esta sala?";
    },

    // Função para lidar com a exclusão do item
    handleItemDeleted(id) {
      console.log(`Sala com ID ${id} foi excluída.`);
      this.rooms = this.rooms.filter(room => room.id !== id); // Remove a sala excluída da lista
    },
  },
};
</script>
