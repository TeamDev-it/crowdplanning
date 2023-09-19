<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div id="crowdplanning" :class="{ 'plan-selected': selectedTask }">
    <crowdplanning-header :currentUser="currentUser" @addTask="addTask()" @changeView="changeView()"/>
    <div class="crowdplanning-content" v-if="!loading">
      <div class="groups" v-if="!selectedTask">
        <!-- <scrollable-container> -->
        <crowdplanning-group-list :key="componentKey" v-if="plansGroupRoot && plansGroupRoot.id" :rootGroup="plansGroupRoot" @rootGroupChanged="rootGroupChanged"></crowdplanning-group-list>
        <!-- </scrollable-container> -->
        
      </div>
      <div class="task-and-map" :class="{noMap : !toggleMap}">
        <div class="tasks" v-if="filteredPlans && filteredPlans.length && !selectedTask" :class="{noMap : !toggleMap}">
          <scrollableContainer :class="{noMap : !toggleMap}">
            <task-list :tasks="filteredPlans" :class="{noMap : !toggleMap}"></task-list>
          </scrollableContainer>
        </div>
        <div class="task-detail" v-if="selectedTaskId">
          <task-detail></task-detail>
        </div>
        <div class="map" v-if="!selectedTaskId" v-show="toggleMap">
          <task-map v-if="(selectedGroup || plansGroupRoot) && states.length" :group="selectedGroup ?? plansGroupRoot"></task-map>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" src="./crowdplanning.ts" />
<style lang="less" scoped>
@import url(./crowdplanning.less);
</style>
