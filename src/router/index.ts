import { RouteConfig } from "vue-router";

export const routes: Array<RouteConfig> = [
{
  path: '/crowdplanning',
  name: 'crowdplanning',
  meta: {
    avoidKickoff: true
  },
  component: () => import(/* webpackChunkName: "crowdplanning" */ '@/views/crowdplanning/crowdplanning.vue')
}];