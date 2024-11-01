import { createStore } from 'vuex';

export default createStore({
  state: {
    user: {
      name: localStorage.getItem('userName') || '',
      role: localStorage.getItem('userType') || '',
      email: localStorage.getItem('userEmail') || '',
    },
  },
  mutations: {
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
  },
  actions: {
    login({ commit }, user) {
      commit('setUser', user);
    },
    logout({ commit }) {
      commit('clearUser');
      // Opcional: Redirecionar para a página de login ou inicial
      router.push('/'); // Caso queira redirecionar
    },
  },
});
