<template>
    <form id="registerForm" @submit.prevent="onSubmit">
        <div class="input-group">
            <label for="name">Nome Completo</label>
            <input type="text" id="name" v-model="formData.name" placeholder="Digite seu nome completo" required />
        </div>
        <div class="input-group">
            <label for="email">Email</label>
            <input type="email" id="email" v-model="formData.email" placeholder="Digite seu email" required />
        </div>
        <div class="input-group">
            <label for="password">Senha</label>
            <input type="password" id="password" v-model="formData.password" placeholder="Digite sua senha" required />
        </div>
        <div class="input-group">
            <label for="type">Tipo</label>
            <select id="type" v-model="formData.type" required>
                <option value="professor">Professor</option>
                <option value="coordenador">Coordenador</option>
            </select>
        </div>
        <div class="input-group">
            <button type="submit" class="btn">Cadastrar</button>
        </div>
        <p>Já tem uma conta? <router-link to="/login">Login</router-link></p>
    </form>
</template>

<script>
export default {
    data() {
        return {
            formData: {
                name: '',
                email: '',
                password: '',
                type: 'professor', // Valor padrão
            },
        };
    },
    methods: {
        onSubmit() {
            // Emitindo os dados do formulário para o componente pai
            this.$emit('submit', this.formData);
            // Limpar o formulário após o envio (opcional)
            this.resetForm();
        },
        resetForm() {
            this.formData = {
                name: '',
                email: '',
                password: '',
                type: 'professor',
            };
        },
    },
};
</script>

<style scoped>
.input-group {
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
}

label {
    margin-bottom: 5px;
    font-weight: bold;
}

input, select {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 16px;
    transition: all 0.3s ease;
}

input:focus, select:focus {
    border-color: #4caf50;
    box-shadow: 0 0 8px rgba(76, 175, 80, 0.5);
}

/* Botão de enviar */
.btn {
    background-color: #4caf50;
    color: white;
    padding: 10px;
    border: none;
    border-radius: 5px;
    font-size: 18px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.btn:hover {
    background-color: #45a049;
}

/* Link de login */
p {
    text-align: center;
    margin-top: 10px;
}

p a {
    color: #4caf50;
    text-decoration: none;
    font-weight: bold;
    transition: color 0.3s ease;
}

p a:hover {
    color: #388e3c;
}

/* Responsividade */
@media (max-width: 768px) {
    input, select {
        font-size: 14px;
    }

    .btn {
        font-size: 16px;
    }
}
</style>
