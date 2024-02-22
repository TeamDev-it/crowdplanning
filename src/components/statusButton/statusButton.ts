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
  currentUser: server.Myself | null = null;

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
    if (this.currentUser) {
      allGroups = await groupsService.getGroups();

    } else {
      allGroups = await groupsService.getPublicGroups(this.workspaceId);
    }

    this.plansGroupRoot = allGroups.find(x => !x.parentGroupId) ?? {} as server.Group;

    if (this.plansGroupRoot) {
      this.states = Array.from(store.getters.crowdplanning.getStates(this.plansGroupRoot.id) || []);
    }
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


  // get Children() {
  //   return this.plansGroupRoot.children.reduce((list, i) => { list.push(i, ...i.children); return list; }, [] as server.Group[])
  //     .filter(a => !a.default)
  //     .sort((a, b) => a.name.toUpperCase().localeCompare(b.name.toUpperCase()));
  // }

  // get Value() {
  //   if (!this.value.groupId && this.disableRoot)
  //     return this.Children[0];

  //   var groups = this.plansGroupRoot.children.reduce((list, i) => { list.push(i, ...i.children); return list; }, [] as server.Group[])

  //   return groups.find(g => g.id == this.value.groupId) || this.plansGroupRoot;
  // }

  // set Value(v: server.Group) {
  //   if (this.readonly) return;
  //   if (v == null) {
  //     this.value.group = this.plansGroupRoot;
  //     this.value.groupId = this.plansGroupRoot.id;
  //   }
  //   else {
  //     this.value.group = v;
  //     this.value.groupId = v.id;
  //   }
  // }

  // @Watch('value.groupId')
  // onGroupChanged(n, o) {
  //   if (n && n != o) {
  //     if (this.plansGroupRoot != null || this.value.groupId != this.plansGroupRoot.parentGroupId) {
  //       this.value.group.id != this.value.groupId;
  //     }
  //   }
  // }

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
    // if (this.listOpened)
    // setTimeout(() => { this.listOpened = false; }, 5000);
  }



  emitState(val: string) {
    //  console.log(this.value, 'PROVAMOCEccececece')
    this.$emit("stateChanged", val)
  }

}