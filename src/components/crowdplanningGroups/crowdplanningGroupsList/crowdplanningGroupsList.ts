import Component from "vue-class-component";
import Vue from 'vue';
import { Prop } from "vue-property-decorator";
import CrowdplanningGroupsItem from "../crowdplanningGroupsItem/crowdplanningGroupsItem.vue";
import { store } from "@/store";
import { MessageService, Projector } from "vue-mf-module";
import groupModal from "@/components/groupModal/groupModal.vue";
import { CONFIGURATION } from "@/configuration";
import { groupsService } from "@/services/groupsService";
import { plansService } from "@/services/plansService";
import { statesService } from "@/services/statesService";


@Component({
    components: {
        CrowdplanningGroupsItem
    }
})
export default class CrowdplanningGroupList extends Vue {


    async mounted() {
        this.currentUser = await MessageService.Instance.ask("WHO_AM_I");

        if (!this.currentUser)
            this.openAuthModal();

        await this.getData();
    }

    plansGroupRoot: server.Group = {} as server.Group;
    currentUser: server.Myself | null = null;
    workspaceId = "";
    states: server.State[] = [];
    loading = true;

    @Prop({ required: true })
    rootGroup!: server.Group;

    set selectedCategory(value: server.Group | null) {
        store.actions.crowdplanning.setSelectedCategory(value);
    }

    get selectedCategory(): server.Group | null {
        return store.getters.crowdplanning.getSelectedGroup();
    }

    openStatesModal(): void {
        MessageService.Instance.send("OPEN_PLANS_STATES_MODAL", this.rootGroup);
    }

    // public hasPermission(value: string): boolean {
    //     return this.$can(`PLANS.${value}`);
    // }

    hasPermission(permission: string): boolean {
        return this.$can(`${CONFIGURATION.context}.${permission}`);
    }

    public changedGroup(group: server.Group) {
        const idxChildrenGroup = this.rootGroup.children.findIndex((x) => x.id === group.id);
            
        if (idxChildrenGroup !== -1) {
            if ((group as any).deleted) {
                this.rootGroup.children.splice(idxChildrenGroup, 1);
            } else {
                this.rootGroup.children[idxChildrenGroup] = group;
            }

            this.$emit("rootGroupChanged", this.rootGroup);
        }
    }

    private async openAuthModal(): Promise<void> {
        await Projector.Instance.projectAsyncTo((() => import(/* webpackChunkName: "plansModal" */ '@/components/authModal/authModal.vue')) as any, {})
    }

    private async getData(): Promise<void> {
        this.workspaceId = (await MessageService.Instance.ask("MY_WORKSPACE") as any)?.id ?? '';

        if (!this.workspaceId)
            this.workspaceId = (CONFIGURATION.domainWorkspaceMap as Map<string, string>).get(window.location.hostname) || "";

        if (!this.workspaceId) return;

        let allGroups = [];
        if (this.currentUser) {
            allGroups = await groupsService.getGroups();
        } else {
            allGroups = await groupsService.getPublicGroups(this.workspaceId);
        }

        this.plansGroupRoot = allGroups.find(x => !x.parentGroupId) ?? {} as server.Group;

        if (this.plansGroupRoot) {
            this.plansGroupRoot.children = allGroups.filter(x => x.parentGroupId === this.plansGroupRoot?.id);
        }

        if (this.plansGroupRoot?.id) {
            if (this.currentUser) {
                await plansService.getPlans();
            } else {
                await plansService.getPublicPlans(this.workspaceId);
            }
        }

        this.states = await statesService.getStates(this.plansGroupRoot);

        console.log("filtered plans", this.filteredPlans);

        this.loading = false;
    }

    get filteredPlans(): server.Plan[] {
        return store.getters.crowdplanning.getFilteredPlans();
    }

    async createGroup(): Promise<void> {
        const g = {} as server.Group;

        g.parentGroupId = this.plansGroupRoot?.id ?? "";

        if (!this.plansGroupRoot || !this.plansGroupRoot.id) return;

        const result = await Projector.Instance.projectAsyncTo(groupModal as never, g);

        if (result) {
            this.$emit('groupCreated', result);
        } else {
            // error message
            MessageService.Instance.send('ERROR', this.$t("plans.crowdplanning.group-create-error", "Errore durante la creazione della categoria"));
        }
    }
}