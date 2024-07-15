import { computed, defineComponent, onMounted, PropType, ref } from "vue";
import { store } from "@/store";
import { Icon } from "@/utility/Icon";
import { CommonRegistry, MessageService, Projector } from "vue-mf-module";
import { Shared } from "@/utility/Shared";

export default defineComponent({
  name: 'planCard',
  props: {
    value: {
      type: Object as PropType<server.Plan>,
      required: true
    },
    showCommands: {
      type: Boolean,
      default: true
    },
    selectedPlan: {
      type: Object as PropType<server.Plan>
    },
    plansGroupRoot: {
      type: Object as PropType<server.Group>,
      required: true
    },
    loggedIn: {
      type: Boolean,
      // required: true
    }
  },
  setup(props, { emit }) {

    const coverImage = ref<string | null>(null);
    const loading = ref<boolean>(true);
    const group = ref<server.Group | null>(null);
    const state = ref<server.State | null>(null);
    const states = ref<server.State[]>([]);
    const userRoles = ref<string[]>([])

    const likeViewer = computed(() => {
      return CommonRegistry.Instance.getComponent("likeViewer");
    })

    const iconCode = computed<string>(() => {
      return Icon.getIconCode(props.value.group.iconCode);
    })

    const imagePreview = computed(() => {
      return CommonRegistry.Instance.getComponent("image-preview")
    })

    const CoverImage = computed<string | null>(() => {
      if (!coverImage.value) return '';
      return Shared.imageFromString(coverImage.value);
    })

    const type = computed<string>(() => {
      return "PLANS";
    })

    onMounted(mounted)
    async function mounted() {
      try {
        userRoles.value = await MessageService.Instance.ask("USER_ROLES") as string[]
      } catch (e) { /**/ }

      if (props.value.coverImageIds?.sharedToken)
        coverImage.value = await Shared.getShared(props.value.coverImageIds.sharedToken);

      if (props.value.groupId) {
        group.value = props.value.group;
      }

      if (props.value.id) {
        states.value = store.getters.crowdplanning.getStates(props.plansGroupRoot.id ?? props.value.groupId);
      }

      state.value = states.value?.find(x => x.shortName === props.value.state) as server.State;

      loading.value = false;
    }

    function selectPlan() {
      emit('selectPlan', props.value)
    }

    function canVote() {
      if (props.value && (!props.value.rolesCanRate.length || props.value.rolesCanRate.some((r) => userRoles.value.includes(r)))) {
        return true
      }
    }

    async function openLoginModal(): Promise<void> {
      await Projector.Instance.projectAsyncTo((() => import(/* webpackChunkName: "plansModal" */ '@/components/loginModal/loginModal.vue')) as never, {})
    }

    return {
      coverImage,
      loading,
      group,
      state,
      states,
      likeViewer,
      iconCode,
      imagePreview,
      userRoles,
      CoverImage,
      type,
      selectPlan,
      canVote,
      openLoginModal
    }
  }
})
