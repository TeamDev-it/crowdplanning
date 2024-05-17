import Component from "vue-class-component";
import Vue, { defineComponent, getCurrentInstance, onMounted, ref } from "vue";

type ScrollDirection = 'left' | 'right';

export default defineComponent({
  name: 'scrollableContainer',
  setup() {

    const scrollableContent = ref({} as HTMLDivElement);
    const isRightScrollButtonVisible = ref<boolean>(false);
    const isLeftScrollButtonVisible = ref<boolean>(false);

    const refs = getCurrentInstance()!.proxy.$refs;

    onMounted(mounted)
    function mounted() {
      scrollableContent.value = refs.scrollableContent as HTMLDivElement;
  
      window.addEventListener('resize', () => {
        // this.scrollAmount = 0;
        // this.checkButtonsVisibility()
      });
    }


    return {
      scrollableContent,
      isRightScrollButtonVisible,
      isLeftScrollButtonVisible,
      refs
    }
  }
})