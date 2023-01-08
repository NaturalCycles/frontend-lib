<script setup lang="ts">
import { _stringifyAny } from '@naturalcycles/js-lib'
import { ref } from 'vue'
import { loadScript } from '../../src'

const loading = ref(false)

async function loadGood() {
  await load(`https://unpkg.com/jquery@3.6.0/dist/jquery.js`)
  loading.value = false
}

async function loadBad() {
  await load(`https://unpkg.com/jqueryNON_EXISTING`)
  loading.value = false
}

async function load(src: string) {
  loading.value = true
  await loadScript(src)
    .then(() => alert('loaded ok'))
    .catch(err => {
      alert(_stringifyAny(err))
    })
}
</script>

<template>
  <div class="app-content">
    <button @click="loadGood">Load good script</button>
    <button @click="loadBad">Load bad script</button>
    <p v-if="loading">loading...</p>
  </div>
</template>

<style>
@import '/custom.css';
</style>
