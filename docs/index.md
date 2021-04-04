---
#title: Intro
---

# frontend-lib

> Standard library for Frontend applications

![npm](https://img.shields.io/npm/v/@naturalcycles/frontend-lib/latest.svg)
![min.gz size](https://badgen.net/bundlephobia/minzip/@naturalcycles/frontend-lib)
![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)
![Actions](https://github.com/NaturalCycles/frontend-lib/workflows/default/badge.svg)

## Install

```sh
yarn add @naturalcycles/frontend-lib
```

## Features

- [getKy](/ky.md)
- [loadScript](/loadScript.md)
- [TranslationService](/translation.md) <Badge text="experimental" type="warning"/>
- [Analytics](/analytics.md)
  - loadGTag
  - loadHotjar

## Packaging

- `main: dist/index.js`: commonjs, es2020
- `module: dist-esm/index.js`: ESM, es2017
- `types: dist/index.d.ts`: typescript types
- `/src` folder with source `*.ts` files included
