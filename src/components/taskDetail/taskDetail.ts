import Component from "vue-class-component";
import Vue from 'vue';
import { Prop } from "vue-property-decorator";
import TaskCard from "../tasks/taskCard/taskCard.vue";
import TaskSummary from "../taskSummary/taskSummary.vue";
import CitizenInteraction from "../citizenInteraction/citizenInteraction.vue";
import { store } from "@/store";
import { CONFIGURATION } from "@/configuration";
import { MessageService, Projector } from "vue-mf-module";
import PlanModal from "../planModal/planModal.vue";
import { attachmentService } from "@/services/attachmentService";
import AttachmentsList from "../attachmentsList/attachmentsList.vue";
import { kebabCase } from "lodash";
import { plansService } from "@/services/plansService";

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
        const whoAmI = await MessageService.Instance.ask("WHO_AM_I");
        const context = `${CONFIGURATION.context}-${this.task.id}`;

        if (whoAmI) {
            this.files = await MessageService.Instance.ask("GET_DATA", { context: context });
        } else {
            this.files = await MessageService.Instance.ask('GET_PUBLIC_DATA', { context: context, id: this.task.id, workspaceId: this.task.workspaceId });
        }

    }

    get type(): string {
        return CONFIGURATION.context;
    }

    clearTask(): void {
        store.actions.crowdplanning.setSelectedPlanId(null);
    }

    get groups() {
        return store.getters.crowdplanning.getGroups;
    }

    async remove(): Promise<void> {
        try {
            await plansService.deleteTask(this.task.id);

            store.actions.crowdplanning.setSelectedPlanId(null);
        } catch(err) {
            MessageService.Instance.send('ERROR', this.$t("plans.crowdplanning.plan-delete-error", "Errore durante l'eliminazione della categoria"));
        }
    }

    async edit(): Promise<void> {
        await Projector.Instance.projectAsyncTo(PlanModal as never, this.task.id);
    }

    hasPermission(permission: string): boolean {
        return this.$can(`${CONFIGURATION.context}.${permission}`);
    }
}