import Component from "vue-class-component";
import Vue from "vue";
import { Prop } from "vue-property-decorator";

@Component
export default class CrowdplanningGroupsItem extends Vue {
    @Prop({required: true})
    value!: server.Group;


}