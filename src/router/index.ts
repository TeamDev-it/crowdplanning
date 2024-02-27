import { RouteConfig } from "vue-router";

export const routes: Array<RouteConfig> = [
{
  path: '/crowdplanning',
  name: 'crowdplanning',
  meta: {
    requireAuth: false,
    claims: ['PLANS.plans.enabled']
  },
  component: () => import(/* webpackChunkName: "crowdplanning" */ '@/views/crowdplanning/crowdplanning.vue')
},
{
  path: '/crowdplanning/project/:id',
  name: 'crowdplanning-project',
  component: () => import('@/views/crowdplanning/crowdplanning.vue'),
  props: true
}];
