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

      <header class="status">
        <div class="area">
          <small>{{ $t('plans.modal.categoria', 'categoria*').toUpperCase() }}</small>
          <select v-model="task.groupId" required @keydown.native.stop>
            <option value="" disabled>{{ $t('plans.modal.select.default_option', "Seleziona un'opzione") }}</option>
            <option v-for="group of groups" :key="group.id" :value="group.id">
              {{ group.name.toUpperCase() }}
            </option>
          </select>
        </div>
        <div class="area">
          <small>{{ $t('plans.modal.posizione', 'posizione').toLocaleUpperCase() }}</small>
          <component :is="esriGeocodingAutocomplete" v-if="!loading" v-model="locationName" @locationSelected="locationSelected" @keydown.native.stop @keydown.native.enter.prevent="$event => $event.preventDefault()"></component>
        </div>
        <div class="area">
          <small>{{ $t('plans.modal.cover-image', 'Immagine di copertina').toLocaleUpperCase() }}</small>
          <input type="file" :accept="imageContentTypes" @change="$event => onChangeCoverImage($event)" :required="!task.hasCoverImage" @keydown.native.prevent />
        </div>
      </header>
      <header class="map-settings">
        <div class="area">
          <small>{{ $t('plans.modal.visible-layers').toLocaleUpperCase() }}</small>
          <input type="url" v-model="tmpVisibleLayer" :placeholder="$t('plans.modal.visible-layers-placeholder', 'Inserisci il link qui...')" @keydown.enter="$event => confirmVisibleLayer()" />
        </div>
        <div class="area layers">
          <div v-for="(layer, idx) in task.visibleLayers">
            <i class="ti ti-x" @click="removeLayer(idx)"></i>
            <p>{{ layer }}</p>
          </div>
        </div>
      </header>
      <header class="editor">
        <div class="area">
          <small>{{ $t('plans.modal.description', 'descrizione*').toUpperCase() }}</small>
          <content-editor v-if="!loading" v-model="task.description" @keydown.native.stop></content-editor>
        </div>
        <div class="dates">
          <div class="start-date">
            <small>{{ $t('plans.modal.start-date', 'data inizio').toUpperCase() }}</small>
            <div class="date-picker-container">
              <date-picker-vue v-model="task.startDate" @keydown.native.stop mode="dateTime" timezone="utc" required>
                <template v-slot="{ inputEvents }">
                  <date-time :value="task.startDate" :events="inputEvents"></date-time>
                </template>
              </date-picker-vue>
            </div>
          </div>

          <div class="due-date">
            <small>{{ $t('plans.modal.due-date', 'data fine').toUpperCase() }}</small>
            <div class="date-picker-container">
              <date-picker-vue v-model="task.dueDate" @keydown.native.stop mode="dateTime" timezone="utc">
                <template v-slot="{ inputEvents }">
                  <date-time :value="task.dueDate" :events="inputEvents"></date-time>
                </template>
              </date-picker-vue>
            </div>
          </div>
        </div>
      </header>
      <header class="attachments-container">
        <div class="area fullspace">
          <small>{{ $t('plans.modal.add-images', 'Aggiungi immagini*').toUpperCase() }}</small>
          <component ref="addImages" :is="addAttachments" :customTextLocaleKey="'plans.modal.upload-images'" :clickableTextLocaleKey="'plans.modal.upload-from-device'" :context="context" />
        </div>
        <div class="area fullspace">
          <small>{{ $t('plans.modal.add-attachments', 'Aggiungi allegati*').toUpperCase() }}</small>
          <drag-and-drop
            @keydown.native.stop
            :files="files"
            :fileTypes="'documents'"
            :customTextLocaleKey="'plans.modal.upload-files'"
            :clickableTextLocaleKey="'plans.modal.upload-from-device'"
            @removeFromImages="removeFromImages"
            @removeFromFiles="removeFromFiles"
            @addToImages="addToImages"
            @addToFiles="addToFiles"
          ></drag-and-drop>
        </div>
      </header>
      <header v-if="planMode === 'edit' && attachments.length">
        <attachments-list :files="attachments" :workspaceId="task.workspaceId" :orientation="'row'" :planId="task.id" :editable="true" @fileRemoved="fileRemoved"></attachments-list>
      </header>
      <header v-if="plans.length">
        <div class="area fullspace">
          <span>{{ $t('plans.modal.has-cluster-parent-label', 'Fa parte di un altro progetto') }}</span>
          <toggle v-model="hasClusterParent" @keydown.native.stop></toggle>
        </div>
        <div class="area fullspace" v-if="hasClusterParent">
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
      <header>
        <div class="area fullspace">
          <span>{{ $t('plans.modal.citizen-can-view-others-comments', 'CONSENTI AL RUOLO CITTADINO DI VISUALIZZARE I COMMENTI ALTRUI').toUpperCase() }}</span>
          <toggle v-model="citizenCanSeeOthersComments" @keydown.native.stop />
        </div>
        <div class="area fullspace">
          <span>{{ $t('plans.modal.citizen-can-view-others-votes', 'CONSENTI AL RUOLO CITTADINO DI VISUALIZZARE VOTAZIONI ALTRUI') }}</span>
          <toggle v-model="citizenCanSeeOthersRatings" @keydown.native.stop />
        </div>
      </header>
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
  .datetime {
    height: 100%;
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

      .media-gallery {
        max-width: 100%;
        overflow-x: hidden;
        display: flex;

        .image-container {
          overflow-x: auto;
          display: flex;
          flex-flow: row;
          gap: 0.5rem;
          max-width: 50%;
          flex-shrink: 1;

          .preview {
            height: fit-content;
          }
        }
      }
    }
  }
}
</style>
