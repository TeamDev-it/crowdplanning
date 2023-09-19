<template>
  <div class="summary-container">
    <header><h1>{{ plan.title }}</h1></header>
    <div class="cover-image" v-if="CoverImage">
      <img :src="CoverImage" />
    </div>
    <div>
      <div class="date">
        <i class="ti ti-calendar"></i>
        <span>{{ formattedDate }}</span>
      </div>

      <div v-if="plan.location && plan.locationName" class="location">
        <i class="ti ti-map-pin"></i>
        <span>{{ plan.locationName }}</span>
      </div>

      <div v-if="group" class="group">
        <i :class="iconCode(group?.iconCode ?? '')"></i>
        <span class="text">{{ group?.name }}</span>
      </div>
    </div>
    <article>
      <!-- <div class="title">{{ $t('plan.summary.description-label', 'Descrizione') }}</div> -->
      <div class="description" v-html="plan.description"></div>
    </article>
  </div>
</template>

<style lang="less" scoped>
@import url(./taskSummary.less);
</style>

<script lang="ts" src="./taskSummary.ts" />
