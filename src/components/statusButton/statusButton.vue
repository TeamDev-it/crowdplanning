<template>
  <div
    class="crowdplanning-status-button"
    @click.stop="listOpened ? closeList() : openList()"
    @keydown.enter="listOpened ? closeList() : openList()"
    :class="{ asselect: showAsSelect, notselected: disableRoot && value.id === value.id }"
  >
    <div v-if="showAsSelect" class="select-cont">
      <div class="select">
        <span class="placeholder" v-if="!value">{{ $t('plans.statusButton.placeholder', 'Scegli uno stato') }}</span>
        <span class="statusName" v-else>{{ value }}</span>
        <i class="ti ti-chevron-down" v-if="!listOpened"></i>
        <i class="ti ti-chevron-up" v-if="listOpened"></i>
      </div>
    </div>
    <div v-else>
      <div class="ispan">
        <!-- <i class="ti ti-subtask"></i> -->
        <span class="statusName">{{ value }}</span>
      </div>
      <i class="ti ti-chevron-down" v-if="!listOpened"></i>
      <i class="ti ti-chevron-up" v-if="listOpened"></i>
    </div>

    <div
      class="list can-scroll-y"
      v-if="listOpened"
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

      <div v-for="(g, idx) in states" style="width: 100%;">
        <div
          tabindex="0"
          class="status"
          :class="{ active: value == g.name }"
          :key="idx"
          @click.stop="
            emitState(g.name);
          "
          @keydown.enter="
          emitState(g.name)"
        >
          <div class="parent" :class="{ active: value == g.name }">{{ g.name }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script src="./statusButton.ts" lang="ts"></script>
<style lang="less" scoped>
@import url(./statusButton.less);
</style>
