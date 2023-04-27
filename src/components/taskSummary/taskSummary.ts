import Component from "vue-class-component";
import Vue from "vue";
import { Prop } from "vue-property-decorator";
import { attachmentService } from "@/services/attachmentService";

@Component({})
export default class TaskSummary extends Vue {
    @Prop()
    task!: server.Task;

    files: server.FileAttach[] = [];

    public async mounted(): Promise<void> {
        this.files = await attachmentService.getAttachments(`${this.task.group.taskType}-${this.task.id}`)
    }

    get images(): server.FileAttach[] {
        return this.files;
    }

    get documents(): server.FileAttach[] {
        return this.files;
    }
}