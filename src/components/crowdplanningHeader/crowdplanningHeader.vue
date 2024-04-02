<template>
  <header :class="{ noGroups: noGroups }">
    <div v-if="!noGroups">
      <div class="search">
        <input type="text" :placeholder="$t(`plan.search`, 'cerca')" v-model.trim="searchedValue" />
      </div>
    </div>
    <div class="header-content">
      <div class="group-name">
        <button class="square" @click="toggleMenu()">
          <i v-if="!noGroups" class="ti ti-chevron-left"></i>
          <i v-if="noGroups" class="ti ti-chevron-right"></i>
        </button>
        <div class="text" v-if="group">
          <span
            ><strong>{{ group.name }}</strong></span
          >
          <span>{{ group.description }}</span>
        </div>
        <div v-if="!group">
          <span
            ><strong>{{ $t('plans.groups.see_all', 'Tutte le categorie') }}</strong></span
          >
        </div>
      </div>
      <div class="btn">
        <button class="success list" :class="{ plain: !visualListOpened }" @click="toggleOpened2()" @blur="visualListOpened = false">
          <i class="ti ti-note"></i>
          <span>{{ $t(`visualwhat`, 'visualizza') }}</span>
          <div class="viewOpt" v-show="visualListOpened">
            <div class="viewCont">
              <div class="view">
                <label for="fromIssue">{{ $t(`crowdplanning.changeview.fromIssue`, `Progetti con segnalazioni`) }}</label>
                <toggle type="checkbox" id="fromIssue" name="changeView" v-model="fromIssue" :disabled="!simple" />
              </div>
              <div class="view">
                <label for="simple">{{ $t(`crowdplanning.changeview.simple`, `Progetti senza segnalazioni`) }}</label>
                <toggle type="checkbox" id="simple" name="changeView" v-model="simple" :disabled="!fromIssue" />
              </div>
            </div>
          </div>
        </button>
        <button class="success list" :class="{ plain: !showListOpened }" @click="toggleOpened()" @blur="showListOpened = false">
          <i class="ti ti-eye"></i>
          <span>{{ $t(`showwhat`, 'mostra') }}</span>
          <div class="viewOpt" v-show="showListOpened">
            <div class="viewCont">
              <div class="view">
                <label for="map">{{ $t(`crowdplanning.changeview.map`, `Mostra mappa`) }}</label>
                <toggle type="checkbox" id="map" name="changeView" v-model="seeMap" :disabled="!seeProjects" />
              </div>
              <div class="view">
                <label for="proj">{{ $t(`crowdplanning.changeview.projects`, `Mostra progetti`) }}</label>
                <toggle type="checkbox" id="proj" name="changeView" v-model="seeProjects" :disabled="!seeMap" />
              </div>
            </div>
          </div>
        </button>
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
