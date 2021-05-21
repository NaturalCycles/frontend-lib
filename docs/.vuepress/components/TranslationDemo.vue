<template>
  <div>
    <div v-if="loading">Loading...</div>
    <pre v-else>
translationService.currentLocale == <button
      v-for="locale of translationService.cfg.supportedLocales"
      :disabled="translationService.currentLocale === locale"
      @click="translationService.currentLocale = locale">{{ locale }}</button>
key1: "{{ tr1 }}"
key2: "{{ tr2 }}"

translationService.locales: {{ translationService.locales }}
</pre>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { FetchTranslationLoader, TranslationService } from '../../../src'

const translationService = new TranslationService({
  defaultLocale: 'en',
  currentLocale: 'en',
  supportedLocales: ['en', 'ru'],
  translationLoader: new FetchTranslationLoader({
    // logStart: true,
    // logFinished: true,
    topbar: true,
    alertOnError: true,
    prefixUrl: 'lang',
  }),
})

const tr = (key: string): string => translationService.translate(key)

Vue.filter('tr', tr)

export default {
  data() {
    return {
      translationService,
      loading: true,
    }
  },

  computed: {
    tr1() {
      return translationService.translate('key1')
    },

    tr2() {
      return translationService.translate('key2')
    },
  },

  async mounted() {
    // await pDelay(3000)
    await translationService.loadLocale(['en', 'ru'])

    this.loading = false
  },
}
</script>

<style>
button {
  cursor: pointer;
  padding: 4px 16px;
  margin: 0 2px;
}
</style>
