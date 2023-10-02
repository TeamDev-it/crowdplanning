import Component from "vue-class-component";
import Vue from "vue";
import { Prop } from "vue-property-decorator";
import { CommonRegistry, IProjectableModel, MessageService } from "vue-mf-module";
import dateTime from "../dateTime/dateTime.vue";
// import datePicker from "v-calendar/lib/components/date-picker.umd";
import { plansService } from "@/services/plansService";
import { CONFIGURATION } from "@/configuration";
import Autocomplete from "../autocomplete/autocomplete.vue";

@Component({
    components: {
        // datePicker,
        dateTime,
        Autocomplete,
    }
})
export default class PlanModal extends Vue {
    public readonly coverMediaGalleryRef: string = 'cover-media-gallery';
    public readonly mediaGalleryRef: string = 'media-gallery';


    @Prop({ required: true })
    selectedPlan!: server.Plan | null;

    get workspaceId() {
        return this.selectedPlan!.workspaceId
    }

    groups: server.Group | null = null;
    plan: server.Plan | null = null;
    coverImage: File | null = null;
    citizenCanSeeOthersRatings = false;
    citizenCanSeeOthersComments = false;
    tmpVisibleLayer = "";
    hasClusterParent = false;
    planMode: planMode = "create";

    loading = true;

    errors: { [id: string]: string } = {};

    back() {
        this.$emit('goback')
    }

    //  get imageContentTypes(): string {
    //      return imagesContentTypes;
    //  }

    // get plans(): server.Plan[] {
    //     return store.getters.crowdplanning.getPlans();
    // }

    // get groups(): server.Group[] {
    //      ;
    // }

    // get planIfExists() {
    //     if (this.value.data)
    //         return { ...store.getters.crowdplanning.getPlanById(this.value.data) };
    // }

    get context(): string {
        return CONFIGURATION.context;
    }

    get esriGeocodingAutocomplete() {
        return CommonRegistry.Instance.getComponent('esri-geocoding-autocomplete');
    }

    get mediaGallery() {
        return CommonRegistry.Instance.getComponent('media-gallery');
    }

    // async mounted() {
    //     if (this.value.data) {
    //         this.planMode = "edit";
    //     }

    //     if (this.value?.data) {
    //         this.plan = this.planIfExists ?? {} as server.Plan;
    //     } else {
    //         this.plan = {
    //             ...this.plan,
    //             groupId: store.getters.crowdplanning.getSelectedGroup()?.id ?? '',
    //             state: "Review",
    //             visibleLayers: []
    //         } as server.Plan;
    //     }

    //     if (this.plan.parentId) {
    //         this.hasClusterParent = true;
    //     }

    //     this.loading = false;
    // }

    // setError(id: string, value: string) {
    //     Vue.set(this.errors, id, value);
    // }

    locationSelected(value: locations.Location & { name: string }) {
        if (this.plan) {
            this.plan.location = value;
            this.plan.locationName = value.name;
        }
    }



    // onChangeCoverImage(event: InputEvent) {
    //     this.coverImage = (event.target as any).files[0];
    // }

    public confirmVisibleLayer() {
        if (!this.tmpVisibleLayer) return;

        this.plan?.visibleLayers.push(this.tmpVisibleLayer);

        this.tmpVisibleLayer = "";
    }

    // public valueChanged(value: server.Plan): void {
    //     this.plan = { ...this.plan, parentId: value.id } as server.Plan;
    // }

    // autocompleteFilterFunction(plans: server.Plan[], filteringValue: string): server.Plan[] {
    //     return plans.filter(x =>
    //         x?.title.toLocaleLowerCase().includes(filteringValue.toLocaleLowerCase()) ||
    //         x.description.toLocaleLowerCase().includes(filteringValue.toLocaleLowerCase()));
    // }

    // removeLayer(idx: number): void {
    //     this.plan?.visibleLayers.splice(idx, 1);
    // }

    // async confirm(): Promise<void> {
    //     if (!this.requiredFieldsSatisfied()) {
    //         return;
    //     }

    //     if (this.plan && !this.plan?.id)
    //         // Save new plan
    //         this.plan = await plansService.Set(this.plan.groupId, this.plan);

    //     if (!this.plan) {
    //         MessageService.Instance.send("ERROR", this.$t('plans.modal.error-plans-creation', 'Errore durante la creazione del progetto'));
    //         return;
    //     }

    //     // Non navigo il dizionario perche' devo navigare solo i componenti con ref delle immagini
    //     await (this.$refs[this.coverMediaGalleryRef] as any).save(this.plan.id);

    //     await (this.$refs[this.mediaGalleryRef] as any).save(this.plan.id);

    //     // Update plan with new properties
    //     await plansService.Set(this.plan!.groupId, this.plan);

    //     this.setPlan(this.plan);

    //     this.close();
    // }

    async coverUploaded(file: server.FileAttach | server.FileAttach[]): Promise<void> {
        if (file && this.plan) {
            let cover = null;
            if (Array.isArray(file)) {
                cover = file[0];
            } else {
                cover = file;
            }

            const sharableCoverImageToken = await this.askForSharedFile(cover.id, this.plan.id, `${CONFIGURATION.context}-COVER`) as unknown as ArrayBuffer;

            this.plan.coverImageIds = { originalFileId: cover.id, sharedToken: this.decodeSharable(sharableCoverImageToken), contentType: cover.contentType } as file.SharedRef;

            if (this.plan.id)
                //update plan
                await plansService.Set(this.plan!.groupId, this.plan);
        }
    }

    async coverRemoved(file: server.FileAttach): Promise<void> {
        if (this.plan) {
            this.plan.coverImageIds = null;

            if (this.plan.id)
                //update plan
                await plansService.Set(this.plan!.groupId, this.plan);
        }
    }

    //     async fileRemoved(file: string): Promise<void> {
    //         if (this.plan) {
    //             const attachments = [...this.plan.attachmentsIds];

    //             const idx = this.plan.attachmentsIds.findIndex(x => x.originalFileId === file);

    //             if (idx !== -1) {
    //                 attachments.splice(idx, 1);
    //             }

    //             this.plan.attachmentsIds = [...attachments];

    //             if (this.plan.id)
    //                 // update plan
    //                 await plansService.Set(this.plan!.groupId, this.plan);
    //         }
    //     }

    private decodeSharable(buffer: ArrayBuffer): string {
        const textDecoder = new TextDecoder();

        return textDecoder.decode(buffer);
    }

    async filesUploaded(file: server.FileAttach | server.FileAttach[]): Promise<void> {
        if (file && this.plan) {
            let attachmentsSharableIds: file.SharedRef[] = [];

            if (this.plan.attachmentsIds !== null)
                attachmentsSharableIds = [...this.plan.attachmentsIds];

            if (Array.isArray(file)) {
                for (const f of file) {
                    const shared = await this.askForSharedFile(f.id, this.plan.id, CONFIGURATION.context) as unknown as ArrayBuffer;

                    attachmentsSharableIds.push({ originalFileId: f.id, sharedToken: this.decodeSharable(shared), contentType: f.contentType } as file.SharedRef);
                }
            } else {
                const shared = await this.askForSharedFile(file.id, this.plan.id, CONFIGURATION.context) as unknown as ArrayBuffer;

                attachmentsSharableIds.push({ originalFileId: file.id, sharedToken: this.decodeSharable(shared), contentType: file.contentType } as file.SharedRef);
            }

            this.plan.attachmentsIds = [...attachmentsSharableIds];

            if (this.plan.id)
                //update plan
                await plansService.Set(this.plan!.groupId, this.plan);
        }
    }

    //     private setPlan(plan: server.Plan): void {
    //         store.actions.crowdplanning.setPlan(plan);
    //     }

    //     private requiredFieldsSatisfied(): boolean {
    //         if (!this.plan?.location) {
    //             MessageService.Instance.send("ERROR", this.$t('plans.modal.position_error', 'Inserisci una posizione valida'));
    //             return false;
    //         }

    //         if (!this.plan?.description) {
    //             MessageService.Instance.send("ERROR", this.$t('plans.modal.description_error', 'Inserisci una descrizione'))
    //             return false;
    //         }

    //         if (!this.plan?.startDate) {
    //             MessageService.Instance.send("ERROR", this.$t('plans.modal.start_date_error', 'Inserisci una data di inizio'));
    //             return false;
    //         }

    //         if (!this.plan?.dueDate) {
    //             MessageService.Instance.send("ERROR", this.$t('plans.modal.due_date_error', 'Inserisci una data di fine'));
    //             return false;
    //         }

    //         return true;
    //     }

    private async askForSharedFile(fileId: string, id: string, context: string): Promise<string> {
        return await MessageService.Instance.ask("SHARE_FILE", fileId, `${context}-${id}`);
    }

    //     private async rollbackplanCreation(id: string): Promise<void> {
    //         await plansService.deleteplan(id);

    //         MessageService.Instance.send("ERROR", this.$t("plan.creation.error", "Errore durante la creazione della proposta"));
    //     }
}