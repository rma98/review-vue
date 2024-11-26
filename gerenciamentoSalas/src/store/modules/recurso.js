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
    selectedStatus: '', // Status selecionado
    selectedTipoRecurso: '', // Tipo de recurso selecionado
};

const getters = {
    getStatusOpts: (state) => state.statusOpts,
    getTipoRecursoOpts: (state) => state.tipoRecursoOpts,
    getSelectedStatus: (state) => state.selectedStatus,
    getSelectedTipoRecurso: (state) => state.selectedTipoRecurso,
};

const mutations = {
    setSelectedStatus(state, status) {
        state.selectedStatus = status;
    },
    setSelectedTipoRecurso(state, tipoRecurso) {
        state.selectedTipoRecurso = tipoRecurso;
    },
};

const actions = {
    setStatus({ commit }, status) {
        commit('setSelectedStatus', status);
    },
    setTipoRecurso({ commit }, tipoRecurso) {
        commit('setSelectedTipoRecurso', tipoRecurso);
    },
};

export default {
    state,
    getters,
    mutations,
    actions,
};
