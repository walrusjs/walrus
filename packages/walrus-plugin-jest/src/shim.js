import 'core-js/stable';
import 'regenerator-runtime/runtime';

global.requestAnimationFrame =
  global.requestAnimationFrame ||
  function requestAnimationFrame(callback) {
    setTimeout(callback, 0);
  };
