import { defineComponent, PropType } from "vue";
import PlanCard from "../planCard/planCard.vue";

export default defineComponent({
  name: 'planList',
  props: {
    plans: {
      type: Array as PropType<server.Plan[]>,
    },
    plansGroupRoot: {
      type: Object as PropType<server.Group>,
      default: {}
    },
    loggedIn: {
      type: Boolean
    }
  },
  components: {
    PlanCard
  },
  setup(props, { emit }) {

    function selectPlan(value: server.Plan) {
      emit('selectPlan', value)
    }

    return { 
      selectPlan,
     }
  }
  })

