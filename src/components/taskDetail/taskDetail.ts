import Component from "vue-class-component";
import Vue from 'vue';
import { Prop } from "vue-property-decorator";
import TaskCard from "../tasks/taskCard/taskCard.vue";
import TaskSummary from "../taskSummary/taskSummary.vue";
import CitizenInteraction from "../citizenInteraction/citizenInteraction.vue";
import { store } from "@/store";
import { CONFIGURATION } from "@/configuration";

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

    get type(): string {
        return CONFIGURATION.context;
    }

    clearTask(): void {
        store.actions.crowdplanning.setSelectedPlan(null);
    }
}