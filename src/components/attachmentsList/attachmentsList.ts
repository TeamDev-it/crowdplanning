import Component from "vue-class-component";
import Vue from 'vue';
import { Prop } from "vue-property-decorator";
import { documentContentTypes, imagesContentTypes } from "@/@types/inputFileTypes";
import { CONFIGURATION } from "@/configuration";
import { attachmentService } from "@/services/attachmentService";

@Component({})
export default class AttachmentsList extends Vue {
    @Prop({ default: [] })
    files!: server.FileAttach[];

    @Prop({required: true})
    workspaceId!: string;

    mounted() {
        debugger
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
}