import { CONFIGURATION } from "@/configuration";
import { baseRestService } from "./baseRestService";

class GroupsService extends baseRestService {
    constructor() {
        super();
        this.baseUrl = () => CONFIGURATION.PlansServiceUri;
    }

    async getGroups(): Promise<server.Group[]> {
        const result = (await this.Get<server.Group[]>(`/d/groups/public?workspaceid=${CONFIGURATION.workspaceId}`)) || [];

        return result;
    }

    async deleteGroup(id: string): Promise<unknown> {
        return await this.Delete(`/group/${id}`);
    }

    async createGroup(model: server.Group): Promise<server.Group | null> {
        return await this.Post<server.Group>('/d/groups', model);
    }

    async updateGroup(groupId: string, model: server.Group): Promise<server.Group | null> {
        return await this.Put<server.Group>(`/d/groups/${groupId}`, model);
    }
}

export const groupsService = new GroupsService();