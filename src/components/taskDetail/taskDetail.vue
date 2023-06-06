<template>
  <div v-if="task" class="detail-container">
    <div class="header">
      <div class="title">{{ task.title }}</div>
      <div class="commands">
        <div class="edit" v-if="hasPermission('plans.canedit')" @click="edit">
          <i class="ti ti-pencil"></i>
        </div>
        <div class="close" @click="clearTask">
          <i class="ti ti-x"></i>
        </div>
      </div>
    </div>
    <!-- <task-card :value="task" :showCommands="false"></task-card> -->
    <div class="content">
      <task-summary :plan="task" :workspaceId="task.workspaceId"></task-summary>
      <attachments-list :files="files" :workspaceId="task.workspaceId ?? ''" :planId="task.id"></attachments-list>
      <citizen-interaction :id="task.id" :type="type"></citizen-interaction>
    </div>
  </div>
</template>

<style lang="less" scoped>
@import url(./taskDetail.less);
</style>

<script lang="ts" src="./taskDetail.ts" />
