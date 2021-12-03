# Page Title

![Version of EditorJS that the plugin is compatible with](https://badgen.net/badge/Editor.js/v2.0/blue)

Provides a page title block for the [Editor.js](https://ifmo.su/editor).

## Important Note

For this to be a viable block tool, the following requirements ought to be met:

1. The tool is "fixed" as the first block
2. It cannot be moved down, nor can a block be moved above it
3. It should not be possible to delete it
4. Users should not be allowed to add this block type further down the page.

See [this currently open issue](https://github.com/codex-team/editor.js/issues/1189).

## Installation

### Install via NPM

todo

Include module at your application

```javascript
const Pagetitle = require('@lukaswhite/editorjs-pagetitle');
```

### Download to your project's source dir

1. Upload folder `dist` from repository
2. Add `dist/bundle.js` file to your page.

### Load from CDN

You can load specific version of package from [jsDelivr CDN](https://www.jsdelivr.com/package/npm/@editorjs/header).

`https://cdn.jsdelivr.net/npm/@editorjs/header@latest`

Then require this script on page with Editor.js.

```html
<script src="..."></script>
```

## Usage

Add a new Tool to the `tools` property of the Editor.js initial config.

```javascript
var editor = EditorJS({
  ...

  tools: {
    ...
    pagetitle: Pagetitle,
  },

  ...
});
```

## Config Params

All properties are optional.

| Field        | Type       | Description                 |
| ------------ | ---------- | --------------------------- |
| placeholder  | `string`   | header's placeholder string |

```javascript
var editor = EditorJS({
  ...

  tools: {
    ...
    header: {
      class: Pagetitle,
      config: {
        placeholder: 'Enter the page title'
      }
    }
  }

  ...
});
```

