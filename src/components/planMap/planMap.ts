import Component from "vue-class-component";
import Vue from "vue";
import { Prop, Watch } from "vue-property-decorator";
import { HexToRGBA } from "@/utility/HexToRGBA";
import { CommonRegistry, MessageService } from "vue-mf-module";

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

  datas: GeoJSON.FeatureCollection = {
    type: "FeatureCollection" as const,
    features: []
  }

  async mounted(): Promise<void> {
    await this.getData();
  }

  get values(): Array<locations.MapLayer> {

    const res: Array<locations.MapLayer> = [];
    const labelingInfo = [{
      labelExpressionInfo: { expression: `$feature.title` },
      symbol: {
        type: "text",  // autocasts as new TextSymbol()
        color: "black",
        haloSize: 1,
        haloColor: "white",
      }
    }];

    res.push({
      id: `${this.group.id}-PLANS`,
      name: this.group.name,
      visible: true,
      data: this.datas,
      fields: [
        {
          name: "objectId",
          type: "long",
          alias: "objectId",
        },
        {
          name: "typeId",
          type: "string",
          alias: "typeId",
        },
        {
          name: "planId",
          type: "string",
          alias: "planId",
        },
        {
          name: "title",
          type: "string",
          alias: "title",
        },
        {
          name: "state",
          type: "string",
          alias: "state",
        },
      ],
      type: "geojson",
      geometryType: "polygon",
      dataType: 'PLANS', // Utilizzato per i popup
      options: {
        clustering: {
          enable: false
        }
      },
      renderer: {
        type: "unique-value",
        field: "state",
        defaultSymbol: {
          type: "simple-fill",  // autocasts as new SimpleFillSymbol()
          color: [51, 51, 51, 0.3],
          style: "solid",
          outline: {  // autocasts as new SimpleLineSymbol()
            color: "black",
            width: "0.5px",
          }
        },
        defaultLabel: this.$t('crowdplanning.states.unknown', 'Altro'),
        uniqueValueInfos: this.states.map(v => ({
          value: v.shortName,
          symbol: {
            type: "simple-fill",
            color: HexToRGBA(v.color, 0.7),
            style: "solid",
            outline: {  // autocasts as new SimpleLineSymbol()
              color: "white",
              width: "0.5px",
            }
          },
          label: v.name
        })),
      },
      labelingInfo,
      dataMapping: (i, updateMap) => {
        this.$watch(() => i.properties!["state"], (n) => {
          i.properties!["state"] = n;
          updateMap(i);
        });

        const res = { ...i.properties };
        return res;
      },
      tocVisible: true,
      legendEnabled: true,
    });

    return res;
  }


  get mapComponent() {
    return CommonRegistry.Instance.getComponent("map");
  }

  @Watch("group")
  groupChanged(): void {
    this.datas.features.splice(0, this.datas.features.length);
  }

  @Watch("plans", { deep: true })
  async getData(): Promise<void> {
    this.datas.features.splice(0, this.datas.features.length);

    const features: { plan: server.Plan, feature: locations.Feature }[] = [];
    for (const item of this.plans) {
      const feature: locations.Feature = await MessageService.Instance.ask("GET_FEATURE_BYREF", { relationType: "PLANS", relationId: item.id });
      if (feature && feature.shape)
        features.push({ plan: item, feature });
    }

    const coll = features.map(o => ({
      type: "Feature" as const,
      geometry: o.feature.shape,
      id: o.feature.id,
      properties: {
        objectId: o.feature.id,
        typeId: o.feature.relationType,
        planId: o.plan.id,
        title: o.plan.title,
        state: o.plan.state,
      },
    }));

    this.datas.features.push(...coll);
  }
}
