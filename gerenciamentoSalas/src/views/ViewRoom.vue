<template>
  <div class="view-room-container">
    <RoomTable />
  </div>
</template>

<script>
import RoomTable from "../components/RoomTable.vue";

export default {
  components: {
    RoomTable,
  },
  data() {
    return {};
  },
  methods: {},
};
</script>

<style scoped>
.view-room-container {
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 1200px;
  margin: 0 auto;
}
</style>
