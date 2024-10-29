<template>
  <!-- Footer -->
  <footer>
    <p>&copy; {{ currentYear }} Todos os direitos reservados.</p>
  </footer>
</template>

<script>
export default {
  data() {
    return {
      currentYear: new Date().getFullYear(), // Define o ano atual
    };
  },
};
</script>

<style scoped>
footer {
  text-align: center;
  padding: 10px;
  background-color: #4caf50;
  color: white;
  position: relative;
  clear: both;
  font-size: 1.6rem;
  font-weight: bold;
}
</style>
