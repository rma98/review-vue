const state = {
    recursoAdicionalData: {
        nome: "",
        descricao: "",
        quantidade: 1,
    },
    recursosAdicionais: [], // Lista de recursos adicionais
    message: "",
    messageType: "",
};

const getters = {
    getRecursoAdicionalData: (state) => state.recursoAdicionalData,
    getRecursosAdicionais: (state) => state.recursosAdicionais, // Getter para acessar a lista de recursos adicionais
    getMessage: (state) => state.message,
    getMessageType: (state) => state.messageType,
};

const mutations = {
    setRecursoAdicionalData(state, recursoData) {
        state.recursoAdicionalData = recursoData;
    },
    setRecursosAdicionais(state, recursosAdicionais) {
        state.recursosAdicionais = recursosAdicionais;
    },
    addRecursoAdicional(state, recursoAdicional) {
        state.recursosAdicionais.push(recursoAdicional);
    },
    setMessage(state, { message, messageType }) {
        state.message = message;
        state.messageType = messageType;
    },
    resetRecursoAdicionalData(state) {
        state.recursoAdicionalData = {
            nome: "",
            descricao: "",
            quantidade: 1,
        };
    },
};

const actions = {
    async fetchRecursosAdicionais({ commit }) {
        try {
            const response = await fetch("http://localhost:8080/api/recursos-adicionais");
            if (!response.ok) {
                throw new Error("Erro ao buscar recursos adicionais");
            }
            const recursosAdicionais = await response.json();
            commit("setRecursosAdicionais", recursosAdicionais);
        } catch (error) {
            console.error("Erro ao buscar recursos adicionais:", error);
        }
    },
    async addRecursoAdicional({ commit }, recursoAdicionalDTO) {
        try {
            const response = await fetch("http://localhost:8080/api/recursos-adicionais", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(recursoAdicionalDTO),
            });

            if (response.ok) {
                const recursoAdicional = await response.json();
                commit("addRecursoAdicional", recursoAdicional);
                commit("setMessage", { message: "Recurso adicional adicionado com sucesso!", messageType: "success" });

                // Atualiza os recursos após o recurso ser adicionado
                await this.dispatch('fetchRecursosAdicionais'); // Carregar os recursos novamente

            } else {
                commit("setMessage", { message: "Erro ao adicionar recurso adicional.", messageType: "error" });
            }
        } catch (error) {
            console.error("Erro ao adicionar recurso adicional:", error);
            commit("setMessage", { message: "Erro ao adicionar recurso adicional.", messageType: "error" });
        }
    },
    resetRecursoAdicionalData({ commit }) {
        commit("resetRecursoAdicionalData");
    },
};

export default {
    state,
    getters,
    mutations,
    actions,
};
