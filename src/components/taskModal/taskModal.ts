import Component from "vue-class-component";
import Vue from "vue";
import { Prop } from "vue-property-decorator";
import { IProjectableModel, MessageService } from "vue-mf-module";
import SearchWidget from "../arcgisWidgets/search/search.vue";
import dateTime from "../dateTime/dateTime.vue";
import DatePickerVue from "v-calendar/src/components/DatePicker.vue";
import DragAndDrop from "../file/dragAndDrop/dragAndDrop.vue";
import { tasksService } from "@/services/tasksService";
import { attachmentService } from "@/services/attachmentService";

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

    mounted() {
        this.task.state = "Review";
    }

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

    async confirm(): Promise<void> {
        // Save new task
        const result: server.Task | null = await tasksService.createTask(this.task.groupId, this.task);

        if (!result) {
            MessageService.Instance.send("ERROR", this.$t('plans.modal.error-plans-creation', 'Errore durante la creazione del progetto'));
            return;
        }

        if (this.images.length) {
            // upload images
            await attachmentService.saveAttachments(this.images, `${result.group.taskType}-${result.id}`);
        }

        if (this.files.length) {
            // upload files
            await attachmentService.saveAttachments(this.files, `${result.group.taskType}-${result.id}`);
        }

        MessageService.Instance.send("PLANS_CREATED", result);

        this.close();
    }
}