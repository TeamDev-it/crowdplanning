import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';

@Component
export default class assignToPlanByLocation extends Vue {
  declare $t: any;

  @Prop()
  value!: {
    actionRoutingName: string;
    actionParameters: string;
  };

  @Prop({ default: false })
  editing!: boolean;

 
  addAction() {
    if (!this.value)
      this.$emit('click', {
        actionRoutingName: 'associateToCrowdplanning',
        actionParameters: ''
      });
  }

}
