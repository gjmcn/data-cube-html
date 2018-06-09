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

## Notes

Include somewhere:

* how can use D3 style data attaching or match arrays


## API Reference

### Functions

The package exports a single funtion. If the package is loaded in a `<script>` tag, this function is assigned to the global variable `qa`; the function is also called `qa` in these docs.

`qa` has various other properties that are also functions.

---

<a name="function_qa" href="#function_qa">#</a> **qa:** `qa(selec)`

Returns an array of elements that match the CSS selector string `selec`.

---

<a name="function_create" href="#function_create">#</a><br>
**create:** `qa.create(elm, n = 1)`<br>
**createSVG:** `qa.createSVG(elm, n = 1)`

Create HTML (`create`) or SVG (`createSVG`) elements.

`elm` specifies the type of element to create, e.g. `'div'` or `['circle','rect']`.

`n` specifies how many multiples of the elements in `elm` to create. For example, `qa.create('div',2)` creates 2 divs, `qa.createSVG(['circle','rect'],3)` creates 6 elements: circle, rect, circle, rect, circle, rect.

Returns an array containing the new elements.

---

<a name="function_fragment" href="#function_fragmant">#</a> **fragment:** `qa.fragment(n = 1)`

Returns an array of `n` new document fragments.

---

### Array Methods

---

<a name="method_qa" href="#method_qa">#</a> **qa:** `Array.prototype.qa(selec)`

Like the function `qa`, but the returned array only includes elements that are descendents of at least one entry of the calling array (all entries of the calling array should be elements).

---

<a name="method_insert" href="#method_insert">#</a><br>
**insert:** `Array.prototype.insert(elm, posn = 'end')`<br>
**insertSVG:** `Array.prototype.insertSVG(elm, posn = 'end')`

Insert HTML elements (`insert`) or SVG elements (`insertSVG`) into the elements of the calling array.

`elm` specifies what to insert:

* (singleton) function: called for each entry of the calling array; passed the entry (the 'target element'), the vector index of the entry and the calling array. The function should return an element or an array of elements; these are inserted into the target element.

* element: this is inserted into the target element.

* string: this should be a tag name (e.g. `'div'`); an element of this type is created and inserted into the target element.

`posn` specifies where an element is to be inserted inside the target element:

* `'end'` (or omitted, `undefined` or `null`): end.

* `'start'`: start.

* otherwise: before `posn` (in this case, `posn` should be a descendent of the target element).

`elm` and `posn` are broadcast.

Notes:

* `insert` need not insert new elements; it can be used to move elements that are already in the document.

* When adding a single element to each target element, `elm` is typically an element or a string (or an array of elements or strings). For anything more complicated, `elm` must be a function.

* When `elm` is a function:

  * multiple elements can be added to each target so the vector indices of the target elements and inserted elements may not correspond.

  * it makes no difference whether `insert` or `insertSVG` is called since the function `elm` provides the elements to be inserted

---

<a name="method_remove" href="#method_remove">#</a> **remove:** `remove()`

Remove elements from the DOM.

Returns the calling array &mdash; ie the removed elements.

---

<a name="method_raise" href="#method_raise">#</a><br>
**raise:** `Array.prototype.raise()`<br>
**lower:** `Array.prototype.lower()`

Move elements to be the last child (`raise`) or first child (`lower`) of their parents.

Returns the calling array &mdash; i.e. the moved elements.

---










