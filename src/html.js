{
  'use strict';
  
	const helper = require('data-cube-helper');
  const { 
    assert, addArrayMethod, polarize, toArray, def
  } = helper;
  
  const tagFactory = svg => {
    if (svg) return tag => document.createElementNS("http://www.w3.org/2000/svg", tag);
    else return tag => document.createElement(tag);
  }; 
  
  //--------------- query ---------------//
  
  //str -> array
  const qa = q => [...document.querySelectorAll(assert.single(q))];
  
  //str -> array
  addArrayMethod('qa', function(q) {
    assert.single(q);
    const n = this.length;
    const z = [];
    let nz = 0;
    let j = 0;
    for (let i=0; i<n; i++) {
      let sel = this[i].querySelectorAll(q);
      let ns = sel.length;
      nz += ns;
      z.length = nz;
      for (let k=0; k<ns; k++) {
        z[j++] = sel[k];
      }
    }
    return z;
  });
  
  
  //--------------- insert, insertSVG ---------------//
  
  {
    //array/cube, *, *, bool -> array
    const insert = (x, elm, posn, svg) => {
      const n = x.length;
      var [elm, elmSingle] = polarize(elm);
      var [posn, posnSingle] = polarize(posn);          
      if ((!elmSingle && elm.length !== n) || (!posnSingle && posn.length !== n)) {
        throw Error('shape mismatch');
      }
      let newElm = new Array(n);
      let f = tagFactory(svg);
      for (let i=0; i<n; i++) {
        let elm_i = elmSingle ? elm : elm[i];
        if (typeof elm_i === 'string') elm_i = f(elm_i);
        let posn_i = posnSingle ? posn : posn[i];
        posn_i = (posn_i === undefined || posn_i === 'end')
          ? null
          : posn_i === 'start'
            ? x[i].firstChild
            : posn_i;
        x[i].insertBefore(elm_i, posn_i);
        newElm[i] = elm_i;
      }
      return newElm;
    };

    addArrayMethod('insert', function(elm, posn) {
      return insert(this, elm, posn, false);
    });
    addArrayMethod('insertSVG', function(elm, posn) {
      return insert(this, elm, posn, true);
    });
    
  }
    
    
  //--------------- insertEach ---------------//
  
  //func[, *] -> array
  addArrayMethod('insertEach', function(f, posn) {
    const n = this.length;
    f = assert.func(assert.single(f));
    var [posn, posnSingle] = polarize(posn);      
    if (!posnSingle && posn.length !== n) throw Error('shape mismatch');
    let newElm = [];
    let k = 0;
    for (let i=0; i<n; i++) {
      let newElm_i = toArray(f(this[i], i, this));
      let n_i = newElm_i.length;
      let posn_i = posnSingle ? posn : posn[i];
      posn_i = (posn_i === undefined || posn_i === 'end')
        ? null
        : posn_i === 'start'
          ? this[i].firstChild
          : posn_i;
      newElm.length += n_i; 
      for (let j=0; j<n_i; j++) {
        this[i].insertBefore(newElm_i[j], posn_i);
        newElm[k++] = newElm_i[j];
      }
    }
    return newElm;
  });
  
  
  //--------------- create, createSVG ---------------// 
  
  {
  
    //*, num, bool => array
    const create = (elm, n, svg) => {
      elm = toArray(elm);
      const ne = elm.length;
      n = def(assert.single(n),1);
      const newElm = new Array(ne*n);
      const f = tagFactory(svg);
      let k = 0;
      for (let j=0; j<n; j++) {
        for (let i=0; i<ne; i++) {
          newElm[k++] = f(elm);
        }
      }
      return newElm;
    };
    
    //*, num -> array
    qa.create    = (elm, n) => create(elm, n, false);
    qa.createSVG = (elm, n) => create(elm, n, true);
      
  }
      
      
  //--------------- remove ---------------// 
  
  addArrayMethod('remove', function() {
		const n = this.length;
    for (let i=0; i<n; i++) this[i].parentNode.removeChild(this[i]);
    return this;
  });
  
  
  //--------------- parent ---------------// 
  
  //-> array
  addArrayMethod('parent', function() {
		const n = this.length;
    for (let i=0; i<n; i++) this[i].parentNode;
    return this;
  });
  
  
  //--------------- children, firstChild, lastChild ---------------// 

  //-> array
  addArrayMethod('children', function() {
    const n = this.length;
    const z = [];
    k = 0;
    for (let j=0; j<n; j++) {
      let c = this[j].children;
      let nc = c.length;
      newElm.length += nc;
      for (let i=0; i<nc; i++) {
        newElm[k++] = c[i];
      }
    }
    return z;
  });
  
  //->array
  ['firstChild', 'lastChild'].forEach(nm => {
    addArrayMethod(nm, function() {
      const n = this.length;
      const z = new Array(n);
      for (let i=0; i<n; i++) z[i] = this[i][nm];
      return z;
    });
  });
  
  
  //--------------- removeAttr, addClass, removeClass, on, off ---------------// 

  {
    
    //array/cube, str, *[, *, *] -> array/cube
    const addRem = (x, nm, a, b, c) => {
      const getFactory = arg => {
        var [arg, argSingle] = polarize(arg);
        if (argSingle) return () => arg;
        if (arg.length !== n) throw Error('shape mismatch');
        return i => arg[i];
      };
      const n = x.length;
      const get_a = getFactory(a);
      if (nm === 'on' || nm === 'off') {
        const get_b = getFactory(b); 
        const get_c = getFactory(c);
        const mthd = (nm === 'on') ? 'addEventListener' : 'removeEventListener';
        
        
        WORKING, BUT WANT TO PASS  me  (i.e. [evt.target]) as first arg to callback and the event as the second
          -write a wrapper that takes the event as its single arg and passes  me and the evt to the actual false
        
        if b a singleton, only do it once!
          
          REQUIRE PASSED LISTERNER TO BE A FUNCTION? - IN THEORY CAN BE AN OBJECT  - SEE MDN
        
        
        for (let i=0; i<n; i++) x[i][mthd](get_a(i), get_b(i), get_c(i));
      }
      else if (nm === 'removeAttr')  { for (let i=0; i<n; i++) x[i].removeAttribute(get_a(i)) }
      else if (nm === 'addClass')    { for (let i=0; i<n; i++) x[i].classList.add(get_a(i)) }
      else if (nm === 'removeClass') { for (let i=0; i<n; i++) x[i].classList.remove(get_a(i)) }
      return x;
    };
     
    //*[, *, *] -> array/cube
    ['removeAttr', 'addClass', 'removeClass', 'on', 'off'].forEach(nm => {
      addArrayMethod(nm, function(a, b, c) {  //b and c only used by on and off
        return addRem(this, nm, a, b, c);
      });
    });
        
  }
  
  
    //-----------------------------------------

    /* 
    
    ADD:

    -qa.fragment(n)
    -  a way to get 'me' as an array in events easily?


    NOTES:
    -to add multiple elmts into single elmt
        -to insert a complex structure, use a frag, but note that this will only add one entry to the
        array returned by  insertAll and this will be an empty frag
    -use parent instead of retOrig:    qa('#my-div').insert('p').parent().insert( ... - or dave parent selection to variable
    -if append fails halfway thru, changes persist - eg if an entry of elm is not an elmt
    -no danger of mistakenly thinking ndeList an array since cube methods are array methods, cannot call them from nodeList
    -no data as in d3; can do this easily, eg attach prop or attr (use vble to attach lots of info) and then eg
        -   qa('circle').$style('width', me => me.data.age + 'px')
        - alternatively, do not attach anything to element:   qa('circle').$style('width', x.col('age').add('px'))
    -no joining on keys etc - see how compares to d3 adnd what would do here
    -check passing callback to insert works with svg - main conern is that document fragments may not work?
    -could wrap some d3 libs so can write eg:
      - myDiv.$style('width', x.col('age').scale(rgMax, rgMin, domainMax, domainMin)   //domainMax/min based on data by default
          -note this means no need to create scale ...
          -could do similar with color interpolation   myDiv.$style('color', x.col('age').reds(same args as for scales)   
    -say callback to insertEach can return singleton or array
    -html methods work with arrays, not elements - so eg   qa('div').at(0).remove() will not work
    -??ANY ISSUES WITH THESE METHODS RETUNING TEXT NODES?????????? - eg when use firstChild
    
    */

  
    
    //JOINING TO DATA - IE ORDER - OR JUST AATTACH DATA

  module.exports = qa;

}
  