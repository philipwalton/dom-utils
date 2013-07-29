;(function(e,t,n){function i(n,s){if(!t[n]){if(!e[n]){var o=typeof require=="function"&&require;if(!s&&o)return o(n,!0);if(r)return r(n,!0);throw new Error("Cannot find module '"+n+"'")}var u=t[n]={exports:{}};e[n][0].call(u.exports,function(t){var r=e[n][1][t];return i(r?r:t)},u,u.exports)}return t[n].exports}var r=typeof require=="function"&&require;for(var s=0;s<n.length;s++)i(n[s]);return i})({1:[function(require,module,exports){
/**
 * Returns an array of the element's parent elements
 */

function parents(element) {
  var list = []
  while (element.parentNode && element.parentNode.nodeType == 1) {
    list.push(element = element.parentNode)
  }
  return list
}

module.exports = parents

},{}],2:[function(require,module,exports){
var parents = require("../src/parents")

describe("parents", function() {
  it("returns an array of all the parent elements of the passed DOM element", function() {
    var rents
      , div = document.createElement("div")
    expect(parents(div)).to.deep.equal([])

    div.innerHTML = "<p id='foo'><span>foo <em>bar</em><span></p>"
    rents = parents(div.querySelector("em"))
    expect(rents.length).to.equal(3)
    expect(rents[0].nodeName.toLowerCase()).to.equal("span")
    expect(rents[1].nodeName.toLowerCase()).to.equal("p")
    expect(rents[2]).to.equal(div)

    expect(parents(document.querySelector("body > *")).length).to.equal(2)
    expect(parents(document.querySelector("body > *"))[0]).to.equal(document.body)
    expect(parents(document.querySelector("body > *"))[1]).to.equal(document.documentElement)

  })
})

},{"../src/parents":1}]},{},[2])
;