import { store } from '@/store';
import Vue from 'vue';
import Component from 'vue-class-component';
import { MessageService } from 'vue-mf-module';
import { Prop } from 'vue-property-decorator';

@Component({})
export default class ChildrenPlans extends Vue {
  @Prop({ required: true })
  children!: server.Plan[];

  loading = true;
  planAddressDictionary: Map<string, string> = new Map<string, string>();

  public async mounted(): Promise<void> {
    await this.getAddressForEachChildren();

    this.loading = false;
  }

  private async getAddressForEachChildren(): Promise<void> {
    for (const child of this.children) {
      const address = (await MessageService.Instance.ask("LOCATION_TO_ADDRESS", child.location)) as string ?? '';

      this.planAddressDictionary.set(child.id, address);
    }
  }

  public getAddressFromId(id: string): string {
    return (this.planAddressDictionary.has(id) ? this.planAddressDictionary.get(id) : '') ?? '';
  }

  public onLinkedPlanClicked(planId: string) {
    store.actions.crowdplanning.setSelectedPlanId(planId);
  }
}
