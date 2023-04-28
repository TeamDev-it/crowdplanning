import { CONFIGURATION } from "@/configuration";
import { baseRestService } from "./baseRestService";

class TasksService extends baseRestService {
    constructor() {
        super();
        this.baseUrl = () => CONFIGURATION.TasksServiceUri;
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