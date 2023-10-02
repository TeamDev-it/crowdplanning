<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div id="crowdplanning" :class="{ 'plan-selected': selectedPlan, 'plan-added': addPlanSec }">
    <crowdplanning-header :currentUser="currentUser" @addTask="addPlan()" @changeView="changeView()"/>
    <div class="crowdplanning-content" v-if="!loading">
      <div class="groups" v-if="!selectedPlan && !addPlanSec">
        <!-- <scrollable-container> --> 
        <crowdplanning-group-list :key="componentKey" v-if="plansGroupRoot && plansGroupRoot.id" :rootGroup="plansGroupRoot" @selectedCategory="setSelectedGroup" @rootGroupChanged="rootGroupChanged"></crowdplanning-group-list>
        <!-- </scrollable-container> -->
        
      </div>
      <div class="task-and-map" :class="{noMap : !toggleMap}">
        <div class="tasks" v-if="filteredPlans && filteredPlans.length && !selectedPlan && !addPlanSec" :class="{noMap : !toggleMap}">
          <scrollableContainer :class="{noMap : !toggleMap}">
            <task-list :tasks="filteredPlans" :class="{noMap : !toggleMap}" @selectPlan="setSelectedPlan"></task-list>
          </scrollableContainer>
        </div>
        <div class="task-detail" v-if="selectedPlan">
          <task-detail :selectedPlan="selectedPlan" :key="selectedPlan.id" @goback="goBack"></task-detail>
        </div>
        <div class="task-detail" v-if="addPlanSec">
          <planModal @goback="goBack"> </planModal>
        </div> 
        <div class="map" v-if="!selectedPlan" v-show="toggleMap">
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
