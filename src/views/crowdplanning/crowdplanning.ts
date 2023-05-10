import CrowdplanningGroupList from "@/components/crowdplanningGroups/crowdplanningGroupsList/crowdplanningGroupsList.vue";
import CrowdplanningHeader from "@/components/crowdplanningHeader/crowdplanningHeader.vue";
import groupModal from "@/components/groupModal/groupModal.vue";
import ScrollableContainer from "@/components/scrollableContainer/scrollableContainer.vue";
import TaskDetail from "@/components/taskDetail/taskDetail.vue";
import TaskMap from "@/components/taskMap/taskMap.vue";
import TaskModal from "@/components/taskModal/taskModal.vue";
import TaskList from "@/components/tasks/taskList/taskList.vue";
import { CONFIGURATION } from "@/configuration";
import { tasksService } from "@/services/tasksService";
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
        TaskModal,
        TaskMap,
        TaskDetail
    },
    name: "crowdplanning-component"
})
export default class Crowdplanning extends Vue {
    plansGroupRoot: server.Group = {} as server.Group;
    tasks: server.Task[] = [];
    currentUser: server.Myself | null = null;
    states: server.State[] = [];
    loading = true;

    get groups(): server.Group[] {
        return this.plansGroupRoot?.children ?? [];
    }

    get selectedGroup(): server.Group | null {
        return store.getters.crowdplanning.getSelectedCategory();
    }

    get searchedValue(): string {
        return store.state.crowdplanning.searchedValue
    }

    get selectedTask(): server.Task | null {
        return store.state.crowdplanning.selectedTask;
    }

    get filteredTasks(): server.Task[] {
        let result: server.Task[] = cloneDeep(this.tasks);

        if (this.selectedTask) {
            return this.tasks.filter(x => x.id === this.selectedTask?.id);
        }

        if (this.selectedGroup) {
            result = this.tasks.filter(x => x.groupId === this.selectedGroup?.id);
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

    private plansCreated(task: server.Task): void {
        this.tasks.push(task);
    }

    private async getData(): Promise<void> {
        const allGroups = (await tasksService.getGroups())
            .filter(g => g.taskType.toUpperCase() === CONFIGURATION.defaultTaskType.toUpperCase());

        this.plansGroupRoot = allGroups.find(x => !x.parentGroupId) ?? {} as server.Group;

        if (this.plansGroupRoot) {
            this.plansGroupRoot.children = allGroups.filter(x => x.parentGroupId === this.plansGroupRoot?.id);
        }

        if (this.plansGroupRoot?.id)
            this.tasks = await tasksService.getTasks(CONFIGURATION.workspaceId);

        this.states = await tasksService.getStates(CONFIGURATION.workspaceId);

        this.loading = false;
    }   

    hasPermission(permission: string): boolean {
        return this.$can(`${CONFIGURATION.defaultTaskType}.${permission}`);
    }

    async createGroup(): Promise<void> {
        const g = {} as server.Group;

        g.parentGroupId = this.plansGroupRoot?.id ?? "";
        g.taskType = this.plansGroupRoot?.taskType ?? "PLANS";

        const result = await Projector.Instance.projectAsyncTo(groupModal as never, g);

        if (result) {
            this.plansGroupRoot?.children.push(result);
        } else {
            // error message
            MessageService.Instance.send('ERROR', this.$t("plans.crowdplanning.group-create-error", "Errore durante la creazione della categoria"));
        }
    }

    async addTask(): Promise<void> {
        await Projector.Instance.projectAsyncTo(TaskModal as never, this.groups);
    }
}