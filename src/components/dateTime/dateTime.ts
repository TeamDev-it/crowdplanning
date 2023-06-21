import moment from "moment";
import Vue from "vue";
import Component from "vue-class-component";
import { InjectReactive, Prop } from "vue-property-decorator";

@Component({})
export default class dateTime extends Vue {

  @Prop()
  value!: Date | string;

  @Prop()
  events: any;

  @Prop({ default: null })
  from!: Date | string;

  @InjectReactive({ default: new Date() })
  now!: Date;

  @Prop({ default: true })
  showIcon!: boolean;

  @Prop({ default: false })
  isDueDate!: boolean;

  @Prop({ default: 'ti ti-calendar' })
  icon!: string;

  get overdue() {
    return this.value < this.now;
  }

  get showProgress() {
    return this.from && this.value > this.from;
  }

  date(value: any): string {
    const _now = moment(this.now);
    const _value = moment(new Date(value));
    // if (_now.year() == _value.year()) {
    //   if (_now.month() == _value.month()) {
    //     if (_now.format('DD') == _value.format('DD'))
    //       return _value.format(`[${this.$t('date.today')}]`)
    //     if (_now.add(1, 'day').format('DD') == _value.format('DD'))
    //       return _value.format(`[${this.$t('date.tomorrow')}]`)
    //     if (_now.add(-1, 'day').format('DD') == _value.format('DD'))
    //       return _value.format(`[${this.$t('date.yesterday')}]`)

    //     return _value.format(`ddd DD`)
    //   }
    //   return _value.format(`DD MMM`)
    // }
    return _value.format(`DD/MM/YYYY`)
  }

  get progress() {
    if (moment.duration(moment(this.value).diff(moment(this.now))).asMinutes() < 0) return 1;
    if (moment.duration(moment(this.from).diff(moment(this.now))).asMinutes() > 0) return 0;
    return (moment.duration(moment(this.now).diff(moment(this.from))).asMinutes() /
      moment.duration(moment(this.value).diff(moment(this.from))).asMinutes());
  }

  get progressColor() {
    if (moment.duration(moment(this.value).diff(moment(this.now))).asMinutes() < 0) return `hsl(0,100%,50%)`;
    if (this.from) {
      const percentage = moment.duration(moment(this.now).diff(moment(this.from))).asMinutes() /
        moment.duration(moment(this.value).diff(moment(this.from))).asMinutes();
      return `hsl(${Math.round((1 - percentage) * 120)},100%, 50%)`;
    }
    return null;
  }

  get dueColor() {
    if (moment.duration(moment(this.value).diff(moment(this.now))).asMinutes() < 0) return `hsl(0,100%,50%)`;
    return null;
  }

  time(value: moment.MomentInput) {
    return moment(value).format('hh:mm a')
  }
}