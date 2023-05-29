import Component from "vue-class-component";
import Vue from "vue";
import { Prop } from "vue-property-decorator";
import { attachmentService } from "@/services/attachmentService";
import { documentContentTypes, imagesContentTypes } from "@/@types/inputFileTypes";
import FilesPreview from "../file/filesPreview/filesPreview.vue";
import ImagesPreview from "../file/imagesPreview/imagesPreview.vue";
import { CONFIGURATION } from "@/configuration";

@Component({
    components: {
        FilesPreview,
        ImagesPreview
    }
})
export default class TaskSummary extends Vue {
    @Prop()
    task!: server.Plan;

    @Prop({required: true})
    workspaceId!: string;

    files: server.FileAttach[] = [];

    public async mounted(): Promise<void> {
        this.files = await attachmentService.getAttachments(`${this.task.id}`, this.workspaceId)
    }

    get images(): server.FileAttach[] {
        return this.files.filter(x => imagesContentTypes.toLocaleLowerCase().includes(x.contentType.toLocaleLowerCase()));
    }

    get documents(): server.FileAttach[] {
        return this.files.filter(x => documentContentTypes.toLocaleLowerCase().includes(x.contentType.toLocaleLowerCase()));
    }

    getImagePreview(file: server.FileAttach): string {
        return attachmentService.getImagePreviewUri(CONFIGURATION.context, file.id, this.workspaceId);
    }

    async downloadDocument(doc: server.FileAttach): Promise<void> {
        const uri: string = attachmentService.getFileUrl(CONFIGURATION.context, doc.id, this.workspaceId);

        const a: HTMLAnchorElement = document.createElement("a");

        a.setAttribute("href", uri);
        a.setAttribute("target", "_blank");

        a.click();
    }

    get taskDate(): string {
        return `${this.task.creationDate.getDate()}/${this.task.creationDate.getMonth()}/${this.task.creationDate.getFullYear()}`;
    }
}