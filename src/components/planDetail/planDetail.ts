
import { computed, defineComponent, getCurrentInstance, onMounted, PropType, provide, ref } from 'vue';
import { InjectReactive, Prop, ProvideReactive, Watch } from "vue-property-decorator";
import PlanCard from "../plans/planCard/planCard.vue";
import PlanSummary from "../planSummary/planSummary.vue";
import { CommonRegistry, MessageService, Projector } from "vue-mf-module";
import PlanMap from "../planMap/planMap.vue";
import moment from "moment";


type taskType = {
  id: number;
  hexId: string;
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
  name: "planDetail",
  props: {
    currentUser: {
      type: Object as PropType<server.Myself | null>
    },
    selectedPlan: {
      type: Object as PropType<server.Plan | null>
    },
    plans: {
      type: Object as PropType<server.Plan>
    },
    loggedIn: {
      type: Boolean
    }
  },
  components: {
    PlanCard,
    PlanSummary,
    PlanMap
  },
  setup(props, { emit }) {

    // provide(() => customFields, customFields)

    // @ProvideReactive()
    // customFields?: any[] = [];

    const liked = ref<boolean>(false)
    const count = ref<number>(0)
    const tasksList = ref<taskType[]>([])
    const type = ref<string>("PLANS");
    const showpane = ref<'comments' | 'issues'>("comments");

    const can = getCurrentInstance()!.proxy.$root.$can

    const commentSectionOpened = ref<boolean>(false);

    const userRoles = ref<string[]>([])

    const canSeeOthersComments = computed(() => {
      // TODO: Check if user roles matches rolesCanSeeOthersComments
      return props.selectedPlan?.rolesCanSeeOthersComments
    })

    const canWriteComments = computed(() => {
      return props.selectedPlan?.rolesCanWriteComments
    })

    const likeButton = computed(() => {
      return CommonRegistry.Instance.getComponent("likeButton");
    })

    const taskCardComponent = computed(() => {
      return CommonRegistry.Instance.getComponent("taskCardComponent");
    })

    const citizenTaskCardComponent = computed(() => {
      return CommonRegistry.Instance.getComponent("citizenTaskCardComponent");
    })

    const planId = computed(() => {
      return props.selectedPlan!.id;
    })

    const sharedPreviewComponent = computed(() => {
      return CommonRegistry.Instance.getComponent('shared-preview');
    })

    const selectedPlanTitle = computed<string>(() => {
      return props.selectedPlan!.title
    })

    const mediaGallery = computed(() => {
      return CommonRegistry.Instance.getComponent('public-media-gallery');
    })

    const discussionRoom = computed(() => {
      return CommonRegistry.Instance.getComponent('discussion-room-crowd')
    })

    const workspaceId = computed(() => {
      return props.selectedPlan!.workspaceId
    })

    onMounted(mounted)
    async function mounted() {
      getPlanTasks();

      userRoles.value = await MessageService.Instance.ask("USER_ROLES") as string[]

      if (!canSeeMsg() && !canWriteMsg()) {
        showpane.value = "issues";
      }
    }

    async function getPlanTasks() {
      let groups = await MessageService.Instance.ask<server.Group[]>('GET_TASKS_GROUPS')
      let tasks = await Promise.all(groups.map(g => MessageService.Instance.ask<taskType[]>('GET_TASKS_BY_GROUP', g.id, props.selectedPlan?.id)));
      tasksList.value = tasks.flat();
    }

    async function createIssue() {
      let editor = CommonRegistry.Instance.getComponent("taskEditor");
      let model = await MessageService.Instance.ask("TASK-MODEL") as any;
      model.reference = props.selectedPlan!.id
      let result = (await Projector.Instance.projectAsyncTo(editor as any, model))
      // await MessageService.Instance.ask("CHANGE_TASKS_REFERENCE", [result.id], this.selectedPlan!.id!)

      getPlanTasks();
    }

    async function removeTask(id: string, taskId: any) {
      await MessageService.Instance.ask("CHANGE_TASKS_REFERENCE", [taskId], null)
      getPlanTasks();
    }

    function date(value: Date, format: string = "L") {
      return moment(value).format(format)
    }

    function edit() {
      back()
      emit('edit', props.selectedPlan)
    }

    function openCommentSection(): void {
      commentSectionOpened.value = true;
    }

    function closeCommentsSection(): void {
      commentSectionOpened.value = false;
    }

    function back() {
      emit('goback')
    }

    function hasPermission(permission: string): boolean {
      return can(`${type.value}.${permission}`);
    }

    function canVote() {
      if (props.selectedPlan && !props.selectedPlan.rolesCanRate.length) return true

      if (props.selectedPlan && props.selectedPlan.rolesCanRate.length) {
        let rolesCanRate = props.selectedPlan.rolesCanRate.map(r => r.trim().toUpperCase())

        for (let ur of userRoles.value) {
          if (rolesCanRate.includes(ur.trim().toUpperCase())) {
            return true
          }
        }

        return false
      }
    }

    function canSeeMsg() {
      if (props.selectedPlan && !props.selectedPlan.rolesCanSeeOthersComments.length) return true

      if (props.selectedPlan && props.selectedPlan.rolesCanSeeOthersComments.length) {
        let rolesCanSeeOthersComments = props.selectedPlan.rolesCanSeeOthersComments.map(r => r.trim().toUpperCase())

        for (let ur of userRoles.value) {
          if (rolesCanSeeOthersComments.includes(ur.trim().toUpperCase())) {
            return true
          }
        }

        return false
      }
    }

    function canWriteMsg() {
      if (props.selectedPlan && !props.selectedPlan.rolesCanWriteComments.length) return true

      if (props.selectedPlan && props.selectedPlan.rolesCanWriteComments.length) {
        let rolesCanWriteComments = props.selectedPlan.rolesCanWriteComments.map(r => r.trim().toUpperCase())

        for (let ur of userRoles.value) {
          if (rolesCanWriteComments.includes(ur.trim().toUpperCase())) {
            return true
          }
        }

        return false
      }
    }

  async function openLoginModal(): Promise < void> {
      await Projector.Instance.projectAsyncTo((() => import(/* webpackChunkName: "plansModal" */ '@/components/loginModal/loginModal.vue')) as never, {})
    }

    return {
      liked,
      count,
      type,
      tasksList,
      canSeeOthersComments,
      canWriteComments,
      likeButton,
      taskCardComponent,
      citizenTaskCardComponent,
      planId,
      sharedPreviewComponent,
      selectedPlanTitle,
      mediaGallery,
      discussionRoom,
      workspaceId,
      showpane,
      canSeeMsg,
      canWriteMsg,
      openLoginModal,
      canVote,
      hasPermission,
      date,
      edit,
      createIssue,
      removeTask,
      openCommentSection,
      closeCommentsSection,
      back
    }
  }
})