<template>
  <div class="container">
    <div class="text" v-if="showText">
      {{ $t('plans.spid.log-in', 'Accedi per condividere la tua opinione!') }}
    </div>
    <div class="btn-container">
      <div class="button" @click="askLogin"></div>
    </div>
  </div>
</template>
<style lang="less" scoped>
@import url(./spidLogin.less);
</style>

<script lang="ts" src="./spidLogin.ts" />
