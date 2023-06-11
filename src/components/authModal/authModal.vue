<template>
  <div class="modal auth-modal">
    <header>
      <div class="title">{{ $t('plans.auth-modal.welcome', 'Benvenut* nel Crowd Planning!') }}</div>
    </header>
    <article>
      <div class="text">
        {{
          $t(
            'plans.auth-modal.text',
            'Benvenuto, il crowd planning ti permette di visualizzare i progetti e le proposte offerte dal comune. Accedendo tramite SPID avrai la possibilità di valutare e commentare le proposte, altrimenti puoi visualizzare gli elementi senza accedere.'
          )
        }}
      </div>
      <div class="commands">
        <div class="anonymous-access" @click="close">{{ $t('plans.auth-modal.anonymous-access', 'Continua senza accedere') }}</div>
        <spid-login :showText="false"></spid-login>
      </div>
    </article>
  </div>
</template>
<script lang="ts" src="./authModal.ts" />
<style lang="less" scoped>
@import url(./authModal.less);
</style>
