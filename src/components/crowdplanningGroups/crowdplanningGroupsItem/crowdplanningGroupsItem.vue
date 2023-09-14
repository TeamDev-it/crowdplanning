<template>
  <div class="item" :class="{ active: selectedCategory === value || selectedCategory?.id === value.id }">
    <div class="group-detail">
      <i :class="iconCode"></i>
      <span class="text">{{ value.name }}</span>
    </div>
    <div v-if="hasPermission('groups.canedit')" class="commands">
      <i class="ti ti-pencil" @click.stop="edit" />
    </div>
  </div>
</template>

<script lang="ts" src="./crowdplanningGroupsItem.ts" />

<style lang="less" scoped>
@import url(./crowdplanningGroupsItem.less);
</style>
