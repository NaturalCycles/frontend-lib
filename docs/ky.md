# getKy

Simple version (all defaults):

```ts
const api = getKy()
const res = await api.post('https://example.com', {
  json: {
    hello: 'world',
  },
})
```

Gives you the instance of [ky](https://github.com/sindresorhus/ky), enriched with these benefits:

- Sets request timeout to 60 seconds by default (ky's default is 10, which is dangerously low)
- `Request.started` (to be able to calculate e.g how long the request took)
- Allows `opt.topbar: true` to automatically show loading indicator (aka "top bar")
- Logs start, finish of the request nicely (optional)
- Logs response object (optional)
- Logs errors nicely (by default)

Works well/similar in conjunction with `getGot` method of
[nodejs-lib](https://github.com/NaturalCycles/nodejs-lib), which is a wrapper around
[got](https://github.com/sindresorhus/got).
