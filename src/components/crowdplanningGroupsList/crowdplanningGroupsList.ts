import Component from "vue-class-component";
import Vue from 'vue';
import { Prop } from "vue-property-decorator";
import CrowdplanningGroupsItem from "../crowdplanningGroupsItem/crowdplanningGroupsItem.vue";
import { MessageService, Projector } from "vue-mf-module";
import groupModal from "@/components/groupModal/groupModal.vue";
import { CONFIGURATION } from "@/configuration";
import { groupsService } from "@/services/groupsService";


@Component({
  components: {
    CrowdplanningGroupsItem
  }
})
export default class CrowdplanningGroupList extends Vue {
  states: server.State[] = [];
  loading = true;

  @Prop({ required: true })
  selectedCategory!: server.Group[] | null;

  @Prop({ required: true })
  rootGroup: server.Group | null = null;

  mounted() {
    MessageService.Instance.subscribe('CHANGED_GROUP', (id: string) => {
      this.$emit("rootGroupChanged", this.rootGroup);
    })
  }

  unmounted() {
    MessageService.Instance.unsubscribe('CHANGED_GROUP');
  }

  setNullCategory() {
    this.$emit('selectedNoCategory')
  }

  setSelectedCategory(value: server.Group[]) {
    this.$emit('selectedCategory', value)
  }

  get groups(): server.Group[] {
    return this.rootGroup?.children ?? [];
  }

  openStatesModal(): void {
    MessageService.Instance.send("OPEN_PLANS_STATES_MODAL", this.rootGroup);
  }

  // public hasPermission(value: string): boolean {
  //     return this.$can(`PLANS.${value}`);
  // }

  hasPermission(permission: string): boolean {
    return this.$can(`${CONFIGURATION.context}.${permission}`);
  }

  changedGroup(group: server.Group) {
    const idxChildrenGroup = this.rootGroup!.children.findIndex((x) => x.id === group.id);

    if (idxChildrenGroup !== -1) {
      if ((group as any).deleted) {
        this.rootGroup!.children.splice(idxChildrenGroup, 1);
      } else {
        this.rootGroup!.children[idxChildrenGroup] = group;
      }
    } else {
      this.rootGroup!.children.push(group);
    }

    this.$emit("rootGroupChanged", this.rootGroup);
  }

  // private async openAuthModal(): Promise<void> {
  //     await Projector.Instance.projectAsyncTo((() => import(/* webpackChunkName: "plansModal" */ '@/components/authModal/authModal.vue')) as any, {})
  // }



  async createGroup(): Promise<void> {
    const g = {} as server.Group;

    g.parentGroupId = this.rootGroup?.id ?? "";

    if (!this.rootGroup || !this.rootGroup.id) return;

    const result = await Projector.Instance.projectAsyncTo(groupModal as never, g);

    if (result) {
      this.changedGroup(result);
    } else {
      // error message
      MessageService.Instance.send('ERROR', this.$t("plans.crowdplanning.group-create-error", "Errore durante la creazione della categoria"));
    }
  }
}
