<template>
  <div @click="addAction">
    <i class="ti ti-file-like"></i>
    <i class="ti ti-location-up"></i>
    {{ $t('ruleactions.associateToCrowdplanning', 'Associa il Task/Issue al crowdplannign in base alla posizione') }}
  </div>
</template>
<script lang="ts" src="./assignToPlanByLocation.ts"></script>
