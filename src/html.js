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
  
  
  //--------------- insert ---------------//
  
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
      for (let i=0; i<n; i++) {
        let elm_i = elmSingle ? elm : elm[i];
        if (typeof elm_i === 'string') {
          elm_i = svg
            ? document.createElementNS("http://www.w3.org/2000/svg", elm_i)
            : document.createElement(elm_i);
        }  //else assume elmt_i already an element
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
    
    
  //--------------- insert, insertEach ---------------//
  
  {
  
    //array/cube, *, * -> array
    const insertEach = (x, f, posn, svg) => {
      const n = x.length;
      f = assert.func(assert.single(f));
      var [posn, posnSingle] = polarize(posn);      
      if (!posnSingle && posn.length !== n) throw Error('shape mismatch');
      let newElm = [];
      for (let i=0; i<n; i++) {
        let newElm_i = toArray(f(x[i], i, x));
        let n_i = newElm_i.length;
        let posn_i = posnSingle ? posn : posn[i];
        posn_i = (posn_i === undefined || posn_i === 'end')
          ? null
          : posn_i === 'start'
            ? x[i].firstChild
            : posn_i;
        let nOld = newElm.length;
        newElm.length += n_i; 
        for (let j=0; j<n_i; j++) {
          x[i].insertBefore(newElm_i[j], posn_i);
          newElm[nOld+j] = newElm_i[j];
        }
      }
      return newElm;
    };
    
    addArrayMethod('insertEach', function(f, posn) {
      return insertEach(this, f, posn, false);
    });
    addArrayMethod('insertEachSVG', function(f, posn) {
      return insertEach(this, f, posn, true);
    });    
    
  }
  
  
  SEEMS TO BE WORKING - DO CREATE NEXT AND TEST WHERE CREATE MULTIPLE IN .insertEach
  
    
    
    //-----------------------------------------

    /* 
    
    ADD:
    -parent      myNodes.parent()
    -remove
    -children     myNodes.children(), all children of myNodes (not grouped)
    -firstChild   myNodes.firstChild()
    -lastChild    myNodes.lastChild()
    -qa.fragment(n)
    -qa.create(tag, n)   and createSVG
    -on      ie event listener
    -off      to remove events
    

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

    
    */

  
    
    //JOINING TO DATA - IE ORDER - OR JUST AATTACH DATA

  module.exports = qa;

}
  