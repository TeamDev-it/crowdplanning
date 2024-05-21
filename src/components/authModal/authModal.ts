import { defineComponent, PropType } from 'vue';
import SpidLogin from "../spidLogin/spidLogin.vue";
import { IProjectableModel } from "vue-mf-module";

export default defineComponent({
  name: "AuthModal",
  props: {
    value: {
      type: Object as PropType<IProjectableModel<unknown>>,
    }
  },
  components: {
    SpidLogin
  },
  setup(props) {

    function close() {
      try {
        props.value?.reject();
      } catch (_) {
        //
      }
    }

    return {
      close
    }
  }
})

