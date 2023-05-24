import { CONFIGURATION } from "@/configuration";
import { baseRestService } from "./baseRestService";
import { store } from "@/store";

class StatesService extends baseRestService {
    constructor() {
        super();
        this.baseUrl = () => CONFIGURATION.PlansServiceUri;
    }

    public async getStates(group: server.Group): Promise<server.State[]> {
        const result = await this.Get<server.State[]>(`/states/${group.workspaceId}`) || [];

        store.actions.crowdplanning.setStates({ groupId: group.id, states: result });

        return result;
    }

    public async setState(state: server.State): Promise<server.State | null> {
        if (!state.id) return await this.Post("/states", state);

        return await this.Put("/states", state);
    }

    public async removeState(id: number): Promise<void> {
        await this.Delete(`/states/${id}`);
    }
}

export const statesService = new StatesService();