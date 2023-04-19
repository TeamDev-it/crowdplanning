import Component from "vue-class-component";
import Vue from "vue";

type ScrollDirection = 'left' | 'right';

@Component
export default class ScrollableContainer extends Vue {
    private scrollAmount = 0;
    private unitScrollAmount = 200;

    scrollableContent = {} as HTMLDivElement;

    get isLeftScrollButtonVisible(): boolean {
        return this.scrollAmount >= this.unitScrollAmount;
    }

    get isRightScrollButtonVisible(): boolean {
        if (this.scrollableContent)
            return this.scrollAmount < this.scrollableContent.scrollWidth - this.scrollableContent.clientWidth;

        return true;
    }

    mounted() {
        this.scrollableContent = this.$refs.scrollableContent as HTMLDivElement;
    }
 
    scroll(scrollDirection: ScrollDirection): void {
        if (scrollDirection === "left") {
            this.subtractScrollValue();
            this.scrollableContent.scrollTo({
                top: 0,
                left: this.scrollAmount,
                behavior: "smooth"
            });
        } else {
            this.addScrollValue();
            this.scrollableContent.scrollTo({
                top: 0,
                left: this.scrollAmount,
                behavior: "smooth"
            });
        }
    }

    private subtractScrollValue(): void {
        this.scrollAmount -= this.unitScrollAmount;
    }

    private addScrollValue(): void {
        this.scrollAmount += this.unitScrollAmount;
    } 
}