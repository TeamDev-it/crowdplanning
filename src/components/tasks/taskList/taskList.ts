import Component from "vue-class-component";
import Vue from "vue";
import { Prop } from "vue-property-decorator";
import TaskCard from "../taskCard/taskCard.vue";

@Component({
    components: {
        TaskCard
    }
})
export default class TaskList extends Vue {
    @Prop({required: true})
    tasks!: server.Task[];
}