import Component from "vue-class-component";
import Vue from "vue";
import { MessageService } from "vue-mf-module";

@Component({})
export default class SpidLogin extends Vue {
    askLogin(): void {
        MessageService.Instance.send("ASK_LOGIN");
    }
}