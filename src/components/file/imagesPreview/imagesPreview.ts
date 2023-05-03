import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

@Component({})
export default class ImagesPreview extends Vue {
    static componentName = "images-preview";

    @Prop()
    files!: Array<File>;

    createObjectUrl(file: File): string {
        return URL.createObjectURL(file);
    }
}