declare namespace server {
  export interface Group {
    id: string;
    default: boolean;
    children: Group[];
    parentGroupId: string;
    name: string;
    description: string;
    roles: string[];
    reference?: string;
    visibleroles: string[];
    public: boolean;
    metadata: { modules: { name: string, enabled: boolean, mandatory: boolean }[] }
    workspaceId: string;
    iconCode: string;
  }
}
