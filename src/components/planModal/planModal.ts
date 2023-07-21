import Component from "vue-class-component";
import Vue from "vue";
import { Prop } from "vue-property-decorator";
import { CommonRegistry, IProjectableModel, MessageService } from "vue-mf-module";
import dateTime from "../dateTime/dateTime.vue";
import datePicker from "v-calendar/lib/components/date-picker.umd";
import { plansService } from "@/services/plansService";
import { documentContentTypes, imagesContentTypes } from "@/@types/inputFileTypes";
import { CONFIGURATION } from "@/configuration";
import Autocomplete from "../autocomplete/autocomplete.vue";
import { store } from "@/store";

@Component({
    components: {
        datePicker,
        dateTime,
        Autocomplete,
    }
})
export default class PlanModal extends Vue {
    public readonly coverMediaGalleryRef: string = 'cover-media-gallery';
    public readonly mediaGalleryRef: string = 'media-gallery';

    @Prop({ required: true })
    value!: IProjectableModel<string>;

    task: server.Plan | null= null;
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

    get esriGeocodingAutocomplete() {
        return CommonRegistry.Instance.getComponent('esri-geocoding-autocomplete');
    }

    get mediaGallery() {
        return CommonRegistry.Instance.getComponent('media-gallery');
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
                groupId: store.getters.crowdplanning.getSelectedGroup()?.id ?? '',
                state: "Review",
                visibleLayers: []
            } as server.Plan;
        }

        if (this.task.parentId) {
            this.hasClusterParent = true;
        }

        if (this.task.location)
            this.locationName = await MessageService.Instance.ask('LOCATION_TO_ADDRESS', this.task.location);

        this.loading = false;
    }

    setError(id: string, value: string) {
        Vue.set(this.errors, id, value);
    }

    locationSelected(value: locations.Location) {
        if(this.task)
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

        this.task?.visibleLayers.push(this.tmpVisibleLayer);

        this.tmpVisibleLayer = "";
    }

    public valueChanged(value: server.Plan): void {
        this.task = { ...this.task, parentId: value.id } as server.Plan;
    }

    autocompleteFilterFunction(plans: server.Plan[], filteringValue: string): server.Plan[] {
        return plans.filter(x =>
            x?.title.toLocaleLowerCase().includes(filteringValue.toLocaleLowerCase()) ||
            x.description.toLocaleLowerCase().includes(filteringValue.toLocaleLowerCase()));
    }

    removeLayer(idx: number): void {
        this.task?.visibleLayers.splice(idx, 1);
    }

    async confirm(): Promise<void> {
        if (!this.requiredFieldsSatisfied()) {
            return;
        }

        if (this.task && !this.task?.id)
        // Save new task
            this.task = await plansService.Set(this.task.groupId, this.task);

        if (!this.task) {
            MessageService.Instance.send("ERROR", this.$t('plans.modal.error-plans-creation', 'Errore durante la creazione del progetto'));
            return;
        }
        
        // Non navigo il dizionario perche' devo navigare solo i componenti con ref delle immagini
        await (this.$refs[this.coverMediaGalleryRef] as any).save(this.task.id);

        await (this.$refs[this.mediaGalleryRef] as any).save(this.task.id);

        console.log("Result with all properties, before update", this.task);

        // Update plan with new properties
        await plansService.Set(this.task!.groupId, this.task);

        this.setPlan(this.task);

        this.close();
    }

    async coverUploaded(file: server.FileAttach): Promise<void> {
        if (file && this.task) {
            const sharableCoverImageToken = await this.askForSharedFile(file.id, this.task.id, `${CONFIGURATION.context}-COVER`) as unknown as ArrayBuffer;

            this.task.coverImageIds = {originalFileId: file.id, sharedToken: this.decodeSharable(sharableCoverImageToken), contentType: file.contentType} as file.SharedRef;

            if (this.task.id)
                //update task 
                await plansService.Set(this.task!.groupId, this.task);
        }
    }

    async coverRemoved(file: server.FileAttach): Promise<void> {
        if(this.task) {
            this.task.coverImageIds = null;

            if (this.task.id)
                //update task 
                await plansService.Set(this.task!.groupId, this.task);
        }
    }

    async fileRemoved(file: string): Promise<void> {
        if (this.task) {
            const attachments = [...this.task.attachmentsIds];

            const idx = this.task.attachmentsIds.findIndex(x => x.originalFileId === file);

            if (idx !== -1) {
                attachments.splice(idx, 1);
            }

            this.task.attachmentsIds = [...attachments];

            if (this.task.id)
                // update task
                await plansService.Set(this.task!.groupId, this.task);
        }
    }

    private decodeSharable(buffer: ArrayBuffer): string {
        const textDecoder = new TextDecoder();

        return textDecoder.decode(buffer);
    }

    async filesUploaded(file: server.FileAttach): Promise<void> {
        debugger
        if (file && this.task) {
            const attachmentsSharableIds: file.SharedRef[] = [...this.task.attachmentsIds] ?? [];

            const shared = await this.askForSharedFile(file.id, this.task.id, CONFIGURATION.context) as unknown as ArrayBuffer;

            console.log('content-type', file);

            attachmentsSharableIds.push({originalFileId: file.id, sharedToken: this.decodeSharable(shared), contentType: file.contentType} as file.SharedRef);
            

            this.task.attachmentsIds = [...attachmentsSharableIds];

            if (this.task.id)
                //update task
                await plansService.Set(this.task!.groupId, this.task);
        }
    }

    private setPlan(plan: server.Plan): void {
        store.actions.crowdplanning.setPlan(plan);
    }

    private requiredFieldsSatisfied(): boolean {
        if (!this.task?.location) {
            MessageService.Instance.send("ERROR", this.$t('plans.modal.position_error', 'Inserisci una posizione valida'));
            return false;
        }

        if (!this.task?.description) {
            MessageService.Instance.send("ERROR", this.$t('plans.modal.description_error', 'Inserisci una descrizione'))
            return false;
        }

        if (!this.task?.startDate) {
            MessageService.Instance.send("ERROR", this.$t('plans.modal.start_date_error', 'Inserisci una data di inizio'));
            return false;
        }

        if (!this.task?.dueDate) {
            MessageService.Instance.send("ERROR", this.$t('plans.modal.due_date_error', 'Inserisci una data di fine'));
            return false;
        }

        return true;
    }

    private async askForSharedFile(fileId: string, id: string, context: string): Promise<string> {
        return await MessageService.Instance.ask("SHARE_FILE", fileId, `${context}-${id}`);
    }

    private async rollbackTaskCreation(id: string): Promise<void> {
        await plansService.deleteTask(id);

        MessageService.Instance.send("ERROR", this.$t("plan.creation.error", "Errore durante la creazione della proposta"));
    }
}