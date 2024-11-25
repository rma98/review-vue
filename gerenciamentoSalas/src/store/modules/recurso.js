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
};

const getters = {
    getStatusOpts: (state) => state.statusOpts,
    getTipoRecursoOpts: (state) => state.tipoRecursoOpts,
};

export default {
    state,
    getters,
};
