<template>
  <div class="detail-container">
    <div class="header">
      <div class="back" @click="back">
        <i class="ti ti-arrow-left"></i>
      </div>
      <div class="title">{{ selectedPlanTitle }}</div>

      <div class="commands">
        <component v-if="canVote()" :is="likeButton" :type="type" :id="selectedPlan?.id" />
        <button v-if="selectedPlan && $can('PLANS.plans.canedit')" class="success" @click="edit">
          <i class="ti ti-pencil"></i>
        </button>
      </div>
    </div>

    <div class="content">
      <div class="plan-summary-cont">
        <plan-summary :plan="selectedPlan" :key="`summary-${planId}`" :workspaceId="workspaceId" :likes="count" />
      </div>
      <div class="third-column">
        <div class="togglebtn">
          <div @click="toggleSections('comments')" :class="{ active: comments }">Commenti</div>
          <div v-if="issuesButton" @click="toggleSections('issues')" :class="{ active: issues }">Segnalazioni</div>
        </div>
        <div class="comments-section" v-if="canSeeMsg()" v-show="comments">
          <component> </component>
          <component
            :currentUser="currentUser"
            :is="discussionRoom"
            :type="type"
            :id="planId"
            :titlePlaceholder="{ key: 'plans.comments.title', value: 'Commenti' }"
            :textPlaceholder="{ key: 'plans.comments.text', value: 'Utilizza questo spazio per commentare la proposta.' }"
            :showCommentsCount="true"
          />
        </div>
        <div class="issues-section" v-show="issues">
          <div class="crowdplanning-task-card" v-for="(task, tidx) in tasksList" :key="`t-${tidx}-${task.id}`">
            <div class="info">
              <small>
                <span>#{{ task.shortId }}</span>
              </small>
              <strong>{{ task.title }}</strong>
              <div class="description" v-html="task.description" v-tooltip="task.description"></div>
              <div class="state"><strong>{{ $t('taskgroupby.status') }}:</strong> {{ task.state }}</div>
            </div>
            <div class="icon">
              <i class="ti ti-clock" v-tooltip=" date(task.creationDate, 'DD/MM/YYYY') "></i>
            </div>
          </div>
          <!-- <component
            v-if="$can('TASKS.canseeas.board')"
            style="width: 100%"
            :is="taskCardComponent"
            v-for="(task, tidx) in tasksList"
            :key="`t-${tidx}-${task.id}`"
            :value="task"
            :customFields="[]"
          >
          </component> -->
          <!-- <component  style="width: 100%" :is="citizenTaskCardComponent" v-for="(task, tidx) in tasksList" :key="`t-${tidx}-${task.id}`" :task="task" :states="[]">
          </component> -->
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
@import url(./planDetail.less);
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
</style>

<script lang="ts" src="./planDetail.ts" />
