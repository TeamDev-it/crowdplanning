<template>
  <div class="plan-map-tooltip" v-if="plan" @click="openPlan">
    <div class="image">
      <img v-if="CoverImage" :src="CoverImage" />
      <img v-else-if="!CoverImage" src="@/assets/images/placeholder-img.png" />
    </div>
    <div class="card-content">
      <div class="plan-data">
        <div class="info">
          <strong class="title" v-if="plan.title">{{ plan.title.toUpperCase() }}</strong>
          <span class="description" v-if="plan.description" v-html="plan.description"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./planMapTooltip.ts" />

<style lang="less" scoped>
.plan-map-tooltip {
  // display: grid;
  // grid-template-rows: 45% 55%;
  min-height: 100px;
  background-color: var(--background-color);
  width: 300px;
  padding: 0.2rem 0.6rem;
  border-radius: var(--border-radius);
  cursor: pointer;
  overflow: hidden;
  max-height: 250px;

  display: grid;
  grid-template-rows: 1fr auto;
  gap: 0.3rem;

  .image {
    position: relative;
    display: flex;
    overflow: hidden;
    justify-content: center;
    height: auto;
    flex-flow: column;
  }

  .card-content {
    overflow: hidden;
  }
  .info {
    .description {
      font-size: 0.9em;
      word-wrap: break-word;
      text-overflow: ellipsis;
      height: 63px;
      line-height: 1.6em;
      overflow: hidden;
      text-align: left;
      position: relative;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  }
}
</style>
