import Component from "vue-class-component";
import Vue from 'vue';
import { Prop } from "vue-property-decorator";
import { IProjectableModel, MessageService } from "vue-mf-module";
import { groupsService } from "@/services/groupsService";

@Component
export default class GroupModal extends Vue {
  @Prop()
  value!: IProjectableModel<server.Group>;

  copyValue!: server.Group 

  beforeMount() {
    this.copyValue = structuredClone(this.value.data);
  }

  errors: { [id: string]: string } = {};
  setError(id: string, value: unknown) {
    Vue.set(this.errors, id, value);
  }

  async confirm(): Promise<void> {
    Object.assign(this.value.data, this.copyValue)
    if (this.value.data && !this.value.data.id) {
      const createdGroup = await groupsService.Set(this.value.data);
      if (createdGroup)
        this.value.resolve(createdGroup);
    } else {
      const updatedGroup = await groupsService.Set(this.value.data);

      if (updatedGroup)
        this.value.resolve(updatedGroup);
    }

    MessageService.Instance.send("CHANGED_GROUP")
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
    
    await groupsService.deleteGroup(this.value.data.id);
    Vue.set(this.value.data, 'deleted', true);
    this.value.resolve(this.value.data);

    MessageService.Instance.send("CHANGED_GROUP");

    try {
      this.value.resolve(this.value.data);
    } catch {
      //
    }
  }
}
