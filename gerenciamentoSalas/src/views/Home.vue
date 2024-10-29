<template>
  <div class="container">
    <main>
      <h2>Bem-vindo ao Sistema de Gerenciamento de Salas e Laboratórios</h2>
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

export default {
  components: {
    ViewRoom,
    ViewLab,
  },
  data() {
    return {};
  },
  methods: {},
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