export interface FitImagesCfg {
  /**
   * Container of the images
   */
  container: HTMLElement

  /**
   * Array of image metadatas (most notably: aspectRatio).
   */
  images: FitImage[]

  /**
   * Will be called on each layout change.
   * Should be listened to to update the width/height of the images in your DOM.
   */
  onChange(images: FitImage[]): any

  /**
   * Max image height in pixels.
   *
   * @default 300
   */
  maxHeight?: number

  /**
   * Margin between images.
   *
   * @default 8
   */
  margin?: number
}

export interface FitImage {
  src: string

  /**
   * width divided by height
   */
  aspectRatio: number

  /**
   * Calculated image width to fit the layout.
   */
  fitWidth?: number
  /**
   * Calculated image height to fit the layout.
   */
  fitHeight?: number
}

export type StopFunction = () => void

/**
 * Calculates the width/height of the images to fit in the layout.
 *
 * Currently does not mutate the cfg.images array, but DOES mutate individual images with .fitWidth, .fitHeight properties.
 *
 * @experimental
 */
export function fitImages(cfg: FitImagesCfg): StopFunction {
  const { container, maxHeight = 300, margin = 8, images } = cfg

  let containerWidth = -1

  const observer = new ResizeObserver(update)
  observer.observe(container)

  return () => {
    observer.disconnect()
  }

  function update(entries: ResizeObserverEntry[]): void {
    const width = Math.floor(entries[0]!.contentRect.width)
    if (width === containerWidth) return // we're only interested in width changes
    containerWidth = width

    console.log(`resize ${width}`)
    doLayout(images)
    cfg.onChange(images)
  }

  function doLayout(imgs: readonly FitImage[]): void {
    if (imgs.length === 0) return // nothing to do

    let imgNodes = imgs.slice(0)

    w: while (imgNodes.length > 0) {
      let slice: FitImage[]
      let h: number

      for (let i = 1; i <= imgNodes.length; i++) {
        slice = imgNodes.slice(0, i)
        h = _getHeigth(slice)

        if (h < maxHeight) {
          _setHeight(slice, h)
          imgNodes = imgNodes.slice(i)
          continue w
        }
      }

      _setHeight(slice!, Math.min(maxHeight, h!))
      break
    }
  }

  function _getHeigth(images: readonly FitImage[]): number {
    const width = containerWidth - images.length * margin
    let r = 0
    images.forEach(img => (r += img.aspectRatio))

    return width / r // have to round down because Firefox will automatically roundup value with number of decimals > 3
  }

  // mutates/sets images' fitWidth, fitHeight properties
  function _setHeight(images: readonly FitImage[], height: number): void {
    images.forEach(img => {
      img.fitWidth = Math.floor(height * img.aspectRatio)
      img.fitHeight = Math.floor(height)
    })
  }
}
