<template>
  <div
    class="crowdplanning-group-button"
    @click.stop="listOpened ? closeList() : openList()"
    @keydown.enter="listOpened ? closeList() : openList()"
    :class="{ asselect: showAsSelect, notselected: disableRoot && value.id === plansGroupRoot.id }"
    v-if="plansGroupRoot"
  >
    <div v-if="showAsSelect" class="select-cont">
      <div class="select">
        <span class="placeholder" v-if="!value">{{ $t('plans.groupButton.placeholder', 'Scegli una categoria') }}</span>
        <span v-else-if="value">{{ value.name || value.description }}</span>
        <i class="ti ti-chevron-down" v-if="!listOpened"></i>
        <i class="ti ti-chevron-up" v-if="listOpened"></i>
      </div>
    </div>
    <div v-else>
      <div class="ispan">
        <span class="groupName" v-if="value">{{ value.name }}</span>
      </div>
      <i class="ti ti-chevron-down" v-if="!listOpened"></i>
      <i class="ti ti-chevron-up" v-if="listOpened"></i>
    </div>

    <div
      class="list can-scroll-y"
      v-if="listOpened"
    >
      <div v-for="(g, idx) in plansGroupRoot.children" style="width: 100%;">
        <div
          tabindex="0"
          class="group"
          :key="idx"
          @click.stop="
            emitGroup(g);
          "
          @keydown.enter="
           emitGroup(g);
          "
        >
          <div class="parent text" :class="{ active: value == g }">{{ g.name }}</div>
          <div
            tabindex="0"
            class="subgroup"
            v-for="(fg, idx) in g.children"
            :key="idx"
            @click.stop="
              fg.iconCode = g.iconCode;
              emitGroup(fg);
            "
            @keydown.enter="
              fg.iconCode = g.iconCode;
              emitGroup(fg);
            "
          >
            <div class="first text" :class="{ active: value == fg }">{{ fg.name }}</div>
            <div
              tabindex="0"
              class="subgroup"
              v-for="(sg, idx) in fg.children"
              :key="idx"
              @click.stop="
                sg.iconCode = g.iconCode;
                emitGroup(sg);
              "
              @keydown.enter="
                sg.iconCode = g.iconCode;
                emitGroup(sg);
              "
            >
              <div class="second text" :class="{ active: value == sg }">{{ sg.name }}</div>
              <div
                tabindex="0"
                class="subgroup"
                v-for="(tg, idx) in sg.children"
                :key="idx"
                @click.stop="
                  tg.iconCode = g.iconCode;
                  emitGroup(tg);
                "
                @keydown.enter="
                  tg.iconCode = g.iconCode;
                  emitGroup(tg);
                "
              >
                <div class="third text" :class="{ active: value == tg }">{{ tg.name }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script src="./groupButton.ts" lang="ts"></script>
<style lang="less" scoped>
@import url(./groupButton.less);
</style>
