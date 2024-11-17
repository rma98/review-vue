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

    <!-- Modal de Exclusão -->
    <ModalExcluir
      v-if="showDeleteModal"
      :visible="showDeleteModal"
      :itemName="modalMessage"
      @close="showDeleteModal = false"
      @confirm="deleteLab"
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
      labs: [], // Array que armazenará os laboratórios
      showDeleteModal: false, // Controle do modal de exclusão
      modalMessage: "", // Mensagem do modal
      labIdToDelete: null, // Armazena o id do laboratório a ser excluído
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

    // Função para lidar com a exclusão do laboratório
    async deleteLab() {
      try {
        const response = await fetch(`http://localhost:8080/api/laboratorios/${this.labIdToDelete}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error(`Erro ao excluir o laboratório: ${response.statusText}`);
        }

        // Atualizar a lista localmente (remover o laboratório excluído da lista)
        this.labs = this.labs.filter(lab => lab.id !== this.labIdToDelete);

        // Fechar o modal de exclusão
        this.showDeleteModal = false;
      } catch (error) {
        console.error(error);
        this.modalMessage = `Erro ao excluir o laboratório: ${error.message}`;
        this.showDeleteModal = true; // Exibe o modal de erro
      }
    },

    // Função para lidar com a exclusão do item diretamente na lista
    handleItemDeleted(id) {
      console.log(`Laboratório com ID ${id} foi excluído.`);
      this.labs = this.labs.filter(lab => lab.id !== id); // Remove o laboratório excluído da lista
    },
  },
};
</script>
