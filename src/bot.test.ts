import { botDetectionService } from './bot'

beforeEach(() => {
  Object.assign(globalThis, {
    window: {}, // this make isServerSide() return false
    navigator: undefined,
    chrome: undefined,
  })
})

const userAgentChrome = 'Innocent Chrome 998 Mozilla IE Trident All Good Windows 95'
const userAgentSafari = 'Innocent Safari 21 Apple Cupertino 991 Next'

test('serverSide script is not a bot', () => {
  Object.assign(globalThis, {
    window: undefined,
  })
  expect(botDetectionService.isBot()).toBe(false)
  expect(botDetectionService.isCDP()).toBe(false)
  expect(botDetectionService.isBotOrCDP()).toBe(false)
})

test('innocent chrome is not a bot', () => {
  Object.assign(globalThis, {
    navigator: {
      userAgent: userAgentChrome,
    } as Navigator,
    chrome: {},
  })
  expect(botDetectionService.isBot()).toBe(false)
})

test('innocent safari is not a bot', () => {
  Object.assign(globalThis, {
    navigator: {
      userAgent: userAgentSafari,
    } as Navigator,
  })
  expect(botDetectionService.isBot()).toBe(false)
})

test('no userAgent means bot', () => {
  globalThis.navigator = {} as Navigator
  expect(botDetectionService.isBot()).toBe(true)
})

test('"headless" in userAgent means bot', () => {
  globalThis.navigator = { userAgent: 'HeadlessChrome' } as Navigator
  expect(botDetectionService.isBot()).toBe(true)
})

test('"electron" in userAgent means bot', () => {
  globalThis.navigator = { userAgent: 'I am Electron 99' } as Navigator
  expect(botDetectionService.isBot()).toBe(true)
})

test('"phantom" in userAgent means bot', () => {
  globalThis.navigator = { userAgent: 'Phantom Menace' } as Navigator
  expect(botDetectionService.isBot()).toBe(true)
})

test('"slimer" in userAgent means bot', () => {
  globalThis.navigator = { userAgent: 'Slimer than Slime' } as Navigator
  expect(botDetectionService.isBot()).toBe(true)
})

test('navigator.webdriver means bot', () => {
  globalThis.navigator = {
    userAgent: userAgentSafari,
    webdriver: true,
  } as Navigator
  expect(botDetectionService.isBot()).toBe(true)
})

test('0 plugins means bot', () => {
  globalThis.navigator = {
    userAgent: userAgentSafari,
    plugins: [] as any,
  } as Navigator
  expect(botDetectionService.isBot()).toBe(true)
})

test('"" languages means bot', () => {
  globalThis.navigator = {
    userAgent: userAgentSafari,
    languages: '' as any,
  } as Navigator
  expect(botDetectionService.isBot()).toBe(true)
})

test('Chrome without chrome means bot', () => {
  globalThis.navigator = {
    userAgent: userAgentChrome,
  } as Navigator
  expect(botDetectionService.isBot()).toBe(true)
})

// This test helps with coverage, while not really testing anything useful
test('cdp in jest looks like a bot, because it does error serialization', () => {
  Object.assign(globalThis, {
    window: globalThis,
  })

  const isCDP = botDetectionService.isCDP()
  expect(isCDP).toBe(botDetectionService.isBotOrCDP())

  // const runInIDE = process.argv.some(
  //   a => a === '--runTestsByPath' || a.includes('IDEA') || a.includes('processChild.js'),
  // )
  // console.log({ runInIDE, argv: process.argv })
  // When running in IntelliJ it is detected as CDP (involves Error.stack serialization somehow), while in Jest CLI it is not
  // const expectedIsCDP = runInIDE
  // expect(isCDP).toBe(expectedIsCDP)
})
