<template>
  <div class="container">
    <main>
<!-- Mensagem condicional: se houver um usuário logado, exibe a saudação; caso contrário, exibe a mensagem padrão -->
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
      <section class="section-rooms">
        <h3>Salas</h3>
        <ViewRoom />
      </section>
      <section class="section-labs">
        <h3>Laboratórios</h3>
        <ViewLab />
      </section>
    </main>
  </div>
</template>

<script>
import ViewRoom from "../views/ViewRoom.vue";
import ViewLab from "../views/ViewLab.vue";
import { mapState } from "vuex"; // Caso esteja usando Vuex para estado global

export default {
  components: {
    ViewRoom,
    ViewLab,
  },
  computed: {
    // Supondo que a informação do usuário esteja armazenada no Vuex
    ...mapState({
      userName: (state) => state.user.name,
      userRole: (state) => state.user.role,
    }),
    // Determina se o usuário está logado verificando se o nome do usuário está presente
    isLoggedIn() {
      return !!this.userName; // Retorna true se userName não for vazio
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
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  font-size: 24px;
  margin-bottom: 20px;
}

h3 {
  font-size: 20px;
  margin-bottom: 10px;
  color: #333;
}

.welcome-message {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20px 0;
  padding: 10px 20px;
  background: linear-gradient(135deg, #4caf50 0%, #81c784 100%); /* verde com um tom mais claro */
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

section {
  background-color: #ffffff;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
}

.section-rooms, .section-labs {
  margin-top: 20px;
}

@media (min-width: 768px) {
  main {
    padding: 30px;
  }

  .container {
    padding: 30px;
  }

  .section-rooms, .section-labs {
    margin-top: 30px;
  }

  h2 {
    font-size: 28px;
  }

  h3 {
    font-size: 22px;
  }
}
</style>