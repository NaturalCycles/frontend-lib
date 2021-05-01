<template>
  <div>
    <p>
      <span class="label">maxHeight: {{ maxHeight }}</span>
      <input type="range" min="10" max="400" step="20" v-model="maxHeight" @change="update" /><br />
      <span class="label">margin: {{ margin }}</span>
      <input type="range" min="0" max="20" v-model="margin" @change="update" /><br />
    </p>

    <p v-if="!images.length">Loading images...</p>

    <div id="imagesContainer" :style="{ margin: `-${margin / 2}px` }">
      <img
        v-for="im in images"
        :style="{
          width: `${im.fitWidth}px`,
          height: `${im.fitHeight}px`,
          margin: `${margin / 2}px`,
        }"
        :src="im.src"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { StringMap } from '@naturalcycles/js-lib'
import { fitImages, FitImage } from '../../../src/image/fitImages'

const imageIds = [
  'a8ZYS21_Toc',
  'rpxnS9CtEDw',
  'Ck-qAr0qbAI',
  'h5UOgcq1Dkw',
  'Jwhzumwgq9Q',
  '2aLB0aQI5v4',
  '0Q_XPEm2oVQ',
  'bz0H2d753_U',
  'oSIl84tpYYY',
  'cX0Yxw38cx8',
  'Y6Oi_1aGKPg',
  'AqGhEk1khbE',
  'XDvvt_IEH_w',
  'leSvrOiu-nE',
  'lkeBDBTwjWQ',
  '6tJ50mdoyY4',
  'wqJW5B9Q05I',
  'Q2xGYGSu0Qo',
  'Ai-AnKx5bSM',
  'O4TA_kXW9as',
  'aV31XuctrM8',
  'zwoYd0ZiBmc',
  'vMGM9Y48eIY',
]

export default {
  data() {
    return {
      maxHeight: 300,
      margin: 8,
      images: [] as FitImage[],
      listener: null as Function | null,
    }
  },

  async mounted() {
    // Preload images
    const map: StringMap<FitImage> = {}

    await new Promise(resolve => {
      imageIds.forEach(id => {
        const img = new Image()

        img.onload = () => {
          const { width, height, src } = img
          map[id] = {
            src,
            aspectRatio: width / height,
          }

          if (Object.keys(map).length === imageIds.length) resolve()
        }

        img.src = `https://source.unsplash.com/${id}`
      })
    })

    this.images = imageIds.map(id => map[id])

    this.update()
  },

  methods: {
    update() {
      const container = document.getElementById('imagesContainer')!

      this.listener?.()

      this.listener = fitImages({
        container,
        images: this.images,
        maxHeight: this.maxHeight,
        margin: this.margin,
        onChange: images => {
          this.images = [...images]
        },
      })
    }
  },
}
</script>

<style>
#imagesContainer {
  line-height: 0;
}

#imagesContainer img {
  margin: 4px;
}

.label {
  display: inline-block;
  width: 160px;
}

input {
  width: 200px;
}
</style>
