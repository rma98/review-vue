import { createStore } from 'vuex';
import router from '../router';  // Importando o roteador para redirecionamento (se necessário)

export default createStore({
  state: {
    user: {
      name: localStorage.getItem('userName') || '',
      role: localStorage.getItem('userType') || '',
      email: localStorage.getItem('userEmail') || '',
    },
    resources: [],  // Lista de recursos
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
        const data = await response.json();
        commit('updateResources', data);  // Atualiza a lista de recursos com os dados da API
      } catch (error) {
        console.error('Erro ao buscar recursos:', error);
      }
    },

    // Ação para excluir recurso
    async deleteResource({ commit }, id) {
      try {
        // Realiza a exclusão do recurso na API
        const response = await fetch(`http://localhost:8080/api/recursos/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          // Se a exclusão for bem-sucedida, atualiza o estado local da aplicação
          commit('deleteResource', id); // Atualiza o estado da lista de recursos
        } else {
          throw new Error('Erro ao excluir o recurso');
        }
      } catch (error) {
        console.error(error);
        throw error; // Repassa o erro para o componente
      }
    },
  },
});
