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

  interface BaseMapLayer {
    id: string,
    name: string,
    dataType: string,
    renderer: unknown,
    legendEnabled?: boolean,
    labelingInfo: unknown,
    symbols?: {
      field: string,
      symbols: {
        value: string | number,
        symbol: {
          color: string | number[],
          size?: string | number,
          outline: {
            color: string | number[]
            width: string | number
          }
        }
      }[]
    },
    fields?: {
      name: string,
      alias:
      string,
      type?: | "small-integer"
      | "integer"
      | "single"
      | "double"
      | "long"
      | "string"
      | "date"
      | "oid"
      | "geometry"
      | "blob"
      | "raster"
      | "guid"
      | "global-id"
      | "xml"
    }[],
    options?: {
      clustering?: {
        enable: boolean,
        onSelect?: (...args: unknown[]) => never,
      },
    },
    visible: boolean,
    tocVisible: boolean,
    url?: string,
    type: "server" | "manual"
  }

  interface ManagedMapLayer extends BaseMapLayer {
    type: "managed",
    data: Array<locations.Location>,
    dataMapping: (item: locations.Location, updateMap: (item: locations.Location) => void) => unknown;
    geometryType?: "point" | "multipoint" | "polyline" | "polygon" | "multipatch" | "mesh";
  }

  interface GeoJSONMapLayer extends BaseMapLayer {
    type: "geojson",
    data: GeoJSON.FeatureCollection,
    dataMapping: { (item: GeoJSON.Feature, updateMap: (item: GeoJSON.Feature) => void): unknown }
    geometryType?: "point" | "multipoint" | "polyline" | "polygon" | "multipatch" | "mesh";
  }

  export type MapLayer = ManagedMapLayer | GeoJSONMapLayer | BaseMapLayer;
}

