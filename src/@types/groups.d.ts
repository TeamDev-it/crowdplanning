declare namespace server {
    export interface Group {
        id: string;
        default: boolean;
        children: Group[];
        parentGroupId: string;
        name: string;
        description: string;
        public: boolean;
        workspaceId: string;
        iconCode: string;
    }
}
