import Component from "vue-class-component";
import Vue from "vue";
import { Prop } from "vue-property-decorator";
import { store } from "@/store";
import { CONFIGURATION } from "@/configuration";
import { Icon } from "@/utility/Icon";
import { CommonRegistry, MessageService } from "vue-mf-module";
import { Shared } from "@/utility/Shared";

@Component
export default class PlanCard extends Vue {

  @Prop()
  value!: server.Plan;

  @Prop({ default: true })
  showCommands!: boolean;

  @Prop({ required: true })
  selectedPlan!: server.Plan

  @Prop()
  plansGroupRoot: server.Group = {} as server.Group;

  coverImage: string | null = null;
  loading = true;
  group: server.Group | null = null;
  state: server.State | null = null;
  states: server.State[]= [];

  get likeViewer() {
    return CommonRegistry.Instance.getComponent("likeViewer");
  }

  get iconCode(): string {
    return Icon.getIconCode(this.value.group.iconCode);
  }

  get imagePreview() {
    return CommonRegistry.Instance.getComponent("image-preview")
  }

  async mounted() {
    try{
    this.userRoles = await MessageService.Instance.ask("USER_ROLES") as string[]
    }catch(e){}

    if (this.value.coverImageIds?.sharedToken)
      this.coverImage = await Shared.getShared(this.value.coverImageIds.sharedToken);

    if (this.value.groupId) {
      this.group = this.value.group;
    }

    if (this.value.id) {
      this.states = store.getters.crowdplanning.getStates(this.plansGroupRoot.id ?? this.value.groupId);
    }

    this.state = this.states?.find(x => x.shortName === this.value.state) as server.State; 

    this.loading = false;
  }

  selectPlan() {
    this.$emit('selectPlan', this.value)
  }

  get CoverImage(): string | null {
    if (!this.coverImage) return '';
    return Shared.imageFromString(this.coverImage);
  }

  get type(): string {
    return CONFIGURATION.context;
  }

  userRoles: string[] = []

  canVote() {
    if (this.value && (!this.value.rolesCanRate.length || this.value.rolesCanRate.some((r) => this.userRoles.includes(r)))) {
      return true
    }
  }
}
