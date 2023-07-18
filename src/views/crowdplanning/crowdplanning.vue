<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div id="crowdplanning">
    <crowdplanning-header :currentUser="currentUser" @addTask="addTask()" />
    <div class="crowdplanning-content" :class="{'plan-selected': selectedTask}" v-if="!loading">
      <div class="groups" v-if="!selectedTask">
        <scrollable-container>
          <crowdplanning-group-list :key="componentKey" v-if="plansGroupRoot && plansGroupRoot.id" :groups="groups" :rootGroup="plansGroupRoot" @rootGroupChanged="rootGroupChanged"></crowdplanning-group-list>
        </scrollable-container>
        <div class="btn">
          <button class="square success" v-if="currentUser && hasPermission('groups.cancreate')">
            <i class="ti ti-plus" @click="createGroup()"></i>
          </button>
        </div>
      </div>
      <div class="tasks" v-if="filteredPlans && filteredPlans.length && !selectedTask && groups.length">
        <scrollableContainer>
          <task-list :tasks="filteredPlans"></task-list>
        </scrollableContainer>
      </div>
      <div class="task-detail" v-if="selectedTaskId">
        <task-detail :task="selectedTask"> </task-detail>
      </div>
      <div class="map" v-if="!selectedTaskId">
        <task-map v-if="(selectedGroup || plansGroupRoot) && states.length" :group="selectedGroup ?? plansGroupRoot" :states="states" :tasks="filteredPlans"></task-map>
      </div>
    </div>
  </div>
</template>
<script lang="ts" src="./crowdplanning.ts" />
<style lang="less" scoped>
@import url(./crowdplanning.less);
</style>
