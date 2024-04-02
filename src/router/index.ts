import { RouteConfig } from "vue-router";

export const routes: Array<RouteConfig> = [
  {
    path: '/crowdplanning/:groupId?/:planId?',
    name: 'crowdplanning',
    component: () => import(/* webpackChunkName: "crowdplanning" */ '@/views/crowdplanning/crowdplanning.vue'),
    props: route => ({
      groupId: route.params.groupId,
      planId: route.params.planId,
    }),
    meta: {
      requireAuth: false
    },
  },
  {
    path: 'crowdplanning/:groupId?/:planId?',
    name: 'public-crowdplanning',
    component: () => import(/* webpackChunkName: "crowdplanning" */ '@/views/crowdplanning/crowdplanning.vue'),
    props: route => ({
      groupId: route.params.groupId,
      planId: route.params.planId,
    }),
    meta: {
      public: true,
      requireAuth: false
    },
  },
];

