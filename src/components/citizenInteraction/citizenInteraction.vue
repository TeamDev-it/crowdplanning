<template>
  <div class="container">
    <div class="title">
      {{ $t('plans.citizen.assess-proposal', 'Valuta la proposta') }}
    </div>
    <spid-login v-if="!mySelf"></spid-login>
    <div class="rating" v-else>
      <component :is="ratingComponent" :id="id" :type="type"></component>
      <inject class="discussion components" name="discussion-room" group="generic" :type="type" :id="id"></inject>
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
