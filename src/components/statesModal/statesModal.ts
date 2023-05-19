import Vue from "vue";
import Component from "vue-class-component";
import { IProjectableModel, Projector } from "vue-mf-module/dist/helpers/Projector";
import { Prop, Watch } from "vue-property-decorator";
import ValidateDirective from 'vue-mf-module';
import { Drag, Drop } from 'vue-drag-drop';
import { store } from "@/store";

@Component({
    directives: {
        validate: ValidateDirective as any,
    }, components: {
        Drag, Drop
    }
})
export default class statesModal extends Vue {

    @Prop()
    value!: IProjectableModel<server.Group>;

    get states(): server.State[] {
        return Array.from(store.getters.crowdplanning.getStates(this.value.data.id) || []);
    }

    get sortedStates() {
        return this.states.sort((a, b) => a.orderIndex - b.orderIndex);
    }

    async mounted() {
        await tasksService.getStates(this.value.data);
    }

    handleDrop(to: server.State, from: server.State) {
        var temp = Array.from(this.sortedStates);
        temp.splice(temp.indexOf(from), 1);
        temp.splice(temp.indexOf(to), 0, from);
        this.recalcIndex(temp);
    }

    handleDropState(state: string, from: server.State) {
        if (state != from.state)
            from.state = state;
    }

    recalcIndex(list: server.State[]) {
        for (let index = 0; index < list.length; index++) {
            const element = list[index];
            switch (element.state) {
                case 'New': element.orderIndex = 100 + index + 1; break;
                case 'Open': element.orderIndex = 200 + index + 1; break;
                case 'Active': element.orderIndex = 300 + index + 1; break;
                case 'Review': element.orderIndex = 400 + index + 1; break;
                case 'Closed': element.orderIndex = 500 + index + 1; break;
            }
        }
    }

    async close() {
        for (const state of this.states) {
            await tasksService.updateState(state);
        }

        this.value.resolve(this.value.data);
    }

    async remove(s: server.State) {

        var states = Array.from(this.states);
        var idx = states.indexOf(s);
        if (idx >= 0) states.splice(idx, 1);

        store.actions.tasks.setStates({ group: this.value.data.id, states });
        await tasksService.removeState(s);
    }

    async addState(s: string) {
        var states = Array.from(this.states);
        states.push({ state: s, type: this.value.data.taskType } as server.State)
        this.recalcIndex(states);
        store.actions.tasks.setStates({ group: this.value.data.id, states });
    }
}