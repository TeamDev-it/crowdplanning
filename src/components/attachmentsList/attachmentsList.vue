<template>
  <div class="attachments" v-if="files.length">
    <div class="section-title">{{ $t('plans.attachments', 'allegati').toUpperCase() }}</div>
    <div class="files" :class="{ row: orientation === 'row' }">
      <div class="images" v-if="images.length">
        <div class="text">{{ $t('plans.images', 'Immagini') }}</div>
        <div class="images-container">
          <div class="container" v-for="(image, index) of images" :key="image.id">
            <img :src="getImagePreview(image)" alt="file" />
            <div v-if="editable && hasPermission('plans.canedit')" class="remove" @click="() => remove(image.id)">
              <i class="ti ti-x"></i>
            </div>
          </div>
        </div>
      </div>
      <div class="documents" v-if="documents.length">
        <div class="text">{{ $t('plans.documents', 'Documenti') }}</div>
        <div class="file-container">
          <div class="file" v-for="(doc, index) of documents" :key="doc.id" @click="downloadDocument(doc)">
            <img src="@/assets/images/placeholder_file.png" />
            <div v-if="editable && hasPermission('plans.canedit')" class="remove" @click.prevent.stop="() => remove(doc.id)">
              <i class="ti ti-x"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
@import url(./attachmentsList.less);
</style>

<script lang="ts" src="./attachmentsList.ts" />
