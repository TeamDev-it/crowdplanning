<template>
  <div class="task-card" v-if="!loading">
    <div class="image" v-if="coverImageUri">
      <img :src="coverImageUri" :alt="$t('plans.cover-image', 'Immagine di copertina')" />
    </div>
    <div class="card-content">
      <div class="task-data">
        <div class="date colrow">
          <i class="ti ti-calendar-off"></i>
          <div class="text">{{ taskDate }}</div>
        </div>
        <div class="title">
          <span v-if="value.title">{{ value.title.toUpperCase() }}</span>
        </div>
        <div class="description" v-if="value.description" v-html="value.description">
        </div>
      </div>
      <div class="commands" v-if="showCommands">
        <div class="go-detail colrow">
          <div class="text" @click="selectTask">
            {{ $t('plans.card.go-to-details', 'Vai al dettaglio').toUpperCase() }}
          </div>
          <i class="ti ti-chevron-right"></i>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="less" scoped>
@import url(./taskCard.less);
</style>
<script lang="ts" src="./taskCard.ts" />
