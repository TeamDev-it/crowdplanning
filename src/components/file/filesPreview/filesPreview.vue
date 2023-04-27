<template>
  <div class="list-preview">
    <div class="container" v-for="(file, index) of files" :key="index">
      <img src="@/assets/images/placeholder_file.png" alt="file" />
      <div class="remove" @click="() => $emit('removeFromList', file)">
        <i class="ti ti-x"></i>
      </div>
      <div>
        {{ file.name }}
      </div>
    </div>
  </div>
</template>
<style lang="less" scoped>
@import url(./filesPreview.less);
</style>

<script lang="ts" src="./filesPreview.ts" />
