import { CONFIGURATION } from "@/configuration";
import { baseRestService } from "./baseRestService";
import { store } from "@/store";

class PlansService extends baseRestService {
  constructor() {
    super();
    this.baseUrl = () => CONFIGURATION.PlansServiceUri;
  }

  async Set(groupId: string, model: server.Plan): Promise<server.Plan | null> {
    if (!model.id) return await this.Post<server.Plan>(`/group/${groupId}`, model);

    const result = await this.Put<server.Plan>(`/group/${groupId}`, model);

    if (result)
      store.actions.crowdplanning.setPlan(result);

    return result;
  }

  async getPlans(): Promise<server.Plan[]> {
    const result = await this.Get<server.Plan[]>(``) || [];

    store.actions.crowdplanning.setPlans(result);

    return result;
  }

  async getPublicPlans(workspaceId: string): Promise<server.Plan[]> {
    const result = await this.Get<server.Plan[]>(`/${workspaceId}/getAllPublic`) || [];

    store.actions.crowdplanning.setPlans(result);

    return result;
  }

  async deletePlan(id: string): Promise<void> {
    await this.delete(`/${id}`);

    store.actions.crowdplanning.deletePlan(id);
  }
}

export const plansService = new PlansService();
