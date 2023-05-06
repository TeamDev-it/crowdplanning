<template>
    <div class="container">
        <div class="title">
            {{ $t("plans.citizen.assess-proposal", "Valuta la proposta").toUpperCase() }}
        </div>
        <spid-login v-if="!mySelf"></spid-login>
    </div>
</template>
<style lang="less" scoped>
@import url(./citizenInteraction.less);
</style>
<script lang="ts" src="./citizenInteraction.ts" />