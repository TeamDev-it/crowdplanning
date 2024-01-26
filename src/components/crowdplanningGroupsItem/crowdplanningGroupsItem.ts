import Component from "vue-class-component";
import Vue from "vue";
import { Prop } from "vue-property-decorator";
import groupModal from "@/components/groupModal/groupModal.vue";
import { MessageService, Projector } from "vue-mf-module";
import { Icon } from "@/utility/Icon";

@Component
export default class CrowdplanningGroupsItem extends Vue {
  @Prop({ required: true })
  value!: server.Group;

  @Prop({ required: true })
  selectedCategory!: server.Group | null;

  @Prop()
  idx!: number 

  get iconCode(): string {
    return Icon.getIconCode(this.value.iconCode);
  }

  public hasPermission(value: string): boolean {
    return this.$can(`PLANS.${value}`);
  }

  public async edit(): Promise<void> {
    const updatedGroup = await Projector.Instance.projectAsyncTo(groupModal as never, this.value);

    if (updatedGroup) {
      this.$emit("changedGroup", updatedGroup);
    }
  }

  setSelectedCategory(value: server.Group) {
    this.$emit('selectedCategory', value)
  }

  async addSubGroup(): Promise<void> {
    const g = {} as server.Group;

    g.parentGroupId = this.value.id;

    // if (!this.rootGroup || !this.rootGroup.id) return;

    const result = await Projector.Instance.projectAsyncTo(groupModal as never, g);
    

    if (result) {
      this.changedGroup(result);
    } else {
      // error message
      MessageService.Instance.send('ERROR', this.$t("plans.crowdplanning.group-create-error", "Errore durante la creazione della categoria"));
    }
  }

  public changedGroup(group: server.Group) {
    const idxChildrenGroup: number = this.idx++ as number;
    debugger

    if (idxChildrenGroup !== -1) {
      if ((group as any).deleted) {
        this.value.children.splice(idxChildrenGroup, 1);
      } else {
        this.value.children[idxChildrenGroup] = group;
      }
    } else {
      this.value.children.push(group);
    }

    this.$emit("rootGroup", this.value);
  }
}
