<template>
  <div class="detail-container">
    <div class="header">
      <div class="back" @click="back">
        <i class="ti ti-arrow-left"></i>
      </div>
      <div v-if="editable" class="title">{{ $t('taskDetail.modify.title', 'Modifica post') }}</div>
      <div v-else class="title">{{ $t('taskDetail.publish.title', 'Inserisci nuovo post') }}</div>
      <div class="commands">
        <button class="publish" @click="confirm" type="submit" v-if="!editable">
          <i class="ti ti-presentation"></i>
          <span class="text">{{ $t('taskDetail.publish', 'Pubblica') }} </span>
        </button>
        <button class="danger" v-tooltip="$t('taskDetail.delete', 'doppio click per eliminare')" v-if="editable" @dblclick="remove">
          <i class="ti ti-trash"></i>
        </button>
        <button class="warning" v-tooltip="'annulla modifiche'" v-if="editable" @click="back">
          <i class="ti ti-arrow-back"></i>
        </button>
        <button class="publish" @click="confirm" type="submit" v-if="editable">
          <i class="ti ti-presentation"></i>
          <span class="text">{{ $t('taskDetail.saveMod', 'Salva') }} </span>
        </button>
      </div>
    </div>
    <div class="content" v-if="plan">
      <div class="task-summary-cont">
        <div class="summary-container">
          <header>
            <input class="title" type="text" placeholder="Inserisci titolo del post" v-model="plan.title" />
          </header>
          <div class="cover-image" v-if="(plan && plan.description) || !editable">
            <componenet
              :ref="coverMediaGalleryRef"
              :is="mediaGallery"
              :fileLimit="1"
              :titleText="{ key: 'modal.cover-image-addPlan', value: `` }"
              :subtitleText="{ key: 'modal.cover-image-description-addPlan', value: `` }"
              :contentText="{ key: 'modal.cover-image-content-text', value: `Trascina qui l'immagine di copertina` }"
              :type="`${context}-COVER`"
              :inputFileTypes="'images'"
              :id="plan.id ?? ''"
              @filesUploaded="coverUploaded"
              @fileRemoved="coverRemoved"
              style="background-color: #e5e5e5; height: 100%; display: grid"
            ></componenet>
          </div>
          <div class="info-case"></div>
          <article v-if="(plan && plan.description) || !editable">
            <!-- <article v-if="plan" > -->
            <div class="description">
              <header class="content-editor">
                <div class="cont">
                  <content-editor v-model="plan.description" @keydown.native.stop style="width: 100%; height: 100%" />
                </div>
              </header>
            </div>
          </article>
        </div>
      </div>
      <div class="third-column">
        <div class="fieldsets">
          <fieldset>
            <small>{{ $t('plans.modal.categoria', 'categoria*') }}</small>
            <select v-model="plan.groupId" class="category">
              <option value="" disabled selected>{{ $t('plans.modal.select.default_option', `Seleziona un'opzione`) }}</option>
              <option class="opt" v-for="group in groups.children" :key="group.id" :value="group.id">
                {{ group.name }}
              </option>
            </select>
          </fieldset>
          <fieldset class="position">
            <small>{{ $t('plans.modal.posizione', 'posizione').toLocaleUpperCase() }}</small>
            <component class="position-input" v-model="plan.location" :is="esriGeocodingAutocomplete" @locationSelected="locationSelected" @keydown.native.stop @keydown.native.enter.prevent="$event.preventDefault()"></component>
          </fieldset>
          <fieldset>
            <small>{{ $t('plans.modal.visible-layers').toLocaleUpperCase() }}</small>
            <input class="layer" type="url" v-model="tmpVisibleLayer" :placeholder="$t('plans.modal.visible-layers-placeholder', 'Inserisci il link qui...')" @keydown.enter="confirmVisibleLayer()" />
          </fieldset>

          <fieldset class="area fixed">
            <small>{{ $t('plans.modal.start-date', 'data inizio') }}</small>
            <div class="date-picker-container">
              <date-picker v-model="plan.startDate" @keydown.native.stop mode="dateTime" timezone="utc" required>
                <template v-slot="{ inputEvents }">
                  <date-time :value="plan.startDate" :events="inputEvents"></date-time>
                </template>
              </date-picker>
            </div>
          </fieldset>

          <fieldset class="area fixed">
            <small>{{ $t('plans.modal.due-date', 'data fine') }}</small>
            <div class="date-picker-container">
              <date-picker v-model="plan.dueDate" @keydown.native.stop mode="dateTime" timezone="utc">
                <template v-slot="{ inputEvents }">
                  <date-time :value="plan.dueDate" :events="inputEvents"></date-time>
                </template>
              </date-picker>
            </div>
          </fieldset>

          <header v-if="plans" class="cluster">
            <div class="row"> 
              <span>{{ $t('plans.modal.has-cluster-parent-label', 'Fa parte di un altro progetto').toUpperCase() }}</span>
              <toggle v-model="hasClusterParent" @keydown.native.stop></toggle>
            </div>
            <div v-if="hasClusterParent" class="autocomplete">
              <autocomplete
                v-model="plan.parentId"
                :inputValues="plans"
                :filterFunction="autocompleteFilterFunction"
                :placeholderKey=" $t('plans.modal.plan.autocomplete', 'scrivi il titolo del progetto...')"
                :showThisPropertyAsItemName="'title'"
                @valueChanged="valueChanged"
              ></autocomplete>
            </div>
          </header>

          <header class="toggle">
            <div class="row">
              <span>{{ $t('plans.modal.citizen-can-view-others-comments', 'CONSENTI AL RUOLO CITTADINO DI VISUALIZZARE I COMMENTI ALTRUI').toUpperCase() }}</span>
              <toggle v-model="plan.citizensCanSeeOthersComments" @keydown.native.stop />
            </div>
          </header>

          <header class="toggle">
            <div class="row">
              <span>{{ $t('plans.modal.citizen-can-view-others-votes', 'CONSENTI AL RUOLO CITTADINO DI VISUALIZZARE VOTAZIONI ALTRUI').toUpperCase() }}</span>
              <toggle v-model="plan.citizensCanSeeOthersRatings" @keydown.native.stop />
            </div>
          </header>
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
.third-column {
  .fieldsets {
    .position {
      .position-input {
        .esri-search__sources-button {
          display: none;
        }
        .esri-search__input-container {
          padding-left: 0.7rem;
        }

        .esri-input {
          padding: 0;
        }
      }
    }
  }
}

.description {
  .content-editor {
    .cont {
      /* Basic editor styles */
      .ProseMirror {
        height: 100%;
        position: relative;
        padding: 0.5rem;
        border: none !important;
        outline: none;

        > * + *,
        p {
          margin-top: 0em;
          margin-bottom: 0rem;
        }

        img {
          max-width: 100%;
          height: auto;
        }

        hr {
          margin: 1rem 0;
        }
      }
    }
  }
}

.date-picker-container {
  width: 100%;
  height: 40px;

  time {
    font-family: 'Open Sans';
  }

  .datetime {
    height: 100%;
  }
}

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
