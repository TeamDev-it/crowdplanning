import Component from "vue-class-component";
import Vue from "vue";
import { Prop } from "vue-property-decorator";
import PlanCard from "../planCard/planCard.vue";
import { MessageService } from "vue-mf-module";

@Component({
  components: {
    PlanCard
  }
})
export default class PlanList extends Vue {
  @Prop({ required: true })
  plans!: server.Plan[];

  @Prop()
  plansGroupRoot: server.Group = {} as server.Group;

  @Prop()
  loggedIn!: boolean;

  selectPlan(value: server.Plan | null) {
    this.$emit('selectPlan', value)
  }
}
