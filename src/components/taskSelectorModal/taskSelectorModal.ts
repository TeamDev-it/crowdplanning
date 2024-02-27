import Component from "vue-class-component";
import Vue from "vue";
import { Prop, Watch } from "vue-property-decorator";
import { CommonRegistry, IProjectableModel, MessageService } from "vue-mf-module";
import { plansService } from "@/services/plansService";

@Component({
    components: {

    }
})
export default class TaskSelectorModal extends Vue {

    @Prop()
    value!: IProjectableModel<server.Plan>

    get taskSelector() {
        return CommonRegistry.Instance.getComponent('task-selector');
    }

    tasksList?: string[]


    mounted() {
        console.log(this.value.data)
    }
    close() {
        this.value.resolve(this.value.data)
    }

    async confirm() {
        await plansService.importTask(this.value.data.id!, this.tasksList!);
        this.value.resolve(this.value.data)
    }
}