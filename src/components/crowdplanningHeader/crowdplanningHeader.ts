import Component from "vue-class-component";
import Vue from "vue";
import { store } from "@/store";

@Component({})
export default class CrowdplanningHeader extends Vue {
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