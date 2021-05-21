<template>
  <div>
    <button @click="loadGood">Load good script</button>
    <button @click="loadBad">Load bad script</button>
    <p v-if="loading">loading...</p>
  </div>
</template>

<script lang="ts">
import { _anyToErrorMessage, _createPromiseDecorator } from '@naturalcycles/js-lib'
import { loadScript } from '../../../src'

const ErrorHandler = () =>
  _createPromiseDecorator({
    decoratorName: 'ErrorHandler',
    catchFn: ({ err }) => alert(_anyToErrorMessage(err)),
  })

export default {
  data() {
    return {
      loading: false,
    }
  },

  methods: {
    async loadGood() {
      await this.load(`https://unpkg.com/jquery@3.6.0/dist/jquery.js`)
      this.loading = false
    },

    async loadBad() {
      await this.load(`https://unpkg.com/jqueryNON_EXISTING`)
      this.loading = false
    },

    // @ErrorHandler() // doesn't work without Class/method
    async load(src: string) {
      this.loading = true
      await loadScript(src)
        .then(() => alert('loaded ok'))
        .catch(err => {
          alert(_anyToErrorMessage(err))
        })
    },
  },
}
</script>
