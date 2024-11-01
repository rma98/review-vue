<template>
  <div>
    <h3>Visualização de Laboratórios</h3>
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
    <div class="table-container" v-if="labs.length">
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
          <tr v-for="lab in labs" :key="lab.id">
            <td>{{ lab.nome }}</td>
            <td>{{ lab.descricao }}</td>
            <td>{{ lab.capacidade }}</td>
            <td
              :class="{
                'status-disponivel': lab.status === 'DISPONIVEL',
                'status-manutencao': lab.status === 'MANUTENCAO',
                'status-inativa': lab.status === 'INATIVA',
              }"
            >
              {{ lab.status }}
            </td>
            <td>
              <i
                v-if="isLoggedIn && userRole === 'Coordenador'"
                class="fas fa-edit fa-lg"
                @click="editLab(lab.id)"
                title="Editar"
              ></i>
              <i
                v-if="isLoggedIn && userRole === 'Coordenador'"
                class="fas fa-trash fa-lg"
                @click="openModal(lab.id)"
                title="Excluir"
              ></i>
              <Reserva
                v-if="
                  isLoggedIn &&
                  (userRole === 'Coordenador' || userRole === 'Professor') &&
                  room.status === 'DISPONIVEL'
                "
                :roomId="room.id"
              />
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Usando o componente Modal -->
      <Modal
        v-if="showDeleteModal"
        :visible="showDeleteModal"
        :message="modalMessage"
        @confirm="confirmDeleteLab"
        @close="closeLabModal"
      />
    </div>
    <div v-else>
      <p>Não há laboratórios disponíveis.</p>
    </div>
  </div>
</template>

<script>
import Modal from "../components/Modal.vue";
import Reserva from "../views/Reserva.vue";
import { mapState } from "vuex"; // Importando mapState para computar isLoggedIn e userRole

export default {
  components: {
    Modal,
    Reserva,
  },
  data() {
    return {
      labs: [],
      message: "",
      showDeleteModal: false, // Inicialize como false
      labIdToDelete: null, // Inicialize como null
    };
  },
  computed: {
    ...mapState({
      isLoggedIn: (state) => !!state.user.name, // Usuário logado se houver um nome
      userRole: (state) => state.user.role, // Obtemos o papel do usuário
    }),
  },
  created() {
    this.loadLabs();
  },
  methods: {
    async loadLabs() {
      try {
        const response = await fetch("http://localhost:8080/api/laboratorios");

        if (!response.ok) {
          throw new Error("Erro ao carregar os laboratórios");
        }

        this.labs = await response.json();
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
    editLab(id) {
      this.$router.push(`/edit-lab/${id}`);
    },
    openModal(id) {
      this.labIdToDelete = id; // Armazena o ID do laboratório a ser excluído
      this.showDeleteModal = true; // Exibe o modal ao clicar no botão de excluir
      this.modalMessage =
        "Você tem certeza que deseja excluir este laboratório?";
    },
    closeLabModal() {
      this.showDeleteModal = false; // Fecha o modal
      this.labIdToDelete = null; // Limpa o ID do laboratório
    },
    async confirmDeleteLab() {
      if (this.labIdToDelete) {
        try {
          const response = await fetch(
            `http://localhost:8080/api/laboratorios/${this.labIdToDelete}`,
            {
              method: "DELETE",
            }
          );

          if (response.ok) {
            this.showSuccessMessage("Laboratório excluído com sucesso!");
            await this.loadLabs();
            this.showDeleteModal = false;
          } else {
            throw new Error("Erro ao excluir o laboratório");
          }
        } catch (error) {
          this.showError(error.message);
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
