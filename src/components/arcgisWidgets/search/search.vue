<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <div class="autocomplete">
        <input type="text" v-model="locationName" :placeholder="$t('plans.search.enter-address', `Inserisci l'indirizzo`)" @keyup="$event => searchLocation()"/>
        <ul class="autocomplete-results" v-if="searchResponse && searchResults.length">
            <li class="autocomplete-result" v-for="(searchResult, index) of searchResults" @click="selectLocation(index)" :key="index">
                {{ searchResult.name }}
            </li>
        </ul>
    </div>
</template>

<script lang="ts" src="./search.ts" />

<style lang="less" scoped>
@import url(./search.less);
</style>