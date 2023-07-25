<template>
  <div class="children-plans" v-if="!loading">
    <div class="header">
      {{ $t('plans.linked-plans', 'Progetti collegati') }}
    </div>
    <div class="content">
      <div class="row" v-for="child in children">
        <div class="name">
          <i class="ti ti-external-link" @click="onLinkedPlanClicked(child.id)"></i>
          <span>{{ child.title }}</span>
        </div>

        <div class="location" v-if="child.location">
          <i class="ti ti-map-pin"></i>
          <span>{{ getAddressFromId(child.id) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" src="./childrenPlans.ts" />

<style lang="less" scoped>
@import url(./childrenPlans.less);
</style>
