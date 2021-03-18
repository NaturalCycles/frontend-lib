<template>
  <div>
    <button @click="loadGood">Load good script</button>
    <button @click="loadBad">Load bad script</button>
    <p v-if="loading">loading...</p>
  </div>
</template>

<script lang="ts">
import { _anyToErrorMessage, _createPromiseDecorator } from '@naturalcycles/js-lib'
import Vue from 'vue'
import Component from 'vue-class-component'
import { loadScript } from '../../../src'

export const ErrorHandler = () =>
  _createPromiseDecorator({
    decoratorName: 'ErrorHandler',
    catchFn: ({ err }) => alert(_anyToErrorMessage(err)),
  })

@Component
export default class LoadScriptDemo extends Vue {
  loading = false

  async loadGood() {
    await this.load(`https://unpkg.com/jquery@3.6.0/dist/jquery.js`)
    this.loading = false
  }

  async loadBad() {
    await this.load(`https://unpkg.com/jqueryNON_EXISTING`)
    this.loading = false
  }

  @ErrorHandler()
  async load(src: string) {
    this.loading = true
    await loadScript(src)
    alert('loaded ok')
  }
}
</script>
