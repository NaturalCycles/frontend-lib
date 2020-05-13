// Modified version of topbar:
// http://buunguyen.github.io/topbar
/* tslint:disable */

export interface TopBarOptions {
  /**
   * @default true
   */
  autoRun?: boolean

  /**
   * @default 5
   */
  barThickness?: number

  barColors?: any
  shadowColor?: any

  /**
   * @default 10
   */
  shadowBlur?: number
}

let canvas: any,
  progressTimerId: any,
  fadeTimerId: any,
  currentProgress: any,
  showing: any,
  addEvent = function (elem: any, type: any, handler: any) {
    if (elem.addEventListener) elem.addEventListener(type, handler, false)
    else if (elem.attachEvent) elem.attachEvent('on' + type, handler)
    else elem['on' + type] = handler
  },
  options = {
    autoRun: true,
    barThickness: 5,
    barColors: {
      '0': 'rgba(26,  188, 156, .9)',
      '.25': 'rgba(52,  152, 219, .9)',
      '.50': 'rgba(241, 196, 15,  .9)',
      '.75': 'rgba(230, 126, 34,  .9)',
      '1.0': 'rgba(211, 84,  0,   .9)',
    },
    shadowBlur: 10,
    shadowColor: 'rgba(0,   0,   0,   .6)',
  },
  repaint = function () {
    canvas.width = window.innerWidth
    canvas.height = options.barThickness * 5 // need space for shadow

    let ctx = canvas.getContext('2d')
    ctx.shadowBlur = options.shadowBlur
    ctx.shadowColor = options.shadowColor

    let lineGradient = ctx.createLinearGradient(0, 0, canvas.width, 0)
    for (let stop in options.barColors) {
      lineGradient.addColorStop(stop, options.barColors[stop])
    }
    ctx.lineWidth = options.barThickness
    ctx.beginPath()
    ctx.moveTo(0, options.barThickness / 2)
    ctx.lineTo(Math.ceil(currentProgress * canvas.width), options.barThickness / 2)
    ctx.strokeStyle = lineGradient
    ctx.stroke()
  },
  createCanvas = function () {
    canvas = document.createElement('canvas')
    let style = canvas.style
    style.position = 'fixed'
    style.top = style.left = style.right = style.margin = style.padding = 0
    style.zIndex = 100001
    style.display = 'none'
    document.body.appendChild(canvas)
    addEvent(window, 'resize', repaint)
  }

export const topbar = {
  config(opts: TopBarOptions) {
    for (let key in opts) {
      if (options.hasOwnProperty(key)) {
        options[key] = opts[key]
      }
    }
  },
  show(opts?: TopBarOptions) {
    if (opts) topbar.config(opts)
    if (showing) return
    showing = true
    if (fadeTimerId !== null) {
      window.cancelAnimationFrame(fadeTimerId)
    }
    if (!canvas) createCanvas()
    canvas.style.opacity = 1
    canvas.style.display = 'block'
    topbar.progress(0)
    if (options.autoRun) {
      ;(function loop() {
        progressTimerId = window.requestAnimationFrame(loop)
        topbar.progress('+' + 0.05 * Math.pow(1 - Math.sqrt(currentProgress), 2))
      })()
    }
  },
  progress(to: number | string) {
    if (typeof to === 'undefined') {
      return currentProgress
    }
    if (typeof to === 'string') {
      to = (to.indexOf('+') >= 0 || to.indexOf('-') >= 0 ? currentProgress : 0) + parseFloat(to)
    }
    currentProgress = to > 1 ? 1 : to
    repaint()
    return currentProgress
  },
  hide() {
    if (!showing) return
    showing = false
    if (progressTimerId != null) {
      window.cancelAnimationFrame(progressTimerId)
      progressTimerId = null
    }
    ;(function loop() {
      if (topbar.progress('+.1') >= 1) {
        canvas.style.opacity -= 0.05
        if (canvas.style.opacity <= 0.05) {
          canvas.style.display = 'none'
          fadeTimerId = null
          return
        }
      }
      fadeTimerId = window.requestAnimationFrame(loop)
    })()
  },
}
