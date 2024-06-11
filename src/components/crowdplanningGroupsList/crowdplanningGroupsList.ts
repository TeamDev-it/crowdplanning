import { computed, defineComponent, getCurrentInstance, onMounted, onUnmounted, PropType } from 'vue';
import CrowdplanningGroupsItem from "../crowdplanningGroupsItem/crowdplanningGroupsItem.vue";
import { MessageService, Projector } from "vue-mf-module";
import groupModal from "@/components/groupModal/groupModal.vue";

export default defineComponent({
  name: 'crowdplanningGroupList',
  props: {
    value: {
      type: Object as PropType<server.Group[] | null>,
  },
  selectedCategory: {
    type: Object as PropType<server.Group>,
  },
  rootGroup: {
    type: Object as PropType<server.Group>,
  },
},
components: {
  CrowdplanningGroupsItem
},
setup(props, { emit }) {

  const groups = computed<server.Group[]>(() => {
    return props.rootGroup?.children ?? [];
  })

  const can = getCurrentInstance()!.proxy.$root.$can;
  const t = getCurrentInstance()!.proxy.$root.$t;
  
  onMounted(mounted)
  function mounted() {
    MessageService.Instance.subscribe('CHANGED_GROUP', (id: string) => {
      emit("rootGroupChanged", props.rootGroup);
    })
  }   

  onUnmounted(unmounted)
  function unmounted() {
    MessageService.Instance.unsubscribe('CHANGED_GROUP');
  }

  function setNullCategory() {
    emit('selectedNoCategory')
  }

  function setSelectedCategory(value: server.Group[]) {
    emit('selectedCategory', value)
  }

  function openStatesModal(): void {
    MessageService.Instance.send("OPEN_PLANS_STATES_MODAL", props.rootGroup);
  }

  function hasPermission(permission: string): boolean {
    return can(`PLANS.${permission}`);
  }

  function changedGroup(group: server.Group) {
    const idxChildrenGroup = props.rootGroup!.children.findIndex((x) => x.id === group.id);

    if (idxChildrenGroup !== -1) {
      if ((group as any).deleted) {
        props.rootGroup!.children.splice(idxChildrenGroup, 1);
      } else {
        props.rootGroup!.children[idxChildrenGroup] = group;
      }
    } else {
      props.rootGroup!.children.push(group);
    }

    emit("rootGroupChanged", props.rootGroup);
  }

  async function createGroup(): Promise<void> {
    const g = {} as server.Group;

    g.parentGroupId = props.rootGroup?.id ?? "";

    if (!props.rootGroup || !props.rootGroup.id) return;

    const result = await Projector.Instance.projectAsyncTo(groupModal as never, g);

    if (result) {
      changedGroup(result);
    } else {
      // error message
      MessageService.Instance.send('ERROR', t("plans.crowdplanning.group-create-error", "Errore durante la creazione della categoria"));
    }
  }

  return {
    groups,
    setNullCategory,
    setSelectedCategory,
    openStatesModal,
    hasPermission,
    createGroup,
    changedGroup
  }
}
})