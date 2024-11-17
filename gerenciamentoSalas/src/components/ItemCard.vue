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
import { mapState } from "vuex";

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
      this.$router.push(
        `/${this.type === "sala" ? "edit-room" : "edit-lab"}/${id}`
      );
    },
    openDeleteModal(id, nome) {
      this.itemToDelete = { id, nome }; // Salva o item a ser excluído
      this.showDeleteModal = true; // Exibe o modal de exclusão
    },
    closeDeleteModal() {
      this.showDeleteModal = false; // Fecha o modal de exclusão
    },
    async deleteItem() {
      try {
        console.log("Tentando excluir item", this.item.id); // Verifique se o ID está correto

        // Faça a requisição DELETE para a API
        const response = await fetch(
          `http://localhost:8080/api/${this.type}s/${this.item.id}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          throw new Error("Erro ao excluir o item");
        }

        // Se a requisição for bem-sucedida, emita o evento para o componente pai
        console.log(`Item com ID ${this.item.id} excluído com sucesso!`);
        this.$emit("itemDeleted", this.item.id); // Emite o evento de exclusão
      } catch (error) {
        console.error("Erro ao excluir o item:", error);
        alert("Erro ao excluir o item"); // Exibe o erro de forma simples
      }
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

.btn-reservar {
  background-color: #28a745; /* Verde para indicar disponibilidade */
  color: #fff; /* Texto branco */
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

.btn-reservar:hover {
  background-color: #218838; /* Tom mais escuro no hover */
}

.btn-reservar:active {
  background-color: #1e7e34; /* Tom ainda mais escuro ao clicar */
}

.btn-reservar:disabled {
  background-color: #6c757d; /* Cinza para estado desativado */
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .card {
    width: 100%;
    max-width: 350px;
  }
}
</style>
