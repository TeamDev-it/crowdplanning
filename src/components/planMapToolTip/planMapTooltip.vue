<template>
  <div class="situationobject-card" v-if="plans" @click="editObject()">
    <div v-for="plan in plans" 
         :key="plan.title"
         class="field">
      <label>{{ plan.description }}: </label>
      
    </div>
  </div>
</template>

<script lang="ts" src="./planMapTooltip.ts" />

<style lang="less" scoped>
.situationobject-card {
  min-height: 100px;
  background-color: var(--background-color);
  width: 300px;
  padding: 0.2rem .6rem;
  border-radius: var(--border-radius);
  cursor: pointer;

  display: grid;
  grid-template-columns: auto 1fr;
  gap: .3rem;

  .field {
    display: contents;

    small { 
      overflow: hidden;
      text-overflow: ellipsis;
      display: block;
      white-space: nowrap;
    }
  }
}
</style>
