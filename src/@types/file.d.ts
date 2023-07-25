declare namespace file {
    interface SharedRef {
        sharedToken: string;
        originalFileId: string;
        contentType: string;
    }

    interface FileAttach {
        id: string;
        contentType: string;
        name: string | null;
        data: string;
      }
}