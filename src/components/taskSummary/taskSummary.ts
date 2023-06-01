import Component from "vue-class-component";
import Vue from "vue";
import { Prop } from "vue-property-decorator";
import { attachmentService } from "@/services/attachmentService";
import { documentContentTypes, imagesContentTypes } from "@/@types/inputFileTypes";
import FilesPreview from "../file/filesPreview/filesPreview.vue";
import ImagesPreview from "../file/imagesPreview/imagesPreview.vue";
import { CONFIGURATION } from "@/configuration";
import { store } from "@/store";
import { MessageService } from "vue-mf-module";
import AttachmentsList from "../attachmentsList/attachmentsList.vue";

@Component({
    components: {
        FilesPreview,
        ImagesPreview,
        AttachmentsList
    }
})
export default class TaskSummary extends Vue {
    @Prop()
    plan!: server.Plan;

    @Prop({ required: true })
    workspaceId!: string;

    files: server.FileAttach[] = [];
    group: server.Group | null = null;
    addressLocation: string = '';

    public async mounted(): Promise<void> {
        this.files = await attachmentService.getAttachments(`${this.plan.id}`, this.workspaceId)

        this.group = store.getters.crowdplanning.getGroupById(this.plan.groupId);

        if (this.plan.location)
            this.addressLocation = await MessageService.Instance.ask("LOCATION_TO_ADDRESS", this.plan.location);
    }

    iconCode(iconCode: string): string {
        return `ti ti-${this.group?.iconCode}`;
    }

    get taskDate(): string {
        return `${this.plan.creationDate.getDate()}/${this.plan.creationDate.getMonth()}/${this.plan.creationDate.getFullYear()}`;
    }
}