// store/modules/recurso.js
const state = {
    statusOpts: {
        DISPONIVEL: "Disponível",
        MANUTENCAO: "Manutenção",
        INATIVA: "Inativa",
    },
    tipoRecursoOpts: {
        SALA: "Sala",
        LABORATORIO: "Laboratório",
    },
    selectedStatus: '',  // Estado para armazenar o status selecionado
};

const getters = {
    getStatusOpts: (state) => state.statusOpts,
    getTipoRecursoOpts: (state) => state.tipoRecursoOpts,
    getSelectedStatus: (state) => state.selectedStatus,  // Getter para acessar o status selecionado
};

const mutations = {
    setSelectedStatus(state, status) {
        state.selectedStatus = status;  // Mutação para atualizar o status selecionado
    },
};

const actions = {
    setStatus({ commit }, status) {
        commit('setSelectedStatus', status);  // Ação para mudar o status
    },
};

export default {
    state,
    getters,
    mutations,
    actions,
};
