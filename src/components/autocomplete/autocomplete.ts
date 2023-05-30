import Vue from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';

@Component({})
export default class Autocomplete extends Vue {
    /**
      Input values to show on autocomplete
      */
    @Prop({ default: null })
    inputValues!: Array<{ id: string } & any> | null;

    /** 
     * Function for fetch values of autocomplete, if input values is not null this function is not used.
     */
    @Prop({ default: null })
    dataSourceFunction!: dataSourceFunction<any> | null;

    @Prop({ required: true })
    filterFunction!: Function;

    @Prop({ default: "" })
    labelKey!: string;

    @Prop({ default: "" })
    placeholderKey!: string;

    @Prop({ default: '' })
    showThisPropertyAsItemName!: string;

    searchedText = "";
    datas: Array<{ id: string } & any> = [];
    loading = true;
    suggestionOpen = false;

    get filteredValues(): Array<any> {
        if (!this.searchedText) return this.datas;

        return this.filterFunction(this.datas, this.searchedText);
    }

    async mounted(): Promise<void> {
        if (this.inputValues) {
            this.datas = this.inputValues;
        } else {
            if (this.dataSourceFunction) {
                this.datas = await this.dataSourceFunction();
            }
        }

        this.loading = false;
    }

    onItemClickHandler(item: any): void {
        this.$emit('valueChanged', item);

        this.searchedText = item[this.showThisPropertyAsItemName];

        this.suggestionOpen = false;
    }

    onInputHandler() {
        this.suggestionOpen = !!this.searchedText.length;
    }
}