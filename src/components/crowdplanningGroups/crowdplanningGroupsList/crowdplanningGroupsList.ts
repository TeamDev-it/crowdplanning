import Component from "vue-class-component";
import Vue from 'vue';
import { Prop } from "vue-property-decorator";
import CrowdplanningGroupsItem from "../crowdplanningGroupsItem/crowdplanningGroupsItem.vue";
import { store } from "@/store";


@Component({
    components: {
        CrowdplanningGroupsItem
    }
})
export default class CrowdPlanningGroupList extends Vue {
    @Prop({required: true})
    group!: server.Group;

    get selectedCategory(): server.Group | null {
        return store.getters.crowdplanning.getSelectedCategory();
    }

    get categories(): server.Group[] {
        return this.group.children;
    }
}