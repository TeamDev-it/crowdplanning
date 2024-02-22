<template>
  <div
    class="crowdplanning-status-button"
    @click.stop="toggleOpened()"
    @keydown.enter="toggleOpened()"
    :class="{ asselect: showAsSelect, notselected: disableRoot && value.id === value.id }"
  >
    <template v-if="showAsSelect">
      <div class="select">
        <span class="placeholder" v-if="!value">{{ $t('plans.statusButton.placeholder', 'Scegli uno stato') }}</span>
        <span class="statusName" v-else>{{ statusName }}</span>
        <i class="ti ti-chevron-down" v-if="!listOpened"></i>
        <i class="ti ti-chevron-up" v-if="listOpened"></i>
      </div>
    </template>
    <template v-else>
      <div class="ispan">
        <!-- <i class="ti ti-subtask"></i> -->
        <span class="statusName">{{ statusName }}</span>
      </div>
      <i class="ti ti-chevron-down" v-if="!listOpened"></i>
      <i class="ti ti-chevron-up" v-if="listOpened"></i>
    </template>

    <div
      class="list can-scroll-y"
      v-if="listOpened"
      :style="{
        left: `${horizontalPosition}px`,
        top: `${topPosition}px`,
        width: `${width}px`
      }"
    >
      <!-- <div
        class="status"
        :class="{ active: value == null }"
        v-if="!disableRoot"
        @click.stop="
          listOpened = false
        "
      >
        <span>{{ plansstatusRoot.name }}</span>
      </div> -->

      <template v-for="(g, idx) in states">
        <div
          tabindex="0"
          class="status"
          :class="{ active: value == g }"
          :key="idx"
          @click.stop="
            emitState(g.shortName);
            value = g;
            statusName = g.name;
            listOpened = false;
          "
          @keydown.enter="value = g"
        >
          <div class="parent" :class="{ active: value == g }">{{ g.name }}</div>
        </div>
      </template>
    </div>
  </div>
</template>
<script src="./statusButton.ts" lang="ts"></script>
<style lang="less" scoped>
@import url(./statusButton.less);
</style>
