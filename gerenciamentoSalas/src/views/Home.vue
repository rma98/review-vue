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

      <!-- Filtro para tipo de recurso (Sala ou Laboratório) -->
      <div class="filter">
        <label for="tipo" class="filter-label">Filtrar por tipo:</label>
        <div class="select-wrapper">
          <select v-model="selectedType" id="tipo" class="custom-select">
            <option value="">Todos</option>
            <option value="sala">Sala</option>
            <option value="laboratorio">Laboratório</option>
          </select>
        </div>
      </div>

      <!-- Exibição dos cards de salas e laboratórios -->
      <div class="card-carousel">
        <div v-if="filteredItems.length" class="carousel-container">
          <ItemCard
            v-for="item in filteredItems"
            :key="item.id"
            :item="item"
            :type="item.tipo"
            @itemDeleted="handleItemDeleted"
          />  
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
      items: [], // Array para armazenar todos os recursos (salas e laboratórios)
      selectedType: "", // Tipo selecionado pelo usuário para filtrar
    };
  },
  computed: {
    ...mapState({
      isLoggedIn: (state) => !!state.user.name,
      userRole: (state) => state.user.role,
      userName: (state) => state.user.name, // Mapeando corretamente o nome do usuário
    }),
    filteredItems() {
      // Verifica se o filtro foi aplicado
      if (!this.selectedType) {
        return this.items; // Retorna todos os itens se o filtro não estiver ativo
      }

      // Filtra os itens com base no tipo de recurso (sala ou laboratório)
      return this.items.filter((item) => {
        // Verificar se tipo_recurso está disponível e no formato esperado
        console.log("Tipo de recurso do item:", item.tipo_recurso); // Verifique o valor real retornado
        return (
          item.tipo_recurso &&
          item.tipo_recurso.toLowerCase() === this.selectedType.toLowerCase()
        );
      });
    },
  },
  created() {
    this.loadResources(); // Carregar todos os recursos assim que o componente for criado
  },
  methods: {
    // Função para carregar todos os recursos da API
    async loadResources() {
      try {
        const response = await fetch("http://localhost:8080/api/recursos"); // URL da API para buscar todos os recursos (salas e laboratórios)

        if (!response.ok) {
          throw new Error("Erro ao carregar os recursos");
        }

        const data = await response.json();
        this.items = data; // Armazena diretamente os dados retornados pela API
      } catch (error) {
        console.error(error);
      }
    },
    // Função para lidar com a exclusão do item
    handleItemDeleted(id) {
      console.log(`Recurso com ID ${id} foi excluído.`);
      this.items = this.items.filter((item) => item.id !== id); // Remove o item excluído da lista
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

@media (min-width: 768px) {
  main {
    padding: 30px;
  }

  .container {
    padding: 30px;
  }

  h2 {
    font-size: 28px;
  }
}
</style>
