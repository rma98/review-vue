<template>
  <div class="card" :class="cardClasses">
    <div class="card-header">
      <h4>{{ item.nome }}</h4>
      <span class="status-icon">
        <i :class="statusIconClass" :title="item.status"></i>
      </span>
    </div>

    <p><strong>Descrição:</strong> {{ item.descricao }}</p>
    <p><strong>Capacidade:</strong> {{ item.capacidade }}</p>
    <p><strong>Localização:</strong> {{ item.localizacao }}</p>

    <!-- Modais para ações -->
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
        @click="openDeleteModal(item.id, item.nome)"
        title="Excluir"
      ></i>
      <button
        v-if="
          isLoggedIn &&
          (userRole === 'COORDENADOR' || userRole === 'PROFESSOR') &&
          item.status === 'DISPONIVEL'
        "
        @click="showReservaModal = true"
        class="btn-reservar"
      >
        Reservar
      </button>

      <!-- Modal de Reserva -->
      <ModalReserva
        v-if="showReservaModal"
        :show="showReservaModal"
        :itemId="item.id"
        @close="showReservaModal = false"
      />

      <!-- Modal de Exclusão -->
      <ModalExcluir
        :visible="showDeleteModal"
        :itemName="itemToDelete.nome"
        @close="closeDeleteModal"
        @confirm="deleteItem(itemToDelete.id)"
      />
    </div>
  </div>
</template>

<script>
import ModalReserva from "./ModalReserva.vue";
import ModalExcluir from "./ModalExcluir.vue";
import { mapState, mapActions } from "vuex";

export default {
  components: {
    ModalReserva,
    ModalExcluir,
  },
  data() {
    return {
      showReservaModal: false, // Controle do modal de reserva
      showDeleteModal: false, // Controle do modal de exclusão
      itemToDelete: {}, // Armazena o item a ser excluído
    };
  },
  props: {
    item: Object, // Para receber o recurso genérico (sala, laboratório, etc.)
  },
  computed: {
    ...mapState({
      isLoggedIn: (state) => !!state.user.name,
      userRole: (state) => state.user.role,
    }),

    // Computada para retornar as classes do card dependendo do status do item
    cardClasses() {
      return {
        "status-disponivel": this.item.status === "DISPONIVEL",
        "status-manutencao": this.item.status === "MANUTENCAO",
        "status-inativa": this.item.status === "INATIVA",
      };
    },

    // Computada para retornar a classe do ícone do status
    statusIconClass() {
      switch (this.item.status) {
        case "DISPONIVEL":
          return "fas fa-check-circle";
        case "MANUTENCAO":
          return "fas fa-cogs";
        case "INATIVA":
          return "fas fa-times-circle";
        default:
          return "";
      }
    },
  },
  methods: {
    ...mapActions({
      removeResource: "removeResource", // Ação para remover um recurso da lista no Vuex
    }),

    editItem(id) {
      // Determina o tipo de recurso (sala, laboratório, etc.)
      const resourceType = this.item.tipoRecurso || "geral"; // Se o tipo não for especificado, usa 'geral'

      // Redireciona para o componente EditRecurso.vue passando o ID do item
      this.$router.push(`/editar-recurso/${resourceType}/${id}`);
    },
    openDeleteModal(id, nome) {
      this.itemToDelete = { id, nome }; // Salva o item a ser excluído
      this.showDeleteModal = true; // Exibe o modal de exclusão
    },
    closeDeleteModal() {
      this.showDeleteModal = false; // Fecha o modal de exclusão
    },
    async deleteItem(id) {
      try {
        // Exclui o recurso via Vuex (chama a ação)
        await this.$store.dispatch("deleteResource", id); // Ação Vuex agora lida com a requisição e exclusão

        // Recarrega a lista de recursos após a exclusão
        await this.$store.dispatch("fetchResources");

        // Sucesso ao excluir
        this.closeDeleteModal(); // Fecha o modal de exclusão
        this.showSuccessMessage("Recurso excluído com sucesso!");
        console.log("Recurso excluído com sucesso!");
      } catch (error) {
        // Em caso de erro
        this.showError("Erro ao excluir o recurso");
        console.error(error.message);
      }
    },
    showSuccessMessage(message) {
      // Exibe uma mensagem de sucesso
      alert(message);
    },
    showError(message) {
      // Exibe uma mensagem de erro
      alert(message);
    },
  },
};
</script>

<style scoped>
.card {
  min-height: 220px;
  transition: transform 0.3s ease;
}

/* Feedback visual de hover */
.card:hover {
  transform: translateY(-5px);
}

/* Adicionando bordas e cores para status */
.status-disponivel {
  border: 2px solid green;
  background-color: #e0f7e0;
}

.status-manutencao {
  border: 2px solid orange;
  background-color: #fff3e0;
}

.status-inativa {
  border: 2px solid red;
  background-color: #ffebee;
}

.status-icon {
  font-size: 1.5rem;
  color: inherit;
}

/* Animações e ajustes para botões de ação */
.actions i {
  cursor: pointer;
  margin-right: 15px;
}

.actions .delete-item-btn {
  color: red;
}

.btn-reservar {
  background-color: #4caf50;
  color: white;
  padding: 10px 15px;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  border-radius: 5px;
  margin-top: 10px;
}

.btn-reservar:hover {
  background-color: #45a049;
}
</style>
