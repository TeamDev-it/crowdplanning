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
import groupButton from "@/components/groupButton/groupButton.vue";
import statusButton from "@/components/statusButton/statusButton.vue";


type taskType = {
  id: number;
  parentId: string;
  parentType: string;
  title: string;
  description: string;
  priority: number;
  state: any;
  isArchived: boolean;
  source: string;
  startDate: Date;
  dueDate: Date;
  userName: string;
  creationDate: Date;
  lastUpdated: Date;
  groupId: string;
  group: any;
  assignedTo: any;
  location?: locations.Location;
  workspaceId?: string;
  customFields: [];
  subtaskCount?: {
    type: string;
    count: number;
  }[];
  isClusterRoot: boolean;
  tags: string[];
  shortId: number;
};


@Component({
  components: {
    datePicker,
    dateTime,
    Autocomplete,
    groupButton,
    statusButton,
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
  groups!: server.Group;

  @Prop()
  newPlan?: server.Plan

  @Watch('plan.isPublic')
  onIsPublicChanged() {
    if (this.plan?.isPublic) {
      this.plan.rolesCanRate = [];
      this.plan.rolesCanSeeOthersComments = [];
      this.plan.rolesCanSeeOthersRatings = [];
      this.plan.rolesCanWriteComments = [];
    }
  }
  copyPlan: server.Plan | null = null;
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

  get states(): server.State[] {
    return Array.from(store.getters.crowdplanning.getStates(this.groups.id) || []);
  }

  get taskSelector() {
    return CommonRegistry.Instance.getComponent('task-selector');
}

openTaskSelectorModal():void {
  MessageService.Instance.send("OPEN_TASK_SELECTOR_MODAL", this.plan)
}
 async mounted() {
    if (this.editable) {
      this.plan = this.editable
    }
    if (this.newPlan) {
      this.plan = this.newPlan
    }
    if (this.plan?.planType == 'fromIssues') {
        this.toggleType = true
    }
    this.getPlanTasks()

    this.copyPlan = JSON.parse(JSON.stringify(this.plan));
  }

  hasPermission(permission: string): boolean {
    return this.$can(`PLANS.${permission}`);
  }

  back(noMod: boolean) {
    if (noMod) {
      Object.assign(this.plan!, this.copyPlan)
      this.$emit('goback')
    }
    else {
      this.$emit('goback')
    }
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

    this.back(false);
  }

  tasks: any = [];
  async getPlanTasks() {
    let groups = await MessageService.Instance.ask<server.Group[]>('GET_TASKS_GROUPS')
    let tasks = await Promise.all(groups.map(g => MessageService.Instance.ask<taskType[]>('GET_TASKS_BY_GROUP', g.id, this.plan?.id)));
    this.tasksList = tasks.flat();
    this.tasks = this.tasksList?.map(t => t.id) ?? []
  }

  async remove(): Promise<void> {
    if (this.tasksList?.length) {
      await MessageService.Instance.ask('CHANGE_TASKS_REFERENCE', this.tasks, null)
    }
     
    await plansService.deletePlan(this.plan!.id!);
    this.back(false)
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
    if (!this.plan?.state || this.plan.state == "") {
      MessageService.Instance.send("ERROR", this.$t('plans.modal.state_error', 'Inserisci uno stato'))
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
    if (this.plan.dueDate) {
      if (this.plan.dueDate < this.plan.startDate) {
        MessageService.Instance.send("ERROR", this.$t('plans.modal.due_date_error_before_start', 'La data di scadenza del progetto non può essere inferiore alla data di inizio'));
        return false;
      }
    }
    if (this.plan.planType == 'fromIssues') {
      if (!this.tasksList) {
          MessageService.Instance.send("ERROR", this.$t('plans.modal.planType_error', 'Inserisci almeno una segnalazione'));
          return false;
      }
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

  groupChanged(val: server.Group) {
    this.plan!.group = val;
    this.plan!.groupId = val.id;
}

stateChanged(val: string) {
    this.plan!.state = val ;
}

tasksList?: taskType[] = []
toggleType: boolean = false
@Watch('toggleType') 
pro() {
    if (this.toggleType) {
        this.plan!.planType = 'fromIssues';
    } else {
        this.plan!.planType = 'simple';
        this.tasksList = []
    }
}
}
