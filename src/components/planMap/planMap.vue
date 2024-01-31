<template>
  <div class="plan-map">
    <component :is="mapComponent" :value="values" v-if="values && states && states.length" :center="center" />
  </div>
</template>

<script lang="ts" src="./planMap.ts" />

<style lang="less">
@import url(./planMap.less);
</style>
