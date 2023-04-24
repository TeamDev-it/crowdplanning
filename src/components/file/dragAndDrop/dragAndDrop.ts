import Component from "vue-class-component";
import Vue from "vue";
import { Prop } from "vue-property-decorator";
import { documentContentTypes, imagesContentTypes, inputFileTypes } from "@/@types/inputFileTypes";
import ImagesPreview from "../imagesPreview/imagesPreview.vue";
import FilesPreview from "../filesPreview/filesPreview.vue";

@Component({
    components: {
        ImagesPreview,
        FilesPreview
    }
})
export default class DragAndDrop extends Vue {
    @Prop()
    customTextLocaleKey!: string;

    @Prop()
    clickableTextLocaleKey!: string;

    @Prop({
        default: "images"
    })
    fileTypes!: inputFileTypes;

    @Prop({ required: true })
    files!: Array<File>;

    dragFile(e: DragEvent): void {
        const fileList = e.dataTransfer?.files ?? [];

        this.pushFileList(fileList);
    }

    uploadFromDevice(): void {
        // create input element
        const input: HTMLInputElement = document.createElement('input');
        // set accepted files
        input.type = 'file';
        input.accept = this.getAcceptContentTypesFromFileTypes();

        input.onchange = (e: any) => {
            const files = e.target?.files as FileList;

            this.pushFileList(files);
        }
        // trigger click
        input.click();
    }

    getComponentType(): string {
        return this.fileTypes === "images" ? ImagesPreview.componentName : FilesPreview.componentName;
    }

    private getAcceptContentTypesFromFileTypes(): string {
        return this.fileTypes === "images" ? imagesContentTypes : documentContentTypes;
    }

    private pushFileList(fileList: FileList | never[]): void {
        for (let i = 0; i < fileList.length; i++) {
            debugger
            const idx = this.files.findIndex(x => x.name === fileList[i].name && x.size === fileList[i].size && x.type === fileList[i].type && x.lastModified === fileList[i].lastModified);

            if (idx === -1)
                this.addToList(fileList[i]);
        }
    }

    removeFromList(file: File): void {
        this.$emit(this.fileTypes === 'images' ? 'removeFromImages' : 'removeFromFiles', file);
    }

    addToList(file: File): void {
        if (this.fileTypes === "images") {
            this.$emit('addToImages', file);
        } else {
            this.$emit('addToFiles', file);
        }
    }
}