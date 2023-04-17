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
}