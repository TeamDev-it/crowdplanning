import Component from "vue-class-component";
import Vue from "vue";
import { Prop } from "vue-property-decorator";
import PlanCard from "../planCard/planCard.vue";

@Component({
  components: {
    PlanCard
  }
})
export default class PlanList extends Vue {
  @Prop({ required: true })
  plans!: server.Plan[];

  selectPlan(value: server.Plan | null) {
    this.$emit('selectPlan', value)
  }
}
