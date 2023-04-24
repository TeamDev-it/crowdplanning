<template>
  <div class="drag-and-drop" @dragover.prevent @drop.prevent>
    <div class="content" @drop="$events => dragFile($events)">
      <div class="text">
        <span>{{ $t(customTextLocaleKey, "Trascina qui le tue immagini oppure") }} <br /></span>
        <span class="clickable success" @click.prevent="uploadFromDevice">{{ $t(clickableTextLocaleKey, "caricale dal tuo PC") }}</span>
      </div>
      <component v-if="files.length" @removeFromList="removeFromList" @addToList="addToList" :is="getComponentType()" :files="files"></component>
    </div>
  </div>
</template>
<style lang="less" scoped>
@import url(./dragAndDrop.less);
</style>

<script lang="ts" src="./dragAndDrop.ts" />
