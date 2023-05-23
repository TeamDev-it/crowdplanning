import { CONFIGURATION } from "@/configuration";
import { baseRestService } from "./baseRestService";
class PlansService extends baseRestService {
    constructor() {
        super();
        this.baseUrl = () => CONFIGURATION.PlansServiceUri;
    }

    public async Set(groupId: string, model: server.Plan): Promise<server.Plan | null> {
        if (!model.id) return await this.Post<server.Plan>(`/group/${groupId}`, model);

        return await this.Put<server.Plan>(`/group/${groupId}`, model);
    }

    public async getPlans(): Promise<server.Plan[]> {
        return await this.Get<server.Plan[]>(``) || [];
    }

    public async getPublicPlans(workspaceId: string): Promise<server.Plan[]> {
        return await this.Get<server.Plan[]>(`/${workspaceId}/getAllPublic`) || [];
    }

    async deleteTask(id: string): Promise<void> {
        await this.delete(`/${id}`);
    }
}

export const plansService = new PlansService();