<template>
    <div class="container">
        <div class="title">
            {{ $t("plans.citizen.assess-proposal", "Valuta la proposta").toUpperCase() }}
        </div>
        <spid-login v-if="!mySelf"></spid-login>
        <component v-else :is="ratingComponent" :id="id" :type="type"></component>
    </div>
</template>
<style lang="less" scoped>
@import url(./citizenInteraction.less);
</style>
<script lang="ts" src="./citizenInteraction.ts" />