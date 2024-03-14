<template>
  <div class="crowd-group-item" v-if="value.id">
    <header @click="setSelectedCategory(value)" class="category" :class="{ active: selectedCategory?.id === value.id }">
      <div class="group-detail">
        <i :class="iconCode" v-if="treeLevel == 0"></i>
        <div class="detail-cont">
          <span class="text">{{ value.name }}</span>
          <small v-if="treeLevel == 0" class="description text" v-tooltip.top-end="value.description">{{ value.description }} </small>
        </div>
      </div>
      <div class="commands">
        <div v-if="hasPermission('groups.cancreate') && treeLevel < 3" @click="addSubGroup" >
          <i class="ti ti-plus"></i>
        </div>
        <div v-if="hasPermission('groups.canedit')">
          <i class="ti ti-pencil" @click="edit"></i>
        </div>
      </div>
    </header>
    <div class="children" v-if="children.length">
      <crowdplanning-groups-item
        class="child"
        v-for="child in children"
        :key="child.id"
        :value="child"
        :selectedCategory="selectedCategory"
        :treeLevel="treeLevel + 1"
        @selectedCategory="setSelectedCategory"
      />
    </div>
  </div>
</template>

<script lang="ts" src="./crowdplanningGroupsItem.ts" />

<style lang="less" scoped>
@import url(./crowdplanningGroupsItem.less);
</style>

<style lang="less">
.description {
  .tooltip {
    color: red;
  }
}
</style>
