import Vue from "vue";
import Component from "vue-class-component";
import { Prop, Watch } from "vue-property-decorator";
import PlanCard from "../plans/planCard/planCard.vue";
import { store } from "@/store";
import { Shared } from "@/utility/Shared";
import { CommonRegistry, MessageService } from "vue-mf-module";
import { Icon } from "@/utility/Icon";

@Component({
  components: {
    PlanCard
  }
})
export default class ObjectMapTooltip extends Vue {

  @Prop()
  value!: {
    objectId: number,
    planId: string,
    state: any,
    title: string,
    typeId: string
  };

  coverImage: string | null = null;
  get CoverImage(): string | null {
    if (!this.coverImage)
      return '';
    return Shared.imageFromString(this.coverImage);
  }

  get plan() {
    return store.getters.crowdplanning.getPlanById(this.value.planId!);
  }

  get imagePreview() {
    return CommonRegistry.Instance.getComponent("image-preview")
  }

  get iconCode(): string {
    return Icon.getIconCode(this.plan.group?.iconCode ?? '');
  }

  async mounted() {
    if (this.plan.coverImageIds?.sharedToken)
      this.coverImage = await Shared.getShared(this.plan.coverImageIds.sharedToken);
  }

  @Watch('value.planId')
  async changeImg() {
    this.coverImage = await Shared.getShared(this.plan.coverImageIds!.sharedToken)
  }

  openPlan() {
    MessageService.Instance.send("OPEN_CROWDPLAN", this.plan.id);
  }

}

