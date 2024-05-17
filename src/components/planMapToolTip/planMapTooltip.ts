import Vue, { computed, defineComponent, onMounted, PropType, ref, watch } from "vue";
import Component from "vue-class-component";
import { Prop, Watch } from "vue-property-decorator";
import PlanCard from "../plans/planCard/planCard.vue";
import { store } from "@/store";
import { Shared } from "@/utility/Shared";
import { CommonRegistry, MessageService } from "vue-mf-module";
import { Icon } from "@/utility/Icon";

export default defineComponent({
  name: "planMapTooltip",
  props: {
    value: {
      type: Object as PropType<{
        objectId: number,
        planId: string,
        state: any,
        title: string,
        typeId: string
      }>,
    }
  },
  components: {
    PlanCard
  },
  setup(props) {
    
    const coverImage = ref<string | null>(null);

    const CoverImage = computed<string | null>(() => {
      if (!coverImage.value)
        return '';
      return Shared.imageFromString(coverImage.value);
    })
  
    const plan = computed(() => {
      return store.getters.crowdplanning.getPlanById(props.value!.planId);
    })
  
    const imagePreview = computed(() => {
      return CommonRegistry.Instance.getComponent("image-preview")
    })
  
    const iconCode = computed<string>(() => {
      return Icon.getIconCode(plan.value.group?.iconCode ?? '');
    })

    onMounted(mounted)
    async function mounted() {
      if (plan.value.coverImageIds?.sharedToken)
        coverImage.value = await Shared.getShared(plan.value.coverImageIds.sharedToken);
    }
  
    watch(() => props.value!.planId, changeImg)
    async function changeImg() {
      coverImage.value = await Shared.getShared(plan.value.coverImageIds!.sharedToken)
    }
  
    function openPlan() {
      MessageService.Instance.send("OPEN_CROWDPLAN", plan.value.id);
    }

    return {
      coverImage,
      CoverImage,
      plan,
      imagePreview,
      iconCode,
      openPlan
    }
  }
})

@Component({
  components: {
    PlanCard
  }
})
class ObjectMapTooltip extends Vue {

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

