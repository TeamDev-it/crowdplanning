import Component from "vue-class-component";
import Vue from "vue";

type ScrollDirection = 'left' | 'right';

@Component
export default class ScrollableContainer extends Vue {
    // private scrollAmount = 0;
    // private unitScrollAmount = 200;

    scrollableContent = {} as HTMLDivElement;
    isRightScrollButtonVisible = false;
    isLeftScrollButtonVisible = false;

    mounted() {
        this.scrollableContent = this.$refs.scrollableContent as HTMLDivElement;

        // this.checkButtonsVisibility();

        window.addEventListener('resize', () => {
            // this.scrollAmount = 0;
            // this.checkButtonsVisibility()
        });
    }

    // checkButtonsVisibility(): void {
    //     this.isLeftScrollButtonVisible = this.scrollAmount >= this.unitScrollAmount;
    //     this.isRightScrollButtonVisible = this.scrollAmount <= this.scrollableContent.scrollWidth - this.scrollableContent.clientWidth;
    // }



    // scroll(scrollDirection: ScrollDirection): void {
    //     if (scrollDirection === "left") {
    //         this.subtractScrollValue();
    //         this.scrollableContent.scrollTo({
    //             top: 0,
    //             left: this.scrollAmount,
    //             behavior: "smooth"
    //         });
    //     } else {
    //         this.addScrollValue();
    //         this.scrollableContent.scrollTo({
    //             top: 0,
    //             left: this.scrollAmount,
    //             behavior: "smooth"
    //         });
    //     }

    //     this.checkButtonsVisibility();
    // }

    // private subtractScrollValue(): void {
    //     this.scrollAmount -= this.unitScrollAmount;
    // }

    // private addScrollValue(): void {
    //     this.scrollAmount += this.unitScrollAmount;
    // }
}