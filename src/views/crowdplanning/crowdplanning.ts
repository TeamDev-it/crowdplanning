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
    selectedPlan: server.Plan | null = null;
    selectedGroup: server.Group | null = null;
    plansGroupRoot: server.Group = {} as server.Group;
    currentUser: server.Myself | null = null;
    states: server.State[] = [];
    loading = true;
    workspaceId = "";

    value!: server.Plan;

    componentKey = 0;

    get searchedValue(): string {
        return store.state.crowdplanning.searchedValue
    }

    // addTask() {
    //     store.actions.crowdplanning.setSelectedPlanId(this.value);
    //     console.log(this.value)
    // }

    get plans(): server.Plan[] {
        return store.getters.crowdplanning.getPlans();
    }


    async mounted() {
        this.currentUser = await MessageService.Instance.ask("WHO_AM_I");

        if (!this.currentUser)
            this.openAuthModal();

        await this.getData();
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


        this.loading = false;
    }

    public rootGroupChanged(group: server.Group): void {
        this.plansGroupRoot = group;
        this.componentKey++;
    }

    hasPermission(permission: string): boolean {
        return this.$can(`${CONFIGURATION.context}.${permission}`);
    }

    addPlanSec: boolean = false
    addPlan() {
     let ap = this.addPlanSec
     this.addPlanSec = !ap 
    }

    toggleMap: boolean = true
    changeView() {
       let tm = this.toggleMap
       this.toggleMap = !tm
    }
    

    get filteredPlans() {
        let result: server.Plan[] = cloneDeep(store.getters.crowdplanning.getPlans());
  
        if (this.selectedPlan) {
          return result.filter(x => x.id === this.selectedPlan?.id);
        }
  
        if (this.selectedGroup) {
          result = result.filter(x => x.groupId === this.selectedGroup?.id);
        }
  
        if (this.searchedValue) {
          result = result.filter(x => x.title?.includes(this.searchedValue) || x.description?.includes(this.searchedValue));
        }
  
        return result;
    }

    setSelectedGroup(value: server.Group | null) {
        this.selectedGroup = value
    }

    setSelectedPlan(value: server.Plan | null) {
        this.selectedPlan = value
    }

    goBack() {
        this.selectedPlan = null;
        this.addPlanSec = false;
    }
}