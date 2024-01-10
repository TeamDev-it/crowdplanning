<template>
  <div class="modal taskstatus">
    <header>
      <h2>
        {{ $t(`taskStatusModal.title`, 'Organizza gli stati') }}
      </h2>
    </header>
    <section class="can-scroll-y">
      <drop @drop="handleDropState(state, ...arguments)" class="state" v-for="(state, sidx) in ['New', 'Open', 'Active', 'Review', 'Closed']" :key="sidx">
        <div class="header">
          {{ $t(`taskstate.${state}`) }}
          <button class="none" @click="addState(state)">
            <i class="ti ti-plus"></i>
          </button>
        </div>
        <div class="state-container">
          <drop tag="article" @drop="handleDrop(s, ...arguments)" v-for="(s, idx) in sortedStates.filter(s => s.generalStatus == state)" :key="`c-${idx}`">
            <drag class="drag mini-card" :transfer-data="s">
              <i class="wt drag_indicator"></i>

              <small v-if="s.id">{{ idx + 1 }}. {{ s.shortName }}</small>
              <input v-else type="text" v-model="s.shortName" :placeholder="$t('taskstate.shortname.placeholder', 'state shortname')" />
              <input type="text" v-model="s.name" :placeholder="$t('taskstate.name.placeholder', 'state name')" />
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
        <button class="success" @click="close()"></button>
      </footer> -->
    <button class="close" @click="close()">
      <i class="wt close"> </i>
    </button>
  </div>
</template>
<script src="./crowdStatesModal.ts" lang="ts"></script>
<style lang="less" scoped>
@import url(./crowdStatesModal.less);
</style>
