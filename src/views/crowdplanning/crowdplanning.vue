<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <div id="crowdplanning" :class="{fullscreen: !currentUser}">
        <crowdplanning-header />
        <div class="crowdplanning-content">

        </div>
    </div>
</template>
<script lang="ts" src="./crowdplanning.ts" />
<style lang="less" scoped>
@import url(./crowdplanning.less);
</style>