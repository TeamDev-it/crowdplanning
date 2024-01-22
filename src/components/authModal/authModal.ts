import Component from "vue-class-component";
import Vue from 'vue';
import SpidLogin from "../spidLogin/spidLogin.vue";
import { IProjectableModel } from "vue-mf-module";
import { Prop } from "vue-property-decorator";

@Component({
  components: {
    SpidLogin
  }
})
export default class AuthModal extends Vue {
  @Prop()
  value!: IProjectableModel<unknown>;

  close(): void {
    try {
      this.value?.reject();
    } catch (_) {
      //
    }
  }
}
