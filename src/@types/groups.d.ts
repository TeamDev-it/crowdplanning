declare namespace server {
    export interface Group {
        id: string;
        default: boolean;
        children: Group[];
        parentGroupId: string;
        name: string;
        description: string;
        taskType: string;
        roles: string[];
        visibleroles: string[];
        public: boolean;
    }
}
