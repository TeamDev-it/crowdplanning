<template>
  <div class="detail-container">
    <div class="header">
      <div class="back" @click="back">
        <i class="ti ti-arrow-left"></i>
      </div>
      <div v-if="editable" class="title">{{ $t('planDetail.modify.title', 'Modifica post') }}</div>
      <div v-else class="title">{{ $t('planDetail.publish.title', 'Inserisci nuovo post') }}</div>
      <div class="commands">
        <button class="publish" @click="confirm" type="submit" v-if="!editable">
          <i class="ti ti-presentation"></i>
          <span class="text">{{ $t('planDetail.publish', 'Pubblica') }} </span>
        </button>
        <button class="danger" v-if="hasPermission('plans.candelete')" v-tooltip="$t('planDetail.delete', 'doppio click per eliminare')" @dblclick="remove">
          <i class="ti ti-trash"></i>
        </button>
        <button class="warning" v-tooltip="$t('planDetail.back', 'annulla modifiche')" v-if="editable" @click="back(true)">
          <i class="ti ti-arrow-back"></i>
        </button>
        <button class="publish" @click="confirm" type="submit" v-if="editable">
          <i class="ti ti-presentation"></i>
          <span class="text">{{ $t('planDetail.saveMod', 'Salva') }} </span>
        </button>
      </div>
    </div>
    <div class="content" v-if="plan">
      <div class="right-column" @scroll="closepopups()">
        <template v-if="(plan && plan.description) || !editable">
          <fieldset>
            <small>{{ $t('plans.modal.title', 'titolo') }}*</small>
            <input class="layer" v-model="plan.title" :placeholder="$t('plans.modal.title-placeholder', 'Inserisci il titolo qui...')" />
          </fieldset>
          <fieldset class="mediacontent">
            <small>{{ $t('plans.modal.copertina', 'copertina') }}*</small>
            <componenet
              :ref="coverMediaGalleryRef"
              :is="mediaGallery"
              :fileLimit="1"
              :type="`${context}-COVER`"
              :inputFileTypes="'images'"
              :id="plan.id ?? ''"
              @filesUploaded="coverUploaded"
              @fileRemoved="coverRemoved"
            ></componenet>
          </fieldset>

          <fieldset>
            <small>{{ $t('plans.modal.categoria', 'categoria') }}*</small>
            <group-button v-model="plan.group" :showAsSelect="true" @groupChanged="groupChanged"></group-button>
          </fieldset>

          <fieldset>
            <small>{{ $t('plans.modal.states', 'stato') }}*</small>
            <status-button v-model="plan.state" :showAsSelect="true" @stateChanged="stateChanged"></status-button>
          </fieldset>

          <fieldset class="edit-map">
            <small>{{ $t('plans.modal.plan-area', 'Area progetto').toLocaleUpperCase() }}</small>
            <component class="featureMap" :is="editFeatureMap" type="PLANS" v-model="featureTest" :id="plan ? plan.id : null" />
          </fieldset>

          <fieldset>
            <small>{{ $t('plans.modal.start-date', 'data inizio') }}</small>
            <div class="date-picker-container">
              <date-picker v-model="plan.startDate" @keydown.stop mode="dateTime" timezone="utc" required>
                <template v-slot="{ inputEvents }">
                  <date-time :value="plan ? plan.startDate : null" :events="inputEvents"></date-time>
                </template>
              </date-picker>
            </div>
          </fieldset>

          <fieldset>
            <small>{{ $t('plans.modal.due-date', 'data fine') }}</small>
            <div class="date-picker-container">
              <date-picker v-model="plan.dueDate" @keydown.stop mode="dateTime" timezone="utc">
                <template v-slot="{ inputEvents }">
                  <date-time :value="plan ? plan.dueDate : null" :events="inputEvents"></date-time>
                </template>
              </date-picker>
            </div>
          </fieldset>
          <header class="toggle">
            <div class="row">
              <span>{{ $t('plans.modal.isPublic', 'progetto pubblico') }}</span>
              <toggle v-model="plan.isPublic" @keydown.stop :default="true" />
            </div>
          </header>

          <template v-if="!plan.isPublic">
            <div class="row">
              <span>{{ $t('plans.modal.roles-can', 'limita i ruoli che possono:').toLocaleUpperCase() }}</span>
            </div>
            <fieldset class="roles">
              <small>{{ $t('plans.modal.roles-can-write', 'scrivere commenti').toLocaleUpperCase() }}</small>
              <inject name="roles-selector"  v-model="plan.rolesCanWriteComments"> </inject>
            </fieldset>
            <fieldset class="roles">
              <small>{{ $t('plans.modal.roles-can-see-comments', 'leggere i commenti altrui').toLocaleUpperCase() }}</small>
              <inject name="roles-selector"  v-model="plan.rolesCanSeeOthersComments"> </inject>
            </fieldset>
            <fieldset class="roles">
              <small>{{ $t('plans.modal.roles-can-rate', 'votare il progetto').toLocaleUpperCase() }}</small>
              <inject name="roles-selector"  v-model="plan.rolesCanRate"> </inject>
            </fieldset>
            <fieldset class="roles">
              <small>{{ $t('plans.modal.roles-can-see-ratings', 'vedere il totale di voti').toLocaleUpperCase() }}</small>
              <inject name="roles-selector"  v-model="plan.rolesCanSeeOthersRatings"> </inject>
            </fieldset>
          </template>

          <div class="toggle" v-if="$can('PLANS.canjoin.issues')">
            <div class="row">
              <span>{{ $t('plans.modal-typeOf', 'Il progetto contiene segnalazioni') }}</span>
              <toggle type="checkbox" id="fromIssues" name="changeType" v-model="toggleType"></toggle>
            </div>
          </div>
          <div v-if="plan.planType == 'fromIssues'" class="crowdplanning-task-selector">
            <button @click="openTaskSelectorModal()">{{ $t('plans.modal.addIssues', 'Aggiungi segnalazioni') }}</button>
          </div>
        </template>
      </div>
      <inject class="editor" v-if="(plan && plan.description) || !editable" name="note-editor" v-model="plan.description" @keydown.stop> </inject>
    </div>
  </div>
</template>

<script lang="ts" src="./planModal.ts" />

<style lang="less" scoped>
@import url(./planModal.less);
</style>
