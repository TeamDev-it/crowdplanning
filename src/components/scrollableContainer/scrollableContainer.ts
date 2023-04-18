import Component from "vue-class-component";
import Vue from "vue";

type ScrollDirection = 'left' | 'right';

@Component
export default class ScrollableContainer extends Vue {
    scrollableContent: HTMLDivElement = this.$refs.scrollableContent as HTMLDivElement;

    scroll(scrollDirection: ScrollDirection): void {
        if (scrollDirection === "left") {
            this.scrollableContent.scrollLeft += -1 * 150;
        } else {
            this.scrollableContent.scrollLeft += 1 * 150;
        }
    }
}