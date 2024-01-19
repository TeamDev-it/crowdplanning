import Component from "vue-class-component";
import Vue from 'vue';
import { Prop } from "vue-property-decorator";
import PlanCard from "../plans/planCard/planCard.vue";
import PlanSummary from "../planSummary/planSummary.vue";
import CitizenInteraction from "../citizenInteraction/citizenInteraction.vue";
import { CONFIGURATION } from "@/configuration";
import { CommonRegistry, MessageService } from "vue-mf-module";
import ChildrenPlans from "../childrenPlans/childrenPlans.vue";
import PlanMap from "../planMap/planMap.vue";


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

  get canSeeOthersComments() {
    // TODO: Check if user roles matches rolesCanSeeOthersComments
    return this.selectedPlan?.rolesCanSeeOthersComments
  }

  get likeButton() {
    return CommonRegistry.Instance.getComponent("likeButton");
  }

  liked: boolean = false
  count: number = 0
  async addLike() {
    let l = this.liked
    this.liked = !l

    if (l == false) {
      this.count++
    }

    if (l == true) {
      this.count--
    }


  }

  mounted() {
    this.userRoles = MessageService.Instance.ask("USER_ROLES") as string[]
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

  edit(editable: server.Plan) {
    this.back()
    this.$emit('edit', editable)
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
    console.log(this.selectedPlan?.rolesCanRate, 'chi può')
    console.log(this.userRoles, 'ruoli miei')
    if (this.selectedPlan && (!this.selectedPlan.rolesCanRate.length || this.selectedPlan.rolesCanRate.some((r) => this.userRoles.includes(r)))) {
      return true
    } 
  }


}
