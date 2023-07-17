import Component from "vue-class-component";
import Vue from "vue";
import { Prop } from "vue-property-decorator";
import { CONFIGURATION } from "@/configuration";
import { store } from "@/store";
import { MessageService } from "vue-mf-module";
import moment from "moment";
import { Icon } from "@/utility/Icon";

@Component({
    components: {}
})
export default class TaskSummary extends Vue {
    @Prop()
    plan!: server.Plan;

    @Prop({ required: true })
    workspaceId!: string;

    group: server.Group | null = null;
    addressLocation: string = '';

    public async mounted(): Promise<void> {
        this.group = store.getters.crowdplanning.getGroupById(this.plan.groupId);

        if (this.plan.location)
            this.addressLocation = await MessageService.Instance.ask("LOCATION_TO_ADDRESS", this.plan.location);
    }

    iconCode(iconCode: string): string {
        return Icon.getIconCode(iconCode);
    }

    get formattedDate(): string {
        return moment(this.plan.dueDate).format('D/MM/YYYY');
    }
}