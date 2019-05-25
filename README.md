DOM manipulation functions and methods for [Data-Cube](https://gjmcn.github.io/data-cube).


The module exports the function `qa`. If the module is loaded in a `<script>` tag, `qa` is a global variable.

See the [Data-Cube plugins page](https://gjmcn.github.io/data-cube/index.html?plugins) for further usage instructions.

---

## Functions

---

<a id="function_qa" href="#function_qa">#</a> **qa:** `qa(sel)`

Returns an array of elements that match the CSS selector string `sel`.

---

<a id="function_create" href="#function_create">#</a><br>
**create:** `qa.create(elm, n = 1)`<br>
**createSVG:** `qa.createSVG(elm, n = 1)`

Create HTML or SVG elements.

`elm` specifies the type of element to create, e.g. `'div'` or `['circle','rect']`.

`n` specifies how many multiples of the elements in `elm` to create. For example, `qa.create('div', 2)` creates 2 divs, `qa.createSVG(['circle','rect'], 3)` creates 6 elements: circle, rect, circle, rect, circle, rect.

Returns an array containing the new elements.

---

<a id="function_fragment" href="#function_fragment">#</a> **fragment:** `qa.fragment(n = 1)`

Returns an array of `n` new document fragments.

---

## Array Methods

Unlike standard Data-Cube methods, HTML methods _do not_ convert the calling array to a cube. Also, HTML methods that return a new array, typically return a standard array rather than a cube.

---

<a id="method_qa" href="#method_qa">#</a> **qa:** `Array.prototype.qa(sel)`

Like the function `qa`, but the returned array only includes elements that are descendents of at least one entry of the calling array.

---

<a id="method_insert" href="#method_insert">#</a><br>
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

<a id="method_encode" href="#method_encode">#</a><br>
**encode:** `Array.prototype.encode(x, r, c, p, i)`<br>
**encodeSVG:** `Array.prototype.encodeSVG(x, r, c, p, i)`

Encode `x` as HTML or SVG. The calling array must contain a single element &mdash; into which the new elements are inserted.

`x` is encoded hierarchically: rows &#8594; columns &#8594; pages &#8594; inner arrays, according to the arguments `r`, `c`, `p`, `i` respectively:

  * Each of `r`, `c`, `p` is a tag name or an array of tag names whose number of entries is equal to the length of the dimension of `x` being encoded.
  
  * `i` is a single tag name &mdash; i.e. the same tag name is used for all inner arrays.
  
  * Omit any of `r`, `c`, `p`, `i` (or pass a falsy value) to skip the corresponding dimension.

`encode` and `encodeSVG` return a 4-entry array with entries corresponding to the arguments `r`, `c`, `p`, `i`. Each entry is a cube containing new elements, or `null` if the corresponding argument was not used.

Notes:

* The returned cubes reflect the structure of `x`. For example, if a matrix `m` is encoded as a table:

  ```js
  let [trs, tds] = qa('#my-table').encode(m, 'tr', 'td');
  ```

  `trs` is a vector containing a `<tr>` element for each row of `m` and with the same row keys and row label as `m` (if they exist). `tds` is a matrix of `<td>` elements with the same shape as `m` and the same row and column keys and labels.

* Omitted dimensions need not appear 'at the end'. The following example creates 4 `<g>` elements, each containing a `<text>` and a `<circle>`:

  ```js
  let y = [4, 3, 2].cube();  //4-by-3-by-2
  let [gs, , elmts] = qa('#my-svg').encodeSVG(y, 'g', null, ['text', 'circle']);
  ```

  `elmts` has 4 rows, 1 column and 2 pages: the first page contains `<text>` elements, the second contains `<circle>` elements. (Note that the columns argument (`c`) of `encodeSVG` is `null`, so `elmts` is given a single column.)

* Encoding dimensions of length 1 can be useful. The following example creates 3 `<p>` elements, each with a `<span>` inside:

  ```js
  let [ps, spans] = qa('#my-div').encode([6,7,8], 'p', 'span');
  ```

  `ps` and `spans` are 3-entry vectors of `<p>` and `<span>` elements respectively.

* If inner arrays are encoded, the inner arrays of the result will match those of `x` &mdash; i.e. if cubes, they will have the same shape, keys and labels. (Note: if an 'inner array' of `x` is not an array, it is encoded as a single element).

---

<a id="method_expand" href="#method_expand">#</a><br>
**expand:** `Array.prototype.expand(x, r, c, p)`<br>
**expandSVG:** `Array.prototype.expandSVG(x, r, c, p)`

The expand methods behave like the [encode methods](#method_encode) except that `x` is the _shape_ of a cube rather than an actual cube. For example:

```js
let [trs, tds] = qa('#my-table').expand([4, 2], 'tr', 'td');
```

returns a vector of 4 `tr` elements (`trs`) and a 4-by-2 matrix of `td` elements (`tds`).

Expand methods cannot encode inner arrays. Hence, these methods do not take an `i` argument and return a 3-entry array.

---

<a id="method_remove" href="#method_remove">#</a> **remove:** `Array.prototype.remove()`

Remove elements from the DOM.

Returns the calling array &mdash; i.e. the removed elements.

---

<a id="method_raise" href="#method_raise">#</a><br>
**raise:** `Array.prototype.raise()`<br>
**lower:** `Array.prototype.lower()`

Move elements to be the last child (`raise`) or the first child (`lower`) of their parents.

Returns the calling array &mdash; i.e. the moved elements.

---

<a id="method_children" href="#method_children">#</a> **children:** `Array.prototype.children()`

Children of all entries in the calling array.

Returns a new array.

---

<a id="method_parent" href="#method_parent">#</a><br>
**parent:** `Array.prototype.parent()`<br>
**firstChild:** `Array.prototype.firstChild()`<br>
**lastChild:** `Array.prototype.lastChild()`

Get parent, first child or last child of each entry of the calling array.

Returns a new array.

---

<a id="method_attr" href="#method_attr">#</a><br>
**attr:** `Array.prototype.attr(name)`<br>
**style:** `Array.prototype.style(name)`

Get attribute/style `name` of each entry of the calling array.

Returns a new array.

Note: use the core Data-Cube method `prop` to get a property of each element, e.g. `x.prop('innerHTML')`.

---

<a id="method_set_attr" href="#method_set_attr">#</a><br>
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

<a id="method_set_set_attr" href="#method_set_set_attr">#</a><br>
**$$attr:** `Array.prototype.$$attr(name, f)`<br>
**$$style:** `Array.prototype.$$style(name, f)`

Set attribute/style `name` using the function `f`.

`x.$$attr(name, f)` sets the attribute `name` of each entry `xi` to `f(xi, x)`.

Note: the new values (the `f(xi, x)`) are computed first, then the `name` attributes/styles are set using `$attr`/`$style`. 

Returns the calling array.

---

<a id="method_has_attr" href="#method_has_attr">#</a><br>
**hasAttr:** `Array.prototype.hasAttr(name)`<br>
**hasClass:** `Array.prototype.hasClass(name)`<br>

Returns a new array with Boolean entries. An entry is `true` if the corresponding entry of the calling array has attribute/class `name`.

---

<a id="method_remove_attr" href="#method_remove_attr">#</a><br>
**removeAttr:** `Array.prototype.removeAttr(name)`<br>
**addClass:** `Array.prototype.addClass(name)`<br>
**removeClass:** `Array.prototype.removeClass(name)`

Remove attribute `name`, add class `name` or remove class `name` from each entry of the calling array.

`name` is broadcast.

Returns the calling array.

Note: these methods cannot add or remove multiple classes or attributes from an element in a single call. For example, to add classes `a` and `b` to all elements of an array `x`, `addClass` must be called twice:

```js
x.addClass('a').addClass('b');
```

Alternatively, set the class attribute (which removes any existing classes):

```js
x.$attr('class', 'a b');
```

---

<a id="method_on" href="#method_on">#</a><br>
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

<a id="method_sketch" href="#method_sketch">#</a> **sketch:** `Array.prototype.sketch(width = 300, height = 150, scale)`

`sketch` creates a single canvas element. If the calling array is non-empty, the canvas is inserted into the first entry of the calling array (which should be an HTML element).

If `scale` is truthy, the canvas is scaled to avoid blur:
  
  * the width and height styles are set to `width + 'px'` and `height + 'px'` respectively
  
  * the width and height attributes are set to `width * devicePixelRatio` and `height * devicePixelRatio` respectively
  
  * the scale of the returned context (see below) is set to `devicePixelRatio` (i.e. `ctx.scale(devicePixelRatio, devicePixelRatio)`)

If `scale` is falsy, the width and height attributes are set to `width` and `height` respectively; the width and height styles are not set.

`sketch` returns a 2-entry array containing:

* the canvas element &mdash; as a 1-entry array so that it can use Data-Cube methods

* a 2d drawing context (a [CanvasRenderingContext2D](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D) object)

The drawing context is _not_ wrapped in an array, and can be used in the normal way. However, the context does have an additional (instance-level) `loop` method; this is based on the data-cube [loop](https://gjmcn.github.io/data-cube/index.html?entrywise#loop) method and enables array-oriented code to be used for drawing on the canvas. For example:

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

<a id="property_me" href="#property_me">#</a> **me:** `Event.me`

A 1-entry array containing the element that dispatched the event. This is simply `Event.target` wrapped in an array so that it can be used with Data-Cube methods, e.g.

```js
//remove a circle when it is clicked
qa('circle').on('click', evt => evt.me.remove());
```




