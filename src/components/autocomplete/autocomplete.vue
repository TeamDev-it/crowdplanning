<template>
  <div class="autocomplete">
    <header>
      <div class="label" v-if="labelKey">{{ $t(labelKey, '') }}</div>
      <div class="input-box">
        <input type="text" v-model.trim="searchedText" :placeholder="placeholderKey ? $t('placeholderKey', '') : ''" @input="onInputHandler" />
      </div>
    </header>
    <article class="scrollable-y" v-if="filteredValues && filteredValues.length && suggestionOpen">
      <div clas="item" v-if="searchedText && suggestionOpen" v-for="(value, idx) in filteredValues" :key="idx" @click="onItemClickHandler(value)">{{ value[showThisPropertyAsItemName] }}</div>
    </article>
  </div>
</template>

<style lang="less" scoped>
@import url(./autocomplete.less);
</style>

<script lang="ts" src="./autocomplete.ts" />
