import { groupsService } from "@/services/groupsService";
import { store } from "@/store";
import { computed, defineComponent, onMounted, onUnmounted, PropType, Ref, ref } from "vue";

import { MessageService } from "vue-mf-module";


export default defineComponent({
  name: 'statusButton',
  props: {
    value: {
      type: String ,
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
    currentUser: {
      type: Object as PropType<server.Myself>
    }
  },
  setup(props, { emit }) {


    const plansGroupRoot = ref<server.Group>({} as server.Group);
    const listOpened = ref<boolean>(false);
    const groupOpened = ref<boolean>(false);
    const workspaceId = ref<string>("");
    const statusName = ref<string>("");
    const states = ref<server.State[]>([]);

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
      MessageService.Instance.subscribe("closepopups", () => listOpened.value = false);
      statusName.value = props.value as unknown as string;
      let allGroups = [];

      allGroups = await groupsService.getGroups();

      plansGroupRoot.value = allGroups.find(x => !x.parentGroupId) ?? {} as server.Group;

      if (plansGroupRoot.value) {
        states.value = Array.from(store.getters.crowdplanning.getStates(plansGroupRoot.value.id) || []);
      }

      states.value.sort((a, b) => a.id - b.id);
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

    function toggleOpened() {
      if (props.readonly) return;
      MessageService.Instance.send("closepopups");
      listOpened.value = !listOpened.value;
    }

    function openList() {
      if (props.readonly) return;
      MessageService.Instance.send("closepopups");
      listOpened.value = true;
      MessageService.Instance.subscribe("closepopups", () => closeList());
      MessageService.Instance.subscribe("DOCUMENT_CLICKED", () => closeList());
    }

    function closeList() {
      listOpened.value = false
      MessageService.Instance.unsubscribe("closepopups");
      MessageService.Instance.unsubscribe("DOCUMENT_CLICKED");
    }

    function emitState(val: string) {
      emit("input", val)
      listOpened.value = false
    }

    onUnmounted(unmounted)
    function unmounted() {
      MessageService.Instance.unsubscribe("closepopups");
    }


    return {
      plansGroupRoot,
      listOpened,
      groupOpened,
      workspaceId,
      statusName,
      states,
      horizontalPosition,
      topPosition,
      width,
      buildTree,
      toggleOpened,
      emitState,
      openList,
      closeList
    }
  }
})