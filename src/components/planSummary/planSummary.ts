
import { computed, defineComponent, onMounted, PropType, ref } from "vue";

import { store } from "@/store";
import { CommonRegistry, MessageService } from "vue-mf-module";
import moment from "moment";
import { Icon } from "@/utility/Icon";
import { Shared } from "@/utility/Shared";

export default defineComponent({
  name: 'planSummary',
  props: {
    likes: {
      type: Number,
      default: 0
    },
    plan: {
      type: Object as PropType<server.Plan>,
      required: true
    },
    workspaceId: {
      type: String,
      required: true
    }
  },
  setup(props, { emit }) {
    
    const group = ref<server.Group | null>(null); 
    const coverImage =  ref<string | null>(null);
    const type = ref<string>('PLANS');
    const userRoles = ref<string[]>([])

    const likeCounter = computed(() => {
      return CommonRegistry.Instance.getComponent("likeCounter");
    })

    const CoverImage = computed<string | null>(() => {
      if (!coverImage.value) return null;
  
      return Shared.imageFromString(coverImage.value);
    })
  
    const formattedDuedDate = computed<string>(() => {
      return moment(props.plan.dueDate).format('D/MM/YYYY');
    })

    const formattedStartDate = computed<string>(() => {
      return moment(props.plan.startDate).format('D/MM/YYYY');
    })

    onMounted(mounted)
    async function mounted(): Promise<void> {

      userRoles.value = await MessageService.Instance.ask("USER_ROLES") as string[]
  
      if (props.plan.coverImageIds?.sharedToken)
        coverImage.value = await Shared.getShared(props.plan.coverImageIds.sharedToken);
  
      group.value = store.getters.crowdplanning.getGroupById(props.plan.groupId);
    }
  
    function iconCode(iconCode: string): string {
      return Icon.getIconCode(iconCode);
    }

    function canSeeRating() {
      if (props.plan && (!props.plan.rolesCanSeeOthersRatings.length || props.plan.rolesCanSeeOthersRatings.some((r) => userRoles.value.includes(r)))) {
        return true
      } 
    }
  
    return {
      group,
      coverImage,
      type,
      likeCounter,
      userRoles,
      CoverImage,
      formattedDuedDate,
      formattedStartDate,
      iconCode,
      canSeeRating
    }
  }
})