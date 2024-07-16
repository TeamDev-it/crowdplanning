<template>
  <div class="summary-container">
    <header>
      <h1 class="title">{{ plan.title }}</h1>
    </header>
    <div>
      <div class="cover-image" v-if="CoverImage" :style="{ backgroundImage: `url(${CoverImage})`}">
      </div>
      <div class="info-case">
        <div v-tooltip="$t('crowdplanning.planSummary-startDate' ,'Inizio progetto')" class="date info" v-if="plan.startDate">
          <i class="ti ti-calendar"></i>
          <span>{{ formattedStartDate }}</span>
        </div>

        <div v-if="plan.dueDate" class="date info"  v-tooltip="$t('crowdplanning.planSummary-dueDate' ,'Scadenza progetto')">
          <i class="ti ti-calendar-off"></i>
          <span>{{ formattedDuedDate }}</span>
        </div>

        <div v-if="group?.name" class="group info">
          <i :class="iconCode(group.iconCode ?? '')"></i>
          <span class="text">{{ group.name }}</span>
        </div>

        <div v-if="canSeeRating()">
          <component :is="likeCounter" :type="type" :id="plan.id"></component>
        </div>
      </div>
    </div>
    <article>
      <!-- <div class="title">{{ $t('plan.summary.description-label', 'Descrizione') }}</div> -->
      <div class="description" v-html="plan.description"></div>
    </article>
  </div>
</template>

<style lang="less" scoped>
@import url(./planSummary.less);
</style>
<style>
.summary-container {
  article {
    .description {
      h1 {
        font-size: 27px !important;
      }
      h2 {
        font-size: 23px;
      }
      h3 {
        font-size: 18px;
      }
    }
  }
}
</style>

<script lang="ts" src="./planSummary.ts" />
