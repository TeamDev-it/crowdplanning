declare namespace server {
    export interface Task {
        id: string;
        parentId: string;
        parentType: string;
        title: string;
        description: string;
        priority: number;
        state: string;
        isArchived: boolean;
        source: string;
        startDate: Date;
        dueDate: Date;
        userName: string;
        creationDate: Date;
        lastUpdated: Date;
        groupId: string;
        group: Group;
        assignedTo: TaskUser[];
        location?: locations.Location;
        workspaceId?: string;
        customFields: object;
        subtaskCount?: { type: string, count: number }[];
        isClusterRoot: boolean;
        tags: string[];
    }

    export interface TaskUser {
        userId: string;
        userName: string;
    }
}
