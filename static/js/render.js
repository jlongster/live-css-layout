let _computeLayout = require('./lib/Layout');
let canvas;
let ctx;
let currentNode;

function fillNodes(n) {
  n.layout = {
    width: undefined,
    height: undefined,
    top: 0,
    left: 0
  };
  if(!n.style) {
    n.style = {};
  }
  if(!n.children) {
    n.children = [];
  }
  n.children.forEach(fillNodes);
}

function node(style) {
  let [, ...children] = arguments;
  return {
    style: style,
    children: children
  };
}

function computeLayout(n) {
  fillNodes(n);
  _computeLayout(n);
  return n;
}

function resize() {
  let rect = canvas.parentNode.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = rect.height;

  if(currentNode) {
    renderNode(computeLayout(wrapNode(currentNode)));
  }
}

function wrapNode(n) {
  return node({
    width: canvas.width,
    height: canvas.height
  }, n);
}

function render(nodeStr) {
  window.location.hash = escape(escape(nodeStr));
  if(!nodeStr.match(/^\s*node\(.*\)\s*$/m)) {
    return;
  }
  let n = eval(nodeStr);
  if(n && typeof n === 'object') {
    currentNode = n;
    renderNode(computeLayout(wrapNode(n)));
  }
}

function renderNode(n) {
  ctx.fillStyle = ('rgb(' +
                   (Math.random() * 255 | 0) + ',' +
                   (Math.random() * 255 | 0) + ',' +
                   (Math.random() * 255 | 0) + ')');
  ctx.fillRect(n.layout.left,
               n.layout.top,
               n.layout.width,
               n.layout.height);
  n.children.forEach(renderNode);
}

function start(_canvas) {
  canvas = _canvas;
  ctx = canvas.getContext('2d');
  let rect = canvas.parentNode.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = rect.height;
}

module.exports = {
  start: start,
  resize: resize,
  render: render
};
