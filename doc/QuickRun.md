# Quick run

`Spig` is a framework, and it is not designed to work out-of-box. 

## 1. Installation

In a project's root, add `Spig`:

```shell
git subtree add --prefix spig https://github.com/igr/spig master --squash
```
Update `Spig` any time with:

```shell
git subtree pull --prefix spig https://github.com/igr/spig master --squash
```

## 2. Project structure

For faster setup, just copy the example:

```shell
cp -R spig/src src
``` 

## 3. Gulp

Welcome JavaScript:

```
cp spig/package.json .
edit package.json
yarn install
```

Add the initial `gulpfile.js`:

```javascript
"use strict";

const Spig = require('./spig/spig/spig');
const SpigConfig = require('./spig/spig/spig-config');
require('require-dir')('./spig/spig/tasks');

const datetimefmt = require('./src/filters/datetimefmt');

```

Yeah, so many `Spig`s are in use :)


## 4. Spig

Extend your `gulpfile` with something like this:

```javascript
Spig
  .on('/**/*.{md,njk}')
  .pageCommon()
  .collect('tags')
  .render()
  .applyTemplate()
  .htmlMinify()

Spig
  .on('/**/*.{png,jpg,gif}')
  .imagesCommon()
  .imageMinify()
```

See [gulpfile](gulpfile.js) for an example.

