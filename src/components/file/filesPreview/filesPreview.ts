import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";

@Component({})
export default class FilesPreview extends Vue {
    static componentName = 'files-preview';

    @Prop()
    files!: Array<File>;
}