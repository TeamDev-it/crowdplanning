import Component from "vue-class-component";
import Vue from "vue";
import { Prop } from "vue-property-decorator";
import { store } from "@/store";
import { CONFIGURATION } from "@/configuration";
import { Icon } from "@/utility/Icon";
import { CommonRegistry, MessageService } from "vue-mf-module";

@Component
export default class TaskCard extends Vue {
    @Prop()
    value!: server.Plan;

    @Prop({ default: true })
    showCommands!: boolean;

    coverImageUri = '';
    loading = true;
    group: server.Group | null = null;

    get iconCode(): string {
        return Icon.getIconCode(this.group?.iconCode ?? '');
    }

    get imagePreview() {
        return CommonRegistry.Instance.getComponent("image-preview")
    }

    async mounted() {
        this.coverImageUri = await this.getTaskImageUrl();

        this.group = store.getters.crowdplanning.getGroupById(this.value.groupId);

        this.loading = false;
    }

    selectTask(): void {
        store.actions.crowdplanning.setSelectedPlanId(this.value.id);
    }

    private async getTaskImageUrl(): Promise<string> {
        try {
            return await MessageService.Instance.ask("GET_FILE_URL", CONFIGURATION.context, `${CONFIGURATION.context}-${this.value.workspaceId}-${this.value.id}`, this.value.workspaceId);
        } catch (err) {
            return '';
        }
    }
}