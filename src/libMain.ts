import { MessageService, ModuleInitializer, Projector, menuType } from "vue-mf-module";
import { crowdplanningStore } from "./store";
import { CONFIGURATION } from "./configuration";
import { routes } from "./router";

declare let __webpack_public_path__: string;
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
            featureflags: []
        }, { section: menuType.drawer });

        mainstore.registerModule(crowdplanningStore.PREFIX, crowdplanningStore);

        Object.assign(CONFIGURATION, configuration || {});

        MessageService.Instance.subscribe("OPEN_PLANS_STATES_MODAL", (group: server.Group) => {
            Projector.Instance.projectAsyncTo((() => import(/* webpackChunkName: "plansModal" */ '@/components/statesModal/statesModal.vue')) as any, group)
        });
    },
    routes
});
