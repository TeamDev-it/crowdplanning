<template>
    <div class="scrollable-container" v-show="scrollableContent">
        <div class="scroll left-btn" v-if="isLeftScrollButtonVisible" @click="scroll('left')">
            <i class="ti ti-chevron-left"></i>
        </div>
        <div class="scrollable-content" ref="scrollableContent">
            <slot></slot>
        </div>
        <div class="scroll right-btn" v-if="isRightScrollButtonVisible" @click="scroll('right')">
            <i class="ti ti-chevron-right"></i>
        </div>
    </div>
</template>

<style lang="less" scoped>
@import url(./scrollableContainer.less);
</style>

<script lang="ts" src="./scrollableContainer.ts" />