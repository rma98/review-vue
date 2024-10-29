<template>
    <form @submit.prevent="onSubmit" id="loginForm">
        <div class="input-group">
            <label for="email">Email</label>
            <input type="email" id="email" v-model="email" placeholder="Digite seu email" required />
        </div>
        <div class="input-group">
            <label for="password">Senha</label>
            <input type="password" id="password" v-model="password" placeholder="Digite sua senha" required />
        </div>
        <div class="input-group">
            <button type="submit" class="btn">Entrar</button>
        </div>
        <p>Não tem uma conta? <router-link to="/register">Cadastre-se</router-link></p>
    </form>
</template>

<script>
export default {
    data() {
        return {
            email: '',
            password: '',
        };
    },
    methods: {
        onSubmit() {
            const credentials = {
                email: this.email,
                password: this.password,
            };
            this.$emit('submit', credentials);
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

input {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 16px;
    transition: all 0.3s ease;
}

input:focus {
    border-color: #4caf50;
    box-shadow: 0 0 8px rgba(76, 175, 80, 0.5);
}

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
</style>
