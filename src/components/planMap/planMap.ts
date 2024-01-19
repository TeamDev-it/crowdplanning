import Component from "vue-class-component";
import Vue from "vue";
import { Prop, Watch } from "vue-property-decorator";
import { HexToRGBA } from "@/utility/HexToRGBA";
import { CommonRegistry } from "vue-mf-module";

@Component
export default class PlanMap extends Vue {
  @Prop({ default: [] })
  plans!: server.Plan[];

  @Prop()
  group!: server.Group;

  @Prop({ default: null })
  center!: number[] | null;

  @Prop({ default: [] })
  states: server.State[] = [];

  datas: Array<locations.Location> = [];

  async mounted(): Promise<void> {
    await this.getData();
  }

  get values(): Array<locations.MapLayer> {
    return [
      ...this.foreachPlanVisibleLayerGetMapLayers(),
      {
        id: this.group.id,
        name: this.group.name,
        dataType: "PLANS",
        visible: true,
        data: this.datas,
        type: "managed",
        fields: [
          { name: 'id', alias: 'id', type: "long" },
          { name: 'state', alias: 'state', type: "string" }
        ],
        options: {
          clustering: {
            enable: false
          }
        },
        symbols: {
          field: "state",
          symbols: [
            ...this.states.map(s => ({
              value: s.generalStatus,
              symbol: {
                color: s.color ? HexToRGBA(s.color, .9) : "rgba(0,255,0,.9)",
                size: "20",
                outline: {
                  color: s.color ? HexToRGBA(s.color, 1) : "rgba(0,255,0,1)",
                  width: "1px"
                }
              }
            })),
            {
              value: "none",
              symbol: {
                color: "rgba(0,255,0,1)",
                size: "20",
                outline: {
                  color: "rgba(0,255,0,.9)",
                  width: "1px"
                }
              }
            }
          ],
        },
        dataMapping: (i: locations.Location & { plan: server.Plan }, updateMap) => {
          const data = { id: i.id, state: i.plan.state ?? "none" };
          console.log(data);

          // osservo l'oggetto in mappa.
          this.$watch(() => i.plan.state, (n) => {
            data.state = n;
            updateMap(i);
          });

          return data;
        }
      },
    ];
  }

  get mapComponent() {
    return CommonRegistry.Instance.getComponent("map");
  }

  @Watch("group")
  groupChanged(): void {
    this.datas = [];
  }

  @Watch("plans", { deep: true })
  async getData(): Promise<void> {
    if (!this.values)
      return;

    // cancello tutti i dati dal layer
    const layerdata = this.values.filter(x => x.data)[0].data;
    layerdata?.splice(0, layerdata?.length);

    this.states.forEach(() => {
      const visiblePlans = this.plans.filter(i => i.location);
      layerdata?.push(...
        visiblePlans
          .map(t => Object.assign({
            "id": 0,
            "relationId": t.id,
            "relationType": t.group.id,
            plan: t
          }, t.location)));
    });
  }

  private foreachPlanVisibleLayerGetMapLayers(): locations.MapLayer[] {
    const mapLayers: locations.MapLayer[] = [];

    for (const plan of this.plans) {
      if (plan.visibleLayers)
        mapLayers.push(...plan.visibleLayers.map(x => ({
          dataType: 'PLANS',
          visible: true,
          symbols: {},
          url: x,
          type: "server",
        } as locations.MapLayer)));
    }

    return mapLayers;
  }
}
