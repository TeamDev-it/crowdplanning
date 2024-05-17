import { defineComponent, PropType } from 'vue';
import { IProjectableModel } from "vue-mf-module";

export default defineComponent({
  name: "loginModal",
  props: {
    value: {
      type: Object as PropType<IProjectableModel<unknown>>,
      required: true
    }
  },
  setup(props) {
    
    function close() {
      try {
        props.value.reject();
      } catch (_) {
        //
      }
    }
    
    return {
      close
    }
  }
})