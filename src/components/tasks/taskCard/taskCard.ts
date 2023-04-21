import Component from "vue-class-component";
import Vue from "vue";
import { Prop } from "vue-property-decorator";

@Component
export default class TaskCard extends Vue {
    @Prop()
    value!: server.Task;

    get taskDate(): string {
        return `${this.value.creationDate.getDate()}/${this.value.creationDate.getMonth()}/${this.value.creationDate.getFullYear()}`;
    }
}