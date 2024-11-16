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
  background-color: #388e3c;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.5);
  position: relative;
  clear: both;
  font-size: 1.6rem;
  font-weight: bold;
}

footer p {
  color: white;
}
</style>
