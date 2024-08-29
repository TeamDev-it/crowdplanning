
import { computed, defineComponent, getCurrentInstance, onMounted, onUnmounted, PropType, ref, watch } from "vue";
import { store } from "@/store";
import { Prop, Watch } from "vue-property-decorator";

export default defineComponent({
  name: 'crowdplanningHeader',
  props: {
    currentUser: {
      type: Object as PropType<server.Myself>,
    },
    group: {
      type: Object as PropType<server.Group | null>,
    },
    states: {
      type: Array as PropType<server.State[]>,
    }
  },
  setup(props, { emit }) {

    const route = getCurrentInstance()!.proxy.$route

    const noGroups = ref<boolean>(false);
    const seeMap = ref<boolean>(true)
    const seeProjects = ref<boolean>(route.query.hideProjects ? false : true)
    const showListOpened = ref<boolean>(false)
    const simple = ref<boolean>(true)
    const fromIssue = ref<boolean>(true)
    const visualListOpened = ref<boolean>(false)
    const expiredPrj = ref<boolean>(true)

    const searchedValue = computed<string>({
      get() {
        return store.getters.crowdplanning.getSearchedValue();
      },
      set(value: string) {
        store.actions.crowdplanning.setSearchedValue(value);
      }
    });

    const can = getCurrentInstance()!.proxy.$root.$can

    watch(() => seeProjects.value, changeViewProj)
    function changeViewProj() {
      emit("changeViewProj", seeProjects.value)
    }

    watch(() => seeMap.value, changeViewMap)
    function changeViewMap() {
      emit("changeViewMap", seeMap.value)
    }

    watch(() => fromIssue.value, changeViewFromIssue)
    function changeViewFromIssue() {
      emit("changeViewFromIssue")
    }

    watch(() => simple.value, changeViewSimple)
    function changeViewSimple() {
      emit("changeViewSimple")
    }

    watch(() => expiredPrj.value, noExpiredPrj)
    async function noExpiredPrj() {
      emit("expiredPrj")
    }
    
    onMounted(mounted)
    function mounted() {
      if (seeProjects.value)
        if (window.innerHeight < 800) {
          seeMap.value = false
        }
  
      window.addEventListener("resize", () => {
        if (seeProjects.value) {
          if (window.innerHeight < 800) {
            seeMap.value = false
          }
          if (window.innerHeight > 800) {
            seeMap.value = true
          }
        }
      });
    };
  
    onUnmounted(unmounted)
    function unmounted() {
      window.removeEventListener("resize", () => { });
    };
  
    function hasPermission(permission: string): boolean {
      return can(`PLANS.${permission}`);
    }
  
    async function addPlan(): Promise<void> {
      emit("addPlan");
    }
  
    function toggleOpened() {
      showListOpened.value = !showListOpened.value;
    }
  
    function toggleMenu() {
      noGroups.value = !noGroups.value
      emit('toggleMenu')
    }
  
    function toggleOpened2() {
      visualListOpened.value = !visualListOpened.value;
    }

    return {
      noGroups,
      seeMap,
      seeProjects,
      showListOpened,
      simple,
      fromIssue,
      visualListOpened,
      expiredPrj,
      searchedValue,
      hasPermission,
      addPlan,
      toggleOpened,
      toggleMenu,
      toggleOpened2
    }
  }
})