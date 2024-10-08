import { botDetectionService } from './bot'

test('botDetectionService', () => {
  expect(botDetectionService.isBot()).toBe(false)
  expect(botDetectionService.isCDP()).toBe(false)
  expect(botDetectionService.isBotOrCDP()).toBe(false)
})
