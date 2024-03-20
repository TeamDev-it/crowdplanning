import { MessageService, CommonRegistry, ModuleInitializer, Projector, menuType } from "vue-mf-module";
import { crowdplanningStore } from "./store";
import { CONFIGURATION } from "./configuration";
import { routes } from "./router";


declare let process: any;

// eslint-disable-next-line @typescript-eslint/no-unused-vars, prefer-const

const menuimage = new URL("@/assets/crowdplanning.png", import.meta.url);
export default ModuleInitializer({
  async init(menu, mainstore, configuration) {
    menu.addMenuDefinition({
      description: "Crowdplanning",
      name: "Crowdplanning",
      hidden: () => false,
      icon: "<i class='ti ti-file-like'></i>",
      class: "main",
      routeName: "crowdplanning",
      meta: {
        themeColor: 'var(--crowdplanning-primary-color)', 
        image: menuimage
      },
      featureflags: [
        "PLANS.plans.enabled"
      ]
    }, { section: menuType.drawer });

    mainstore.registerModule(crowdplanningStore.PREFIX, crowdplanningStore);

    Object.assign(CONFIGURATION, configuration || {});

    CommonRegistry.Instance.provideComponent(() => import("@/components/planMapToolTip/planMapTooltip.vue"), "maptooltip-PLANS");

    MessageService.Instance.subscribe("OPEN_PLANS_STATES_MODAL", (group: server.Group) => {
      Projector.Instance.projectAsyncTo((() => import('@/components/statesModal/crowdStatesModal.vue')) as never, group)
    })

    MessageService.Instance.subscribe("OPEN_TASK_SELECTOR_MODAL", (planId: string) => {
      Projector.Instance.projectAsyncTo((() => import('@/components/taskSelectorModal/taskSelectorModal.vue')) as never, planId)
    })


    function ProvideComponentForEvents(component: any, componentname: string, events: string[]) {
      for (const e of events) {
        CommonRegistry.Instance.provideComponent(component, componentname, e);
      }
    }

    ProvideComponentForEvents(() => import('@/components/rule_actions/assignToPlanByLocation/assignToPlanByLocation.vue'), 'associateToCrowdplanning',
    ['dynamicrule-actions-taskcreated', 'dynamicrule-actions-taskchanged','dynamicrule-actions-issuecreated', 'dynamicrule-actions-issuechanged']);
    
  },
  routes
});


