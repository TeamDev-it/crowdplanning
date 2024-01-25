declare namespace locations {
  export interface Location {
    id: number;
    relationId: string;
    relationType: string;
    latitude: number;
    longitude: number;
    altitude: number;
    wkid: number;
  }

  export interface Feature {
    id: number;
    workspaceId: string;
    relationId: string;
    relationType: string;
    shape: GeoJSON.Geometry;
    wkid: number;
    isArchived: boolean,
    date: Date
  }

  export interface MapLayer {
    id?: string,
    name?: string,
    dataType: string,
    renderer?: Record<string, unknown>,
    symbols: {
      field: string,
      symbols: {
        value: string | number,
        symbol: {
          color: string,
          size: string | number,
          outline: {
            color: string
            width: string | number
          }
        }
      }[]
    },
    fields?: { name: string, alias: string, type: string }[],
    options?: {
      clustering?: {
        enable: boolean,
        // eslint-disable-next-line @typescript-eslint/ban-types
        onSelect?: Function,
      },
    },
    dataMapping?: { (i: locations.Location & { plan: server.Plan; }, updateMap: (item: locations.Location) => void): { id: number; state: string; } }
    visible: boolean,
    tocVisible?: boolean,
    data?: Array<locations.Location>,
    url?: string,
    type: "managed" | "server"
  }
}   
