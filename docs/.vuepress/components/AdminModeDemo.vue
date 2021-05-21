<template></template>

<script lang="ts">
import { AdminService } from '../../../src'

const adminService = new AdminService({
  onChange: adminMode => console.log({ adminMode }),
  onRedDotClick: () => alert('RedDot clicked'),
})

export default {
  mounted() {
    adminService.startListening()
  },
}
</script>
