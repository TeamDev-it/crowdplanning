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
import { cloneDeep } from "lodash";
import { union } from "@arcgis/core/geometry/geometryEngine.js";
import { geojsonToArcGIS } from "@terraformer/arcgis";

import createRouter from "vue-router";
import createWebHistory from "vue-router";
import { Prop, Watch } from "vue-property-decorator";



// const router = new createRouter({
//   routes: [
//     {path: '/project', name: 'project', component: PlanModal}
//   ],
// });

@Component({
  components: {
    CrowdplanningHeader,
    ScrollableContainer,
    CrowdplanningGroupList,
    PlanList,
    PlanModal,
    PlanMap,
    PlanDetail,
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
  mapCenter: number[] | null = null;

  value!: server.Plan;

  componentKey = 0;

  @Prop({default: null})
  groupId?: string | null;

  @Prop({default: null})
  planId?: string | null;

  @Prop({ default: null })
  refType?: string;

  @Watch('planId')
  @Watch('groupId')
  onRouteChanged() {
    if (!this.plansGroupRoot?.id) return

    if (!this.plans || this.plans.length == 0) return
      
    if (this.planId) {
      this.selectedPlan = this.plans.find(x => x.id === this.planId) ?? null
      return
    } 
    this.selectedPlan = null
    
    if (this.groupId) {
      this.selectedGroup =  (this.flatten([this.plansGroupRoot], (g: server.Group) => g.children) as server.Group[]).find(x => x.id === this.groupId) ?? null;
      return
    }
    this.selectedGroup = null
  }

  get searchedValue(): string {
    return store.state.crowdplanning.searchedValue
  }

  get plans(): server.Plan[] {
    return store.getters.crowdplanning.getPlans();
  }

  async mounted() {
    this.currentUser = await MessageService.Instance.ask("WHO_AM_I");

    if (!this.currentUser)
      this.openAuthModal();

    await this.getData();

    MessageService.Instance.subscribe("OPEN_CROWDPLAN", this.openPlan, this);

    // Finding the map center
    Promise.all(this.filteredPlans.map(async m => {
      const res: locations.Feature = await MessageService.Instance.ask("GET_FEATURE_BYREF", { relationType: "PLANS", relationId: m.id });
      return res?.shape;
    })).then(ss => {
      const geoms = ss.filter(s => !!s).map(s => {
        const geometry = geojsonToArcGIS(s);
        return geometry;
      });

      const center = union(geoms as __esri.Geometry[]).extent.center;
      this.mapCenter = [center.x, center.y];
    });
  }

  beforeDestroy() {
    MessageService.Instance.unsubscribe("OPEN_CROWDPLAN", this.openPlan);
  }

  private openPlan(id: string) {
    const found = this.filteredPlans.find(p => p.id === id) ?? null;
    this.setSelectedPlan(found);
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

    const currentPlanId = this.planId;
    if (this.groupId) {
      const groups = this.flatten([this.plansGroupRoot], (g: server.Group) => g.children) as server.Group[];
      this.selectedGroup = groups.find(x => x.id === this.groupId) as (server.Group | null)
    }

    if (this.plansGroupRoot?.id) {
      if (this.currentUser) {
        await plansService.getPlans();
      } else {
        await plansService.getPublicPlans(this.workspaceId);
      }
    }

    if (currentPlanId) {
      this.selectedPlan = this.plans.find(x => x.id === currentPlanId) as (server.Plan | null)
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

    await Projector.Instance.projectAsyncTo((() => import(/* webpackChunkName: "planWizard" */ '@/components/planWizard/planWizard.vue')) as never, this.editable)

  }

  editPlan: boolean = false
  editable!: server.Plan | null;
  edit(value: server.Plan | null) {
    this.editable = value
    const ep = this.editPlan
    this.editPlan = !ep
  }

  toggleMap: boolean = true
  changeViewMap() {
    const tm = this.toggleMap
    this.toggleMap = !tm
  }

  toggleProj: boolean = true
  changeViewProj() {
    const tp = this.toggleProj
    this.toggleProj = !tp
  }

  expiredPrj: boolean = false
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

      const groups = this.flatten([this.selectedGroup], (g: server.Group) => g.children) as server.Group[];

      result = result.filter(x => groups.some(y => y.id === x.groupId));
    }

    if (this.searchedValue) {
      result = result.filter(x => x.title?.includes(this.searchedValue) || x.description?.includes(this.searchedValue));
    }

    if (!this.simple) {
      result = result.filter(x => x.planType !== 'simple')
    }

    if (!this.fromIssue) {
      result = result.filter(x => x.planType !== 'fromIssues')
    }

    return result;
  }

  noGroup(value: null) {
    this.selectedGroup = value
  }

  setSelectedGroup(value: server.Group | null) {
    this.selectedGroup = value
  }

  @Watch('selectedGroup')
  selectedGroupChanged() {
    if (this.selectedGroup) {
      this.groupId = this.selectedGroup.id
      this.$router.push({ name: 'crowdplanning', params: { groupId: this.selectedGroup.id } })
    } else {
      this.groupId = null
      this.$router.push({ name: 'crowdplanning' })
    }
  }

  @Watch('selectedPlan')
  selectedPlanChanged() {
    if (this.selectedPlan) {
      this.planId = this.selectedPlan.id
      this.$router.push({ name: 'crowdplanning', params: { groupId: this.selectedPlan.groupId, planId: this.selectedPlan.id } })
    } else {
      this.groupId = null
      this.planId = null
      this.$router.push({ name: 'crowdplanning' })
    }
  }

  setSelectedPlan(value: server.Plan | null) {
    this.selectedPlan = value
  }

  goBack() {
    this.selectedPlan = null;
    this.addPlanSec = false;
    this.editPlan = false;
  }

  noGroups: boolean = false
  toggleMenu() {
    let nG = this.noGroups
    this.noGroups = !nG
  }


  flatten = <T>(items: T[], extractChildren: (item: T) => T[]): T[] => Array.prototype.concat.apply(
    items,
    items.map(x => this.flatten(extractChildren(x) || [], extractChildren))
  );

  simple: boolean = true
  changeViewSimple() {
    const s = this.simple
    this.simple = !s
  }

  fromIssue: boolean = true
  changeViewFromIssue() {
    const fI= this.fromIssue
    this.fromIssue = !fI
  }

  get actualview() {
    const refType = this.refType ?? 'default';
    // return store.getters.crowdplanning.getFilterConfig().actualview[refType];
    return refType
  }
}
