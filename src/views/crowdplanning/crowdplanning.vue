<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div id="crowdplanning" :class="{ 'plan-selected': selectedPlan, 'plan-added': addPlanSec || editPlan }">
    <crowdplanning-header
      :currentUser="currentUser"
      @addPlan="addPlan()"
      @changeViewMap="changeViewMap()"
      @changeViewProj="changeViewProj()"
      :group="selectedGroup"
      @toggleMenu="toggleMenu()"
      @changeViewSimple="changeViewSimple()"
      @changeViewFromIssue="changeViewFromIssue()"
    />
    <div class="crowdplanning-content" v-if="!loading" :class="{ noGroups: noGroups }">
      <div class="groups" v-if="!selectedPlan && !addPlanSec && !editPlan">
        <crowdplanning-group-list
          :key="componentKey"
          v-if="plansGroupRoot && plansGroupRoot.id"
          :rootGroup="plansGroupRoot"
          @selectedNoCategory="noGroup"
          @selectedCategory="setSelectedGroup"
          :selectedCategory="selectedGroup"
          @rootGroupChanged="rootGroupChanged"
        />
      </div>
      <div class="plan-and-map" :class="{ noMap: !toggleMap, noProj: !toggleProj }" @goback="goBack">
        <div class="plans" v-if="filteredPlans && !selectedPlan && !addPlanSec && !editPlan && states.length" :class="{ noMap: !toggleMap }" v-show="toggleProj">
          <scrollableContainer :class="{ noMap: !toggleMap }">
            <plan-list :plans="filteredPlans" :class="{ noMap: !toggleMap }" @selectPlan="setSelectedPlan" :plansGroupRoot="plansGroupRoot" :loggedIn="loggedIn"/>
          </scrollableContainer>
        </div>

        <!-- <div class="plan-detail" v-if="actualview == 'selectedPlan'"> -->
        <div class="plan-detail" v-if="selectedPlan">
          <plan-detail :currentUser="currentUser" :selectedPlan="selectedPlan" :key="selectedPlan.id" @goback="goBack" @edit="edit" :loggedIn="loggedIn"/>
          <!-- <router-view></router-view> -->
        </div>
        <div class="plan-detail" v-else-if="addPlanSec">
          <planModal @goback="goBack" :groups="plansGroupRoot" :newPlan="editable"> </planModal>
        </div>
        <div class="plan-detail" v-else-if="editPlan">
          <planModal @goback="goBack" :groups="plansGroupRoot" :editable="editable"> </planModal>
        </div>
        <div class="map" v-if="!selectedPlan && !addPlanSec && !editPlan" v-show="toggleMap">
          <plan-map
            v-if="(selectedGroup || plansGroupRoot) && states.length"
            :center="mapCenter"
            :states="states"
            :plans="filteredPlans"
            :group="selectedGroup ?? plansGroupRoot"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./crowdplanning.ts" />

<style lang="less" scoped>
@import url(./crowdplanning.less);
</style>
<style lang="less">
#crowdplanning {
  button {
    &.void {
      color: var(--crowdplanning-primary-color);

      &:hover {
        color: var(--crowdplanning-dark-color) !important ;
      }

      &.is-active {
        background: var(--crowdplanning-light-color) !important;
        border-color: var(--crowdplanning-light-color) !important;
        color: var(--white);
      }
    }

    &.square:focus {
      border: 1px solid var(--crowdplanning-primary-color) !important;
    }
  }  
}
</style>
