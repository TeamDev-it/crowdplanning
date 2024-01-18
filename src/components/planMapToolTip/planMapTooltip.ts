import { plansService } from "@/services/plansService";
import Vue from "vue";
import Component from "vue-class-component";
import { MessageService, Projector } from "vue-mf-module";
import { Prop } from "vue-property-decorator";
import SituationObjectModal from "@/components/situationObjectModal/situationObjectModal.vue";
import PlanDetail from "../planDetail/planDetail";
import planDetail from "../planDetail/planDetail";

@Component({})
export default class ObjectMapTooltip extends Vue {

  @Prop()
  value: { objectId: number, typeId: number, situationId: string, [key: string]: unknown };

  plans!: server.Plan[];
  

  get visiblePlans() {
    // return this.objectType.fieldsDefinitions.filter(d => d.showInCard).sort((a, b) => a.order - b.order);
    return this.plans
  }

  async mounted() {
    this.plans = await plansService.getPlans(this.value.situationId, this.value.typeId, this.value.objectId);
    
  }

  async editObject() {
    if (this.$can("SITUATION.objects.canedit")) {
      let result = await Projector.Instance.projectAsyncTo(planDetail, this.plan);
      result = await plansService.setplan(this.plan.situationId, result);
      this.plan = result;
      MessageService.Instance.send("SITUATION_OBJECT_CHANGED", result);
    }
  }
};


