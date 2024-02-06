<template>
  <div class="crowd-group-item" v-if="value.id">
    <header @click="setSelectedCategory(value)" :class="{ active: selectedCategory?.id === value.id }">
      <div class="group-detail">
        <i :class="iconCode" v-if="treeLevel == 0"></i>
        <div class="detail-cont">
          <span class="text">{{ value.name }}</span>
          <small class="description text" v-tooltip="value.description">{{ value.description }} </small>
        </div>
      </div>
      <div class="commands">
        <div v-if="hasPermission('groups.cancreate')" @click="addSubGroup" >
          <i class="ti ti-plus"></i>
        </div>
        <div v-if="hasPermission('groups.canedit')">
          <i class="ti ti-pencil" @click.stop="edit"></i>
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
