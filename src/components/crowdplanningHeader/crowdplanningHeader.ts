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

  seeMap: boolean = true
  showListOpened: boolean = false
  expiredPrj: boolean = true

  get searchedValue(): string {
    return store.getters.crowdplanning.getSearchedValue();
  }
  set searchedValue(value: string) {
    store.actions.crowdplanning.setSearchedValue(value);
  }

  @Watch("seeMap")
  changeView() {
    this.$emit("changeView")
  }

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

  noGroups: boolean = false
  toggleMenu() {
    let nG = this.noGroups
    this.noGroups = !nG
    this.$emit('toggleMenu')
  }
}
