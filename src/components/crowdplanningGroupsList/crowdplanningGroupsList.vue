<template>
  <div class="group-list">
    <div class="item main" @click="setNullCategory" :class="{ active: !selectedCategory }">
      <span class="text">{{ $t('plans.groups.see_all', 'Tutte le categorie') }}</span>
      <div class="btns">
        <span class="icon" v-if="hasPermission('groups.cancreate')" @click="createGroup">
          <i class="ti ti-plus"></i>
        </span>
        <span class="icon" v-if="hasPermission('states.canedit')" @click="openStatesModal()">
          <i class="ti ti-dots"></i>
        </span>
      </div>
    </div>
    <div class="childrens">
      <crowdplanning-groups-item
        v-for="group in rootGroup.children"
        :idx="0"
        :key="group.id"
        :value="group"
        :selectedCategory="selectedCategory"
        @selectedCategory="setSelectedCategory"
        @changedGroup="changedGroup"
      />
    </div>
  </div>
</template>

<script lang="ts" src="./crowdplanningGroupsList.ts" />

<style lang="less" scoped>
@import url(./crowdplanningGroupsList.less);
</style>
