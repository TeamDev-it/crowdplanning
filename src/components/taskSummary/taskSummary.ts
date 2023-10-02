import Component from "vue-class-component";
import Vue from "vue";
import { Prop } from "vue-property-decorator";
import { CONFIGURATION } from "@/configuration";
import { store } from "@/store";
import { MessageService } from "vue-mf-module";
import moment from "moment";
import { Icon } from "@/utility/Icon";
import { Shared } from "@/utility/Shared";

@Component({
    components: {}
})
export default class TaskSummary extends Vue {
    @Prop()
    likes: number = 0;

    @Prop()
    plan!: server.Plan;

    @Prop({ required: true })
    workspaceId!: string;

    group: server.Group | null = null;
    coverImage: string | null = null;

    public async mounted(): Promise<void> {        
        if (this.plan.coverImageIds?.sharedToken)
            this.coverImage = await Shared.getShared(this.plan.coverImageIds.sharedToken);

        this.group = store.getters.crowdplanning.getGroupById(this.plan.groupId);
    }

    iconCode(iconCode: string): string {
        return Icon.getIconCode(iconCode);
    }

    get CoverImage(): string | null {
        if (!this.coverImage) return null;

        return Shared.imageFromString(this.coverImage);
    }

    get formattedDate(): string {
        return moment(this.plan.dueDate).format('D/MM/YYYY');
    }
}