
declare namespace server {
    interface relatedItemOptions {
        relationType: string;
        relationId: string;
        workspaceId: string;
        citizenCanSeeOthersRatings: boolean;
        citizenCanSeeOthersComments: boolean;
    }
}