import CrowdplanningGroupList from "@/components/crowdplanningGroups/crowdplanningGroupsList/crowdplanningGroupsList.vue";
import CrowdplanningHeader from "@/components/crowdplanningHeader/crowdplanningHeader.vue";
import groupModal from "@/components/groupModal/groupModal.vue";
import PlanModal from "@/components/planModal/planModal.vue";
import ScrollableContainer from "@/components/scrollableContainer/scrollableContainer.vue";
import TaskDetail from "@/components/taskDetail/taskDetail.vue";
import TaskMap from "@/components/taskMap/taskMap.vue";
import TaskList from "@/components/tasks/taskList/taskList.vue";
import { CONFIGURATION } from "@/configuration";
import { groupsService } from "@/services/groupsService";
import { statesService } from "@/services/statesService";
import { plansService } from "@/services/plansService";
import { store } from "@/store";
import { cloneDeep } from "lodash";
import Vue from "vue";
import Component from "vue-class-component";
import { MessageService, Projector } from "vue-mf-module";
import { Watch } from "vue-property-decorator";

@Component({
    components: {
        CrowdplanningHeader,
        ScrollableContainer,
        CrowdplanningGroupList,
        TaskList,
        PlanModal,
        TaskMap,
        TaskDetail
    },
    name: "crowdplanning-component"
})
export default class Crowdplanning extends Vue {
    plansGroupRoot: server.Group = {} as server.Group;
    plans: server.Plan[] = [];
    currentUser: server.Myself | null = null;
    states: server.State[] = [];
    loading = true;
    workspaceId = "";

    componentKey: number = 0;

    get groups(): server.Group[] {
        return this.plansGroupRoot?.children ?? [];
    }

    get selectedGroup(): server.Group | null {
        return store.getters.crowdplanning.getSelectedCategory();
    }

    get searchedValue(): string {
        return store.state.crowdplanning.searchedValue
    }

    get selectedTask(): server.Plan | null {
        return store.state.crowdplanning.selectedPlan;
    }

    get filteredPlans(): server.Plan[] {
        let result: server.Plan[] = cloneDeep(this.plans);

        if (this.selectedTask) {
            return this.plans.filter(x => x.id === this.selectedTask?.id);
        }

        if (this.selectedGroup) {
            result = this.plans.filter(x => x.groupId === this.selectedGroup?.id);
        }

        if (this.searchedValue) {
            result = result.filter(x => x.title?.includes(this.searchedValue) || x.description?.includes(this.searchedValue));
        }

        return result;
    }

    async mounted() {
        this.currentUser = await MessageService.Instance.ask("WHO_AM_I");
        MessageService.Instance.subscribe("PLANS_CREATED", this.plansCreated);

        await this.getData();
    }

    private plansCreated(task: server.Plan): void {
        this.plans.push(task);
    }

    public rootGroupChanged(group: server.Group): void {
        this.plansGroupRoot = group;
        this.componentKey++;
    }

    private async getData(): Promise<void> {
        this.workspaceId = CONFIGURATION.domainWorkspaceMap.get(window.location.hostname) || "";

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
                this.plans = await plansService.getPlans();
            } else {
                this.plans = await plansService.getPublicPlans(this.workspaceId);
            }
        }

        this.states = await statesService.getStates(this.plansGroupRoot);

        this.loading = false;
    }

    hasPermission(permission: string): boolean {
        return this.$can(`${CONFIGURATION.context}.${permission}`);
    }

    async createGroup(): Promise<void> {
        const g = {} as server.Group;

        g.parentGroupId = this.plansGroupRoot?.id ?? "";

        if (!this.plansGroupRoot || !this.plansGroupRoot.id) return;

        const result = await Projector.Instance.projectAsyncTo(groupModal as never, g);

        if (result) {
            this.plansGroupRoot?.children.push(result);
            this.componentKey++;
        } else {
            // error message
            MessageService.Instance.send('ERROR', this.$t("plans.crowdplanning.group-create-error", "Errore durante la creazione della categoria"));
        }
    }

    async addTask(): Promise<void> {
        await Projector.Instance.projectAsyncTo(PlanModal as never, this.groups);
    }
}