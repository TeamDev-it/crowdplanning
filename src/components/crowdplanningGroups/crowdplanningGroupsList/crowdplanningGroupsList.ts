import Component from "vue-class-component";
import Vue from 'vue';
import { Prop } from "vue-property-decorator";
import CrowdplanningGroupsItem from "../crowdplanningGroupsItem/crowdplanningGroupsItem.vue";
import { store } from "@/store";
import { MessageService } from "vue-mf-module";


@Component({
    components: {
        CrowdplanningGroupsItem
    }
})
export default class CrowdplanningGroupList extends Vue {
    @Prop({ required: true })
    groups!: server.Group[];

    @Prop({ required: true })
    rootGroup!: server.Group;

    set selectedCategory(value: server.Group | null) {
        store.actions.crowdplanning.setSelectedCategory(value);
    }

    get selectedCategory(): server.Group | null {
        return store.getters.crowdplanning.getSelectedCategory();
    }

    openStatesModal(): void {
        MessageService.Instance.send("OPEN_PLANS_STATES_MODAL", this.rootGroup);
    }
}