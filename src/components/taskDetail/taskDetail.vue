<template>
  <div class="detail-container">
    <div class="header">
      <div class="back" @click="back">
        <i class="ti ti-arrow-left"></i>
      </div>
      <div class="title">{{ selectedPlanTitle }}</div>

      <div class="commands">
        <component :is="likeButton" :type="type" :id="selectedPlan?.id"></component>
        <button v-if="selectedPlan && $can('PLANS.plans.canedit')" class="success" @click="edit(selectedPlan)"><i class="ti ti-pencil"></i></button>
      
      </div>
    </div>

    <div class="content">
      <!-- <div class="content" :class="{ noComment: !selectedPlan?.citizensCanSeeOthersComments }"> -->
      <div class="task-summary-cont">
        <task-summary :plan="selectedPlan" :key="`summary-${planId}`" :workspaceId="workspaceId" :likes="count"></task-summary>
      </div>
   
      <div class="third-column">
        <div class="comments-section">

          <component
            :canSeeOthersComments="canSeeOthersComments"
            :currentUser="currentUser"
            :is="discussionRoom"
            :type="type"
            :id="planId"
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
