<template>
  <div class="detail-container">
    <div class="header">
      <div class="back" @click="back">
        <i class="ti ti-arrow-left"></i>
      </div>
      <div class="title">{{ $t('taskDetail.publish.title', 'Inserisci nuovo post') }}</div>
      <div class="commands">
        <button class="publish" @click="" disabled>
          <i class="ti ti-brand-open-source"></i>
          <span class="text">{{ $t('taskDetail.publish', 'Pubblica') }} </span>
        </button>
      </div>
    </div>
    <div class="content">
      <div class="task-summary-cont">
        <div class="summary-container">
          <header>
            <input class="title" type="text" placeholder="Inserisci titolo del post" />
          </header>
          <div class="cover-image">
            <componenet
              :ref="coverMediaGalleryRef"
              :is="mediaGallery"
              :fileLimit="1"
              :titleText="{ key: 'modal.cover-image-addPlan', value: ` ` }"
              :subtitleText="{ key: 'modal.cover-image-description-addPlan', value: ` ` }"
              :contentText="{ key: 'modal.cover-image-content-text', value: `Trascina qui l'immagine di copertina` }"
              :type="`${context}-COVER`"
              :inputFileTypes="'images'"
              :id="selectedPlan ?? ''"
              @filesUploaded="coverUploaded"
              @fileRemoved="coverRemoved"
              style="background-color: #e5e5e5; height: 100%; display: grid"
            ></componenet>
          </div>
          <div class="info-case"></div>
          <article>
            <div class="description">
              <header class="content-editor">
                <div class="cont">
                  <content-editor v-model="plan" @keydown.native.stop style="width: 100%; height: 100%"></content-editor>
                </div>
              </header>
            </div>
          </article>
        </div>
      </div>

      <div class="third-column" v-if="plan">
        <div class="fieldsets">
          <fieldset>
            <small>{{ $t('plans.modal.categoria', 'categoria*') }}</small>
            <select v-model="plan.groupId">
              <option value="" disabled>{{ $t('plans.modal.select.default_option', `Seleziona un'opzione`) }}</option>
              <option v-for="group in groups" :key="group" :value="group">
                {{ group.toString.name.toUpperCase() }}
              </option>
            </select>
          </fieldset>
          <fieldset class="position">
            <small>{{ $t('plans.modal.posizione', 'posizione').toLocaleUpperCase() }}</small>
            <component :is="esriGeocodingAutocomplete" v-if="!loading" v-model="plan.location" @locationSelected="locationSelected" @keydown.native.stop @keydown.native.enter.prevent="$event.preventDefault()"></component>
          </fieldset>
          <fieldset>
            <small>{{ $t('plans.modal.visible-layers').toLocaleUpperCase() }}</small>
            <input type="url" v-model="tmpVisibleLayer" :placeholder="$t('plans.modal.visible-layers-placeholder', 'Inserisci il link qui...')" @keydown.enter="confirmVisibleLayer()" />
          </fieldset>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./planModal.ts" />

<style lang="less" scoped>
@import url(./planModal.less);
</style>

<style lang="less">
.date-picker-container {
  time {
    font-family: 'Open Sans';
  }

  .datetime {
    height: 100%;
  }
}

// .content-editor-container {
//   .content-editor {

//   }
// }

.modal {
  header {
    &.media,
    &.cover-image {
      .media-gallery {
        .add-attachments {
          background-color: var(--grey-light);
          padding: 1rem 0;
          border-radius: var(--border-radius);
        }
      }
    }
  }
}
</style>
