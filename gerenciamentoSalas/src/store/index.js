import { createStore } from 'vuex';
import router from '../router';  // Importando o roteador para redirecionamento (se necessário)
import recurso from './modules/recurso';

export default createStore({
  modules: {
    recurso,
  },
  state: {
    user: {
      name: localStorage.getItem('userName') || '',
      role: localStorage.getItem('userType') || '',
      email: localStorage.getItem('userEmail') || '',
    },
    resources: [],  // Lista de recursos
    selectedStatus: '',  // Status selecionado para filtro
  },
  mutations: {
    // Mutações para o usuário
    setUser(state, { name, role, email }) {
      state.user.name = name;
      state.user.role = role;
      state.user.email = email;

      // Opcional: armazenar no localStorage para persistência
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

    // Mutações para os recursos
    addResource(state, recurso) {
      state.resources.push(recurso);
    },
    updateResources(state, resources) {
      state.resources = resources;  // Atualiza a lista de recursos
    },
    deleteResource(state, id) {
      state.resources = state.resources.filter(resource => resource.id !== id);  // Remove o recurso da lista
    },

    // Mutações para atualizar o status selecionado
    setSelectedStatus(state, status) {
      state.selectedStatus = status;
    },
  },
  actions: {
    // Ação para o login
    login({ commit }, user) {
      commit('setUser', user);
    },
    // Ação para o logout
    logout({ commit }) {
      commit('clearUser');
      // Opcional: Redirecionar para a página de login ou inicial
      router.push('/'); // Caso queira redirecionar
    },

    // Ação para buscar recursos da API
    async fetchResources({ commit }) {
      try {
        const response = await fetch('http://localhost:8080/api/recursos');
        if (!response.ok) {
          throw new Error('Erro ao buscar recursos');
        }
        const data = await response.json();
        commit('updateResources', data);
      } catch (error) {
        console.error('Erro ao buscar recursos:', error);
        // Aqui você pode adicionar uma ação para exibir uma mensagem de erro
      }
    },

    // Ação para excluir recurso
    async deleteResource({ commit }, id) {
      try {
        const response = await fetch(`http://localhost:8080/api/recursos/${id}`, { method: 'DELETE' });
        if (response.ok) {
          commit('deleteResource', id);
        } else {
          throw new Error('Erro ao excluir o recurso');
        }
      } catch (error) {
        console.error('Erro ao excluir recurso:', error);
        // Mensagem de erro pode ser gerada aqui também
      }
    },

    // Ação para mudar o status selecionado
    setStatus({ commit }, status) {
      commit('setSelectedStatus', status);
    },
  },
  getters: {
    // Getter para filtrar os recursos pelo status selecionado
    filteredResources: (state) => {
      if (state.selectedStatus) {
        return state.resources.filter(
          (resource) => resource.status === state.selectedStatus
        );
      }
      return state.resources;
    },
  },
});
