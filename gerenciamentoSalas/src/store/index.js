import { createStore } from 'vuex';
import router from '../router';
import recurso from './modules/recurso';
import recursoAdicional from './modules/recursoAdicional'; // Importa o módulo recursoAdicional

export default createStore({
  modules: {
    recurso,
    recursoAdicional, // Registra o módulo recursoAdicional
  },
  state: {
    user: {
      name: localStorage.getItem('userName') || '',
      role: localStorage.getItem('userType') || '',
      email: localStorage.getItem('userEmail') || '',
    },
    resources: [], // Lista de recursos
  },
  mutations: {
    setUser(state, { name, role, email }) {
      state.user.name = name;
      state.user.role = role;
      state.user.email = email;

      localStorage.setItem('userName', name);
      localStorage.setItem('userType', role);
      localStorage.setItem('userEmail', email);
    },
    clearUser(state) {
      state.user.name = '';
      state.user.role = '';
      state.user.email = '';

      localStorage.removeItem('userName');
      localStorage.removeItem('userType');
      localStorage.removeItem('userEmail');
    },
    setResources(state, resources) {
      state.resources = resources;
    },
    addResource(state, recurso) {
      state.resources.push(recurso);
    },
    updateResources(state, resources) {
      state.resources = resources;
    },
    deleteResource(state, id) {
      state.resources = state.resources.filter(resource => resource.id !== id);
    },
  },
  actions: {
    login({ commit }, user) {
      commit('setUser', user);
    },
    logout({ commit }) {
      commit('clearUser');
      router.push('/');
    },
    async fetchRecursos({ commit }) {
      try {
        const response = await fetch('http://localhost:8080/api/recursos');
        if (!response.ok) {
          throw new Error('Erro ao buscar recursos');
        }
        const data = await response.json();
        commit('setResources', data);
      } catch (error) {
        console.error('Erro ao buscar recursos:', error);
      }
    },
    async deleteResource({ commit }, id) {
      try {
        const response = await fetch(`http://localhost:8080/api/recursos/${id}`, { method: 'DELETE' });
        if (response.ok) {
          commit('deleteResource', id);
        } else {
          throw new Error('Erro ao excluir recurso');
        }
      } catch (error) {
        console.error('Erro ao excluir recurso:', error);
      }
    },
    // Adiciona uma ação para buscar os recursos adicionais
    async fetchRecursosAdicionais({ commit }) {
      try {
        await commit("recursoAdicional/fetchRecursosAdicionais");
      } catch (error) {
        console.error('Erro ao buscar recursos adicionais:', error);
      }
    },
  },
  getters: {
    filteredResources: (state, getters) => {
      const selectedStatus = getters['recurso/getSelectedStatus'];
      const selectedTipoRecurso = getters['recurso/getSelectedTipoRecurso'];
      return state.resources.filter((resource) => {
        const matchesStatus = selectedStatus ? resource.status === selectedStatus : true;
        const matchesTipoRecurso = selectedTipoRecurso ? resource.tipo === selectedTipoRecurso : true;
        return matchesStatus && matchesTipoRecurso;
      });
    },
    // Acessando os recursos adicionais diretamente do estado
    getRecursosAdicionais: (state) => state.recursoAdicional.recursosAdicionais,
  },
});
