import { createRouter, createWebHistory } from 'vue-router';
import tasks from "../pages/tasks/index.vue";

const routes = [
    {
        path: '/',
        component: () => import('../layouts/Dashboard.vue'),
        children:[
            {
                path: '',
                name: 'tasks',
                component: tasks,
            },
        ]
    },
    // {
    //     path: '/:pathMatch(.*)*',
    //     name: 'Page404',
    //     component: Page404
    // },
];

const router = createRouter({
    history: createWebHistory(),
    linkExactActiveClass: 'active',
    routes
});


export default router;
