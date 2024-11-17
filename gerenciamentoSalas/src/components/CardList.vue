<template>
  <div class="card-carousel">
    <div
      v-for="item in rooms.concat(labs)"
      :key="item.id"
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
          @click="editItem(item.id, item.type)"
          title="Editar"
        ></i>
        <i
          v-if="isLoggedIn && userRole === 'COORDENADOR'"
          class="fas fa-trash delete-item-btn"
          @click="openDeleteModal(item.id, item.type)"
          title="Excluir"
        ></i>
        <button
          v-if="
            isLoggedIn &&
            (userRole === 'COORDENADOR' || userRole === 'PROFESSOR') &&
            item.status === 'DISPONIVEL'
          "
          @click="openReservaModal(item.id)"
          class="btn-reservar"
        >
          Reservar
        </button>

        <!-- Modal de Reserva -->
        <ModalReserva
          v-if="showReservaModal && itemIdToReserve === item.id"
          :show="showReservaModal"
          :itemId="item.id"
          @close="showReservaModal = false"
        />

        <!-- Modal de Exclusão -->
        <ModalExcluir
          :visible="showDeleteModal"
          :itemName="itemToDelete ? itemToDelete.nome : ''"
          @close="showDeleteModal = false"
          @confirm="deleteItem"
        />
      </div>
    </div>
  </div>
</template>

<script>
import ModalExcluir from "./ModalExcluir.vue";
import ModalReserva from "./ModalReserva.vue";
import { mapState } from "vuex";

export default {
  components: {
    ModalExcluir,
    ModalReserva,
  },
  props: {
    rooms: Array,
    labs: Array,
  },
  data() {
    return {
      showDeleteModal: false, // Controle do modal de exclusão
      showReservaModal: false, // Controle do modal de reserva
      itemIdToDelete: null, // Armazena o id do item a ser excluído
      itemIdToReserve: null, // Armazena o id do item a ser reservado
    };
  },
  computed: {
    ...mapState({
      isLoggedIn: (state) => !!state.user.name,
      userRole: (state) => state.user.role,
    }),
  },
  methods: {
    editItem(id, type) {
      console.log("Editando item com ID:", id, "Tipo:", type); // Verifique o valor do tipo
      if (type === "sala") {
        this.$router.push(`/edit-room/${id}`);
      } else if (type === "laboratorio") {
        this.$router.push(`/edit-lab/${id}`);
      } else {
        console.error("Tipo desconhecido:", type);
      }
    },
    // Abrir o modal de exclusão
    openDeleteModal(id, type) {
      this.itemIdToDelete = id;
      this.modalMessage =
        type === "sala"
          ? "Você tem certeza que deseja excluir esta sala?"
          : "Você tem certeza que deseja excluir este laboratório?";
      this.showDeleteModal = true;
    },

    // Função para excluir o item
    async deleteItem() {
      try {
        const url = this.itemIdToDelete
          ? `http://localhost:8080/api/${
              this.modalMessage.includes("sala") ? "salas" : "laboratorios"
            }/${this.itemIdToDelete}`
          : "";
        const response = await fetch(url, { method: "DELETE" });
        if (!response.ok) throw new Error("Erro ao excluir o item");

        // Emite evento de item deletado
        this.$emit("itemDeleted", this.itemIdToDelete);
        this.showDeleteModal = false; // Fecha o modal
      } catch (error) {
        console.error(error);
      }
    },

    // Abrir o modal de reserva
    openReservaModal(id) {
      this.itemIdToReserve = id; // Armazena o ID do item a ser reservado
      this.showReservaModal = true; // Exibe o modal de reserva
    },

    // Função para realizar a reserva
    async reserveItem() {
      try {
        // Aqui você pode implementar a lógica de reserva, por enquanto estamos apenas exibindo um log
        console.log(
          `Reserva realizada para o item com ID: ${this.itemIdToReserve}`
        );

        // Exemplo de chamada para API para realizar a reserva (ajustar conforme necessário)
        const url = `http://localhost:8080/api/reservas`;
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            itemId: this.itemIdToReserve,
            userId: this.$store.state.user.id,
          }),
        });

        if (!response.ok) throw new Error("Erro ao reservar o item");

        // Fechar o modal de reserva após a confirmação
        this.showReservaModal = false;
        this.$emit("itemReserved", this.itemIdToReserve); // Emite evento para atualizar a lista de itens
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>

<style scoped>
.card {
  min-height: 220px;
}
</style>
