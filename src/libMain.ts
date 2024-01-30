import { MessageService, CommonRegistry, ModuleInitializer, Projector, menuType } from "vue-mf-module";
import { crowdplanningStore } from "./store";
import { CONFIGURATION } from "./configuration";
import { routes } from "./router";

declare let __webpack_public_path__: string;
declare let process: any;

// eslint-disable-next-line @typescript-eslint/no-unused-vars, prefer-const
__webpack_public_path__ = process.env.BASE_URL;

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
        themeColor: '#43a047'
      },
      featureflags: []
    }, { section: menuType.drawer });

    mainstore.registerModule(crowdplanningStore.PREFIX, crowdplanningStore);

    Object.assign(CONFIGURATION, configuration || {});

    CommonRegistry.Instance.provideComponent(() => import("@/components/planMapToolTip/planMapTooltip.vue"), "maptooltip-PLANS");

    MessageService.Instance.subscribe("OPEN_PLANS_STATES_MODAL", (group: server.Group) => {
      Projector.Instance.projectAsyncTo((() => import('@/components/statesModal/crowdStatesModal.vue')) as never, group)
    }
    
    
    );
    
  },
  routes
});

// MessageService.Instance.reply("OPEN_PLANS_WIZARD", (group: server.Group) => {
//   Projector.Instance.projectAsyncTo((() => import('@/components/planWizard/planWizard.vue')) as never, group)
// })
