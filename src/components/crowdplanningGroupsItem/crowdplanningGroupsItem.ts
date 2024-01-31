import Component from "vue-class-component";
import Vue from "vue";
import { Prop } from "vue-property-decorator";
import groupModal from "@/components/groupModal/groupModal.vue";
import { MessageService, Projector } from "vue-mf-module";
import { Icon } from "@/utility/Icon";
import { groupsService } from "@/services/groupsService";

@Component({
  name: 'crowdplanning-groups-item'
})
export default class CrowdplanningGroupsItem extends Vue {
  @Prop({ required: true })
  value!: server.Group;

  @Prop({ required: true })
  selectedCategory!: server.Group | null;

  @Prop({ default: 0 })
  treeLevel!: number

  children: server.Group[] = [];

  get iconCode(): string {
    return Icon.getIconCode(this.value.iconCode);
  }

  async mounted() {
    this.getChildren();
  }

  async getChildren() {
    this.children = await groupsService.getGroupChildren(this.value.id);
  }

  hasPermission(value: string): boolean {
    return this.$can(`PLANS.${value}`);
  }

  async edit(): Promise<void> {
    const updatedGroup = await Projector.Instance.projectAsyncTo(groupModal as never, this.value);

    if (updatedGroup) {
      this.$emit("changedGroup", updatedGroup);
    }
  }

  setSelectedCategory(item: server.Group) {
    this.$emit('selectedCategory', item)
  }

  async addSubGroup(): Promise<void> {
    const g = {} as server.Group;
    g.parentGroupId = this.value.id;
    const result = await Projector.Instance.projectAsyncTo(groupModal as never, g);

    if (result) {
      this.getChildren();
    } else {
      // error message
      MessageService.Instance.send('ERROR', this.$t("plans.crowdplanning.group-create-error", "Errore durante la creazione della categoria"));
    }
  }
}
