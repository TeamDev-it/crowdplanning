declare namespace server {
  export interface State {
    id: number;
    type: string;
    color: string;
    shortName: string;
    name: string;
    state: string;
    orderIndex: number;
    reference?: string;
    generalStatus?: string;
  }
}
