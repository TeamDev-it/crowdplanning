import Component from "vue-class-component";
import Vue from "vue";
import { Prop, Watch } from "vue-property-decorator";
import { HexToRGBA } from "@/utility/HexToRGBA";
import { CommonRegistry, MessageService } from "vue-mf-module";

type taskLike = {
  state: string;
  id: string;
  group: {
    taskType: string;
  };
  location: locations.Location;
};

@Component
export default class PlanMap extends Vue {
  @Prop({ default: () => [] })
  plans!: server.Plan[];

  @Prop()
  group!: server.Group;

  @Prop({ default: null })
  center!: number[] | null;

  @Prop({ default: () => [] })
  states!: server.State[];

  datas: GeoJSON.FeatureCollection = {
    type: "FeatureCollection" as const,
    features: []
  }

  locations: locations.Location[] = [];
  issuesStates: server.State[] = [];

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
      id: `PLANS`,
      name: this.$t("crowdplanning.plans", "Progetti"),
      visible: true,
      data: this.datas,
      fields: [
        { name: "objectId", type: "long", alias: "objectId" },
        { name: "typeId", type: "string", alias: "typeId" },
        { name: "planId", type: "string", alias: "planId" },
        { name: "title", type: "string", alias: "title" },
        { name: "state", type: "string", alias: "state" },
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

    res.push({
      id: `ISSUES`,
      name: this.$t('crowdplanning.issues', 'Segnalazioni'),
      dataType: "ISSUES",
      visible: true,
      data: this.locations,
      type: "managed",
      tocVisible: true,
      legendEnabled: true,
      fields: [
        { name: 'id', alias: 'id', type: "long" },
        { name: 'state', alias: 'state', type: "string" }
      ],
      symbols: {
        field: "state",
        symbols: this.issuesStates.map(s => ({
          value: s.shortName,
          symbol: {
            color: HexToRGBA(s.color ?? "#0000FF", .9),
            size: "20",
            outline: {
              color: HexToRGBA("#000000", 1),
              width: "1px"
            }
          }
        })),
      },
      options: {
        clustering: {
          enable: false
        }
      },
      dataMapping: (i: locations.Location & { task: { state: string } }, updateMap) => {
        const data = { id: i.id, state: i.task.state };

        // osservo l'oggetto in mappa.
        this.$watch(() => i.task.state, (n) => {
          data.state = n;
          updateMap(i);
        });

        return data;
      }
    } as locations.ManagedMapLayer);

    return res;
  }

  get mapComponent() {
    return CommonRegistry.Instance.getComponent("map");
  }

  async mounted(): Promise<void> {
    await this.getData();
  }

  @Watch("group")
  groupChanged(): void {
    this.datas.features.splice(0, this.datas.features.length);
  }

  @Watch("plans", { deep: true })
  async getData(): Promise<void> {
    try {
      this.issuesStates = await MessageService.Instance.ask("GET_ISSUES_STATES");
    } catch (e) {
      console.warn("Can't get issues states: ", e);
    }

    this.datas.features.splice(0, this.datas.features.length);
    const layerData = (this.values[1] as locations.ManagedMapLayer).data;

    layerData.splice(0, this.locations.length);

    const features: { plan: server.Plan, feature: locations.Feature }[] = [];
    for (const item of this.plans) {
      try {
        const feature: locations.Feature = await MessageService.Instance.ask("GET_FEATURE_BYREF_PUBLIC", {
          relationType: "PLANS",
          relationId: item.id,
          workspaceId: item.workspaceId
        });
        if (feature && feature.shape)
          features.push({ plan: item, feature });

      } catch (e) {
        console.error("Can't get feature for plan: ", item.id, e);
      }

      try {
        const issues: taskLike[] = await MessageService.Instance.ask("GET_ISSUES_BYREF", item.id);

        if (issues && issues.length) {
          layerData.push(...
            issues.filter(i => !!i.location)
              .map(t => Object.assign({
                "id": 0,
                "relationId": t.id,
                "relationType": t.group.taskType,
                task: t
              }, t.location)));

        }
      } catch (e) {
        console.error("Can't get issues for plan: ", item.id, e);
      }
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
