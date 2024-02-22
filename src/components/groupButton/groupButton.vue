<template>
  <div
    class="crowdplanning-group-button"
    @click.stop="toggleOpened()"
    @keydown.enter="toggleOpened()"
    :class="{ asselect: showAsSelect, notselected: disableRoot && value.id === plansGroupRoot.id }"
    v-if="plansGroupRoot"
  >
    <template v-if="showAsSelect">
      <div class="select">
        <span class="placeholder" v-if="!value">{{ $t('plans.groupButton.placeholder', 'Scegli una categoria') }}</span>
        <span v-else-if="value">{{ value.description || value.name }}</span>
        <i class="ti ti-chevron-down" v-if="!listOpened"></i>
        <i class="ti ti-chevron-up" v-if="listOpened"></i>
      </div>
    </template>
    <template v-else>
      <div class="ispan">
        <span class="groupName" v-if="value">{{ value.name }}</span>
      </div>
      <i class="ti ti-chevron-down" v-if="!listOpened"></i>
      <i class="ti ti-chevron-up" v-if="listOpened"></i>
    </template>

    <div
      class="list can-scroll-y"
      v-if="listOpened"
      :style="{
        left: `${horizontalPosition}px`,
        top: `${topPosition}px`,
        width: `${width}px`
      }"
    >
      <template v-for="(g, idx) in plansGroupRoot.children">
        <div
          tabindex="0"
          class="group"
          :key="idx"
          @click.stop="
            value = g;
            listOpened = false;
          "
          @keydown.enter="
            value = g;
            listOpened = false;
          "
        >
          <div class="parent text" :class="{ active: value == g }">{{ g.name }}</div>
          <div
            tabindex="0"
            class="subgroup"
            v-for="(fg, idx) in g.children"
            :key="idx"
            @click.stop="
              value = fg;
              listOpened = false;
              fg.iconCode = g.iconCode;
            "
            @keydown.enter="
              value = fg;
              listOpened = false;
              fg.iconCode = g.iconCode;
            "
          >
            <div class="first text" :class="{ active: value == fg }">{{ fg.name }}</div>
            <div
              tabindex="0"
              class="subgroup"
              v-for="(sg, idx) in fg.children"
              :key="idx"
              @click.stop="
                value = sg;
                listOpened = false;
                sg.iconCode = g.iconCode;
              "
              @keydown.enter="
                value = sg;
                listOpened = false;
                sg.iconCode = g.iconCode;
              "
            >
              <div class="second text" :class="{ active: value == sg }">{{ sg.name }}</div>
              <div
                tabindex="0"
                class="subgroup"
                v-for="(tg, idx) in sg.children"
                :key="idx"
                @click.stop="
                  value = tg;
                  listOpened = false;
                  tg.iconCode = g.iconCode;
                "
                @keydown.enter="
                  value = tg;
                  listOpened = false;
                  tg.iconCode = g.iconCode;
                "
              >
                <div class="third text" :class="{ active: value == tg }">{{ tg.name }}</div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
<script src="./groupButton.ts" lang="ts"></script>
<style lang="less" scoped>
@import url(./groupButton.less);
</style>
