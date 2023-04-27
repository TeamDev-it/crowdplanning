<template>
    <div class="summary-container">
        <div class="title">
            <span v-if="task.title">{{ task.title.toUpperCase() }}</span>
        </div>
        <div class="description" v-html="task.description"></div>
        <div class="attachments">
            <div class="section-title">{{ $t("plans.attachments", "allegati").toUpperCase() }}</div>
            <div class="">
                
            </div>
        </div>
    </div>
</template>
 
<style lang="less" scoped>
@import url(./taskSummary.less);
</style>

<script lang="ts" src="./taskSummary.ts" />