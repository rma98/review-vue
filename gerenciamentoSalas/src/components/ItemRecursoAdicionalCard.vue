<template>
    <div class="recurso-adicional-page">
        <h1>Recursos Adicionais</h1>

        <!-- Exibindo a lista de recursos adicionais -->
        <div class="resources-list">
            <ItemRecursoAdicionalCard v-for="item in recursosAdicionais" :key="item.id" :item="item" />
        </div>
    </div>
</template>

<script>
import ItemRecursoAdicionalCard from "../components/ItemRecursoAdicionalCard.vue";

export default {
    components: {
        ItemRecursoAdicionalCard,
    },
    data() {
        return {
            // Array de recursos adicionais (exemplo estático)
            recursosAdicionais: [
                {
                    id: 1,
                    nome: "Recurso A",
                    descricao: "Descrição do Recurso A",
                    quantidade: 10,
                },
                {
                    id: 2,
                    nome: "Recurso B",
                    descricao: "Descrição do Recurso B",
                    quantidade: 5,
                },
                {
                    id: 3,
                    nome: "Recurso C",
                    descricao: "Descrição do Recurso C",
                    quantidade: 20,
                },
            ],
        };
    },
};
</script>

<style scoped>
.recurso-adicional-page {
    padding: 20px;
}

h1 {
    text-align: center;
    margin-bottom: 30px;
}

.resources-list {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
}

.card {
    width: 250px;
    background: #f8f9fa;
    border-radius: 8px;
    padding: 15px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>