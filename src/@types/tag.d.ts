declare namespace server {
    export interface Tag {
        name: string;
        description?: string;
        color?: string;
        relationId?: string;
        relationType?: string;
        roles: Array<string>;
    }
}