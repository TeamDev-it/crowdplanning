<template>
  <div class="summary-container">
    <div class="title-date">
      <div v-if="task.title">{{ task.title.toUpperCase() }}</div>
      <div v-if="task.creationDate">{{ taskDate }}</div>
    </div>
    <div class="description" v-html="task.description"></div>
    <div class="attachments">
      <div class="section-title">{{ $t('plans.attachments', 'allegati').toUpperCase() }}</div>
      <div class="files">
        <div class="images" v-if="images.length">
          <div class="text">{{ $t('plans.images', 'Immagini') }}</div>
          <img v-for="image of images" :key="image.id" :src="getImagePreview(image)" />
        </div>
        <div class="documents" v-if="documents.length">
          <div class="text">{{ $t('plans.documents', 'Documenti') }}</div>
          <div class="file" v-for="doc of documents" :key="doc.id" @click="downloadDocument(doc)">
            <img src="@/assets/images/placeholder_file.png" />
        </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
@import url(./taskSummary.less);
</style>

<script lang="ts" src="./taskSummary.ts" />
