import Vue from "vue";
import Component from "vue-class-component";
import { IProjectableModel, Projector } from "vue-mf-module/dist/helpers/Projector";
import { Prop } from "vue-property-decorator";
import ValidateDirective, { MessageService } from 'vue-mf-module';
import { statesService } from "@/services/statesService";
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

  states: server.State[] = [];

  get sortedStates() {
    return Array.from(this.states).sort((a, b) => a.orderIndex - b.orderIndex);
  }

  async mounted() {
    this.states = Array.from(await statesService.getStates(this.value.data));
  }

  handleDrop(to: server.State, from: server.State) {
    this.states.splice(this.states.indexOf(from), 1);
    this.states.splice(this.states.indexOf(to), 0, from);
    this.recalcIndex();
  }

  handleDropState(state: string, from: server.State) {
    if (state != from.state)
      from.state = state;
  }

  recalcIndex() {
    for (let index = 0; index < this.states.length; index++) {
      const element = this.states[index];
      switch (element.state) {
        case 'New': element.orderIndex = 100 + index + 1; break;
        case 'Open': element.orderIndex = 200 + index + 1; break;
        case 'Active': element.orderIndex = 300 + index + 1; break;
        case 'Review': element.orderIndex = 400 + index + 1; break;
        case 'Closed': element.orderIndex = 500 + index + 1; break;
      }
    }
  }

  close() {
    this.value.resolve(this.value.data)
  }

  async confirm() {

    if (this.states.some(s => !s.name || !s.shortName)) {
      MessageService.Instance.send("ERROR", this.$t("states.set-error", "Riempire tutti i campi"));
      return;
    }

    for (const state of Array.from(this.states)) {
      await statesService.setState(state, this.value.data.id);
    }

    this.value.resolve(this.value.data);
  }

  async remove(s: server.State) {
    var idx = this.states.indexOf(s);
    if (idx >= 0)
      this.states.splice(idx, 1);

    if (s.id) {
      await statesService.removeState(s.id);
      store.actions.crowdplanning.setStates({ groupId: this.value.data.id, states: this.states });
    }
  }

  async addState(s: string) {
    this.states.push({
      generalStatus: s,    
      reference: this.value.data.reference
    } as unknown as server.State);
    this.recalcIndex();
  }
}
