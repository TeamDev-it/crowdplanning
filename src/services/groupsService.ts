import { CONFIGURATION } from "@/configuration";
import { baseRestService } from "./baseRestService";
import { store } from "@/store";
import { forEach } from "lodash";

class GroupsService extends baseRestService {
  constructor() {
    super();
    this.baseUrl = () => CONFIGURATION.PlansServiceUri;
  }

  async getGroups(): Promise<server.Group[]> {
    const result = (await this.Get<server.Group[]>(`/groups`)) || [];
    store.actions.crowdplanning.setGroups(result);
    return result;
  }

  async getGroupChildren(parentId: string): Promise<server.Group[]> {
    const result = (await this.Get<server.Group[]>(`/groups/${parentId}/children`)) || [];
    store.actions.crowdplanning.setGroups(result);
    return result;
  }

  async getPublicGroups(workspaceId: string): Promise<server.Group[]> {
    const result = (await this.Get<server.Group[]>(`/groups/public/${workspaceId}?`)) || [];

    store.actions.crowdplanning.setGroups(result);

    return result
  }

  async deleteGroup(id: string): Promise<void> {
    await this.Delete(`/groups/${id}`);

    store.actions.crowdplanning.deleteGroup(id);
  }

  async Set(model: server.Group): Promise<server.Group | null> {
    const result = await this.Post<server.Group>('/groups', model);

    store.actions.crowdplanning.setGroup(model);

    return result;
  }
}

export const groupsService = new GroupsService();
