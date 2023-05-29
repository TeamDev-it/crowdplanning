import Component from "vue-class-component";
import Vue from 'vue';
import { Prop } from "vue-property-decorator";
import TaskCard from "../tasks/taskCard/taskCard.vue";
import TaskSummary from "../taskSummary/taskSummary.vue";
import CitizenInteraction from "../citizenInteraction/citizenInteraction.vue";
import { store } from "@/store";

@Component({
    components: {
        TaskCard,
        TaskSummary,
        CitizenInteraction
    }
})
export default class TaskDetail extends Vue {
    @Prop({ required: true })
    task!: server.Plan;

    clearTask(): void {
        store.actions.crowdplanning.setSelectedPlan(null);
    }
}