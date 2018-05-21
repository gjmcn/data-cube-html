{
  'use strict';
  
	const helper = require('data-cube-helper');
  const { 
    assert, addArrayMethod, polarize, toArray, def
  } = helper;
  

  //--------------- query ---------------//
  
  //str[, elmt] -> array
  const query = (q, parent) => {
    q = q.assert.single(q);
    parent = assert.single(parent);
    if (parent === undefined || parent === null) {
      return [...document.querySelectorAll(q)];
    }
    else return [...parent.querySelectorAll(q)];
  };
  
  
  //--------------- append/prepend ---------------//
  
  ??DO WE WANT TO ALLOW PASSING A FUNCTION INSTEAD OF A STRING?
    -must return a single elmt? - if allow multiple elmts (func returns a noedlist)
      handling the returned elmts conistently is trickier 
    
  THEN CHECK BELOW
  
  {
    //array/cube, *, bool, bool -> array
    const append = (x, elm, retNew, pre) => {  
      retNew = def(assert.single(retNew), true);
      const n = x.length;
      var [elm, elmSingle] = polarize(elm);
      let newElm;
      if (retNew) = newArray(np);
      if (elmSingle) {
        if (elm.length !== n) throw Error('shape mismatch');
        if (typeof elm !== 'string' && np !== 1) {
          throw Error('shape mismatch');
        } 
      } 
      for (let i=0; i<np; i++) {
        let elm_i = elmSingle ? elm : elm[i];
        if (typeof elm_i === 'string') elm_i = document.createElement(elm_i);
        pre ?
          x[i].insertBefore(elm_i, x[0].firstChild) :
          x[i].appendChild(elm_i);
        if (retNew) newElm[i] = elm_i;
      }
      return retNew ? newElm : x;
    };

    //* -> array   
    addArrayMethod('prepend', function(elm, retNew) {
      return append(this, elm, retNew, true);
    });
    addArrayMethod('append', function(elm, retNew) {
      return append(this, elm, retNew);
    });
  
  }
  
  
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
  
  
  //create element   shape.elm('div',5)
  //                   .$style('width' [10,20,30,40,50])
  //                   .put('p')
  
  //put shold allow adding array of elmts, fragment?
  //use frag to add multiple? - rather than having put and putAll?


}
  