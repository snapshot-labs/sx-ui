import { createRouter, createWebHashHistory } from 'vue-router';
import Home from '@/views/Home.vue';
import Space from '@/views/Space.vue';
import Overview from '@/views/Space/Overview.vue';
import Proposals from '@/views/Space/Proposals.vue';
import Settings from '@/views/Space/Settings.vue';
import Editor from '@/views/Editor.vue';
import Treasury from '@/views/Space/Treasury.vue';
import Proposal from '@/views/Proposal.vue';
import User from '@/views/User.vue';
import Create from '@/views/Create.vue';
import Explore from '@/views/Explore.vue';

const routes: any[] = [
  { path: '/', name: 'home', component: Home },
  { path: '/explore', name: 'explore', component: Explore },
  { path: '/create', name: 'create', component: Create },
  {
    path: '/:id',
    name: 'space',
    component: Space,
    children: [
      { path: '', name: 'overview', component: Overview },
      { path: 'proposals', name: 'proposals', component: Proposals },
      { path: 'settings', name: 'settings', component: Settings },
      { path: 'treasury', name: 'treasury', component: Treasury },
      { path: 'create/:key?', name: 'editor', component: Editor },
      { path: 'proposal/:pid', name: 'proposal', component: Proposal }
    ]
  },
  {
    path: '/profile/:id',
    name: 'user',
    component: User
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'error-404',
    redirect: '/'
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition;
    if (to.params.retainScrollPosition) return {};
    if (to.hash) {
      const position = { selector: to.hash };
      return { el: position };
    }
    return { top: 0 };
  }
});

export default router;
