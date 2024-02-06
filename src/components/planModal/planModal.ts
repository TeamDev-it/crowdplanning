import Component from "vue-class-component";
import Vue from "vue";
import { Prop, Watch } from "vue-property-decorator";
import { CommonRegistry, MessageService } from "vue-mf-module";
import datePicker from "v-calendar/lib/components/date-picker.umd";
import dateTime from "../dateTime/dateTime.vue";
import { plansService } from "@/services/plansService";
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

  @Prop()
  editable?: server.Plan;

  @Prop()
  selectedPlan?: server.Plan;

  @Prop()
  plans?: server.Plan;

  @Prop()
  groups!: server.Group;

  @Prop()
  newPlan?: server.Plan

  plan: server.Plan | null = null;
  coverImage: File | null = null;
  tmpVisibleLayer = "";
  hasClusterParent = false;
  planMode: planMode = "create";
  loading = true;
  errors: { [id: string]: string } = {};
  featureTest: locations.Feature | null = null;

  get workspaceId() {
    return this.selectedPlan!.workspaceId
  }

  get editFeatureMap() {
    return CommonRegistry.Instance.getComponent("editfeature-map");
  }

  mounted() {

    if (this.editable) {
      this.plan = this.editable
    }
    if (this.newPlan) {
      this.plan = this.newPlan
    }

  }

  // @Watch("featureTest")
  // featureChanged(n: unknown) {
  //   console.log(n);
  // }

  back() {
    this.$emit('goback')
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

  // locationSelected(value: locations.Location & { name: string }) {
  //   if (this.plan) {
  //     this.featureTest = value as locations.Feature;
  //     this.plan.locationName = value.name;
  //   }
  // }

  confirmVisibleLayer() {
    if (!this.tmpVisibleLayer) return;

    this.plan?.visibleLayers.push(this.tmpVisibleLayer);

    this.tmpVisibleLayer = "";
  }

  valueChanged(value: server.Plan): void {
    this.plan = { ...this.plan, parentId: value.id } as server.Plan;
  }

  autocompleteFilterFunction(plans: server.Plan[], filteringValue: string): server.Plan[] {
    return plans.filter(x =>
      x?.title.toLocaleLowerCase().includes(filteringValue.toLocaleLowerCase()) ||
      x.description.toLocaleLowerCase().includes(filteringValue.toLocaleLowerCase()));
  }

  async confirm(): Promise<void> {
    if (!this.requiredFieldsSatisfied()) {
      return;
    }

    if (this.plan && !this.plan?.id) {
      this.plan.workspaceId = this.groups.workspaceId;
      // Save new plan
      this.plan.id = null;
      this.plan = await plansService.Set(this.plan.groupId, this.plan);
    }

    if (!this.plan) {
      MessageService.Instance.send("ERROR", this.$t('plans.modal.error-plans-creation', 'Errore durante la creazione del progetto'));
      return;
    }

    // Non navigo il dizionario perche' devo navigare solo i componenti con ref delle immagini
    if (this.plan.id)
      await (this.$refs[this.coverMediaGalleryRef] as unknown as { save(id: string): Promise<void> })?.save(this.plan.id);

    // await (this.$refs[this.mediaGalleryRef] as any)?.save(this.plan.id);

    // Update plan with new properties
    await plansService.Set(this.plan!.groupId, this.plan);

    this.setPlan(this.plan);

    this.back();
  }

  async remove(): Promise<void> {
    await plansService.deletePlan(this.plan!.id!);
    this.back()
  }

  async coverUploaded(file: server.FileAttach | server.FileAttach[]): Promise<void> {
    if (file && this.plan) {
      let cover = null;
      if (Array.isArray(file)) {
        cover = file[0];
      } else {
        cover = file;
      }

      const sharableCoverImageToken = await this.askForSharedFile(cover.id, this.plan.id!, `${CONFIGURATION.context}-COVER`) as unknown as ArrayBuffer;

      this.plan.coverImageIds = { originalFileId: cover.id, sharedToken: this.decodeSharable(sharableCoverImageToken), contentType: cover.contentType } as file.SharedRef;

      if (this.plan.id)
        //update plan
        await plansService.Set(this.plan!.groupId, this.plan);
    }
  }

  async coverRemoved(/* file: server.FileAttach */): Promise<void> {
    if (this.plan) {
      this.plan.coverImageIds = null;

      if (this.plan.id)
        //update plan
        await plansService.Set(this.plan!.groupId, this.plan);
    }
  }

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
          const shared = await this.askForSharedFile(f.id, this.plan.id!, CONFIGURATION.context) as unknown as ArrayBuffer;

          attachmentsSharableIds.push({ originalFileId: f.id, sharedToken: this.decodeSharable(shared), contentType: f.contentType } as file.SharedRef);
        }
      } else {
        const shared = await this.askForSharedFile(file.id, this.plan.id!, CONFIGURATION.context) as unknown as ArrayBuffer;

        attachmentsSharableIds.push({ originalFileId: file.id, sharedToken: this.decodeSharable(shared), contentType: file.contentType } as file.SharedRef);
      }

      this.plan.attachmentsIds = [...attachmentsSharableIds];

      if (this.plan.id)
        //update plan
        await plansService.Set(this.plan!.groupId, this.plan);
    }
  }

  private setPlan(plan: server.Plan): void {
    store.actions.crowdplanning.setPlan(plan);
  }

  private requiredFieldsSatisfied(): boolean {
    if (!this.plan?.title || this.plan.title == "") {
      MessageService.Instance.send("ERROR", this.$t('plans.modal.title_error', 'Inserisci un titolo'))
      return false;
  }
  if (!this.plan?.groupId || this.plan.groupId == "") {
      MessageService.Instance.send("ERROR", this.$t('plans.modal.group_error', 'Inserisci una categoria'))
      return false;
  }
  if (!this.plan?.description || this.plan.description == "") {
      MessageService.Instance.send("ERROR", this.$t('plans.modal.description_error', 'Inserisci una descrizione'))
      return false;
  }
  // if (!this.featureTest || this.featureTest == undefined) {
  //     MessageService.Instance.send("ERROR", this.$t('plans.modal.position_error', 'Inserisci una geometria valida'));
  //     return false;
  // }
  if (!this.plan?.startDate || this.plan.startDate == undefined) {
      MessageService.Instance.send("ERROR", this.$t('plans.modal.start_date_error', 'Inserisci una data di inizio'));
      return false;
  }
  // if (!this.plan?.dueDate || this.plan.dueDate == undefined) {
  //     MessageService.Instance.send("ERROR", this.$t('plans.modal.due_date_error', 'Inserisci una data di fine'));
  //     return false;
  // }

  //deve stare giu
  let titleLength = this.plan?.title.length as number
  if (titleLength > 106) {
      MessageService.Instance.send("ERROR", this.$t('plans.modal.title.length_error', 'Titolo troppo lungo'))
      return false;
  }

  return true;
}

  private async askForSharedFile(fileId: string, id: string, context: string): Promise<string> {
    return await MessageService.Instance.ask("SHARE_FILE", fileId, `${context}-${id}`);
  }

  //     private async rollbackplanCreation(id: string): Promise<void> {
  //         await plansService.deleteplan(id);

  //         MessageService.Instance.send("ERROR", this.$t("plan.creation.error", "Errore durante la creazione della proposta"));
  //     }

}
