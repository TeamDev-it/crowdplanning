import { groupsService } from "@/services/groupsService";
import { store } from "@/store";
import Vue from "vue";
import Component from "vue-class-component";
import { MessageService } from "vue-mf-module";
import { Prop } from "vue-property-decorator";

@Component({})
export default class StatusButton extends Vue {

  @Prop()
  value!: server.State;

  @Prop({ default: false })
  readonly?: boolean;

  @Prop({ default: false })
  showAsSelect?: boolean;

  @Prop({ default: false })
  disableRoot?: boolean;

  @Prop()
  currentUser!: server.Myself;

  plansGroupRoot: server.Group = {} as server.Group;
  listOpened: boolean = false;
  groupOpened: boolean = false;
  workspaceId = "";

  statusName = "";

  states: server.State[] = [];

  async mounted() {
    MessageService.Instance.subscribe("closeCrowdPopup", () => this.listOpened = false);
    this.statusName = this.value as unknown as string;
    let allGroups = [];
    
    allGroups = await groupsService.getGroups();

    this.plansGroupRoot = allGroups.find(x => !x.parentGroupId) ?? {} as server.Group;

    if (this.plansGroupRoot) {
      this.states = Array.from(store.getters.crowdplanning.getStates(this.plansGroupRoot.id) || []);
    }

    this.states.sort((a, b) => a.id - b.id);
  }



  buildTree(objects: server.Group[]): server.Group[] {
    const tree: server.Group[] = [];
    const objectMap: { [key: string]: server.Group } = {};

    objects.forEach(obj => {
      objectMap[obj.id] = obj;
      obj.children = [];
    });

    objects.forEach(obj => {
      if (obj.parentGroupId !== null && objectMap[obj.parentGroupId]) {
        objectMap[obj.parentGroupId].children.push(obj);
      } else {
        tree.push(obj);
      }
    });

    return tree;
  }

  get horizontalPosition() {
    var bb = this.$el.getBoundingClientRect();
    return bb.x;
  }

  get topPosition() {
    var bb = this.$el.getBoundingClientRect();
    return window.innerHeight - bb.y - bb.height < 300 ? bb.y - (this.plansGroupRoot.children.length + 1) * 40 - 10 : bb.y + bb.height;
  }

  get width() {
    var bb = this.$el.getBoundingClientRect();
    return bb.width;
  }

  toggleOpened() {
    if (this.readonly) return;
    let listButton = this.listOpened;
    MessageService.Instance.send("closeCrowdPopup");
    this.listOpened = !listButton;
  }

  emitState(val: string) {
    this.$emit("stateChanged", val)
  }

  unmounted() {
    MessageService.Instance.unsubscribe("closeCrowdPopup");
  }

}