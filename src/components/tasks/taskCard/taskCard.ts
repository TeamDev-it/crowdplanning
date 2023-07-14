import Component from "vue-class-component";
import Vue from "vue";
import { Prop } from "vue-property-decorator";
import { store } from "@/store";
import { CONFIGURATION } from "@/configuration";
import { Icon } from "@/utility/Icon";
import { CommonRegistry, MessageService } from "vue-mf-module";
import { Buffer } from 'buffer';


@Component
export default class TaskCard extends Vue {
    @Prop()
    value!: server.Plan;

    @Prop({ default: true })
    showCommands!: boolean;

    coverImage: string | null = null;
    loading = true;
    group: server.Group | null = null;

    get iconCode(): string {
        return Icon.getIconCode(this.group?.iconCode ?? '');
    }

    get imagePreview() {
        return CommonRegistry.Instance.getComponent("image-preview")
    }

    async mounted() {
        if (this.value.coverImageSharableUri)
            this.coverImage = await this.getShared(this.value.coverImageSharableUri);

        this.group = store.getters.crowdplanning.getGroupById(this.value.groupId);

        this.loading = false;
    }

    selectTask(): void {
        store.actions.crowdplanning.setSelectedPlanId(this.value.id);
    }

    private async getShared(token: string): Promise<string> {
        return await MessageService.Instance.ask("GET_SHARED", token);
    }

    get CoverImage(): string | null {
        if (!this.coverImage) return null;
        
        const buffer = Buffer.from(this.coverImage);
        
        return 'data:image/png;base64,' + buffer.toString('base64');
    }
}