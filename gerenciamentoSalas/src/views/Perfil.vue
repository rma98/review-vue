<template>
  <div class="perfil-page">
    <div v-if="user" class="perfil-container">
      <!-- Avatar e Informações Principais -->
      <div class="perfil-card perfil-header-card">
        <div class="profile-header">
          <img 
            :src="user.avatarUrl || '/default-avatar.png'" 
            alt="Avatar"
            class="avatar" 
          />
          <h2>{{ user.name }}</h2>
          <p class="role">{{ user.role }}</p>
        </div>
        <div class="perfil-info">
          <p><strong>Email:</strong> {{ user.email }}</p>
          <p v-if="user.dateOfBirth"><strong>Data de Nascimento:</strong> {{ user.dateOfBirth }}</p>
          <p v-if="user.address"><strong>Endereço:</strong> {{ user.address }}</p>
        </div>
      </div>

      <!-- Informações Adicionais -->
      <div class="perfil-card perfil-details-card">
        <h3>Informações Adicionais</h3>
        <div class="additional-info">
          <p><strong>Telefone:</strong> {{ user.phone || 'Não informado' }}</p>
          <p><strong>Data de Registro:</strong> {{ user.createdAt || 'Desconhecida' }}</p>
          <p><strong>Último Login:</strong> {{ user.lastLogin || 'Nunca' }}</p>
        </div>
      </div>

      <!-- Histórico ou Estatísticas -->
      <div class="perfil-card perfil-stats-card">
        <h3>Estatísticas</h3>
        <div class="stats">
          <div class="stat">
            <p><strong>Reservas feitas:</strong> {{ user.reservationsCount || 0 }}</p>
          </div>
          <div class="stat">
            <p><strong>Eventos Participados:</strong> {{ user.eventsCount || 0 }}</p>
          </div>
          <div class="stat">
            <p><strong>Desempenho:</strong> {{ user.performance || 'N/A' }}</p>
          </div>
        </div>
      </div>

      <!-- Botão de Edição -->
      <div class="perfil-actions">
        <button @click="editProfile" class="edit-btn">Editar Perfil</button>
      </div>
    </div>

    <div v-else class="loading">
      <p>Carregando informações do usuário...</p>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    user() {
      return this.$store.state.user;
    },
  },
  created() {
    if (!this.user || !this.user.email) {
      this.$router.push("/login");
    }
  },
  methods: {
    editProfile() {
      this.$router.push("/editar-perfil");
    },
  },
};
</script>

<style scoped>
.perfil-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px;
  font-family: 'Roboto', sans-serif;
  color: #333;
  background-color: #f3f6f9;
  min-height: 100vh;
}

.perfil-container {
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
}

.perfil-card {
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 30px;
  width: 100%;
  max-width: 500px;
  text-align: center;
  animation: fadeIn 0.3s ease-in-out;
}

.perfil-header-card {
  width: 100%;
}

.perfil-header {
  margin-bottom: 20px;
}

.avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 10px;
}

h2 {
  font-size: 2.4em;
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
}

.role {
  font-size: 1.3em;
  color: #777;
  margin-bottom: 20px;
}

.perfil-info,
.additional-info,
.stats {
  font-size: 1.1em;
  color: #555;
  margin-top: 10px;
}

strong {
  color: #333;
}

.perfil-actions {
  margin-top: 30px;
}

.edit-btn {
  background-color: #4a90e2;
  color: #fff;
  border: none;
  padding: 12px 25px;
  font-size: 1.2em;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.edit-btn:hover {
  background-color: #357ab7;
}

.loading {
  font-size: 1.2em;
  color: #888;
}

.perfil-details-card, .perfil-stats-card {
  margin-top: 20px;
}

.perfil-details-card h3, .perfil-stats-card h3 {
  font-size: 1.6em;
  font-weight: 500;
  margin-bottom: 15px;
}

.stat {
  margin-bottom: 15px;
}

@media (max-width: 768px) {
  .perfil-container {
    flex-direction: column;
    gap: 20px;
  }

  .perfil-card {
    width: 90%;
    max-width: 100%;
    padding: 20px;
  }

  h2 {
    font-size: 1.8em;
  }

  .role {
    font-size: 1.2em;
  }

  .edit-btn {
    padding: 10px 20px;
    font-size: 1.1em;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
