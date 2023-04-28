import Component from "vue-class-component";
import Vue from "vue";
import { MessageService } from "vue-mf-module";
import SpidLogin from "../spidLogin/spidLogin.vue";

@Component({
    components: {
        SpidLogin
    }
})
export default class CitizenInteraction extends Vue {
    mySelf: server.Myself | null = null;

    public async mounted() {
        this.mySelf = await MessageService.Instance.ask("WHO_AM_I");
    }
}