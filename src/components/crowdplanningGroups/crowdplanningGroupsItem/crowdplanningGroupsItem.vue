<template>
  <div class="item" :class="{ active: selectedCategory === value || selectedCategory?.id === value.id }">
    <div class="group-detail">
      <i :class="iconCode"></i>
      <div class="detail-cont">
        <span class="text">{{ value.name }}</span>
        <!-- <small class="text">{{ value.description }}</small> -->
      </div>
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
