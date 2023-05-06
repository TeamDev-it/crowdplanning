<template>
    <div class="task-list">
        <task-card v-for="task in tasks" :key="task.id" :value="task"></task-card>
    </div>
</template>
<style lang="less" scoped>
@import url(./taskList.less);
</style>
<script lang='ts' src="./taskList.ts" />