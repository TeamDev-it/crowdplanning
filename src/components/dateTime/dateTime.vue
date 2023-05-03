<template>
  <div class="datetime" v-on="events" :class="{novalue: !value}">
    <template v-if="showIcon || !value">
      <i class="ti ti-calendar-plus" v-if="isDueDate" :style="{ color: dueColor }"></i>
      <i :class="icon" v-else></i>
    </template>
    <template v-if="value">
      <time>{{ date(value) }}</time>
      <time>{{ time(value) }}</time>
    </template>
    <svg width="100" viewBox="0 0 100 2" v-if="from">
      <rect :width="progress * 100" height="2" :style="{ fill: progressColor }" />
    </svg>
  </div>
</template>
<script src="./dateTime.ts" lang="ts"></script>
<style lang="less" scoped>
@import url(./dateTime.less);
</style>