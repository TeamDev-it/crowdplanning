import Component from "vue-class-component";
import Vue, { ref } from "vue";
import { Prop } from "vue-property-decorator";
import { CommonRegistry, IProjectableModel, MessageService } from "vue-mf-module";
import dateTime from "../dateTime/dateTime.vue";
import datePicker from "v-calendar/lib/components/date-picker.umd";
import DragAndDrop from "../file/dragAndDrop/dragAndDrop.vue";
import { plansService } from "@/services/plansService";
import { documentContentTypes, imagesContentTypes } from "@/@types/inputFileTypes";
import { CONFIGURATION } from "@/configuration";
import Autocomplete from "../autocomplete/autocomplete.vue";
import { store } from "@/store";

@Component({
    components: {
        datePicker,
        dateTime,
        DragAndDrop,
        Autocomplete,
    }
})
export default class PlanModal extends Vue {
    @Prop({ required: true })
    value!: IProjectableModel<string>;

    task: server.Plan = {} as server.Plan;
    // In memory files
    files: Array<File> = [];
    // In memory images
    images: Array<File> = [];
    attachments: Array<server.FileAttach> = [];
    coverImage: File | null = null;
    citizenCanSeeOthersRatings = false;
    citizenCanSeeOthersComments = false;
    tmpVisibleLayer = "";
    hasClusterParent = false;
    locationName: string = '';
    planMode: planMode = "create";

    loading = true;

    errors: { [id: string]: string } = {};

    get imageContentTypes(): string {
        return imagesContentTypes;
    }

    get mapTypeFromConfiguration(): Array<{ value: string, labelKey: string, labelText: string }> {
        return CONFIGURATION.planMapType;
    }

    get plans(): server.Plan[] {
        return store.getters.crowdplanning.getPlans();
    }

    get groups(): server.Group[] {
        return store.getters.crowdplanning.getGroups().filter(x => x.parentGroupId);
    }

    get planIfExists() {
        if (this.value.data)
            return { ...store.getters.crowdplanning.getPlanById(this.value.data) };
    }

    get context(): string {
        return CONFIGURATION.context;
    }

    get filteredImages(): server.FileAttach[] {
        return this.attachments.filter(x => imagesContentTypes.toLocaleLowerCase().includes(x.contentType.toLocaleLowerCase()));
    }

    get filteredDocuments(): server.FileAttach[] {
        return this.attachments.filter(x => documentContentTypes.toLocaleLowerCase().includes(x.contentType.toLocaleLowerCase()));
    }

    get esriGeocodingAutocomplete() {
        return CommonRegistry.Instance.getComponent('esri-geocoding-autocomplete');
    }

    get imageAttachmentComponent() {
        return CommonRegistry.Instance.getComponent('add-attachments');
    }

    get documentAttachmentComponent() {
        return CommonRegistry.Instance.getComponent('add-attachments');
    }

    get mediaGallery() {
        return CommonRegistry.Instance.getComponent('public-media-gallery');
    }

    fileRemoved(id: string) {
        const idx = this.attachments.findIndex(x => x.id === id);

        this.attachments.splice(idx, 1);
    }

    async mounted() {
        if (this.value.data) {
            this.planMode = "edit";
        }

        if (this.value?.data) {
            this.task = this.planIfExists ?? {} as server.Plan;
        } else {
            this.task = {
                ...this.task,
                groupId: '',
                state: "Review",
                visibleLayers: [],
                mapType: this.task.mapType ? this.task.mapType : this.mapTypeFromConfiguration[0].value
            };
        }

        if (this.task.parentId) {
            this.hasClusterParent = true;
        }

        if (this.task.location)
            this.locationName = await MessageService.Instance.ask('LOCATION_TO_ADDRESS', this.task.location);

        if (this.value.data) {
            this.attachments = await MessageService.Instance.ask("GET_DATA", { context: `${CONFIGURATION.context}-${this.task.id}` });
        }

        this.loading = false;
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

    public confirmVisibleLayer() {
        if (!this.tmpVisibleLayer) return;

        this.task.visibleLayers.push(this.tmpVisibleLayer);

        this.tmpVisibleLayer = "";
    }

    public valueChanged(value: server.Plan): void {
        this.task = { ...this.task, parentId: value.id };
    }

    autocompleteFilterFunction(plans: server.Plan[], filteringValue: string): server.Plan[] {
        return plans.filter(x =>
            x.title.toLocaleLowerCase().includes(filteringValue.toLocaleLowerCase()) ||
            x.description.toLocaleLowerCase().includes(filteringValue.toLocaleLowerCase()));
    }

    removeLayer(idx: number): void {
        this.task.visibleLayers.splice(idx, 1);
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
                await MessageService.Instance.ask("SAVE_FILE", { context: CONFIGURATION.context, id: `${CONFIGURATION.context}-${result.workspaceId}-${result.id}` })
                result.hasCoverImage = true;
            } catch (err) {
                await this.rollbackTaskCreation(result.id);
            }
        }

        await ((this.$refs.addImages) as any).submit(result.id);

        await ((this.$refs.addDocuments) as any).submit(result.id);

        // Update plan with new properties
        await plansService.Set(this.task.groupId, result);

        this.setPlan(result);

        this.close();
    }

    public attachmentDeleted(file: server.FileAttach): void {
        const idx = this.attachments.findIndex(x => x.id === file.id);

        this.attachments.splice(idx, 1);
    }

    private setPlan(plan: server.Plan): void {
        store.actions.crowdplanning.setPlan(plan);
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

        return true;
    }

    private async rollbackTaskCreation(id: string): Promise<void> {
        await plansService.deleteTask(id);

        MessageService.Instance.send("ERROR", this.$t("plan.creation.error", "Errore durante la creazione della proposta"));
    }
}