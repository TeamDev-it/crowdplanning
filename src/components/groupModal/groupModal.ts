import Component from "vue-class-component";
import Vue from 'vue';
import { Prop } from "vue-property-decorator";
import { IProjectableModel } from "vue-mf-module";
import { tasksService } from "@/services/tasksService";

@Component
export default class GroupModal extends Vue {
    @Prop({ required: true })
    value!: IProjectableModel<server.Group>;

    errors: { [id: string]: string } = {};
    setError(id: string, value: unknown) {
        Vue.set(this.errors, id, value);
    }

    async confirm(): Promise<void> {
        if (this.value.data && !this.value.data.id) {
            const createdGroup = await tasksService.createGroup(this.value.data);
            if (createdGroup)
                this.value.resolve(createdGroup);

            this.close();
        } else {
            const updatedGroup = await tasksService.updateGroup(this.value.data.id, this.value.data);

            if (updatedGroup)
                this.value.resolve(updatedGroup);

            this.close();
        }
    }

    close(): void {
        try {
            this.value?.reject();
        } catch {
            // 
        }

        this.value.resolve(this.value.data);
    }

    async deleteGroup(): Promise<void> {
        await tasksService.deleteGroup(this.value.data.id);
        Vue.set(this.value.data, 'deleted', true);
        this.value.resolve(this.value.data);

        try {
            this.value?.reject();
        } catch {
            //
        }
    }
}