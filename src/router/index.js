/*eslint-disable*/

import Router from 'vue-router';
import Auth from '../components/Auth.vue';
import Race from '../components/Race.vue';


const router = new Router({
    routes: [
        { path: '/', component: Auth },
        { path: '/auth', component: Auth },
        { path: '/race', component: Race }
    ]
});

export default router;