
import CrowdplanningHeader from '@/components/crowdplanningHeader/crowdplanningHeader';

<template>
    <div id="crowdplanning">
        <crowdplanning-header v-if="plansGroupRoot"></crowdplanning-header>
    </div>
</template>
<script lang="ts" src="./crowdplanning.ts" />
<style lang="less" scoped>
@import url(./crowdplanning.less);
</style>