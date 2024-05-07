<template>
  <div class="modal task-selector-crowdplanning">
    <header>
      <button class="square none" @click="close"><i class="ti ti-x"></i></button>
    </header>
    <section>
      <component :is="taskSelector" :ref="taskSelector" style="height: 100%" v-model="tasksList"></component>
    </section>
    <footer>
      <button class="square" @click="confirm()"><i class="ti ti-check"></i></button>
    </footer>
  </div>
</template>

<script src="./taskSelectorModal.ts" lang="ts"></script>

<style lang="less" >
.task-selector-crowdplanning {
  width: 70%;
  height: 70%;

  header {
    justify-content: flex-end;
    background-color: var(--crowdplanning-primary-color) !important;
  }

  section {
    .container {
      .head {
        background-color: var(--crowdplanning-light-color) ;
      }

      .search {
        background-color: var(--crowdplanning-primary-color);
      }
    }
  }

  footer {
    justify-content: flex-end;
    button {
        background-color: var(--crowdplanning-primary-color) !important;
    }
  }
}
</style>
