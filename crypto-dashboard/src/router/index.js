import { createRouter, createWebHashHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Single from '../views/Single.vue';
import News from '../views/News.vue';
import NotFound from '../views/Error/NotFound.vue';
import CryptoNotFound from '../views/Error/CryptoNotFound.vue';

const routes = [{
        path: '/home',
        name: 'home',
        component: Home
    },
    {
        path: '/',
        redirect: to => {
            return '/home'
        },
    },
    {
        path: '/about',
        name: 'about',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
            import ( /* webpackChunkName: "about" */ '../views/About.vue')
    },
    {
        path: '/asset/:cryptoAsset',
        name: 'single',
        component: () =>
            import ( /* webpackChunkName: "single" */ '../views/Single.vue'),
        props: true
    },
    {
        path: '/crypto-news/',
        name: 'news',
        component: () =>
            import ( /* webpackChunkName: "news" */ '../views/News.vue')
    },
    {
        path: '/crypto-not-found',
        name: 'CryptoNotFound',
        component: CryptoNotFound,
    },
    //catch 404 error
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: NotFound,
    },
]

const router = createRouter({
    history: createWebHashHistory(process.env.BASE_URL),
    routes
})

export default router