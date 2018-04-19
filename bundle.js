'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LazyElement = function LazyElement(el, bindings, options) {
  var _this = this;

  _classCallCheck(this, LazyElement);

  this.preloadImage = function (resolve) {
    var image = new Image();
    image.src = _this.bindings.value;
    image.onload = function () {
      resolve(image);
      image = null;
    };
  };

  this.reset = function (newValue) {
    _this.el.setAttribute('src', '');
    _this.bindings.value = newValue;
    _this.el.classList.remove(_this.options.onLoadClassName);
    _this.state = 'loading';
    _this.render();
  };

  this.render = function () {
    var cb = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};

    if (_this.state === 'loaded') return cb(false);
    if (!_this.isElInView()) return cb(false);
    _this.preloadImage(function (image) {
      _this.el.setAttribute('src', image.src);
      _this.el.classList.add(_this.options.onLoadClassName);
      _this.state = 'loaded';
      cb(true);
    });
  };

  this.isElInView = function () {
    var rect = _this.el.getBoundingClientRect();
    return rect.top > 0 && rect.top < window.innerHeight || rect.top < 0 && rect.top > -rect.height;
  };

  this.destroy = function () {
    _this.el = null;
    _this.bindings = null;
  };

  this.el = el;
  this.bindings = bindings;
  this.options = options;
  this.state = 'loading';
};

var LazyLoad = function LazyLoad(Vue, options) {
  var _this2 = this;

  _classCallCheck(this, LazyLoad);

  this.queue = [];
  this.windowHeight = window.innerHeight;
  this.windowWidth = window.innerWidth;
  this.scrollY = -1;

  this.detectWindowChange = function () {
    if (_this2.scrollY !== window.pageYOffset || _this2.windowHeight !== window.innerHeight || _this2.windowWidth !== window.innerWidth) {
      _this2.batchRender();
    }
    requestAnimationFrame(_this2.detectWindowChange);
  };

  this.batchRender = function () {
    if (!_this2.queue.length) return;
    for (var i = _this2.queue.length; i--; i >= 0) {
      _this2.queue[i].render();
    }
  };

  this.bind = function (el, bindings, vNode) {
    el.$lazyEl = new LazyElement(el, bindings, _this2.options);
    _this2.vue.nextTick(function () {
      el.$lazyEl.render(function (rendered) {
        if (!rendered) _this2.queue.push(el.$lazyEl);
      });
    });
  };

  this.update = function (el, bindings, vNode, oldNode) {
    if (bindings.oldValue !== bindings.value) {
      el.$lazyEl.reset(bindings.value);
    }
  };

  this.remove = function (el) {
    el.$lazyEl.destroy();
    el.$lazyEl = null;
  };

  this.vue = Vue;
  this.options = options;
  this.detectWindowChange();
};

var index = {
  install: function install(Vue) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var lazyload = new LazyLoad(Vue, options);

    Vue.directive('lazy-load', {
      bind: lazyload.bind,
      unbind: lazyload.remove,
      update: lazyload.update
    });
  }
};

module.exports = index;
