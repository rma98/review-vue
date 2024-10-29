<template>
  <div class="add-lab-container">
    <AddFormLab />
  </div>
</template>

<script>
import AddFormLab from "../components/AddFormLab.vue";

export default {
  components: {
    AddFormLab,
  },
};
</script>

<style scoped>
.add-lab-container {
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  margin: 0 auto;
}
</style>