<template>
  <div class="card-carousel">
    <div v-if="rooms.length" class="carousel-container">
      <ItemCard
        v-for="room in rooms"
        :key="room.id"
        :item="room"
        :type="'sala'"
        @itemDeleted="handleItemDeleted"
      />
    </div>
    <div v-else>
      <p>Nenhuma sala encontrada.</p>
    </div>
  </div>
</template>

<script>
import ItemCard from "../components/ItemCard.vue";
import { mapState } from "vuex";

export default {
  components: {
    ItemCard,
  },
  data() {
    return {
      rooms: [], // Array que armazenará as salas
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
        const response = await fetch(
          "http://localhost:8080/api/recursos?tipo=Sala" // URL da API com filtro por tipo 'Sala'
        ); 

        if (!response.ok) {
          throw new Error("Erro ao carregar as salas");
        }

        const data = await response.json();
        this.rooms = data; // Armazena diretamente os dados retornados pela API
      } catch (error) {
        console.error(error);
      }
    },
    // Função para lidar com a exclusão do item
    handleItemDeleted(id) {
      console.log(`Sala com ID ${id} foi excluída.`);
      this.rooms = this.rooms.filter((room) => room.id !== id); // Remove a sala excluída da lista
    },
  },
};
</script>
