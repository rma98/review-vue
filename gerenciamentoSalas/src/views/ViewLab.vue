<template>
  <div class="card-carousel">
    <div v-if="labs.length" class="carousel-container">
      <ItemCard
        v-for="lab in labs"
        :key="lab.id"
        :item="lab"
        :type="'laboratorio'"
        @openModal="openLabModal"
        @itemDeleted="handleItemDeleted"
      />
    </div>
    <div v-else>
      <p>Nenhum laboratório encontrado.</p>
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
      labs: [], // Array que armazenará os laboratórios
      showDeleteModal: false, // Controle do modal de exclusão (agora gerenciado pelo ItemCard)
      modalMessage: "", // Mensagem do modal (não necessária aqui)
      labIdToDelete: null, // Armazena o id do laboratório a ser excluído (não necessária aqui)
    };
  },
  computed: {
    ...mapState({
      isLoggedIn: (state) => !!state.user.name,
      userRole: (state) => state.user.role,
    }),
  },
  created() {
    this.loadLabs(); // Carregar os laboratórios assim que o componente for criado
  },
  methods: {
    // Função para carregar os laboratórios da API
    async loadLabs() {
      try {
        const response = await fetch("http://localhost:8080/api/recursos"); // URL unificada da API para buscar os recursos

        if (!response.ok) {
          throw new Error("Erro ao carregar os laboratórios");
        }

        const data = await response.json();
        // Filtra os dados para exibir apenas os laboratórios
        this.labs = data.filter(recurso => recurso.tipo === 'LABORATORIO');
      } catch (error) {
        console.error(error);
        alert("Erro ao carregar os laboratórios.");
      }
    },

    // Função para lidar com a exclusão do item
    handleItemDeleted(id) {
      console.log(`Laboratório com ID ${id} foi excluído.`);
      this.labs = this.labs.filter(lab => lab.id !== id); // Remove o laboratório excluído da lista
    },
  },
};
</script>
