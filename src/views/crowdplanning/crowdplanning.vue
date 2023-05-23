<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div id="crowdplanning">
    <crowdplanning-header :currentUser="currentUser" @addTask="addTask()" />
    <div class="crowdplanning-content" v-if="!loading">
      <div class="groups">
        <scrollable-container>
          <crowdplanning-group-list v-if="plansGroupRoot && plansGroupRoot.id" :groups="groups" :rootGroup="plansGroupRoot"></crowdplanning-group-list>
        </scrollable-container>
        <div class="btn">
          <button class="square success" v-if="currentUser && hasPermission('canCreatePlansGroup')">
            <i class="ti ti-plus" @click="createGroup()"></i>
          </button>
        </div>
      </div>
      <div class="tasks" v-if="filteredTasks && filteredTasks.length && !selectedTask && groups.length">
        <scrollableContainer>
          <task-list :tasks="filteredTasks"></task-list>
        </scrollableContainer>
      </div>
      <div class="task-detail" v-if="selectedTask">
        <task-detail :task="selectedTask"> </task-detail>
      </div>
      <div class="map">
        <task-map v-if="(selectedGroup || plansGroupRoot) && states.length" :group="selectedGroup ?? plansGroupRoot" :states="states" :tasks="filteredTasks"></task-map>
      </div>
    </div>
  </div>
</template>
<script lang="ts" src="./crowdplanning.ts" />
<style lang="less" scoped>
@import url(./crowdplanning.less);
</style>
