<template>
  <div class="plan-card" v-if="!loading">
    <div class="image" v-if="coverImage && CoverImage">
      <div v-if="iconCode != ''" class="group-icon-card">
        <i :class="iconCode"></i>
      </div>
      <img :src="CoverImage" />
    </div>
    <div v-else-if="!coverImage && !CoverImage" class="image">
      <div v-if="iconCode != ''" class="group-icon-card">
        <i :class="iconCode"></i>
      </div>
      <img src="@/assets/images/placeholder-img.png" />
    </div>
    <div class="card-content">
      <div class="plan-data">
        <div class="title">
          <span v-if="value.title">{{ value.title.toUpperCase() }}</span>
        </div>
        <div class="description" v-if="value.description" v-html="value.description"></div>
      </div>
      <div class="commands" v-if="showCommands">
        
          <component  :is="likeViewer" :type="type" :id="value.id" ></component>
        
        <div class="go-detail colrow">
          <div class="text" @click="selectPlan">
            {{ $t('plans.card.go-to-details', 'Vai al dettaglio').toUpperCase() }}
          </div>
          <i class="ti ti-chevron-right"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
@import url(./planCard.less);
</style>

<script lang="ts" src="./planCard.ts" />
