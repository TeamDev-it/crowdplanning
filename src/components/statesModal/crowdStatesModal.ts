import { computed, defineComponent, getCurrentInstance, onMounted, PropType, ref } from "vue";

import { IProjectableModel, Projector } from "vue-mf-module/dist/helpers/Projector";

import ValidateDirective, { MessageService } from 'vue-mf-module';
import { statesService } from "@/services/statesService";
import { Drag, Drop } from 'vue-drag-drop';
import { store } from "@/store";
import { directive } from "vue/types/umd";



export default defineComponent({
  name: "crowdStatesModal",
  props: {
    value: {
      type: Object as PropType<IProjectableModel<server.Group>>,
      required: true
    }
  },
  components: { Drag, Drop },
  setup(props, { emit }) {
    
    const states = ref<server.State[]>([]);

    const t = getCurrentInstance()!.proxy.$root.$t

    const sortedStates = computed(() => {
      return Array.from(states.value).sort((a, b) => a.orderIndex - b.orderIndex);
    })
  
    onMounted(mounted);
    async function mounted() {
      states.value = Array.from(await statesService.getStates(props.value.data));
    }
  
    function handleDrop(to: server.State, from: server.State) {
      states.value.splice(states.value.indexOf(from), 1);
      states.value.splice(states.value.indexOf(to), 0, from);
      recalcIndex();
    }
  
    function handleDropState(state: string, from: server.State) {
      if (state != from.generalStatus)
        from.generalStatus = state;
    }
  
    function recalcIndex() {
      for (let index = 0; index < states.value.length; index++) {
        const element = states.value[index];
        switch (element.generalStatus) {
          case 'New': element.orderIndex = 100 + index + 1; break;
          case 'Open': element.orderIndex = 200 + index + 1; break;
          case 'Active': element.orderIndex = 300 + index + 1; break;
          case 'Review': element.orderIndex = 400 + index + 1; break;
          case 'Closed': element.orderIndex = 500 + index + 1; break;
        }
      }
    }
  
    function close() {
      props.value.resolve(props.value.data)
    }
  
    async function confirm() {
  
      if (states.value.some(s => !s.name || !s.shortName)) {
        MessageService.Instance.send("ERROR", t("states.set-error", "Riempire tutti i campi"));
        return;
      }
  
      for (const state of Array.from(states.value)) {
        await statesService.setState(state, props.value.data.id);
      }
  
      props.value.resolve(props.value.data);
    }
  
    async function remove(s: server.State) {
      var idx = states.value.indexOf(s);
      if (idx >= 0)
        states.value.splice(idx, 1);
  
      if (s.id) {
        await statesService.removeState(s.id);
        store.actions.crowdplanning.setStates({ groupId: props.value.data.id, states: states.value });
      }
    }
  
    async function addState(s: string) {
      states.value.push({
        generalStatus: s,    
        reference: props.value.data.reference
      } as unknown as server.State);
      recalcIndex();
    }
    
    return {
      states,
      sortedStates,
      handleDrop,
      handleDropState,
      confirm,
      addState,
      remove,
      close,
    }
  }
})