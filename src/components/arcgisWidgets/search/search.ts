import Component from "vue-class-component";
import Vue from "vue";
import Search from "@arcgis/core/widgets/Search";
import { Prop } from "vue-property-decorator";

@Component
export default class SearchWidget extends Vue {
    @Prop({default: ''})
    value!: string;

    location: locations.Location = {} as locations.Location;
    locationName = '';
    searchResponse: __esri.SearchResponse | null = null;
    searchResults: __esri.SearchResult[] = [];

    searchWidet = new Search();

    mounted() {
        if (this.value) {
            this.locationName = this.value;
        }
    }

    async searchLocation(): Promise<void> {
        this.searchResponse = await this.searchWidet.search(this.locationName);
        this.searchResults = this.searchResponse?.results[0].results.map(x => x) ?? [];
    }

    selectLocation(idx: number): void {
        this.locationName = this.searchResults[idx].name;

        this.location.latitude = (this.searchResults[idx].feature.geometry as any).latitude;
        this.location.longitude = (this.searchResults[idx].feature.geometry as any).longitude;

        this.$emit("locationSelected", this.location);

        this.searchResponse = null;
        this.searchResults.splice(0, this.searchResults.length);
    }
}