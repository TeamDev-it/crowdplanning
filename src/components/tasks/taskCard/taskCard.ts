import Component from "vue-class-component";
import Vue from "vue";
import { Prop } from "vue-property-decorator";
import { store } from "@/store";

@Component
export default class TaskCard extends Vue {
    @Prop()
    value!: server.Task;

    @Prop({ default: true })
    showCommands!: boolean;

    get taskDate(): string {
        return `${this.value.creationDate.getDate()}/${this.value.creationDate.getMonth()}/${this.value.creationDate.getFullYear()}`;
    }

    selectTask(): void {
        store.actions.crowdplanning.setSelectedTask(this.value);
    }
}