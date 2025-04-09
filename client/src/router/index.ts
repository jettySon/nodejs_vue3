// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import BoardList from '../components/board/BoardList.vue'
import Home from '../views/Home.vue'
import BoardView from "../components/board/BoardView.vue";

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/board',
        name: 'Board',
        component: BoardList
    },
    {
        path: '/board/:idx',
        name: 'BoardView',
        component: BoardView
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router