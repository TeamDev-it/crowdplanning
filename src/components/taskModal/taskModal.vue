<template>
  <div class="modal task">
    <header class="title">
      <input type="text" :class="{ error: errors['title'] }" :placeholder="$t('plans.title', 'Inserisci qui il titotlo')" class="transparent title" v-model="task.title" maxlength="110" required="true" v-validate="(errs, a) => setError('title', errs)" />
      <button class="square none" @click="close()">
        <i class="ti ti-x"></i>
      </button>
    </header>

    <header class="status">
      <div class="area fixed">
        <small>{{ $t('plans.modal.categoria', 'categoria*').toUpperCase() }}</small>
        <select v-model="task.groupId">
          <option v-for="group of value.data" :key="group.id" :value="group.id">
            {{ group.name.toUpperCase() }}
          </option>
        </select>
      </div>
      <div class="area">
        <small>{{ $t('plans.moda.posizione', 'posizione').toLocaleUpperCase() }}</small>
        <search-widget @locationSelected="locationSelected"></search-widget>
      </div>
    </header>
    <header>
      <div class="editor">
        <small>{{ $t('plans.modal.description', 'descrizione*') }}</small>
        <content-editor v-model="task.description"></content-editor>
      </div>
    </header>
    <header class="dates">
      <div class="area fixed">
        <small>{{ $t('plans.modal.start-date', 'data inizio') }}</small>
        <div class="date-picker-container">
          <date-picker-vue v-model="task.startDate" mode="dateTime" timezone="utc">
            <template v-slot="{ inputEvents }">
              <date-time :value="task.startDate" :events="inputEvents"></date-time>
            </template>
          </date-picker-vue>
        </div>
      </div>
      <div class="area fixed">
        <small>{{ $t('plans.modal.start-date', 'data inizio') }}</small>
        <div class="date-picker-container">
          <date-picker-vue v-model="task.dueDate" mode="dateTime" timezone="utc">
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
        <span>{{ $t("plans.modal.citizen-can-view-others-comments", "CONSENTI AL RUOLO CITTADINO DI VISUALIZZARE I COMMENTI ALTRUI").toUpperCase() }}</span>
        <toggle v-model="value.data.public" />
      </div>
      <div class="area fullspace">
        <span>{{ $t("plans.modal.citizen-can-view-others-votes", "CONSENTI AL RUOLO CITTADINO DI VISUALIZZARE VOTAZIONI ALTRUI") }}</span>
        <toggle v-model="value.data.public" />
      </div>
    </header>
  </div>
</template>

<script lang="ts" src="./taskModal.ts" />

<style lang="less">
@import url(./taskModal.less);
</style>
