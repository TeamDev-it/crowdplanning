import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import PlanCard from "../plans/planCard/planCard.vue";
import { store } from "@/store";
import { Shared } from "@/utility/Shared";
import { CommonRegistry } from "vue-mf-module";
import { Icon } from "@/utility/Icon";

@Component({
  components: {
    PlanCard
  }
})
export default class ObjectMapTooltip extends Vue {

  @Prop()
  value!: {
    id: number,
    relationId: string,
    relationType: string,
    plan: server.Plan,
    latitude: number,
    longitude: number,
    altitude: number,
    wkid: number,
    workspaceId: string,
    date: Date,
  };

  coverImage: string | null = null;
  get CoverImage(): string | null {
    if (!this.coverImage)
      return '';
    return Shared.imageFromString(this.coverImage);
  }

  get plan() {
    return store.getters.crowdplanning.getPlanById(this.value.plan.id!);
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

};


