<template>
  <div v-if="task" class="detail-container">
    <task-summary :task="task"></task-summary>
    <citizen-interaction></citizen-interaction>
    <div class="close" @click="clearTask">
      <i class="ti ti-x"></i>
    </div>
  </div>
</template>

<style lang="less" scoped>
@import url(./taskDetail.less);
</style>

<script lang="ts" src="./taskDetail.ts" />
