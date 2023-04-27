declare namespace server {
    export interface FileAttach {
        id: string,
        contentType: string
    }

    export interface FileResult {
        contentType: string;
        fileDownloadName: string;
    }
}