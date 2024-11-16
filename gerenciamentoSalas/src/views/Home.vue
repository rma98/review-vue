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

      <!-- Exibição dos cards de salas e laboratórios -->
      <CardList :rooms="rooms" :labs="labs" />
    </main>
  </div>
</template>

<script>
import CardList from "../components/CardList.vue";

export default {
  components: {
    CardList,
  },
  data() {
    return {
      rooms: [], // Array para armazenar as salas
      labs: [], // Array para armazenar os laboratórios
    };
  },
  computed: {
    // Computed properties para o Vuex (se necessário)
    userName() {
      return this.$store.state.user.name;
    },
    userRole() {
      return this.$store.state.user.role;
    },
    isLoggedIn() {
      return !!this.userName;
    },
  },
  created() {
    this.loadRoomsAndLabs(); // Carregar as salas e laboratórios ao criar o componente
  },
  methods: {
    async loadRoomsAndLabs() {
      try {
        const roomsResponse = await fetch("http://localhost:8080/api/salas"); // URL da API para buscar as salas
        const labsResponse = await fetch("http://localhost:8080/api/laboratorios"); // URL da API para buscar os laboratórios

        if (!roomsResponse.ok || !labsResponse.ok) {
          throw new Error("Erro ao carregar as salas ou laboratórios");
        }

        const roomsData = await roomsResponse.json();
        const labsData = await labsResponse.json();

        this.rooms = roomsData; // Preenche o array de salas com os dados recebidos
        this.labs = labsData; // Preenche o array de laboratórios com os dados recebidos

      } catch (error) {
        console.error(error);
        alert("Erro ao carregar as salas e laboratórios.");
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
  /* background-color: #f9f9f9; */
  /* border-radius: 8px; */ 
  padding: 20px;
  /* box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); */
}

h2 {
  text-align: center;
  font-size: 24px;
  margin-bottom: 20px;
}

.welcome-message {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20px 0;
  padding: 10px 20px;
  /* background: linear-gradient(135deg, #4caf50 0%, #81c784 100%); verde com um tom mais claro */
  background-color: #388e3c;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.5);
  color: white;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
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
  color: white; /* Mantenha o ícone em branco para contraste */
  margin-right: 10px;
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
