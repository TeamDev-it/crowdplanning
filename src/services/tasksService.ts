import { CONFIGURATION } from "@/configuration";
import { baseRestService } from "./baseRestService";

class TasksService extends baseRestService {
    constructor() {
        super();
        this.baseUrl = () => CONFIGURATION.TasksServiceUri;
    }

    async getGroups(autodefault = true): Promise<server.Group[]> {
        const result = (await this.Get<server.Group[]>(`/d/groups/public?workspaceid=${CONFIGURATION.workspaceId}`)) || [];

        if (autodefault) {
            for (const group of result) {
                const defaultGroup = Object.assign({ default: true }, group);
                defaultGroup.children = [];
                group.children?.splice(0, 0, defaultGroup);
            }
        }

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

    async getTasks(groupid: string,
        options: {
            fromDate?: Date,
            toDate?: Date,
            onlyroot: boolean,
            archived: boolean,
            state?: string,
            priority?: number,
            skip?: number,
            take?: number,
            showClusterRoot: boolean,
            tags?: server.Tag[]
        } = { archived: false, onlyroot: false, showClusterRoot: true }): Promise<server.Task[]> {

        const filter = Object.assign({}, options);
        if (filter.tags) {
            filter["tags"] = options.tags?.map(t => t.name).join('|') as any;
        }
        return (await this.Get<server.Task[]>(`/group/${groupid}`, filter)) || [];
    }

    async getTask(id: string): Promise<server.Task | null> {
        return await this.Get<server.Task>(`/${id}`);
    }

    async deleteTask(task: server.Task): Promise<void> {
        await this.delete(`/${task.id}`);
    }
}

export const tasksService = new TasksService();