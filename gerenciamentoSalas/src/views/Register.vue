<template>
    <div class="form-wrapper">
        <div class="form-container">
            <h2>Cadastro</h2>
            <RegisterForm @submit="handleSubmit" />
        </div>
    </div>
</template>

<script>
import RegisterForm from '../components/RegisterForm.vue';

export default {
    components: {
        RegisterForm,
    },
    methods: {
        handleSubmit(userData) {
            // Aqui você pode adicionar a lógica para processar o registro
            console.log('Dados do usuário:', userData);
        },
    },
};
</script>

<style scoped>
.form-wrapper {
    display: flex;
    justify-content: center; /* Centraliza horizontalmente */
    align-items: center; /* Centraliza verticalmente */
    height: 100vh; /* Altura total da janela */
    background: linear-gradient(135deg, #4caf50, #388e3c); /* Fundo gradiente */
}

.form-container {
    background-color: white;
    color: #333;
    border-radius: 10px;
    padding: 40px;
    width: 100%;
    max-width: 400px;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
    animation: slideDown 0.5s ease-out;
}

/* Animação de descer */
@keyframes slideDown {
    from {
        transform: translateY(-50px);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
}
</style>
