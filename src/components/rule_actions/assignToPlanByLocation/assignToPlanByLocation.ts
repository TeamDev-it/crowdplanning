import Vue, { defineComponent, PropType } from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';

export default defineComponent({
  name: 'assignToPlanByLocation',
  props: {
    value: { type: Object as PropType<{ actionRoutingName: string, actionParameters: string }> },
    editing: { type: Boolean, default: false }
  },
  setup(props, { emit }) {

    function addAction() {
      if (!props.value)
        emit('click', {
          actionRoutingName: 'associateToCrowdplanning',
          actionParameters: ''
        });
    }

    return {
      addAction
    }
  }
})