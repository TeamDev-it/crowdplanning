<template>
  <div class="plan-map-tooltip" v-if="plan">
    <div class="image">
      <img v-if="coverImage && CoverImage" src="CoverImage" />
      <img v-else src="@/assets/images/placeholder-img.png" />
    </div>
    <div class="card-content">
      <div class="plan-data">
        <div class="title">
          <span v-if="plan.title">{{ plan.title.toUpperCase() }}</span>
        </div>
        <div class="description" v-if="plan.description" v-html="plan.description"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./planMapTooltip.ts" />

<style lang="less" scoped>
.plan-map-tooltip {
  min-height: 100px;
  background-color: var(--background-color);
  width: 300px;
  padding: 0.2rem 0.6rem;
  border-radius: var(--border-radius);
  cursor: pointer;
  overflow: hidden;
  max-height: 150px;

  display: grid;
  grid-template-rows: 1fr auto;
  gap: 0.3rem;

  .image {
    position: relative;
    display: flex;
    overflow: hidden;
    justify-content: center;
    flex-flow: column;
  }

  .cars-content {
    overflow: hidden;
  }
}
</style>
