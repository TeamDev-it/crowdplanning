import Component from "vue-class-component";
import Vue from 'vue';
import { InjectReactive, Prop, ProvideReactive, Watch } from "vue-property-decorator";
import PlanCard from "../plans/planCard/planCard.vue";
import PlanSummary from "../planSummary/planSummary.vue";
import CitizenInteraction from "../citizenInteraction/citizenInteraction.vue";
import { CONFIGURATION } from "@/configuration";
import { CommonRegistry, MessageService } from "vue-mf-module";
import ChildrenPlans from "../childrenPlans/childrenPlans.vue";
import PlanMap from "../planMap/planMap.vue";
import moment from "moment";


@Component({
  components: {
    PlanCard,
    PlanSummary,
    CitizenInteraction,
    ChildrenPlans,
    PlanMap
  }
})
export default class PlanDetail extends Vue {

  @Prop({})
  currentUser!: server.Myself | null;

  @Prop({ required: true })
  selectedPlan!: server.Plan | null;

  @Prop()
  plans?: server.Plan;

  @ProvideReactive()
  customFields?: any[] = [];

  get canSeeOthersComments() {
    // TODO: Check if user roles matches rolesCanSeeOthersComments
    return this.selectedPlan?.rolesCanSeeOthersComments
  }

  get canWriteComments() {
    return this.selectedPlan?.rolesCanWriteComments
  }

  get likeButton() {
    return CommonRegistry.Instance.getComponent("likeButton");
  }

  liked: boolean = false
  count: number = 0
  async addLike() {
    const l = this.liked
    this.liked = !l

    if (l == false) {
      this.count++
    }

    if (l == true) {
      this.count--
    }


  }

  get taskCardComponent() {
    return CommonRegistry.Instance.getComponent("taskCardComponent"); 
  }

  get citizenTaskCardComponent() {
    return CommonRegistry.Instance.getComponent("citizenTaskCardComponent"); 
  }

  tasksList?: {
    id: number;
    parentId: string;
    parentType: string;
    title: string;
    description: string;
    priority: number;
    state: string;
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
    subtaskCount?: { type: string, count: number }[];
    isClusterRoot: boolean;
    tags: string[];
    shortId: number
  }[]

  async mounted() {
    this.tasksList = await MessageService.Instance.ask('GET_TASKS_GROUPS', this.selectedPlan?.id)
    console.log(this.tasksList)
    this.userRoles = await MessageService.Instance.ask("USER_ROLES") as string[]
  }


  date(value: Date, format: string = "L") {
    return moment(value).format(format)
  }

  commentSectionOpened = false;

  get planId() {
    return this.selectedPlan!.id;
  }

  get sharedPreviewComponent() {
    return CommonRegistry.Instance.getComponent('shared-preview');
  }

  get type(): string {
    return CONFIGURATION.context;
  }

  get selectedPlanTitle(): string {
    return this.selectedPlan!.title
  }

  get mediaGallery() {
    return CommonRegistry.Instance.getComponent('public-media-gallery');
  }

  get discussionRoom() {
    return CommonRegistry.Instance.getComponent('discussion-room-crowd')
  }

  get workspaceId() {
    return this.selectedPlan!.workspaceId
  }

  edit() {
    this.back()
    this.$emit('edit', this.selectedPlan)
  }

  openCommentSection(): void {
    this.commentSectionOpened = true;
  }

  closeCommentsSection(): void {
    this.commentSectionOpened = false;
  }

  back() {
    this.$emit('goback')
  }

  hasPermission(permission: string): boolean {
    return this.$can(`${CONFIGURATION.context}.${permission}`);
  }

  userRoles: string[] = []

  canVote() {
    if (this.selectedPlan && (!this.selectedPlan.rolesCanRate.length || this.selectedPlan.rolesCanRate.some((r) => this.userRoles.includes(r)))) {
      return true
    }
  }

  canSeeMsg() {
    if (this.selectedPlan && (!this.selectedPlan.rolesCanSeeOthersComments.length || this.selectedPlan.rolesCanSeeOthersComments.some((r) => this.userRoles.includes(r)))) {
      return true
    } else return false
  }

  canWriteMsg() {
    if (this.selectedPlan && (!this.selectedPlan.rolesCanWriteComments.length || this.selectedPlan.rolesCanWriteComments.some((r) => this.userRoles.includes(r)))) {
      return true
    }
  }

  comments = true
  issues = false
  toggleSections(s: string) {
    if (s == 'comments') {
      this.comments = true
      this.issues = false
    }
    if (s == 'issues') {
      this.comments = false
      this.issues = true
    }
  }
}
