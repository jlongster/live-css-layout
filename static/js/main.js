require('../css/main.less');

let editor = require('./lib/editor/editor');
let render = require('./render');
let numBenchmarkLoops = 2000

window.onresize = function() {
  render.resize();
}

let defaultText = `node(
  { padding: 50, flexDirection: 'column' },
   node({ padding: 10 }),
   node({ padding: 10, marginTop: 10 }),
   node({ padding: 10, marginTop: 10 }),
   node({ padding: 10, alignSelf: 'center' }),
   node({ padding: 10, alignSelf: 'flexEnd' })
)`;

if(window.location.hash) {
  defaultText = unescape(unescape(window.location.hash.slice(1)));
}

let mirror = editor.CodeMirror(document.getElementById('editor'), {
  value: defaultText,
  theme: 'zenburn',
  autofocus: true,
  mode: 'javascript'
});

mirror.setSize(null, 200);

let editorElem = document.getElementById('editor')

let run = document.createElement('button');
run.id = 'run';
run.textContent = 'Run';
editorElem.appendChild(run);
run.addEventListener('click', () => {
  render.render(mirror.getValue());
});

let benchmarkResult = document.createElement('div');
benchmarkResult.id = 'benchmarkResult';
benchmarkResult.textContent = '';
editorElem.appendChild(benchmarkResult);

let benchmark = document.createElement('button');
benchmark.id = 'benchmark';
benchmark.textContent = 'Benchmark (' + numBenchmarkLoops + ' loops)';
editorElem.appendChild(benchmark);
benchmark.addEventListener('click', () => {
  let timeTaken = render.benchmark(mirror.getValue(), numBenchmarkLoops);
  benchmarkResult.textContent = 'Time taken ' + parseInt(timeTaken) + ' ms';
});


render.start(document.querySelector('#canvas canvas'));
render.render(defaultText);
