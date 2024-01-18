<template>
  <div class="modal plangroup">
    <header>
      <h2 v-if="value.data.id">{{ $t('plans.group.create.modifyGroup', 'Modifica categoria') }}</h2>
      <h2 v-else>{{ $t('plans.group.create.newGroup', 'Crea nuova categoria') }}</h2>
      <div>
        <button v-if="value.data.id" class="danger" @click="deleteGroup()">
          <i class="ti ti-trash"></i>
        </button>
        <button class="square none" @click="close()">
          <i class="ti ti-x"></i>
        </button>
      </div>
    </header>
    <section>
      <div class="area">
        <small class="title">{{ $t(`plan.group.create.shortName`, 'nome') }}</small>
        <input :disabled="value.data.default" v-model="copyValue.name" required="true" :placeholder="$t('plan.group.create.placeholder', 'inserisci un nome per il tuo gruppo')" v-validate="(errs, _a) => setError('title', errs)" />
      </div>
      <div class="area">
        <small class="title">{{ $t(`plan.group.create.description`, 'descrizione') }}</small>
        <textarea class="description" v-model="copyValue.description" name="" id="" cols="30" rows="3" :placeholder="$t('plan.group.create.placeholderdescription', 'inserisci una descrizione per il tuo gruppo')"></textarea>
      </div>
      <template v-if="!value.data.default">
        <div class="area wToggle">
          <small>{{ $t('plan.group.public', 'categoria pubblica (disponibile per le applicazioni non autenticate)') }}</small>
          <toggle v-model="copyValue.public" />
        </div>
      </template>
      <template>
        <div class="area">
          <small class="title">{{ $t('plan.group.create.icon.label', 'icona') }}</small>
          <input v-model="copyValue.iconCode" :placeholder="$t('plan.group.create.icon.placeholder', 'Inserisci un codice tabler icon')" />
        </div>
      </template>
      <div class="area" v-if="value.data.id">
        <small class="title id">{{ $t(`plan.group.id`, 'id categoria') }}</small>
        <input placeholder="" class="id" disabled />
        <span class="valueID">{{ value.data.id }}</span>
      </div>
    </section>
    <footer>
      <!-- <button class="danger none" @click="close()">
        <i class="ti ti-x" />
        <span>
          {{ $t('plan.cancel', 'annulla') }}
        </span>
      </button> -->
      <button class="success none" @click="confirm()" :disabled="!!errors.length">
        <i class="ti ti-check" />
        <span>
          {{ $t('plan.confirm', 'conferma e salva') }}
        </span>
      </button>
    </footer>
  </div>
</template>
<script lang="ts" src="./groupModal.ts" />
<style lang="less" scoped>
@import url(./groupModal.less);
</style>
