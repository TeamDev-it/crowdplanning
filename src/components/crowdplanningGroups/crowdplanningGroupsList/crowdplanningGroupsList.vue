<template>
  <div class="group-list">
    <crowdplanning-groups-item v-for="category in categories" :key="category.id" :value="category" :selectedCategory="selectedCategory" />
  </div>
</template>

<script lang="ts" src="./crowdplanningGroupsList.ts" />

<style lang="less" scoped>
@import url(./crowdplanningGroupsList.less);
</style>
