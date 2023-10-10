<template>
  <div class="container">
    <div class="title">
      <div class="text">
        {{ $t('plans.citizen.assess-proposal', 'Valuta la proposta') }}
      </div>

      <div class="rating" v-if="mySelf">
        <component :is="ratingComponent" :id="id" :type="type"></component>
      </div>
    </div>
    <spid-login v-if="!mySelf"></spid-login>
    <div class="command">
      <button class="success" @click="() => $emit('openCommentSection')">{{ $t('plan.citizen-comment.leave-comment', 'Lascia un commento') }}</button>
    </div>
  </div>
</template>
<style lang="less" scoped>
@import url(./citizenInteraction.less);
</style>

<style lang="less">
.container {
  .rating {
    .discussion {
      .discussion-room {
        .description {
          display: none;
        }
      }
    }
  }
}
</style>
<script lang="ts" src="./citizenInteraction.ts" />
