import Component from "vue-class-component";
import Vue from "vue";
import { Prop } from "vue-property-decorator";
import { IProjectableModel } from "vue-mf-module";
import SearchWidget from "../arcgisWidgets/search/search.vue";
import dateTime from "../dateTime/dateTime.vue";
import DatePickerVue from "v-calendar/src/components/DatePicker.vue";

@Component({
    components: {
        SearchWidget,
        DatePickerVue,
        dateTime
    }
})
export default class TaskModal extends Vue {
    @Prop({ required: true })
    value!: IProjectableModel<server.Group[]>;

    task: server.Task = {} as server.Task;
    errors: { [id: string]: string } = {};

    setError(id: string, value: string) {
        Vue.set(this.errors, id, value);
    }

    locationSelected(value: locations.Location) {
        this.task.location = value;
    }

    close(): void {
        try {
            this.value?.reject();
        } catch (err) {
            //
        }
    }
}