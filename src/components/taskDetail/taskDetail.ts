import Component from "vue-class-component";
import Vue from 'vue';
import { Prop } from "vue-property-decorator";
import TaskCard from "../tasks/taskCard/taskCard.vue";
import TaskSummary from "../taskSummary/taskSummary.vue";
import CitizenInteraction from "../citizenInteraction/citizenInteraction.vue";
import { store } from "@/store";
import { CONFIGURATION } from "@/configuration";
import { Projector } from "vue-mf-module";
import PlanModal from "../planModal/planModal.vue";
import { attachmentService } from "@/services/attachmentService";
import AttachmentsList from "../attachmentsList/attachmentsList.vue";

@Component({
    components: {
        TaskCard,
        TaskSummary,
        CitizenInteraction,
        AttachmentsList
    }
})
export default class TaskDetail extends Vue {
    @Prop({ required: true })
    task!: server.Plan;

    files: server.FileAttach[] = [];

    async mounted(): Promise<void> {
        this.files = await attachmentService.getAttachments(`${this.task.id}`, this.task.workspaceId ?? '');
    }

    get type(): string {
        return CONFIGURATION.context;
    }

    clearTask(): void {
        store.actions.crowdplanning.setSelectedPlan(null);
    }

    get groups() {
        return store.getters.crowdplanning.getGroups;
    }

    async edit(): Promise<void> {
        await Projector.Instance.projectAsyncTo(PlanModal as never, this.task.id);
    }

    hasPermission(permission: string): boolean {
        return this.$can(`${CONFIGURATION.context}.${permission}`);
    }
}