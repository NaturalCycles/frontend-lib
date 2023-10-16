import { Promisable, _Memo, _stringifyAny, isServerSide } from '@naturalcycles/js-lib'

export interface AdminModeCfg {
  /**
   * Function (predicate) to detect if needed keys are pressed.
   *
   * @example
   * predicate: e => e.ctrlKey && e.key === 'L'
   *
   * @default
   * Detects Ctrl+Shift+L
   */
  predicate?: (e: KeyboardEvent) => boolean

  /**
   * Enable touch sequence toggling
   * (lower left corner, lower right corner, lower left corner, lower right corner, lower left corner)
   *
   * @default false
   */
  allowTouchSequence?: boolean

  /**
   * Called when RedDot is clicked. Implies that AdminMode is enabled.
   */
  onRedDotClick?: () => any

  /**
   * Called when AdminMode was changed.
   */
  onChange?: (adminMode: boolean) => any

  /**
   * Called BEFORE entering AdminMode.
   * Serves as a predicate that can cancel entering AdminMode if false is returned.
   * Return true to allow.
   * Function is awaited before proceeding.
   */
  beforeEnter?: () => Promisable<boolean>

  /**
   * Called BEFORE exiting AdminMode.
   * Serves as a predicate that can cancel exiting AdminMode if false is returned.
   * Return true to allow.
   * Function is awaited before proceeding.
   */
  beforeExit?: () => Promisable<boolean>

  /**
   * @default true
   * If true - it will "persist" the adminMode state in LocalStorage
   */
  persistToLocalStorage?: boolean

  /**
   * The key for LocalStorage persistence.
   *
   * @default '__adminMode__'
   */
  localStorageKey?: string
}

const RED_DOT_ID = '__red-dot__'
const NOOP = (): void => {}

/**
 * @experimental
 *
 * Allows to listen for AdminMode keypress combination (Ctrl+Shift+L by default) to toggle AdminMode,
 * indicated by RedDot DOM element.
 *
 * todo: help with Authentication
 */
export class AdminService {
  constructor(cfg?: AdminModeCfg) {
    this.cfg = {
      predicate: e => e.ctrlKey && e.key === 'L',
      allowTouchSequence: false,
      persistToLocalStorage: true,
      localStorageKey: '__adminMode__',
      onRedDotClick: NOOP,
      onChange: NOOP,
      beforeEnter: () => true,
      beforeExit: () => true,
      ...cfg,
    }
  }

  cfg: Required<AdminModeCfg>

  adminMode = false

  private listening = false

  /**
   * Start listening to keyboard and touch events to toggle AdminMode when detected.
   */
  startListening(): void {
    if (this.listening || isServerSide()) return

    this.adminMode = !!localStorage.getItem(this.cfg.localStorageKey)

    if (this.adminMode) this.toggleRedDot()

    document.addEventListener('keydown', this.keydownListener.bind(this), { passive: true })

    if (this.cfg.allowTouchSequence) {
      document.addEventListener('touchstart', this.touchListener.bind(this), { passive: true })
    }

    this.listening = true
  }

  stopListening(): void {
    if (isServerSide()) return
    document.removeEventListener('keydown', this.keydownListener)
    this.listening = false
  }

  private sequenceIndex = 1
  private rightLowerCorner: [xAxis: number, yAxis: number] = [
    window.innerWidth - 40,
    window.innerHeight - 40,
  ]
  private leftLowerCorner: [xAxis: number, yAxis: number] = [40, window.innerHeight - 40]

  private async touchListener(e: TouchEvent): Promise<void> {
    // console.log(e)
    const clientX = e.touches[0]?.clientX
    const clientY = e.touches[0]?.clientY

    if (!clientX || !clientY) {
      this.sequenceIndex = 1
      return
    }

    const sequence: ((clientX: number, clientY: number) => boolean)[] = [
      this.lowerLeftCorner,
      this.lowerRightCorner,
      this.lowerLeftCorner,
      this.lowerRightCorner,
      this.lowerLeftCorner,
    ]

    if (sequence[this.sequenceIndex]!(clientX, clientY)) {
      this.sequenceIndex++
    } else {
      this.sequenceIndex = 1
      return
    }

    if (this.sequenceIndex === sequence.length) {
      this.sequenceIndex = 1
      await this.checkAllowToggle()
    }
  }

  private lowerRightCorner(clientX: number, clientY: number): boolean {
    return clientX > this.rightLowerCorner[0] && clientY > this.rightLowerCorner[1]
  }

  private lowerLeftCorner(clientX: number, clientY: number): boolean {
    return clientX < this.leftLowerCorner[0] && clientY > this.leftLowerCorner[1]
  }

  private async keydownListener(e: KeyboardEvent): Promise<void> {
    // console.log(e)
    if (!this.cfg.predicate(e)) return
    await this.checkAllowToggle()
  }

  private async checkAllowToggle(): Promise<void> {
    try {
      const allow = await this.cfg[this.adminMode ? 'beforeExit' : 'beforeEnter']()
      if (!allow) return // no change
    } catch (err) {
      console.error(err)
      // ok to show alert to Admins, it's not user-facing
      alert(_stringifyAny(err))
      return // treat as "not allowed"
    }

    this.adminMode = !this.adminMode

    this.toggleRedDot()

    if (this.cfg.persistToLocalStorage) {
      const { localStorageKey } = this.cfg
      if (this.adminMode) {
        localStorage.setItem(localStorageKey, '1')
      } else {
        localStorage.removeItem(localStorageKey)
      }
    }

    this.cfg.onChange(this.adminMode)
  }

  private toggleRedDot(): void {
    this.getRedDotElement().style.display = this.adminMode ? 'block' : 'none'
  }

  @_Memo()
  private getRedDotElement(): HTMLElement {
    const el = document.createElement('div')
    el.id = RED_DOT_ID
    el.style.cssText =
      'position:fixed;width:24px;height:24px;margin-top:-12px;background-color:red;opacity:0.5;top:50%;left:0;z-index:9999999;cursor:pointer;border-radius:0 3px 3px 0'
    el.addEventListener('click', () => this.cfg.onRedDotClick())
    document.body.append(el)
    return el
  }
}
