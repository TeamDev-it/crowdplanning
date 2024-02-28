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
        <button class="warning" v-tooltip="$t('planDetail.back', 'annulla modifiche')" v-if="editable" @click="back">
          <i class="ti ti-arrow-back"></i>
        </button>
        <button class="publish" @click="confirm" type="submit" v-if="editable">
          <i class="ti ti-presentation"></i>
          <span class="text">{{ $t('planDetail.saveMod', 'Salva') }} </span>
        </button>
      </div>
    </div>
    <div class="content" v-if="plan">
      <div class="third-column">
        <div class="fieldsets" v-if="(plan && plan.description) || !editable">
          <fieldset>
            <small>{{ $t('plans.modal.title', 'titolo') }}*</small>
            <input class="layer" v-model="plan.title" :placeholder="$t('plans.modal.title-placeholder', 'Inserisci il titolo qui...')" />
          </fieldset>
          <fieldset style="height: 100%; max-height: 250px">
            <small>{{ $t('plans.modal.copertina', 'copertina') }}*</small>
            <componenet
              :ref="coverMediaGalleryRef"
              :is="mediaGallery"
              :fileLimit="1"
              :titleText="{ key: 'modal.cover-image-addPlan-null', value: `` }"
              :subtitleText="{ key: 'modal.cover-image-description-addPlan', value: `` }"
              :contentText="{ key: 'modal.cover-image-content-text', value: `Trascina qui l'immagine di copertina` }"
              :type="`${context}-COVER`"
              :inputFileTypes="'images'"
              :id="plan.id ?? ''"
              @filesUploaded="coverUploaded"
              @fileRemoved="coverRemoved"
              style="background-color: var(--white); height: 100%; display: grid"
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

          <fieldset class="area fixed">
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

          <div class="fieldsets crowdplanning-roles-selector" v-if="!plan.isPublic">
            <div class="row">
              <span>{{ $t('plans.modal.roles-can', 'limita i ruoli che possono:').toLocaleUpperCase() }}</span>
            </div>
            <fieldset class="noborder">
              <small>{{ $t('plans.modal.roles-can-write', 'scrivere commenti').toLocaleUpperCase() }}</small>
              <inject name="roles-selector" class="bordered rolesSelector" v-model="plan.rolesCanWriteComments"> </inject>
            </fieldset>
            <fieldset class="noborder">
              <small>{{ $t('plans.modal.roles-can-see-comments', 'leggere i commenti altrui').toLocaleUpperCase() }}</small>
              <inject name="roles-selector" class="bordered rolesSelector" v-model="plan.rolesCanSeeOthersComments"> </inject>
            </fieldset>
            <fieldset class="noborder">
              <small>{{ $t('plans.modal.roles-can-rate', 'votare il progetto').toLocaleUpperCase() }}</small>
              <inject name="roles-selector" class="bordered rolesSelector" v-model="plan.rolesCanRate"> </inject>
            </fieldset>
            <fieldset class="noborder">
              <small>{{ $t('plans.modal.roles-can-see-ratings', 'vedere il totale di voti').toLocaleUpperCase() }}</small>
              <inject name="roles-selector" class="bordered rolesSelector" v-model="plan.rolesCanSeeOthersRatings"> </inject>
            </fieldset>
          </div>

          <div class="toggle" v-if="$can('PLANS.canjoin.issues')">
            <div class="row">
              <span>{{ $t('plans.modal-typeOf', 'Il progetto contiene segnalazioni') }}</span>
              <toggle type="checkbox" id="fromIssues" name="changeType" v-model="toggleType"></toggle>
            </div>
          </div>
          <div v-if="plan.planType == 'fromIssues'" class="crowdplanning-task-selector">
            <button @click="openTaskSelectorModal()">{{ $t('plans.modal.addIssues', 'Aggiungi segnalazioni') }}</button>
          </div>
        </div>
      </div>
      <div class="editor" v-if="(plan && plan.description) || !editable">
        <inject name="note-editor" v-model="plan.description" @keydown.stop> </inject>
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
    .media-gallery {
      .image-container,
      .preview {
        width: 100%;

        small {
          top: 0;
          bottom: auto;
        }
      }
    }

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

    .select-role {
      right: auto !important;
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

.detail-container {
  .crowdplanning-roles-selector {
    button {
      color: var(--crowdplanning-primary-color) !important;
      width: 100%;
      justify-content: space-between;
      padding-left: 15px;

      &:hover {
        background-color: unset;
        color: unset;
      }
    }

    .select-role {
      width: 100%;
    }
  }
}
</style>
