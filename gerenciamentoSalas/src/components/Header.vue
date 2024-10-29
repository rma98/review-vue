<template>
  <header>
    <h1>
      <i class="fas fa-cog fa-2x"></i> Gerenciamento de Salas e Laboratórios
    </h1>
    <div class="menu-toggle" @click="$emit('toggleSidebar')">
      <i class="fas fa-bars fa-2x"></i>
    </div>
  </header>
</template>

<script>
export default {
  methods: {},
};
</script>

<style scoped>
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
}
header h1 {
  display: flex;
  align-items: center;
  margin: 0;
}
header h1 i {
  margin-right: 10px;
}
header .menu-toggle {
  cursor: pointer;
}
</style>
