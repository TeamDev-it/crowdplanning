<template>
  <div v-if="task" class="detail-container">
    <div class="header">
      <div class="back" @click="onBackClick">
        <i class="ti ti-arrow-left"></i>
      </div>
      <div class="title">{{ task.title }}</div>
      <div class="commands">
        <div class="remove" v-if="hasPermission('plans.candelete')" @dblclick="remove">
          <i class="ti ti-trash"></i>
        </div>
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
      <div class="second-column" v-if="(task.attachmentsIds && task.attachmentsIds.length) || children.length">
        <div class="attachments">
          <span>{{ $t('plans.detail.attachments', 'Allegati') }}</span>
          <component :is="sharedPreviewComponent" :shareds="task.attachmentsIds"></component>
        </div>
        <div class="children-plans" v-if="children.length">
          <children-plans :children="children"></children-plans>
        </div>
      </div>
      <div class="third-column">
        <task-map :group="selectedGroup ?? rootGroup"></task-map>
        <citizen-interaction :id="task.id" :type="type"></citizen-interaction>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
@import url(./taskDetail.less);
</style>

<style lang="less">
.media {
  .public-media-gallery {
    .image-container {
      max-width: 400px;
      .preview {
        width: fit-content;
        height: fit-content;
        > img {
          max-height: 150px;
          max-width: 150px;
        }
      }
    }
  }
}

.second-column {
  .attachments {
    .image-container {
      .preview {
        width: 200px;
        height: 150px;
      }
    }
  }
}
</style>

<script lang="ts" src="./taskDetail.ts" />
