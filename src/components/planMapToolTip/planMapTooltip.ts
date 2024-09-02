import { computed, defineComponent, onMounted, PropType, ref, watch } from "vue";

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
    const userRoles = ref<string[]>([])
    const type = ref<string>('PLANS');
    
    const likeCounter = computed(() => {
      return CommonRegistry.Instance.getComponent("likeCounter");
    })

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

      userRoles.value = await MessageService.Instance.ask("USER_ROLES") as string[]

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

    function canSeeRating() {
      if (plan.value && (!plan.value.rolesCanSeeOthersRatings.length || plan.value.rolesCanSeeOthersRatings.some((r) => userRoles.value.includes(r)))) {
        return true
      } 
    }


    return {
      type,
      likeCounter,
      coverImage,
      CoverImage,
      plan,
      imagePreview,
      iconCode,
      openPlan,
      canSeeRating,
    }
  }
})