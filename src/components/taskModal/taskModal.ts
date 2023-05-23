import Component from "vue-class-component";
import Vue from "vue";
import { Prop } from "vue-property-decorator";
import { IProjectableModel, MessageService } from "vue-mf-module";
import SearchWidget from "../arcgisWidgets/search/search.vue";
import dateTime from "../dateTime/dateTime.vue";
import DatePickerVue from "v-calendar/src/components/DatePicker.vue";
import DragAndDrop from "../file/dragAndDrop/dragAndDrop.vue";
import { plansService } from "@/services/tasksService";
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

    task: server.Plan = { groupId: '' } as server.Plan;
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
        const result: server.Plan | null = await plansService.Set(this.task.groupId, this.task);

        if (!result) {
            MessageService.Instance.send("ERROR", this.$t('plans.modal.error-plans-creation', 'Errore durante la creazione del progetto'));
            return;
        }

        if (this.coverImage) {
            try {
                await attachmentService.saveFile(result.group.id, `${result.group.id}-${result.workspaceId}-${result.id}`, this.coverImage);
                result.hasCoverImage = true;
            } catch (err) {
                await this.rollbackTaskCreation(result.id);
            }
        }

        if (this.images.length) {
            // upload images
            try {
                await attachmentService.saveAttachments(this.images, `${result.group.id}-${result.id}`);
            } catch (err) {
                await this.rollbackTaskCreation(result.id);
            }
        }

        if (this.files.length) {
            // upload files
            try {
                await attachmentService.saveAttachments(this.files, `${result.group.id}-${result.id}`);
            } catch {
                await this.rollbackTaskCreation(result.id);
            }
        }

        // Update plan with new properties
        await plansService.Set(this.task.groupId, result);

        MessageService.Instance.send("PLANS_CREATED", result);

        this.close();
    }

    private async rollbackTaskCreation(id: string): Promise<void> {
        await plansService.deleteTask(id);

        MessageService.Instance.send("ERROR", this.$t("plan.creation.error", "Errore durante la creazione della proposta"));
    }
}