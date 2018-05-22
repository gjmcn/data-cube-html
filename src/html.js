{
  'use strict';
  
	const helper = require('data-cube-helper');
  const { 
    assert, addArrayMethod, polarize, toArray, def
  } = helper;
  

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
  
  
  //--------------- append/prepend ---------------//
  
  {
    //array/cube, *, bool, * -> array
    const insert = (x, elm, retOrig, posn) => {  
      retOrig = assert.single(retOrig);
      const n = x.length;
      var [elm, elmSingle] = polarize(elm);
      var [posn, posnSingle] = polarize(posn);      
      if (posnSingle && (posn === undefined || posn === null)) posn = 'end';
      const checkArg = (arg, argSingle, n) => {
        if ((!argSingle && arg.length !== n) || 
            (argSingle && typeof arg !== 'string' && n !== 1)) {
          throw Error('shape mismatch');
        }
      };
      checkArg(elm, elmSingle, n);
      checkArg(posn, posnSingle, n);
      if (!retOrig) var newElm = new Array(n);
      for (let i=0; i<n; i++) {
        let elm_i = elmSingle ? elm : elm[i];
        if (typeof elm_i === 'string') elm_i = document.createElement(elm_i);
        let posn_i = posnSingle ? posn : posn[i];
        if (posn_i === 'end') x[i].appendChild(elm_i);
        else if (posn_i === 'start') x[i].insertBefore(elm_i, x[i].firstChild);
        else x[i].insertBefore(elm_i, posn_i);
        if (!retOrig) newElm[i] = elm_i;
      }
      return retOrig ? x : newElm;
    };

    addArrayMethod('insert', function(elm, retOrig, posn) {
      return insert(this, elm, retOrig, posn);
    });
      
  }
  
    
    //JOINING TO DATA - IE ORDER - OR JUST AATTACH DATA
    
  //future, could allow passing function as elm - as d3 append does
  // -just odd since natural to create arrays indata cube, not individual elements
  
  //should be no danger of mistakenly thinking ndeList an array since cube methods are 
  //array methods, cannot call them from nodeList
                   
                   
  //if append fails halfway thru, changes persist - eg if an entry of elm is not an elmt
      
  //WHAT ABOUT SHAPE - NOT USEFUL?! 
  //  -shape ignored throughout
  //  -methods do convert to cubes
  //  -methods do not return cubes - so attr  $attr  style  $style shoud not - can easily
  //   tweak this in getInfo and setInfo in data-cube.js
  
    
  //make sure easy to work with document fragments - both with append/prepend and put
  
  //parent:  myNodes.parent() , parent of each node
  
  //children: myNodes.children(), all children of myNodes (not grouped)
  
  //firstChild   myNodes.firstChild(),  first child of each node
  //lastChild   myNodes.lastChild(),  last child of each node
  
  
  //wrapper for insert adjacent HTML - so do not have to overwrite
  //but nice for adding text?
  
  //create element   shape.elm('div',5)
  //                   .$style('width' [10,20,30,40,50])
  //                   .put('p')
  

  module.exports = qa;

}
  