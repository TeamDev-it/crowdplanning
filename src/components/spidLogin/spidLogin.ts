import { defineComponent } from "vue";
import { MessageService } from "vue-mf-module";

export default defineComponent({
  name: "SpidLogin",
  props: {
    showText: {
      type: Boolean,
      default: true
    }
  },
  setup(props) {

    function askLogin(): void {
      MessageService.Instance.send("ASK_LOGIN");
    }

    return {
      askLogin
    }
  }
})
