<template>
    <div class="card">
        <div class="card-header">
            <h4>{{ item.nome }}</h4>
        </div>
        <p><strong>Descrição:</strong> {{ item.descricao }}</p>
        <p><strong>Quantidade:</strong> {{ item.quantidade }}</p>

        <div class="actions">
            <i v-if="isLoggedIn && userRole === 'COORDENADOR'" class="fas fa-edit" @click="editItem(item.id)"
                title="Editar"></i>
            <i v-if="isLoggedIn && userRole === 'COORDENADOR'" class="fas fa-trash delete-item-btn"
                @click="openDeleteModal(item.id, item.nome)" title="Excluir"></i>
        </div>

        <!-- Modal de Exclusão -->
        <ModalExcluir :visible="showDeleteModal" :itemName="itemToDelete.nome" @close="closeDeleteModal"
            @confirm="deleteItem(itemToDelete.id)" />
    </div>
</template>


<script>
import ModalExcluir from "../components/ModalExcluir.vue"; // Modal de exclusão

export default {
    components: {
        ModalExcluir,
    },
    data() {
        return {
            showDeleteModal: false, // Controle do modal de exclusão
            itemToDelete: {}, // Armazena o item a ser excluído
        };
    },
    props: {
        item: Object, // Recebe o recurso adicional
    },
    computed: {
        ...mapState({
            isLoggedIn: (state) => !!state.user.name,
            userRole: (state) => state.user.role,
        }),
    },
    methods: {
        editItem(id) {
            // Redireciona para o componente de edição passando o ID do item
            this.$router.push(`/editar-recurso-adicional/${id}`);
        },
        openDeleteModal(id, nome) {
            this.itemToDelete = { id, nome }; // Salva o item a ser excluído
            this.showDeleteModal = true; // Exibe o modal de exclusão
        },
        closeDeleteModal() {
            this.showDeleteModal = false; // Fecha o modal de exclusão
        },
        async deleteItem(id) {
            try {
                // Exclui o recurso adicional via Vuex
                await this.$store.dispatch("deleteRecursoAdicional", id);

                // Recarrega a lista de recursos adicionais após a exclusão
                await this.$store.dispatch("fetchRecursoAdicionais");

                // Sucesso ao excluir
                this.closeDeleteModal(); // Fecha o modal de exclusão
                this.showSuccessMessage("Recurso adicional excluído com sucesso!");
                console.log("Recurso adicional excluído com sucesso!");
            } catch (error) {
                // Exibe erro caso falhe
                this.showError("Erro ao excluir o recurso adicional");
                console.error(error.message);
            }
        },
        showSuccessMessage(message) {
            // Exibe uma mensagem de sucesso
            alert(message);
        },
        showError(message) {
            // Exibe uma mensagem de erro
            alert(message);
        },
    },
};
</script>

<style scoped>
.card {
    min-height: 220px;
    padding: 15px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.actions {
    margin-top: 10px;
}

.delete-item-btn {
    cursor: pointer;
    margin-right: 10px;
}

.fas {
    cursor: pointer;
}
</style>
