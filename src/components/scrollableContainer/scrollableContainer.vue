<template>
    <div class="scrollable-container" v-if="scrollableContent">
        
        <div class="scrollable-content" ref="scrollableContent">
            <slot></slot>
        </div>
       
    </div>
</template>

<style lang="less" scoped>
@import url(./scrollableContainer.less);
</style>

<script lang="ts" src="./scrollableContainer.ts" />