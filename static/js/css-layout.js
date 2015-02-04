let _computeLayout = require('./lib/Layout');

function roundLayout(layout) {
  // Chrome rounds all the numbers with a precision of 1/64
  // Reproduce the same behavior
  function round(number) {
    var floored = Math.floor(number);
    var decimal = number - floored;
    if (decimal === 0) {
      return number;
    }
    var minDifference = Infinity;
    var minDecimal = Infinity;
    for (var i = 1; i < 64; ++i) {
      var roundedDecimal = i / 64;
      var difference = Math.abs(roundedDecimal - decimal);
      if (difference < minDifference) {
        minDifference = difference;
        minDecimal = roundedDecimal;
      }
    }
    return floored + minDecimal;
  }

  function rec(layout) {
    layout.top = round(layout.top);
    layout.left = round(layout.left);
    layout.width = round(layout.width);
    layout.height = round(layout.height);
    if (layout.children) {
      for (var i = 0; i < layout.children.length; ++i) {
        rec(layout.children[i]);
      }
    }
  }

  rec(layout);
  return layout;
}

function computeCSSLayout(rootNode) {
  function fillNodes(node) {
    node.layout = {
      width: undefined,
      height: undefined,
      top: 0,
      left: 0
    };
    if (!node.style) {
      node.style = {};
    }

    if (!node.children || node.style.measure) {
      node.children = [];
    }
    node.children.forEach(fillNodes);
  }

  function extractNodes(node) {
    var layout = node.layout;
    delete node.layout;
    if (node.children.length > 0) {
      layout.children = node.children.map(extractNodes);
    } else {
      delete node.children;
    }
    return layout;
  }

  fillNodes(rootNode);
  _computeLayout(rootNode);
  return roundLayout(extractNodes(rootNode));
}

module.exports = computeCSSLayout;
