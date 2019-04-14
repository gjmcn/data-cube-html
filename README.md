DOM manipulation functions and methods for [Data-Cube](https://github.com/gjmcn/data-cube).

## Install

`npm install --save @gjmcn/data-cube-html`


## Functions

The module exports the function `qa`. If the module is loaded in a `<script>` tag, `qa` is a global variable.

`qa` has various properties that are also functions.

---

<a name="function_qa" href="#function_qa">#</a> **qa:** `qa(sel)`

Returns an array of elements that match the CSS selector string `sel`.

---

<a name="function_create" href="#function_create">#</a><br>
**create:** `qa.create(elm, n = 1)`<br>
**createSVG:** `qa.createSVG(elm, n = 1)`

Create HTML or SVG elements.

`elm` specifies the type of element to create, e.g. `'div'` or `['circle','rect']`.

`n` specifies how many multiples of the elements in `elm` to create. For example, `qa.create('div', 2)` creates 2 divs, `qa.createSVG(['circle','rect'], 3)` creates 6 elements: circle, rect, circle, rect, circle, rect.

Returns an array containing the new elements.

---

<a name="function_fragment" href="#function_fragment">#</a> **fragment:** `qa.fragment(n = 1)`

Returns an array of `n` new document fragments.

---

## Array Methods

Note: unlike core Data-Cube methods, HTML methods do not convert the calling array to a cube.

---

<a name="method_qa" href="#method_qa">#</a> **qa:** `Array.prototype.qa(sel)`

Like the function `qa`, but the returned array only includes elements that are descendents of at least one entry of the calling array.

---

<a name="method_insert" href="#method_insert">#</a><br>
**insert:** `Array.prototype.insert(elm, n = 1, posn = 'end')`<br>
**insertSVG:** `Array.prototype.insertSVG(elm, n = 1, posn = 'end')`

Insert HTML or SVG elements as children of the elements in the calling array.

`elm` specifies what to insert:

* string: e.g. `'div'`, a new element of this type is created  (or multiple elements if `n` is used) and inserted into the corresponding 'target element'.

* element: is inserted into the target element. If an entry of `elm` is an array of elements, all the elements are inserted into the corresponding target element.

* function: passed the corresponding entry of the calling array (the target element), the vector index of the entry and the calling array. The function should return an element or an array of elements; these are inserted into the target element.

`n` is the number of elements to insert into the target element. `n` is only used when `elm` is a string.

`posn` specifies where an element is to be inserted inside the target element:

* `'end'` (or omitted, `undefined` or `null`): end.

* `'start'`: start.

* otherwise: before `posn` (in this case, `posn` should be a descendent of the target element).

All arguments are broadcast &mdash; i.e. each argument can be a singleton or have the same number of entries as the calling array.

Returns an array containing the new elements.

Notes:

* `insert` need not insert new elements; it can be used to move elements that are already in the document.

* Since multiple elements can be added to each target element, the vector indices of the target elements and the inserted elements may not correspond.

* When `elm` is a function, it makes no difference whether `insert` or `insertSVG` is called since the `elm` function provides the elements to be inserted.

---

<a name="method_encode" href="#method_encode">#</a><br>
**encode:** `Array.prototype.encode(x, as)`<br>
**encodeSVG:** `Array.prototype.encodeSVG(x, as)`

Encode the array/cube `x` as HTML. The calling array must contain a single element into which the new elements are inserted.

`as` is an object. Each value is an HTML/SVG tag name (e.g. `'div'` or `'circle'`) or an array of such names. The object should contain one more of the properties: `row`, `col`, `page`, `inner1`, `inner2`, `inner3`, ...

`encode`/`encodeSVG` assumes `x` should be encoded hierarchically as rows &#8594; columns &#8594; pages and then if the entries of `x` are nested arrays, the `inner1`, `inner2`, ... properties of `as` can be used. Examples and notes:

* Insert a `<p>` for each row of the array/cube `a` into `elm`:

  ```js
  let obj1 = myDiv.encode(a, {row: 'p'};  //or use shorthand when only row is used:
  let obj2 = myDiv.encode(a, 'p');
  ```

  `obj1.row` and `obj2.row` are vectors the same length as `a` and have the same row keys and row label of `a` (if they exist).


* Encoding a matrix `m` in a table:

  ```js
  let {row: trs, col: tds} = myTable.encode(m, {row: 'tr', col: 'td');
  ```

  `trs` is a vector of `<tr>` elements with the same row keys and label as `m`. `tds` is a matrix of `<td>` elements with the same shape as `m` and the same row and column keys and labels.

* No elements are added for unused properties:

  ```js
  let c = [2,3,4].rand();  //2 by 3 by 4 cube
  let {row: gs, page: circles} = mySVG.encodeSVG(c, {row: 'g', page: 'circle'})
  ```

  `gs` is a vector of `<g>` elements. `circles` contains `<circle>` elements and has the same number of rows and pages as `c` (and would inherit the row and page keys and labels as `c` if they existed).
  ```

* Encoding an array of arrays:

  ```js
  let aa = [[4,5], [5,6,7]]
  let {row: gs, inner1: circles} = mySVG.encode(aa, {row: g, inner1: 'circle'})
  ```

  !!!!!!!!HERE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

--option to bind data? - and convert format? - e.g. use object rather than subcube
--option to add classes?
--example where pass 2 tag names in same property
--switches to hierarchical, even though elements not returned that way

---

<a name="method_remove" href="#method_remove">#</a> **remove:** `Array.prototype.remove()`

Remove elements from the DOM.

Returns the calling array &mdash; i.e. the removed elements.

---

<a name="method_raise" href="#method_raise">#</a><br>
**raise:** `Array.prototype.raise()`<br>
**lower:** `Array.prototype.lower()`

Move elements to be the last child (`raise`) or the first child (`lower`) of their parents.

Returns the calling array &mdash; i.e. the moved elements.

---

<a name="method_children" href="#method_children">#</a> **children:** `Array.prototype.children()`

Children of all entries in the calling array.

Returns a new array.

---

<a name="method_parent" href="#method_parent">#</a><br>
**parent:** `Array.prototype.parent()`<br>
**firstChild:** `Array.prototype.firstChild()`<br>
**lastChild:** `Array.prototype.lastChild()`

Get parent, first child or last child of each entry of the calling array.

Returns a new array.

---

<a name="method_attr" href="#method_attr">#</a><br>
**attr:** `Array.prototype.attr(name)`<br>
**style:** `Array.prototype.style(name)`

Get attribute/style `name` of each entry of the calling array.

Returns a new array.

Note: use the core Data-Cube method `prop` to get a property of each element, e.g. `x.prop('innerHTML')`.

---

<a name="method_set_attr" href="#method_set_attr">#</a><br>
**$attr:** `Array.prototype.$attr(name, val)`<br>
**$style:** `Array.prototype.$style(name, val)`

For each entry, set attribute/style `name` to `val`.

`val` is broadcast.

Returns the calling array.

Notes: 

* If `$attr` or `$style` throws an error when attempting to set an attribute/style of an entry (e.g. because the entry is `undefined`), any already-made changes will persist.

* Use [$prop](https://github.com/gjmcn/data-cube/wiki/Entrywise#method_set_prop) to set properties of elements, e.g. `x.$prop('innerHTML','hello')`.

* `$attr` and `$style` (and `$prop`) are setters and hence, trigger [updates](https://github.com/gjmcn/data-cube/wiki/Updates). Note that update functions belong to an array, not the elements. For example:

  ```js
  let paras = qa('p')
    .$after(() => console.log('paras changed'));
  
  paras.$style('color', 'red');     //prints 'paras changed'
  qa('p').$style('color', 'blue');  //qa('p') has no update functions
  ```

---

<a name="method_set_set_attr" href="#method_set_set_attr">#</a><br>
**$$attr:** `Array.prototype.$$attr(name, f)`<br>
**$$style:** `Array.prototype.$$style(name, f)`

Set attribute/style `name` using the function `f`.

`x.$$attr(name, f)` sets the attribute `name` of each entry `xi` to `f(xi, x)`.

Note: the new values (the `f(xi, x)`) are computed first, then the `name` attributes/styles are set using `$attr`/`$style`. 

Returns the calling array.

---

<a name="method_has_attr" href="#method_has_attr">#</a><br>
**hasAttr:** `Array.prototype.hasAttr(name)`<br>
**hasClass:** `Array.prototype.hasClass(name)`<br>

Returns a new array with Boolean entries. An entry is `true` if the corresponding entry of the calling array has attribute/class `name`.

---

<a name="method_remove_attr" href="#method_remove_attr">#</a><br>
**removeAttr:** `Array.prototype.removeAttr(name)`<br>
**addClass:** `Array.prototype.addClass(name)`<br>
**removeClass:** `Array.prototype.removeClass(name)`

Remove attribute `name`, add class `name` or remove class `name` from each entry of the calling array.

Returns the calling array.

---

<a name="method_on" href="#method_on">#</a><br>
**on:** `Array.prototype.on(type, listener, useCapture = false)`<br>
**off:** `Array.prototype.off(type, listener, useCapture = false)`

Add (`on`) or remove (`off`) event listener to each entry of the calling array.

`type` is the event type, e.g. `'click'`.

`listener` is the function to be called when the event occurs.

`useCapture` indicates whether to use capture &mdash; see [EventTarget.addEventListener](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener) for details.

All arguments are broadcast.

Returns the calling array.

Note: `on` and `off` call the native methods [EventTarget.addEventListener](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener) and [EventTarget.removeEventListener](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener) respectively. As with these methods, `listener` can be an object implementing the `EventListener` interface (rather than a function) and `useCapture` can be an options object (rather than a Boolean).

---

<a name="method_sketch" href="#method_sketch">#</a> **sketch:** `Array.prototype.sketch(width = 300, height = 150)`

`sketch` creates a single canvas element of size `width`&times;`height`. If the calling array is non-empty, the canvas is inserted into the first entry of the calling array (which should be an HTML element).

`sketch` returns a 2-entry array containing:

* the canvas element &mdash; as a 1-entry array so that it can be used with other data-cube-html methods

* a 2d drawing context (a [CanvasRenderingContext2D](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D) object)

The drawing context is _not_ wrapped in an array, and can be used in the normal way. However, the context does have an additional (instance-level) `loop` method; this is based on the data-cube [loop](https://github.com/gjmcn/data-cube/wiki/Entrywise#method_loop) method and enables array-oriented code to be used for drawing on the canvas. For example:

```js
const [canvas, ctx] = qa('body').sketch();

//standard canvas code: 40-by-20 yellow rectangle at x=0, y=0
ctx.fillStyle = 'yellow';
ctx.fillRect(0, 0, 40, 20);

//array-oriented code: 3 rectangles with different colors, x-values and heights
const color = ['red', 'green', 'blue'],
      x = [50, 100, 150],
      y = 0,
      width = 40,
      height = [40, 60, 80];
      
ctx.loop(
  ['$fillStyle', color],             //set fillStyle property
  ['fillRect', x, y, width, height]  //call fillRect method
);
```

The behavior of `loop` is well-suited to the state-based nature of the canvas. In the above example, `loop` sets the `fillStyle` to `'red'` and draws a rectangle using the first (or only) entries of `x`, `y`, `width` and `height`, then sets the `fillStyle` to `'green'` and draws a rectangle using the second (or only) entries of `x`, `y`, `width` and `height` and so on.

`loop` can be passed any number of arguments. To set a property, the first entry of the corresponding argument is the property name prefixed with `'$'` (as with `'$fillStyle'` in the example). If the first entry of an argument is a function (rather than a string property/method name), it is passed the context as its first argument; the other entries provide the additional arguments. 

When called on a context, `loop` returns a 1-entry cube containing the context. When called on an array, `loop` iterates over entries of the calling array &mdash; so `loop` can draw different things on different canvases. If the calling array is comprised of a single context, this is broadcast resulting in the same behavior as calling `loop` on a context directly.

---

### Event Properties

---

<a name="property_me" href="#property_me">#</a> **me:** `Event.me`

A 1-entry array containing the element that dispatched the event. This is simply `Event.target` wrapped in an array so that it can be used with Data-Cube methods, e.g.

```js
//remove a circle when it is clicked
qa('circle').on('click', evt => evt.me.remove());
```




