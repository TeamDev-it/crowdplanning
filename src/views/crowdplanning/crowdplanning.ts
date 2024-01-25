import Vue from "vue";
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
import { cloneDeep, uniqueId } from "lodash";
import PlanWizard from "@/components/planWizard/planWizard";


@Component({
  components: {
    CrowdplanningHeader,
    ScrollableContainer,
    CrowdplanningGroupList,
    PlanList,
    PlanModal,
    PlanMap,
    PlanDetail
  },
  name: "crowdplanning-component"
})
export default class Crowdplanning extends Vue {
  selectedPlan: server.Plan | null = null;
  selectedGroup: server.Group | null = null;
  plansGroupRoot: server.Group = {} as server.Group;
  currentUser: server.Myself | null = null;
  states: server.State[] = [];
  loading = true;
  workspaceId = "";

  value!: server.Plan;

  componentKey = 0;

  get searchedValue(): string {
    return store.state.crowdplanning.searchedValue
  }

  get plans(): server.Plan[] {
    return store.getters.crowdplanning.getPlans();
  }

  get mapCenter() {
    // FIXME: the correct way should be to calculate all location centroid and use it
    const locations = this.filteredPlans
      .filter(p => p.location)
      .map(p => ({ latitude: p.location?.latitude, longitude: p.location?.longitude }));

    if (locations.length)
      return [locations[0].longitude, locations[0].latitude];
    else
      return null;
  }


  async mounted() {
    this.currentUser = await MessageService.Instance.ask("WHO_AM_I");

    if (!this.currentUser)
      this.openAuthModal();

    await this.getData();
  }

  private async openAuthModal(): Promise<void> {
    await Projector.Instance.projectAsyncTo((() => import(/* webpackChunkName: "plansModal" */ '@/components/authModal/authModal.vue')) as never, {})
  }

  private async getData(): Promise<void> {
    this.workspaceId = (await MessageService.Instance.ask("MY_WORKSPACE") as { id: string })?.id ?? '';

    if (!this.workspaceId)
      this.workspaceId = (CONFIGURATION.domainWorkspaceMap as Map<string, string>).get(window.location.hostname) || "";

    if (!this.workspaceId) return;

    let allGroups = [];
    if (this.currentUser) {
      allGroups = await groupsService.getGroups();
    } else {
      allGroups = await groupsService.getPublicGroups(this.workspaceId);
    }

    this.plansGroupRoot = allGroups.find(x => !x.parentGroupId) ?? {} as server.Group;

    if (this.plansGroupRoot) {
      this.plansGroupRoot.children = allGroups.filter(x => x.parentGroupId === this.plansGroupRoot?.id);
    }

    if (this.plansGroupRoot?.id) {
      if (this.currentUser) {
        await plansService.getPlans();
      } else {
        await plansService.getPublicPlans(this.workspaceId);
      }
    }

    this.states = await statesService.getStates(this.plansGroupRoot);

    this.loading = false;
  }

  public rootGroupChanged(group: server.Group): void {
    this.plansGroupRoot = group;
    this.componentKey++;
  }

  hasPermission(permission: string): boolean {
    return this.$can(`${CONFIGURATION.context}.${permission}`);
  }


  addPlanSec: boolean = false
  async addPlan() {
    this.editable = {
      attachmentsIds: [],
      coverImageIds: {
        contentType: "",
        originalFileId: "",
        sharedToken: "",
      },
      creationDate: new Date(),
      description: "",
      group: this.selectedGroup ?? this.plansGroupRoot,
      groupId: "",
      id: null,
      isPublic: true,
      location: {
        altitude: 0,
        id: 0,
        latitude: 0,
        longitude: 0,
        relationId: "",
        relationType: "",
        wkid: 0,
      },
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
      planType: "simple" 
    }

    await Projector.Instance.projectAsyncTo((() => import(/* webpackChunkName: "planWizard" */ '@/components/planWizard/planWizard.vue')) as never, this.editable) 
    // let ap = this.addPlanSec
    // this.addPlanSec = !ap
  }

  editPlan: boolean = false
  editable!: server.Plan | null;
  edit(value: server.Plan | null) {
    this.editable = value
    const ep = this.editPlan
    this.editPlan = !ep
  }

  toggleMap: boolean = true
  changeView() {
    const tm = this.toggleMap
    this.toggleMap = !tm
  }

  expiredPrj: boolean = true
  noExpiredPrj() {
    const eP = this.expiredPrj
    this.expiredPrj = !eP
  }

  today: Date = new Date
  todayy = this.today.getDate

  get filteredPlans() {
    let result: server.Plan[] = cloneDeep(store.getters.crowdplanning.getPlans());

    if (this.selectedPlan) {
      return result.filter(x => x.id === this.selectedPlan?.id);
    }

    if (this.selectedGroup) {
      result = result.filter(x => x.groupId === this.selectedGroup?.id);
    }

    if (this.searchedValue) {
      result = result.filter(x => x.title?.includes(this.searchedValue) || x.description?.includes(this.searchedValue));
    }

    return result;
  }

  noGroup(value: null) {
    this.selectedGroup = value
  }

  setSelectedGroup(value: server.Group | null) {
    this.selectedGroup = value
  }

  setSelectedPlan(value: server.Plan | null) {
    this.selectedPlan = value
  }

  goBack() {
    this.selectedPlan = null;
    this.addPlanSec = false;
    this.editPlan = false;
  }



}
