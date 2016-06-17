var fs = require('fs')
var path = require('path')
var choo = require('choo')
var back = require('./components/back')
var css = require('dom-css')

module.exports = function (params, state, send) {
  var hash = state.docs.position.split('#')[1] || state.app.location.split('#')[1]

  var container = document.createElement('div')
  css(container, {
    width: '65%', 
    height: window.innerHeight - 60, 
    position: 'fixed',
    padding: '30px',
    top: '0px',
    right: '0px',
    fontSize: '100%',
    opacity: 0.9,
    display: 'inline-block',
    overflow: 'scroll',
    background: 'rgb(30,30,30)',
    fontFamily: 'Helvetica'
  })

  var wrapper = document.createElement('div')
  wrapper.className = 'markdown-body'
  wrapper.innerHTML = state.docs.contents
  wrapper.id = 'wrapper'

  var counter = [0, 0, 0]

  function descend (node) {
    for (var i = 0; i < node.childNodes.length; i++) {
      var child = node.childNodes[i]
      if (child.id === 'constructor') {
        if (counter[0] > 0) child.id = 'constructor-' + counter[0]
        counter[0] += 1
      }
      if (child.id === 'update') {
        if (counter[1] > 0) child.id = 'update-' + counter[1]
        counter[1] += 1
      }
      if (child.id === 'destroy') {
        if (counter[2] > 0) child.id = 'destroy-' + counter[2]
        counter[2] += 1
      }
      if (child.className === 'internal-link') {
        child.onclick = function (event) {
          send('docs:move', {payload: event.target.href})
        }
      }
      descend(child)
    }
  }

  descend(wrapper)

  if (state.docs.contents) {
    container.appendChild(wrapper)
  }

  if (hash) {
    location.hash = hash
  }
  
  return choo.view`
  <main>
    <div class='row' id='title'>
      <div class='hero-medium'>
        <h1 align='right'>api</h1>
      </div>
      <div class='color-block-medium green'>
      </div>
      <div>
    ${container}
    </div>
    <div>
    ${back()}
    </div>
  </main>`
 }