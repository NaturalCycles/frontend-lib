/*

node src/test/ssr.js

Testing that it doesn't throw on e.g "window is undefined" in SSR (Node) environment.

Should be run after `yarn build-prod`, do `dist` folder is prepared

 */

const assert = require('assert')
const { loadGTag, isNode, isBrowser, getKy, topbar } = require('../../dist/index')

main().then(() => console.log('passed'))

async function main() {
  assert(isNode())
  assert(!isBrowser())

  // console.log('done!', typeof window, isNode())

  // should not throw!
  await loadGTag()
  topbar.show()

  const ky = getKy()

  // console.log(ky)

  const url = 'https://httpbin.org/get'
  const res = await ky.get(url).json()
  // console.log(res)
  assert(res.url === url)
}
