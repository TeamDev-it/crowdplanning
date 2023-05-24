import Component from "vue-class-component";
import Vue from "vue";
import { Prop, Watch } from "vue-property-decorator";
import { HexToRGBA } from "@/utility/HexToRGBA";
import { CommonRegistry } from "vue-mf-module";

@Component
export default class TaskMap extends Vue {
    @Prop()
    group!: server.Group;

    @Prop({ default: [] })
    states!: server.State[];

    @Prop({ default: [] })
    tasks!: server.Plan[];

    @Prop({ default: null })
    center!: number[] | null;

    datas: Array<locations.Location> = [];

    async mounted(): Promise<void> {
        await this.getData();
    }

    get values(): Array<locations.MapLayer> {
        return [{
            id: this.group.id,
            name: this.group.name,
            dataType: "",
            visible: true,
            data: this.datas,
            type: "managed",
            fields: [{ name: 'id', alias: 'id', type: "long" },
            { name: 'state', alias: 'state', type: "string" }],
            options: {
                clustering: {
                    enable: false
                }
            },
            symbols: {
                field: "state",
                symbols: this.states.map(s => ({
                    value: s.state,
                    symbol: {
                        color: HexToRGBA(s.color, .9),
                        size: "20",
                        outline: {
                            color: HexToRGBA(s.color, 1),
                            width: "1px"
                        }
                    }
                }))
            },
            dataMapping: (i: locations.Location & { task: server.Plan }, updateMap) => {
                const data = { id: i.id, state: i.task.state };

                // osservo l'oggetto in mappa.
                this.$watch(() => i.task.state, (n) => {
                    data.state = n;
                    updateMap(i);
                });

                return data;
            }
        }];
    }

    get mapComponent() {
        return CommonRegistry.Instance.getComponent("map");
    }

    @Watch("group")
    groupChanged(): void {
        this.datas = [];
    }

    @Watch("tasks")
    async getData(): Promise<void> {
        if (!this.values) return;
        // cancello tutti i dati dal layer
        const layerdata = this.values[0].data;
        layerdata?.splice(0, layerdata?.length);

        for (const s of this.states) {
            layerdata?.push(...
                this.tasks.filter(i => i.state == s.state && i.location)
                    .map(t => Object.assign({
                        "id": 0,
                        "relationId": t.id,
                        "relationType": t.group.id,
                        task: t
                    }, t.location)));
        }
    }
}