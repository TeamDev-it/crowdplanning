<template>
  <div class="modal login-modal">
    <header>
      <div class="title">{{ $t('plans.need-login-modal.title', 'Accedi per continuare') }}</div>
    </header>
    <section>
      <div class="text">
        {{ $t('plans.need-login-modal.text', 'È necessario eseguire l’accesso per votare e commentare i progetti.') }}
      </div>
    </section>
    <footer class="commands">
      <div class="anonymous-access" @click="close">{{ $t('plans.need-login-modal.cancel', 'Annulla') }}</div>
      <spid-login :showText="false"></spid-login>
    </footer>
  </div>
</template>
<script lang="ts" src="./loginModal.ts" />
<style lang="less" scoped>
@import url(./loginModal.less);
</style>
