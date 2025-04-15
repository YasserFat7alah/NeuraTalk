import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import ChatView from "../views/ChatView.vue";

const routes =[
    {path: '/', component: HomeView},
    {path:'/chat', component:ChatView}
];

export const router = createRouter({
    history: createWebHistory(),
     routes
}
)