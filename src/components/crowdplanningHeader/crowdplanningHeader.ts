import Component from "vue-class-component";
import Vue from "vue";
import { store } from "@/store";
import { Prop } from "vue-property-decorator";

@Component({})
export default class CrowdplanningHeader extends Vue {
    @Prop({})
    currentUser!: server.Myself | null;

    get searchedValue(): string {
        return store.getters.crowdplanning.getSearchedValue();
    }

    set searchedValue(value: string) {
        store.actions.crowdplanning.setSearchedValue(value);
    }

    hasPermission(permission: string): boolean {
        return this.$can(`PLANS.${permission}`);
    }

    async addTask(): Promise<void> {
        this.$emit("addTask");
    }
}