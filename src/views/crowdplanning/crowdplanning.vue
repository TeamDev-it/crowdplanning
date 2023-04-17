
import CrowdplanningHeader from '@/components/crowdplanningHeader/crowdplanningHeader';

<template>
    <div id="crowdplanning">
        <crowdplanning-header v-if="plansGroup"></crowdplanning-header>
    </div>
</template>
<script lang="ts" src="./crowdplanning.ts" />
<style lang="less">
@import url(./crowdplanning.less);
</style>