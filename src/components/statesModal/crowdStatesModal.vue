<template>
  <div class="modal planstatus">
    <header>
      <h2>
        {{ $t(`taskStatusModal.title`, 'Organizza gli stati') }}
      </h2>
      <button class="square none close" @click="close()">
        <i class="ti ti-x"></i>
      </button>
    </header>
    <section class="can-scroll-y">
      <drop
        @drop="handleDropState(state, ...arguments)"
        @dragenter.prevent
        @dragover.prevent
        class="state"
        v-for="(state, sidx) in ['New', 'Open', 'Active', 'Review', 'Closed']"
        :key="sidx"
      >
        <div class="header">
          {{ $t(`taskstate.${state}`) }}
          <button class="none" @click="addState(state)">
            <i class="ti ti-plus"></i>
          </button>
        </div>
        <div class="state-container">
          <drop
            tag="article"
            @drop="handleDrop(s, ...arguments)"
            @dragenter.prevent
            @dragover.prevent
            v-for="(s, idx) in sortedStates.filter(s => s.generalStatus == state)"
            :key="`c-${idx}`"
          >
            <drag class="drag mini-card" :transfer-data="s">
              <i class="wt drag_indicator"></i>

              <small v-if="s.id">{{ s.shortName }}</small>
              <input
                v-else
                id="ciao"
                onkeypress="return /[a-zA-Z]/i.test(event.key)"
                type="text"
                v-model="s.shortName"
                :placeholder="$t('taskstate.shortname.placeholder', 'state shortname')"
              />
              <input id="ciao" type="text" v-model="s.name" :placeholder="$t('taskstate.name.placeholder', 'state name')" />
              <color-selector v-model="s.color"></color-selector>
              <button class="square none danger" @dblclick="remove(s)">
                <i class="ti ti-trash"></i>
              </button>
            </drag>
          </drop>
        </div>
      </drop>
    </section>
    <footer>
      <button @click="close()" disabled>
        <i class="ti ti-check"></i>
        <span>
          {{ $t('task.confirm', 'conferma e salva') }}
        </span>
      </button>
    </footer>
  </div>
</template>
<script src="./crowdStatesModal.ts" lang="ts"></script>
<style lang="less" scoped>
@import url(./crowdStatesModal.less);
</style>
