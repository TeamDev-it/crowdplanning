import Component from "vue-class-component";
import Vue from "vue";
import { MessageService } from "vue-mf-module";
import { Prop } from "vue-property-decorator";

@Component({})
export default class SpidLogin extends Vue {
    @Prop({default: true})
    showText!: boolean;

    askLogin(): void {
        MessageService.Instance.send("ASK_LOGIN");
    }
}