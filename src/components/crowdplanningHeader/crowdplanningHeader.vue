<template>
  <header>
    <div>
      <div class="search">
        <input type="text" :placeholder="$t(`plan.search`, 'cerca')" v-model.trim="searchedValue" />
      </div>
    </div>
    <div class="header-content">
      <div class="btn">
        <button class="success list" :class="{ plain: !showListOpened }" @click="toggleOpened()" @blur="showListOpened = false">
          <i class="ti ti-eye"></i>
          <span>{{ $t(`showwhat`, 'mostra') }}</span>
          <div class="viewOpt" v-show="showListOpened">
            <div class="viewCont">
              <div class="view">
                <label for="default">{{ $t(`crowdplanning.changeview.map`, `Mostra mappa`) }}</label>
                <toggle type="checkbox" id="default" name="changeView" v-model="seeMap" />
              </div>
              <!-- <div class="view">
                <label for="default">{{ $t(`crowdplanning.changeview.progetti`, `Mostra progetti scaduti`) }}</label>
                <toggle type="checkbox" id="default" name="" v-model="expiredPrj" />
              </div> -->
            </div>
          </div>
        </button>
        <!--      button per filtro futuro 
         <button class="success plain">
          <i class="ti ti-filter"></i>
          <span>{{ $t(`plan.header.section.filter`) }}</span>
        </button> -->
        <button class="square success add" v-if="currentUser && hasPermission('plans.cancreate')" @click="addPlan()">
          <i class="ti ti-plus"></i>
        </button>
      </div>
    </div>
  </header>
</template>

<script lang="ts" src="./crowdplanningHeader.ts" />

<style lang="less" scoped>
@import url(./crowdplanningHeader.less);
</style>
