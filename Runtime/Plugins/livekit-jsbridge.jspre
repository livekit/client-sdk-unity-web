"use strict";
(this["webpackChunk_name_"] = this["webpackChunk_name_"] || []).push([[613],{

/***/ 6968:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UnityEvent = exports.UnityBridge = void 0;
var events_1 = __webpack_require__(7187);
var UnityBridge = /** @class */ (function (_super) {
    __extends(UnityBridge, _super);
    function UnityBridge() {
        var _this = _super.call(this) || this;
        _this._ready = false;
        _this.once(UnityEvent.BridgeReady, function () {
            _this._ready = true;
        });
        return _this;
    }
    Object.defineProperty(UnityBridge.prototype, "ready", {
        get: function () {
            return this._ready;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(UnityBridge, "instance", {
        get: function () {
            // The UnityBridge is set on window to expose the instance to Unity
            var w = window;
            return w.lkbridgeinst || (w.lkbridgeinst = new this());
        },
        enumerable: false,
        configurable: true
    });
    UnityBridge.prototype.emit = function (event) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return _super.prototype.emit.apply(this, __spreadArray([event], args, false));
    };
    return UnityBridge;
}(events_1.EventEmitter));
exports.UnityBridge = UnityBridge;
;
var UnityEvent;
(function (UnityEvent) {
    /**
     * When the Bridge has been initialized.
     */
    UnityEvent["BridgeReady"] = "bridgeReady";
    /**
     * When a Room has been created in C#
     * (This allows access to the room instance on the js side)
     */
    UnityEvent["RoomCreated"] = "roomCreated";
})(UnityEvent = exports.UnityEvent || (exports.UnityEvent = {}));


/***/ }),

/***/ 3607:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(6968), exports);


/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ var __webpack_exports__ = (__webpack_exec__(3607));
/******/ window.lkbridge = __webpack_exports__;
/******/ }
]);