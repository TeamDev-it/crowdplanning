import { groupsService } from "@/services/groupsService";
import { plansService } from "@/services/plansService";
import { computed, defineComponent, onMounted, onUnmounted, PropType, Ref, ref, watch } from "vue";
import { MessageService } from "vue-mf-module";

export default defineComponent({
  name: 'groupButton',
  props: {
    value: { 
      type: Object as PropType<server.Group>,
      required: false
    },
    readonly: { 
      type: Boolean, 
      default: false 
    },
    showAsSelect: { 
      type: Boolean, 
      default: false
    },
    disableRoot: { 
      type: Boolean, 
      default: false 
    },
    // currentUser: {
    //   type: Object as PropType<server.Myself>
    // }
  },
  setup(props, { emit }) {
    
    const plansGroupRoot = ref<server.Group>({} as server.Group) 
    const listOpened = ref<boolean>(false);
    const groupOpened = ref<boolean>(false);
    const workspaceId = ref<string>("");

    const Children = computed(() => {
      return plansGroupRoot.value.children.reduce((list, i) => { list.push(i, ...i.children); return list; }, [] as server.Group[])
        .filter(a => !a.default)
        .sort((a, b) => a.name.toUpperCase().localeCompare(b.name.toUpperCase()));
    })

    const el = ref(null) as unknown as Ref<HTMLElement>;

    const horizontalPosition = computed(() => {
      var bb = el.value.getBoundingClientRect();
      return bb.x;
    })
  
    const topPosition = computed(() => {
      var bb = el.value.getBoundingClientRect();
      return window.innerHeight - bb.y - bb.height < 300 ? bb.y - (plansGroupRoot.value.children.length + 1) * 40 - 10 : bb.y + bb.height;
    })
  
    const width = computed(() => {
      var bb = el.value.getBoundingClientRect();
      return bb.width;
    })

    onMounted(mounted)
    async function mounted() {
      MessageService.Instance.subscribe("closeCrowdPopup", () => listOpened.value = false)
      let allGroups = [];
  
      allGroups = await groupsService.getGroups();
  
      plansGroupRoot.value = allGroups.find(x => !x.parentGroupId) ?? {} as server.Group;
  
      if (plansGroupRoot.value) {
        // x.parentGroupId === this.plansGroupRoot?.id  (trova tutti i gruppi principali)
        // x.parentGroupId !== null  (trova tutti i gruppi (principali e figli))
        // x.parentGroupId !== this.plansGroupRoot?.id (trova solo gruppi figli e PLANS)
        plansGroupRoot.value.children = buildTree(allGroups.filter(x => x.parentGroupId !== null));
      }
  
      if (plansGroupRoot.value?.id) {
        await plansService.getPlans();
      }
    }
  
    onUnmounted(unmounted)
    function unmounted() {
      MessageService.Instance.unsubscribe("closeCrowdPopup");
    }
  
    function buildTree(objects: server.Group[]): server.Group[] {
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

    function toggleGroup() {
      groupOpened.value = !groupOpened.value;
    }
  
    function toggleOpened() {
      if (props.readonly) return;
      MessageService.Instance.send("closeCrowdPopup");
      listOpened.value = !listOpened.value;
    }

    function openList() {
      if (props.readonly) return;
      MessageService.Instance.send("closeCrowdPopup");
      listOpened.value = true;
      MessageService.Instance.subscribe("closeCrowdPopup", () => closeList());
    }

    function closeList() {
      listOpened.value = false
      MessageService.Instance.unsubscribe("closeCrowdPopup");
    }
  
    // watch(() => props.value, emitGroup)
    function emitGroup(val: server.Group) {
      emit("input", val)
      listOpened.value = false
    }
  
    
    return {
      plansGroupRoot,
      listOpened,
      groupOpened,
      workspaceId,
      Children,
      horizontalPosition,
      topPosition,
      width,
      toggleOpened,
      toggleGroup,
      emitGroup,
      openList,
      closeList
    }
  }
})