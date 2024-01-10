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
    assignedTo: PlanUser[];
    location?: locations.Location;
    locationName: string;
    workspaceId?: string;
    subplanCount?: { type: string, count: number }[];
    isClusterRoot: boolean;
    planType: PlanType;
    mapType: string;
    visibleLayers: Array<String>;
    coverImageIds: file.SharedRef | null;
    attachmentsIds: Array<file.SharedRef>;
    citizensCanSeeOthersComments: boolean;
    citizensCanSeeOthersRatings: boolean;
  }

  export interface PlanUser {
    userId: string;
    userName: string;
  }

  declare type PlanType = 'proposal' | 'project';
}
