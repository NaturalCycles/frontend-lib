<template></template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { AdminService } from '../../../src'

const adminService = new AdminService({
  onChange: adminMode => console.log({ adminMode }),
  onRedDotClick: () => alert('RedDot clicked'),
})

@Component
export default class AdminModeDemo extends Vue {
  mounted() {
    adminService.startListening()
  }
}
</script>
