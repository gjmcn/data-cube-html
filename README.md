---
<b>
Note: this library is at an early stages of development:

* not all methods have been implemented
* the bahavior of existing methods may change
* there are no tests
</b>
---

[DataCube](https://github.com/gjmcn/data-cube) HTML methods:

* Wraps JavaScript functions for creating, selecting, styling, ... HTML elements, enabling an array-oriented approach to DOM manipulation.

* Adds methods to `Array.protoype` &mdash; as DataCube and all plugins do. Also creates a global variable `qa` for element selection.

* Since the DOM is hierarchical rather than multidimensional, the HTML methods are not interested the shape (or keys or labels) of cubes:

  * cubes are treated as standard arrays &mdash; shape, keys and labels are ignored
  
  * methods do not automatically convert arrays to cubes

  * methods return arrays rather than cubes

## Install/Load

Install: `npm install --save data-cube-html`

The package uses the Universal Module Definition (UMD). It can be loaded in a  `<script>` tag in HTML or with an `import` statement in JavaScript.

## API Reference



