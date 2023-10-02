import Component from "vue-class-component";
import Vue from "vue";
import { Prop } from "vue-property-decorator";
import { store } from "@/store";
import { CONFIGURATION } from "@/configuration";
import { Icon } from "@/utility/Icon";
import { CommonRegistry, MessageService } from "vue-mf-module";
import { Shared } from "@/utility/Shared";
@Component
export default class TaskCard extends Vue {
    @Prop()
    value!: server.Plan;

    @Prop({ default: true })
    showCommands!: boolean;

    @Prop({required: true})
    selectedTask!: server.Plan

    coverImage: string | null = null;
    loading = true;
    group: server.Group | null = null;



    get iconCode(): string {
        return Icon.getIconCode(this.group?.iconCode ?? '');
    }

    get imagePreview() {
        return CommonRegistry.Instance.getComponent("image-preview")
    }

    async mounted() {
        if (this.value.coverImageIds?.sharedToken)
            this.coverImage = await Shared.getShared(this.value.coverImageIds.sharedToken);

        this.group = store.getters.crowdplanning.getGroupById(this.value.groupId);

        this.loading = false;
    }

    selectPlan() {
        this.$emit('selectPlan', this.value)
    }

     get CoverImage(): string | null {
        if (!this.coverImage) return '';
        return Shared.imageFromString(this.coverImage);
    }
}