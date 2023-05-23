import { CONFIGURATION } from "@/configuration";
import { baseRestService } from "./baseRestService";

class AttachmentService extends baseRestService {
    constructor() {
        super();
        this.baseUrl = () => CONFIGURATION.FileServiceUri;
    }

    public async saveAttachments(attachments: Array<File>, context: string): Promise<Array<server.FileAttach> | null> {
        const data = new FormData();
        for (const file of attachments) {
            data.append('files', file, file.name);
        }

        try {
            return await this.Post<Array<server.FileAttach> | null>(`/${context}/files`, data);
        } catch (err) {
            console.error(err);
            return null;
        }
    }

    public async saveFile(context: string, id: string, file: File): Promise<{ id: string } | null> {
        const data = new FormData();

        data.append("file", file, file.name);

        try {
            return await this.Post<{ id: string } | null>(`/${context}/file/${id}`, data);
        } catch (err) {
            console.error(err);
            return null;
        }
    }

    public async getAttachments(id: string, workspaceId: string, skip = 0, take = 100): Promise<server.FileAttach[]> {
        return await this.Get<server.FileAttach[]>(`/PLANS-${id}/plans/data`, { id: id, workspaceId: workspaceId, skip, take }) ?? [];
    }

    public getImagePreviewUri(context: string, fileId: string, workspaceId: string): string {
        return `${this.baseUrl()}/${context}/plans/thumb/${fileId}?workspaceId=${workspaceId}&width=400&height=400&quality=90`;
    }

    public getImageUri(context: string, fileId: string): string {
        return `${this.baseUrl()}/${context}/image/${fileId}`;
    }

    public async getImages(context: string, skip = 0, take = 100) {
        return await this.Get<server.FileAttach[]>(`/${context}/data`, { skip, take });
    }

    public async getFile(context: string, id: string, workspaceId: string): Promise<server.FileResult | null> {
        return await this.Get<server.FileResult | null>(`/${context}/file/${id}`, { workspaceId: workspaceId });
    }

    public getFileUrl(context: string, id: string, workspaceId: string): string {
        return `${CONFIGURATION.FileServiceUri}/${context}/plans/file/${id}?workspaceId=${workspaceId}`;
    }
}

export const attachmentService = new AttachmentService();