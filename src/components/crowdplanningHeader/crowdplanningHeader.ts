import Component from "vue-class-component";
import Vue from "vue";
import { store } from "@/store";
import { Prop, Watch } from "vue-property-decorator";
import { groupsService } from "@/services/groupsService";

@Component({})
export default class CrowdplanningHeader extends Vue {
  @Prop({})
  currentUser!: server.Myself | null;

  @Prop()
  group?: server.Group | null;
  noGroups: boolean = false;
  seeMap: boolean = true
  seeProjects: boolean = this.$route.query.hideProjects ? false : true
  showListOpened: boolean = false
  simple: boolean = true
  fromIssue: boolean = true
  visualListOpened: boolean = false
  expiredPrj: boolean = true

  get searchedValue(): string {
    return store.getters.crowdplanning.getSearchedValue();
  }
  set searchedValue(value: string) {
    store.actions.crowdplanning.setSearchedValue(value);
  }

  @Watch("seeProjects", { immediate: true })
  changeViewProj() {
    this.$emit("changeViewProj", this.seeProjects)
  }

  @Watch("seeMap", { immediate: true })
  changeViewMap() {
    this.$emit("changeViewMap", this.seeMap)
  }

  @Watch("fromIssue")
  changeViewFromIssue() {
    this.$emit("changeViewFromIssue")
  }

  @Watch("simple")
  changeViewSimple() {
    this.$emit("changeViewSimple")
  }

  mounted() {
    if (this.seeProjects)
      if (window.innerHeight < 800) {
        this.seeMap = false
      }

    window.addEventListener("resize", () => {
      if (this.seeProjects) {
        if (window.innerHeight < 800) {
          this.seeMap = false
        }
        if (window.innerHeight > 800) {
          this.seeMap = true
        }
      }
    });
  };

  unmounted() {
    window.removeEventListener("resize", () => { });
  };

  @Watch("expiredPrj")
  async noExpiredPrj() {
    this.$emit("expiredPrj");
  }

  hasPermission(permission: string): boolean {
    return this.$can(`PLANS.${permission}`);
  }

  async addPlan(): Promise<void> {
    this.$emit("addPlan");
  }

  toggleOpened() {
    let v = this.showListOpened;
    this.showListOpened = !v;
  }


  toggleMenu() {
    this.noGroups = !this.noGroups
    this.$emit('toggleMenu')
  }

  toggleOpened2() {
    let v = this.visualListOpened;
    this.visualListOpened = !v;
  }

  // filter: string = 'all' || 'simple' || 'fromIssues';
  // switchFilter() {
  //   if (this.filter === 'all') {
  //     this.filter = 'simple'
  //   } else if (this.filter === 'simple') {
  //     this.filter = 'fromIssues'
  //   } else {
  //     this.filter = 'all'
  //   }
  //   this.$emit('switchFilter', this.filter)
  // }
}
