import Component from "vue-class-component";
import Vue from "vue";
import { Prop } from "vue-property-decorator";
import { store } from "@/store";
import { attachmentService } from "@/services/attachmentService";
import { CONFIGURATION } from "@/configuration";

@Component
export default class TaskCard extends Vue {
    @Prop()
    value!: server.Plan;

    @Prop({ default: true })
    showCommands!: boolean;

    coverImageUri = '';
    loading = true;

    get taskDate(): string {
        return `${this.value.creationDate.getDate()}/${this.value.creationDate.getMonth()}/${this.value.creationDate.getFullYear()}`;
    }

    async mounted() {
        this.coverImageUri = this.getTaskImageUrl();

        this.loading = false;
    }

    selectTask(): void {
        store.actions.crowdplanning.setSelectedPlan(this.value);
    }

    private getTaskImageUrl(): string {
        try {
            return attachmentService.getFileUrl(CONFIGURATION.context, `${CONFIGURATION.context}-${this.value.workspaceId}-${this.value.id}`, this.value.workspaceId!);
        } catch (err) {
            return '';
        }
    }
}