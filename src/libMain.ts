import { ModuleInitializer, menuType } from "vue-mf-module";
import { crowdplanningStore } from "./store";

declare let __webpack_public_path__: string;
__webpack_public_path__ = process.env.BASE_URL;

export default ModuleInitializer({
    async init(menu, mainstore, configuration) {
        menu.addMenuDefinition({
            description: "Crowdplanning",
            name: "Crowdplanning",
            hidden: () => false,
            icon: "",
            class: "main",
            routeName: "crowdplanning",
            featureflags: []
        }, { section: menuType.drawer });

        mainstore.registerModule(crowdplanningStore.PREFIX, crowdplanningStore);
        await registerComponents();

        Object.assign(CONFIGURATION, configuration || {});
    },
    routes: []
});

