import Component from "vue-class-component";
import Vue from "vue";
import { CommonRegistry, MessageService } from "vue-mf-module";
import SpidLogin from "../spidLogin/spidLogin.vue";
import { Prop } from "vue-property-decorator";

@Component({
    components: {
        SpidLogin
    }
})
export default class CitizenInteraction extends Vue {
    @Prop({required: true})
    id!: string;

    @Prop({required: true})
    type!: string;

    mySelf: server.Myself | null = null;

    public async mounted() {
        this.mySelf = await MessageService.Instance.ask("WHO_AM_I");
    }

    get ratingComponent() {
        return CommonRegistry.Instance.getComponent("rating-star");
    }
}