<!-- ViewLab.vue -->
<template>
  <div class="card-carousel">
    <div v-if="labs.length" class="carousel-container">
      <ItemCard
        v-for="lab in labs"
        :key="lab.id"
        :item="lab"
        :type="'laboratorio'"
        @openModal="openLabModal"
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
      labs: [], // Array para armazenar os laboratórios
      showDeleteModal: false, // Controle do modal de exclusão
      modalMessage: "", // Mensagem do modal
      labIdToDelete: null, // Armazena o ID do laboratório a ser excluído
    };
  },
  computed: {
    ...mapState({
      isLoggedIn: (state) => !!state.user.name, // Checa se o usuário está logado
      userRole: (state) => state.user.role, // Obtemos o papel do usuário
    }),
  },
  created() {
    this.loadLabs(); // Carregar os laboratórios assim que o componente for criado
  },
  methods: {
    // Função para carregar os laboratórios da API
    async loadLabs() {
      try {
        const response = await fetch("http://localhost:8080/api/laboratorios"); // URL da API para buscar os laboratórios

        if (!response.ok) {
          throw new Error("Erro ao carregar os laboratórios");
        }

        const data = await response.json();
        this.labs = data; // Preenche o array de laboratórios com os dados recebidos

      } catch (error) {
        console.error(error);
        this.modalMessage = "Erro ao carregar os laboratórios."; // Exibe uma mensagem de erro, se necessário
        this.showDeleteModal = true;
      }
    },

    // Função para abrir o modal de exclusão do laboratório
    openLabModal(id) {
      this.labIdToDelete = id;
      this.showDeleteModal = true;
      this.modalMessage = "Você tem certeza que deseja excluir este laboratório?";
    },
  },
};
</script>
