(() => {
  'use strict';
  
  const {
    assert, addArrayMethod, polarize, toArray, def, callUpdate
  } = Array.prototype._helper;
  
  const createElmHTML = tag => document.createElement(tag);
  const createElmSVG  = tag => document.createElementNS("http://www.w3.org/2000/svg", tag);
      
  if ('me' in Event.prototype) {
    throw Error(name + ' is already a property of Event.protoype');      
  }
  Object.defineProperty( Event.prototype, 'me', {
    get() {return [this.target]},
  });
  
  
  //--------------- qa ---------------//
  
  //str -> array
  const qa = q => [...document.querySelectorAll(assert.single(q))];
  
  //str -> array
  addArrayMethod('qa', function(q) {
    q = assert.single(q);
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

    //array/cube, *, *, *, bool -> array
    const insert = (x, elm, nt, posn, svg) => {
      const n = x.length;
      var [elm, elmSingle] = polarize(elm);
      var [nt, ntSingle] = polarize(nt);
      var [posn, posnSingle] = polarize(posn);
      if ((!elmSingle  && elm.length  !== n) || 
          (!ntSingle   && nt.length   !== n) ||
          (!posnSingle && posn.length !== n)) {
        throw Error('shape mismatch');
      }
      if (ntSingle && (nt === undefined || nt === null)) nt = 1;
      const getNt = m => ntSingle ? nt : nt[m];
      const getPosn = m => {
        const p = posnSingle ? posn : posn[m];
        if (p === undefined || p === 'end') return null;
        else if (p === 'start') return x[m].firstChild;
        return p;  //p should be an element or null
      };
      const createElm = svg ? createElmSVG : createElmHTML;
      const getElm = m => {
        const e = elmSingle ? elm : elm[m];
        if (typeof e === 'string') {
          const nt_m = getNt(m);
          const newElm_m = new Array(nt_m);
          for (let i=0; i<nt_m; i++) {
            newElm_m[i] = createElm(e);
          }
          return newElm_m;
        }
        if (typeof e === 'function') return e(x[m], m, x); //should be element or array of elements
        return e;  //should be element or array of elements
      };
      const newElm = [];
      let k = 0;
      for (let i=0; i<n; i++) {
        let posn_i = getPosn(i);
        let newElm_i = getElm(i);
        if (Array.isArray(newElm_i)) {
          let n_i = newElm_i.length;
          newElm.length += n_i;
          for (let j=0; j<n_i; j++) {
            x[i].insertBefore(newElm_i[j], posn_i);
            newElm[k++] = newElm_i[j];
          }
        }
        else {
          x[i].insertBefore(newElm_i, posn_i);
          newElm[k++] = newElm_i;
        }
      }
      return newElm;
    };

    addArrayMethod('insert', function(elm, nt, posn) {
      return insert(this, elm, nt, posn, false);
    });
    addArrayMethod('insertSVG', function(elm, nt, posn) {
      return insert(this, elm, nt, posn, true);
    });
        
  }
    
  
  //--------------- create, createSVG, fragment ---------------//
  
  {
  
    //*, num, bool => array
    const create = (elm, n, svg) => {
      elm = toArray(elm);
      const ne = elm.length;
      n = def(assert.single(n),1);
      const createElm = svg ? createElmSVG : createElmHTML;
      const newElm = new Array(ne*n);
      let k = 0;
      for (let j=0; j<n; j++) {
        for (let i=0; i<ne; i++) {
          newElm[k++] = createElm(elm[i]);
        }
      }
      return newElm;
    };
    
    //*, num -> array
    qa.create    = (elm, n) => create(elm, n, false);
    qa.createSVG = (elm, n) => create(elm, n, true);
      
    //num -> array
    qa.fragment = n => {
      n = def(assert.single(n),1);
      const z = new Array(n);
      for (let i=0; i<n; i++) z[i] = document.createDocumentFragment();
      return z;
    };
    
  }
      
      
  //--------------- remove, raise, lower ---------------// 
    
  addArrayMethod('remove', function() {
    for (let i=0, n=this.length; i<n; i++) this[i].parentNode.removeChild(this[i]);
    return this;
  });
  addArrayMethod('raise', function() {
    for (let i=0, n=this.length; i<n; i++) this[i].parentNode.insertBefore(this[i], null);
    return this;
  });
  addArrayMethod('lower', function() {
    for (let i=0, n=this.length; i<n; i++) {
      let p = this[i].parentNode;
      p.insertBefore(this[i], p.firstChild);
    }
    return this;
  });

  
  //--------------- children, firstChild, lastChild, parent ---------------// 

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
  ['firstChild', 'lastChild', 'parent'].forEach(nm => {
    addArrayMethod(nm, function() {
      if (nm === 'parent') nm = 'parentNode';
      const n = this.length;
      const z = new Array(n);
      for (let i=0; i<n; i++) z[i] = this[i][nm];
      return z;
    });
  });
  
  
  //--------------- style, attr, hasAttr, hasClass ---------------// 
  
  {
  
    //array/cube, str, str -> array
    const getInfo = (x, mthd, nm) => {
      nm = assert.single(nm);
      const n = x.length,
            z = new Array(n);
      if      (mthd === 'style')   { for (let i=0; i<n; i++) z[i] = window.getComputedStyle(x[i])[nm] }
      else if (mthd === 'attr')    { for (let i=0; i<n; i++) z[i] = x[i].getAttribute(nm) }
      else if (mthd === 'hasAttr') { for (let i=0; i<n; i++) z[i] = x[i].hasAttribute(nm) }
      else                         { for (let i=0; i<n; i++) z[i] = x[i].classList.contains(nm) }
      return z;
    };

    //* -> array/cube
    ['style','attr','hasAttr','hasClass'].forEach(mthd => {
      addArrayMethod(mthd, function(nm) {
        return getInfo(this, mthd, nm);
      });
    });
    
  }
    
  //--------------- $style, $attr ---------------// 
  
  {
    
    //array/cube, str, str, * -> array/cube
    const setInfo = (x, mthd, nm, val) => {
      const origNm = nm,
            origVal = val;
      if (x._b) callUpdate(x, '_b', mthd, [origNm, origVal]);
      nm = assert.single(nm);
      var [val, valSingle] = polarize(val);
      const n = x.length;
      if (valSingle) {
        if (mthd === '$style') { for (let j=0; j<n; j++) x[j].style[nm] = val }
        else                   { for (let j=0; j<n; j++) x[j].setAttribute(nm, val) } 
      }
      else {
        if (val.length !== n) throw Error('shape mismatch');
        if (mthd === '$style') { for (let j=0; j<n; j++) x[j].style[nm] = val[j] }
        else                   { for (let j=0; j<n; j++) x[j].setAttribute(nm, val[j]) } 
      }
      if (x._a) callUpdate(x, '_a', mthd, [origNm, origVal]);
      return x;
    };
        
    //str, * -> array/cube
    ['$style','$attr'].forEach(mthd => {
      addArrayMethod(mthd, function(nm, val) {
        return setInfo(this, mthd, nm, val);
      });
    });

    //str, func -> array/cube
    ['style', 'attr'].forEach(stem => {
      addArrayMethod('$$' + stem, function(nm, f) {
        assert.single(nm);  //not nm = ... since pass unchanged nm to $style/$attr
        f = assert.single(f);
        const n = this.length;
        const results = new Array(n);
        for (let j=0; j<n; j++) results[j] = f(this[j], this);
        this['$' + stem](nm, results);
        return this;
      });
    });
    
  }
    
  
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


  //--------------- sketch ---------------// 
  
  //[num, num] -> CanvasRenderingContext2D
  addArrayMethod('sketch', function(w, h) {
    w = assert.single(w);
    h = assert.single(h);
    const canvas = this.length ? this.slice(0,1).insert('canvas') : qa.create('canvas'),
          canvasElm = canvas[0];
    if (w !== undefined) canvasElm.setAttribute('width',  w);
    if (h !== undefined) canvasElm.setAttribute('height', h);
    const ctx = canvasElm.getContext('2d');
    ctx.loop = Array.prototype.loop.bind([ctx]);
    return [canvas, ctx];
  });

  
  module.exports = qa;

})();