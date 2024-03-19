<template>
  <div class="detail-container">
    <div class="header">
      <div class="back" @click="back">
        <i class="ti ti-arrow-left"></i>
      </div>
      <div class="title">{{ selectedPlanTitle }}</div>

      <div class="commands" v-if="loggedIn">
        <component v-if="canVote()" :is="likeButton" :type="type" :id="selectedPlan?.id" />
        <button v-if="selectedPlan && $can('PLANS.plans.canedit')" class="success" @click="edit">
          <i class="ti ti-pencil"></i>
        </button>
      </div>
      <div v-if="!loggedIn"> 
        <button class="like" @click="openLoginModal()">
          <i class="ti ti-heart"></i>
          <span class="text">{{ $t('taskDetail.giveVote', 'Mi piace') }}</span>
        </button>
      </div>
    </div>

    <div class="content">
      <div class="plan-summary-cont">
        <plan-summary :plan="selectedPlan" :key="`summary-${planId}`" :workspaceId="workspaceId" :likes="count" />
      </div>
      <div class="third-column" v-if="canSeeMsg() || canWriteMsg() || selectedPlan?.planType == 'fromIssues'">
        <div class="togglebtn">
          <div v-if="canSeeMsg() || canWriteMsg()" @click="toggleSections('comments')" :class="{ active: comments }">Commenti</div>
          <div v-if="selectedPlan?.planType == 'fromIssues'" @click="toggleSections('issues')" :class="{ active: issues }">Segnalazioni</div>
        </div>
        <div class="comments-section" v-if="canSeeMsg() || canWriteMsg()" v-show="comments">
          <component
            v-if="loggedIn"
            :canSeeMsg="canSeeMsg()"
            :canWriteMsg="canWriteMsg()"
            :is="discussionRoom"
            :type="type"
            :id="planId"
            :titlePlaceholder="{ key: 'plans.comments.title', value: 'Commenti' }"
            :textPlaceholder="{ key: 'plans.comments.text', value: 'Utilizza questo spazio per commentare la proposta.' }"
            :showCommentsCount="true"
          />
          <button v-if="!loggedIn" class="log-button" @click="openLoginModal()">Accedi per commentare</button>
        </div>
        <div class="issues-container" v-show="selectedPlan?.planType == 'fromIssues'">
          <div class="issues-section">
            <div class="crowdplanning-task-card" v-for="(task, tidx) in tasksList" :key="`t-${tidx}-${task.id}`">
              <div class="info">
                <small>
                  <span>#{{ task.shortId }}</span>
                </small>
                <strong>{{ task.title }}</strong>
                <div class="description" v-html="task.description" v-tooltip="task.description"></div>
                <div class="state">
                  <strong>{{ $t('taskgroupby.status') }}:</strong> {{ task.state }}
                </div>
              </div>
              <div class="icon">
                <div class="actions" style="display: absolute">
                  <button
                    v-if="selectedPlan && selectedPlan.id"
                    class="square none"
                    @dblclick="removeTask(selectedPlan.id, task.id)"
                    v-tooltip="$t('plans.issues.delete', 'Doppio click per scollegare la segnalazione dal progetto')"
                  >
                    <i class="ti ti-unlink"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div class="button-section" v-show="selectedPlan?.planType == 'fromIssues'">
            <button v-if="selectedPlan?.planType == 'fromIssues'" @click="createIssue" class="sendIssue">{{ $t('plans.newissues.create', 'Invia nuova segnalazione') }}</button>
          </div>
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
