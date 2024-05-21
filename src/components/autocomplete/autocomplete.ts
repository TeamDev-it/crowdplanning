import { computed, defineComponent, onMounted, PropType, ref } from 'vue';

export default defineComponent({
  name: 'Autocomplete',
  props: {
    inputValues: {
      type: Object as PropType<[Array<{ id: string } & any>, null]>,
      default: null
    },
    dataSourceFunction: {
      type: Function as PropType<dataSourceFunction<any>>,
      default: null
    },
    filterFunction: {
      type: Function,
      required: true
    },
    labelKey: {
      type: String,
      default: ''
    },
    placeholderKey: {
      type: String,
      default: ''
    },
    showThisPropertyAsItemName: {
      type: String,
      default: ''
    },
  },
  emits: ['valueChanged'],
  setup(props, { emit }) {
    
    const searchedText = ref<string>("");
    const datas = ref<Array<{ id: string } & any>>([]);
    const loading = ref<boolean>(true);
    const suggestionOpen = ref<boolean>(false);

    const filteredValues = computed<Array<any>>(() => {
      if (!searchedText.value) return datas.value;
  
      return props.filterFunction(datas.value, searchedText.value);
    })
    
    onMounted(mounted);
    async function mounted(): Promise<void> {
      if (props.inputValues) {
        datas.value = props.inputValues;
      } else {
        if (props.dataSourceFunction) {
          datas.value = await props.dataSourceFunction();
        }
      }
  
      loading.value = false;
    }

    function onItemClickHandler(item: any): void {
      emit('valueChanged', item);
  
      searchedText.value = item[props.showThisPropertyAsItemName];
  
      suggestionOpen.value = false;
    }
  
    function onInputHandler() {
      suggestionOpen.value = !!searchedText.value.length;
    }

    return {
      searchedText,
      datas,
      loading,
      suggestionOpen,
      filteredValues,
      onItemClickHandler,
      onInputHandler
    }
  }
  }
)

