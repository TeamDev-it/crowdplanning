import moment from "moment";
import { computed, defineComponent, inject } from "vue";

export default defineComponent({
  name: 'dateTime',
  props: {
    value: {
      type: [String, Date],
    },
    events: {
      type: Object as any
    },
    from: {
      type: [String, Date],
      default: null
    },
    showIcon: {
      type: Boolean,
      default: true
    },
    isDueDate: {
      type: Boolean,
      default: false
    },
    icon: {
      type: String,
      default: 'ti ti-calendar'
    },
  },
  setup(props) {
    
    const now = new Date();
    // const now : Date | undefined = inject('__reactiveInject__');
    // const {now}: {now:Date} = inject('__reactiveInject__') as {now: Date};

    const overdue = computed(() => {
      return props.value! < now!;
    })
  
    const showProgress = computed(() => {
      return props.from && props.value! > props.from;
    })

    const progress = computed(() => {
      if (moment.duration(moment(props.value).diff(moment(now))).asMinutes() < 0) return 1;
      if (moment.duration(moment(props.from).diff(moment(now))).asMinutes() > 0) return 0;
      return (moment.duration(moment(now).diff(moment(props.from))).asMinutes() /
        moment.duration(moment(props.value).diff(moment(props.from))).asMinutes());
    })

    const progressColor = computed(() => {
      if (moment.duration(moment(props.value).diff(moment(now))).asMinutes() < 0) return `hsl(0,100%,50%)`;
      if (props.from) {
        const percentage = moment.duration(moment(now).diff(moment(props.from))).asMinutes() /
          moment.duration(moment(props.value).diff(moment(props.from))).asMinutes();
        return `hsl(${Math.round((1 - percentage) * 120)},100%, 50%)`;
      }
      return null;
    })
  
    const dueColor = computed(() => {
      if (moment.duration(moment(props.value).diff(moment(now))).asMinutes() < 0) return `hsl(0,100%,50%)`;
      return null;
    })

    function date(value: any): string {
      const _value = moment(new Date(value));
      return _value.format(`DD/MM/YYYY`)
    }

    function time(value: moment.MomentInput) {
      return moment(value).format('hh:mm a')
    }
    
    return {
      now,
      overdue,
      showProgress,
      date,
      progress,
      progressColor,
      dueColor,
      time
    }
  }
})