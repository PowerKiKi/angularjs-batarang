// Service for running code in the context of the application being debugged
angular.module('panelApp').factory('appWatch', function (chromeExtension) {

  var _watchCache = {};
  var _watchTotalCache = 0;

  function calcWatchTotal(tree) {
    _watchTotalCache = 0;
    if(typeof tree !== 'undefined') {
      recurseWatchTotal(tree);
    }
  }

  function recurseWatchTotal(scope) {

    if('watchers' in scope) {
      _watchTotalCache += scope.watchers.length;
    }

    if('children' in scope) {
      var i;
      var scopeChildren = scope.children.length;
      for(i = 0; i < scopeChildren; i++) {
        recurseWatchTotal(scope.children[i]);
      }
    }

  }

  // Public API
  // ==========
  return {

    getWatchTree: function (id, callback) {
      chromeExtension.eval("function (window, args) {" +
        "return window.__ngDebug.getWatchTree(args.id);" +
      "}", {id: id}, function (tree) {
        if (tree) {
          _watchCache[id] = tree;
          calcWatchTotal(tree);
        }
        callback(_watchCache[id]);
      });
    },

    getWatchTotal: function () {
      return _watchTotalCache;
    }

  };
});
