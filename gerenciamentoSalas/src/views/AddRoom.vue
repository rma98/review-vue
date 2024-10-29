<template>
  <div class="add-room-container">
    <AddFormRoom />
  </div>
</template>

<script>
import AddFormRoom from "../components/AddFormRoom.vue";

export default {
  components: {
    AddFormRoom,
  },
};
</script>

<style scoped>
.add-room-container {
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  margin: 0 auto;
}
</style>
