<template>
    <div class="forgot-password-container">
        <form @submit.prevent="handleForgotPassword">
            <div class="header">
                <i class="fas fa-key"></i>
                <h2>Esqueceu sua senha?</h2>
                <p>Digite seu email e enviaremos um link para redefinir sua senha.</p>
            </div>
            <div class="input-group">
                <label for="email"><i class="fas fa-envelope"></i> Email</label>
                <input type="email" v-model="email" placeholder="Digite seu email" @input="validateEmail" required />
                <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
                <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
            </div>
            <button type="submit" class="btn">Enviar</button>
        </form>
    </div>
</template>

<script>
export default {
    data() {
        return {
            email: "",
            errorMessage: "",
            successMessage: "",
        };
    },
    methods: {
        validateEmail() {
            const emailRegex = /\S+@\S+\.\S+/;
            if (!this.email) {
                this.errorMessage = "O email é obrigatório.";
            } else if (!emailRegex.test(this.email)) {
                this.errorMessage = "O formato do email é inválido.";
            } else {
                this.errorMessage = "";
            }
        },
        async handleForgotPassword() {
            this.validateEmail();
            if (this.errorMessage) return;

            try {
                const response = await fetch("http://localhost:8080/api/usuarios/esqueceu-senha", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email: this.email }),
                });

                if (!response.ok) {
                    throw new Error("Falha ao enviar o email. Tente novamente.");
                }

                this.successMessage = "Se o email estiver cadastrado, você receberá um link para redefinir sua senha.";
                this.email = ""; // Limpa o campo de email após o sucesso
            } catch (error) {
                this.errorMessage = error.message;
            }
        },
    },
};
</script>

<style scoped>
.forgot-password-container {
    max-width: 400px;
    margin: 50px auto;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    text-align: center;
}

.header h2 {
    margin-bottom: 10px;
}

.input-group {
    margin-bottom: 20px;
}

.input-group label {
    display: block;
    margin-bottom: 5px;
}

.input-group input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

.btn {
    padding: 10px 20px;
    background-color: #4caf50;
    color: #fff;
    border: none;
    padding: 10px 15px;
    font-size: 1.6rem;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
    width: 100%;
}

.btn:hover {
    background-color: #3d8b40;
}

.error-message {
    color: red;
    font-size: 1.2rem;
}

.success-message {
    color: green;
    font-size: 1.2rem;
}
</style>