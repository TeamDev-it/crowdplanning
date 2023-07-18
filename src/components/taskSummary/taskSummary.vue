<template>
  <div class="summary-container">
    <div class="cover-image" v-if="CoverImage">
      <img :src="CoverImage" />
    </div>
    <header>
      <div class="date">
        <i class="ti ti-calendar"></i>
        <span>{{ formattedDate }}</span>
      </div>

      <div v-if="plan.location" class="location">
        <i class="ti ti-map-pin"></i>
        <span>{{ addressLocation }}</span>
      </div>

      <div v-if="group" class="group">
        <i :class="iconCode(group?.iconCode ?? '')"></i>
        <span class="text">{{ group?.name }}</span>
      </div>
    </header>
    <article>
      <div class="title">{{ $t('plan.summary.description-label', 'Descrizione') }}</div>
      <div class="description" v-html="plan.description"></div>
    </article>
  </div>
</template>

<style lang="less" scoped>
@import url(./taskSummary.less);
</style>

<script lang="ts" src="./taskSummary.ts" />
