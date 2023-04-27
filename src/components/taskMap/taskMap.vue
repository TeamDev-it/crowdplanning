<template>
    <div class="task-map">
        <component :is="mapComponent" v-model="values" v-if="values && states && states.length" :type="group.taskType" :center="center"></component>
    </div>
</template>
<script lang="ts" src="./taskMap.ts" />
<style lang="less">
@import url(./taskMap.less);
</style>