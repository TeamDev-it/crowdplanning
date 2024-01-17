<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div id="crowdplanning" :class="{ 'plan-selected': selectedPlan, 'plan-added': addPlanSec || editPlan }">
    <crowdplanning-header :currentUser="currentUser" @addPlan="addPlan()" @changeView="changeView()" @expiredPrj="noExpiredPrj" />
    <div class="crowdplanning-content" v-if="!loading">
      <div class="groups" v-if="!selectedPlan && !addPlanSec && !editPlan">
        <crowdplanning-group-list
          :key="componentKey"
          v-if="plansGroupRoot && plansGroupRoot.id"
          :rootGroup="plansGroupRoot"
          @selectedNoCategory="noGroup"
          @selectedCategory="setSelectedGroup"
          :selectedCategory="selectedGroup"
          @rootGroupChanged="rootGroupChanged"
        ></crowdplanning-group-list>
      </div>
      <div class="plan-and-map" :class="{ noMap: !toggleMap }" @goback="goBack">
        <div class="plans" v-if="filteredPlans && filteredPlans.length && !selectedPlan && !addPlanSec && !editPlan" :class="{ noMap: !toggleMap }">
          <scrollableContainer :class="{ noMap: !toggleMap }">
            <plan-list :plans="filteredPlans" :class="{ noMap: !toggleMap }" @selectPlan="setSelectedPlan" />
          </scrollableContainer>
        </div>
        <div class="plan-detail" v-if="selectedPlan">
          <plan-detail :currentUser="currentUser" :selectedPlan="selectedPlan" :key="selectedPlan.id" @goback="goBack" @edit="edit" />
        </div>
        <div class="plan-detail" v-else-if="addPlanSec">
          <planModal @goback="goBack" :groups="plansGroupRoot" :plans="filteredPlans"> </planModal>
        </div>
        <div class="plan-detail" v-else-if="editPlan">
          <planModal @goback="goBack" :groups="plansGroupRoot" :plans="filteredPlans" :editable="editable"> </planModal>
        </div>
        <div class="map" v-if="!selectedPlan && !addPlanSec && !editPlan" v-show="toggleMap">
          <plan-map v-if="(selectedGroup || plansGroupRoot) && states.length" :center="mapCenter" :states="states" :plans="filteredPlans" :group="selectedGroup ?? plansGroupRoot" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./crowdplanning.ts" />

<style lang="less" scoped>
@import url(./crowdplanning.less);
</style>
