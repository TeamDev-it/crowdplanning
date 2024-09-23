import { computed, defineComponent, getCurrentInstance, onMounted, PropType, ref } from "vue";
import groupModal from "@/components/groupModal/groupModal.vue";
import { MessageService, Projector } from "vue-mf-module";
import { Icon } from "@/utility/Icon";
import { groupsService } from "@/services/groupsService";

export default defineComponent({
  name: 'crowdplanningGroupsItem',
  props: {
    value: {
      type: Object as PropType<server.Group>,
      required: true
    },
    selectedCategory: {
      type: Object as PropType<server.Group>,
    },
    treeLevel: {
      type: Number,
      default: 0
    }
  },
  setup(props, { emit }) {
    
    const children = ref<server.Group[]>([])
    
    const iconCode = computed<string>(() => {
      return Icon.getIconCode(props.value.iconCode);
    })

    const can = getCurrentInstance()!.proxy.$root.$can;
    const t = getCurrentInstance()!.proxy.$root.$t;

    onMounted(mounted)
    async function mounted() {
      getChildren();
    }

    async function  getChildren() {
      props.value.children = await groupsService.getGroupChildren(props.value.id);
      children.value = props.value.children;
    }
  
    function hasPermission(value: string): boolean {
      return can(`PLANS.${value}`);
    }
  
    async function edit(): Promise<void> {
      await Projector.Instance.projectAsyncTo(groupModal as any, props.value);
    }
  
    function setSelectedCategory(item: server.Group) {
      emit('selectedCategory', item)
    }
  
    async function addSubGroup(): Promise<void> {
      const g = {} as server.Group;
      g.parentGroupId = props.value.id;
      g.iconCode = props.value.iconCode;
      const result = await Projector.Instance.projectAsyncTo(groupModal as any, g);
  
      if (result) {
        getChildren();
      } else {
        // error message
        MessageService.Instance.send('ERROR', t("plans.crowdplanning.group-create-error", "Errore durante la creazione della categoria"));
      }
    }

    return {
      children,
      iconCode,
      hasPermission,
      edit,
      setSelectedCategory,
      addSubGroup
    }
  }
})

