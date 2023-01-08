# Intro

> Standard library for Frontend applications

<style>
.badges p {
    display: flex;
    gap: 10px;
}

</style>

<div class="badges">

[![npm](https://img.shields.io/npm/v/@naturalcycles/frontend-lib/latest.svg)](https://www.npmjs.com/package/@naturalcycles/frontend-lib)
[![min.gz size](https://badgen.net/bundlephobia/minzip/@naturalcycles/frontend-lib)](https://bundlephobia.com/result?p=@naturalcycles/frontend-lib)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![Actions](https://github.com/NaturalCycles/frontend-lib/workflows/default/badge.svg)](https://github.com/NaturalCycles/frontend-lib/actions)

</div>

## Install

```sh
yarn add @naturalcycles/frontend-lib
```

## Features

- [getKy](ky.md)
- [loadScript](loadScript.md)
- [TranslationService](translation.md) <Badge text="experimental" type="warning"/>
- [Analytics](analytics.md)
  - loadGTag
  - loadHotjar

## Packaging

- `main: dist/index.js`: commonjs, es2020
- `module: dist-esm/index.js`: ESM, es2017
- `types: dist/index.d.ts`: typescript types
- `/src` folder with source `*.ts` files included
