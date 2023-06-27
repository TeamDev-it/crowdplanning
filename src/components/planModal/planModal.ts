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
    public readonly coverMediaGalleryRef: string = 'cover-media-gallery';
    public readonly mediaGalleryRef: string = 'media-gallery';

    @Prop({ required: true })
    value!: IProjectableModel<string>;

    task: server.Plan = {} as server.Plan;
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

    get mediaGallery() {
        return CommonRegistry.Instance.getComponent('media-gallery');
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
                groupId: store.getters.crowdplanning.getSelectedCategory()?.id ?? '',
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
        let result: server.Plan | null = await plansService.Set(this.task.groupId, this.task);

        if (!result) {
            MessageService.Instance.send("ERROR", this.$t('plans.modal.error-plans-creation', 'Errore durante la creazione del progetto'));
            return;
        }
        
        // Non navigo il dizionario perche' devo navigare solo i componenti con ref delle immagini
        const coverImage: string[] = await (this.$refs[this.coverMediaGalleryRef] as any).save(result.id);

        const sharableCoverImageUri = await this.askForSharedFile(coverImage[0]);

        if (sharableCoverImageUri)
            result.coverImageSharableUri = sharableCoverImageUri

        const attachmentsIds: string[] = await (this.$refs[this.mediaGalleryRef] as any).save(result.id);

        const sharableFileToken: string[] = [];

        for (const attachmentId of attachmentsIds) {
            const result = await this.askForSharedFile(attachmentId);

            sharableFileToken.push(result);
        }

        result.attachmentsSharableUri = [...sharableFileToken];

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

    private async askForSharedFile(id: string): Promise<string> {
        return await MessageService.Instance.ask("SHARE_FILE", id, CONFIGURATION.context);
    }

    private async rollbackTaskCreation(id: string): Promise<void> {
        await plansService.deleteTask(id);

        MessageService.Instance.send("ERROR", this.$t("plan.creation.error", "Errore durante la creazione della proposta"));
    }
}