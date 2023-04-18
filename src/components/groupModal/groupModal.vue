<template>
  <div class="modal taskgroup">
    <header>
      <h2>{{ $t('plans.group.create.newGroup', 'Crea una nuova categoria') }}</h2>
      <button class="square none" @click="$event => close()">
        <i class="ti ti-x"></i>
      </button>
    </header>
    <section>
      <div class="area">
        <label>{{ $t(`task.group.create.shortName`, 'nome breve del gruppo') }}</label>
        <input :disabled="value.data.default" v-model="value.data.name" required="true" :placeholder="$t('task.group.create.placeholder', 'inserisci un nome per il tuo gruppo')" v-validate="(errs: any, a: any) => setError('title', errs)" />
      </div>
      <div class="area">
        <label>{{ $t(`task.group.create.description`, 'descrizione breve del gruppo') }}</label>
        <input v-model="value.data.description" :placeholder="$t('task.group.create.placeholderdescription', 'inserisci una descrizione per il tuo gruppo')" />
      </div>
      <template v-if="!value.data.default">
        <div class="area">
          <label>{{ $t('task.group.public', 'marca il gruppo come pubblico e disponibile per le applicazioni non autenticate') }}</label>
          <toggle v-model="value.data.public" />
        </div>
      </template>
      <div class="area" v-if="value.data.id">
        <label>{{ $t(`task.group.id`, 'id assegnato al gruppo') }}</label>
        <span>{{ value.data.id }}</span>
      </div>
    </section>
    <footer>
      <button class="danger none" @click="close()">
        <i class="ti ti-x" />
        {{ $t('task.cancel', 'annulla') }}
      </button>
      <button class="danger none" @click="deleteGroup()">
        <i class="ti ti-trash" />
        {{ $t('task.delete.group', 'Cancella il gruppo') }}
      </button>
      <button class="success none" @click="confirm()" :disabled="!!errors.length">
        <i class="ti ti-check" />
        {{ $t('task.confirm', 'conferma e salva') }}
      </button>
    </footer>
  </div>
</template>
<script lang="ts" src="./groupModal.ts" />
<style lang="less" scoped>
@import url(./groupModal.less);
</style>
