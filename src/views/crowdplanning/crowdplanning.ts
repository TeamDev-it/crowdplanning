import CrowdplanningGroupList from "@/components/crowdplanningGroups/crowdplanningGroupsList/crowdplanningGroupsList.vue";
import CrowdplanningHeader from "@/components/crowdplanningHeader/crowdplanningHeader.vue";
import groupModal from "@/components/groupModal/groupModal.vue";
import ScrollableContainer from "@/components/scrollableContainer/scrollableContainer.vue";
import TaskModal from "@/components/taskModal/taskModal.vue";
import TaskList from "@/components/tasks/taskList/taskList.vue";
import { CONFIGURATION } from "@/configuration";
import { tasksService } from "@/services/tasksService";
import Vue from "vue";
import Component from "vue-class-component";
import { MessageService, Projector } from "vue-mf-module";

@Component({
    components: {
        CrowdplanningHeader,
        ScrollableContainer,
        CrowdplanningGroupList,
        TaskList,
        TaskModal
    },
    name: "crowdplanning-component"
})
export default class Crowdplanning extends Vue {
    plansGroupRoot: server.Group = {} as server.Group;
    tasks: server.Task[] = [];
    currentUser: server.Myself | null = null;

    get groups(): server.Group[] {
        return this.plansGroupRoot?.children ?? [];
    }

    async mounted() {
        this.currentUser = await MessageService.Instance.ask("WHO_AM_I");

        await this.getData();
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
        await Projector.Instance.projectAsyncTo(TaskModal as any, this.groups);
    }
}