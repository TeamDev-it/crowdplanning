<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <div id="crowdplanning">
        <crowdplanning-header :currentUser="currentUser" @createGroup="createGroup()" />
        <div class="crowdplanning-content">
            <scrollable-container v-if="plansGroupRoot && plansGroupRoot.id && plansGroupRoot.children.length">
                <crowdplanning-group-list :groups="groups"></crowdplanning-group-list>
            </scrollable-container>
        </div>
    </div>
</template>
<script lang="ts" src="./crowdplanning.ts" />
<style lang="less" scoped>
@import url(./crowdplanning.less);
</style>