import Component from "vue-class-component";
import Vue from "vue";
import { Prop } from "vue-property-decorator";
import { IProjectableModel } from "vue-mf-module";
import SearchWidget from "../arcgisWidgets/search/search.vue";
import dateTime from "../dateTime/dateTime.vue";
import DatePickerVue from "v-calendar/src/components/DatePicker.vue";
import DragAndDrop from "../file/dragAndDrop/dragAndDrop.vue";

@Component({
    components: {
        SearchWidget,
        DatePickerVue,
        dateTime,
        DragAndDrop
    }
})
export default class TaskModal extends Vue {
    @Prop({ required: true })
    value!: IProjectableModel<server.Group[]>;

    task: server.Task = {} as server.Task;
    files: Array<File> = [];
    images: Array<File> = [];

    errors: { [id: string]: string } = {};

    setError(id: string, value: string) {
        Vue.set(this.errors, id, value);
    }

    locationSelected(value: locations.Location) {
        this.task.location = value;
    }

    close(): void {
        try {
            this.value?.reject();
        } catch (err) {
            //
        }
    }

    removeFromImages(value: File): void {
        const idx = this.images.findIndex(x => x.name === value.name && x.size === value.size && x.type === value.type && x.lastModified === value.lastModified);

        if (idx !== -1)
            this.images.splice(idx, 1);
    }

    removeFromFiles(value: File): void {
        const idx = this.files.findIndex(x => x.name === value.name && x.size === value.size && x.type === value.type && x.lastModified === value.lastModified);

        if (idx !== -1)
            this.files.splice(idx, 1);
    }

    addToImages(value: File): void {
        const idx = this.images.findIndex(x => x.name === value.name && x.size === value.size && x.type === value.type && x.lastModified === value.lastModified);

        if (idx === -1)
            this.images.push(value);
    }

    addToFiles(value: File): void {
        const idx = this.files.findIndex(x => x.name === value.name && x.size === value.size && x.type === value.type && x.lastModified === value.lastModified);

        if (idx === -1)
            this.files.push(value);
    }
}