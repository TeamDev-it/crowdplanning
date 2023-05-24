<template>
    <div class="item" :class="{active: selectedCategory === value}">
        <i :class="iconCode"></i>
        <span class="text">{{ value.name }}</span>
    </div>
</template>

<script lang="ts" src="./crowdplanningGroupsItem.ts" />

<style lang="less" scoped>
@import url(./crowdplanningGroupsItem.less);
</style>