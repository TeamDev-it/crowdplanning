<template>
  <div class="group-list">
    <div class="item" @click="$event => (selectedCategory = null)" :class="{ active: !selectedCategory }">
      <span class="text">{{ $t('plans.groups.see_all', 'vedi tutto').toUpperCase() }}</span>
      <span class="icon" v-if="hasPermission('states.canedit') || hasPermission('states.cancreate')" @click="openStatesModal">
        <i class="ti ti-dots"></i>
      </span>
    </div>
    <crowdplanning-groups-item v-for="group in groups" :key="group.id" :value="group" :selectedCategory="selectedCategory" @click.native="_$event => (selectedCategory = group)" @changedGroup="changedGroup" />
  </div>
</template>

<script lang="ts" src="./crowdplanningGroupsList.ts" />

<style lang="less" scoped>
@import url(./crowdplanningGroupsList.less);
</style>
