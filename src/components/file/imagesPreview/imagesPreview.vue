<template>
  <div class="list-preview">
    <div class="container" v-for="(file, index) of files" :key="index">
      <img :src="createObjectUrl(file)" alt="file" />
      <div class="remove" @click="() => $emit('removeFromList', file)">
        <i class="ti ti-x"></i>
      </div>
    </div>
  </div>
</template>
<style lang="less" scoped>
@import url(./imagesPreview.less);
</style>
<script lang="ts" src="./imagesPreview.ts" />
