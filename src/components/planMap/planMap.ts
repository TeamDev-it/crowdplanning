
import { computed, defineComponent, getCurrentInstance, onMounted, PropType, ref, watch } from "vue";
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

export default defineComponent({
  name: "PlanMap",
  props: {
    plans: { type: Array as PropType<server.Plan[]>, default: () => [] },
    center: { type: Array as PropType<number[]> },
    states: { type: Array as PropType<server.State[]>, default: () => [] },
  },
  setup(props) {

    const datas = ref<GeoJSON.FeatureCollection>({
      type: "FeatureCollection" as const,
      features: []
    })

    const locations = ref<locations.Location[]>([]);
    const issuesStates = ref<server.State[]>([]);

    const t = getCurrentInstance()!.proxy.$root.$t

    const mapComponent = computed(() => {
      return CommonRegistry.Instance.getComponent("map");
    })

    const values = computed<Array<locations.MapLayer>>(() => {

      const res: Array<locations.MapLayer> = [];
      const labelingInfo = [{
        labelExpressionInfo: { expression: `$feature.title` },
        symbol: {
          type: "text",  // autocasts as new TextSymbol()
          color: "black",
          haloSize: 1,
          haloColor: "white",
        }
      }]
      res.push({
        id: `PLANS`,
        name: t("crowdplanning.plans", "Progetti"),
        visible: true,
        data: datas.value,
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
          defaultLabel: t('crowdplanning.states.unknown', 'Altro'),
          uniqueValueInfos: props.states.map(v => ({
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
          watch(() => i.properties!["state"], (n) => {
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
        name: t('crowdplanning.issues', 'Segnalazioni'),
        dataType: "ISSUES",
        visible: true,
        data: locations.value,
        type: "managed",
        tocVisible: true,
        legendEnabled: true,
        fields: [
          { name: 'id', alias: 'id', type: "long" },
          { name: 'state', alias: 'state', type: "string" }
        ],
        symbols: {
          field: "state",
          symbols: issuesStates.value.map(s => ({
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
          watch(() => i.task.state, (n) => {
            data.state = n;
            updateMap(i);
          });

          return data;
        }
      } as locations.ManagedMapLayer);

      return res;
    })

    onMounted(mounted)
    async function mounted(): Promise<void> {
      await getData();
    }

    watch(() => props.plans, getData)
    async function getData(): Promise<void> {
      try {
        issuesStates.value = await MessageService.Instance.ask("GET_ISSUES_STATES");
      } catch (e) {
        console.warn("Can't get issues states: ", e);
      }

      datas.value.features.splice(0, datas.value.features.length);
      const layerData = (values.value[1] as locations.ManagedMapLayer).data;

      layerData.splice(0, locations.value.length);

      const features: { plan: server.Plan, feature: locations.Feature }[] = [];
      for (const item of props.plans) {
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

      datas.value.features.push(...coll);
    }

    return {
      values,
      mapComponent,
      datas,
    }
  }
})