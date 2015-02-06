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

function benchmarkLayout(n, numLoops) {
  fillNodes(n);
  
  let startTime = window.performance.now();
  for (var i = 0; i < numLoops; i++) {
    _computeLayout(n);  
  }
  let duration = window.performance.now() - startTime;
  
  return duration;
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

function benchmark(nodeStr, numLoops) {
  if(!nodeStr.match(/^\s*node\(.*\)\s*$/m)) {
    return;
  }
  let n = eval(nodeStr);
  if(n && typeof n === 'object') {
    return benchmarkLayout(wrapNode(n), numLoops);
  }

  return -1;
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
  render: render,
  benchmark: benchmark
};
