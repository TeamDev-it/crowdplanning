import CrowdplanningHeader from "@/components/crowdplanningHeader/crowdplanningHeader.vue";
import { tasksService } from "@/services/tasksService";
import Vue from "vue";
import Component from "vue-class-component";
import { MessageService } from "vue-mf-module";

@Component({
    components: {
        CrowdplanningHeader
    }
})
export default class Crowdplanning extends Vue {
    type = "PLANS";
    plansGroupRoot: server.Group | undefined = undefined;
    tasks: server.Task[] = [];
    currentUser: server.Myself | null = null;

    async mounted() {
        this.currentUser = await MessageService.Instance.ask("WHO_AM_I");
    }

    private async getData(): Promise<void> {
        this.plansGroupRoot = (await tasksService.getGroups()).find(g => g.taskType.toUpperCase() === this.type.toUpperCase());

        if (this.plansGroupRoot?.id)
            this.tasks = await tasksService.getTasks(this.plansGroupRoot?.id);
    }

    hasPermission(permission: string): boolean {
        return this.$can(`${this.type}.${permission}`);
    }
}