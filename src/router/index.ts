import { RouteConfig } from "vue-router";

export const routes: Array<RouteConfig> = [
{
  path: '/:workspaceId/crowdplanning',
  name: 'crowdplanning',
  meta: {
    requireAuth: false
  },
  component: () => import(/* webpackChunkName: "crowdplanning" */ '@/views/crowdplanning/crowdplanning.vue')
}];