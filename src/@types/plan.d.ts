declare namespace server {
  interface Plan {
    workspaceId: string;
    id: string | null;
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
    coverImageIds: SharedItemData | null;
    attachmentsIds: SharedItemData[];
    isPublic: bool;
    rolesCanSeeOthersComments: string[];
    rolesCanWriteComments: string[];
    rolesCanSeeOthersRatings: string[];
    rolesCanRate: string[];
    subPlanCount: int;
    group: Group;
    location: locations.Location;
    planType: "simple" | "fromIssues"; 
  }

  interface SharedItemData {
    sharedToken: string;
    originalFileId: string;
    contentType: string;
  }
}
