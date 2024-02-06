<template>
  <div class="modal planWizard" :class="{}">
    <header>
      <h3>{{ $t('plan.wizard-create-new-project', 'Crea nuovo progetto') }}</h3>
      <button class="square none" @click="close"><i class="ti ti-x"></i></button>
    </header>
    <section>
      <div class="progressBar">
        <div class="bar">
          <div class="outer line">
            <div
              class="inner line"
              :class="{
                one: steplevel == 1,
                two: steplevel == 2,
                three: steplevel == 3,
                four: steplevel == 4
              }"
            ></div>
          </div>
          <div class="circles">
            <div class="icon" :class="{ active: steplevel == 1, completed: steplevel > 1 }">
              <i v-if="steplevel == 1" class="ti ti-circle-dot"></i>
              <i v-else-if="steplevel > 1" class="ti ti-circle-check"></i>
            </div>
            <div class="icon" :class="{ active: steplevel == 2, completed: steplevel > 2 }">
              <i v-if="steplevel < 2" class="ti ti-circle"></i>
              <i v-else-if="steplevel == 2" class="ti ti-circle-dot"></i>
              <i v-else-if="steplevel > 2" class="ti ti-circle-check"></i>
            </div>
            <div class="icon" :class="{ active: steplevel == 3, completed: steplevel > 3 }">
              <i v-if="steplevel < 3" class="ti ti-circle"></i>
              <i v-else-if="steplevel == 3" class="ti ti-circle-dot"></i>
              <i v-else-if="steplevel > 3" class="ti ti-circle-check"></i>
            </div>
            <div class="icon" :class="{ completed: steplevel == 4 }">
              <i v-if="steplevel < 4" class="ti ti-circle"></i>
              <i v-else-if="steplevel == 4" class="ti ti-circle-check"></i>
            </div>
          </div>
          <div class="circles">
            <span class="step" :class="step.class" v-for="step in steps" :key="step.idx">{{ step.title }}</span>
          </div>
        </div>
        <div class="step"></div>
      </div>
      <div class="data">
        <h1>{{ getCurrentStepTitle(steplevel) }}</h1>
        <span>{{ getCurrentStepDescription(steplevel) }}</span>
        <div v-show="steplevel == 1" class="field one">
          <div class="row">
            <fieldset>
              <small>{{ $t('plans.modal.title', 'titolo') }}*</small>
              <input class="layer" v-model="value.data.title" :placeholder="$t('plans.modal.title-placeholder', 'Inserisci il titolo qui...')" />
            </fieldset>
            <fieldset>
              <small>{{ $t('plans.modal.categoria', 'categoria') }}*</small>
              <select v-model="value.data.groupId" class="category">
                <option class="opt" disabled selected>{{ $t('plans.modal.select.default_option', `Seleziona un'opzione`) }}</option>
                <option class="opt" v-for="group in plansGroupRoot.children" :key="group.id" :value="group.id">
                  {{ group.name }}
                </option>
              </select>
            </fieldset>
          </div>
          <componenet
            :ref="coverMediaGalleryRef"
            :is="mediaGallery"
            :fileLimit="1"
            :titleText="{ key: 'modal.cover-image-addPlan-null', value: `` }"
            :subtitleText="{ key: 'modal.cover-image-description-addPlan', value: `` }"
            :contentText="{ key: 'modal.cover-image-content-text', value: `Trascina qui l'immagine di copertina` }"
            :type="`${context}-COVER`"
            :inputFileTypes="'images'"
            :id="value.data.id ?? ''"
            @filesUploaded="coverUploaded"
            @fileRemoved="coverRemoved"
            style="background-color: var(--background-color); height: 100%; display: grid"
          ></componenet>
          <div class="editor">
            <inject name="note-editor" v-model="value.data.description" @keydown.stop> </inject>
          </div>
        </div>
        <div v-show="steplevel == 2" class="field two">
          <inject name="editfeature-map" v-model="featureTest" :id="value.data.id" :type="'PLANS'" :proposedFeatures="null"> </inject>
        </div>
        <div v-show="steplevel == 3" class="field three">
          <div class="dates">
            <fieldset class="area fixed">
              <small>{{ $t('plans.modal.start-date', 'data inizio') }}</small>
              <div class="date-picker-container">
                <date-picker v-model="value.data.startDate" @keydown.stop mode="dateTime" timezone="utc" required>
                  <template v-slot="{ inputEvents }">
                    <date-time :value="value.data.startDate" :events="inputEvents"></date-time>
                  </template>
                </date-picker>
              </div>
            </fieldset>

            <fieldset class="area fixed">
              <small>{{ $t('plans.modal.due-date', 'data fine') }}</small>
              <div class="date-picker-container">
                <date-picker v-model="value.data.dueDate" @keydown.stop mode="dateTime" timezone="utc">
                  <template v-slot="{ inputEvents }">
                    <date-time :value="value.data.dueDate" :events="inputEvents"></date-time>
                  </template>
                </date-picker>
              </div>
            </fieldset>
          </div>
          <hr />
          <div class="toggle">
            <div class="row">
              <span>{{ $t('plans.modal.isPublic', 'Progetto pubblico') }}</span>
              <toggle v-model="value.data.isPublic" @keydown.stop :default="true" />
            </div>
          </div>

          <div class="fieldsets crowdplanning-roles-selector" v-if="!value.data.isPublic">
            <div class="row">
              <span>{{ $t('plans.modal.roles-can', 'limita i ruoli che possono:').toLocaleUpperCase() }}</span>
            </div>
            <div class="row">
              <fieldset class="noborder">
                <small>{{ $t('plans.modal.roles-can-write', 'scrivere commenti').toLocaleUpperCase() }}</small>
                <inject name="roles-selector" class="bordered rolesSelector" v-model="value.data.rolesCanWriteComments"> </inject>
              </fieldset>
              <fieldset class="noborder">
                <small>{{ $t('plans.modal.roles-can-see-comments', 'leggere i commenti altrui').toLocaleUpperCase() }}</small>
                <inject name="roles-selector" class="bordered rolesSelector" v-model="value.data.rolesCanSeeOthersComments"> </inject>
              </fieldset>
            </div>
            <div class="row">
              <fieldset class="noborder">
                <small>{{ $t('plans.modal.roles-can-rate', 'votare il progetto').toLocaleUpperCase() }}</small>
                <inject name="roles-selector" class="bordered rolesSelector" v-model="value.data.rolesCanRate"> </inject>
              </fieldset>
              <fieldset class="noborder">
                <small>{{ $t('plans.modal.roles-can-see-ratings', 'vedere il totale di voti').toLocaleUpperCase() }}</small>
                <inject name="roles-selector" class="bordered rolesSelector" v-model="value.data.rolesCanSeeOthersRatings"> </inject>
              </fieldset>
            </div>
          </div>
          <hr />
          <div class="row">
            <fieldset>
              <small>{{ $t('plans.modal.typeOf', 'tipo di progetto') }}*</small>
              <select v-model="value.data.planType" class="typeOf">
                <option class="opt" disabled selected>{{ $t('plans.modal.select.default_option', `Seleziona un'opzione`) }}</option>
                <option class="opt" value="simple">{{ $t('plan.wizard-planType-simple', 'Descrittivo') }}</option>
                <option class="opt" value="fromIssues">{{ $t('plan.wizard-planType-fromIssues', 'Raccolta segnalazioni') }}</option>
              </select>
            </fieldset>
          </div>
          <div v-if="value.data.planType == 'fromIssues'" class="crowdplanning-task-selector">
            <component :is="taskSelector" :ref="taskSelector" style="height: 100%" v-model="tasksList"></component>
          </div>
        </div>
      </div>
    </section>
    <footer :class="{ canGoBack: steplevel > 1 }">
      <button class="void" v-if="steplevel > 1" @click="steplevel--">
        <i class="ti ti-arrow-left"></i>
        <span>{{ $t('plan.wizard-go-back', 'Indietro') }}</span>
      </button>
      <button v-if="steplevel != 4" @click="goNext">
        <!-- <button v-if="steplevel != 4" @click="steplevel++"> -->
        <span>{{ $t('plan.wizard-go-next', 'Avanti') }}</span>
        <i class="ti ti-arrow-right"></i>
      </button>
      <button v-if="steplevel == 4" @click="confirm()" :disabled="disablePublishButton">
        <span>{{ $t('plan.wizard-publish', 'Pubblica') }}</span>
        <i class="ti ti-confetti"></i>
      </button>
    </footer>
  </div>
</template>
<script src="./planWizard.ts" lang="ts"></script>
<style lang="less" scoped>
@import url(./planWizard.less);
</style>

<style lang="less">
.crowdplanning-task-selector {
  .container {
    .head {
      background-color: var(--crowdplanning-light-color);

      button {
        background-color: var(--crowdplanning-dark-color);
      }
    }

    .search {
      background-color: var(--crowdplanning-primary-color);
    }
  }
}

.crowdplanning-roles-selector {
    button{
    color: var(--crowdplanning-primary-color) !important;
    width: 100% !important;
    justify-content: space-between;
    padding-left: 15px;

    &:hover {
      background-color: unset;
      color: unset;
    }
  }

  .select-role{
    width: 100%;
  }
  }
</style>
