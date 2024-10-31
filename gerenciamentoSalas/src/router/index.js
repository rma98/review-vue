import { createRouter, createWebHistory } from 'vue-router';
import MainLayout from "../layouts/MainLayout.vue";
import Home from '../views/Home.vue';
import AddRoom from '../views/AddRoom.vue';
import ViewRoom from '../views/ViewRoom.vue';
import EditRoom from '../views/EditRoom.vue';
import AddLab from '../views/AddLab.vue';
import ViewLab from '../views/ViewLab.vue';
import EditLab from '../views/EditLab.vue';
import AddRecursos from '../components/AddRecursos.vue';
import Register from '../views/Register.vue';
import Login from '../views/Login.vue';
import Perfil from '../views/Perfil.vue';

const routes = [
    {
        path: '/',
        component: MainLayout,
        children: [
            {
                path: '',
                name: 'Home',
                component: Home,
            },
            {
                path: 'view-room',
                name: 'ViewRoom',
                component: ViewRoom,
            },
            {
                path: 'view-lab',
                name: 'ViewLab',
                component: ViewLab,
            },
            {
                path: '/add-room',
                name: 'AddRoom',
                component: AddRoom,
            },
            {
                path: '/add-lab',
                name: 'AddLab',
                component: AddLab
            },
            {
                path: '/add-recursos',
                name: 'AddRecursos',
                component: AddRecursos,
                meta: { requiresAuth: true }, // Defina se o acesso é restrito
            },
            {
                path: '/register',
                name: 'Register',
                component: Register
            },
            {
                path: '/login',
                name: 'Login',
                component: Login
            },
            {
                path: '/perfil',
                name: 'Perfil',
                component: Perfil
            },
        ],
    },

    {
        path: '/edit-room/:id',
        name: 'EditRoom',
        component: EditRoom,
    },
    {
        path: '/edit-lab/:id',
        name: 'EditLab',
        component: EditLab
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: '/'
    }
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

export default router;
