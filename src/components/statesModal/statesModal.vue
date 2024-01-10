<template>
  <div class="modal planstatus">
    <header>
      <h2>
        {{ $t(`planStatusModal.title`, 'Organizza gli stati') }}
      </h2>
    </header>
    <section class="can-scroll-y">
      <drop @drop="handleDropState(state, ...arguments)" class="state" v-for="(state, sidx) in ['New', 'Open', 'Active', 'Review', 'Closed']" :key="sidx">
        <div class="header">
          {{ $t(`planstate.${state}`) }}
          <button class="none" @click="addState(state)">
            <i class="ti ti-plus"></i>
          </button>
        </div>
        <div class="state-container">
          <drop tag="article" @drop="handleDrop(s, ...arguments)" v-for="(s, idx) in sortedStates.filter(s => s.generalStatus == state)" :key="`c-${idx}`">
            <drag class="drag mini-card" :transfer-data="s">
              <i class="wt drag_indicator"></i>

              <small v-if="s.id">{{ idx + 1 }}. {{ s.shortName }}</small>
              <input v-else type="text" v-model="s.shortName" :placeholder="$t('planstate.shortname.placeholder', 'state shortname')" />
              <input type="text" v-model="s.name" :placeholder="$t('planstate.name.placeholder', 'state name')" />
              <color-selector v-model="s.color"></color-selector>
              <button class="square none danger" @dblclick="remove(s)">
                <i class="wt delete"></i>
              </button>
            </drag>
          </drop>
        </div>
      </drop>
    </section>
    <!-- <footer>
      </footer> -->
    <button class="close" @click="close()">
      <i class="wt close"> </i>
    </button>
  </div>
</template>

<script src="./statesModal.ts" lang="ts"></script>

<style lang="less">
@import url(./statesModal.less);
</style>
