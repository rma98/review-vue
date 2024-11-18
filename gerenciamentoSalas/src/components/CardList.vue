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
        <!-- Exibe os ícones de edição e exclusão para o Coordenador -->
        <i
          v-if="isLoggedIn && userRole === 'COORDENADOR'"
          class="fas fa-edit"
          @click="editItem(item)"
          title="Editar"
        ></i>
        <i
          v-if="isLoggedIn && userRole === 'COORDENADOR'"
          class="fas fa-trash delete-item-btn"
          @click="openDeleteModal(item)"
          title="Excluir"
        ></i>

        <!-- Exibe o botão de reserva para Coordenadores e Professores -->
        <button
          v-if="isLoggedIn && (userRole === 'COORDENADOR' || userRole === 'PROFESSOR') && item.status === 'DISPONIVEL'"
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
          :itemType="item.tipo"
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
      showDeleteModal: false,
      showReservaModal: false,
      itemIdToDelete: null,
      itemIdToReserve: null,
      itemToDelete: null,
    };
  },
  computed: {
    ...mapState({
      isLoggedIn: (state) => !!state.user.name,
      userRole: (state) => state.user.role,
    }),
  },
  methods: {
    editItem(item) {
      console.log("Editando item com ID:", item.id);
      const route = item.tipo === "laboratorio"
        ? `/edit-lab/${item.id}`
        : `/edit-room/${item.id}`;

      this.$router.push(route);
    },

    openDeleteModal(item) {
      this.itemIdToDelete = item.id;
      this.itemToDelete = item;
      this.showDeleteModal = true;
    },

    async deleteItem() {
      try {
        const url = this.itemToDelete.tipo === "laboratorio"
          ? `http://localhost:8080/api/laboratorios/${this.itemIdToDelete}`
          : `http://localhost:8080/api/salas/${this.itemIdToDelete}`;

        const response = await fetch(url, { method: "DELETE" });

        if (!response.ok) throw new Error("Erro ao excluir o item");

        this.$emit("itemDeleted", this.itemIdToDelete);
        this.showDeleteModal = false;
      } catch (error) {
        console.error(error);
      }
    },

    openReservaModal(id) {
      this.itemIdToReserve = id;
      this.showReservaModal = true;
    },
  },
};
</script>

<style scoped>
.card {
  min-height: 220px;
}
</style>
