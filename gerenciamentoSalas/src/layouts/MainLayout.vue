<template>
  <div class="main-layout">
    <Header @toggleSidebar="toggleSidebar" />
    <Sidebar :sidebarVisible="sidebarVisible" @closeSidebar="toggleSidebar" />
    <main>
      <router-view></router-view>
      <!-- Aqui as páginas serão renderizadas -->
    </main>
    <Footer />
  </div>
</template>

<script>
import Header from "../components/Header.vue";
import Sidebar from "../components/Sidebar.vue";
import Footer from '../components/Footer.vue';

export default {
  components: {
    Header,
    Sidebar,
    Footer,
  },
  data() {
    return {
      sidebarVisible: false, // Controle da visibilidade da Sidebar
    };
  },
  methods: {
    toggleSidebar() {
      this.sidebarVisible = !this.sidebarVisible; // Alterna a visibilidade da Sidebar
    },
    closeSidebar() {
      this.sidebarVisible = false; // Fecha a sidebar
    }
  },
};
</script>

<style scoped>
.main-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh; /* Define o mínimo como altura total da tela */
}

main {
  flex-grow: 1; /* Faz com que o conteúdo principal ocupe o espaço disponível */
}
</style>
