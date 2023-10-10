<template>
  <header>
    <div>
      <div class="search">
        <input type="text" :placeholder="$t(`task.search`, 'cerca')" v-model.trim="searchedValue" />
      </div>
    </div>
    <div class="header-content">
      <div class="btn">
        <button class="square success" v-if="currentUser && hasPermission('plans.cancreate')">
          <i class="ti ti-plus" @click="$event => addTask()"></i>
        </button>
      </div>
    </div>
  </header>
</template>

<script lang="ts" src="./crowdplanningHeader.ts" />

<style lang="less" scoped>
@import url(./crowdplanningHeader.less);
</style>
