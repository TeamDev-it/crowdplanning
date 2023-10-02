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

      <div class="third-column">
        <div class="fieldsets">
          <fieldset class="category">
            <small>{{ $t('plans.modal.categoria', 'categoria*') }}</small>
            <select v-model="plan?.groupId" required @keydown.native.stop>
              <option value="" disabled>{{ $t('plans.modal.select.default_option', `Seleziona un'opzione`) }}</option>
              <option v-for="group in groups" :key="group" :value="group">
                {{ group.toString.name.toUpperCase() }}
              </option>
            </select>
          </fieldset>
          <fieldset class="position">
            <small>{{ $t('plans.modal.posizione', 'posizione').toLocaleUpperCase() }}</small>
            <!-- <component :is="esriGeocodingAutocomplete" v-if="!loading" v-model="plan?.location" @locationSelected="locationSelected" @keydown.native.stop @keydown.native.enter.prevent="$event.preventDefault()"></component> -->
          </fieldset>
          <fieldset>
            <small>{{ $t('plans.modal.visible-layers').toLocaleUpperCase() }}</small>
            <input type="url" v-model="tmpVisibleLayer" :placeholder="$t('plans.modal.visible-layers-placeholder', 'Inserisci il link qui...')" @keydown.enter="confirmVisibleLayer()" />
          </fieldset>
        </div>
        <!-- <div class="">
          <fieldset>
            <small>{{ $t('plans.modal.categoria', 'categoria*').toUpperCase() }}</small>
            <select v-model="plan?.groupId" required @keydown.native.stop>
              <option value="" disabled>{{ $t('plans.modal.select.default_option', "Seleziona un'opzione") }}</option>
              <option v-for="group in groups" :key="group" :value="group">
                {{ group.toString.name.toUpperCase() }}
              </option>
            </select>
          </fieldset>

          <div class="position">
            <small>{{ $t('plans.modal.posizione', 'posizione').toLocaleUpperCase() }}</small>
            <component :is="esriGeocodingAutocomplete" v-if="!loading" v-model="plan?.location" @locationSelected="locationSelected" @keydown.native.stop @keydown.native.enter.prevent="$event.preventDefault()"></component>
          </div>

          <header class="map-settings">
            <fieldset>
              <small>{{ $t('plans.modal.visible-layers').toLocaleUpperCase() }}</small>
              <input type="url" v-model="tmpVisibleLayer" :placeholder="$t('plans.modal.visible-layers-placeholder', 'Inserisci il link qui...')" @keydown.enter="confirmVisibleLayer()" />
            </fieldset>
            <div>
              <div v-for="(layer, idx) in plan?.visibleLayers">
                <p>{{ layer }}</p>
              </div>
            </div>
          </header>

          <header class="date">
            <fieldset>
              <small>{{ $t('plans.modal.start-date', 'data inizio').toUpperCase() }}</small>
              <div class="date-picker-container">
                <date-picker v-model="plan?.startDate" @keydown.native.stop mode="dateTime" is24hr required>
                  <template v-slot="{ inputEvents }">
                    <date-time :value="plan?.startDate" :events="inputEvents"></date-time>
                  </template>
                </date-picker>
              </div>
            </fieldset>

            <fieldset>
              <small>{{ $t('plans.modal.due-date', 'data fine').toUpperCase() }}</small>
              <div class="date-picker-container">
                <date-picker v-model="plan?.dueDate" @keydown.native.stop mode="dateTime" is24hr>
                  <template v-slot="{ inputEvents }">
                    <date-time :value="plan?.dueDate" :events="inputEvents"></date-time>
                  </template>
                </date-picker>
              </div>
            </fieldset>
          </header>
        </div> -->
      </div>
    </div>
  </div>
</template>

<!--  -->
<!-- info case -->
<!--  -->
<!-- <div class="date info" @click="">
              <i class="ti ti-calendar"></i>
              <span>{{ $t('planModal.dueTime', 'Data scadenza') }}</span>
              <div class="date-picker-container">
                <date-picker @keydown.native.stop mode="dateTime" is24hr>
                  <template v-slot="{ inputEvents }">
                    <date-time :events="inputEvents"></date-time>
                  </template>
                </date-picker>
              </div>
            </div>

            <div class="location info">
              <i class="ti ti-map-pin"></i>
              <span class="text">{{ $t('planModal.location', 'Indirizzo') }}</span>
              <component :is="esriGeocodingAutocomplete" @locationSelected="locationSelected" @keydown.native.stop></component>
            </div>

            <div class="group info">
              <i v-if="!groups" class="ti ti-category"></i>
              <i v-else :class="iconCode(group.iconCode)"></i>
              <span class="text">{{ $t('planModal.group', 'Categoria') }}</span>
            </div> -->

<!-- <template>
    <div class="task" v-if="task" @submit.prevent="confirm" @keydown.enter="$event.preventDefault()">
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
          <div class="position">
            <small>{{ $t('plans.modal.posizione', 'posizione').toLocaleUpperCase() }}</small>
            <component :is="esriGeocodingAutocomplete" v-if="!loading" v-model="task.locationName" @locationSelected="locationSelected" @keydown.native.stop @keydown.native.enter.prevent="$event => $event.preventDefault()"></component>
          </div>
        </header>

        <header class="cover-image" v-if="task">
          <componenet
            :ref="coverMediaGalleryRef"
            :is="mediaGallery"
            :fileLimit="1"
            :titleText="{ key: 'modal.cover-image', value: 'Immagine di copertina' }"
            :subtitleText="{ key: 'modal.cover-image-description', value: `Visualizza l'immagine di copertina` }"
            :contentText="{ key: 'modal.cover-image-content-text', value: `Trascina qui l'immagine di copertina` }"
            :type="`${context}-COVER`"
            :inputFileTypes="'images'"
            :id="task.id ?? ''"
            @filesUploaded="coverUploaded"
            @fileRemoved="coverRemoved"
          ></componenet>
        </header>

        <header class="map-settings">
          <fieldset>
            <small>{{ $t('plans.modal.visible-layers').toLocaleUpperCase() }}</small>
            <input type="url" v-model="tmpVisibleLayer" :placeholder="$t('plans.modal.visible-layers-placeholder', 'Inserisci il link qui...')" @keydown.enter="$event => confirmVisibleLayer()" />
          </fieldset>
          <div>
            <div v-for="(layer, idx) in task.visibleLayers">
              <i class="ti ti-x" @click="removeLayer(idx)"></i>
              <p>{{ layer }}</p>
            </div>
          </div>
        </header>

        <header class="date">
          <fieldset>
            <small>{{ $t('plans.modal.start-date', 'data inizio').toUpperCase() }}</small>
            <div class="date-picker-container">
              <date-picker v-model="task.startDate" @keydown.native.stop mode="dateTime" is24hr required>
                <template v-slot="{ inputEvents }">
                  <date-time :value="task.startDate" :events="inputEvents"></date-time>
                </template>
              </date-picker>
            </div>
          </fieldset>

          <fieldset>
            <small>{{ $t('plans.modal.due-date', 'data fine').toUpperCase() }}</small>
            <div class="date-picker-container">
              <date-picker v-model="task.dueDate" @keydown.native.stop mode="dateTime" is24hr>
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

        <header class="media" v-if="task">
          <componenet :ref="mediaGalleryRef" :is="mediaGallery" :type="context" :id="task.id ?? ''" @filesUploaded="filesUploaded" @fileRemoved="fileRemoved"></componenet>
        </header>

        <header v-if="plans.length" class="cluster">
          <div class="column">
            <span>{{ $t('plans.modal.has-cluster-parent-label', 'Fa parte di un altro progetto').toUpperCase() }}</span>
            <toggle v-model="hasClusterParent" @keydown.native.stop></toggle>
          </div>
          <div v-if="hasClusterParent" class="autocomplete">
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
          <span>{{ $t('plans.modal.citizen-can-view-others-votes', 'CONSENTI AL RUOLO CITTADINO DI VISUALIZZARE VOTAZIONI ALTRUI').toUpperCase() }}</span>
          <toggle v-model="task.citizensCanSeeOthersRatings" @keydown.native.stop />
        </header>
      </section>

      <footer>
        <button class="success none" type="submit">
          <i class="ti ti-check"></i>
          {{ $t('plans.modal.confirm', 'Conferma') }}
        </button>
      </footer>
    </div>
 
</template> -->

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
