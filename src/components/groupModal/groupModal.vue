<template>
  <div class="modal taskgroup">
    <header>
      <h2 v-if="value.data.id">{{ $t('plans.group.create.modifyGroup', 'Modifica categoria') }}</h2>
      <h2 v-else>{{ $t('plans.group.create.newGroup', 'Crea nuova categoria') }}</h2>
      <div>
        <button v-if="value.data.id" class="danger" @click="deleteGroup()">
          <i class="ti ti-trash"></i>
        </button>
        <button class="square none" @click="_$event => close()">
          <i class="ti ti-x"></i>
        </button>
      </div>
    </header>
    <section>
      <div class="area">
        <small class="title">{{ $t(`plan.group.create.shortName`, 'nome') }}</small>
        <input :disabled="value.data.default" v-model="value.data.name" required="true" :placeholder="$t('task.group.create.placeholder', 'inserisci un nome per il tuo gruppo')" v-validate="(errs, _a) => setError('title', errs)" />
      </div>
      <div class="area">
        <small class="title">{{ $t(`plan.group.create.description`, 'descrizione') }}</small>
        <!-- <input class="description" v-model="value.data.description" :placeholder="$t('plan.group.create.placeholderdescription', 'inserisci una descrizione per il tuo gruppo')" /> -->
        <textarea class="description" name="" id="" cols="30" rows="3" :placeholder="$t('plan.group.create.placeholderdescription', 'inserisci una descrizione per il tuo gruppo')"></textarea>
      </div>
      <template v-if="!value.data.default">
        <div class="area wToggle">
          <small>{{ $t('plan.group.public', 'categoria pubblica (disponibile per le applicazioni non autenticate)') }}</small>
          <toggle v-model="value.data.public" />
        </div>
      </template>
      <template>
        <div class="area">
          <small class="title">{{ $t('plan.group.create.icon.label', 'icona') }}</small>
          <input v-model="value.data.iconCode" :placeholder="$t('plan.group.create.icon.placeholder', 'Inserisci un codice tabler icon')" />
        </div>
      </template>
      <div class="area" v-if="value.data.id">
        <small class="title id">{{ $t(`task.group.id`, 'id categoria') }}</small>
        <input placeholder="" class="id" disabled />
        <span class="valueID">{{ value.data.id }}</span>
      </div>
    </section>
    <footer>
      <button class="danger none" @click="close()">
        <i class="ti ti-x" />
        <span>
          {{ $t('task.cancel', 'annulla') }}
        </span>
      </button>
      <button class="success none" @click="confirm()" :disabled="!!errors.length">
        <i class="ti ti-check" />
        <span>
          {{ $t('task.confirm', 'conferma e salva') }}
        </span>
      </button>
    </footer>
  </div>
</template>
<script lang="ts" src="./groupModal.ts" />
<style lang="less" scoped>
@import url(./groupModal.less);
</style>
