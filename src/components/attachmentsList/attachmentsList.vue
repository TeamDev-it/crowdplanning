<template>
  <div class="attachments" v-if="files.length">
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
</template>

<style lang="less" scoped>
@import url(./attachmentsList.less);
</style>

<script lang="ts" src="./attachmentsList.ts" />
