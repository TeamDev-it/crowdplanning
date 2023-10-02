<template>
  <div class="group-list">
    <div class="item main" @click="$event => (selectedCategory = null)" :class="{ active: !selectedCategory }">
      <span class="text">{{ $t('plans.groups.see_all', 'Tutte le categorie') }}</span>
      <span class="icon" v-if="hasPermission('groups.cancreate')" @click="createGroup">
        <i class="ti ti-plus"></i>
      </span>
    </div>
    <crowdplanning-groups-item v-for="group in rootGroup.children" :key="group.id" :value="group" :selectedCategory="selectedCategory" @selectedCategory="setSelectedCategory()" @changedGroup="changedGroup" />
  </div>
</template>

<script lang="ts" src="./crowdplanningGroupsList.ts" />

<style lang="less" scoped>
@import url(./crowdplanningGroupsList.less);
</style>
