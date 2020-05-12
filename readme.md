## @naturalcycles/frontend-lib

> Standard library for Frontend applications

[![npm](https://img.shields.io/npm/v/@naturalcycles/frontend-lib/latest.svg)](https://www.npmjs.com/package/@naturalcycles/frontend-lib)
[![min.gz size](https://badgen.net/bundlephobia/minzip/@naturalcycles/frontend-lib)](https://bundlephobia.com/result?p=@naturalcycles/frontend-lib)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

# API

###### getKy

Simple version (all defaults):

```typescript
const api = getKy()
const res = await api.post('https://example.com', {
  json: {
    hello: 'world',
  },
})
```

Gives you the instance of [ky](https://github.com/sindresorhus/ky), enriched with these benefits:

- `Request.started` (to be able to calculate e.g how long the request took)
- Allows `opt.topbar: true` to automatically show loading indicator (aka "top bar")
- Logs start, finish of the request nicely (optional)
- Logs response object (optional)
- Logs errors nicely (by default)

Works well/similar in conjunction with `getGot` method of
[nodejs-lib](https://github.com/NaturalCycles/nodejs-lib), which is a wrapper around
[got](https://github.com/sindresorhus/got).

###### loadScript

```typescript
await loadScript('https://gtm.com/script.js')
// know that your script is loaded by now
```

Works in old-school (and reliable) way by injecting a `<script>` tag into dom and attaching onload
event that resolves the promise. `onerror` rejects the promise.

# Packaging

- `main: dist/index.js`: commonjs, es2015
- `module: dist-esm/index.js`: ESM, es2015
- `types: dist/index.d.ts`: typescript types
- `/src` folder with source `*.ts` files included
