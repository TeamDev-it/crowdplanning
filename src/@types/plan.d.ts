declare namespace server {
  declare type PlanType = 'proposal' | 'project';

  interface Plan {
    workspaceId: string;
    id: string;
    parentId?: string;
    title: string;
    description: string;
    state: string;
    startDate?: Date;
    dueDate?: Date;
    userId: string;
    username: string;
    locationName: string;
    creationDate: Date;
    lastUpdated?: Date;
    groupId: string;
    visibleLayers: string[];
    coverImageIds: SharedItemData;
    attachmentsIds: SharedItemData[];
    isPublic: bool;
    rolesCanSeeOthersComments: string[];
    rolesCanWriteComments: string[];
    rolesCanSeeOthersRatings: string[];
    rolesCanRate: string[];
    subPlanCount: int;
    group: Group;
    location: locations.Location;
  }

  interface SharedItemData {
    sharedToken: string;
    originalFileId: string;
    contentType: string;
  }
}
