<template>
  <form @submit.prevent="confirm">
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
            <option v-for="group of value.data" :key="group.id" :value="group.id">
              {{ group.name.toUpperCase() }}
            </option>
          </select>
        </div>
        <div class="area">
          <small>{{ $t('plans.modal.posizione', 'posizione').toLocaleUpperCase() }}</small>
          <search-widget @locationSelected="locationSelected" @keydown.native.stop></search-widget>
        </div>
        <div class="area">
          <small>{{ $t('plans.modal.cover-image', 'Immagine di copertina').toLocaleUpperCase() }}</small>
          <input type="file" :accept="imageContentTypes" @change="$event => onChangeCoverImage($event)" required @keydown.native.stop />
        </div>
      </header>
      <header>
        <div class="editor">
          <small>{{ $t('plans.modal.description', 'descrizione*') }}</small>
          <content-editor v-model="task.description" @keydown.native.stop></content-editor>
        </div>
      </header>
      <header class="dates">
        <div class="area fixed">
          <small>{{ $t('plans.modal.start-date', 'data inizio') }}</small>
          <div class="date-picker-container">
            <date-picker-vue v-model="task.startDate" @keydown.native.stop mode="dateTime" timezone="utc" required>
              <template v-slot="{ inputEvents }">
                <date-time :value="task.startDate" :events="inputEvents"></date-time>
              </template>
            </date-picker-vue>
          </div>
        </div>
        <div class="area fixed">
          <small>{{ $t('plans.modal.due-date', 'data fine') }}</small>
          <div class="date-picker-container">
            <date-picker-vue v-model="task.dueDate" @keydown.native.stop mode="dateTime" timezone="utc">
              <template v-slot="{ inputEvents }">
                <date-time :value="task.dueDate" :events="inputEvents"></date-time>
              </template>
            </date-picker-vue>
          </div>
        </div>
      </header>
      <header class="drag-and-drop-container">
        <div class="area fullspace">
          <small>{{ $t('plans.modal.add-images', 'Aggiungi immagini*').toUpperCase() }}</small>
          <drag-and-drop
            @keydown.native.stop
            :files="images"
            :fileTypes="'images'"
            :customTextLocaleKey="'plans.modal.upload-images'"
            :clickableTextLocaleKey="'plans.modal.upload-from-device'"
            @removeFromImages="removeFromImages"
            @removeFromFiles="removeFromFiles"
            @addToImages="addToImages"
            @addToFiles="addToFiles"
          ></drag-and-drop>
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
      <header>
        <div class="area fullspace">
          <span>{{ $t('plans.modal.citizen-can-view-others-comments', 'CONSENTI AL RUOLO CITTADINO DI VISUALIZZARE I COMMENTI ALTRUI').toUpperCase() }}</span>
          <toggle v-model="citizenCanSeeOthersComments" @keydown.native.stop />
        </div>
        <div class="area fullspace">
          <span>{{ $t('plans.modal.citizen-can-view-others-votes', 'CONSENTI AL RUOLO CITTADINO DI VISUALIZZARE VOTAZIONI ALTRUI') }}</span>
          <toggle v-model="citizenCanSeeOthersRatings" @keydown.native.stop/>
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

<style lang="less">
@import url(./planModal.less);
</style>
