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
export default class CrowdplanningGroupList extends Vue {
    @Prop({required: true})
    groups!: server.Group[];

    mounted() {
        console.log("groups: ", this.groups)
    }

    set selectedCategory(value: server.Group | null) {
        store.actions.crowdplanning.setSelectedCategory(value);
    }

    get selectedCategory(): server.Group | null {
        return store.getters.crowdplanning.getSelectedCategory();
    }
}