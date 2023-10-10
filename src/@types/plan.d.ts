declare namespace server {
    export interface Plan {
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
        locationName: string;
        workspaceId?: string;
        subtaskCount?: { type: string, count: number }[];
        isClusterRoot: boolean;
        planType: PlanType;
        mapType: string;
        visibleLayers: Array<String>;
        coverImageIds: file.SharedRef | null;
        attachmentsIds: Array<file.SharedRef>;
        citizensCanSeeOthersComments: boolean;
        citizensCanSeeOthersRatings: boolean;
    }

    export interface TaskUser {
        userId: string;
        userName: string;
    }

    declare type PlanType = 'proposal' | 'project';
}
