import { createRouter, createWebHashHistory } from 'vue-router';
import Home from '@/views/Home.vue';
import Space from '@/views/Space.vue';
import SpaceOverview from '@/views/Space/Overview.vue';
import SpaceProposals from '@/views/Space/Proposals.vue';
import SpaceSettings from '@/views/Space/Settings.vue';
import SpaceTreasury from '@/views/Space/Treasury.vue';
import SpaceEditor from '@/views/Editor.vue';
import Proposal from '@/views/Proposal.vue';
import User from '@/views/User.vue';
import Create from '@/views/Create.vue';
import Settings from '@/views/Settings.vue';
import Contacts from '@/views/Settings/Contacts.vue';
import Explore from '@/views/Explore.vue';
import SettingsSpaces from '@/views/Settings/Spaces.vue';

const routes: any[] = [
  { path: '/', name: 'home', component: Home },
  { path: '/explore', name: 'explore', component: Explore },
  { path: '/create', name: 'create', component: Create },
  {
    path: '/:id([^:]+:[A-Za-z0-9]+)',
    name: 'space',
    component: Space,
    children: [
      { path: '', name: 'space-overview', component: SpaceOverview },
      { path: 'proposals', name: 'space-proposals', component: SpaceProposals },
      { path: 'settings', name: 'space-settings', component: SpaceSettings },
      { path: 'treasury', name: 'space-treasury', component: SpaceTreasury },
      { path: 'create/:key?', name: 'editor', component: SpaceEditor, meta: { hideNav: true } },
      { path: 'proposal/:pid', name: 'proposal', component: Proposal, meta: { hideNav: true } }
    ]
  },
  {
    path: '/profile/:id',
    name: 'user',
    component: User
  },
  {
    path: '/settings',
    name: 'settings',
    component: Settings,
    children: [
      { path: '', name: 'settings-spaces', component: SettingsSpaces },
      { path: 'contacts', name: 'settings-contacts', component: Contacts }
    ]
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
