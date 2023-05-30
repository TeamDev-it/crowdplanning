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

    public async setState(state: server.State, groupId: string): Promise<server.State | null> {
        let result: server.State | null = null;

        if (!state.id)
            result = await this.Post("/states", state);
        else
            result = await this.Put("/states", state);

        store.actions.crowdplanning.setState({groupId: groupId, state: state});

        return result;
    }

    public async removeState(id: number): Promise<void> {
        await this.Delete(`/states/${id}`);
    }
}

export const statesService = new StatesService();