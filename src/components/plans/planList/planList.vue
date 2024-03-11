<template>
  <div class="plan-list">
    <plan-card v-for="plan in plans" :key="plan.id" :value="plan" @selectPlan="selectPlan" :plansGroupRoot="plansGroupRoot" :loggedIn="loggedIn"/>
  </div>
</template>

<style lang="less" scoped>
@import url(./planList.less);
</style>

<script lang="ts" src="./planList.ts" />
