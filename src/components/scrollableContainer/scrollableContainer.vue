<template>
    <div class="scrollable-container">
        <button ref="left" class="scroll-left-btn"></button>
        <div class="scrollable-content" ref="scrollableContent">
            <slot></slot>
        </div>
        <button ref="right" class="scroll-right-btn"></button>
    </div>
</template>

<style lang="less" scoped>
@import url(./scrollableContainer.less);
</style>

<script lang="ts" src="./scrollableContainer.ts" />