import Vue, { computed, defineComponent, getCurrentInstance, onMounted, ref, watch } from "vue";
import Component from "vue-class-component";
import { MessageService, Projector } from "vue-mf-module";
import CrowdplanningGroupList from "@/components/crowdplanningGroupsList/crowdplanningGroupsList.vue";
import CrowdplanningHeader from "@/components/crowdplanningHeader/crowdplanningHeader.vue";
import PlanModal from "@/components/planModal/planModal.vue";
import ScrollableContainer from "@/components/scrollableContainer/scrollableContainer.vue";
import PlanDetail from "@/components/planDetail/planDetail.vue";
import PlanMap from "@/components/planMap/planMap.vue";
import PlanList from "@/components/plans/planList/planList.vue";
import { CONFIGURATION } from "@/configuration";
import { groupsService } from "@/services/groupsService";
import { statesService } from "@/services/statesService";
import { plansService } from "@/services/plansService";
import { store } from "@/store";
import { cloneDeep } from "lodash";
import { union } from "@arcgis/core/geometry/geometryEngine.js";
import { geojsonToArcGIS } from "@terraformer/arcgis";
import { Prop, Watch } from "vue-property-decorator";

export default defineComponent({
  name: "crowdplanning",
  components: {
    CrowdplanningHeader,
    ScrollableContainer,
    CrowdplanningGroupList,
    PlanList,
    PlanModal,
    PlanMap,
    PlanDetail
  },
  props: {
    groupId: {
      type: String,
    },
    planId: {
      type: String,
    },
    refType: {
      type: String,
    }
  },
  setup(props) {

    const selectedPlan = ref<server.Plan | null>(null);
    const selectedGroup = ref<server.Group | null>(null);
    const plansGroupRoot = ref<server.Group>({} as server.Group);
    const currentUser = ref<server.Myself | null>(null);
    const states = ref<server.State[]>([]);
    const loading = ref<boolean>(true);
    const workspaceId = ref<string>("");
    const mapCenter = ref<number[] | null>(null);
    const componentKey = ref<number>(0);
    const loggedIn = ref<boolean>(false);
    const simple = ref<boolean>(true);
    const fromIssue = ref<boolean>(true);
    const addPlanSec = ref<boolean>(false);
    const editPlan = ref<boolean>(false)
    const editable = ref<server.Plan | null>(null);
    const toggleMap = ref<boolean>(true);
    const toggleProj = ref<boolean>(true);
    const expiredPrj = ref<boolean>(false);
    const noGroups = ref<boolean>(false);

    const can = getCurrentInstance()!.proxy.$root.$can;

    const searchedValue = computed<string>(() => {
      return store.state.crowdplanning.searchedValue
    })

    const plans = computed<server.Plan[]>(() => {
      return store.getters.crowdplanning.getPlans();
    })

    const filteredPlans = computed(() => {
      let result: server.Plan[] = cloneDeep(store.getters.crowdplanning.getPlans());

      if (selectedPlan.value) {
        return result.filter(x => x.id === selectedPlan.value?.id);
      }

      if (selectedGroup.value) {

        const groups = flatten([selectedGroup.value], (g: server.Group) => g.children) as server.Group[];

        result = result.filter(x => groups.some(y => y.id === x.groupId));
      }

      if (searchedValue.value) {
        result = result.filter(x => x.title?.includes(searchedValue.value) || x.description?.includes(searchedValue.value));
      }

      if (!simple.value) {
        result = result.filter(x => x.planType !== 'simple')
      }

      if (!fromIssue.value) {
        result = result.filter(x => x.planType !== 'fromIssues')
      }

      return result;
    })

    const actualview = computed(() => {
      const refType = props.refType ?? 'default';
      // return store.getters.crowdplanning.getFilterConfig().actualview[refType];
      return refType
    })

    watch(() => props.planId, onRouteChanged)
    watch(() => props.groupId, onRouteChanged)
    function onRouteChanged() {
      if (!plansGroupRoot.value?.id) return

      if (!plans.value || plans.value.length == 0) return

      if (props.planId) {
        selectedPlan.value = plans.value.find(x => x.id === props.planId) ?? null
        return
      }
      selectedPlan.value = null

      if (props.groupId) {
        selectedGroup.value = (flatten([plansGroupRoot.value], (g: server.Group) => g.children) as server.Group[]).find(x => x.id === props.groupId) ?? null;
        return
      }
      selectedGroup.value = null
    }

    onMounted(mounted)
    async function mounted() {
      if (await MessageService.Instance.ask('AM_I_LOGGEDIN')) {
        loggedIn.value = true
      } else {
        loggedIn.value = false
      }
      currentUser.value = await MessageService.Instance.ask("WHO_AM_I");

      await getData();

      MessageService.Instance.subscribe("OPEN_CROWDPLAN", openPlan);

      // Finding the map center
      Promise.all(filteredPlans.value.map(async m => {
        const res: locations.Feature = await MessageService.Instance.ask("GET_FEATURE_BYREF_PUBLIC", { relationType: "PLANS", relationId: m.id, workspaceId: m.workspaceId });
        return res?.shape;
      })).then(ss => {
        const geoms = ss.filter(s => !!s).map(s => {
          const geometry = geojsonToArcGIS(s);
          return geometry;
        });
        const center = union(geoms as __esri.Geometry[]).extent.center;
        mapCenter.value = [center.x, center.y];
      });
    }

    function beforeDestroy() {
      MessageService.Instance.unsubscribe("OPEN_CROWDPLAN", openPlan);
    }

    function openPlan(id: string) {
      const found = filteredPlans.value.find(p => p.id === id) ?? null;
      setSelectedPlan(found);
    }

    async function openAuthModal(): Promise<void> {
      await Projector.Instance.projectAsyncTo((() => import(/* webpackChunkName: "plansModal" */ '@/components/authModal/authModal.vue')) as never, {})
    }

    async function getData(): Promise<void> {
      workspaceId.value = (await MessageService.Instance.ask("MY_WORKSPACE") as { id: string })?.id ?? '';

      if (!workspaceId.value)
        workspaceId.value = (CONFIGURATION.domainWorkspaceMap as { [id: string]: string })[window.location.hostname] || "";

      if (!workspaceId.value) return;

      let allGroups = [];
      if (currentUser.value) {
        allGroups = await groupsService.getGroups();
      } else {
        allGroups = await groupsService.getPublicGroups(workspaceId.value);
      }

      plansGroupRoot.value = allGroups.find(x => !x.parentGroupId) ?? {} as server.Group;

      if (plansGroupRoot.value) {
        plansGroupRoot.value.children = allGroups.filter(x => x.parentGroupId === plansGroupRoot.value?.id);
      }

      const currentPlanId = props.planId;
      if (props.groupId) {
        const groups = flatten([plansGroupRoot.value], (g: server.Group) => g.children) as server.Group[];
        selectedGroup.value = groups.find(x => x.id === props.groupId) as (server.Group | null)
      }

      if (plansGroupRoot.value?.id) {
        if (currentUser.value) {
          await plansService.getPlans();
        } else {
          await plansService.getPublicPlans(workspaceId.value);
        }
      }

      if (currentPlanId) {
        selectedPlan.value = plans.value.find(x => x.id === currentPlanId) as (server.Plan | null)
      }

      states.value = await statesService.getStates(plansGroupRoot.value);

      loading.value = false;
    }

    function rootGroupChanged(group: server.Group): void {
      plansGroupRoot.value = group;
      componentKey.value++;
    }

    function hasPermission(permission: string): boolean {
      return can(`PLANS.${permission}`);
    }

    async function addPlan() {
      editable.value = {
        attachmentsIds: [],
        coverImageIds: {
          contentType: "",
          originalFileId: "",
          sharedToken: "",
        },
        creationDate: new Date(),
        description: "",
        group: selectedGroup.value ?? plansGroupRoot.value,
        groupId: "",
        id: null,
        isPublic: true,
        rolesCanRate: [],
        rolesCanSeeOthersComments: [],
        rolesCanSeeOthersRatings: [],
        rolesCanWriteComments: [],
        state: "",
        subPlanCount: 0,
        title: "",
        userId: "",
        username: "",
        visibleLayers: [],
        workspaceId: "",
        dueDate: undefined,
        lastUpdated: undefined,
        parentId: undefined,
        startDate: undefined,
        locationName: "",
        planType: "simple",
      }

      await Projector.Instance.projectAsyncTo((() => import(/* webpackChunkName: "planWizard" */ '@/components/planWizard/planWizard.vue')) as never, editable.value)
    }

    function edit(value: server.Plan | null) {
      editable.value = value
      const ep = editPlan.value
      editPlan.value = !ep
    }

    function changeViewMap(v: boolean) {
      // const tm = this.toggleMap
      toggleMap.value = v
    }

    function changeViewProj(v: boolean) {
      // const tp = this.toggleProj
      toggleProj.value = v
    }

    function noExpiredPrj() {
      expiredPrj.value = !expiredPrj.value
    }

    function noGroup(value: null) {
      selectedGroup.value = value
    }

    function setSelectedGroup(value: server.Group | null) {
      selectedGroup.value = value
    }

    const router = getCurrentInstance()!.proxy.$router
    watch(() => selectedGroup.value, selectedGroupChanged)
    function selectedGroupChanged() {
      if (selectedGroup.value) {
        router.push({ name: router.currentRoute.name!, params: { groupId: selectedGroup.value.id } })
      } else {
        router.push({ name: router.currentRoute.name! })
      }
    }

    watch(() => selectedPlan.value, selectedPlanChanged)
    function selectedPlanChanged() {
      if (selectedPlan.value) {
        router.push({ name: router.currentRoute.name!, params: { groupId: selectedPlan.value.groupId, planId: selectedPlan.value.id! } })
      } else {
        router.push({ name: router.currentRoute.name! })
      }
    }

    function setSelectedPlan(value: server.Plan | null) {
      selectedPlan.value = value
    }

    function goBack() {
      selectedPlan.value = null;
      addPlanSec.value = false;
      editPlan.value = false;
    }

    function toggleMenu() {
      noGroups.value = !noGroups.value;
    }

    const flatten = <T>(items: T[], extractChildren: (item: T) => T[]): T[] => Array.prototype.concat.apply(
      items,
      items.map(x => flatten(extractChildren(x) || [], extractChildren))
    );

    function changeViewSimple() {
      simple.value = !simple.value
    }

    function changeViewFromIssue() {
      fromIssue.value = !fromIssue.value
    }

    return {
      selectedPlan,
      selectedGroup,
      plansGroupRoot,
      currentUser,
      states,
      loading,
      workspaceId,
      mapCenter,
      componentKey,
      loggedIn,
      searchedValue,
      plans,
      filteredPlans,
      simple,
      fromIssue,
      addPlanSec,
      editPlan,
      editable,
      toggleMap,
      toggleProj,
      expiredPrj,
      noGroups,
      beforeDestroy,
      openPlan,
      openAuthModal,
      rootGroupChanged,
      hasPermission,
      addPlan,
      edit,
      changeViewMap,
      changeViewProj,
      noExpiredPrj,
      noGroup,
      setSelectedGroup,
      goBack,
      toggleMenu,
      changeViewFromIssue,
      changeViewSimple,
      setSelectedPlan,
    }
  }
})