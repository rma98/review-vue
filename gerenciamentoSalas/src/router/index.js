import { createRouter, createWebHistory } from 'vue-router';
import { useStore } from 'vuex'; // Importa o Vuex para verificar o login

import MainLayout from "../layouts/MainLayout.vue";
import Home from '../views/Home.vue';
import AddRoom from '../views/AddRoom.vue';
import ViewRoom from '../views/ViewRoom.vue';
import EditRoom from '../views/EditRoom.vue';
import AddLab from '../views/AddLab.vue';
import ViewLab from '../views/ViewLab.vue';
import EditLab from '../views/EditLab.vue';
import AddRecurso from '../views/AddRecurso.vue';
import EditRecurso from '../views/EditRecurso.vue';
import AddRecursos from '../components/AddRecursos.vue';
import Register from '../views/Register.vue';
import Login from '../views/Login.vue';
import Perfil from '../views/Perfil.vue';

const routes = [
    {
        path: '/',
        component: MainLayout,
        children: [
            { path: '', name: 'Home', component: Home, },
            { path: 'view-room', name: 'ViewRoom', component: ViewRoom, },
            { path: 'view-lab', name: 'ViewLab', component: ViewLab, },
            { path: '/view-lab/:id', name: 'ViewLab', component: ViewLab, },
            { path: '/add-room', name: 'AddRoom', component: AddRoom, meta: { requiresAuth: true }, },
            { path: '/add-lab', name: 'AddLab', component: AddLab, meta: { requiresAuth: true }, },
            { path: '/add-recurso', name: 'AddRecurso', component: AddRecurso, meta: { requiresAuth: true }, },
            { path: '/add-recursos', name: 'AddRecursos', component: AddRecursos, meta: { requiresAuth: true }, },
            { path: '/register', name: 'Register', component: Register },
            { path: '/login', name: 'Login', component: Login },
            { path: '/perfil', name: 'Perfil', component: Perfil, meta: { requiresAuth: true }, },
        ],
    },
    { path: '/edit-room/:id', name: 'EditRoom', component: EditRoom, meta: { requiresAuth: true }, },
    { path: '/edit-lab/:id', name: 'EditLab', component: EditLab, meta: { requiresAuth: true }, },
    { path: '/editar-recurso/:tipo/:id', name: 'EditRecurso', component: EditRecurso, meta: { requiresAuth: true }, },
    { path: '/:pathMatch(.*)*', redirect: '/' }
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

// Guard de Navegação Global
router.beforeEach((to, from, next) => {
    const store = useStore(); // Acessa a store do Vuex para verificar o login

    // Verifica se a rota requer autenticação
    if (to.meta.requiresAuth && !store.state.user.name) {
        // Redireciona para o login se o usuário não estiver logado
        next({ name: 'Login' });
    } else {
        next(); // Permite a navegação
    }
});

export default router;
