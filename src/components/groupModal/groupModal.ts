import Vue, { defineComponent, PropType, ref } from 'vue';
import { IProjectableModel, MessageService } from "vue-mf-module";
import { groupsService } from "@/services/groupsService";

export default defineComponent({
  name: 'groupModal',
  props: {
    value: {
      type: Object as PropType<IProjectableModel<server.Group>>,
      required: true
    }
  },
  setup(props) {
    
    const copyValue = ref<server.Group>(structuredClone(props.value.data));
    const errors = ref<{ [id: string]: string }>({});

    function setError(id: string, value: unknown) {
      Vue.set(errors.value, id, value);
    }

    async function confirm(): Promise<void> {
      Object.assign(props.value.data, copyValue.value)
      if (props.value.data && !props.value.data.id) {
        const createdGroup = await groupsService.Set(props.value.data);
        if (createdGroup)
          props.value.resolve(createdGroup);
      } else {
        const updatedGroup = await groupsService.Set(props.value.data);
  
        if (updatedGroup)
          props.value.resolve(updatedGroup);
      }
  
      MessageService.Instance.send("CHANGED_GROUP")
    }

    function close(): void {
      try {
        props.value?.reject();
      } catch {
        // 
      }
      props.value.resolve(props.value.data);
    }

    async function deleteGroup(): Promise<void> {
    
      await groupsService.deleteGroup(props.value.data.id);
      Vue.set(props.value.data, 'deleted', true);
      props.value.resolve(props.value.data);
  
      MessageService.Instance.send("CHANGED_GROUP");
  
      try {
        props.value.resolve(props.value.data);
      } catch {
        //
      }
    }
  
    return {
      copyValue,
      errors,
      setError,
      confirm,
      close,
      deleteGroup
    }
  }
})