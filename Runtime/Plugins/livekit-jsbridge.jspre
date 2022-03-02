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
exports.UnityEvent = void 0;
var events_1 = __webpack_require__(7187);
var UnityBridge = /** @class */ (function (_super) {
    __extends(UnityBridge, _super);
    function UnityBridge() {
        var _this = _super.call(this) || this;
        _this.ready = false;
        _this.once(UnityEvent.BridgeReady, function () {
            _this.ready = true;
        });
        return _this;
    }
    Object.defineProperty(UnityBridge, "instance", {
        get: function () {
            // The UnityBridge is set on window to expose the instance to Unity
            var w = window;
            return w.lkbridgeinst || (w.lkbridgeinst = new this());
        },
        enumerable: false,
        configurable: true
    });
    UnityBridge.prototype.sendRoom = function (room) {
        if (!this.ready)
            throw new Error("Can't sendRoom when UnityBridge isn't ready");
        Runtime.dynCall("vi", this.unityCb, [room]);
    };
    UnityBridge.prototype.emit = function (event) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return _super.prototype.emit.apply(this, __spreadArray([event], args, false));
    };
    return UnityBridge;
}(events_1.EventEmitter));
exports["default"] = UnityBridge;
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


/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ var __webpack_exports__ = (__webpack_exec__(6968));
/******/ window.lkbridge = __webpack_exports__;
/******/ }
]);