import { CONFIGURATION } from "@/configuration";
import { baseRestService } from "./baseRestService";

class GroupsService extends baseRestService {
    constructor() {
        super();
        this.baseUrl = () => CONFIGURATION.PlansServiceUri;
    }

    public async getGroups(): Promise<server.Group[]> {
        return (await this.Get<server.Group[]>(`/groups`)) || [];
    }

    public async getPublicGroups(workspaceId: string): Promise<server.Group[]> {
        return (await this.Get<server.Group[]>(`/groups/public?workspaceid=${workspaceId}`)) || [];
    }

    async deleteGroup(id: string): Promise<unknown> {
        return await this.Delete(`/group/${id}`);
    }

    public async Set(model: server.Group): Promise<server.Group | null> {
        return await this.Post<server.Group>('/groups', model);
    }
}

export const groupsService = new GroupsService();