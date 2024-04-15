<script setup lang="ts">
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

const model = defineModel<string>()
</script>

<template>
  <VueDatePicker
    v-model="model"
    placeholder="Select Date"
    :enable-time-picker="false"
    format="yyyy-MM-dd"
    model-type="yyyy-MM-dd"
    auto-apply />
</template>
