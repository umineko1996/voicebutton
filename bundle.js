require=(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

var addScriptPromise = 0;
/** Adds proviced script to the page, once **/

function addPlatformScript(src) {
  if (!addScriptPromise) {
    var s = document.createElement('script');
    s.setAttribute('src', src);
    document.body.appendChild(s);
    addScriptPromise = new Promise(function (resolve) {
      s.onload = function () {
        resolve(window.twttr);
      };
    });
  }

  return addScriptPromise;
}

var defaultProps = {
  id: {
    type: String,
    required: true
  },
  sourceType: {
    type: String
  },
  slug: {
    type: String
  },
  options: Object
  /** Basic function used to mount Twitter component */

};

var twitterEmbedComponent = function twitterEmbedComponent(me) {
  return {
    data: function data() {
      return {
        isLoaded: false,
        isAvailable: false
      };
    },
    props: Object.assign({}, defaultProps, me.props),
    mounted: function mounted() {
      var _this = this;

      var params;

      if (this.sourceType === 'profile') {
        params = {
          sourceType: this.sourceType,
          screenName: this.id
        };
      } else if (this.sourceType === 'list') {
        params = {
          sourceType: this.sourceType,
          ownerScreenName: this.id,
          slug: this.slug
        };
      } else {
        params = this.id;
      }

      Promise.resolve(window.twttr ? window.twttr : addPlatformScript('//platform.twitter.com/widgets.js')).then(function (twttr) {
        return me.embedComponent(twttr, params, _this.$el, _this.options);
      }).then(function (data) {
        _this.isAvailable = data !== undefined;
        _this.isLoaded = true;
      });
    },
    render: function render(h) {
      if (this.isLoaded && this.isAvailable) {
        return h('div', {
          class: this.$props.widgetClass
        });
      }

      if (this.isLoaded && !this.isAvailable && this.$props.errorMessage) {
        var $errorMsg = h('div', {
          class: this.$props.errorMessageClass,
          domProps: {
            innerHTML: this.$props.errorMessage
          }
        });
        return h('div', [$errorMsg]);
      }

      return h('div', {
        class: this.$props.widgetClass
      }, this.$slots.default);
    }
  };
};

module.exports = {
  addPlatformScript: addPlatformScript,
  twitterEmbedComponent: twitterEmbedComponent
};
},{}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "Tweet", {
  enumerable: true,
  get: function get() {
    return _tweet.default;
  }
});
Object.defineProperty(exports, "Moment", {
  enumerable: true,
  get: function get() {
    return _moment.default;
  }
});
Object.defineProperty(exports, "Timeline", {
  enumerable: true,
  get: function get() {
    return _timeline.default;
  }
});

var _tweet = _interopRequireDefault(require("./tweet"));

var _moment = _interopRequireDefault(require("./moment"));

var _timeline = _interopRequireDefault(require("./timeline"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
},{"./moment":3,"./timeline":4,"./tweet":5}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _core = require("../core");

var Moment = (0, _core.twitterEmbedComponent)({
  embedComponent: function embedComponent(twttr) {
    var _twttr$widgets;

    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    return (_twttr$widgets = twttr.widgets).createMoment.apply(_twttr$widgets, args);
  },
  props: {
    errorMessage: {
      type: String,
      default: 'Whoops! We couldn\'t access this Moment.'
    },
    errorMessageClass: {
      type: String,
      required: false
    },
    widgetClass: {
      type: String,
      required: false
    }
  }
});
var _default = Moment;
exports.default = _default;
},{"../core":1}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _core = require("../core");

var Timeline = (0, _core.twitterEmbedComponent)({
  embedComponent: function embedComponent(twttr) {
    var _twttr$widgets;

    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    return (_twttr$widgets = twttr.widgets).createTimeline.apply(_twttr$widgets, args);
  },
  props: {
    errorMessage: {
      type: String,
      default: 'Whoops! We couldn\'t access this Timeline.'
    },
    errorMessageClass: {
      type: String,
      required: false
    },
    widgetClass: {
      type: String,
      required: false
    }
  }
});
var _default = Timeline;
exports.default = _default;
},{"../core":1}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _core = require("../core");

var Tweet = (0, _core.twitterEmbedComponent)({
  embedComponent: function embedComponent(twttr) {
    var _twttr$widgets;

    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    return (_twttr$widgets = twttr.widgets).createTweetEmbed.apply(_twttr$widgets, args);
  },
  props: {
    errorMessage: {
      type: String,
      default: 'Whoops! We couldn\'t access this Tweet.'
    },
    errorMessageClass: {
      type: String,
      required: false
    },
    widgetClass: {
      type: String,
      required: false
    }
  }
});
var _default = Tweet;
exports.default = _default;
},{"../core":1}],"vue-tweet-embed":[function(require,module,exports){
let { Tweet } = require("./node_modules/vue-tweet-embed");
Vue.component("Tweet", Tweet);
},{"./node_modules/vue-tweet-embed":2}]},{},[]);
