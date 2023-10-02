import Component from "vue-class-component";
import Vue from "vue";
import { Prop } from "vue-property-decorator";
import groupModal from "@/components/groupModal/groupModal.vue";
import { Projector } from "vue-mf-module";
import { Icon } from "@/utility/Icon";

@Component
export default class CrowdplanningGroupsItem extends Vue {
    @Prop({ required: true })
    value!: server.Group;

    @Prop({ required: true })
    selectedCategory!: server.Group | null;

    get iconCode(): string {
        return Icon.getIconCode(this.value.iconCode);
    }

    public hasPermission(value: string): boolean {
        return this.$can(`PLANS.${value}`);
    }

    public async edit(): Promise<void> {
        const updatedGroup = await Projector.Instance.projectAsyncTo(groupModal as never, this.value);
        
        if (updatedGroup) {
            this.$emit("changedGroup", updatedGroup);
        }
    }

    setSelectedCategory() {
        this.$emit('selectedCategory', this.selectedCategory)
    }

}