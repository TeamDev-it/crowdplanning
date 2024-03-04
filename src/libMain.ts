import { MessageService, CommonRegistry, ModuleInitializer, Projector, menuType } from "vue-mf-module";
import { crowdplanningStore } from "./store";
import { CONFIGURATION } from "./configuration";
import { routes } from "./router";

declare let __webpack_public_path__: string;
declare let process: any;

// eslint-disable-next-line @typescript-eslint/no-unused-vars, prefer-const
__webpack_public_path__ = process.env.BASE_URL;
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
    },

    MessageService.Instance.subscribe("OPEN_TASK_SELECTOR_MODAL", (planId: string) => {
      Projector.Instance.projectAsyncTo((() => import('@/components/taskSelectorModal/taskSelectorModal.vue')) as never, planId)
    }
    
    
    ))
    
  },
  routes
});


