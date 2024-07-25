
import { computed, defineComponent, getCurrentInstance, onMounted, PropType, ref, watch } from "vue";
import { CommonRegistry, MessageService } from "vue-mf-module";
import datePicker from "v-calendar/lib/components/date-picker.umd";
import dateTime from "../dateTime/dateTime.vue";
import { plansService } from "@/services/plansService";
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

export default defineComponent({
  name: 'planModal',
  props: {
    editable: {
      type: Object as PropType<server.Plan>
    },
    selectedPlan: {
      type: Object as PropType<server.Plan>
    },
    groups: {
      type: Object as PropType<server.Group>
    },
    newPlan: {
      type: Object as PropType<server.Plan>
    }
  },
  components: {
    datePicker,
    dateTime,
    Autocomplete,
    groupButton,
    statusButton,
  },
  setup(props, { emit }) {

    const copyPlan = ref<server.Plan | null>(null);
    const plan = ref<server.Plan | null>(null);
    const coverImage = ref<File | null>(null);
    const tmpVisibleLayer = ref<string>("");
    const hasClusterParent = ref<boolean>(false);
    const planMode = ref<planMode>("create");
    const loading = ref<boolean>(true);
    const errors = ref<{ [id: string]: string }>({});
    const featureTest = ref<locations.Feature | null>(null);
    const context = ref<string>("PLANS")

    const tasksList = ref<taskType[]>([])
    const toggleType = ref<boolean>(false)

    const tasks = ref<any>([]);

    const can = getCurrentInstance()!.proxy.$root.$can
    const t = getCurrentInstance()!.proxy.$root.$t


    const workspaceId = computed(() => {
      return props.selectedPlan!.workspaceId
    })

    const editFeatureMap = computed(() => {
      return CommonRegistry.Instance.getComponent("editfeature-map");
    })

    const states = computed<server.State[]>(() => {
      return Array.from(store.getters.crowdplanning.getStates(props.groups!.id) || []);
    })

    const taskSelector = computed(() => {
      return CommonRegistry.Instance.getComponent('task-selector');
    })

    const esriGeocodingAutocomplete = computed(() => {
      return CommonRegistry.Instance.getComponent('esri-geocoding-autocomplete');
    })

    const mediaGallery = computed(() => {
      return CommonRegistry.Instance.getComponent('media-gallery');
    })

    watch(() => plan.value?.isPublic, onIsPublicChanged)
    function onIsPublicChanged() {
      if (plan.value?.isPublic) {
        plan.value.rolesCanRate = [];
        plan.value.rolesCanSeeOthersComments = [];
        plan.value.rolesCanSeeOthersRatings = [];
        plan.value.rolesCanWriteComments = [];
      }
    }

    function openTaskSelectorModal(): void {
      MessageService.Instance.send("OPEN_TASK_SELECTOR_MODAL", plan.value)
    }

    onMounted(mounted)
    async function mounted() {
      if (props.editable) {
        plan.value = props.editable
      }
      if (props.newPlan) {
        plan.value = props.newPlan
      }
      if (plan.value?.planType == 'fromIssues') {
        toggleType.value = true
      }
      getPlanTasks()

      copyPlan.value = JSON.parse(JSON.stringify(plan.value));
    }

    function hasPermission(permission: string): boolean {
      return can(`PLANS.${permission}`);
    }

    function back(noMod: boolean) {
      if (noMod) {
        Object.assign(plan.value!, copyPlan.value)
        emit('goback')
      }
      else {
        emit('goback')
      }
    }

    function confirmVisibleLayer() {
      if (!tmpVisibleLayer.value) return;

      plan.value?.visibleLayers.push(tmpVisibleLayer.value);

      tmpVisibleLayer.value = "";
    }

    function valueChanged(value: server.Plan): void {
      plan.value = { ...plan.value, parentId: value.id } as server.Plan;
    }

    function autocompleteFilterFunction(plans: server.Plan[], filteringValue: string): server.Plan[] {
      return plans.filter(x =>
        x?.title.toLocaleLowerCase().includes(filteringValue.toLocaleLowerCase()) ||
        x.description.toLocaleLowerCase().includes(filteringValue.toLocaleLowerCase()));
    }

    const refs = getCurrentInstance()!.proxy.$refs;
    const coverMediaGalleryRef = ref('');
    async function confirm(): Promise<void> {

      if (plan.value && !plan.value?.id) {
        plan.value.workspaceId = props.groups!.workspaceId;
        // Save new plan
        plan.value.id = null;
        plan.value = await plansService.Set(plan.value.groupId, plan.value);
      }

      if (!plan.value) {
        MessageService.Instance.send("ERROR", t('plans.modal.error-plans-creation', 'Errore durante la creazione del progetto'));
        return;
      }
      // Non navigo il dizionario perche' devo navigare solo i componenti con ref delle immagini
      if (plan.value.id)

        await (refs[coverMediaGalleryRef.value] as unknown as { save(id: string): Promise<void> })?.save(plan.value.id);

      // await (this.$refs[this.mediaGalleryRef] as any)?.save(this.plan.id);

      // Update plan with new properties
      await plansService.Set(plan.value!.groupId, plan.value);

      setPlan(plan.value);

      back(false);
    }

    async function getPlanTasks() {
      const groups = await MessageService.Instance.ask<server.Group[]>('GET_TASKS_GROUPS')
      let tasks = await Promise.all(groups.map(g => MessageService.Instance.ask<taskType[]>('GET_TASKS_BY_GROUP', g.id, plan.value?.id)));
      tasksList.value = tasks.flat();
      tasks = tasksList.value?.map(t => t.id) as unknown as taskType[][] ?? [];
    }

    async function remove(): Promise<void> {
      if (tasksList.value?.length) {
        await MessageService.Instance.ask('CHANGE_TASKS_REFERENCE', tasks.value, null)
      }

      await plansService.deletePlan(plan.value!.id!);
      back(false)
    }

    async function coverUploaded(file: server.FileAttach | server.FileAttach[]): Promise<void> {
      if (file && plan.value) {
        let cover = null;
        if (Array.isArray(file)) {
          cover = file[0];
        } else {
          cover = file;
        }

        const sharableCoverImageToken = await askForSharedFile(cover.id, plan.value.id!, `${context.value}-COVER`) as unknown as ArrayBuffer;

        plan.value.coverImageIds = { originalFileId: cover.id, sharedToken: decodeSharable(sharableCoverImageToken), contentType: cover.contentType } as file.SharedRef;

        if (plan.value.id)
          //update plan
          await plansService.Set(plan.value!.groupId, plan.value);
      }
    }

    async function coverRemoved(/* file: server.FileAttach */): Promise<void> {
      if (plan.value) {
        plan.value.coverImageIds = null;

        if (plan.value.id)
          //update plan
          await plansService.Set(plan.value!.groupId, plan.value);
      }
    }

    function decodeSharable(buffer: ArrayBuffer): string {
      const textDecoder = new TextDecoder();

      return textDecoder.decode(buffer);
    }

    async function filesUploaded(file: server.FileAttach | server.FileAttach[]): Promise<void> {
      if (file && plan.value) {
        let attachmentsSharableIds: file.SharedRef[] = [];

        if (plan.value.attachmentsIds !== null)
          attachmentsSharableIds = [...plan.value.attachmentsIds];

        if (Array.isArray(file)) {
          for (const f of file) {
            const shared = await askForSharedFile(f.id, plan.value.id!, context.value) as unknown as ArrayBuffer;

            attachmentsSharableIds.push({ originalFileId: f.id, sharedToken: decodeSharable(shared), contentType: f.contentType } as file.SharedRef);
          }
        } else {
          const shared = await askForSharedFile(file.id, plan.value.id!, context.value) as unknown as ArrayBuffer;

          attachmentsSharableIds.push({ originalFileId: file.id, sharedToken: decodeSharable(shared), contentType: file.contentType } as file.SharedRef);
        }

        plan.value.attachmentsIds = [...attachmentsSharableIds];

        if (plan.value.id)
          //update plan
          await plansService.Set(plan.value!.groupId, plan.value);
      }
    }

    function setPlan(plan: server.Plan): void {
      store.actions.crowdplanning.setPlan(plan);
    }

    async function askForSharedFile(fileId: string, id: string, context: string): Promise<string> {
      return await MessageService.Instance.ask("SHARE_FILE", fileId, `${context}-${id}`);
    }

    //     private async rollbackplanCreation(id: string): Promise<void> {
    //         await plansService.deleteplan(id);

    //         MessageService.Instance.send("ERROR", this.$t("plan.creation.error", "Errore durante la creazione della proposta"));
    //     }

    function groupChanged(val: server.Group) {
      plan.value!.group = val;
      plan.value!.groupId = val.id;
    }

    function stateChanged(val: string) {
      plan.value!.state = val;
    }


    watch(() => toggleType.value, ToggleType)
    function ToggleType() {
      if (toggleType.value) {
        plan.value!.planType = 'fromIssues';
      } else {
        plan.value!.planType = 'simple';
        tasksList.value = []
      }
    }


    function closepopups() {
      MessageService.Instance.send("closepopups");
    }

    return {
      copyPlan,
      plan,
      coverImage,
      tmpVisibleLayer,
      hasClusterParent,
      planMode,
      loading,
      errors,
      featureTest,
      context,
      workspaceId,
      editFeatureMap,
      states,
      taskSelector,
      esriGeocodingAutocomplete,
      mediaGallery,
      tasksList,
      toggleType,
      tasks,
      coverMediaGalleryRef,
      openTaskSelectorModal,
      hasPermission,
      back,
      confirmVisibleLayer,
      valueChanged,
      autocompleteFilterFunction,
      confirm,
      remove,
      coverUploaded,
      coverRemoved,
      filesUploaded,
      groupChanged,
      stateChanged,
      closepopups
    }
  }
})
