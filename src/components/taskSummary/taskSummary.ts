import Component from "vue-class-component";
import Vue from "vue";
import { Prop } from "vue-property-decorator";
import { attachmentService } from "@/services/attachmentService";
import { documentContentTypes, imagesContentTypes } from "@/@types/inputFileTypes";
import FilesPreview from "../file/filesPreview/filesPreview.vue";
import ImagesPreview from "../file/imagesPreview/imagesPreview.vue";

@Component({
    components: {
        FilesPreview,
        ImagesPreview
    }
})
export default class TaskSummary extends Vue {
    @Prop()
    task!: server.Task;

    files: server.FileAttach[] = [];

    public async mounted(): Promise<void> {
        this.files = await attachmentService.getAttachments(`${this.task.id}`)
    }

    get images(): server.FileAttach[] {
        return this.files.filter(x => imagesContentTypes.toLocaleLowerCase().includes(x.contentType.toLocaleLowerCase()));
    }

    get documents(): server.FileAttach[] {
        return this.files.filter(x => documentContentTypes.toLocaleLowerCase().includes(x.contentType.toLocaleLowerCase()));
    }

    getImagePreview(file: server.FileAttach): string {
        return attachmentService.getImagePreviewUri("PLANS", file.id);
    }

    async downloadDocument(doc: server.FileAttach): Promise<void> {
        const uri: string = attachmentService.getFileUrl("PLANS", doc.id);

        const a: HTMLAnchorElement = document.createElement("a");

        a.setAttribute("href", uri);
        a.setAttribute("target", "_blank");

        a.click();
    }

    get taskDate(): string {
        return `${this.task.creationDate.getDate()}/${this.task.creationDate.getMonth()}/${this.task.creationDate.getFullYear()}`;
    }
}