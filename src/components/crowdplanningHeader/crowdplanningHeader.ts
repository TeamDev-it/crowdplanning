import Component from "vue-class-component";
import Vue from "vue";
import { Prop } from "vue-property-decorator";

@Component({})
export default class CrowdplanningHeader extends Vue {
    @Prop()
    group!: server.Group;

    hasPermission(permission: string): boolean {
        return this.$can(`${this.group.taskType}.${permission}`);
    }

    async addTask(): Promise<void> {
        this.$emit("addTask");
    }
}