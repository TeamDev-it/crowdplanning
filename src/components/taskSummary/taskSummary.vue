<template>
  <div class="summary-container">
    <header>
      <div v-if="group" class="group">
        <i :class="iconCode(group?.iconCode ?? '')"></i>
        <span class="text">{{ group?.name }}</span>
      </div>
      <div v-if="plan.location" class="location">
        <i class="ti ti-map-pin"></i>
        <span>{{ addressLocation }}</span>
      </div>
      <div class="date">
        <i class="ti ti-calendar"></i>
        <span>{{ plan.dueDate }}</span>
      </div>
    </header>
    <article>
      <div class="title">{{ $t('plan.summary.description-label', 'Descrizione') }}</div>
      <div class="description" v-html="plan.description"></div>
    </article>
    <attachments-list v-if="files.length && workspaceId" :files="files" :workspaceId="workspaceId"></attachments-list>
  </div>
</template>

<style lang="less" scoped>
@import url(./taskSummary.less);
</style>

<script lang="ts" src="./taskSummary.ts" />
