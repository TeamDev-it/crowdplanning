<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div id="crowdplanning">
    <crowdplanning-header :currentUser="currentUser" @addTask="addTask()" />
    <div class="crowdplanning-content">
      <div class="groups">
        <scrollable-container v-if="plansGroupRoot && plansGroupRoot.id && plansGroupRoot.children.length">
          <crowdplanning-group-list :groups="groups"></crowdplanning-group-list>
        </scrollable-container>
        <div class="btn">
          <button class="square success" v-if="currentUser">
            <i class="ti ti-plus" @click="createGroup()"></i>
          </button>
        </div>
      </div>
      <div class="tasks">
        <scrollableContainer v-if="tasks && tasks.length">
          <task-list :tasks="tasks"></task-list>
        </scrollableContainer>
      </div>
    </div>
  </div>
</template>
<script lang="ts" src="./crowdplanning.ts" />
<style lang="less" scoped>
@import url(./crowdplanning.less);
</style>
