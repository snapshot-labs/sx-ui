import { createRouter, createWebHashHistory } from 'vue-router';
import Home from '@/views/Home.vue';
import Space from '@/views/Space.vue';
import SpaceOverview from '@/views/Space/Overview.vue';
import SpaceProposals from '@/views/Space/Proposals.vue';
import SpaceSearch from '@/views/Space/Search.vue';
import DiscussionsSettings from '@/views/Discussions/Settings.vue';
import Discussion from '@/views/Discussions/Discussion.vue';
import Discuss from '@/views/Discussions/Discuss.vue';
import NewCategory from '@/views/Discussions/NewCategory.vue';
import Discussions from '@/views/Discussions/Discussions.vue';
import Roles from '@/views/Roles.vue';
import Profile from '@/views/Settings/Profile.vue';
import SpaceSettings from '@/views/Space/Settings.vue';
import SpaceTreasury from '@/views/Space/Treasury.vue';
import SpaceDelegates from '@/views/Space/Delegates.vue';
import Editor from '@/views/Editor.vue';
import Proposal from '@/views/Proposal.vue';
import User from '@/views/User.vue';
import Create from '@/views/Create.vue';
import Settings from '@/views/Settings.vue';
import Contacts from '@/views/Settings/Contacts.vue';
import Explore from '@/views/Explore.vue';
import SettingsSpaces from '@/views/Settings/Spaces.vue';

const routes: any[] = [
  { path: '/', name: 'home', component: Home },
  {
    path: '/:id',
    name: 'space',
    component: Space,
    children: [
      { path: '', name: 'space-overview', component: SpaceOverview },
      { path: 'proposals', name: 'space-proposals', component: SpaceProposals },
      { path: 'search', name: 'space-search', component: SpaceSearch },
      { path: 'settings', name: 'space-settings', component: SpaceSettings },
      { path: 'treasury', name: 'space-treasury', component: SpaceTreasury },
      { path: 'delegates', name: 'space-delegates', component: SpaceDelegates },
      { path: 'roles', name: 'space-roles', component: Roles },
      { path: 'discussions/:category?', name: 'space-discussions', component: Discussions },
      {
        path: 'discussions/:category/settings',
        name: 'discussions-category-settings',
        component: DiscussionsSettings
      },
      { path: 'discussions/new-category/:parent?', name: 'new-category', component: NewCategory },
      { path: 'topic/:topic', name: 'topic', component: Discussion },
      { path: 'discussions/:category/new', name: 'discuss', component: Discuss }
    ]
  },
  {
    path: '/:id/create/:key?',
    name: 'editor',
    component: Editor
  },
  { path: '/:space/proposal/:id?', name: 'proposal', component: Proposal },
  { path: '/profile/:id', name: 'user', component: User },
  { path: '/create', name: 'create', component: Create },
  {
    path: '/settings',
    name: 'settings',
    component: Settings,
    children: [
      { path: '', name: 'settings-spaces', component: SettingsSpaces },
      { path: 'contacts', name: 'settings-contacts', component: Contacts },
      { path: 'profile', name: 'settings-profile', component: Profile }
    ]
  },
  { path: '/explore', name: 'explore', component: Explore }
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
