<template>
  <div class="container">
    <main>
      <div class="welcome-message">
        <h2 v-if="isLoggedIn">
          <i class="fas fa-user-circle icon"></i>
          Bem-vindo, {{ userRole }} {{ userName }}!
        </h2>
        <h2 v-else>
          <i class="fas fa-door-open icon"></i>
          Bem-vindo ao Sistema de Gerenciamento de Salas e Laboratórios
        </h2>
      </div>

      <!-- Filtro para status -->
      <div class="filter">
        <label for="status" class="filter-label">Filtrar por status:</label>
        <div class="select-wrapper">
          <select v-model="selectedStatus" id="status" class="custom-select">
            <option value="">Todos</option>
            <option value="disponivel">Disponível</option>
            <option value="manutencao">Manutenção</option>
            <option value="inativa">Inativa</option>
          </select>
        </div>
      </div>

      <!-- Exibição dos cards de salas e laboratórios -->
      <div class="card-carousel">
        <div v-if="filteredItems.length" class="carousel-container">
          <ItemCard v-for="item in filteredItems" :key="item.id" :item="item" :type="item.tipo_recurso"
            @itemDeleted="handleItemDeleted" />
        </div>
        <div v-else>
          <p>Nenhum recurso encontrado.</p>
        </div>
      </div>
    </main>
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
      selectedType: "", // Tipo selecionado pelo usuário para filtrar
      selectedStatus: "", // Status selecionado pelo usuário para filtrar
    };
  },
  computed: {
    ...mapState({
      isLoggedIn: (state) => !!state.user.name,
      userRole: (state) => state.user.role,
      userName: (state) => state.user.name, // Mapeando corretamente o nome do usuário
      resources: (state) => state.resources, // Acesso aos recursos do Vuex
    }),
    filteredItems() {
      let filtered = this.resources;

      // Filtra pelo tipo
      if (this.selectedType) {
        filtered = filtered.filter((item) => item.tipo_recurso && item.tipo_recurso.toLowerCase() === this.selectedType.toLowerCase());
      }

      // Filtra pelo status
      if (this.selectedStatus) {
        filtered = filtered.filter((item) => item.status && item.status.toLowerCase() === this.selectedStatus.toLowerCase());
      }

      return filtered;
    },
  },
  created() {
    this.loadResources(); // Carregar todos os recursos assim que o componente for criado
  },
  methods: {
    async loadResources() {
      try {
        const response = await fetch("http://localhost:8080/api/recursos");
        if (!response.ok) {
          throw new Error("Erro ao carregar os recursos");
        }
        const data = await response.json();
        this.$store.commit('setResources', data); // Usando Vuex para atualizar os recursos
      } catch (error) {
        console.error(error);
      }
    },
    handleItemDeleted(id) {
      const confirmDeletion = confirm("Tem certeza que deseja excluir este recurso?");
      if (confirmDeletion) {
        this.$store.dispatch('deleteResource', id);
      }
    },
  },
};
</script>

<style scoped>
.container {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

main {
  padding: 20px;
}

.welcome-message {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20px 0;
  padding: 10px 20px;
  background-color: #388e3c;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  color: white;
  border-radius: 8px;
  text-align: center;
}

.welcome-message h2 {
  font-size: 1.8rem;
  font-weight: 600;
  color: white;
  margin: 0;
}

.icon {
  font-size: 2rem;
  color: white;
  margin-right: 10px;
}

.card-carousel {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.filter {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
}

.filter-label {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
}

.select-wrapper {
  position: relative;
  width: 100%;
}

.custom-select {
  padding: 12px 15px;
  font-size: 1rem;
  background-color: #f5f5f5;
  border: 1px solid #ccc;
  border-radius: 8px;
  width: 200px;
  transition: border-color 0.3s ease, background-color 0.3s ease;
}

.custom-select:focus {
  outline: none;
  border-color: #388e3c;
  background-color: #e8f5e9;
}

.custom-select option {
  padding: 10px;
  background-color: #fff;
}

@media (max-width: 768px) {
  .custom-select {
    width: 100%;
  }
}
</style>
