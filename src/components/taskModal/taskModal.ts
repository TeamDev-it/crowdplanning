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
import { imagesContentTypes } from "@/@types/inputFileTypes";

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

    task: server.Task = { groupId: '' } as server.Task;
    files: Array<File> = [];
    images: Array<File> = [];
    coverImage: File | null = null;
    citizenCanSeeOthersRatings = false;
    citizenCanSeeOthersComments = false;

    errors: { [id: string]: string } = {};

    get imageContentTypes(): string {
        return imagesContentTypes;
    }

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

    onChangeCoverImage(event: InputEvent) {
        this.coverImage = (event.target as any).files[0];
    }

    private requiredFieldsSatisfied(): boolean {
        if (!this.task.location) {
            MessageService.Instance.send("ERROR", this.$t('plans.modal.position_error', 'Inserisci una posizione valida'));
            return false;
        }

        if (!this.task.description) {
            MessageService.Instance.send("ERROR", this.$t('plans.modal.description_error', 'Inserisci una descrizione'))
            return false;
        }

        if (!this.task.startDate) {
            MessageService.Instance.send("ERROR", this.$t('plans.modal.start_date_error', 'Inserisci una data di inizio'));
            return false;
        }

        if (!this.task.dueDate) {
            MessageService.Instance.send("ERROR", this.$t('plans.modal.due_date_error', 'Inserisci una data di fine'));
            return false;
        }

        if (!this.images.length) {
            MessageService.Instance.send("ERROR", this.$t('plans.modal.images_error', 'Inserisci delle immagini'));
            return false;
        }

        if (!this.files.length) {
            MessageService.Instance.send("ERROR", this.$t('plans.modal.attachments_error', 'Inserisci degli allegati'));
            return false;
        }

        return true;
    }

    async confirm(): Promise<void> {
        if (!this.requiredFieldsSatisfied()) {
            return;
        }
        // Save new task
        const result: server.Task | null = await tasksService.createTask(this.task.groupId, this.task);

        if (!result) {
            MessageService.Instance.send("ERROR", this.$t('plans.modal.error-plans-creation', 'Errore durante la creazione del progetto'));
            return;
        }

        const relatedItemOptions: server.relatedItemOptions = {
            workspaceId: result?.workspaceId ?? '',
            relationId: result?.id,
            relationType: result.group.taskType,
            citizenCanSeeOthersComments: this.citizenCanSeeOthersComments,
            citizenCanSeeOthersRatings: this.citizenCanSeeOthersRatings
        };

        const relatedItemOptionsResult = await MessageService.Instance.ask("SAVE_RELATED_ITEM_OPTIONS", relatedItemOptions);

        if (this.coverImage) {
            await attachmentService.saveFile(result.group.taskType, `${result.group.taskType}-${result.workspaceId}-${result.id}`, this.coverImage);
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