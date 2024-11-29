<template>
    <div>
        <h2>Reservas</h2>
        <table>
            <thead>
                <tr>
                    <th>Recurso</th>
                    <th>Usuário</th>
                    <th>Data de Início</th>
                    <th>Data de Fim</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="reserva in reservas" :key="reserva.id">
                    <td>{{ reserva.recurso.nome }}</td>
                    <td>{{ reserva.usuario.nome }}</td>
                    <td>{{ new Date(reserva.dataInicio).toLocaleString() }}</td>
                    <td>{{ new Date(reserva.dataFim).toLocaleString() }}</td>
                    <td>
                        <button @click="editarReserva(reserva.id)">Editar</button>
                        <button @click="excluirReserva(reserva.id)">Excluir</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
export default {
    data() {
        return {
            reservas: [],
        };
    },
    mounted() {
        this.fetchReservas();
    },
    methods: {
        async fetchReservas() {
            const response = await fetch("http://localhost:8080/api/reservas");
            this.reservas = await response.json();
        },
        editarReserva(id) {
            this.$router.push(`/edit-reserva/${id}`);
        },
        async excluirReserva(id) {
            if (confirm("Tem certeza que deseja excluir esta reserva?")) {
                await fetch(`http://localhost:8080/api/reservas/${id}`, {
                    method: "DELETE",
                });
                this.fetchReservas();
            }
        },
    },
};
</script>

<style scoped>
table {
    width: 100%;
    border-collapse: collapse;
}

th,
td {
    border: 1px solid #ddd;
    padding: 8px;
}
</style>