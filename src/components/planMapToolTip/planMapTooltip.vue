<template>
  <div class="plan-map-tooltip" v-if="plan" >
    <div class="image">
      <img v-if="CoverImage" :src="CoverImage" />
      <img v-else-if="!CoverImage" src="@/assets/images/placeholder-img.png" />
    </div>
    <div class="card-content">
      <div class="plan-data">
        <div class="info">
          <strong class="title" v-if="plan.title">{{ plan.title.toUpperCase() }}</strong>
          <span class="description" v-if="plan.description" v-html="plan.description"></span>
          <div class="row">
            <div class="goToDetail" @click="openPlan">
              <span>{{ $t('plans.card.go-to-details', 'Vai al dettaglio') }}</span>
              <i class="ti ti-chevron-right"></i>
            </div>
            <div class="votes">
              <div v-if="canSeeRating()">
                <component :icon="false" :is="likeCounter" :type="type" :id="plan.id"></component>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./planMapTooltip.ts" />

<style lang="less" scoped>
@import url(./planMapTooltip.less);
</style>
