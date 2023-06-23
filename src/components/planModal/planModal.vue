<template>
  <form @submit.prevent="confirm" @keydown.enter="$event.preventDefault()">
    <div class="modal task">
      <header class="title">
        <input
          type="text"
          @keydown.native.stop
          :class="{ error: errors['title'] }"
          :placeholder="$t('plans.title', 'Inserisci qui il titotlo')"
          class="transparent title"
          v-model="task.title"
          maxlength="110"
          required
          v-validate="(errs, a) => setError('title', errs)"
        />
        <button class="square none" @click="close()">
          <i class="ti ti-x"></i>
        </button>
      </header>

      <section>
        <header class="status">
          <fieldset>
            <small>{{ $t('plans.modal.categoria', 'categoria*').toUpperCase() }}</small>
            <select v-model="task.groupId" required @keydown.native.stop>
              <option value="" disabled>{{ $t('plans.modal.select.default_option', "Seleziona un'opzione") }}</option>
              <option v-for="group of groups" :key="group.id" :value="group.id">
                {{ group.name.toUpperCase() }}
              </option>
            </select>
          </fieldset>
          <fieldset>
            <small>{{ $t('plans.modal.posizione', 'posizione').toLocaleUpperCase() }}</small>
            <component :is="esriGeocodingAutocomplete" v-if="!loading" v-model="locationName" @locationSelected="locationSelected" @keydown.native.stop @keydown.native.enter.prevent="$event => $event.preventDefault()"></component>
          </fieldset>
          <fieldset>
            <small>{{ $t('plans.modal.cover-image', 'Immagine di copertina').toLocaleUpperCase() }}</small>
            <input type="file" :accept="imageContentTypes" @change="$event => onChangeCoverImage($event)" :required="!task.hasCoverImage" @keydown.native.prevent />
          </fieldset>
        </header>

        <header class="map-settings">
          <fieldset>
            <small>{{ $t('plans.modal.visible-layers').toLocaleUpperCase() }}</small>
            <input type="url" v-model="tmpVisibleLayer" :placeholder="$t('plans.modal.visible-layers-placeholder', 'Inserisci il link qui...')" @keydown.enter="$event => confirmVisibleLayer()" />
          </fieldset>
          <fieldset>
            <div v-for="(layer, idx) in task.visibleLayers">
              <i class="ti ti-x" @click="removeLayer(idx)"></i>
              <p>{{ layer }}</p>
            </div>
          </fieldset>
        </header>

        <header class="date">
          <fieldset>
            <small>{{ $t('plans.modal.start-date', 'data inizio').toUpperCase() }}</small>
            <div class="date-picker-container">
              <date-picker v-model="task.startDate" @keydown.native.stop mode="dateTime" timezone="utc" required>
                <template v-slot="{ inputEvents }">
                  <date-time :value="task.startDate" :events="inputEvents"></date-time>
                </template>
              </date-picker>
            </div>
          </fieldset>

          <fieldset>
            <small>{{ $t('plans.modal.due-date', 'data fine').toUpperCase() }}</small>
            <div class="date-picker-container">
              <date-picker v-model="task.dueDate" @keydown.native.stop mode="dateTime" timezone="utc">
                <template v-slot="{ inputEvents }">
                  <date-time :value="task.dueDate" :events="inputEvents"></date-time>
                </template>
              </date-picker>
            </div>
          </fieldset>
        </header>

        <header class="content-editor">
          <div>
            <small>{{ $t('plans.modal.description', 'descrizione*').toUpperCase() }}</small>
            <content-editor v-if="!loading" v-model="task.description" @keydown.native.stop></content-editor>
          </div>
        </header>

        <header>
          <!-- component mediagallery -->
        </header>

        <header v-if="plans.length">
          <div>
            <span>{{ $t('plans.modal.has-cluster-parent-label', 'Fa parte di un altro progetto') }}</span>
            <toggle v-model="hasClusterParent" @keydown.native.stop></toggle>
          </div>
          <div v-if="hasClusterParent">
            <autocomplete
              v-model="task.parentId"
              :inputValues="plans"
              :filterFunction="autocompleteFilterFunction"
              :labelKey="'PLANS.modal.plan.autocomplete'"
              :placeholderKey="'PLANS.modal.plan.autocomplete.placeholder'"
              :showThisPropertyAsItemName="'title'"
              @valueChanged="valueChanged"
            ></autocomplete>
          </div>
        </header>

        <header class="toggle">
          <span>{{ $t('plans.modal.citizen-can-view-others-comments', 'CONSENTI AL RUOLO CITTADINO DI VISUALIZZARE I COMMENTI ALTRUI').toUpperCase() }}</span>
          <toggle v-model="task.citizensCanSeeOthersComments" @keydown.native.stop />
        </header>

        <header class="toggle">
          <span>{{ $t('plans.modal.citizen-can-view-others-votes', 'CONSENTI AL RUOLO CITTADINO DI VISUALIZZARE VOTAZIONI ALTRUI') }}</span>
          <toggle v-model="task.citizensCanSeeOthersRatings" @keydown.native.stop />
        </header>
      </section>

      <footer>
        <button class="success none" type="submit">
          <i class="ti ti-check" />
          {{ $t('plans.modal.confirm', 'Conferma') }}
        </button>
      </footer>
    </div>
  </form>
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

.content-editor-container {
  .content-editor {
    max-height: 200px;
  }
}

.modal {
  header {
    > .attachments {
      width: 100%;
      max-width: 100%;
    }

    .add-attachments {
      max-height: 200px;

      .content {
        max-height: 200px;
        .media-gallery {
          max-width: 100%;
          display: flex;
          gap: 0.5rem;

          .image-container {
            display: flex;
            flex-flow: row;
            gap: 0.5rem;
            flex-shrink: 1;

            .preview {
              height: auto;
              width: auto;

              > img {
                max-height: 100px;
                width: auto;
              }
            }
          }
        }
      }
    }

    &.in-memory-attachments {
      .public-media-gallery {
        .image-container {
          .preview {
            height: auto;
            width: auto;
            > img {
              max-width: 150px;
              max-height: 150px;
            }
          }
        }
      }
    }
  }
}
</style>
