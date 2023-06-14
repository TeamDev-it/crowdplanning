declare namespace server {
    export interface FileAttach {
        id: string;
        contentType: string;
        name: string | null;
    }

    export interface FileResult {
        contentType: string;
        fileDownloadName: string;
    }
}