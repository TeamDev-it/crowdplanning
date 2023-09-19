<template>
  <div v-if="task" class="detail-container">
    <div class="header">
      <div class="back" @click="onBackClick">
        <i class="ti ti-arrow-left"></i>
      </div>
      <div class="title">{{ task.title }}</div>
      <!-- <div class="commands">
        <div class="remove" v-if="hasPermission('plans.candelete')" @dblclick="remove">
          <i class="ti ti-trash"></i>
        </div>
        <div class="edit" v-if="hasPermission('plans.canedit')" @click="edit">
          <i class="ti ti-pencil"></i>
        </div>
        <div class="close" @click="clearTask">
          <i class="ti ti-x"></i>
        </div>
      </div> -->
    </div>
    <!-- <task-card :value="task" :showCommands="false"></task-card> -->

    <div class="content">
      <div class="task-summary-cont">
        <task-summary :plan="task" :key="`summary-${selectedPlanId}`" :workspaceId="task.workspaceId"></task-summary>
      </div>
      <!-- <div class="second-column" v-if="(task.attachmentsIds && task.attachmentsIds.length) || children.length">
          <div class="attachments">
            <span>{{ $t('plans.detail.attachments', 'Allegati') }}</span>
            <component :key="`attachments-${selectedPlanId}`" :is="sharedPreviewComponent" :shareds="task.attachmentsIds"></component>
          </div>
          <div class="children-plans" :key="`children-${selectedPlanId}`" v-if="children.length">
            <children-plans :children="children"></children-plans>
          </div>
        </div> -->
      <div class="third-column">
        <div class="comments-section" >
          <!-- <div class="command" @click="closeCommentsSection">
            <i class="ti ti-x"></i>
          </div> -->
          

          <component
            :is="discussionRoom"
            :type="type"
            :id="selectedPlanId"
            :titlePlaceholder="{ key: 'plans.comments.title', value: 'Commenti' }"
            :textPlaceholder="{ key: 'plans.comments.text', value: 'Utilizza questo spazio per commentare la proposta.' }"
            :showCommentsCount="true" 
          >
          </component>
        </div>
        <!-- <task-map :key="`map-${selectedPlanId}`" :group="selectedGroup ?? rootGroup" v-else></task-map> -->
        <!-- <citizen-interaction :key="`interaction-${selectedPlanId}`" :id="task.id" :type="type" @openCommentSection="openCommentSection"></citizen-interaction> -->
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
        min-width: 200px;
        min-height: 150px;
        max-height: 250px;
        max-width: 300px;
        height: auto;
        width: auto;
      }
    }
  }
}

// .comments-section {
//   .discussion {
//     height: 100%;
//     .discussion-room {
//       margin: 0 !important;
//       .count {
//         color: #4b4847;
//         font-family: Open Sans;
//         font-size: 18px;
//         font-style: normal;
//         font-weight: 600;
//         line-height: 24.788px; /* 137.71% */
//       }
//       .description {
//         display: none;
//       }
//     }
//   }
// }
</style>

<script lang="ts" src="./taskDetail.ts" />
