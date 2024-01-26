<template>
  <div class="item" :class="{ active: selectedCategory === value || selectedCategory?.id === value.id }" @click="setSelectedCategory(value)">
    <div class="group-detail">
      <i :class="iconCode"></i>
      <div class="detail-cont">
        <span class="text">{{ value.name }}</span>
        <small class="description text" v-tooltip="value.description">{{ value.description }} </small>
      </div>
    </div>
    <div class="commands">
      <!-- <div  @click="addSubGroup(value)">
        <i class="ti ti-plus"></i>
      </div> -->
      <div v-if="hasPermission('groups.canedit')" >
        <i class="ti ti-pencil" @click.stop="edit"></i>
      </div>
    </div>
    <crowdplanning-groups-item class="sub-item" v-for="children in value.children" :key="value.parentGroupId" :value="value" :selectedCategory="selectedCategory" @selectedCategory="setSelectedCategory(children)" @changedGroup="value" />
  </div>
</template>
<!-- <div class="sub" v-for="c in value.children">CIAOOOO</div> -->

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
