<template>
  <div
    class="crowdplanning-status-button"
    @click.stop="toggleOpened()"
    @keydown.enter="toggleOpened()"
    :class="{ asselect: showAsSelect, notselected: disableRoot && value.id === value.id }"
  >
    <div v-if="showAsSelect" class="select-cont">
      <div class="select">
        <span class="placeholder" v-if="!value">{{ $t('plans.statusButton.placeholder', 'Scegli uno stato') }}</span>
        <span class="statusName" v-else>{{ statusName }}</span>
        <i class="ti ti-chevron-down" v-if="!listOpened"></i>
        <i class="ti ti-chevron-up" v-if="listOpened"></i>
      </div>
    </div>
    <div v-else>
      <div class="ispan">
        <!-- <i class="ti ti-subtask"></i> -->
        <span class="statusName">{{ statusName }}</span>
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
      </div>
    </div>
  </div>
</template>
<script src="./statusButton.ts" lang="ts"></script>
<style lang="less" scoped>
@import url(./statusButton.less);
</style>
