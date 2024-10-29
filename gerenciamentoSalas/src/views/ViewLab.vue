<template>
  <div class="view-lab-container">
    <LabTable />
  </div>
</template>

<script>
import LabTable from "../components/LabTable.vue";

export default {
  components: {
    LabTable,
  },
};
</script>

<style scoped>
.view-lab-container {
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 1200px;
  margin: 0 auto;
}
</style>
