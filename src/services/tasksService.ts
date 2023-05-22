import { CONFIGURATION } from "@/configuration";
import { baseRestService } from "./baseRestService";

class TasksService extends baseRestService {
    constructor() {
        super();
        this.baseUrl = () => CONFIGURATION.PlansServiceUri;
    }

    async createTask(groupid: string, task: server.Task): Promise<server.Task | null> {
        return await this.Post<server.Task>(`/group/${groupid}`, task);
    }

    async updateTask(task: server.Task): Promise<server.Task | null> {
        return await this.Put<server.Task>(`/${task.id}`, task);
    }

    async getTasks(workspaceId: string): Promise<server.Task[]> {
        return await this.Get<server.Task[]>(`/group/plans`, { workspaceId }) || [];
    }

    async getTask(id: string): Promise<server.Task | null> {
        return await this.Get<server.Task>(`/${id}`);
    }

    async deleteTask(task: server.Task): Promise<void> {
        await this.delete(`/${task.id}`);
    }

    async getStates(workspaceId: string): Promise<server.State[]> {
        return (await this.Get<server.State[]>(`/d/states/plans`, { workspaceId })) || [];
    }
}

export const tasksService = new TasksService();