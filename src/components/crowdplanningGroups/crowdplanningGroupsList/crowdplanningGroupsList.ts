import Component from "vue-class-component";
import Vue from 'vue';
import { Prop } from "vue-property-decorator";

@Component
export default class CrowdPlanningGroupList extends Vue {
    @Prop({required: true})
    group!: server.Group;
}