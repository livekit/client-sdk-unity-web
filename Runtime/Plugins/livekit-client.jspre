/******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 4537:
/***/ (function(module) {

"use strict";

module.exports = asPromise;

/**
 * Callback as used by {@link util.asPromise}.
 * @typedef asPromiseCallback
 * @type {function}
 * @param {Error|null} error Error, if any
 * @param {...*} params Additional arguments
 * @returns {undefined}
 */

/**
 * Returns a promise from a node-style callback function.
 * @memberof util
 * @param {asPromiseCallback} fn Function to call
 * @param {*} ctx Function context
 * @param {...*} params Function arguments
 * @returns {Promise<*>} Promisified function
 */
function asPromise(fn, ctx/*, varargs */) {
    var params  = new Array(arguments.length - 1),
        offset  = 0,
        index   = 2,
        pending = true;
    while (index < arguments.length)
        params[offset++] = arguments[index++];
    return new Promise(function executor(resolve, reject) {
        params[offset] = function callback(err/*, varargs */) {
            if (pending) {
                pending = false;
                if (err)
                    reject(err);
                else {
                    var params = new Array(arguments.length - 1),
                        offset = 0;
                    while (offset < params.length)
                        params[offset++] = arguments[offset];
                    resolve.apply(null, params);
                }
            }
        };
        try {
            fn.apply(ctx || null, params);
        } catch (err) {
            if (pending) {
                pending = false;
                reject(err);
            }
        }
    });
}


/***/ }),

/***/ 7419:
/***/ (function(__unused_webpack_module, exports) {

"use strict";


/**
 * A minimal base64 implementation for number arrays.
 * @memberof util
 * @namespace
 */
var base64 = exports;

/**
 * Calculates the byte length of a base64 encoded string.
 * @param {string} string Base64 encoded string
 * @returns {number} Byte length
 */
base64.length = function length(string) {
    var p = string.length;
    if (!p)
        return 0;
    var n = 0;
    while (--p % 4 > 1 && string.charAt(p) === "=")
        ++n;
    return Math.ceil(string.length * 3) / 4 - n;
};

// Base64 encoding table
var b64 = new Array(64);

// Base64 decoding table
var s64 = new Array(123);

// 65..90, 97..122, 48..57, 43, 47
for (var i = 0; i < 64;)
    s64[b64[i] = i < 26 ? i + 65 : i < 52 ? i + 71 : i < 62 ? i - 4 : i - 59 | 43] = i++;

/**
 * Encodes a buffer to a base64 encoded string.
 * @param {Uint8Array} buffer Source buffer
 * @param {number} start Source start
 * @param {number} end Source end
 * @returns {string} Base64 encoded string
 */
base64.encode = function encode(buffer, start, end) {
    var parts = null,
        chunk = [];
    var i = 0, // output index
        j = 0, // goto index
        t;     // temporary
    while (start < end) {
        var b = buffer[start++];
        switch (j) {
            case 0:
                chunk[i++] = b64[b >> 2];
                t = (b & 3) << 4;
                j = 1;
                break;
            case 1:
                chunk[i++] = b64[t | b >> 4];
                t = (b & 15) << 2;
                j = 2;
                break;
            case 2:
                chunk[i++] = b64[t | b >> 6];
                chunk[i++] = b64[b & 63];
                j = 0;
                break;
        }
        if (i > 8191) {
            (parts || (parts = [])).push(String.fromCharCode.apply(String, chunk));
            i = 0;
        }
    }
    if (j) {
        chunk[i++] = b64[t];
        chunk[i++] = 61;
        if (j === 1)
            chunk[i++] = 61;
    }
    if (parts) {
        if (i)
            parts.push(String.fromCharCode.apply(String, chunk.slice(0, i)));
        return parts.join("");
    }
    return String.fromCharCode.apply(String, chunk.slice(0, i));
};

var invalidEncoding = "invalid encoding";

/**
 * Decodes a base64 encoded string to a buffer.
 * @param {string} string Source string
 * @param {Uint8Array} buffer Destination buffer
 * @param {number} offset Destination offset
 * @returns {number} Number of bytes written
 * @throws {Error} If encoding is invalid
 */
base64.decode = function decode(string, buffer, offset) {
    var start = offset;
    var j = 0, // goto index
        t;     // temporary
    for (var i = 0; i < string.length;) {
        var c = string.charCodeAt(i++);
        if (c === 61 && j > 1)
            break;
        if ((c = s64[c]) === undefined)
            throw Error(invalidEncoding);
        switch (j) {
            case 0:
                t = c;
                j = 1;
                break;
            case 1:
                buffer[offset++] = t << 2 | (c & 48) >> 4;
                t = c;
                j = 2;
                break;
            case 2:
                buffer[offset++] = (t & 15) << 4 | (c & 60) >> 2;
                t = c;
                j = 3;
                break;
            case 3:
                buffer[offset++] = (t & 3) << 6 | c;
                j = 0;
                break;
        }
    }
    if (j === 1)
        throw Error(invalidEncoding);
    return offset - start;
};

/**
 * Tests if the specified string appears to be base64 encoded.
 * @param {string} string String to test
 * @returns {boolean} `true` if probably base64 encoded, otherwise false
 */
base64.test = function test(string) {
    return /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(string);
};


/***/ }),

/***/ 9211:
/***/ (function(module) {

"use strict";

module.exports = EventEmitter;

/**
 * Constructs a new event emitter instance.
 * @classdesc A minimal event emitter.
 * @memberof util
 * @constructor
 */
function EventEmitter() {

    /**
     * Registered listeners.
     * @type {Object.<string,*>}
     * @private
     */
    this._listeners = {};
}

/**
 * Registers an event listener.
 * @param {string} evt Event name
 * @param {function} fn Listener
 * @param {*} [ctx] Listener context
 * @returns {util.EventEmitter} `this`
 */
EventEmitter.prototype.on = function on(evt, fn, ctx) {
    (this._listeners[evt] || (this._listeners[evt] = [])).push({
        fn  : fn,
        ctx : ctx || this
    });
    return this;
};

/**
 * Removes an event listener or any matching listeners if arguments are omitted.
 * @param {string} [evt] Event name. Removes all listeners if omitted.
 * @param {function} [fn] Listener to remove. Removes all listeners of `evt` if omitted.
 * @returns {util.EventEmitter} `this`
 */
EventEmitter.prototype.off = function off(evt, fn) {
    if (evt === undefined)
        this._listeners = {};
    else {
        if (fn === undefined)
            this._listeners[evt] = [];
        else {
            var listeners = this._listeners[evt];
            for (var i = 0; i < listeners.length;)
                if (listeners[i].fn === fn)
                    listeners.splice(i, 1);
                else
                    ++i;
        }
    }
    return this;
};

/**
 * Emits an event by calling its listeners with the specified arguments.
 * @param {string} evt Event name
 * @param {...*} args Arguments
 * @returns {util.EventEmitter} `this`
 */
EventEmitter.prototype.emit = function emit(evt) {
    var listeners = this._listeners[evt];
    if (listeners) {
        var args = [],
            i = 1;
        for (; i < arguments.length;)
            args.push(arguments[i++]);
        for (i = 0; i < listeners.length;)
            listeners[i].fn.apply(listeners[i++].ctx, args);
    }
    return this;
};


/***/ }),

/***/ 945:
/***/ (function(module) {

"use strict";


module.exports = factory(factory);

/**
 * Reads / writes floats / doubles from / to buffers.
 * @name util.float
 * @namespace
 */

/**
 * Writes a 32 bit float to a buffer using little endian byte order.
 * @name util.float.writeFloatLE
 * @function
 * @param {number} val Value to write
 * @param {Uint8Array} buf Target buffer
 * @param {number} pos Target buffer offset
 * @returns {undefined}
 */

/**
 * Writes a 32 bit float to a buffer using big endian byte order.
 * @name util.float.writeFloatBE
 * @function
 * @param {number} val Value to write
 * @param {Uint8Array} buf Target buffer
 * @param {number} pos Target buffer offset
 * @returns {undefined}
 */

/**
 * Reads a 32 bit float from a buffer using little endian byte order.
 * @name util.float.readFloatLE
 * @function
 * @param {Uint8Array} buf Source buffer
 * @param {number} pos Source buffer offset
 * @returns {number} Value read
 */

/**
 * Reads a 32 bit float from a buffer using big endian byte order.
 * @name util.float.readFloatBE
 * @function
 * @param {Uint8Array} buf Source buffer
 * @param {number} pos Source buffer offset
 * @returns {number} Value read
 */

/**
 * Writes a 64 bit double to a buffer using little endian byte order.
 * @name util.float.writeDoubleLE
 * @function
 * @param {number} val Value to write
 * @param {Uint8Array} buf Target buffer
 * @param {number} pos Target buffer offset
 * @returns {undefined}
 */

/**
 * Writes a 64 bit double to a buffer using big endian byte order.
 * @name util.float.writeDoubleBE
 * @function
 * @param {number} val Value to write
 * @param {Uint8Array} buf Target buffer
 * @param {number} pos Target buffer offset
 * @returns {undefined}
 */

/**
 * Reads a 64 bit double from a buffer using little endian byte order.
 * @name util.float.readDoubleLE
 * @function
 * @param {Uint8Array} buf Source buffer
 * @param {number} pos Source buffer offset
 * @returns {number} Value read
 */

/**
 * Reads a 64 bit double from a buffer using big endian byte order.
 * @name util.float.readDoubleBE
 * @function
 * @param {Uint8Array} buf Source buffer
 * @param {number} pos Source buffer offset
 * @returns {number} Value read
 */

// Factory function for the purpose of node-based testing in modified global environments
function factory(exports) {

    // float: typed array
    if (typeof Float32Array !== "undefined") (function() {

        var f32 = new Float32Array([ -0 ]),
            f8b = new Uint8Array(f32.buffer),
            le  = f8b[3] === 128;

        function writeFloat_f32_cpy(val, buf, pos) {
            f32[0] = val;
            buf[pos    ] = f8b[0];
            buf[pos + 1] = f8b[1];
            buf[pos + 2] = f8b[2];
            buf[pos + 3] = f8b[3];
        }

        function writeFloat_f32_rev(val, buf, pos) {
            f32[0] = val;
            buf[pos    ] = f8b[3];
            buf[pos + 1] = f8b[2];
            buf[pos + 2] = f8b[1];
            buf[pos + 3] = f8b[0];
        }

        /* istanbul ignore next */
        exports.writeFloatLE = le ? writeFloat_f32_cpy : writeFloat_f32_rev;
        /* istanbul ignore next */
        exports.writeFloatBE = le ? writeFloat_f32_rev : writeFloat_f32_cpy;

        function readFloat_f32_cpy(buf, pos) {
            f8b[0] = buf[pos    ];
            f8b[1] = buf[pos + 1];
            f8b[2] = buf[pos + 2];
            f8b[3] = buf[pos + 3];
            return f32[0];
        }

        function readFloat_f32_rev(buf, pos) {
            f8b[3] = buf[pos    ];
            f8b[2] = buf[pos + 1];
            f8b[1] = buf[pos + 2];
            f8b[0] = buf[pos + 3];
            return f32[0];
        }

        /* istanbul ignore next */
        exports.readFloatLE = le ? readFloat_f32_cpy : readFloat_f32_rev;
        /* istanbul ignore next */
        exports.readFloatBE = le ? readFloat_f32_rev : readFloat_f32_cpy;

    // float: ieee754
    })(); else (function() {

        function writeFloat_ieee754(writeUint, val, buf, pos) {
            var sign = val < 0 ? 1 : 0;
            if (sign)
                val = -val;
            if (val === 0)
                writeUint(1 / val > 0 ? /* positive */ 0 : /* negative 0 */ 2147483648, buf, pos);
            else if (isNaN(val))
                writeUint(2143289344, buf, pos);
            else if (val > 3.4028234663852886e+38) // +-Infinity
                writeUint((sign << 31 | 2139095040) >>> 0, buf, pos);
            else if (val < 1.1754943508222875e-38) // denormal
                writeUint((sign << 31 | Math.round(val / 1.401298464324817e-45)) >>> 0, buf, pos);
            else {
                var exponent = Math.floor(Math.log(val) / Math.LN2),
                    mantissa = Math.round(val * Math.pow(2, -exponent) * 8388608) & 8388607;
                writeUint((sign << 31 | exponent + 127 << 23 | mantissa) >>> 0, buf, pos);
            }
        }

        exports.writeFloatLE = writeFloat_ieee754.bind(null, writeUintLE);
        exports.writeFloatBE = writeFloat_ieee754.bind(null, writeUintBE);

        function readFloat_ieee754(readUint, buf, pos) {
            var uint = readUint(buf, pos),
                sign = (uint >> 31) * 2 + 1,
                exponent = uint >>> 23 & 255,
                mantissa = uint & 8388607;
            return exponent === 255
                ? mantissa
                ? NaN
                : sign * Infinity
                : exponent === 0 // denormal
                ? sign * 1.401298464324817e-45 * mantissa
                : sign * Math.pow(2, exponent - 150) * (mantissa + 8388608);
        }

        exports.readFloatLE = readFloat_ieee754.bind(null, readUintLE);
        exports.readFloatBE = readFloat_ieee754.bind(null, readUintBE);

    })();

    // double: typed array
    if (typeof Float64Array !== "undefined") (function() {

        var f64 = new Float64Array([-0]),
            f8b = new Uint8Array(f64.buffer),
            le  = f8b[7] === 128;

        function writeDouble_f64_cpy(val, buf, pos) {
            f64[0] = val;
            buf[pos    ] = f8b[0];
            buf[pos + 1] = f8b[1];
            buf[pos + 2] = f8b[2];
            buf[pos + 3] = f8b[3];
            buf[pos + 4] = f8b[4];
            buf[pos + 5] = f8b[5];
            buf[pos + 6] = f8b[6];
            buf[pos + 7] = f8b[7];
        }

        function writeDouble_f64_rev(val, buf, pos) {
            f64[0] = val;
            buf[pos    ] = f8b[7];
            buf[pos + 1] = f8b[6];
            buf[pos + 2] = f8b[5];
            buf[pos + 3] = f8b[4];
            buf[pos + 4] = f8b[3];
            buf[pos + 5] = f8b[2];
            buf[pos + 6] = f8b[1];
            buf[pos + 7] = f8b[0];
        }

        /* istanbul ignore next */
        exports.writeDoubleLE = le ? writeDouble_f64_cpy : writeDouble_f64_rev;
        /* istanbul ignore next */
        exports.writeDoubleBE = le ? writeDouble_f64_rev : writeDouble_f64_cpy;

        function readDouble_f64_cpy(buf, pos) {
            f8b[0] = buf[pos    ];
            f8b[1] = buf[pos + 1];
            f8b[2] = buf[pos + 2];
            f8b[3] = buf[pos + 3];
            f8b[4] = buf[pos + 4];
            f8b[5] = buf[pos + 5];
            f8b[6] = buf[pos + 6];
            f8b[7] = buf[pos + 7];
            return f64[0];
        }

        function readDouble_f64_rev(buf, pos) {
            f8b[7] = buf[pos    ];
            f8b[6] = buf[pos + 1];
            f8b[5] = buf[pos + 2];
            f8b[4] = buf[pos + 3];
            f8b[3] = buf[pos + 4];
            f8b[2] = buf[pos + 5];
            f8b[1] = buf[pos + 6];
            f8b[0] = buf[pos + 7];
            return f64[0];
        }

        /* istanbul ignore next */
        exports.readDoubleLE = le ? readDouble_f64_cpy : readDouble_f64_rev;
        /* istanbul ignore next */
        exports.readDoubleBE = le ? readDouble_f64_rev : readDouble_f64_cpy;

    // double: ieee754
    })(); else (function() {

        function writeDouble_ieee754(writeUint, off0, off1, val, buf, pos) {
            var sign = val < 0 ? 1 : 0;
            if (sign)
                val = -val;
            if (val === 0) {
                writeUint(0, buf, pos + off0);
                writeUint(1 / val > 0 ? /* positive */ 0 : /* negative 0 */ 2147483648, buf, pos + off1);
            } else if (isNaN(val)) {
                writeUint(0, buf, pos + off0);
                writeUint(2146959360, buf, pos + off1);
            } else if (val > 1.7976931348623157e+308) { // +-Infinity
                writeUint(0, buf, pos + off0);
                writeUint((sign << 31 | 2146435072) >>> 0, buf, pos + off1);
            } else {
                var mantissa;
                if (val < 2.2250738585072014e-308) { // denormal
                    mantissa = val / 5e-324;
                    writeUint(mantissa >>> 0, buf, pos + off0);
                    writeUint((sign << 31 | mantissa / 4294967296) >>> 0, buf, pos + off1);
                } else {
                    var exponent = Math.floor(Math.log(val) / Math.LN2);
                    if (exponent === 1024)
                        exponent = 1023;
                    mantissa = val * Math.pow(2, -exponent);
                    writeUint(mantissa * 4503599627370496 >>> 0, buf, pos + off0);
                    writeUint((sign << 31 | exponent + 1023 << 20 | mantissa * 1048576 & 1048575) >>> 0, buf, pos + off1);
                }
            }
        }

        exports.writeDoubleLE = writeDouble_ieee754.bind(null, writeUintLE, 0, 4);
        exports.writeDoubleBE = writeDouble_ieee754.bind(null, writeUintBE, 4, 0);

        function readDouble_ieee754(readUint, off0, off1, buf, pos) {
            var lo = readUint(buf, pos + off0),
                hi = readUint(buf, pos + off1);
            var sign = (hi >> 31) * 2 + 1,
                exponent = hi >>> 20 & 2047,
                mantissa = 4294967296 * (hi & 1048575) + lo;
            return exponent === 2047
                ? mantissa
                ? NaN
                : sign * Infinity
                : exponent === 0 // denormal
                ? sign * 5e-324 * mantissa
                : sign * Math.pow(2, exponent - 1075) * (mantissa + 4503599627370496);
        }

        exports.readDoubleLE = readDouble_ieee754.bind(null, readUintLE, 0, 4);
        exports.readDoubleBE = readDouble_ieee754.bind(null, readUintBE, 4, 0);

    })();

    return exports;
}

// uint helpers

function writeUintLE(val, buf, pos) {
    buf[pos    ] =  val        & 255;
    buf[pos + 1] =  val >>> 8  & 255;
    buf[pos + 2] =  val >>> 16 & 255;
    buf[pos + 3] =  val >>> 24;
}

function writeUintBE(val, buf, pos) {
    buf[pos    ] =  val >>> 24;
    buf[pos + 1] =  val >>> 16 & 255;
    buf[pos + 2] =  val >>> 8  & 255;
    buf[pos + 3] =  val        & 255;
}

function readUintLE(buf, pos) {
    return (buf[pos    ]
          | buf[pos + 1] << 8
          | buf[pos + 2] << 16
          | buf[pos + 3] << 24) >>> 0;
}

function readUintBE(buf, pos) {
    return (buf[pos    ] << 24
          | buf[pos + 1] << 16
          | buf[pos + 2] << 8
          | buf[pos + 3]) >>> 0;
}


/***/ }),

/***/ 7199:
/***/ (function(module) {

"use strict";

module.exports = inquire;

/**
 * Requires a module only if available.
 * @memberof util
 * @param {string} moduleName Module to require
 * @returns {?Object} Required module if available and not empty, otherwise `null`
 */
function inquire(moduleName) {
    try {
        var mod = eval("quire".replace(/^/,"re"))(moduleName); // eslint-disable-line no-eval
        if (mod && (mod.length || Object.keys(mod).length))
            return mod;
    } catch (e) {} // eslint-disable-line no-empty
    return null;
}


/***/ }),

/***/ 6662:
/***/ (function(module) {

"use strict";

module.exports = pool;

/**
 * An allocator as used by {@link util.pool}.
 * @typedef PoolAllocator
 * @type {function}
 * @param {number} size Buffer size
 * @returns {Uint8Array} Buffer
 */

/**
 * A slicer as used by {@link util.pool}.
 * @typedef PoolSlicer
 * @type {function}
 * @param {number} start Start offset
 * @param {number} end End offset
 * @returns {Uint8Array} Buffer slice
 * @this {Uint8Array}
 */

/**
 * A general purpose buffer pool.
 * @memberof util
 * @function
 * @param {PoolAllocator} alloc Allocator
 * @param {PoolSlicer} slice Slicer
 * @param {number} [size=8192] Slab size
 * @returns {PoolAllocator} Pooled allocator
 */
function pool(alloc, slice, size) {
    var SIZE   = size || 8192;
    var MAX    = SIZE >>> 1;
    var slab   = null;
    var offset = SIZE;
    return function pool_alloc(size) {
        if (size < 1 || size > MAX)
            return alloc(size);
        if (offset + size > SIZE) {
            slab = alloc(SIZE);
            offset = 0;
        }
        var buf = slice.call(slab, offset, offset += size);
        if (offset & 7) // align to 32 bit
            offset = (offset | 7) + 1;
        return buf;
    };
}


/***/ }),

/***/ 4997:
/***/ (function(__unused_webpack_module, exports) {

"use strict";


/**
 * A minimal UTF8 implementation for number arrays.
 * @memberof util
 * @namespace
 */
var utf8 = exports;

/**
 * Calculates the UTF8 byte length of a string.
 * @param {string} string String
 * @returns {number} Byte length
 */
utf8.length = function utf8_length(string) {
    var len = 0,
        c = 0;
    for (var i = 0; i < string.length; ++i) {
        c = string.charCodeAt(i);
        if (c < 128)
            len += 1;
        else if (c < 2048)
            len += 2;
        else if ((c & 0xFC00) === 0xD800 && (string.charCodeAt(i + 1) & 0xFC00) === 0xDC00) {
            ++i;
            len += 4;
        } else
            len += 3;
    }
    return len;
};

/**
 * Reads UTF8 bytes as a string.
 * @param {Uint8Array} buffer Source buffer
 * @param {number} start Source start
 * @param {number} end Source end
 * @returns {string} String read
 */
utf8.read = function utf8_read(buffer, start, end) {
    var len = end - start;
    if (len < 1)
        return "";
    var parts = null,
        chunk = [],
        i = 0, // char offset
        t;     // temporary
    while (start < end) {
        t = buffer[start++];
        if (t < 128)
            chunk[i++] = t;
        else if (t > 191 && t < 224)
            chunk[i++] = (t & 31) << 6 | buffer[start++] & 63;
        else if (t > 239 && t < 365) {
            t = ((t & 7) << 18 | (buffer[start++] & 63) << 12 | (buffer[start++] & 63) << 6 | buffer[start++] & 63) - 0x10000;
            chunk[i++] = 0xD800 + (t >> 10);
            chunk[i++] = 0xDC00 + (t & 1023);
        } else
            chunk[i++] = (t & 15) << 12 | (buffer[start++] & 63) << 6 | buffer[start++] & 63;
        if (i > 8191) {
            (parts || (parts = [])).push(String.fromCharCode.apply(String, chunk));
            i = 0;
        }
    }
    if (parts) {
        if (i)
            parts.push(String.fromCharCode.apply(String, chunk.slice(0, i)));
        return parts.join("");
    }
    return String.fromCharCode.apply(String, chunk.slice(0, i));
};

/**
 * Writes a string as UTF8 bytes.
 * @param {string} string Source string
 * @param {Uint8Array} buffer Destination buffer
 * @param {number} offset Destination offset
 * @returns {number} Bytes written
 */
utf8.write = function utf8_write(string, buffer, offset) {
    var start = offset,
        c1, // character 1
        c2; // character 2
    for (var i = 0; i < string.length; ++i) {
        c1 = string.charCodeAt(i);
        if (c1 < 128) {
            buffer[offset++] = c1;
        } else if (c1 < 2048) {
            buffer[offset++] = c1 >> 6       | 192;
            buffer[offset++] = c1       & 63 | 128;
        } else if ((c1 & 0xFC00) === 0xD800 && ((c2 = string.charCodeAt(i + 1)) & 0xFC00) === 0xDC00) {
            c1 = 0x10000 + ((c1 & 0x03FF) << 10) + (c2 & 0x03FF);
            ++i;
            buffer[offset++] = c1 >> 18      | 240;
            buffer[offset++] = c1 >> 12 & 63 | 128;
            buffer[offset++] = c1 >> 6  & 63 | 128;
            buffer[offset++] = c1       & 63 | 128;
        } else {
            buffer[offset++] = c1 >> 12      | 224;
            buffer[offset++] = c1 >> 6  & 63 | 128;
            buffer[offset++] = c1       & 63 | 128;
        }
    }
    return offset - start;
};


/***/ }),

/***/ 7187:
/***/ (function(module) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



var R = typeof Reflect === 'object' ? Reflect : null
var ReflectApply = R && typeof R.apply === 'function'
  ? R.apply
  : function ReflectApply(target, receiver, args) {
    return Function.prototype.apply.call(target, receiver, args);
  }

var ReflectOwnKeys
if (R && typeof R.ownKeys === 'function') {
  ReflectOwnKeys = R.ownKeys
} else if (Object.getOwnPropertySymbols) {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target)
      .concat(Object.getOwnPropertySymbols(target));
  };
} else {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target);
  };
}

function ProcessEmitWarning(warning) {
  if (console && console.warn) console.warn(warning);
}

var NumberIsNaN = Number.isNaN || function NumberIsNaN(value) {
  return value !== value;
}

function EventEmitter() {
  EventEmitter.init.call(this);
}
module.exports = EventEmitter;
module.exports.once = once;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._eventsCount = 0;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
var defaultMaxListeners = 10;

function checkListener(listener) {
  if (typeof listener !== 'function') {
    throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
  }
}

Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
  enumerable: true,
  get: function() {
    return defaultMaxListeners;
  },
  set: function(arg) {
    if (typeof arg !== 'number' || arg < 0 || NumberIsNaN(arg)) {
      throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + '.');
    }
    defaultMaxListeners = arg;
  }
});

EventEmitter.init = function() {

  if (this._events === undefined ||
      this._events === Object.getPrototypeOf(this)._events) {
    this._events = Object.create(null);
    this._eventsCount = 0;
  }

  this._maxListeners = this._maxListeners || undefined;
};

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
  if (typeof n !== 'number' || n < 0 || NumberIsNaN(n)) {
    throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + '.');
  }
  this._maxListeners = n;
  return this;
};

function _getMaxListeners(that) {
  if (that._maxListeners === undefined)
    return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}

EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return _getMaxListeners(this);
};

EventEmitter.prototype.emit = function emit(type) {
  var args = [];
  for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);
  var doError = (type === 'error');

  var events = this._events;
  if (events !== undefined)
    doError = (doError && events.error === undefined);
  else if (!doError)
    return false;

  // If there is no 'error' event listener then throw.
  if (doError) {
    var er;
    if (args.length > 0)
      er = args[0];
    if (er instanceof Error) {
      // Note: The comments on the `throw` lines are intentional, they show
      // up in Node's output if this results in an unhandled exception.
      throw er; // Unhandled 'error' event
    }
    // At least give some kind of context to the user
    var err = new Error('Unhandled error.' + (er ? ' (' + er.message + ')' : ''));
    err.context = er;
    throw err; // Unhandled 'error' event
  }

  var handler = events[type];

  if (handler === undefined)
    return false;

  if (typeof handler === 'function') {
    ReflectApply(handler, this, args);
  } else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      ReflectApply(listeners[i], this, args);
  }

  return true;
};

function _addListener(target, type, listener, prepend) {
  var m;
  var events;
  var existing;

  checkListener(listener);

  events = target._events;
  if (events === undefined) {
    events = target._events = Object.create(null);
    target._eventsCount = 0;
  } else {
    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (events.newListener !== undefined) {
      target.emit('newListener', type,
                  listener.listener ? listener.listener : listener);

      // Re-assign `events` because a newListener handler could have caused the
      // this._events to be assigned to a new object
      events = target._events;
    }
    existing = events[type];
  }

  if (existing === undefined) {
    // Optimize the case of one listener. Don't need the extra array object.
    existing = events[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === 'function') {
      // Adding the second element, need to change to array.
      existing = events[type] =
        prepend ? [listener, existing] : [existing, listener];
      // If we've already got an array, just append.
    } else if (prepend) {
      existing.unshift(listener);
    } else {
      existing.push(listener);
    }

    // Check for listener leak
    m = _getMaxListeners(target);
    if (m > 0 && existing.length > m && !existing.warned) {
      existing.warned = true;
      // No error code for this since it is a Warning
      // eslint-disable-next-line no-restricted-syntax
      var w = new Error('Possible EventEmitter memory leak detected. ' +
                          existing.length + ' ' + String(type) + ' listeners ' +
                          'added. Use emitter.setMaxListeners() to ' +
                          'increase limit');
      w.name = 'MaxListenersExceededWarning';
      w.emitter = target;
      w.type = type;
      w.count = existing.length;
      ProcessEmitWarning(w);
    }
  }

  return target;
}

EventEmitter.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false);
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.prependListener =
    function prependListener(type, listener) {
      return _addListener(this, type, listener, true);
    };

function onceWrapper() {
  if (!this.fired) {
    this.target.removeListener(this.type, this.wrapFn);
    this.fired = true;
    if (arguments.length === 0)
      return this.listener.call(this.target);
    return this.listener.apply(this.target, arguments);
  }
}

function _onceWrap(target, type, listener) {
  var state = { fired: false, wrapFn: undefined, target: target, type: type, listener: listener };
  var wrapped = onceWrapper.bind(state);
  wrapped.listener = listener;
  state.wrapFn = wrapped;
  return wrapped;
}

EventEmitter.prototype.once = function once(type, listener) {
  checkListener(listener);
  this.on(type, _onceWrap(this, type, listener));
  return this;
};

EventEmitter.prototype.prependOnceListener =
    function prependOnceListener(type, listener) {
      checkListener(listener);
      this.prependListener(type, _onceWrap(this, type, listener));
      return this;
    };

// Emits a 'removeListener' event if and only if the listener was removed.
EventEmitter.prototype.removeListener =
    function removeListener(type, listener) {
      var list, events, position, i, originalListener;

      checkListener(listener);

      events = this._events;
      if (events === undefined)
        return this;

      list = events[type];
      if (list === undefined)
        return this;

      if (list === listener || list.listener === listener) {
        if (--this._eventsCount === 0)
          this._events = Object.create(null);
        else {
          delete events[type];
          if (events.removeListener)
            this.emit('removeListener', type, list.listener || listener);
        }
      } else if (typeof list !== 'function') {
        position = -1;

        for (i = list.length - 1; i >= 0; i--) {
          if (list[i] === listener || list[i].listener === listener) {
            originalListener = list[i].listener;
            position = i;
            break;
          }
        }

        if (position < 0)
          return this;

        if (position === 0)
          list.shift();
        else {
          spliceOne(list, position);
        }

        if (list.length === 1)
          events[type] = list[0];

        if (events.removeListener !== undefined)
          this.emit('removeListener', type, originalListener || listener);
      }

      return this;
    };

EventEmitter.prototype.off = EventEmitter.prototype.removeListener;

EventEmitter.prototype.removeAllListeners =
    function removeAllListeners(type) {
      var listeners, events, i;

      events = this._events;
      if (events === undefined)
        return this;

      // not listening for removeListener, no need to emit
      if (events.removeListener === undefined) {
        if (arguments.length === 0) {
          this._events = Object.create(null);
          this._eventsCount = 0;
        } else if (events[type] !== undefined) {
          if (--this._eventsCount === 0)
            this._events = Object.create(null);
          else
            delete events[type];
        }
        return this;
      }

      // emit removeListener for all listeners on all events
      if (arguments.length === 0) {
        var keys = Object.keys(events);
        var key;
        for (i = 0; i < keys.length; ++i) {
          key = keys[i];
          if (key === 'removeListener') continue;
          this.removeAllListeners(key);
        }
        this.removeAllListeners('removeListener');
        this._events = Object.create(null);
        this._eventsCount = 0;
        return this;
      }

      listeners = events[type];

      if (typeof listeners === 'function') {
        this.removeListener(type, listeners);
      } else if (listeners !== undefined) {
        // LIFO order
        for (i = listeners.length - 1; i >= 0; i--) {
          this.removeListener(type, listeners[i]);
        }
      }

      return this;
    };

function _listeners(target, type, unwrap) {
  var events = target._events;

  if (events === undefined)
    return [];

  var evlistener = events[type];
  if (evlistener === undefined)
    return [];

  if (typeof evlistener === 'function')
    return unwrap ? [evlistener.listener || evlistener] : [evlistener];

  return unwrap ?
    unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
}

EventEmitter.prototype.listeners = function listeners(type) {
  return _listeners(this, type, true);
};

EventEmitter.prototype.rawListeners = function rawListeners(type) {
  return _listeners(this, type, false);
};

EventEmitter.listenerCount = function(emitter, type) {
  if (typeof emitter.listenerCount === 'function') {
    return emitter.listenerCount(type);
  } else {
    return listenerCount.call(emitter, type);
  }
};

EventEmitter.prototype.listenerCount = listenerCount;
function listenerCount(type) {
  var events = this._events;

  if (events !== undefined) {
    var evlistener = events[type];

    if (typeof evlistener === 'function') {
      return 1;
    } else if (evlistener !== undefined) {
      return evlistener.length;
    }
  }

  return 0;
}

EventEmitter.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
};

function arrayClone(arr, n) {
  var copy = new Array(n);
  for (var i = 0; i < n; ++i)
    copy[i] = arr[i];
  return copy;
}

function spliceOne(list, index) {
  for (; index + 1 < list.length; index++)
    list[index] = list[index + 1];
  list.pop();
}

function unwrapListeners(arr) {
  var ret = new Array(arr.length);
  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }
  return ret;
}

function once(emitter, name) {
  return new Promise(function (resolve, reject) {
    function errorListener(err) {
      emitter.removeListener(name, resolver);
      reject(err);
    }

    function resolver() {
      if (typeof emitter.removeListener === 'function') {
        emitter.removeListener('error', errorListener);
      }
      resolve([].slice.call(arguments));
    };

    eventTargetAgnosticAddListener(emitter, name, resolver, { once: true });
    if (name !== 'error') {
      addErrorHandlerIfEventEmitter(emitter, errorListener, { once: true });
    }
  });
}

function addErrorHandlerIfEventEmitter(emitter, handler, flags) {
  if (typeof emitter.on === 'function') {
    eventTargetAgnosticAddListener(emitter, 'error', handler, flags);
  }
}

function eventTargetAgnosticAddListener(emitter, name, listener, flags) {
  if (typeof emitter.on === 'function') {
    if (flags.once) {
      emitter.once(name, listener);
    } else {
      emitter.on(name, listener);
    }
  } else if (typeof emitter.addEventListener === 'function') {
    // EventTarget does not have `error` event semantics like Node
    // EventEmitters, we do not listen for `error` events here.
    emitter.addEventListener(name, function wrapListener(arg) {
      // IE does not have builtin `{ once: true }` support so we
      // have to do it manually.
      if (flags.once) {
        emitter.removeEventListener(name, wrapListener);
      }
      listener(arg);
    });
  } else {
    throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof emitter);
  }
}


/***/ }),

/***/ 4823:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const logger_1 = __importDefault(__webpack_require__(2662));
class Queue {
    constructor() {
        this.queue = [];
        this.running = false;
    }
    enqueue(cb) {
        logger_1.default.debug('enqueuing request to fire later');
        this.queue.push(cb);
    }
    dequeue() {
        const evt = this.queue.shift();
        if (evt)
            evt();
        logger_1.default.debug('firing request from queue');
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.running)
                return;
            logger_1.default.debug('start queue');
            this.running = true;
            while (this.running && this.queue.length > 0) {
                this.dequeue();
            }
            this.running = false;
            logger_1.default.debug('queue finished');
        });
    }
    pause() {
        logger_1.default.debug('pausing queue');
        this.running = false;
    }
    reset() {
        logger_1.default.debug('resetting queue');
        this.running = false;
        this.queue = [];
    }
    isRunning() {
        return this.running;
    }
    isEmpty() {
        return this.queue.length === 0;
    }
}
exports["default"] = Queue;
//# sourceMappingURL=RequestQueue.js.map

/***/ }),

/***/ 9286:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.toProtoSessionDescription = exports.SignalClient = void 0;
__webpack_require__(835);
const logger_1 = __importDefault(__webpack_require__(2662));
const livekit_rtc_1 = __webpack_require__(4658);
const errors_1 = __webpack_require__(7650);
const utils_1 = __webpack_require__(1981);
const RequestQueue_1 = __importDefault(__webpack_require__(4823));
/** @internal */
class SignalClient {
    constructor(useJSON = false) {
        this.isConnected = false;
        this.isReconnecting = false;
        this.useJSON = useJSON;
        this.requestQueue = new RequestQueue_1.default();
    }
    join(url, token, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            // during a full reconnect, we'd want to start the sequence even if currently
            // connected
            this.isConnected = false;
            const res = yield this.connect(url, token, {
                autoSubscribe: opts === null || opts === void 0 ? void 0 : opts.autoSubscribe,
            });
            return res;
        });
    }
    reconnect(url, token) {
        return __awaiter(this, void 0, void 0, function* () {
            this.isReconnecting = true;
            yield this.connect(url, token, {
                reconnect: true,
            });
            this.isReconnecting = false;
            this.requestQueue.run();
        });
    }
    connect(url, token, opts) {
        if (url.startsWith('http')) {
            url = url.replace('http', 'ws');
        }
        // strip trailing slash
        url = url.replace(/\/$/, '');
        url += '/rtc';
        const clientInfo = utils_1.getClientInfo();
        const params = createConnectionParams(token, clientInfo, opts);
        return new Promise((resolve, reject) => {
            logger_1.default.debug('connecting to', url + params);
            this.ws = undefined;
            const ws = new WebSocket(url + params);
            ws.binaryType = 'arraybuffer';
            ws.onerror = (ev) => __awaiter(this, void 0, void 0, function* () {
                if (!this.ws) {
                    try {
                        const resp = yield fetch(`http${url.substring(2)}/validate${params}`);
                        if (!resp.ok) {
                            const msg = yield resp.text();
                            reject(new errors_1.ConnectionError(msg));
                        }
                        else {
                            reject(new errors_1.ConnectionError('Internal error'));
                        }
                    }
                    catch (e) {
                        reject(new errors_1.ConnectionError('server was not reachable'));
                    }
                    return;
                }
                // other errors, handle
                this.handleWSError(ev);
            });
            ws.onopen = () => {
                this.ws = ws;
                if (opts.reconnect) {
                    // upon reconnection, there will not be additional handshake
                    this.isConnected = true;
                    resolve();
                }
            };
            ws.onmessage = (ev) => __awaiter(this, void 0, void 0, function* () {
                // not considered connected until JoinResponse is received
                let msg;
                if (typeof ev.data === 'string') {
                    const json = JSON.parse(ev.data);
                    msg = livekit_rtc_1.SignalResponse.fromJSON(json);
                }
                else if (ev.data instanceof ArrayBuffer) {
                    msg = livekit_rtc_1.SignalResponse.decode(new Uint8Array(ev.data));
                }
                else {
                    logger_1.default.error('could not decode websocket message', typeof ev.data);
                    return;
                }
                if (!this.isConnected) {
                    // handle join message only
                    if (msg.join) {
                        this.isConnected = true;
                        resolve(msg.join);
                    }
                    else {
                        reject(new errors_1.ConnectionError('did not receive join response'));
                    }
                    return;
                }
                if (this.signalLatency) {
                    yield utils_1.sleep(this.signalLatency);
                }
                this.handleSignalResponse(msg);
            });
            ws.onclose = (ev) => {
                if (!this.isConnected || this.ws !== ws)
                    return;
                logger_1.default.debug('websocket connection closed', ev.reason);
                this.isConnected = false;
                if (this.onClose)
                    this.onClose(ev.reason);
                if (this.ws === ws) {
                    this.ws = undefined;
                }
            };
        });
    }
    close() {
        var _a;
        this.isConnected = false;
        if (this.ws)
            this.ws.onclose = null;
        (_a = this.ws) === null || _a === void 0 ? void 0 : _a.close();
        this.ws = undefined;
    }
    // initial offer after joining
    sendOffer(offer) {
        logger_1.default.debug('sending offer', offer);
        this.sendRequest({
            offer: toProtoSessionDescription(offer),
        });
    }
    // answer a server-initiated offer
    sendAnswer(answer) {
        logger_1.default.debug('sending answer');
        this.sendRequest({
            answer: toProtoSessionDescription(answer),
        });
    }
    sendIceCandidate(candidate, target) {
        logger_1.default.trace('sending ice candidate', candidate);
        this.sendRequest({
            trickle: {
                candidateInit: JSON.stringify(candidate),
                target,
            },
        });
    }
    sendMuteTrack(trackSid, muted) {
        this.sendRequest({
            mute: {
                sid: trackSid,
                muted,
            },
        });
    }
    sendAddTrack(req) {
        this.sendRequest({
            addTrack: livekit_rtc_1.AddTrackRequest.fromPartial(req),
        });
    }
    sendUpdateTrackSettings(settings) {
        this.sendRequest({ trackSetting: settings });
    }
    sendUpdateSubscription(sub) {
        this.sendRequest({ subscription: sub });
    }
    sendSyncState(sync) {
        this.sendRequest({ syncState: sync });
    }
    sendUpdateVideoLayers(trackSid, layers) {
        this.sendRequest({
            updateLayers: {
                trackSid,
                layers,
            },
        });
    }
    sendUpdateSubscriptionPermissions(allParticipants, trackPermissions) {
        this.sendRequest({
            subscriptionPermission: {
                allParticipants,
                trackPermissions,
            },
        });
    }
    sendSimulateScenario(scenario) {
        this.sendRequest({
            simulate: scenario,
        });
    }
    sendLeave() {
        this.sendRequest(livekit_rtc_1.SignalRequest.fromPartial({ leave: {} }));
    }
    sendRequest(req, fromQueue = false) {
        return __awaiter(this, void 0, void 0, function* () {
            // capture all requests while reconnecting and put them in a queue.
            // keep order by queueing up new events as long as the queue is not empty
            // unless the request originates from the queue, then don't enqueue again
            if ((this.isReconnecting && !req.simulate) || (!this.requestQueue.isEmpty() && !fromQueue)) {
                this.requestQueue.enqueue(() => this.sendRequest(req, true));
                return;
            }
            if (this.signalLatency) {
                yield utils_1.sleep(this.signalLatency);
            }
            if (!this.ws) {
                logger_1.default.error('cannot send signal request before connected');
                return;
            }
            try {
                if (this.useJSON) {
                    this.ws.send(JSON.stringify(livekit_rtc_1.SignalRequest.toJSON(req)));
                }
                else {
                    this.ws.send(livekit_rtc_1.SignalRequest.encode(req).finish());
                }
            }
            catch (e) {
                logger_1.default.error('error sending signal message', e);
            }
        });
    }
    handleSignalResponse(msg) {
        if (msg.answer) {
            const sd = fromProtoSessionDescription(msg.answer);
            if (this.onAnswer) {
                this.onAnswer(sd);
            }
        }
        else if (msg.offer) {
            const sd = fromProtoSessionDescription(msg.offer);
            if (this.onOffer) {
                this.onOffer(sd);
            }
        }
        else if (msg.trickle) {
            const candidate = JSON.parse(msg.trickle.candidateInit);
            if (this.onTrickle) {
                this.onTrickle(candidate, msg.trickle.target);
            }
        }
        else if (msg.update) {
            if (this.onParticipantUpdate) {
                this.onParticipantUpdate(msg.update.participants);
            }
        }
        else if (msg.trackPublished) {
            if (this.onLocalTrackPublished) {
                this.onLocalTrackPublished(msg.trackPublished);
            }
        }
        else if (msg.speakersChanged) {
            if (this.onSpeakersChanged) {
                this.onSpeakersChanged(msg.speakersChanged.speakers);
            }
        }
        else if (msg.leave) {
            if (this.onLeave) {
                this.onLeave(msg.leave);
            }
        }
        else if (msg.mute) {
            if (this.onRemoteMuteChanged) {
                this.onRemoteMuteChanged(msg.mute.sid, msg.mute.muted);
            }
        }
        else if (msg.roomUpdate) {
            if (this.onRoomUpdate) {
                this.onRoomUpdate(msg.roomUpdate.room);
            }
        }
        else if (msg.connectionQuality) {
            if (this.onConnectionQuality) {
                this.onConnectionQuality(msg.connectionQuality);
            }
        }
        else if (msg.streamStateUpdate) {
            if (this.onStreamStateUpdate) {
                this.onStreamStateUpdate(msg.streamStateUpdate);
            }
        }
        else if (msg.subscribedQualityUpdate) {
            if (this.onSubscribedQualityUpdate) {
                this.onSubscribedQualityUpdate(msg.subscribedQualityUpdate);
            }
        }
        else if (msg.subscriptionPermissionUpdate) {
            if (this.onSubscriptionPermissionUpdate) {
                this.onSubscriptionPermissionUpdate(msg.subscriptionPermissionUpdate);
            }
        }
        else if (msg.refreshToken) {
            if (this.onTokenRefresh) {
                this.onTokenRefresh(msg.refreshToken);
            }
        }
        else {
            logger_1.default.debug('unsupported message', msg);
        }
    }
    handleWSError(ev) {
        logger_1.default.error('websocket error', ev);
    }
}
exports.SignalClient = SignalClient;
function fromProtoSessionDescription(sd) {
    const rsd = {
        type: 'offer',
        sdp: sd.sdp,
    };
    switch (sd.type) {
        case 'answer':
        case 'offer':
        case 'pranswer':
        case 'rollback':
            rsd.type = sd.type;
            break;
        default:
            break;
    }
    return rsd;
}
function toProtoSessionDescription(rsd) {
    const sd = {
        sdp: rsd.sdp,
        type: rsd.type,
    };
    return sd;
}
exports.toProtoSessionDescription = toProtoSessionDescription;
function createConnectionParams(token, info, opts) {
    const params = new URLSearchParams();
    params.set('access_token', token);
    // opts
    if (opts === null || opts === void 0 ? void 0 : opts.reconnect) {
        params.set('reconnect', '1');
    }
    if ((opts === null || opts === void 0 ? void 0 : opts.autoSubscribe) !== undefined) {
        params.set('auto_subscribe', opts.autoSubscribe ? '1' : '0');
    }
    // ClientInfo
    params.set('sdk', 'js');
    params.set('version', info.version);
    params.set('protocol', info.protocol.toString());
    if (info.deviceModel) {
        params.set('device_model', info.deviceModel);
    }
    if (info.os) {
        params.set('os', info.os);
    }
    if (info.osVersion) {
        params.set('os_version', info.osVersion);
    }
    if (info.browser) {
        params.set('browser', info.browser);
    }
    if (info.browserVersion) {
        params.set('browser_version', info.browserVersion);
    }
    return `?${params.toString()}`;
}
//# sourceMappingURL=SignalClient.js.map

/***/ }),

/***/ 2011:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.connect = exports.version = void 0;
const logger_1 = __importStar(__webpack_require__(2662));
const errors_1 = __webpack_require__(7650);
const events_1 = __webpack_require__(8911);
const Room_1 = __importDefault(__webpack_require__(3258));
var version_1 = __webpack_require__(6942);
Object.defineProperty(exports, "version", ({ enumerable: true, get: function () { return version_1.version; } }));
/**
 * Connects to a LiveKit room, shorthand for `new Room()` and [[Room.connect]]
 *
 * ```typescript
 * connect('wss://myhost.livekit.io', token, {
 *   // publish audio and video tracks on joining
 *   audio: true,
 *   video: true,
 *   captureDefaults: {
 *    facingMode: 'user',
 *   },
 * })
 * ```
 * @param url URL to LiveKit server
 * @param token AccessToken, a JWT token that includes authentication and room details
 * @param options
 */
function connect(url, token, options) {
    var _a, _b, _c, _d;
    return __awaiter(this, void 0, void 0, function* () {
        options !== null && options !== void 0 ? options : (options = {});
        if (options.adaptiveStream === undefined) {
            options.adaptiveStream = options.autoManageVideo;
        }
        logger_1.setLogLevel((_a = options.logLevel) !== null && _a !== void 0 ? _a : logger_1.LogLevel.warn);
        const config = (_b = options.rtcConfig) !== null && _b !== void 0 ? _b : {};
        if (options.iceServers) {
            config.iceServers = options.iceServers;
        }
        const room = new Room_1.default(options);
        // connect to room
        yield room.connect(url, token, options);
        const publishAudio = (_c = options.audio) !== null && _c !== void 0 ? _c : false;
        const publishVideo = (_d = options.video) !== null && _d !== void 0 ? _d : false;
        if (publishAudio || publishVideo) {
            setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                // if publishing both
                let err;
                if (publishAudio && publishVideo) {
                    try {
                        yield room.localParticipant.enableCameraAndMicrophone();
                    }
                    catch (e) {
                        const errKind = errors_1.MediaDeviceFailure.getFailure(e);
                        logger_1.default.warn('received error while creating media', errKind);
                        if (e instanceof Error) {
                            logger_1.default.warn(e.message);
                        }
                        // when it's a device issue, try to publish the other kind
                        if (errKind === errors_1.MediaDeviceFailure.NotFound
                            || errKind === errors_1.MediaDeviceFailure.DeviceInUse) {
                            try {
                                yield room.localParticipant.setMicrophoneEnabled(true);
                            }
                            catch (audioErr) {
                                err = audioErr;
                            }
                        }
                        else {
                            err = e;
                        }
                    }
                }
                else if (publishAudio) {
                    try {
                        yield room.localParticipant.setMicrophoneEnabled(true);
                    }
                    catch (e) {
                        err = e;
                    }
                }
                else if (publishVideo) {
                    try {
                        yield room.localParticipant.setCameraEnabled(true);
                    }
                    catch (e) {
                        err = e;
                    }
                }
                if (err) {
                    room.emit(events_1.RoomEvent.MediaDevicesError, err);
                    logger_1.default.error('could not create media', err);
                }
            }));
        }
        return room;
    });
}
exports.connect = connect;
//# sourceMappingURL=connect.js.map

/***/ }),

/***/ 8219:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ConnectionQuality = exports.VideoQuality = exports.TrackPublication = exports.RemoteTrackPublication = exports.RemoteVideoTrack = exports.RemoteAudioTrack = exports.RemoteTrack = exports.LocalTrackPublication = exports.LocalTrack = exports.LocalVideoTrack = exports.LocalAudioTrack = exports.LocalParticipant = exports.RemoteParticipant = exports.Participant = exports.DataPacket_Kind = exports.RoomState = exports.Room = exports.setLogLevel = void 0;
const logger_1 = __webpack_require__(2662);
Object.defineProperty(exports, "setLogLevel", ({ enumerable: true, get: function () { return logger_1.setLogLevel; } }));
const livekit_models_1 = __webpack_require__(8983);
Object.defineProperty(exports, "DataPacket_Kind", ({ enumerable: true, get: function () { return livekit_models_1.DataPacket_Kind; } }));
Object.defineProperty(exports, "VideoQuality", ({ enumerable: true, get: function () { return livekit_models_1.VideoQuality; } }));
const LocalParticipant_1 = __importDefault(__webpack_require__(4149));
exports.LocalParticipant = LocalParticipant_1.default;
const Participant_1 = __importStar(__webpack_require__(2070));
exports.Participant = Participant_1.default;
Object.defineProperty(exports, "ConnectionQuality", ({ enumerable: true, get: function () { return Participant_1.ConnectionQuality; } }));
const RemoteParticipant_1 = __importDefault(__webpack_require__(1488));
exports.RemoteParticipant = RemoteParticipant_1.default;
const Room_1 = __importStar(__webpack_require__(3258));
exports.Room = Room_1.default;
Object.defineProperty(exports, "RoomState", ({ enumerable: true, get: function () { return Room_1.RoomState; } }));
const LocalAudioTrack_1 = __importDefault(__webpack_require__(8669));
exports.LocalAudioTrack = LocalAudioTrack_1.default;
const LocalTrack_1 = __importDefault(__webpack_require__(5728));
exports.LocalTrack = LocalTrack_1.default;
const LocalTrackPublication_1 = __importDefault(__webpack_require__(170));
exports.LocalTrackPublication = LocalTrackPublication_1.default;
const LocalVideoTrack_1 = __importDefault(__webpack_require__(6887));
exports.LocalVideoTrack = LocalVideoTrack_1.default;
const RemoteAudioTrack_1 = __importDefault(__webpack_require__(5941));
exports.RemoteAudioTrack = RemoteAudioTrack_1.default;
const RemoteTrack_1 = __importDefault(__webpack_require__(5785));
exports.RemoteTrack = RemoteTrack_1.default;
const RemoteTrackPublication_1 = __importDefault(__webpack_require__(297));
exports.RemoteTrackPublication = RemoteTrackPublication_1.default;
const RemoteVideoTrack_1 = __importDefault(__webpack_require__(466));
exports.RemoteVideoTrack = RemoteVideoTrack_1.default;
const TrackPublication_1 = __webpack_require__(2184);
Object.defineProperty(exports, "TrackPublication", ({ enumerable: true, get: function () { return TrackPublication_1.TrackPublication; } }));
__exportStar(__webpack_require__(2011), exports);
__exportStar(__webpack_require__(4797), exports);
__exportStar(__webpack_require__(7650), exports);
__exportStar(__webpack_require__(8911), exports);
__exportStar(__webpack_require__(119), exports);
__exportStar(__webpack_require__(6669), exports);
__exportStar(__webpack_require__(410), exports);
__exportStar(__webpack_require__(5884), exports);
__exportStar(__webpack_require__(6942), exports);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 2662:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.setLogLevel = exports.LogLevel = void 0;
const loglevel_1 = __importDefault(__webpack_require__(2043));
var LogLevel;
(function (LogLevel) {
    LogLevel["trace"] = "trace";
    LogLevel["debug"] = "debug";
    LogLevel["info"] = "info";
    LogLevel["warn"] = "warn";
    LogLevel["error"] = "error";
    LogLevel["silent"] = "silent";
})(LogLevel = exports.LogLevel || (exports.LogLevel = {}));
const livekitLogger = loglevel_1.default.getLogger('livekit');
livekitLogger.setLevel(LogLevel.info);
exports["default"] = livekitLogger;
function setLogLevel(level) {
    livekitLogger.setLevel(level);
}
exports.setLogLevel = setLogLevel;
//# sourceMappingURL=logger.js.map

/***/ }),

/***/ 4797:
/***/ (function(__unused_webpack_module, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
//# sourceMappingURL=options.js.map

/***/ }),

/***/ 8983:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ClientInfo = exports.ParticipantTracks = exports.UserPacket = exports.SpeakerInfo = exports.ActiveSpeakerUpdate = exports.DataPacket = exports.VideoLayer = exports.TrackInfo = exports.ParticipantInfo = exports.Codec = exports.Room = exports.clientInfo_SDKToJSON = exports.clientInfo_SDKFromJSON = exports.ClientInfo_SDK = exports.dataPacket_KindToJSON = exports.dataPacket_KindFromJSON = exports.DataPacket_Kind = exports.participantInfo_StateToJSON = exports.participantInfo_StateFromJSON = exports.ParticipantInfo_State = exports.connectionQualityToJSON = exports.connectionQualityFromJSON = exports.ConnectionQuality = exports.videoQualityToJSON = exports.videoQualityFromJSON = exports.VideoQuality = exports.trackSourceToJSON = exports.trackSourceFromJSON = exports.TrackSource = exports.trackTypeToJSON = exports.trackTypeFromJSON = exports.TrackType = exports.protobufPackage = void 0;
/* eslint-disable */
const long_1 = __importDefault(__webpack_require__(3720));
const minimal_1 = __importDefault(__webpack_require__(2100));
exports.protobufPackage = "livekit";
var TrackType;
(function (TrackType) {
    TrackType[TrackType["AUDIO"] = 0] = "AUDIO";
    TrackType[TrackType["VIDEO"] = 1] = "VIDEO";
    TrackType[TrackType["DATA"] = 2] = "DATA";
    TrackType[TrackType["UNRECOGNIZED"] = -1] = "UNRECOGNIZED";
})(TrackType = exports.TrackType || (exports.TrackType = {}));
function trackTypeFromJSON(object) {
    switch (object) {
        case 0:
        case "AUDIO":
            return TrackType.AUDIO;
        case 1:
        case "VIDEO":
            return TrackType.VIDEO;
        case 2:
        case "DATA":
            return TrackType.DATA;
        case -1:
        case "UNRECOGNIZED":
        default:
            return TrackType.UNRECOGNIZED;
    }
}
exports.trackTypeFromJSON = trackTypeFromJSON;
function trackTypeToJSON(object) {
    switch (object) {
        case TrackType.AUDIO:
            return "AUDIO";
        case TrackType.VIDEO:
            return "VIDEO";
        case TrackType.DATA:
            return "DATA";
        default:
            return "UNKNOWN";
    }
}
exports.trackTypeToJSON = trackTypeToJSON;
var TrackSource;
(function (TrackSource) {
    TrackSource[TrackSource["UNKNOWN"] = 0] = "UNKNOWN";
    TrackSource[TrackSource["CAMERA"] = 1] = "CAMERA";
    TrackSource[TrackSource["MICROPHONE"] = 2] = "MICROPHONE";
    TrackSource[TrackSource["SCREEN_SHARE"] = 3] = "SCREEN_SHARE";
    TrackSource[TrackSource["SCREEN_SHARE_AUDIO"] = 4] = "SCREEN_SHARE_AUDIO";
    TrackSource[TrackSource["UNRECOGNIZED"] = -1] = "UNRECOGNIZED";
})(TrackSource = exports.TrackSource || (exports.TrackSource = {}));
function trackSourceFromJSON(object) {
    switch (object) {
        case 0:
        case "UNKNOWN":
            return TrackSource.UNKNOWN;
        case 1:
        case "CAMERA":
            return TrackSource.CAMERA;
        case 2:
        case "MICROPHONE":
            return TrackSource.MICROPHONE;
        case 3:
        case "SCREEN_SHARE":
            return TrackSource.SCREEN_SHARE;
        case 4:
        case "SCREEN_SHARE_AUDIO":
            return TrackSource.SCREEN_SHARE_AUDIO;
        case -1:
        case "UNRECOGNIZED":
        default:
            return TrackSource.UNRECOGNIZED;
    }
}
exports.trackSourceFromJSON = trackSourceFromJSON;
function trackSourceToJSON(object) {
    switch (object) {
        case TrackSource.UNKNOWN:
            return "UNKNOWN";
        case TrackSource.CAMERA:
            return "CAMERA";
        case TrackSource.MICROPHONE:
            return "MICROPHONE";
        case TrackSource.SCREEN_SHARE:
            return "SCREEN_SHARE";
        case TrackSource.SCREEN_SHARE_AUDIO:
            return "SCREEN_SHARE_AUDIO";
        default:
            return "UNKNOWN";
    }
}
exports.trackSourceToJSON = trackSourceToJSON;
var VideoQuality;
(function (VideoQuality) {
    VideoQuality[VideoQuality["LOW"] = 0] = "LOW";
    VideoQuality[VideoQuality["MEDIUM"] = 1] = "MEDIUM";
    VideoQuality[VideoQuality["HIGH"] = 2] = "HIGH";
    VideoQuality[VideoQuality["OFF"] = 3] = "OFF";
    VideoQuality[VideoQuality["UNRECOGNIZED"] = -1] = "UNRECOGNIZED";
})(VideoQuality = exports.VideoQuality || (exports.VideoQuality = {}));
function videoQualityFromJSON(object) {
    switch (object) {
        case 0:
        case "LOW":
            return VideoQuality.LOW;
        case 1:
        case "MEDIUM":
            return VideoQuality.MEDIUM;
        case 2:
        case "HIGH":
            return VideoQuality.HIGH;
        case 3:
        case "OFF":
            return VideoQuality.OFF;
        case -1:
        case "UNRECOGNIZED":
        default:
            return VideoQuality.UNRECOGNIZED;
    }
}
exports.videoQualityFromJSON = videoQualityFromJSON;
function videoQualityToJSON(object) {
    switch (object) {
        case VideoQuality.LOW:
            return "LOW";
        case VideoQuality.MEDIUM:
            return "MEDIUM";
        case VideoQuality.HIGH:
            return "HIGH";
        case VideoQuality.OFF:
            return "OFF";
        default:
            return "UNKNOWN";
    }
}
exports.videoQualityToJSON = videoQualityToJSON;
var ConnectionQuality;
(function (ConnectionQuality) {
    ConnectionQuality[ConnectionQuality["POOR"] = 0] = "POOR";
    ConnectionQuality[ConnectionQuality["GOOD"] = 1] = "GOOD";
    ConnectionQuality[ConnectionQuality["EXCELLENT"] = 2] = "EXCELLENT";
    ConnectionQuality[ConnectionQuality["UNRECOGNIZED"] = -1] = "UNRECOGNIZED";
})(ConnectionQuality = exports.ConnectionQuality || (exports.ConnectionQuality = {}));
function connectionQualityFromJSON(object) {
    switch (object) {
        case 0:
        case "POOR":
            return ConnectionQuality.POOR;
        case 1:
        case "GOOD":
            return ConnectionQuality.GOOD;
        case 2:
        case "EXCELLENT":
            return ConnectionQuality.EXCELLENT;
        case -1:
        case "UNRECOGNIZED":
        default:
            return ConnectionQuality.UNRECOGNIZED;
    }
}
exports.connectionQualityFromJSON = connectionQualityFromJSON;
function connectionQualityToJSON(object) {
    switch (object) {
        case ConnectionQuality.POOR:
            return "POOR";
        case ConnectionQuality.GOOD:
            return "GOOD";
        case ConnectionQuality.EXCELLENT:
            return "EXCELLENT";
        default:
            return "UNKNOWN";
    }
}
exports.connectionQualityToJSON = connectionQualityToJSON;
var ParticipantInfo_State;
(function (ParticipantInfo_State) {
    /** JOINING - websocket' connected, but not offered yet */
    ParticipantInfo_State[ParticipantInfo_State["JOINING"] = 0] = "JOINING";
    /** JOINED - server received client offer */
    ParticipantInfo_State[ParticipantInfo_State["JOINED"] = 1] = "JOINED";
    /** ACTIVE - ICE connectivity established */
    ParticipantInfo_State[ParticipantInfo_State["ACTIVE"] = 2] = "ACTIVE";
    /** DISCONNECTED - WS disconnected */
    ParticipantInfo_State[ParticipantInfo_State["DISCONNECTED"] = 3] = "DISCONNECTED";
    ParticipantInfo_State[ParticipantInfo_State["UNRECOGNIZED"] = -1] = "UNRECOGNIZED";
})(ParticipantInfo_State = exports.ParticipantInfo_State || (exports.ParticipantInfo_State = {}));
function participantInfo_StateFromJSON(object) {
    switch (object) {
        case 0:
        case "JOINING":
            return ParticipantInfo_State.JOINING;
        case 1:
        case "JOINED":
            return ParticipantInfo_State.JOINED;
        case 2:
        case "ACTIVE":
            return ParticipantInfo_State.ACTIVE;
        case 3:
        case "DISCONNECTED":
            return ParticipantInfo_State.DISCONNECTED;
        case -1:
        case "UNRECOGNIZED":
        default:
            return ParticipantInfo_State.UNRECOGNIZED;
    }
}
exports.participantInfo_StateFromJSON = participantInfo_StateFromJSON;
function participantInfo_StateToJSON(object) {
    switch (object) {
        case ParticipantInfo_State.JOINING:
            return "JOINING";
        case ParticipantInfo_State.JOINED:
            return "JOINED";
        case ParticipantInfo_State.ACTIVE:
            return "ACTIVE";
        case ParticipantInfo_State.DISCONNECTED:
            return "DISCONNECTED";
        default:
            return "UNKNOWN";
    }
}
exports.participantInfo_StateToJSON = participantInfo_StateToJSON;
var DataPacket_Kind;
(function (DataPacket_Kind) {
    DataPacket_Kind[DataPacket_Kind["RELIABLE"] = 0] = "RELIABLE";
    DataPacket_Kind[DataPacket_Kind["LOSSY"] = 1] = "LOSSY";
    DataPacket_Kind[DataPacket_Kind["UNRECOGNIZED"] = -1] = "UNRECOGNIZED";
})(DataPacket_Kind = exports.DataPacket_Kind || (exports.DataPacket_Kind = {}));
function dataPacket_KindFromJSON(object) {
    switch (object) {
        case 0:
        case "RELIABLE":
            return DataPacket_Kind.RELIABLE;
        case 1:
        case "LOSSY":
            return DataPacket_Kind.LOSSY;
        case -1:
        case "UNRECOGNIZED":
        default:
            return DataPacket_Kind.UNRECOGNIZED;
    }
}
exports.dataPacket_KindFromJSON = dataPacket_KindFromJSON;
function dataPacket_KindToJSON(object) {
    switch (object) {
        case DataPacket_Kind.RELIABLE:
            return "RELIABLE";
        case DataPacket_Kind.LOSSY:
            return "LOSSY";
        default:
            return "UNKNOWN";
    }
}
exports.dataPacket_KindToJSON = dataPacket_KindToJSON;
var ClientInfo_SDK;
(function (ClientInfo_SDK) {
    ClientInfo_SDK[ClientInfo_SDK["UNKNOWN"] = 0] = "UNKNOWN";
    ClientInfo_SDK[ClientInfo_SDK["JS"] = 1] = "JS";
    ClientInfo_SDK[ClientInfo_SDK["SWIFT"] = 2] = "SWIFT";
    ClientInfo_SDK[ClientInfo_SDK["ANDROID"] = 3] = "ANDROID";
    ClientInfo_SDK[ClientInfo_SDK["FLUTTER"] = 4] = "FLUTTER";
    ClientInfo_SDK[ClientInfo_SDK["GO"] = 5] = "GO";
    ClientInfo_SDK[ClientInfo_SDK["UNITY"] = 6] = "UNITY";
    ClientInfo_SDK[ClientInfo_SDK["UNRECOGNIZED"] = -1] = "UNRECOGNIZED";
})(ClientInfo_SDK = exports.ClientInfo_SDK || (exports.ClientInfo_SDK = {}));
function clientInfo_SDKFromJSON(object) {
    switch (object) {
        case 0:
        case "UNKNOWN":
            return ClientInfo_SDK.UNKNOWN;
        case 1:
        case "JS":
            return ClientInfo_SDK.JS;
        case 2:
        case "SWIFT":
            return ClientInfo_SDK.SWIFT;
        case 3:
        case "ANDROID":
            return ClientInfo_SDK.ANDROID;
        case 4:
        case "FLUTTER":
            return ClientInfo_SDK.FLUTTER;
        case 5:
        case "GO":
            return ClientInfo_SDK.GO;
        case 6:
        case "UNITY":
            return ClientInfo_SDK.UNITY;
        case -1:
        case "UNRECOGNIZED":
        default:
            return ClientInfo_SDK.UNRECOGNIZED;
    }
}
exports.clientInfo_SDKFromJSON = clientInfo_SDKFromJSON;
function clientInfo_SDKToJSON(object) {
    switch (object) {
        case ClientInfo_SDK.UNKNOWN:
            return "UNKNOWN";
        case ClientInfo_SDK.JS:
            return "JS";
        case ClientInfo_SDK.SWIFT:
            return "SWIFT";
        case ClientInfo_SDK.ANDROID:
            return "ANDROID";
        case ClientInfo_SDK.FLUTTER:
            return "FLUTTER";
        case ClientInfo_SDK.GO:
            return "GO";
        case ClientInfo_SDK.UNITY:
            return "UNITY";
        default:
            return "UNKNOWN";
    }
}
exports.clientInfo_SDKToJSON = clientInfo_SDKToJSON;
const baseRoom = {
    sid: "",
    name: "",
    emptyTimeout: 0,
    maxParticipants: 0,
    creationTime: 0,
    turnPassword: "",
    metadata: "",
    numParticipants: 0,
    activeRecording: false,
};
exports.Room = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.sid !== "") {
            writer.uint32(10).string(message.sid);
        }
        if (message.name !== "") {
            writer.uint32(18).string(message.name);
        }
        if (message.emptyTimeout !== 0) {
            writer.uint32(24).uint32(message.emptyTimeout);
        }
        if (message.maxParticipants !== 0) {
            writer.uint32(32).uint32(message.maxParticipants);
        }
        if (message.creationTime !== 0) {
            writer.uint32(40).int64(message.creationTime);
        }
        if (message.turnPassword !== "") {
            writer.uint32(50).string(message.turnPassword);
        }
        for (const v of message.enabledCodecs) {
            exports.Codec.encode(v, writer.uint32(58).fork()).ldelim();
        }
        if (message.metadata !== "") {
            writer.uint32(66).string(message.metadata);
        }
        if (message.numParticipants !== 0) {
            writer.uint32(72).uint32(message.numParticipants);
        }
        if (message.activeRecording === true) {
            writer.uint32(80).bool(message.activeRecording);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseRoom);
        message.enabledCodecs = [];
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.sid = reader.string();
                    break;
                case 2:
                    message.name = reader.string();
                    break;
                case 3:
                    message.emptyTimeout = reader.uint32();
                    break;
                case 4:
                    message.maxParticipants = reader.uint32();
                    break;
                case 5:
                    message.creationTime = longToNumber(reader.int64());
                    break;
                case 6:
                    message.turnPassword = reader.string();
                    break;
                case 7:
                    message.enabledCodecs.push(exports.Codec.decode(reader, reader.uint32()));
                    break;
                case 8:
                    message.metadata = reader.string();
                    break;
                case 9:
                    message.numParticipants = reader.uint32();
                    break;
                case 10:
                    message.activeRecording = reader.bool();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseRoom);
        message.enabledCodecs = [];
        if (object.sid !== undefined && object.sid !== null) {
            message.sid = String(object.sid);
        }
        else {
            message.sid = "";
        }
        if (object.name !== undefined && object.name !== null) {
            message.name = String(object.name);
        }
        else {
            message.name = "";
        }
        if (object.emptyTimeout !== undefined && object.emptyTimeout !== null) {
            message.emptyTimeout = Number(object.emptyTimeout);
        }
        else {
            message.emptyTimeout = 0;
        }
        if (object.maxParticipants !== undefined &&
            object.maxParticipants !== null) {
            message.maxParticipants = Number(object.maxParticipants);
        }
        else {
            message.maxParticipants = 0;
        }
        if (object.creationTime !== undefined && object.creationTime !== null) {
            message.creationTime = Number(object.creationTime);
        }
        else {
            message.creationTime = 0;
        }
        if (object.turnPassword !== undefined && object.turnPassword !== null) {
            message.turnPassword = String(object.turnPassword);
        }
        else {
            message.turnPassword = "";
        }
        if (object.enabledCodecs !== undefined && object.enabledCodecs !== null) {
            for (const e of object.enabledCodecs) {
                message.enabledCodecs.push(exports.Codec.fromJSON(e));
            }
        }
        if (object.metadata !== undefined && object.metadata !== null) {
            message.metadata = String(object.metadata);
        }
        else {
            message.metadata = "";
        }
        if (object.numParticipants !== undefined &&
            object.numParticipants !== null) {
            message.numParticipants = Number(object.numParticipants);
        }
        else {
            message.numParticipants = 0;
        }
        if (object.activeRecording !== undefined &&
            object.activeRecording !== null) {
            message.activeRecording = Boolean(object.activeRecording);
        }
        else {
            message.activeRecording = false;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.sid !== undefined && (obj.sid = message.sid);
        message.name !== undefined && (obj.name = message.name);
        message.emptyTimeout !== undefined &&
            (obj.emptyTimeout = message.emptyTimeout);
        message.maxParticipants !== undefined &&
            (obj.maxParticipants = message.maxParticipants);
        message.creationTime !== undefined &&
            (obj.creationTime = message.creationTime);
        message.turnPassword !== undefined &&
            (obj.turnPassword = message.turnPassword);
        if (message.enabledCodecs) {
            obj.enabledCodecs = message.enabledCodecs.map((e) => e ? exports.Codec.toJSON(e) : undefined);
        }
        else {
            obj.enabledCodecs = [];
        }
        message.metadata !== undefined && (obj.metadata = message.metadata);
        message.numParticipants !== undefined &&
            (obj.numParticipants = message.numParticipants);
        message.activeRecording !== undefined &&
            (obj.activeRecording = message.activeRecording);
        return obj;
    },
    fromPartial(object) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        const message = Object.assign({}, baseRoom);
        message.sid = (_a = object.sid) !== null && _a !== void 0 ? _a : "";
        message.name = (_b = object.name) !== null && _b !== void 0 ? _b : "";
        message.emptyTimeout = (_c = object.emptyTimeout) !== null && _c !== void 0 ? _c : 0;
        message.maxParticipants = (_d = object.maxParticipants) !== null && _d !== void 0 ? _d : 0;
        message.creationTime = (_e = object.creationTime) !== null && _e !== void 0 ? _e : 0;
        message.turnPassword = (_f = object.turnPassword) !== null && _f !== void 0 ? _f : "";
        message.enabledCodecs = [];
        if (object.enabledCodecs !== undefined && object.enabledCodecs !== null) {
            for (const e of object.enabledCodecs) {
                message.enabledCodecs.push(exports.Codec.fromPartial(e));
            }
        }
        message.metadata = (_g = object.metadata) !== null && _g !== void 0 ? _g : "";
        message.numParticipants = (_h = object.numParticipants) !== null && _h !== void 0 ? _h : 0;
        message.activeRecording = (_j = object.activeRecording) !== null && _j !== void 0 ? _j : false;
        return message;
    },
};
const baseCodec = { mime: "", fmtpLine: "" };
exports.Codec = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.mime !== "") {
            writer.uint32(10).string(message.mime);
        }
        if (message.fmtpLine !== "") {
            writer.uint32(18).string(message.fmtpLine);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseCodec);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.mime = reader.string();
                    break;
                case 2:
                    message.fmtpLine = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseCodec);
        if (object.mime !== undefined && object.mime !== null) {
            message.mime = String(object.mime);
        }
        else {
            message.mime = "";
        }
        if (object.fmtpLine !== undefined && object.fmtpLine !== null) {
            message.fmtpLine = String(object.fmtpLine);
        }
        else {
            message.fmtpLine = "";
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.mime !== undefined && (obj.mime = message.mime);
        message.fmtpLine !== undefined && (obj.fmtpLine = message.fmtpLine);
        return obj;
    },
    fromPartial(object) {
        var _a, _b;
        const message = Object.assign({}, baseCodec);
        message.mime = (_a = object.mime) !== null && _a !== void 0 ? _a : "";
        message.fmtpLine = (_b = object.fmtpLine) !== null && _b !== void 0 ? _b : "";
        return message;
    },
};
const baseParticipantInfo = {
    sid: "",
    identity: "",
    state: 0,
    metadata: "",
    joinedAt: 0,
    hidden: false,
    recorder: false,
    name: "",
};
exports.ParticipantInfo = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.sid !== "") {
            writer.uint32(10).string(message.sid);
        }
        if (message.identity !== "") {
            writer.uint32(18).string(message.identity);
        }
        if (message.state !== 0) {
            writer.uint32(24).int32(message.state);
        }
        for (const v of message.tracks) {
            exports.TrackInfo.encode(v, writer.uint32(34).fork()).ldelim();
        }
        if (message.metadata !== "") {
            writer.uint32(42).string(message.metadata);
        }
        if (message.joinedAt !== 0) {
            writer.uint32(48).int64(message.joinedAt);
        }
        if (message.hidden === true) {
            writer.uint32(56).bool(message.hidden);
        }
        if (message.recorder === true) {
            writer.uint32(64).bool(message.recorder);
        }
        if (message.name !== "") {
            writer.uint32(74).string(message.name);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseParticipantInfo);
        message.tracks = [];
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.sid = reader.string();
                    break;
                case 2:
                    message.identity = reader.string();
                    break;
                case 3:
                    message.state = reader.int32();
                    break;
                case 4:
                    message.tracks.push(exports.TrackInfo.decode(reader, reader.uint32()));
                    break;
                case 5:
                    message.metadata = reader.string();
                    break;
                case 6:
                    message.joinedAt = longToNumber(reader.int64());
                    break;
                case 7:
                    message.hidden = reader.bool();
                    break;
                case 8:
                    message.recorder = reader.bool();
                    break;
                case 9:
                    message.name = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseParticipantInfo);
        message.tracks = [];
        if (object.sid !== undefined && object.sid !== null) {
            message.sid = String(object.sid);
        }
        else {
            message.sid = "";
        }
        if (object.identity !== undefined && object.identity !== null) {
            message.identity = String(object.identity);
        }
        else {
            message.identity = "";
        }
        if (object.state !== undefined && object.state !== null) {
            message.state = participantInfo_StateFromJSON(object.state);
        }
        else {
            message.state = 0;
        }
        if (object.tracks !== undefined && object.tracks !== null) {
            for (const e of object.tracks) {
                message.tracks.push(exports.TrackInfo.fromJSON(e));
            }
        }
        if (object.metadata !== undefined && object.metadata !== null) {
            message.metadata = String(object.metadata);
        }
        else {
            message.metadata = "";
        }
        if (object.joinedAt !== undefined && object.joinedAt !== null) {
            message.joinedAt = Number(object.joinedAt);
        }
        else {
            message.joinedAt = 0;
        }
        if (object.hidden !== undefined && object.hidden !== null) {
            message.hidden = Boolean(object.hidden);
        }
        else {
            message.hidden = false;
        }
        if (object.recorder !== undefined && object.recorder !== null) {
            message.recorder = Boolean(object.recorder);
        }
        else {
            message.recorder = false;
        }
        if (object.name !== undefined && object.name !== null) {
            message.name = String(object.name);
        }
        else {
            message.name = "";
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.sid !== undefined && (obj.sid = message.sid);
        message.identity !== undefined && (obj.identity = message.identity);
        message.state !== undefined &&
            (obj.state = participantInfo_StateToJSON(message.state));
        if (message.tracks) {
            obj.tracks = message.tracks.map((e) => e ? exports.TrackInfo.toJSON(e) : undefined);
        }
        else {
            obj.tracks = [];
        }
        message.metadata !== undefined && (obj.metadata = message.metadata);
        message.joinedAt !== undefined && (obj.joinedAt = message.joinedAt);
        message.hidden !== undefined && (obj.hidden = message.hidden);
        message.recorder !== undefined && (obj.recorder = message.recorder);
        message.name !== undefined && (obj.name = message.name);
        return obj;
    },
    fromPartial(object) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        const message = Object.assign({}, baseParticipantInfo);
        message.sid = (_a = object.sid) !== null && _a !== void 0 ? _a : "";
        message.identity = (_b = object.identity) !== null && _b !== void 0 ? _b : "";
        message.state = (_c = object.state) !== null && _c !== void 0 ? _c : 0;
        message.tracks = [];
        if (object.tracks !== undefined && object.tracks !== null) {
            for (const e of object.tracks) {
                message.tracks.push(exports.TrackInfo.fromPartial(e));
            }
        }
        message.metadata = (_d = object.metadata) !== null && _d !== void 0 ? _d : "";
        message.joinedAt = (_e = object.joinedAt) !== null && _e !== void 0 ? _e : 0;
        message.hidden = (_f = object.hidden) !== null && _f !== void 0 ? _f : false;
        message.recorder = (_g = object.recorder) !== null && _g !== void 0 ? _g : false;
        message.name = (_h = object.name) !== null && _h !== void 0 ? _h : "";
        return message;
    },
};
const baseTrackInfo = {
    sid: "",
    type: 0,
    name: "",
    muted: false,
    width: 0,
    height: 0,
    simulcast: false,
    disableDtx: false,
    source: 0,
    mimeType: "",
    mid: "",
};
exports.TrackInfo = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.sid !== "") {
            writer.uint32(10).string(message.sid);
        }
        if (message.type !== 0) {
            writer.uint32(16).int32(message.type);
        }
        if (message.name !== "") {
            writer.uint32(26).string(message.name);
        }
        if (message.muted === true) {
            writer.uint32(32).bool(message.muted);
        }
        if (message.width !== 0) {
            writer.uint32(40).uint32(message.width);
        }
        if (message.height !== 0) {
            writer.uint32(48).uint32(message.height);
        }
        if (message.simulcast === true) {
            writer.uint32(56).bool(message.simulcast);
        }
        if (message.disableDtx === true) {
            writer.uint32(64).bool(message.disableDtx);
        }
        if (message.source !== 0) {
            writer.uint32(72).int32(message.source);
        }
        for (const v of message.layers) {
            exports.VideoLayer.encode(v, writer.uint32(82).fork()).ldelim();
        }
        if (message.mimeType !== "") {
            writer.uint32(90).string(message.mimeType);
        }
        if (message.mid !== "") {
            writer.uint32(98).string(message.mid);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseTrackInfo);
        message.layers = [];
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.sid = reader.string();
                    break;
                case 2:
                    message.type = reader.int32();
                    break;
                case 3:
                    message.name = reader.string();
                    break;
                case 4:
                    message.muted = reader.bool();
                    break;
                case 5:
                    message.width = reader.uint32();
                    break;
                case 6:
                    message.height = reader.uint32();
                    break;
                case 7:
                    message.simulcast = reader.bool();
                    break;
                case 8:
                    message.disableDtx = reader.bool();
                    break;
                case 9:
                    message.source = reader.int32();
                    break;
                case 10:
                    message.layers.push(exports.VideoLayer.decode(reader, reader.uint32()));
                    break;
                case 11:
                    message.mimeType = reader.string();
                    break;
                case 12:
                    message.mid = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseTrackInfo);
        message.layers = [];
        if (object.sid !== undefined && object.sid !== null) {
            message.sid = String(object.sid);
        }
        else {
            message.sid = "";
        }
        if (object.type !== undefined && object.type !== null) {
            message.type = trackTypeFromJSON(object.type);
        }
        else {
            message.type = 0;
        }
        if (object.name !== undefined && object.name !== null) {
            message.name = String(object.name);
        }
        else {
            message.name = "";
        }
        if (object.muted !== undefined && object.muted !== null) {
            message.muted = Boolean(object.muted);
        }
        else {
            message.muted = false;
        }
        if (object.width !== undefined && object.width !== null) {
            message.width = Number(object.width);
        }
        else {
            message.width = 0;
        }
        if (object.height !== undefined && object.height !== null) {
            message.height = Number(object.height);
        }
        else {
            message.height = 0;
        }
        if (object.simulcast !== undefined && object.simulcast !== null) {
            message.simulcast = Boolean(object.simulcast);
        }
        else {
            message.simulcast = false;
        }
        if (object.disableDtx !== undefined && object.disableDtx !== null) {
            message.disableDtx = Boolean(object.disableDtx);
        }
        else {
            message.disableDtx = false;
        }
        if (object.source !== undefined && object.source !== null) {
            message.source = trackSourceFromJSON(object.source);
        }
        else {
            message.source = 0;
        }
        if (object.layers !== undefined && object.layers !== null) {
            for (const e of object.layers) {
                message.layers.push(exports.VideoLayer.fromJSON(e));
            }
        }
        if (object.mimeType !== undefined && object.mimeType !== null) {
            message.mimeType = String(object.mimeType);
        }
        else {
            message.mimeType = "";
        }
        if (object.mid !== undefined && object.mid !== null) {
            message.mid = String(object.mid);
        }
        else {
            message.mid = "";
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.sid !== undefined && (obj.sid = message.sid);
        message.type !== undefined && (obj.type = trackTypeToJSON(message.type));
        message.name !== undefined && (obj.name = message.name);
        message.muted !== undefined && (obj.muted = message.muted);
        message.width !== undefined && (obj.width = message.width);
        message.height !== undefined && (obj.height = message.height);
        message.simulcast !== undefined && (obj.simulcast = message.simulcast);
        message.disableDtx !== undefined && (obj.disableDtx = message.disableDtx);
        message.source !== undefined &&
            (obj.source = trackSourceToJSON(message.source));
        if (message.layers) {
            obj.layers = message.layers.map((e) => e ? exports.VideoLayer.toJSON(e) : undefined);
        }
        else {
            obj.layers = [];
        }
        message.mimeType !== undefined && (obj.mimeType = message.mimeType);
        message.mid !== undefined && (obj.mid = message.mid);
        return obj;
    },
    fromPartial(object) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        const message = Object.assign({}, baseTrackInfo);
        message.sid = (_a = object.sid) !== null && _a !== void 0 ? _a : "";
        message.type = (_b = object.type) !== null && _b !== void 0 ? _b : 0;
        message.name = (_c = object.name) !== null && _c !== void 0 ? _c : "";
        message.muted = (_d = object.muted) !== null && _d !== void 0 ? _d : false;
        message.width = (_e = object.width) !== null && _e !== void 0 ? _e : 0;
        message.height = (_f = object.height) !== null && _f !== void 0 ? _f : 0;
        message.simulcast = (_g = object.simulcast) !== null && _g !== void 0 ? _g : false;
        message.disableDtx = (_h = object.disableDtx) !== null && _h !== void 0 ? _h : false;
        message.source = (_j = object.source) !== null && _j !== void 0 ? _j : 0;
        message.layers = [];
        if (object.layers !== undefined && object.layers !== null) {
            for (const e of object.layers) {
                message.layers.push(exports.VideoLayer.fromPartial(e));
            }
        }
        message.mimeType = (_k = object.mimeType) !== null && _k !== void 0 ? _k : "";
        message.mid = (_l = object.mid) !== null && _l !== void 0 ? _l : "";
        return message;
    },
};
const baseVideoLayer = {
    quality: 0,
    width: 0,
    height: 0,
    bitrate: 0,
    ssrc: 0,
};
exports.VideoLayer = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.quality !== 0) {
            writer.uint32(8).int32(message.quality);
        }
        if (message.width !== 0) {
            writer.uint32(16).uint32(message.width);
        }
        if (message.height !== 0) {
            writer.uint32(24).uint32(message.height);
        }
        if (message.bitrate !== 0) {
            writer.uint32(32).uint32(message.bitrate);
        }
        if (message.ssrc !== 0) {
            writer.uint32(40).uint32(message.ssrc);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseVideoLayer);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.quality = reader.int32();
                    break;
                case 2:
                    message.width = reader.uint32();
                    break;
                case 3:
                    message.height = reader.uint32();
                    break;
                case 4:
                    message.bitrate = reader.uint32();
                    break;
                case 5:
                    message.ssrc = reader.uint32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseVideoLayer);
        if (object.quality !== undefined && object.quality !== null) {
            message.quality = videoQualityFromJSON(object.quality);
        }
        else {
            message.quality = 0;
        }
        if (object.width !== undefined && object.width !== null) {
            message.width = Number(object.width);
        }
        else {
            message.width = 0;
        }
        if (object.height !== undefined && object.height !== null) {
            message.height = Number(object.height);
        }
        else {
            message.height = 0;
        }
        if (object.bitrate !== undefined && object.bitrate !== null) {
            message.bitrate = Number(object.bitrate);
        }
        else {
            message.bitrate = 0;
        }
        if (object.ssrc !== undefined && object.ssrc !== null) {
            message.ssrc = Number(object.ssrc);
        }
        else {
            message.ssrc = 0;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.quality !== undefined &&
            (obj.quality = videoQualityToJSON(message.quality));
        message.width !== undefined && (obj.width = message.width);
        message.height !== undefined && (obj.height = message.height);
        message.bitrate !== undefined && (obj.bitrate = message.bitrate);
        message.ssrc !== undefined && (obj.ssrc = message.ssrc);
        return obj;
    },
    fromPartial(object) {
        var _a, _b, _c, _d, _e;
        const message = Object.assign({}, baseVideoLayer);
        message.quality = (_a = object.quality) !== null && _a !== void 0 ? _a : 0;
        message.width = (_b = object.width) !== null && _b !== void 0 ? _b : 0;
        message.height = (_c = object.height) !== null && _c !== void 0 ? _c : 0;
        message.bitrate = (_d = object.bitrate) !== null && _d !== void 0 ? _d : 0;
        message.ssrc = (_e = object.ssrc) !== null && _e !== void 0 ? _e : 0;
        return message;
    },
};
const baseDataPacket = { kind: 0 };
exports.DataPacket = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.kind !== 0) {
            writer.uint32(8).int32(message.kind);
        }
        if (message.user !== undefined) {
            exports.UserPacket.encode(message.user, writer.uint32(18).fork()).ldelim();
        }
        if (message.speaker !== undefined) {
            exports.ActiveSpeakerUpdate.encode(message.speaker, writer.uint32(26).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseDataPacket);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.kind = reader.int32();
                    break;
                case 2:
                    message.user = exports.UserPacket.decode(reader, reader.uint32());
                    break;
                case 3:
                    message.speaker = exports.ActiveSpeakerUpdate.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseDataPacket);
        if (object.kind !== undefined && object.kind !== null) {
            message.kind = dataPacket_KindFromJSON(object.kind);
        }
        else {
            message.kind = 0;
        }
        if (object.user !== undefined && object.user !== null) {
            message.user = exports.UserPacket.fromJSON(object.user);
        }
        else {
            message.user = undefined;
        }
        if (object.speaker !== undefined && object.speaker !== null) {
            message.speaker = exports.ActiveSpeakerUpdate.fromJSON(object.speaker);
        }
        else {
            message.speaker = undefined;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.kind !== undefined &&
            (obj.kind = dataPacket_KindToJSON(message.kind));
        message.user !== undefined &&
            (obj.user = message.user ? exports.UserPacket.toJSON(message.user) : undefined);
        message.speaker !== undefined &&
            (obj.speaker = message.speaker
                ? exports.ActiveSpeakerUpdate.toJSON(message.speaker)
                : undefined);
        return obj;
    },
    fromPartial(object) {
        var _a;
        const message = Object.assign({}, baseDataPacket);
        message.kind = (_a = object.kind) !== null && _a !== void 0 ? _a : 0;
        if (object.user !== undefined && object.user !== null) {
            message.user = exports.UserPacket.fromPartial(object.user);
        }
        else {
            message.user = undefined;
        }
        if (object.speaker !== undefined && object.speaker !== null) {
            message.speaker = exports.ActiveSpeakerUpdate.fromPartial(object.speaker);
        }
        else {
            message.speaker = undefined;
        }
        return message;
    },
};
const baseActiveSpeakerUpdate = {};
exports.ActiveSpeakerUpdate = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        for (const v of message.speakers) {
            exports.SpeakerInfo.encode(v, writer.uint32(10).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseActiveSpeakerUpdate);
        message.speakers = [];
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.speakers.push(exports.SpeakerInfo.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseActiveSpeakerUpdate);
        message.speakers = [];
        if (object.speakers !== undefined && object.speakers !== null) {
            for (const e of object.speakers) {
                message.speakers.push(exports.SpeakerInfo.fromJSON(e));
            }
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        if (message.speakers) {
            obj.speakers = message.speakers.map((e) => e ? exports.SpeakerInfo.toJSON(e) : undefined);
        }
        else {
            obj.speakers = [];
        }
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseActiveSpeakerUpdate);
        message.speakers = [];
        if (object.speakers !== undefined && object.speakers !== null) {
            for (const e of object.speakers) {
                message.speakers.push(exports.SpeakerInfo.fromPartial(e));
            }
        }
        return message;
    },
};
const baseSpeakerInfo = { sid: "", level: 0, active: false };
exports.SpeakerInfo = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.sid !== "") {
            writer.uint32(10).string(message.sid);
        }
        if (message.level !== 0) {
            writer.uint32(21).float(message.level);
        }
        if (message.active === true) {
            writer.uint32(24).bool(message.active);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseSpeakerInfo);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.sid = reader.string();
                    break;
                case 2:
                    message.level = reader.float();
                    break;
                case 3:
                    message.active = reader.bool();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseSpeakerInfo);
        if (object.sid !== undefined && object.sid !== null) {
            message.sid = String(object.sid);
        }
        else {
            message.sid = "";
        }
        if (object.level !== undefined && object.level !== null) {
            message.level = Number(object.level);
        }
        else {
            message.level = 0;
        }
        if (object.active !== undefined && object.active !== null) {
            message.active = Boolean(object.active);
        }
        else {
            message.active = false;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.sid !== undefined && (obj.sid = message.sid);
        message.level !== undefined && (obj.level = message.level);
        message.active !== undefined && (obj.active = message.active);
        return obj;
    },
    fromPartial(object) {
        var _a, _b, _c;
        const message = Object.assign({}, baseSpeakerInfo);
        message.sid = (_a = object.sid) !== null && _a !== void 0 ? _a : "";
        message.level = (_b = object.level) !== null && _b !== void 0 ? _b : 0;
        message.active = (_c = object.active) !== null && _c !== void 0 ? _c : false;
        return message;
    },
};
const baseUserPacket = { participantSid: "", destinationSids: "" };
exports.UserPacket = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.participantSid !== "") {
            writer.uint32(10).string(message.participantSid);
        }
        if (message.payload.length !== 0) {
            writer.uint32(18).bytes(message.payload);
        }
        for (const v of message.destinationSids) {
            writer.uint32(26).string(v);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseUserPacket);
        message.destinationSids = [];
        message.payload = new Uint8Array();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.participantSid = reader.string();
                    break;
                case 2:
                    message.payload = reader.bytes();
                    break;
                case 3:
                    message.destinationSids.push(reader.string());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseUserPacket);
        message.destinationSids = [];
        message.payload = new Uint8Array();
        if (object.participantSid !== undefined && object.participantSid !== null) {
            message.participantSid = String(object.participantSid);
        }
        else {
            message.participantSid = "";
        }
        if (object.payload !== undefined && object.payload !== null) {
            message.payload = bytesFromBase64(object.payload);
        }
        if (object.destinationSids !== undefined &&
            object.destinationSids !== null) {
            for (const e of object.destinationSids) {
                message.destinationSids.push(String(e));
            }
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.participantSid !== undefined &&
            (obj.participantSid = message.participantSid);
        message.payload !== undefined &&
            (obj.payload = base64FromBytes(message.payload !== undefined ? message.payload : new Uint8Array()));
        if (message.destinationSids) {
            obj.destinationSids = message.destinationSids.map((e) => e);
        }
        else {
            obj.destinationSids = [];
        }
        return obj;
    },
    fromPartial(object) {
        var _a, _b;
        const message = Object.assign({}, baseUserPacket);
        message.participantSid = (_a = object.participantSid) !== null && _a !== void 0 ? _a : "";
        message.payload = (_b = object.payload) !== null && _b !== void 0 ? _b : new Uint8Array();
        message.destinationSids = [];
        if (object.destinationSids !== undefined &&
            object.destinationSids !== null) {
            for (const e of object.destinationSids) {
                message.destinationSids.push(e);
            }
        }
        return message;
    },
};
const baseParticipantTracks = { participantSid: "", trackSids: "" };
exports.ParticipantTracks = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.participantSid !== "") {
            writer.uint32(10).string(message.participantSid);
        }
        for (const v of message.trackSids) {
            writer.uint32(18).string(v);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseParticipantTracks);
        message.trackSids = [];
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.participantSid = reader.string();
                    break;
                case 2:
                    message.trackSids.push(reader.string());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseParticipantTracks);
        message.trackSids = [];
        if (object.participantSid !== undefined && object.participantSid !== null) {
            message.participantSid = String(object.participantSid);
        }
        else {
            message.participantSid = "";
        }
        if (object.trackSids !== undefined && object.trackSids !== null) {
            for (const e of object.trackSids) {
                message.trackSids.push(String(e));
            }
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.participantSid !== undefined &&
            (obj.participantSid = message.participantSid);
        if (message.trackSids) {
            obj.trackSids = message.trackSids.map((e) => e);
        }
        else {
            obj.trackSids = [];
        }
        return obj;
    },
    fromPartial(object) {
        var _a;
        const message = Object.assign({}, baseParticipantTracks);
        message.participantSid = (_a = object.participantSid) !== null && _a !== void 0 ? _a : "";
        message.trackSids = [];
        if (object.trackSids !== undefined && object.trackSids !== null) {
            for (const e of object.trackSids) {
                message.trackSids.push(e);
            }
        }
        return message;
    },
};
const baseClientInfo = {
    sdk: 0,
    version: "",
    protocol: 0,
    os: "",
    osVersion: "",
    deviceModel: "",
    browser: "",
    browserVersion: "",
};
exports.ClientInfo = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.sdk !== 0) {
            writer.uint32(8).int32(message.sdk);
        }
        if (message.version !== "") {
            writer.uint32(18).string(message.version);
        }
        if (message.protocol !== 0) {
            writer.uint32(24).int32(message.protocol);
        }
        if (message.os !== "") {
            writer.uint32(34).string(message.os);
        }
        if (message.osVersion !== "") {
            writer.uint32(42).string(message.osVersion);
        }
        if (message.deviceModel !== "") {
            writer.uint32(50).string(message.deviceModel);
        }
        if (message.browser !== "") {
            writer.uint32(58).string(message.browser);
        }
        if (message.browserVersion !== "") {
            writer.uint32(66).string(message.browserVersion);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseClientInfo);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.sdk = reader.int32();
                    break;
                case 2:
                    message.version = reader.string();
                    break;
                case 3:
                    message.protocol = reader.int32();
                    break;
                case 4:
                    message.os = reader.string();
                    break;
                case 5:
                    message.osVersion = reader.string();
                    break;
                case 6:
                    message.deviceModel = reader.string();
                    break;
                case 7:
                    message.browser = reader.string();
                    break;
                case 8:
                    message.browserVersion = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseClientInfo);
        if (object.sdk !== undefined && object.sdk !== null) {
            message.sdk = clientInfo_SDKFromJSON(object.sdk);
        }
        else {
            message.sdk = 0;
        }
        if (object.version !== undefined && object.version !== null) {
            message.version = String(object.version);
        }
        else {
            message.version = "";
        }
        if (object.protocol !== undefined && object.protocol !== null) {
            message.protocol = Number(object.protocol);
        }
        else {
            message.protocol = 0;
        }
        if (object.os !== undefined && object.os !== null) {
            message.os = String(object.os);
        }
        else {
            message.os = "";
        }
        if (object.osVersion !== undefined && object.osVersion !== null) {
            message.osVersion = String(object.osVersion);
        }
        else {
            message.osVersion = "";
        }
        if (object.deviceModel !== undefined && object.deviceModel !== null) {
            message.deviceModel = String(object.deviceModel);
        }
        else {
            message.deviceModel = "";
        }
        if (object.browser !== undefined && object.browser !== null) {
            message.browser = String(object.browser);
        }
        else {
            message.browser = "";
        }
        if (object.browserVersion !== undefined && object.browserVersion !== null) {
            message.browserVersion = String(object.browserVersion);
        }
        else {
            message.browserVersion = "";
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.sdk !== undefined && (obj.sdk = clientInfo_SDKToJSON(message.sdk));
        message.version !== undefined && (obj.version = message.version);
        message.protocol !== undefined && (obj.protocol = message.protocol);
        message.os !== undefined && (obj.os = message.os);
        message.osVersion !== undefined && (obj.osVersion = message.osVersion);
        message.deviceModel !== undefined &&
            (obj.deviceModel = message.deviceModel);
        message.browser !== undefined && (obj.browser = message.browser);
        message.browserVersion !== undefined &&
            (obj.browserVersion = message.browserVersion);
        return obj;
    },
    fromPartial(object) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        const message = Object.assign({}, baseClientInfo);
        message.sdk = (_a = object.sdk) !== null && _a !== void 0 ? _a : 0;
        message.version = (_b = object.version) !== null && _b !== void 0 ? _b : "";
        message.protocol = (_c = object.protocol) !== null && _c !== void 0 ? _c : 0;
        message.os = (_d = object.os) !== null && _d !== void 0 ? _d : "";
        message.osVersion = (_e = object.osVersion) !== null && _e !== void 0 ? _e : "";
        message.deviceModel = (_f = object.deviceModel) !== null && _f !== void 0 ? _f : "";
        message.browser = (_g = object.browser) !== null && _g !== void 0 ? _g : "";
        message.browserVersion = (_h = object.browserVersion) !== null && _h !== void 0 ? _h : "";
        return message;
    },
};
var globalThis = (() => {
    if (typeof globalThis !== "undefined")
        return globalThis;
    if (typeof self !== "undefined")
        return self;
    if (typeof window !== "undefined")
        return window;
    if (typeof __webpack_require__.g !== "undefined")
        return __webpack_require__.g;
    throw "Unable to locate global object";
})();
const atob = globalThis.atob ||
    ((b64) => globalThis.Buffer.from(b64, "base64").toString("binary"));
function bytesFromBase64(b64) {
    const bin = atob(b64);
    const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; ++i) {
        arr[i] = bin.charCodeAt(i);
    }
    return arr;
}
const btoa = globalThis.btoa ||
    ((bin) => globalThis.Buffer.from(bin, "binary").toString("base64"));
function base64FromBytes(arr) {
    const bin = [];
    for (const byte of arr) {
        bin.push(String.fromCharCode(byte));
    }
    return btoa(bin.join(""));
}
function longToNumber(long) {
    if (long.gt(Number.MAX_SAFE_INTEGER)) {
        throw new globalThis.Error("Value is larger than Number.MAX_SAFE_INTEGER");
    }
    return long.toNumber();
}
if (minimal_1.default.util.Long !== long_1.default) {
    minimal_1.default.util.Long = long_1.default;
    minimal_1.default.configure();
}
//# sourceMappingURL=livekit_models.js.map

/***/ }),

/***/ 4658:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SimulateScenario = exports.SyncState = exports.SubscriptionPermissionUpdate = exports.SubscriptionPermission = exports.TrackPermission = exports.SubscribedQualityUpdate = exports.SubscribedQuality = exports.StreamStateUpdate = exports.StreamStateInfo = exports.ConnectionQualityUpdate = exports.ConnectionQualityInfo = exports.RoomUpdate = exports.SpeakersChanged = exports.ICEServer = exports.UpdateVideoLayers = exports.LeaveRequest = exports.UpdateTrackSettings = exports.UpdateSubscription = exports.ParticipantUpdate = exports.SessionDescription = exports.TrackPublishedResponse = exports.JoinResponse = exports.MuteTrackRequest = exports.TrickleRequest = exports.AddTrackRequest = exports.SignalResponse = exports.SignalRequest = exports.streamStateToJSON = exports.streamStateFromJSON = exports.StreamState = exports.signalTargetToJSON = exports.signalTargetFromJSON = exports.SignalTarget = exports.protobufPackage = void 0;
/* eslint-disable */
const long_1 = __importDefault(__webpack_require__(3720));
const minimal_1 = __importDefault(__webpack_require__(2100));
const livekit_models_1 = __webpack_require__(8983);
exports.protobufPackage = "livekit";
var SignalTarget;
(function (SignalTarget) {
    SignalTarget[SignalTarget["PUBLISHER"] = 0] = "PUBLISHER";
    SignalTarget[SignalTarget["SUBSCRIBER"] = 1] = "SUBSCRIBER";
    SignalTarget[SignalTarget["UNRECOGNIZED"] = -1] = "UNRECOGNIZED";
})(SignalTarget = exports.SignalTarget || (exports.SignalTarget = {}));
function signalTargetFromJSON(object) {
    switch (object) {
        case 0:
        case "PUBLISHER":
            return SignalTarget.PUBLISHER;
        case 1:
        case "SUBSCRIBER":
            return SignalTarget.SUBSCRIBER;
        case -1:
        case "UNRECOGNIZED":
        default:
            return SignalTarget.UNRECOGNIZED;
    }
}
exports.signalTargetFromJSON = signalTargetFromJSON;
function signalTargetToJSON(object) {
    switch (object) {
        case SignalTarget.PUBLISHER:
            return "PUBLISHER";
        case SignalTarget.SUBSCRIBER:
            return "SUBSCRIBER";
        default:
            return "UNKNOWN";
    }
}
exports.signalTargetToJSON = signalTargetToJSON;
var StreamState;
(function (StreamState) {
    StreamState[StreamState["ACTIVE"] = 0] = "ACTIVE";
    StreamState[StreamState["PAUSED"] = 1] = "PAUSED";
    StreamState[StreamState["UNRECOGNIZED"] = -1] = "UNRECOGNIZED";
})(StreamState = exports.StreamState || (exports.StreamState = {}));
function streamStateFromJSON(object) {
    switch (object) {
        case 0:
        case "ACTIVE":
            return StreamState.ACTIVE;
        case 1:
        case "PAUSED":
            return StreamState.PAUSED;
        case -1:
        case "UNRECOGNIZED":
        default:
            return StreamState.UNRECOGNIZED;
    }
}
exports.streamStateFromJSON = streamStateFromJSON;
function streamStateToJSON(object) {
    switch (object) {
        case StreamState.ACTIVE:
            return "ACTIVE";
        case StreamState.PAUSED:
            return "PAUSED";
        default:
            return "UNKNOWN";
    }
}
exports.streamStateToJSON = streamStateToJSON;
const baseSignalRequest = {};
exports.SignalRequest = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.offer !== undefined) {
            exports.SessionDescription.encode(message.offer, writer.uint32(10).fork()).ldelim();
        }
        if (message.answer !== undefined) {
            exports.SessionDescription.encode(message.answer, writer.uint32(18).fork()).ldelim();
        }
        if (message.trickle !== undefined) {
            exports.TrickleRequest.encode(message.trickle, writer.uint32(26).fork()).ldelim();
        }
        if (message.addTrack !== undefined) {
            exports.AddTrackRequest.encode(message.addTrack, writer.uint32(34).fork()).ldelim();
        }
        if (message.mute !== undefined) {
            exports.MuteTrackRequest.encode(message.mute, writer.uint32(42).fork()).ldelim();
        }
        if (message.subscription !== undefined) {
            exports.UpdateSubscription.encode(message.subscription, writer.uint32(50).fork()).ldelim();
        }
        if (message.trackSetting !== undefined) {
            exports.UpdateTrackSettings.encode(message.trackSetting, writer.uint32(58).fork()).ldelim();
        }
        if (message.leave !== undefined) {
            exports.LeaveRequest.encode(message.leave, writer.uint32(66).fork()).ldelim();
        }
        if (message.updateLayers !== undefined) {
            exports.UpdateVideoLayers.encode(message.updateLayers, writer.uint32(82).fork()).ldelim();
        }
        if (message.subscriptionPermission !== undefined) {
            exports.SubscriptionPermission.encode(message.subscriptionPermission, writer.uint32(90).fork()).ldelim();
        }
        if (message.syncState !== undefined) {
            exports.SyncState.encode(message.syncState, writer.uint32(98).fork()).ldelim();
        }
        if (message.simulate !== undefined) {
            exports.SimulateScenario.encode(message.simulate, writer.uint32(106).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseSignalRequest);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.offer = exports.SessionDescription.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.answer = exports.SessionDescription.decode(reader, reader.uint32());
                    break;
                case 3:
                    message.trickle = exports.TrickleRequest.decode(reader, reader.uint32());
                    break;
                case 4:
                    message.addTrack = exports.AddTrackRequest.decode(reader, reader.uint32());
                    break;
                case 5:
                    message.mute = exports.MuteTrackRequest.decode(reader, reader.uint32());
                    break;
                case 6:
                    message.subscription = exports.UpdateSubscription.decode(reader, reader.uint32());
                    break;
                case 7:
                    message.trackSetting = exports.UpdateTrackSettings.decode(reader, reader.uint32());
                    break;
                case 8:
                    message.leave = exports.LeaveRequest.decode(reader, reader.uint32());
                    break;
                case 10:
                    message.updateLayers = exports.UpdateVideoLayers.decode(reader, reader.uint32());
                    break;
                case 11:
                    message.subscriptionPermission = exports.SubscriptionPermission.decode(reader, reader.uint32());
                    break;
                case 12:
                    message.syncState = exports.SyncState.decode(reader, reader.uint32());
                    break;
                case 13:
                    message.simulate = exports.SimulateScenario.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseSignalRequest);
        if (object.offer !== undefined && object.offer !== null) {
            message.offer = exports.SessionDescription.fromJSON(object.offer);
        }
        else {
            message.offer = undefined;
        }
        if (object.answer !== undefined && object.answer !== null) {
            message.answer = exports.SessionDescription.fromJSON(object.answer);
        }
        else {
            message.answer = undefined;
        }
        if (object.trickle !== undefined && object.trickle !== null) {
            message.trickle = exports.TrickleRequest.fromJSON(object.trickle);
        }
        else {
            message.trickle = undefined;
        }
        if (object.addTrack !== undefined && object.addTrack !== null) {
            message.addTrack = exports.AddTrackRequest.fromJSON(object.addTrack);
        }
        else {
            message.addTrack = undefined;
        }
        if (object.mute !== undefined && object.mute !== null) {
            message.mute = exports.MuteTrackRequest.fromJSON(object.mute);
        }
        else {
            message.mute = undefined;
        }
        if (object.subscription !== undefined && object.subscription !== null) {
            message.subscription = exports.UpdateSubscription.fromJSON(object.subscription);
        }
        else {
            message.subscription = undefined;
        }
        if (object.trackSetting !== undefined && object.trackSetting !== null) {
            message.trackSetting = exports.UpdateTrackSettings.fromJSON(object.trackSetting);
        }
        else {
            message.trackSetting = undefined;
        }
        if (object.leave !== undefined && object.leave !== null) {
            message.leave = exports.LeaveRequest.fromJSON(object.leave);
        }
        else {
            message.leave = undefined;
        }
        if (object.updateLayers !== undefined && object.updateLayers !== null) {
            message.updateLayers = exports.UpdateVideoLayers.fromJSON(object.updateLayers);
        }
        else {
            message.updateLayers = undefined;
        }
        if (object.subscriptionPermission !== undefined &&
            object.subscriptionPermission !== null) {
            message.subscriptionPermission = exports.SubscriptionPermission.fromJSON(object.subscriptionPermission);
        }
        else {
            message.subscriptionPermission = undefined;
        }
        if (object.syncState !== undefined && object.syncState !== null) {
            message.syncState = exports.SyncState.fromJSON(object.syncState);
        }
        else {
            message.syncState = undefined;
        }
        if (object.simulate !== undefined && object.simulate !== null) {
            message.simulate = exports.SimulateScenario.fromJSON(object.simulate);
        }
        else {
            message.simulate = undefined;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.offer !== undefined &&
            (obj.offer = message.offer
                ? exports.SessionDescription.toJSON(message.offer)
                : undefined);
        message.answer !== undefined &&
            (obj.answer = message.answer
                ? exports.SessionDescription.toJSON(message.answer)
                : undefined);
        message.trickle !== undefined &&
            (obj.trickle = message.trickle
                ? exports.TrickleRequest.toJSON(message.trickle)
                : undefined);
        message.addTrack !== undefined &&
            (obj.addTrack = message.addTrack
                ? exports.AddTrackRequest.toJSON(message.addTrack)
                : undefined);
        message.mute !== undefined &&
            (obj.mute = message.mute
                ? exports.MuteTrackRequest.toJSON(message.mute)
                : undefined);
        message.subscription !== undefined &&
            (obj.subscription = message.subscription
                ? exports.UpdateSubscription.toJSON(message.subscription)
                : undefined);
        message.trackSetting !== undefined &&
            (obj.trackSetting = message.trackSetting
                ? exports.UpdateTrackSettings.toJSON(message.trackSetting)
                : undefined);
        message.leave !== undefined &&
            (obj.leave = message.leave
                ? exports.LeaveRequest.toJSON(message.leave)
                : undefined);
        message.updateLayers !== undefined &&
            (obj.updateLayers = message.updateLayers
                ? exports.UpdateVideoLayers.toJSON(message.updateLayers)
                : undefined);
        message.subscriptionPermission !== undefined &&
            (obj.subscriptionPermission = message.subscriptionPermission
                ? exports.SubscriptionPermission.toJSON(message.subscriptionPermission)
                : undefined);
        message.syncState !== undefined &&
            (obj.syncState = message.syncState
                ? exports.SyncState.toJSON(message.syncState)
                : undefined);
        message.simulate !== undefined &&
            (obj.simulate = message.simulate
                ? exports.SimulateScenario.toJSON(message.simulate)
                : undefined);
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseSignalRequest);
        if (object.offer !== undefined && object.offer !== null) {
            message.offer = exports.SessionDescription.fromPartial(object.offer);
        }
        else {
            message.offer = undefined;
        }
        if (object.answer !== undefined && object.answer !== null) {
            message.answer = exports.SessionDescription.fromPartial(object.answer);
        }
        else {
            message.answer = undefined;
        }
        if (object.trickle !== undefined && object.trickle !== null) {
            message.trickle = exports.TrickleRequest.fromPartial(object.trickle);
        }
        else {
            message.trickle = undefined;
        }
        if (object.addTrack !== undefined && object.addTrack !== null) {
            message.addTrack = exports.AddTrackRequest.fromPartial(object.addTrack);
        }
        else {
            message.addTrack = undefined;
        }
        if (object.mute !== undefined && object.mute !== null) {
            message.mute = exports.MuteTrackRequest.fromPartial(object.mute);
        }
        else {
            message.mute = undefined;
        }
        if (object.subscription !== undefined && object.subscription !== null) {
            message.subscription = exports.UpdateSubscription.fromPartial(object.subscription);
        }
        else {
            message.subscription = undefined;
        }
        if (object.trackSetting !== undefined && object.trackSetting !== null) {
            message.trackSetting = exports.UpdateTrackSettings.fromPartial(object.trackSetting);
        }
        else {
            message.trackSetting = undefined;
        }
        if (object.leave !== undefined && object.leave !== null) {
            message.leave = exports.LeaveRequest.fromPartial(object.leave);
        }
        else {
            message.leave = undefined;
        }
        if (object.updateLayers !== undefined && object.updateLayers !== null) {
            message.updateLayers = exports.UpdateVideoLayers.fromPartial(object.updateLayers);
        }
        else {
            message.updateLayers = undefined;
        }
        if (object.subscriptionPermission !== undefined &&
            object.subscriptionPermission !== null) {
            message.subscriptionPermission = exports.SubscriptionPermission.fromPartial(object.subscriptionPermission);
        }
        else {
            message.subscriptionPermission = undefined;
        }
        if (object.syncState !== undefined && object.syncState !== null) {
            message.syncState = exports.SyncState.fromPartial(object.syncState);
        }
        else {
            message.syncState = undefined;
        }
        if (object.simulate !== undefined && object.simulate !== null) {
            message.simulate = exports.SimulateScenario.fromPartial(object.simulate);
        }
        else {
            message.simulate = undefined;
        }
        return message;
    },
};
const baseSignalResponse = {};
exports.SignalResponse = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.join !== undefined) {
            exports.JoinResponse.encode(message.join, writer.uint32(10).fork()).ldelim();
        }
        if (message.answer !== undefined) {
            exports.SessionDescription.encode(message.answer, writer.uint32(18).fork()).ldelim();
        }
        if (message.offer !== undefined) {
            exports.SessionDescription.encode(message.offer, writer.uint32(26).fork()).ldelim();
        }
        if (message.trickle !== undefined) {
            exports.TrickleRequest.encode(message.trickle, writer.uint32(34).fork()).ldelim();
        }
        if (message.update !== undefined) {
            exports.ParticipantUpdate.encode(message.update, writer.uint32(42).fork()).ldelim();
        }
        if (message.trackPublished !== undefined) {
            exports.TrackPublishedResponse.encode(message.trackPublished, writer.uint32(50).fork()).ldelim();
        }
        if (message.leave !== undefined) {
            exports.LeaveRequest.encode(message.leave, writer.uint32(66).fork()).ldelim();
        }
        if (message.mute !== undefined) {
            exports.MuteTrackRequest.encode(message.mute, writer.uint32(74).fork()).ldelim();
        }
        if (message.speakersChanged !== undefined) {
            exports.SpeakersChanged.encode(message.speakersChanged, writer.uint32(82).fork()).ldelim();
        }
        if (message.roomUpdate !== undefined) {
            exports.RoomUpdate.encode(message.roomUpdate, writer.uint32(90).fork()).ldelim();
        }
        if (message.connectionQuality !== undefined) {
            exports.ConnectionQualityUpdate.encode(message.connectionQuality, writer.uint32(98).fork()).ldelim();
        }
        if (message.streamStateUpdate !== undefined) {
            exports.StreamStateUpdate.encode(message.streamStateUpdate, writer.uint32(106).fork()).ldelim();
        }
        if (message.subscribedQualityUpdate !== undefined) {
            exports.SubscribedQualityUpdate.encode(message.subscribedQualityUpdate, writer.uint32(114).fork()).ldelim();
        }
        if (message.subscriptionPermissionUpdate !== undefined) {
            exports.SubscriptionPermissionUpdate.encode(message.subscriptionPermissionUpdate, writer.uint32(122).fork()).ldelim();
        }
        if (message.refreshToken !== undefined) {
            writer.uint32(130).string(message.refreshToken);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseSignalResponse);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.join = exports.JoinResponse.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.answer = exports.SessionDescription.decode(reader, reader.uint32());
                    break;
                case 3:
                    message.offer = exports.SessionDescription.decode(reader, reader.uint32());
                    break;
                case 4:
                    message.trickle = exports.TrickleRequest.decode(reader, reader.uint32());
                    break;
                case 5:
                    message.update = exports.ParticipantUpdate.decode(reader, reader.uint32());
                    break;
                case 6:
                    message.trackPublished = exports.TrackPublishedResponse.decode(reader, reader.uint32());
                    break;
                case 8:
                    message.leave = exports.LeaveRequest.decode(reader, reader.uint32());
                    break;
                case 9:
                    message.mute = exports.MuteTrackRequest.decode(reader, reader.uint32());
                    break;
                case 10:
                    message.speakersChanged = exports.SpeakersChanged.decode(reader, reader.uint32());
                    break;
                case 11:
                    message.roomUpdate = exports.RoomUpdate.decode(reader, reader.uint32());
                    break;
                case 12:
                    message.connectionQuality = exports.ConnectionQualityUpdate.decode(reader, reader.uint32());
                    break;
                case 13:
                    message.streamStateUpdate = exports.StreamStateUpdate.decode(reader, reader.uint32());
                    break;
                case 14:
                    message.subscribedQualityUpdate = exports.SubscribedQualityUpdate.decode(reader, reader.uint32());
                    break;
                case 15:
                    message.subscriptionPermissionUpdate =
                        exports.SubscriptionPermissionUpdate.decode(reader, reader.uint32());
                    break;
                case 16:
                    message.refreshToken = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseSignalResponse);
        if (object.join !== undefined && object.join !== null) {
            message.join = exports.JoinResponse.fromJSON(object.join);
        }
        else {
            message.join = undefined;
        }
        if (object.answer !== undefined && object.answer !== null) {
            message.answer = exports.SessionDescription.fromJSON(object.answer);
        }
        else {
            message.answer = undefined;
        }
        if (object.offer !== undefined && object.offer !== null) {
            message.offer = exports.SessionDescription.fromJSON(object.offer);
        }
        else {
            message.offer = undefined;
        }
        if (object.trickle !== undefined && object.trickle !== null) {
            message.trickle = exports.TrickleRequest.fromJSON(object.trickle);
        }
        else {
            message.trickle = undefined;
        }
        if (object.update !== undefined && object.update !== null) {
            message.update = exports.ParticipantUpdate.fromJSON(object.update);
        }
        else {
            message.update = undefined;
        }
        if (object.trackPublished !== undefined && object.trackPublished !== null) {
            message.trackPublished = exports.TrackPublishedResponse.fromJSON(object.trackPublished);
        }
        else {
            message.trackPublished = undefined;
        }
        if (object.leave !== undefined && object.leave !== null) {
            message.leave = exports.LeaveRequest.fromJSON(object.leave);
        }
        else {
            message.leave = undefined;
        }
        if (object.mute !== undefined && object.mute !== null) {
            message.mute = exports.MuteTrackRequest.fromJSON(object.mute);
        }
        else {
            message.mute = undefined;
        }
        if (object.speakersChanged !== undefined &&
            object.speakersChanged !== null) {
            message.speakersChanged = exports.SpeakersChanged.fromJSON(object.speakersChanged);
        }
        else {
            message.speakersChanged = undefined;
        }
        if (object.roomUpdate !== undefined && object.roomUpdate !== null) {
            message.roomUpdate = exports.RoomUpdate.fromJSON(object.roomUpdate);
        }
        else {
            message.roomUpdate = undefined;
        }
        if (object.connectionQuality !== undefined &&
            object.connectionQuality !== null) {
            message.connectionQuality = exports.ConnectionQualityUpdate.fromJSON(object.connectionQuality);
        }
        else {
            message.connectionQuality = undefined;
        }
        if (object.streamStateUpdate !== undefined &&
            object.streamStateUpdate !== null) {
            message.streamStateUpdate = exports.StreamStateUpdate.fromJSON(object.streamStateUpdate);
        }
        else {
            message.streamStateUpdate = undefined;
        }
        if (object.subscribedQualityUpdate !== undefined &&
            object.subscribedQualityUpdate !== null) {
            message.subscribedQualityUpdate = exports.SubscribedQualityUpdate.fromJSON(object.subscribedQualityUpdate);
        }
        else {
            message.subscribedQualityUpdate = undefined;
        }
        if (object.subscriptionPermissionUpdate !== undefined &&
            object.subscriptionPermissionUpdate !== null) {
            message.subscriptionPermissionUpdate =
                exports.SubscriptionPermissionUpdate.fromJSON(object.subscriptionPermissionUpdate);
        }
        else {
            message.subscriptionPermissionUpdate = undefined;
        }
        if (object.refreshToken !== undefined && object.refreshToken !== null) {
            message.refreshToken = String(object.refreshToken);
        }
        else {
            message.refreshToken = undefined;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.join !== undefined &&
            (obj.join = message.join ? exports.JoinResponse.toJSON(message.join) : undefined);
        message.answer !== undefined &&
            (obj.answer = message.answer
                ? exports.SessionDescription.toJSON(message.answer)
                : undefined);
        message.offer !== undefined &&
            (obj.offer = message.offer
                ? exports.SessionDescription.toJSON(message.offer)
                : undefined);
        message.trickle !== undefined &&
            (obj.trickle = message.trickle
                ? exports.TrickleRequest.toJSON(message.trickle)
                : undefined);
        message.update !== undefined &&
            (obj.update = message.update
                ? exports.ParticipantUpdate.toJSON(message.update)
                : undefined);
        message.trackPublished !== undefined &&
            (obj.trackPublished = message.trackPublished
                ? exports.TrackPublishedResponse.toJSON(message.trackPublished)
                : undefined);
        message.leave !== undefined &&
            (obj.leave = message.leave
                ? exports.LeaveRequest.toJSON(message.leave)
                : undefined);
        message.mute !== undefined &&
            (obj.mute = message.mute
                ? exports.MuteTrackRequest.toJSON(message.mute)
                : undefined);
        message.speakersChanged !== undefined &&
            (obj.speakersChanged = message.speakersChanged
                ? exports.SpeakersChanged.toJSON(message.speakersChanged)
                : undefined);
        message.roomUpdate !== undefined &&
            (obj.roomUpdate = message.roomUpdate
                ? exports.RoomUpdate.toJSON(message.roomUpdate)
                : undefined);
        message.connectionQuality !== undefined &&
            (obj.connectionQuality = message.connectionQuality
                ? exports.ConnectionQualityUpdate.toJSON(message.connectionQuality)
                : undefined);
        message.streamStateUpdate !== undefined &&
            (obj.streamStateUpdate = message.streamStateUpdate
                ? exports.StreamStateUpdate.toJSON(message.streamStateUpdate)
                : undefined);
        message.subscribedQualityUpdate !== undefined &&
            (obj.subscribedQualityUpdate = message.subscribedQualityUpdate
                ? exports.SubscribedQualityUpdate.toJSON(message.subscribedQualityUpdate)
                : undefined);
        message.subscriptionPermissionUpdate !== undefined &&
            (obj.subscriptionPermissionUpdate = message.subscriptionPermissionUpdate
                ? exports.SubscriptionPermissionUpdate.toJSON(message.subscriptionPermissionUpdate)
                : undefined);
        message.refreshToken !== undefined &&
            (obj.refreshToken = message.refreshToken);
        return obj;
    },
    fromPartial(object) {
        var _a;
        const message = Object.assign({}, baseSignalResponse);
        if (object.join !== undefined && object.join !== null) {
            message.join = exports.JoinResponse.fromPartial(object.join);
        }
        else {
            message.join = undefined;
        }
        if (object.answer !== undefined && object.answer !== null) {
            message.answer = exports.SessionDescription.fromPartial(object.answer);
        }
        else {
            message.answer = undefined;
        }
        if (object.offer !== undefined && object.offer !== null) {
            message.offer = exports.SessionDescription.fromPartial(object.offer);
        }
        else {
            message.offer = undefined;
        }
        if (object.trickle !== undefined && object.trickle !== null) {
            message.trickle = exports.TrickleRequest.fromPartial(object.trickle);
        }
        else {
            message.trickle = undefined;
        }
        if (object.update !== undefined && object.update !== null) {
            message.update = exports.ParticipantUpdate.fromPartial(object.update);
        }
        else {
            message.update = undefined;
        }
        if (object.trackPublished !== undefined && object.trackPublished !== null) {
            message.trackPublished = exports.TrackPublishedResponse.fromPartial(object.trackPublished);
        }
        else {
            message.trackPublished = undefined;
        }
        if (object.leave !== undefined && object.leave !== null) {
            message.leave = exports.LeaveRequest.fromPartial(object.leave);
        }
        else {
            message.leave = undefined;
        }
        if (object.mute !== undefined && object.mute !== null) {
            message.mute = exports.MuteTrackRequest.fromPartial(object.mute);
        }
        else {
            message.mute = undefined;
        }
        if (object.speakersChanged !== undefined &&
            object.speakersChanged !== null) {
            message.speakersChanged = exports.SpeakersChanged.fromPartial(object.speakersChanged);
        }
        else {
            message.speakersChanged = undefined;
        }
        if (object.roomUpdate !== undefined && object.roomUpdate !== null) {
            message.roomUpdate = exports.RoomUpdate.fromPartial(object.roomUpdate);
        }
        else {
            message.roomUpdate = undefined;
        }
        if (object.connectionQuality !== undefined &&
            object.connectionQuality !== null) {
            message.connectionQuality = exports.ConnectionQualityUpdate.fromPartial(object.connectionQuality);
        }
        else {
            message.connectionQuality = undefined;
        }
        if (object.streamStateUpdate !== undefined &&
            object.streamStateUpdate !== null) {
            message.streamStateUpdate = exports.StreamStateUpdate.fromPartial(object.streamStateUpdate);
        }
        else {
            message.streamStateUpdate = undefined;
        }
        if (object.subscribedQualityUpdate !== undefined &&
            object.subscribedQualityUpdate !== null) {
            message.subscribedQualityUpdate = exports.SubscribedQualityUpdate.fromPartial(object.subscribedQualityUpdate);
        }
        else {
            message.subscribedQualityUpdate = undefined;
        }
        if (object.subscriptionPermissionUpdate !== undefined &&
            object.subscriptionPermissionUpdate !== null) {
            message.subscriptionPermissionUpdate =
                exports.SubscriptionPermissionUpdate.fromPartial(object.subscriptionPermissionUpdate);
        }
        else {
            message.subscriptionPermissionUpdate = undefined;
        }
        message.refreshToken = (_a = object.refreshToken) !== null && _a !== void 0 ? _a : undefined;
        return message;
    },
};
const baseAddTrackRequest = {
    cid: "",
    name: "",
    type: 0,
    width: 0,
    height: 0,
    muted: false,
    disableDtx: false,
    source: 0,
};
exports.AddTrackRequest = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.cid !== "") {
            writer.uint32(10).string(message.cid);
        }
        if (message.name !== "") {
            writer.uint32(18).string(message.name);
        }
        if (message.type !== 0) {
            writer.uint32(24).int32(message.type);
        }
        if (message.width !== 0) {
            writer.uint32(32).uint32(message.width);
        }
        if (message.height !== 0) {
            writer.uint32(40).uint32(message.height);
        }
        if (message.muted === true) {
            writer.uint32(48).bool(message.muted);
        }
        if (message.disableDtx === true) {
            writer.uint32(56).bool(message.disableDtx);
        }
        if (message.source !== 0) {
            writer.uint32(64).int32(message.source);
        }
        for (const v of message.layers) {
            livekit_models_1.VideoLayer.encode(v, writer.uint32(74).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseAddTrackRequest);
        message.layers = [];
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.cid = reader.string();
                    break;
                case 2:
                    message.name = reader.string();
                    break;
                case 3:
                    message.type = reader.int32();
                    break;
                case 4:
                    message.width = reader.uint32();
                    break;
                case 5:
                    message.height = reader.uint32();
                    break;
                case 6:
                    message.muted = reader.bool();
                    break;
                case 7:
                    message.disableDtx = reader.bool();
                    break;
                case 8:
                    message.source = reader.int32();
                    break;
                case 9:
                    message.layers.push(livekit_models_1.VideoLayer.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseAddTrackRequest);
        message.layers = [];
        if (object.cid !== undefined && object.cid !== null) {
            message.cid = String(object.cid);
        }
        else {
            message.cid = "";
        }
        if (object.name !== undefined && object.name !== null) {
            message.name = String(object.name);
        }
        else {
            message.name = "";
        }
        if (object.type !== undefined && object.type !== null) {
            message.type = livekit_models_1.trackTypeFromJSON(object.type);
        }
        else {
            message.type = 0;
        }
        if (object.width !== undefined && object.width !== null) {
            message.width = Number(object.width);
        }
        else {
            message.width = 0;
        }
        if (object.height !== undefined && object.height !== null) {
            message.height = Number(object.height);
        }
        else {
            message.height = 0;
        }
        if (object.muted !== undefined && object.muted !== null) {
            message.muted = Boolean(object.muted);
        }
        else {
            message.muted = false;
        }
        if (object.disableDtx !== undefined && object.disableDtx !== null) {
            message.disableDtx = Boolean(object.disableDtx);
        }
        else {
            message.disableDtx = false;
        }
        if (object.source !== undefined && object.source !== null) {
            message.source = livekit_models_1.trackSourceFromJSON(object.source);
        }
        else {
            message.source = 0;
        }
        if (object.layers !== undefined && object.layers !== null) {
            for (const e of object.layers) {
                message.layers.push(livekit_models_1.VideoLayer.fromJSON(e));
            }
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.cid !== undefined && (obj.cid = message.cid);
        message.name !== undefined && (obj.name = message.name);
        message.type !== undefined && (obj.type = livekit_models_1.trackTypeToJSON(message.type));
        message.width !== undefined && (obj.width = message.width);
        message.height !== undefined && (obj.height = message.height);
        message.muted !== undefined && (obj.muted = message.muted);
        message.disableDtx !== undefined && (obj.disableDtx = message.disableDtx);
        message.source !== undefined &&
            (obj.source = livekit_models_1.trackSourceToJSON(message.source));
        if (message.layers) {
            obj.layers = message.layers.map((e) => e ? livekit_models_1.VideoLayer.toJSON(e) : undefined);
        }
        else {
            obj.layers = [];
        }
        return obj;
    },
    fromPartial(object) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        const message = Object.assign({}, baseAddTrackRequest);
        message.cid = (_a = object.cid) !== null && _a !== void 0 ? _a : "";
        message.name = (_b = object.name) !== null && _b !== void 0 ? _b : "";
        message.type = (_c = object.type) !== null && _c !== void 0 ? _c : 0;
        message.width = (_d = object.width) !== null && _d !== void 0 ? _d : 0;
        message.height = (_e = object.height) !== null && _e !== void 0 ? _e : 0;
        message.muted = (_f = object.muted) !== null && _f !== void 0 ? _f : false;
        message.disableDtx = (_g = object.disableDtx) !== null && _g !== void 0 ? _g : false;
        message.source = (_h = object.source) !== null && _h !== void 0 ? _h : 0;
        message.layers = [];
        if (object.layers !== undefined && object.layers !== null) {
            for (const e of object.layers) {
                message.layers.push(livekit_models_1.VideoLayer.fromPartial(e));
            }
        }
        return message;
    },
};
const baseTrickleRequest = { candidateInit: "", target: 0 };
exports.TrickleRequest = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.candidateInit !== "") {
            writer.uint32(10).string(message.candidateInit);
        }
        if (message.target !== 0) {
            writer.uint32(16).int32(message.target);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseTrickleRequest);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.candidateInit = reader.string();
                    break;
                case 2:
                    message.target = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseTrickleRequest);
        if (object.candidateInit !== undefined && object.candidateInit !== null) {
            message.candidateInit = String(object.candidateInit);
        }
        else {
            message.candidateInit = "";
        }
        if (object.target !== undefined && object.target !== null) {
            message.target = signalTargetFromJSON(object.target);
        }
        else {
            message.target = 0;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.candidateInit !== undefined &&
            (obj.candidateInit = message.candidateInit);
        message.target !== undefined &&
            (obj.target = signalTargetToJSON(message.target));
        return obj;
    },
    fromPartial(object) {
        var _a, _b;
        const message = Object.assign({}, baseTrickleRequest);
        message.candidateInit = (_a = object.candidateInit) !== null && _a !== void 0 ? _a : "";
        message.target = (_b = object.target) !== null && _b !== void 0 ? _b : 0;
        return message;
    },
};
const baseMuteTrackRequest = { sid: "", muted: false };
exports.MuteTrackRequest = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.sid !== "") {
            writer.uint32(10).string(message.sid);
        }
        if (message.muted === true) {
            writer.uint32(16).bool(message.muted);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseMuteTrackRequest);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.sid = reader.string();
                    break;
                case 2:
                    message.muted = reader.bool();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseMuteTrackRequest);
        if (object.sid !== undefined && object.sid !== null) {
            message.sid = String(object.sid);
        }
        else {
            message.sid = "";
        }
        if (object.muted !== undefined && object.muted !== null) {
            message.muted = Boolean(object.muted);
        }
        else {
            message.muted = false;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.sid !== undefined && (obj.sid = message.sid);
        message.muted !== undefined && (obj.muted = message.muted);
        return obj;
    },
    fromPartial(object) {
        var _a, _b;
        const message = Object.assign({}, baseMuteTrackRequest);
        message.sid = (_a = object.sid) !== null && _a !== void 0 ? _a : "";
        message.muted = (_b = object.muted) !== null && _b !== void 0 ? _b : false;
        return message;
    },
};
const baseJoinResponse = {
    serverVersion: "",
    subscriberPrimary: false,
    alternativeUrl: "",
};
exports.JoinResponse = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.room !== undefined) {
            livekit_models_1.Room.encode(message.room, writer.uint32(10).fork()).ldelim();
        }
        if (message.participant !== undefined) {
            livekit_models_1.ParticipantInfo.encode(message.participant, writer.uint32(18).fork()).ldelim();
        }
        for (const v of message.otherParticipants) {
            livekit_models_1.ParticipantInfo.encode(v, writer.uint32(26).fork()).ldelim();
        }
        if (message.serverVersion !== "") {
            writer.uint32(34).string(message.serverVersion);
        }
        for (const v of message.iceServers) {
            exports.ICEServer.encode(v, writer.uint32(42).fork()).ldelim();
        }
        if (message.subscriberPrimary === true) {
            writer.uint32(48).bool(message.subscriberPrimary);
        }
        if (message.alternativeUrl !== "") {
            writer.uint32(58).string(message.alternativeUrl);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseJoinResponse);
        message.otherParticipants = [];
        message.iceServers = [];
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.room = livekit_models_1.Room.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.participant = livekit_models_1.ParticipantInfo.decode(reader, reader.uint32());
                    break;
                case 3:
                    message.otherParticipants.push(livekit_models_1.ParticipantInfo.decode(reader, reader.uint32()));
                    break;
                case 4:
                    message.serverVersion = reader.string();
                    break;
                case 5:
                    message.iceServers.push(exports.ICEServer.decode(reader, reader.uint32()));
                    break;
                case 6:
                    message.subscriberPrimary = reader.bool();
                    break;
                case 7:
                    message.alternativeUrl = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseJoinResponse);
        message.otherParticipants = [];
        message.iceServers = [];
        if (object.room !== undefined && object.room !== null) {
            message.room = livekit_models_1.Room.fromJSON(object.room);
        }
        else {
            message.room = undefined;
        }
        if (object.participant !== undefined && object.participant !== null) {
            message.participant = livekit_models_1.ParticipantInfo.fromJSON(object.participant);
        }
        else {
            message.participant = undefined;
        }
        if (object.otherParticipants !== undefined &&
            object.otherParticipants !== null) {
            for (const e of object.otherParticipants) {
                message.otherParticipants.push(livekit_models_1.ParticipantInfo.fromJSON(e));
            }
        }
        if (object.serverVersion !== undefined && object.serverVersion !== null) {
            message.serverVersion = String(object.serverVersion);
        }
        else {
            message.serverVersion = "";
        }
        if (object.iceServers !== undefined && object.iceServers !== null) {
            for (const e of object.iceServers) {
                message.iceServers.push(exports.ICEServer.fromJSON(e));
            }
        }
        if (object.subscriberPrimary !== undefined &&
            object.subscriberPrimary !== null) {
            message.subscriberPrimary = Boolean(object.subscriberPrimary);
        }
        else {
            message.subscriberPrimary = false;
        }
        if (object.alternativeUrl !== undefined && object.alternativeUrl !== null) {
            message.alternativeUrl = String(object.alternativeUrl);
        }
        else {
            message.alternativeUrl = "";
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.room !== undefined &&
            (obj.room = message.room ? livekit_models_1.Room.toJSON(message.room) : undefined);
        message.participant !== undefined &&
            (obj.participant = message.participant
                ? livekit_models_1.ParticipantInfo.toJSON(message.participant)
                : undefined);
        if (message.otherParticipants) {
            obj.otherParticipants = message.otherParticipants.map((e) => e ? livekit_models_1.ParticipantInfo.toJSON(e) : undefined);
        }
        else {
            obj.otherParticipants = [];
        }
        message.serverVersion !== undefined &&
            (obj.serverVersion = message.serverVersion);
        if (message.iceServers) {
            obj.iceServers = message.iceServers.map((e) => e ? exports.ICEServer.toJSON(e) : undefined);
        }
        else {
            obj.iceServers = [];
        }
        message.subscriberPrimary !== undefined &&
            (obj.subscriberPrimary = message.subscriberPrimary);
        message.alternativeUrl !== undefined &&
            (obj.alternativeUrl = message.alternativeUrl);
        return obj;
    },
    fromPartial(object) {
        var _a, _b, _c;
        const message = Object.assign({}, baseJoinResponse);
        if (object.room !== undefined && object.room !== null) {
            message.room = livekit_models_1.Room.fromPartial(object.room);
        }
        else {
            message.room = undefined;
        }
        if (object.participant !== undefined && object.participant !== null) {
            message.participant = livekit_models_1.ParticipantInfo.fromPartial(object.participant);
        }
        else {
            message.participant = undefined;
        }
        message.otherParticipants = [];
        if (object.otherParticipants !== undefined &&
            object.otherParticipants !== null) {
            for (const e of object.otherParticipants) {
                message.otherParticipants.push(livekit_models_1.ParticipantInfo.fromPartial(e));
            }
        }
        message.serverVersion = (_a = object.serverVersion) !== null && _a !== void 0 ? _a : "";
        message.iceServers = [];
        if (object.iceServers !== undefined && object.iceServers !== null) {
            for (const e of object.iceServers) {
                message.iceServers.push(exports.ICEServer.fromPartial(e));
            }
        }
        message.subscriberPrimary = (_b = object.subscriberPrimary) !== null && _b !== void 0 ? _b : false;
        message.alternativeUrl = (_c = object.alternativeUrl) !== null && _c !== void 0 ? _c : "";
        return message;
    },
};
const baseTrackPublishedResponse = { cid: "" };
exports.TrackPublishedResponse = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.cid !== "") {
            writer.uint32(10).string(message.cid);
        }
        if (message.track !== undefined) {
            livekit_models_1.TrackInfo.encode(message.track, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseTrackPublishedResponse);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.cid = reader.string();
                    break;
                case 2:
                    message.track = livekit_models_1.TrackInfo.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseTrackPublishedResponse);
        if (object.cid !== undefined && object.cid !== null) {
            message.cid = String(object.cid);
        }
        else {
            message.cid = "";
        }
        if (object.track !== undefined && object.track !== null) {
            message.track = livekit_models_1.TrackInfo.fromJSON(object.track);
        }
        else {
            message.track = undefined;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.cid !== undefined && (obj.cid = message.cid);
        message.track !== undefined &&
            (obj.track = message.track ? livekit_models_1.TrackInfo.toJSON(message.track) : undefined);
        return obj;
    },
    fromPartial(object) {
        var _a;
        const message = Object.assign({}, baseTrackPublishedResponse);
        message.cid = (_a = object.cid) !== null && _a !== void 0 ? _a : "";
        if (object.track !== undefined && object.track !== null) {
            message.track = livekit_models_1.TrackInfo.fromPartial(object.track);
        }
        else {
            message.track = undefined;
        }
        return message;
    },
};
const baseSessionDescription = { type: "", sdp: "" };
exports.SessionDescription = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.type !== "") {
            writer.uint32(10).string(message.type);
        }
        if (message.sdp !== "") {
            writer.uint32(18).string(message.sdp);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseSessionDescription);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.type = reader.string();
                    break;
                case 2:
                    message.sdp = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseSessionDescription);
        if (object.type !== undefined && object.type !== null) {
            message.type = String(object.type);
        }
        else {
            message.type = "";
        }
        if (object.sdp !== undefined && object.sdp !== null) {
            message.sdp = String(object.sdp);
        }
        else {
            message.sdp = "";
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.type !== undefined && (obj.type = message.type);
        message.sdp !== undefined && (obj.sdp = message.sdp);
        return obj;
    },
    fromPartial(object) {
        var _a, _b;
        const message = Object.assign({}, baseSessionDescription);
        message.type = (_a = object.type) !== null && _a !== void 0 ? _a : "";
        message.sdp = (_b = object.sdp) !== null && _b !== void 0 ? _b : "";
        return message;
    },
};
const baseParticipantUpdate = {};
exports.ParticipantUpdate = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        for (const v of message.participants) {
            livekit_models_1.ParticipantInfo.encode(v, writer.uint32(10).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseParticipantUpdate);
        message.participants = [];
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.participants.push(livekit_models_1.ParticipantInfo.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseParticipantUpdate);
        message.participants = [];
        if (object.participants !== undefined && object.participants !== null) {
            for (const e of object.participants) {
                message.participants.push(livekit_models_1.ParticipantInfo.fromJSON(e));
            }
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        if (message.participants) {
            obj.participants = message.participants.map((e) => e ? livekit_models_1.ParticipantInfo.toJSON(e) : undefined);
        }
        else {
            obj.participants = [];
        }
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseParticipantUpdate);
        message.participants = [];
        if (object.participants !== undefined && object.participants !== null) {
            for (const e of object.participants) {
                message.participants.push(livekit_models_1.ParticipantInfo.fromPartial(e));
            }
        }
        return message;
    },
};
const baseUpdateSubscription = { trackSids: "", subscribe: false };
exports.UpdateSubscription = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        for (const v of message.trackSids) {
            writer.uint32(10).string(v);
        }
        if (message.subscribe === true) {
            writer.uint32(16).bool(message.subscribe);
        }
        for (const v of message.participantTracks) {
            livekit_models_1.ParticipantTracks.encode(v, writer.uint32(26).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseUpdateSubscription);
        message.trackSids = [];
        message.participantTracks = [];
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.trackSids.push(reader.string());
                    break;
                case 2:
                    message.subscribe = reader.bool();
                    break;
                case 3:
                    message.participantTracks.push(livekit_models_1.ParticipantTracks.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseUpdateSubscription);
        message.trackSids = [];
        message.participantTracks = [];
        if (object.trackSids !== undefined && object.trackSids !== null) {
            for (const e of object.trackSids) {
                message.trackSids.push(String(e));
            }
        }
        if (object.subscribe !== undefined && object.subscribe !== null) {
            message.subscribe = Boolean(object.subscribe);
        }
        else {
            message.subscribe = false;
        }
        if (object.participantTracks !== undefined &&
            object.participantTracks !== null) {
            for (const e of object.participantTracks) {
                message.participantTracks.push(livekit_models_1.ParticipantTracks.fromJSON(e));
            }
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        if (message.trackSids) {
            obj.trackSids = message.trackSids.map((e) => e);
        }
        else {
            obj.trackSids = [];
        }
        message.subscribe !== undefined && (obj.subscribe = message.subscribe);
        if (message.participantTracks) {
            obj.participantTracks = message.participantTracks.map((e) => e ? livekit_models_1.ParticipantTracks.toJSON(e) : undefined);
        }
        else {
            obj.participantTracks = [];
        }
        return obj;
    },
    fromPartial(object) {
        var _a;
        const message = Object.assign({}, baseUpdateSubscription);
        message.trackSids = [];
        if (object.trackSids !== undefined && object.trackSids !== null) {
            for (const e of object.trackSids) {
                message.trackSids.push(e);
            }
        }
        message.subscribe = (_a = object.subscribe) !== null && _a !== void 0 ? _a : false;
        message.participantTracks = [];
        if (object.participantTracks !== undefined &&
            object.participantTracks !== null) {
            for (const e of object.participantTracks) {
                message.participantTracks.push(livekit_models_1.ParticipantTracks.fromPartial(e));
            }
        }
        return message;
    },
};
const baseUpdateTrackSettings = {
    trackSids: "",
    disabled: false,
    quality: 0,
    width: 0,
    height: 0,
};
exports.UpdateTrackSettings = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        for (const v of message.trackSids) {
            writer.uint32(10).string(v);
        }
        if (message.disabled === true) {
            writer.uint32(24).bool(message.disabled);
        }
        if (message.quality !== 0) {
            writer.uint32(32).int32(message.quality);
        }
        if (message.width !== 0) {
            writer.uint32(40).uint32(message.width);
        }
        if (message.height !== 0) {
            writer.uint32(48).uint32(message.height);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseUpdateTrackSettings);
        message.trackSids = [];
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.trackSids.push(reader.string());
                    break;
                case 3:
                    message.disabled = reader.bool();
                    break;
                case 4:
                    message.quality = reader.int32();
                    break;
                case 5:
                    message.width = reader.uint32();
                    break;
                case 6:
                    message.height = reader.uint32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseUpdateTrackSettings);
        message.trackSids = [];
        if (object.trackSids !== undefined && object.trackSids !== null) {
            for (const e of object.trackSids) {
                message.trackSids.push(String(e));
            }
        }
        if (object.disabled !== undefined && object.disabled !== null) {
            message.disabled = Boolean(object.disabled);
        }
        else {
            message.disabled = false;
        }
        if (object.quality !== undefined && object.quality !== null) {
            message.quality = livekit_models_1.videoQualityFromJSON(object.quality);
        }
        else {
            message.quality = 0;
        }
        if (object.width !== undefined && object.width !== null) {
            message.width = Number(object.width);
        }
        else {
            message.width = 0;
        }
        if (object.height !== undefined && object.height !== null) {
            message.height = Number(object.height);
        }
        else {
            message.height = 0;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        if (message.trackSids) {
            obj.trackSids = message.trackSids.map((e) => e);
        }
        else {
            obj.trackSids = [];
        }
        message.disabled !== undefined && (obj.disabled = message.disabled);
        message.quality !== undefined &&
            (obj.quality = livekit_models_1.videoQualityToJSON(message.quality));
        message.width !== undefined && (obj.width = message.width);
        message.height !== undefined && (obj.height = message.height);
        return obj;
    },
    fromPartial(object) {
        var _a, _b, _c, _d;
        const message = Object.assign({}, baseUpdateTrackSettings);
        message.trackSids = [];
        if (object.trackSids !== undefined && object.trackSids !== null) {
            for (const e of object.trackSids) {
                message.trackSids.push(e);
            }
        }
        message.disabled = (_a = object.disabled) !== null && _a !== void 0 ? _a : false;
        message.quality = (_b = object.quality) !== null && _b !== void 0 ? _b : 0;
        message.width = (_c = object.width) !== null && _c !== void 0 ? _c : 0;
        message.height = (_d = object.height) !== null && _d !== void 0 ? _d : 0;
        return message;
    },
};
const baseLeaveRequest = { canReconnect: false };
exports.LeaveRequest = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.canReconnect === true) {
            writer.uint32(8).bool(message.canReconnect);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseLeaveRequest);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.canReconnect = reader.bool();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseLeaveRequest);
        if (object.canReconnect !== undefined && object.canReconnect !== null) {
            message.canReconnect = Boolean(object.canReconnect);
        }
        else {
            message.canReconnect = false;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.canReconnect !== undefined &&
            (obj.canReconnect = message.canReconnect);
        return obj;
    },
    fromPartial(object) {
        var _a;
        const message = Object.assign({}, baseLeaveRequest);
        message.canReconnect = (_a = object.canReconnect) !== null && _a !== void 0 ? _a : false;
        return message;
    },
};
const baseUpdateVideoLayers = { trackSid: "" };
exports.UpdateVideoLayers = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.trackSid !== "") {
            writer.uint32(10).string(message.trackSid);
        }
        for (const v of message.layers) {
            livekit_models_1.VideoLayer.encode(v, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseUpdateVideoLayers);
        message.layers = [];
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.trackSid = reader.string();
                    break;
                case 2:
                    message.layers.push(livekit_models_1.VideoLayer.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseUpdateVideoLayers);
        message.layers = [];
        if (object.trackSid !== undefined && object.trackSid !== null) {
            message.trackSid = String(object.trackSid);
        }
        else {
            message.trackSid = "";
        }
        if (object.layers !== undefined && object.layers !== null) {
            for (const e of object.layers) {
                message.layers.push(livekit_models_1.VideoLayer.fromJSON(e));
            }
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.trackSid !== undefined && (obj.trackSid = message.trackSid);
        if (message.layers) {
            obj.layers = message.layers.map((e) => e ? livekit_models_1.VideoLayer.toJSON(e) : undefined);
        }
        else {
            obj.layers = [];
        }
        return obj;
    },
    fromPartial(object) {
        var _a;
        const message = Object.assign({}, baseUpdateVideoLayers);
        message.trackSid = (_a = object.trackSid) !== null && _a !== void 0 ? _a : "";
        message.layers = [];
        if (object.layers !== undefined && object.layers !== null) {
            for (const e of object.layers) {
                message.layers.push(livekit_models_1.VideoLayer.fromPartial(e));
            }
        }
        return message;
    },
};
const baseICEServer = { urls: "", username: "", credential: "" };
exports.ICEServer = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        for (const v of message.urls) {
            writer.uint32(10).string(v);
        }
        if (message.username !== "") {
            writer.uint32(18).string(message.username);
        }
        if (message.credential !== "") {
            writer.uint32(26).string(message.credential);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseICEServer);
        message.urls = [];
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.urls.push(reader.string());
                    break;
                case 2:
                    message.username = reader.string();
                    break;
                case 3:
                    message.credential = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseICEServer);
        message.urls = [];
        if (object.urls !== undefined && object.urls !== null) {
            for (const e of object.urls) {
                message.urls.push(String(e));
            }
        }
        if (object.username !== undefined && object.username !== null) {
            message.username = String(object.username);
        }
        else {
            message.username = "";
        }
        if (object.credential !== undefined && object.credential !== null) {
            message.credential = String(object.credential);
        }
        else {
            message.credential = "";
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        if (message.urls) {
            obj.urls = message.urls.map((e) => e);
        }
        else {
            obj.urls = [];
        }
        message.username !== undefined && (obj.username = message.username);
        message.credential !== undefined && (obj.credential = message.credential);
        return obj;
    },
    fromPartial(object) {
        var _a, _b;
        const message = Object.assign({}, baseICEServer);
        message.urls = [];
        if (object.urls !== undefined && object.urls !== null) {
            for (const e of object.urls) {
                message.urls.push(e);
            }
        }
        message.username = (_a = object.username) !== null && _a !== void 0 ? _a : "";
        message.credential = (_b = object.credential) !== null && _b !== void 0 ? _b : "";
        return message;
    },
};
const baseSpeakersChanged = {};
exports.SpeakersChanged = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        for (const v of message.speakers) {
            livekit_models_1.SpeakerInfo.encode(v, writer.uint32(10).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseSpeakersChanged);
        message.speakers = [];
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.speakers.push(livekit_models_1.SpeakerInfo.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseSpeakersChanged);
        message.speakers = [];
        if (object.speakers !== undefined && object.speakers !== null) {
            for (const e of object.speakers) {
                message.speakers.push(livekit_models_1.SpeakerInfo.fromJSON(e));
            }
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        if (message.speakers) {
            obj.speakers = message.speakers.map((e) => e ? livekit_models_1.SpeakerInfo.toJSON(e) : undefined);
        }
        else {
            obj.speakers = [];
        }
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseSpeakersChanged);
        message.speakers = [];
        if (object.speakers !== undefined && object.speakers !== null) {
            for (const e of object.speakers) {
                message.speakers.push(livekit_models_1.SpeakerInfo.fromPartial(e));
            }
        }
        return message;
    },
};
const baseRoomUpdate = {};
exports.RoomUpdate = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.room !== undefined) {
            livekit_models_1.Room.encode(message.room, writer.uint32(10).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseRoomUpdate);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.room = livekit_models_1.Room.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseRoomUpdate);
        if (object.room !== undefined && object.room !== null) {
            message.room = livekit_models_1.Room.fromJSON(object.room);
        }
        else {
            message.room = undefined;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.room !== undefined &&
            (obj.room = message.room ? livekit_models_1.Room.toJSON(message.room) : undefined);
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseRoomUpdate);
        if (object.room !== undefined && object.room !== null) {
            message.room = livekit_models_1.Room.fromPartial(object.room);
        }
        else {
            message.room = undefined;
        }
        return message;
    },
};
const baseConnectionQualityInfo = {
    participantSid: "",
    quality: 0,
    score: 0,
};
exports.ConnectionQualityInfo = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.participantSid !== "") {
            writer.uint32(10).string(message.participantSid);
        }
        if (message.quality !== 0) {
            writer.uint32(16).int32(message.quality);
        }
        if (message.score !== 0) {
            writer.uint32(29).float(message.score);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseConnectionQualityInfo);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.participantSid = reader.string();
                    break;
                case 2:
                    message.quality = reader.int32();
                    break;
                case 3:
                    message.score = reader.float();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseConnectionQualityInfo);
        if (object.participantSid !== undefined && object.participantSid !== null) {
            message.participantSid = String(object.participantSid);
        }
        else {
            message.participantSid = "";
        }
        if (object.quality !== undefined && object.quality !== null) {
            message.quality = livekit_models_1.connectionQualityFromJSON(object.quality);
        }
        else {
            message.quality = 0;
        }
        if (object.score !== undefined && object.score !== null) {
            message.score = Number(object.score);
        }
        else {
            message.score = 0;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.participantSid !== undefined &&
            (obj.participantSid = message.participantSid);
        message.quality !== undefined &&
            (obj.quality = livekit_models_1.connectionQualityToJSON(message.quality));
        message.score !== undefined && (obj.score = message.score);
        return obj;
    },
    fromPartial(object) {
        var _a, _b, _c;
        const message = Object.assign({}, baseConnectionQualityInfo);
        message.participantSid = (_a = object.participantSid) !== null && _a !== void 0 ? _a : "";
        message.quality = (_b = object.quality) !== null && _b !== void 0 ? _b : 0;
        message.score = (_c = object.score) !== null && _c !== void 0 ? _c : 0;
        return message;
    },
};
const baseConnectionQualityUpdate = {};
exports.ConnectionQualityUpdate = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        for (const v of message.updates) {
            exports.ConnectionQualityInfo.encode(v, writer.uint32(10).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseConnectionQualityUpdate);
        message.updates = [];
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.updates.push(exports.ConnectionQualityInfo.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseConnectionQualityUpdate);
        message.updates = [];
        if (object.updates !== undefined && object.updates !== null) {
            for (const e of object.updates) {
                message.updates.push(exports.ConnectionQualityInfo.fromJSON(e));
            }
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        if (message.updates) {
            obj.updates = message.updates.map((e) => e ? exports.ConnectionQualityInfo.toJSON(e) : undefined);
        }
        else {
            obj.updates = [];
        }
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseConnectionQualityUpdate);
        message.updates = [];
        if (object.updates !== undefined && object.updates !== null) {
            for (const e of object.updates) {
                message.updates.push(exports.ConnectionQualityInfo.fromPartial(e));
            }
        }
        return message;
    },
};
const baseStreamStateInfo = {
    participantSid: "",
    trackSid: "",
    state: 0,
};
exports.StreamStateInfo = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.participantSid !== "") {
            writer.uint32(10).string(message.participantSid);
        }
        if (message.trackSid !== "") {
            writer.uint32(18).string(message.trackSid);
        }
        if (message.state !== 0) {
            writer.uint32(24).int32(message.state);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseStreamStateInfo);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.participantSid = reader.string();
                    break;
                case 2:
                    message.trackSid = reader.string();
                    break;
                case 3:
                    message.state = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseStreamStateInfo);
        if (object.participantSid !== undefined && object.participantSid !== null) {
            message.participantSid = String(object.participantSid);
        }
        else {
            message.participantSid = "";
        }
        if (object.trackSid !== undefined && object.trackSid !== null) {
            message.trackSid = String(object.trackSid);
        }
        else {
            message.trackSid = "";
        }
        if (object.state !== undefined && object.state !== null) {
            message.state = streamStateFromJSON(object.state);
        }
        else {
            message.state = 0;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.participantSid !== undefined &&
            (obj.participantSid = message.participantSid);
        message.trackSid !== undefined && (obj.trackSid = message.trackSid);
        message.state !== undefined &&
            (obj.state = streamStateToJSON(message.state));
        return obj;
    },
    fromPartial(object) {
        var _a, _b, _c;
        const message = Object.assign({}, baseStreamStateInfo);
        message.participantSid = (_a = object.participantSid) !== null && _a !== void 0 ? _a : "";
        message.trackSid = (_b = object.trackSid) !== null && _b !== void 0 ? _b : "";
        message.state = (_c = object.state) !== null && _c !== void 0 ? _c : 0;
        return message;
    },
};
const baseStreamStateUpdate = {};
exports.StreamStateUpdate = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        for (const v of message.streamStates) {
            exports.StreamStateInfo.encode(v, writer.uint32(10).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseStreamStateUpdate);
        message.streamStates = [];
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.streamStates.push(exports.StreamStateInfo.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseStreamStateUpdate);
        message.streamStates = [];
        if (object.streamStates !== undefined && object.streamStates !== null) {
            for (const e of object.streamStates) {
                message.streamStates.push(exports.StreamStateInfo.fromJSON(e));
            }
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        if (message.streamStates) {
            obj.streamStates = message.streamStates.map((e) => e ? exports.StreamStateInfo.toJSON(e) : undefined);
        }
        else {
            obj.streamStates = [];
        }
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseStreamStateUpdate);
        message.streamStates = [];
        if (object.streamStates !== undefined && object.streamStates !== null) {
            for (const e of object.streamStates) {
                message.streamStates.push(exports.StreamStateInfo.fromPartial(e));
            }
        }
        return message;
    },
};
const baseSubscribedQuality = { quality: 0, enabled: false };
exports.SubscribedQuality = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.quality !== 0) {
            writer.uint32(8).int32(message.quality);
        }
        if (message.enabled === true) {
            writer.uint32(16).bool(message.enabled);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseSubscribedQuality);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.quality = reader.int32();
                    break;
                case 2:
                    message.enabled = reader.bool();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseSubscribedQuality);
        if (object.quality !== undefined && object.quality !== null) {
            message.quality = livekit_models_1.videoQualityFromJSON(object.quality);
        }
        else {
            message.quality = 0;
        }
        if (object.enabled !== undefined && object.enabled !== null) {
            message.enabled = Boolean(object.enabled);
        }
        else {
            message.enabled = false;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.quality !== undefined &&
            (obj.quality = livekit_models_1.videoQualityToJSON(message.quality));
        message.enabled !== undefined && (obj.enabled = message.enabled);
        return obj;
    },
    fromPartial(object) {
        var _a, _b;
        const message = Object.assign({}, baseSubscribedQuality);
        message.quality = (_a = object.quality) !== null && _a !== void 0 ? _a : 0;
        message.enabled = (_b = object.enabled) !== null && _b !== void 0 ? _b : false;
        return message;
    },
};
const baseSubscribedQualityUpdate = { trackSid: "" };
exports.SubscribedQualityUpdate = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.trackSid !== "") {
            writer.uint32(10).string(message.trackSid);
        }
        for (const v of message.subscribedQualities) {
            exports.SubscribedQuality.encode(v, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseSubscribedQualityUpdate);
        message.subscribedQualities = [];
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.trackSid = reader.string();
                    break;
                case 2:
                    message.subscribedQualities.push(exports.SubscribedQuality.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseSubscribedQualityUpdate);
        message.subscribedQualities = [];
        if (object.trackSid !== undefined && object.trackSid !== null) {
            message.trackSid = String(object.trackSid);
        }
        else {
            message.trackSid = "";
        }
        if (object.subscribedQualities !== undefined &&
            object.subscribedQualities !== null) {
            for (const e of object.subscribedQualities) {
                message.subscribedQualities.push(exports.SubscribedQuality.fromJSON(e));
            }
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.trackSid !== undefined && (obj.trackSid = message.trackSid);
        if (message.subscribedQualities) {
            obj.subscribedQualities = message.subscribedQualities.map((e) => e ? exports.SubscribedQuality.toJSON(e) : undefined);
        }
        else {
            obj.subscribedQualities = [];
        }
        return obj;
    },
    fromPartial(object) {
        var _a;
        const message = Object.assign({}, baseSubscribedQualityUpdate);
        message.trackSid = (_a = object.trackSid) !== null && _a !== void 0 ? _a : "";
        message.subscribedQualities = [];
        if (object.subscribedQualities !== undefined &&
            object.subscribedQualities !== null) {
            for (const e of object.subscribedQualities) {
                message.subscribedQualities.push(exports.SubscribedQuality.fromPartial(e));
            }
        }
        return message;
    },
};
const baseTrackPermission = {
    participantSid: "",
    allTracks: false,
    trackSids: "",
};
exports.TrackPermission = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.participantSid !== "") {
            writer.uint32(10).string(message.participantSid);
        }
        if (message.allTracks === true) {
            writer.uint32(16).bool(message.allTracks);
        }
        for (const v of message.trackSids) {
            writer.uint32(26).string(v);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseTrackPermission);
        message.trackSids = [];
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.participantSid = reader.string();
                    break;
                case 2:
                    message.allTracks = reader.bool();
                    break;
                case 3:
                    message.trackSids.push(reader.string());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseTrackPermission);
        message.trackSids = [];
        if (object.participantSid !== undefined && object.participantSid !== null) {
            message.participantSid = String(object.participantSid);
        }
        else {
            message.participantSid = "";
        }
        if (object.allTracks !== undefined && object.allTracks !== null) {
            message.allTracks = Boolean(object.allTracks);
        }
        else {
            message.allTracks = false;
        }
        if (object.trackSids !== undefined && object.trackSids !== null) {
            for (const e of object.trackSids) {
                message.trackSids.push(String(e));
            }
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.participantSid !== undefined &&
            (obj.participantSid = message.participantSid);
        message.allTracks !== undefined && (obj.allTracks = message.allTracks);
        if (message.trackSids) {
            obj.trackSids = message.trackSids.map((e) => e);
        }
        else {
            obj.trackSids = [];
        }
        return obj;
    },
    fromPartial(object) {
        var _a, _b;
        const message = Object.assign({}, baseTrackPermission);
        message.participantSid = (_a = object.participantSid) !== null && _a !== void 0 ? _a : "";
        message.allTracks = (_b = object.allTracks) !== null && _b !== void 0 ? _b : false;
        message.trackSids = [];
        if (object.trackSids !== undefined && object.trackSids !== null) {
            for (const e of object.trackSids) {
                message.trackSids.push(e);
            }
        }
        return message;
    },
};
const baseSubscriptionPermission = { allParticipants: false };
exports.SubscriptionPermission = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.allParticipants === true) {
            writer.uint32(8).bool(message.allParticipants);
        }
        for (const v of message.trackPermissions) {
            exports.TrackPermission.encode(v, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseSubscriptionPermission);
        message.trackPermissions = [];
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.allParticipants = reader.bool();
                    break;
                case 2:
                    message.trackPermissions.push(exports.TrackPermission.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseSubscriptionPermission);
        message.trackPermissions = [];
        if (object.allParticipants !== undefined &&
            object.allParticipants !== null) {
            message.allParticipants = Boolean(object.allParticipants);
        }
        else {
            message.allParticipants = false;
        }
        if (object.trackPermissions !== undefined &&
            object.trackPermissions !== null) {
            for (const e of object.trackPermissions) {
                message.trackPermissions.push(exports.TrackPermission.fromJSON(e));
            }
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.allParticipants !== undefined &&
            (obj.allParticipants = message.allParticipants);
        if (message.trackPermissions) {
            obj.trackPermissions = message.trackPermissions.map((e) => e ? exports.TrackPermission.toJSON(e) : undefined);
        }
        else {
            obj.trackPermissions = [];
        }
        return obj;
    },
    fromPartial(object) {
        var _a;
        const message = Object.assign({}, baseSubscriptionPermission);
        message.allParticipants = (_a = object.allParticipants) !== null && _a !== void 0 ? _a : false;
        message.trackPermissions = [];
        if (object.trackPermissions !== undefined &&
            object.trackPermissions !== null) {
            for (const e of object.trackPermissions) {
                message.trackPermissions.push(exports.TrackPermission.fromPartial(e));
            }
        }
        return message;
    },
};
const baseSubscriptionPermissionUpdate = {
    participantSid: "",
    trackSid: "",
    allowed: false,
};
exports.SubscriptionPermissionUpdate = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.participantSid !== "") {
            writer.uint32(10).string(message.participantSid);
        }
        if (message.trackSid !== "") {
            writer.uint32(18).string(message.trackSid);
        }
        if (message.allowed === true) {
            writer.uint32(24).bool(message.allowed);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseSubscriptionPermissionUpdate);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.participantSid = reader.string();
                    break;
                case 2:
                    message.trackSid = reader.string();
                    break;
                case 3:
                    message.allowed = reader.bool();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseSubscriptionPermissionUpdate);
        if (object.participantSid !== undefined && object.participantSid !== null) {
            message.participantSid = String(object.participantSid);
        }
        else {
            message.participantSid = "";
        }
        if (object.trackSid !== undefined && object.trackSid !== null) {
            message.trackSid = String(object.trackSid);
        }
        else {
            message.trackSid = "";
        }
        if (object.allowed !== undefined && object.allowed !== null) {
            message.allowed = Boolean(object.allowed);
        }
        else {
            message.allowed = false;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.participantSid !== undefined &&
            (obj.participantSid = message.participantSid);
        message.trackSid !== undefined && (obj.trackSid = message.trackSid);
        message.allowed !== undefined && (obj.allowed = message.allowed);
        return obj;
    },
    fromPartial(object) {
        var _a, _b, _c;
        const message = Object.assign({}, baseSubscriptionPermissionUpdate);
        message.participantSid = (_a = object.participantSid) !== null && _a !== void 0 ? _a : "";
        message.trackSid = (_b = object.trackSid) !== null && _b !== void 0 ? _b : "";
        message.allowed = (_c = object.allowed) !== null && _c !== void 0 ? _c : false;
        return message;
    },
};
const baseSyncState = {};
exports.SyncState = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.answer !== undefined) {
            exports.SessionDescription.encode(message.answer, writer.uint32(10).fork()).ldelim();
        }
        if (message.subscription !== undefined) {
            exports.UpdateSubscription.encode(message.subscription, writer.uint32(18).fork()).ldelim();
        }
        for (const v of message.publishTracks) {
            exports.TrackPublishedResponse.encode(v, writer.uint32(26).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseSyncState);
        message.publishTracks = [];
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.answer = exports.SessionDescription.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.subscription = exports.UpdateSubscription.decode(reader, reader.uint32());
                    break;
                case 3:
                    message.publishTracks.push(exports.TrackPublishedResponse.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseSyncState);
        message.publishTracks = [];
        if (object.answer !== undefined && object.answer !== null) {
            message.answer = exports.SessionDescription.fromJSON(object.answer);
        }
        else {
            message.answer = undefined;
        }
        if (object.subscription !== undefined && object.subscription !== null) {
            message.subscription = exports.UpdateSubscription.fromJSON(object.subscription);
        }
        else {
            message.subscription = undefined;
        }
        if (object.publishTracks !== undefined && object.publishTracks !== null) {
            for (const e of object.publishTracks) {
                message.publishTracks.push(exports.TrackPublishedResponse.fromJSON(e));
            }
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.answer !== undefined &&
            (obj.answer = message.answer
                ? exports.SessionDescription.toJSON(message.answer)
                : undefined);
        message.subscription !== undefined &&
            (obj.subscription = message.subscription
                ? exports.UpdateSubscription.toJSON(message.subscription)
                : undefined);
        if (message.publishTracks) {
            obj.publishTracks = message.publishTracks.map((e) => e ? exports.TrackPublishedResponse.toJSON(e) : undefined);
        }
        else {
            obj.publishTracks = [];
        }
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseSyncState);
        if (object.answer !== undefined && object.answer !== null) {
            message.answer = exports.SessionDescription.fromPartial(object.answer);
        }
        else {
            message.answer = undefined;
        }
        if (object.subscription !== undefined && object.subscription !== null) {
            message.subscription = exports.UpdateSubscription.fromPartial(object.subscription);
        }
        else {
            message.subscription = undefined;
        }
        message.publishTracks = [];
        if (object.publishTracks !== undefined && object.publishTracks !== null) {
            for (const e of object.publishTracks) {
                message.publishTracks.push(exports.TrackPublishedResponse.fromPartial(e));
            }
        }
        return message;
    },
};
const baseSimulateScenario = {};
exports.SimulateScenario = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.speakerUpdate !== undefined) {
            writer.uint32(8).int32(message.speakerUpdate);
        }
        if (message.nodeFailure !== undefined) {
            writer.uint32(16).bool(message.nodeFailure);
        }
        if (message.migration !== undefined) {
            writer.uint32(24).bool(message.migration);
        }
        if (message.serverLeave !== undefined) {
            writer.uint32(32).bool(message.serverLeave);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseSimulateScenario);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.speakerUpdate = reader.int32();
                    break;
                case 2:
                    message.nodeFailure = reader.bool();
                    break;
                case 3:
                    message.migration = reader.bool();
                    break;
                case 4:
                    message.serverLeave = reader.bool();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseSimulateScenario);
        if (object.speakerUpdate !== undefined && object.speakerUpdate !== null) {
            message.speakerUpdate = Number(object.speakerUpdate);
        }
        else {
            message.speakerUpdate = undefined;
        }
        if (object.nodeFailure !== undefined && object.nodeFailure !== null) {
            message.nodeFailure = Boolean(object.nodeFailure);
        }
        else {
            message.nodeFailure = undefined;
        }
        if (object.migration !== undefined && object.migration !== null) {
            message.migration = Boolean(object.migration);
        }
        else {
            message.migration = undefined;
        }
        if (object.serverLeave !== undefined && object.serverLeave !== null) {
            message.serverLeave = Boolean(object.serverLeave);
        }
        else {
            message.serverLeave = undefined;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.speakerUpdate !== undefined &&
            (obj.speakerUpdate = message.speakerUpdate);
        message.nodeFailure !== undefined &&
            (obj.nodeFailure = message.nodeFailure);
        message.migration !== undefined && (obj.migration = message.migration);
        message.serverLeave !== undefined &&
            (obj.serverLeave = message.serverLeave);
        return obj;
    },
    fromPartial(object) {
        var _a, _b, _c, _d;
        const message = Object.assign({}, baseSimulateScenario);
        message.speakerUpdate = (_a = object.speakerUpdate) !== null && _a !== void 0 ? _a : undefined;
        message.nodeFailure = (_b = object.nodeFailure) !== null && _b !== void 0 ? _b : undefined;
        message.migration = (_c = object.migration) !== null && _c !== void 0 ? _c : undefined;
        message.serverLeave = (_d = object.serverLeave) !== null && _d !== void 0 ? _d : undefined;
        return message;
    },
};
if (minimal_1.default.util.Long !== long_1.default) {
    minimal_1.default.util.Long = long_1.default;
    minimal_1.default.configure();
}
//# sourceMappingURL=livekit_rtc.js.map

/***/ }),

/***/ 1480:
/***/ (function(__unused_webpack_module, exports) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const defaultId = 'default';
class DeviceManager {
    static getInstance() {
        if (this.instance === undefined) {
            this.instance = new DeviceManager();
        }
        return this.instance;
    }
    getDevices(kind) {
        return __awaiter(this, void 0, void 0, function* () {
            let devices = yield navigator.mediaDevices.enumerateDevices();
            devices = devices.filter((device) => device.kind === kind);
            // Chrome returns 'default' devices, we would filter them out, but put the default
            // device at first
            // we would only do this if there are more than 1 device though
            if (devices.length > 1 && devices[0].deviceId === defaultId) {
                // find another device with matching group id, and move that to 0
                const defaultDevice = devices[0];
                for (let i = 1; i < devices.length; i += 1) {
                    if (devices[i].groupId === defaultDevice.groupId) {
                        const temp = devices[0];
                        devices[0] = devices[i];
                        devices[i] = temp;
                        break;
                    }
                }
                return devices.filter((device) => device !== defaultDevice);
            }
            return devices;
        });
    }
    normalizeDeviceId(kind, deviceId, groupId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (deviceId !== defaultId) {
                return deviceId;
            }
            // resolve actual device id if it's 'default': Chrome returns it when no
            // device has been chosen
            const devices = yield this.getDevices(kind);
            const device = devices.find((d) => d.groupId === groupId && d.deviceId !== defaultId);
            return device === null || device === void 0 ? void 0 : device.deviceId;
        });
    }
}
exports["default"] = DeviceManager;
DeviceManager.mediaDeviceKinds = [
    'audioinput',
    'audiooutput',
    'videoinput',
];
//# sourceMappingURL=DeviceManager.js.map

/***/ }),

/***/ 8974:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const ts_debounce_1 = __webpack_require__(2938);
const logger_1 = __importDefault(__webpack_require__(2662));
/** @internal */
class PCTransport {
    constructor(config) {
        this.pendingCandidates = [];
        this.restartingIce = false;
        this.renegotiate = false;
        // debounced negotiate interface
        this.negotiate = ts_debounce_1.debounce(() => { this.createAndSendOffer(); }, 100);
        this.pc = new RTCPeerConnection(config);
    }
    get isICEConnected() {
        return this.pc.iceConnectionState === 'connected' || this.pc.iceConnectionState === 'completed';
    }
    addIceCandidate(candidate) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.pc.remoteDescription && !this.restartingIce) {
                return this.pc.addIceCandidate(candidate);
            }
            this.pendingCandidates.push(candidate);
        });
    }
    setRemoteDescription(sd) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.pc.setRemoteDescription(sd);
            this.pendingCandidates.forEach((candidate) => {
                this.pc.addIceCandidate(candidate);
            });
            this.pendingCandidates = [];
            this.restartingIce = false;
            if (this.renegotiate) {
                this.renegotiate = false;
                this.createAndSendOffer();
            }
        });
    }
    createAndSendOffer(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.onOffer === undefined) {
                return;
            }
            if (options === null || options === void 0 ? void 0 : options.iceRestart) {
                logger_1.default.debug('restarting ICE');
                this.restartingIce = true;
            }
            if (this.pc.signalingState === 'have-local-offer') {
                // we're waiting for the peer to accept our offer, so we'll just wait
                // the only exception to this is when ICE restart is needed
                const currentSD = this.pc.remoteDescription;
                if ((options === null || options === void 0 ? void 0 : options.iceRestart) && currentSD) {
                    // TODO: handle when ICE restart is needed but we don't have a remote description
                    // the best thing to do is to recreate the peerconnection
                    yield this.pc.setRemoteDescription(currentSD);
                }
                else {
                    this.renegotiate = true;
                    return;
                }
            }
            else if (this.pc.signalingState === 'closed') {
                logger_1.default.warn('could not createOffer with closed peer connection');
                return;
            }
            // actually negotiate
            logger_1.default.debug('starting to negotiate');
            const offer = yield this.pc.createOffer(options);
            yield this.pc.setLocalDescription(offer);
            this.onOffer(offer);
        });
    }
    close() {
        this.pc.close();
    }
}
exports["default"] = PCTransport;
//# sourceMappingURL=PCTransport.js.map

/***/ }),

/***/ 8947:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.maxICEConnectTimeout = void 0;
const events_1 = __webpack_require__(7187);
const SignalClient_1 = __webpack_require__(9286);
const logger_1 = __importDefault(__webpack_require__(2662));
const livekit_models_1 = __webpack_require__(8983);
const livekit_rtc_1 = __webpack_require__(4658);
const errors_1 = __webpack_require__(7650);
const events_2 = __webpack_require__(8911);
const PCTransport_1 = __importDefault(__webpack_require__(8974));
const utils_1 = __webpack_require__(1981);
const lossyDataChannel = '_lossy';
const reliableDataChannel = '_reliable';
const maxReconnectRetries = 10;
const minReconnectWait = 1 * 1000;
const maxReconnectDuration = 60 * 1000;
exports.maxICEConnectTimeout = 15 * 1000;
/** @internal */
class RTCEngine extends events_1.EventEmitter {
    constructor() {
        super();
        this.rtcConfig = {};
        this.subscriberPrimary = false;
        this.pcConnected = false;
        this.isClosed = true;
        this.pendingTrackResolvers = {};
        // true if publisher connection has already been established.
        // this is helpful to know if we need to restart ICE on the publisher connection
        this.hasPublished = false;
        this.reconnectAttempts = 0;
        this.reconnectStart = 0;
        this.fullReconnect = false;
        this.handleDataChannel = ({ channel }) => __awaiter(this, void 0, void 0, function* () {
            if (!channel) {
                return;
            }
            if (channel.label === reliableDataChannel) {
                this.reliableDCSub = channel;
            }
            else if (channel.label === lossyDataChannel) {
                this.lossyDCSub = channel;
            }
            else {
                return;
            }
            channel.onmessage = this.handleDataMessage;
        });
        this.handleDataMessage = (message) => __awaiter(this, void 0, void 0, function* () {
            // decode
            let buffer;
            if (message.data instanceof ArrayBuffer) {
                buffer = message.data;
            }
            else if (message.data instanceof Blob) {
                buffer = yield message.data.arrayBuffer();
            }
            else {
                logger_1.default.error('unsupported data type', message.data);
                return;
            }
            const dp = livekit_models_1.DataPacket.decode(new Uint8Array(buffer));
            if (dp.speaker) {
                // dispatch speaker updates
                this.emit(events_2.EngineEvent.ActiveSpeakersUpdate, dp.speaker.speakers);
            }
            else if (dp.user) {
                this.emit(events_2.EngineEvent.DataPacketReceived, dp.user, dp.kind);
            }
        });
        this.handleDataError = (event) => {
            const channel = event.currentTarget;
            const channelKind = channel.maxRetransmits === 0 ? 'lossy' : 'reliable';
            if (event instanceof ErrorEvent) {
                const { error } = event.error;
                logger_1.default.error(`DataChannel error on ${channelKind}: ${event.message}`, error);
            }
            else {
                logger_1.default.error(`Unknown DataChannel Error on ${channelKind}`, event);
            }
        };
        // websocket reconnect behavior. if websocket is interrupted, and the PeerConnection
        // continues to work, we can reconnect to websocket to continue the session
        // after a number of retries, we'll close and give up permanently
        this.handleDisconnect = (connection) => {
            if (this.isClosed) {
                return;
            }
            logger_1.default.debug(`${connection} disconnected`);
            if (this.reconnectAttempts === 0) {
                // only reset start time on the first try
                this.reconnectStart = Date.now();
            }
            const delay = (this.reconnectAttempts * this.reconnectAttempts) * 300;
            setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                if (this.isClosed) {
                    return;
                }
                if (utils_1.isFireFox()) {
                    // FF does not support DTLS restart.
                    this.fullReconnect = true;
                }
                try {
                    if (this.fullReconnect) {
                        yield this.restartConnection();
                    }
                    else {
                        yield this.resumeConnection();
                    }
                    this.reconnectAttempts = 0;
                    this.fullReconnect = false;
                }
                catch (e) {
                    this.reconnectAttempts += 1;
                    let recoverable = true;
                    if (e instanceof errors_1.UnexpectedConnectionState) {
                        logger_1.default.debug('received unrecoverable error', e.message);
                        // unrecoverable
                        recoverable = false;
                    }
                    else if (!(e instanceof SignalReconnectError)) {
                        // cannot resume
                        this.fullReconnect = true;
                    }
                    const duration = Date.now() - this.reconnectStart;
                    if (this.reconnectAttempts >= maxReconnectRetries || duration > maxReconnectDuration) {
                        recoverable = false;
                    }
                    if (recoverable) {
                        this.handleDisconnect('reconnect');
                    }
                    else {
                        logger_1.default.info(`could not recover connection after ${maxReconnectRetries} attempts, ${duration}ms. giving up`);
                        this.emit(events_2.EngineEvent.Disconnected);
                        this.close();
                    }
                }
            }), delay);
        };
        this.client = new SignalClient_1.SignalClient();
    }
    join(url, token, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            this.url = url;
            this.token = token;
            this.signalOpts = opts;
            const joinResponse = yield this.client.join(url, token, opts);
            this.isClosed = false;
            this.subscriberPrimary = joinResponse.subscriberPrimary;
            if (!this.publisher) {
                this.configure(joinResponse);
            }
            // create offer
            if (!this.subscriberPrimary) {
                this.negotiate();
            }
            return joinResponse;
        });
    }
    close() {
        this.isClosed = true;
        this.removeAllListeners();
        if (this.publisher && this.publisher.pc.signalingState !== 'closed') {
            this.publisher.pc.getSenders().forEach((sender) => {
                var _a;
                try {
                    (_a = this.publisher) === null || _a === void 0 ? void 0 : _a.pc.removeTrack(sender);
                }
                catch (e) {
                    logger_1.default.warn('could not removeTrack', e);
                }
            });
            this.publisher.close();
            this.publisher = undefined;
        }
        if (this.subscriber) {
            this.subscriber.close();
            this.subscriber = undefined;
        }
        this.client.close();
    }
    addTrack(req) {
        if (this.pendingTrackResolvers[req.cid]) {
            throw new errors_1.TrackInvalidError('a track with the same ID has already been published');
        }
        return new Promise((resolve) => {
            this.pendingTrackResolvers[req.cid] = resolve;
            this.client.sendAddTrack(req);
        });
    }
    updateMuteStatus(trackSid, muted) {
        this.client.sendMuteTrack(trackSid, muted);
    }
    get dataSubscriberReadyState() {
        var _a;
        return (_a = this.reliableDCSub) === null || _a === void 0 ? void 0 : _a.readyState;
    }
    get connectedServerAddress() {
        return this.connectedServerAddr;
    }
    configure(joinResponse) {
        // already configured
        if (this.publisher || this.subscriber) {
            return;
        }
        // update ICE servers before creating PeerConnection
        if (joinResponse.iceServers && !this.rtcConfig.iceServers) {
            const rtcIceServers = [];
            joinResponse.iceServers.forEach((iceServer) => {
                const rtcIceServer = {
                    urls: iceServer.urls,
                };
                if (iceServer.username)
                    rtcIceServer.username = iceServer.username;
                if (iceServer.credential) {
                    rtcIceServer.credential = iceServer.credential;
                }
                rtcIceServers.push(rtcIceServer);
            });
            this.rtcConfig.iceServers = rtcIceServers;
        }
        this.publisher = new PCTransport_1.default(this.rtcConfig);
        this.subscriber = new PCTransport_1.default(this.rtcConfig);
        this.emit(events_2.EngineEvent.TransportsCreated, this.publisher, this.subscriber);
        this.publisher.pc.onicecandidate = (ev) => {
            if (!ev.candidate)
                return;
            logger_1.default.trace('adding ICE candidate for peer', ev.candidate);
            this.client.sendIceCandidate(ev.candidate, livekit_rtc_1.SignalTarget.PUBLISHER);
        };
        this.subscriber.pc.onicecandidate = (ev) => {
            if (!ev.candidate)
                return;
            this.client.sendIceCandidate(ev.candidate, livekit_rtc_1.SignalTarget.SUBSCRIBER);
        };
        this.publisher.onOffer = (offer) => {
            this.client.sendOffer(offer);
        };
        let primaryPC = this.publisher.pc;
        if (joinResponse.subscriberPrimary) {
            primaryPC = this.subscriber.pc;
            // in subscriber primary mode, server side opens sub data channels.
            this.subscriber.pc.ondatachannel = this.handleDataChannel;
        }
        this.primaryPC = primaryPC;
        primaryPC.onconnectionstatechange = () => __awaiter(this, void 0, void 0, function* () {
            if (primaryPC.connectionState === 'connected') {
                logger_1.default.trace('pc connected');
                try {
                    this.connectedServerAddr = yield getConnectedAddress(primaryPC);
                }
                catch (e) {
                    logger_1.default.warn('could not get connected server address', e);
                }
                if (!this.pcConnected) {
                    this.pcConnected = true;
                    this.emit(events_2.EngineEvent.Connected);
                }
            }
            else if (primaryPC.connectionState === 'failed') {
                // on Safari, PeerConnection will switch to 'disconnected' during renegotiation
                logger_1.default.trace('pc disconnected');
                if (this.pcConnected) {
                    this.pcConnected = false;
                    this.handleDisconnect('peerconnection');
                }
            }
        });
        this.subscriber.pc.ontrack = (ev) => {
            this.emit(events_2.EngineEvent.MediaTrackAdded, ev.track, ev.streams[0], ev.receiver);
        };
        // data channels
        this.lossyDC = this.publisher.pc.createDataChannel(lossyDataChannel, {
            // will drop older packets that arrive
            ordered: true,
            maxRetransmits: 0,
        });
        this.reliableDC = this.publisher.pc.createDataChannel(reliableDataChannel, {
            ordered: true,
        });
        // also handle messages over the pub channel, for backwards compatibility
        this.lossyDC.onmessage = this.handleDataMessage;
        this.reliableDC.onmessage = this.handleDataMessage;
        // handle datachannel errors
        this.lossyDC.onerror = this.handleDataError;
        this.reliableDC.onerror = this.handleDataError;
        // configure signaling client
        this.client.onAnswer = (sd) => __awaiter(this, void 0, void 0, function* () {
            if (!this.publisher) {
                return;
            }
            logger_1.default.debug('received server answer', sd.type, this.publisher.pc.signalingState);
            yield this.publisher.setRemoteDescription(sd);
        });
        // add candidate on trickle
        this.client.onTrickle = (candidate, target) => {
            if (!this.publisher || !this.subscriber) {
                return;
            }
            logger_1.default.trace('got ICE candidate from peer', candidate, target);
            if (target === livekit_rtc_1.SignalTarget.PUBLISHER) {
                this.publisher.addIceCandidate(candidate);
            }
            else {
                this.subscriber.addIceCandidate(candidate);
            }
        };
        // when server creates an offer for the client
        this.client.onOffer = (sd) => __awaiter(this, void 0, void 0, function* () {
            if (!this.subscriber) {
                return;
            }
            logger_1.default.debug('received server offer', sd.type, this.subscriber.pc.signalingState);
            yield this.subscriber.setRemoteDescription(sd);
            // answer the offer
            const answer = yield this.subscriber.pc.createAnswer();
            yield this.subscriber.pc.setLocalDescription(answer);
            this.client.sendAnswer(answer);
        });
        this.client.onLocalTrackPublished = (res) => {
            logger_1.default.debug('received trackPublishedResponse', res);
            const resolve = this.pendingTrackResolvers[res.cid];
            if (!resolve) {
                logger_1.default.error('missing track resolver for ', res.cid);
                return;
            }
            delete this.pendingTrackResolvers[res.cid];
            resolve(res.track);
        };
        this.client.onTokenRefresh = (token) => {
            this.token = token;
        };
        this.client.onClose = () => {
            this.handleDisconnect('signal');
        };
        this.client.onLeave = (leave) => {
            if (leave === null || leave === void 0 ? void 0 : leave.canReconnect) {
                this.fullReconnect = true;
                this.primaryPC = undefined;
            }
            else {
                this.emit(events_2.EngineEvent.Disconnected);
                this.close();
            }
        };
    }
    restartConnection() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.url || !this.token) {
                // permanent failure, don't attempt reconnection
                throw new errors_1.UnexpectedConnectionState('could not reconnect, url or token not saved');
            }
            logger_1.default.info('reconnecting, attempt', this.reconnectAttempts);
            if (this.reconnectAttempts === 0) {
                this.emit(events_2.EngineEvent.Restarting);
            }
            this.primaryPC = undefined;
            (_a = this.publisher) === null || _a === void 0 ? void 0 : _a.close();
            this.publisher = undefined;
            (_b = this.subscriber) === null || _b === void 0 ? void 0 : _b.close();
            this.subscriber = undefined;
            let joinResponse;
            try {
                joinResponse = yield this.join(this.url, this.token, this.signalOpts);
            }
            catch (e) {
                throw new SignalReconnectError();
            }
            yield this.waitForPCConnected();
            // reconnect success
            this.emit(events_2.EngineEvent.Restarted, joinResponse);
        });
    }
    resumeConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.url || !this.token) {
                // permanent failure, don't attempt reconnection
                throw new errors_1.UnexpectedConnectionState('could not reconnect, url or token not saved');
            }
            // trigger publisher reconnect
            if (!this.publisher || !this.subscriber) {
                throw new errors_1.UnexpectedConnectionState('publisher and subscriber connections unset');
            }
            logger_1.default.info('resuming signal connection, attempt', this.reconnectAttempts);
            if (this.reconnectAttempts === 0) {
                this.emit(events_2.EngineEvent.Resuming);
            }
            try {
                yield this.client.reconnect(this.url, this.token);
            }
            catch (e) {
                throw new SignalReconnectError();
            }
            this.emit(events_2.EngineEvent.SignalResumed);
            this.subscriber.restartingIce = true;
            // only restart publisher if it's needed
            if (this.hasPublished) {
                yield this.publisher.createAndSendOffer({ iceRestart: true });
            }
            yield this.waitForPCConnected();
            // resume success
            this.emit(events_2.EngineEvent.Resumed);
        });
    }
    waitForPCConnected() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const startTime = (new Date()).getTime();
            let now = startTime;
            this.pcConnected = false;
            while (now - startTime < exports.maxICEConnectTimeout) {
                // if there is no connectionstatechange callback fired
                // check connectionstate after minReconnectWait
                if (this.primaryPC === undefined) {
                    // we can abort early, connection is hosed
                    break;
                }
                else if (now - startTime > minReconnectWait && ((_a = this.primaryPC) === null || _a === void 0 ? void 0 : _a.connectionState) === 'connected') {
                    this.pcConnected = true;
                }
                if (this.pcConnected) {
                    return;
                }
                yield utils_1.sleep(100);
                now = (new Date()).getTime();
            }
            // have not reconnected, throw
            throw new errors_1.ConnectionError('could not establish PC connection');
        });
    }
    /* @internal */
    sendDataPacket(packet, kind) {
        return __awaiter(this, void 0, void 0, function* () {
            const msg = livekit_models_1.DataPacket.encode(packet).finish();
            // make sure we do have a data connection
            yield this.ensurePublisherConnected(kind);
            if (kind === livekit_models_1.DataPacket_Kind.LOSSY && this.lossyDC) {
                this.lossyDC.send(msg);
            }
            else if (kind === livekit_models_1.DataPacket_Kind.RELIABLE && this.reliableDC) {
                this.reliableDC.send(msg);
            }
        });
    }
    ensurePublisherConnected(kind) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.subscriberPrimary) {
                return;
            }
            if (!this.publisher) {
                throw new errors_1.ConnectionError('publisher connection not set');
            }
            if (!this.publisher.isICEConnected && this.publisher.pc.iceConnectionState !== 'checking') {
                // start negotiation
                this.negotiate();
            }
            const targetChannel = this.dataChannelForKind(kind);
            if ((targetChannel === null || targetChannel === void 0 ? void 0 : targetChannel.readyState) === 'open') {
                return;
            }
            // wait until publisher ICE connected
            const endTime = (new Date()).getTime() + exports.maxICEConnectTimeout;
            while ((new Date()).getTime() < endTime) {
                if (this.publisher.isICEConnected && ((_a = this.dataChannelForKind(kind)) === null || _a === void 0 ? void 0 : _a.readyState) === 'open') {
                    return;
                }
                yield utils_1.sleep(50);
            }
            throw new errors_1.ConnectionError(`could not establish publisher connection, state ${(_b = this.publisher) === null || _b === void 0 ? void 0 : _b.pc.iceConnectionState}`);
        });
    }
    /** @internal */
    negotiate() {
        if (!this.publisher) {
            return;
        }
        this.hasPublished = true;
        this.publisher.negotiate();
    }
    dataChannelForKind(kind) {
        if (kind === livekit_models_1.DataPacket_Kind.LOSSY) {
            return this.lossyDC;
        }
        if (kind === livekit_models_1.DataPacket_Kind.RELIABLE) {
            return this.reliableDC;
        }
    }
}
exports["default"] = RTCEngine;
function getConnectedAddress(pc) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        let selectedCandidatePairId = '';
        const candidatePairs = new Map();
        // id -> candidate ip
        const candidates = new Map();
        const stats = yield pc.getStats();
        stats.forEach((v) => {
            switch (v.type) {
                case 'transport':
                    selectedCandidatePairId = v.selectedCandidatePairId;
                    break;
                case 'candidate-pair':
                    if (selectedCandidatePairId === '' && v.selected) {
                        selectedCandidatePairId = v.id;
                    }
                    candidatePairs.set(v.id, v);
                    break;
                case 'remote-candidate':
                    candidates.set(v.id, `${v.address}:${v.port}`);
                    break;
                default:
            }
        });
        if (selectedCandidatePairId === '') {
            return undefined;
        }
        const selectedID = (_a = candidatePairs.get(selectedCandidatePairId)) === null || _a === void 0 ? void 0 : _a.remoteCandidateId;
        if (selectedID === undefined) {
            return undefined;
        }
        return candidates.get(selectedID);
    });
}
class SignalReconnectError extends Error {
}
//# sourceMappingURL=RTCEngine.js.map

/***/ }),

/***/ 3258:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RoomState = void 0;
const events_1 = __webpack_require__(7187);
const SignalClient_1 = __webpack_require__(9286);
const logger_1 = __importDefault(__webpack_require__(2662));
const livekit_models_1 = __webpack_require__(8983);
const livekit_rtc_1 = __webpack_require__(4658);
const DeviceManager_1 = __importDefault(__webpack_require__(1480));
const errors_1 = __webpack_require__(7650);
const events_2 = __webpack_require__(8911);
const LocalParticipant_1 = __importDefault(__webpack_require__(4149));
const RemoteParticipant_1 = __importDefault(__webpack_require__(1488));
const RTCEngine_1 = __importStar(__webpack_require__(8947));
const defaults_1 = __webpack_require__(1442);
const RemoteTrackPublication_1 = __importDefault(__webpack_require__(297));
const Track_1 = __webpack_require__(410);
const utils_1 = __webpack_require__(1981);
var RoomState;
(function (RoomState) {
    RoomState["Disconnected"] = "disconnected";
    RoomState["Connected"] = "connected";
    RoomState["Reconnecting"] = "reconnecting";
})(RoomState = exports.RoomState || (exports.RoomState = {}));
/**
 * In LiveKit, a room is the logical grouping for a list of participants.
 * Participants in a room can publish tracks, and subscribe to others' tracks.
 *
 * a Room fires [[RoomEvent | RoomEvents]].
 *
 * @noInheritDoc
 */
class Room extends events_1.EventEmitter {
    /**
     * Creates a new Room, the primary construct for a LiveKit session.
     * @param options
     */
    constructor(options) {
        super();
        this.state = RoomState.Disconnected;
        /**
         * list of participants that are actively speaking. when this changes
         * a [[RoomEvent.ActiveSpeakersChanged]] event is fired
         */
        this.activeSpeakers = [];
        // available after connected
        /** server assigned unique room id */
        this.sid = '';
        /** user assigned name, derived from JWT token */
        this.name = '';
        /** room metadata */
        this.metadata = undefined;
        this.audioEnabled = true;
        this.connect = (url, token, opts) => __awaiter(this, void 0, void 0, function* () {
            // guard against calling connect
            if (this.state !== RoomState.Disconnected) {
                logger_1.default.warn('already connected to room', this.name);
                return;
            }
            // recreate engine if previously disconnected
            this.createEngine();
            this.acquireAudioContext();
            if (opts === null || opts === void 0 ? void 0 : opts.rtcConfig) {
                this.engine.rtcConfig = opts.rtcConfig;
            }
            this.connOptions = opts;
            try {
                const joinResponse = yield this.engine.join(url, token, opts);
                logger_1.default.debug('connected to Livekit Server', joinResponse.serverVersion);
                if (!joinResponse.serverVersion) {
                    throw new errors_1.UnsupportedServer('unknown server version');
                }
                if (joinResponse.serverVersion === '0.15.1' && this.options.dynacast) {
                    logger_1.default.debug('disabling dynacast due to server version');
                    // dynacast has a bug in 0.15.1, so we cannot use it then
                    this.options.dynacast = false;
                }
                this.state = RoomState.Connected;
                this.emit(events_2.RoomEvent.StateChanged, this.state);
                const pi = joinResponse.participant;
                this.localParticipant = new LocalParticipant_1.default(pi.sid, pi.identity, this.engine, this.options);
                this.localParticipant.updateInfo(pi);
                // forward metadata changed for the local participant
                this.localParticipant
                    .on(events_2.ParticipantEvent.MetadataChanged, (metadata) => {
                    this.emit(events_2.RoomEvent.MetadataChanged, metadata, this.localParticipant);
                })
                    .on(events_2.ParticipantEvent.ParticipantMetadataChanged, (metadata) => {
                    this.emit(events_2.RoomEvent.ParticipantMetadataChanged, metadata, this.localParticipant);
                })
                    .on(events_2.ParticipantEvent.TrackMuted, (pub) => {
                    this.emit(events_2.RoomEvent.TrackMuted, pub, this.localParticipant);
                })
                    .on(events_2.ParticipantEvent.TrackUnmuted, (pub) => {
                    this.emit(events_2.RoomEvent.TrackUnmuted, pub, this.localParticipant);
                })
                    .on(events_2.ParticipantEvent.LocalTrackPublished, (pub) => {
                    this.emit(events_2.RoomEvent.LocalTrackPublished, pub, this.localParticipant);
                })
                    .on(events_2.ParticipantEvent.LocalTrackUnpublished, (pub) => {
                    this.emit(events_2.RoomEvent.LocalTrackUnpublished, pub, this.localParticipant);
                })
                    .on(events_2.ParticipantEvent.ConnectionQualityChanged, (quality) => {
                    this.emit(events_2.RoomEvent.ConnectionQualityChanged, quality, this.localParticipant);
                })
                    .on(events_2.ParticipantEvent.MediaDevicesError, (e) => {
                    this.emit(events_2.RoomEvent.MediaDevicesError, e);
                });
                // populate remote participants, these should not trigger new events
                joinResponse.otherParticipants.forEach((info) => {
                    this.getOrCreateParticipant(info.sid, info);
                });
                this.name = joinResponse.room.name;
                this.sid = joinResponse.room.sid;
                this.metadata = joinResponse.room.metadata;
            }
            catch (err) {
                this.engine.close();
                throw err;
            }
            // don't return until ICE connected
            return new Promise((resolve, reject) => {
                const connectTimeout = setTimeout(() => {
                    // timeout
                    this.engine.close();
                    reject(new errors_1.ConnectionError('could not connect after timeout'));
                }, RTCEngine_1.maxICEConnectTimeout);
                this.engine.once(events_2.EngineEvent.Connected, () => {
                    clearTimeout(connectTimeout);
                    // also hook unload event
                    window.addEventListener('beforeunload', this.onBeforeUnload);
                    navigator.mediaDevices.addEventListener('devicechange', this.handleDeviceChange);
                    resolve(this);
                });
            });
        });
        /**
         * disconnects the room, emits [[RoomEvent.Disconnected]]
         */
        this.disconnect = (stopTracks = true) => {
            // send leave
            if (this.engine) {
                this.engine.client.sendLeave();
                this.engine.close();
            }
            this.handleDisconnect(stopTracks);
            /* @ts-ignore */
            this.engine = undefined;
        };
        this.onBeforeUnload = () => {
            this.disconnect();
        };
        this.handleRestarting = () => {
            this.state = RoomState.Reconnecting;
            this.emit(events_2.RoomEvent.Reconnecting);
            this.emit(events_2.RoomEvent.StateChanged, this.state);
            // also unwind existing participants & existing subscriptions
            for (const p of this.participants.values()) {
                this.handleParticipantDisconnected(p.sid, p);
            }
        };
        this.handleRestarted = (joinResponse) => __awaiter(this, void 0, void 0, function* () {
            this.state = RoomState.Connected;
            this.emit(events_2.RoomEvent.Reconnected);
            this.emit(events_2.RoomEvent.StateChanged, this.state);
            // rehydrate participants
            if (joinResponse.participant) {
                // with a restart, the sid will have changed, we'll map our understanding to it
                this.localParticipant.sid = joinResponse.participant.sid;
                this.handleParticipantUpdates([joinResponse.participant]);
            }
            this.handleParticipantUpdates(joinResponse.otherParticipants);
            // unpublish & republish tracks
            const localPubs = [];
            this.localParticipant.tracks.forEach((pub) => {
                if (pub.track) {
                    localPubs.push(pub);
                }
            });
            yield Promise.all(localPubs.map((pub) => __awaiter(this, void 0, void 0, function* () {
                const track = pub.track;
                this.localParticipant.unpublishTrack(track, false);
                this.localParticipant.publishTrack(track, pub.options);
            })));
        });
        this.handleParticipantUpdates = (participantInfos) => {
            // handle changes to participant state, and send events
            participantInfos.forEach((info) => {
                if (info.sid === this.localParticipant.sid
                    || info.identity === this.localParticipant.identity) {
                    this.localParticipant.updateInfo(info);
                    return;
                }
                let remoteParticipant = this.participants.get(info.sid);
                const isNewParticipant = !remoteParticipant;
                // create participant if doesn't exist
                remoteParticipant = this.getOrCreateParticipant(info.sid, info);
                // when it's disconnected, send updates
                if (info.state === livekit_models_1.ParticipantInfo_State.DISCONNECTED) {
                    this.handleParticipantDisconnected(info.sid, remoteParticipant);
                }
                else if (isNewParticipant) {
                    // fire connected event
                    this.emit(events_2.RoomEvent.ParticipantConnected, remoteParticipant);
                }
                else {
                    // just update, no events
                    remoteParticipant.updateInfo(info);
                }
            });
        };
        // updates are sent only when there's a change to speaker ordering
        this.handleActiveSpeakersUpdate = (speakers) => {
            const activeSpeakers = [];
            const seenSids = {};
            speakers.forEach((speaker) => {
                seenSids[speaker.sid] = true;
                if (speaker.sid === this.localParticipant.sid) {
                    this.localParticipant.audioLevel = speaker.level;
                    this.localParticipant.setIsSpeaking(true);
                    activeSpeakers.push(this.localParticipant);
                }
                else {
                    const p = this.participants.get(speaker.sid);
                    if (p) {
                        p.audioLevel = speaker.level;
                        p.setIsSpeaking(true);
                        activeSpeakers.push(p);
                    }
                }
            });
            if (!seenSids[this.localParticipant.sid]) {
                this.localParticipant.audioLevel = 0;
                this.localParticipant.setIsSpeaking(false);
            }
            this.participants.forEach((p) => {
                if (!seenSids[p.sid]) {
                    p.audioLevel = 0;
                    p.setIsSpeaking(false);
                }
            });
            this.activeSpeakers = activeSpeakers;
            this.emit(events_2.RoomEvent.ActiveSpeakersChanged, activeSpeakers);
        };
        // process list of changed speakers
        this.handleSpeakersChanged = (speakerUpdates) => {
            const lastSpeakers = new Map();
            this.activeSpeakers.forEach((p) => {
                lastSpeakers.set(p.sid, p);
            });
            speakerUpdates.forEach((speaker) => {
                let p = this.participants.get(speaker.sid);
                if (speaker.sid === this.localParticipant.sid) {
                    p = this.localParticipant;
                }
                if (!p) {
                    return;
                }
                p.audioLevel = speaker.level;
                p.setIsSpeaking(speaker.active);
                if (speaker.active) {
                    lastSpeakers.set(speaker.sid, p);
                }
                else {
                    lastSpeakers.delete(speaker.sid);
                }
            });
            const activeSpeakers = Array.from(lastSpeakers.values());
            activeSpeakers.sort((a, b) => b.audioLevel - a.audioLevel);
            this.activeSpeakers = activeSpeakers;
            this.emit(events_2.RoomEvent.ActiveSpeakersChanged, activeSpeakers);
        };
        this.handleStreamStateUpdate = (streamStateUpdate) => {
            streamStateUpdate.streamStates.forEach((streamState) => {
                const participant = this.participants.get(streamState.participantSid);
                if (!participant) {
                    return;
                }
                const pub = participant.getTrackPublication(streamState.trackSid);
                if (!pub || !pub.track) {
                    return;
                }
                pub.track.streamState = Track_1.Track.streamStateFromProto(streamState.state);
                participant.emit(events_2.ParticipantEvent.TrackStreamStateChanged, pub, pub.track.streamState);
                this.emit(events_2.ParticipantEvent.TrackStreamStateChanged, pub, pub.track.streamState, participant);
            });
        };
        this.handleSubscriptionPermissionUpdate = (update) => {
            const participant = this.participants.get(update.participantSid);
            if (!participant) {
                return;
            }
            const pub = participant.getTrackPublication(update.trackSid);
            if (!pub) {
                return;
            }
            pub._allowed = update.allowed;
            participant.emit(events_2.ParticipantEvent.TrackSubscriptionPermissionChanged, pub, pub.subscriptionStatus);
            this.emit(events_2.ParticipantEvent.TrackSubscriptionPermissionChanged, pub, pub.subscriptionStatus, participant);
        };
        this.handleDataPacket = (userPacket, kind) => {
            // find the participant
            const participant = this.participants.get(userPacket.participantSid);
            this.emit(events_2.RoomEvent.DataReceived, userPacket.payload, participant, kind);
            // also emit on the participant
            participant === null || participant === void 0 ? void 0 : participant.emit(events_2.ParticipantEvent.DataReceived, userPacket.payload, kind);
        };
        this.handleAudioPlaybackStarted = () => {
            if (this.canPlaybackAudio) {
                return;
            }
            this.audioEnabled = true;
            this.emit(events_2.RoomEvent.AudioPlaybackStatusChanged, true);
        };
        this.handleAudioPlaybackFailed = (e) => {
            logger_1.default.warn('could not playback audio', e);
            if (!this.canPlaybackAudio) {
                return;
            }
            this.audioEnabled = false;
            this.emit(events_2.RoomEvent.AudioPlaybackStatusChanged, false);
        };
        this.handleDeviceChange = () => __awaiter(this, void 0, void 0, function* () {
            this.emit(events_2.RoomEvent.MediaDevicesChanged);
        });
        this.handleRoomUpdate = (r) => {
            this.metadata = r.metadata;
            this.emit(events_2.RoomEvent.RoomMetadataChanged, r.metadata);
        };
        this.handleConnectionQualityUpdate = (update) => {
            update.updates.forEach((info) => {
                if (info.participantSid === this.localParticipant.sid) {
                    this.localParticipant.setConnectionQuality(info.quality);
                    return;
                }
                const participant = this.participants.get(info.participantSid);
                if (participant) {
                    participant.setConnectionQuality(info.quality);
                }
            });
        };
        this.participants = new Map();
        this.options = options || {};
        this.options.audioCaptureDefaults = Object.assign(Object.assign({}, defaults_1.audioDefaults), options === null || options === void 0 ? void 0 : options.audioCaptureDefaults);
        this.options.videoCaptureDefaults = Object.assign(Object.assign({}, defaults_1.videoDefaults), options === null || options === void 0 ? void 0 : options.videoCaptureDefaults);
        this.options.publishDefaults = Object.assign(Object.assign({}, defaults_1.publishDefaults), options === null || options === void 0 ? void 0 : options.publishDefaults);
        this.createEngine();
        this.localParticipant = new LocalParticipant_1.default('', '', this.engine, this.options);
    }
    createEngine() {
        if (this.engine) {
            return;
        }
        this.engine = new RTCEngine_1.default();
        this.engine.client.signalLatency = this.options.expSignalLatency;
        this.engine.client.onParticipantUpdate = this.handleParticipantUpdates;
        this.engine.client.onRoomUpdate = this.handleRoomUpdate;
        this.engine.client.onSpeakersChanged = this.handleSpeakersChanged;
        this.engine.client.onStreamStateUpdate = this.handleStreamStateUpdate;
        this.engine.client.onSubscriptionPermissionUpdate = this.handleSubscriptionPermissionUpdate;
        this.engine.client.onConnectionQuality = this.handleConnectionQualityUpdate;
        this.engine
            .on(events_2.EngineEvent.MediaTrackAdded, (mediaTrack, stream, receiver) => {
            this.onTrackAdded(mediaTrack, stream, receiver);
        })
            .on(events_2.EngineEvent.Disconnected, () => {
            this.handleDisconnect();
        })
            .on(events_2.EngineEvent.ActiveSpeakersUpdate, this.handleActiveSpeakersUpdate)
            .on(events_2.EngineEvent.DataPacketReceived, this.handleDataPacket)
            .on(events_2.EngineEvent.Resuming, () => {
            this.state = RoomState.Reconnecting;
            this.emit(events_2.RoomEvent.Reconnecting);
            this.emit(events_2.RoomEvent.StateChanged, this.state);
        })
            .on(events_2.EngineEvent.Resumed, () => {
            this.state = RoomState.Connected;
            this.emit(events_2.RoomEvent.Reconnected);
            this.emit(events_2.RoomEvent.StateChanged, this.state);
            this.updateSubscriptions();
        })
            .on(events_2.EngineEvent.SignalResumed, () => {
            if (this.state === RoomState.Reconnecting) {
                this.sendSyncState();
            }
        })
            .on(events_2.EngineEvent.Restarting, this.handleRestarting)
            .on(events_2.EngineEvent.Restarted, this.handleRestarted);
    }
    /**
     * getLocalDevices abstracts navigator.mediaDevices.enumerateDevices.
     * In particular, it handles Chrome's unique behavior of creating `default`
     * devices. When encountered, it'll be removed from the list of devices.
     * The actual default device will be placed at top.
     * @param kind
     * @returns a list of available local devices
     */
    static getLocalDevices(kind) {
        return DeviceManager_1.default.getInstance().getDevices(kind);
    }
    /**
     * retrieves a participant by identity
     * @param identity
     * @returns
     */
    getParticipantByIdentity(identity) {
        for (const [, p] of this.participants) {
            if (p.identity === identity) {
                return p;
            }
        }
        if (this.localParticipant.identity === identity) {
            return this.localParticipant;
        }
    }
    /**
     * @internal for testing
     */
    simulateScenario(scenario) {
        let req;
        switch (scenario) {
            case 'speaker':
                req = livekit_rtc_1.SimulateScenario.fromPartial({
                    speakerUpdate: 3,
                });
                break;
            case 'node-failure':
                req = livekit_rtc_1.SimulateScenario.fromPartial({
                    nodeFailure: true,
                });
                break;
            case 'server-leave':
                req = livekit_rtc_1.SimulateScenario.fromPartial({
                    serverLeave: true,
                });
                break;
            case 'migration':
                req = livekit_rtc_1.SimulateScenario.fromPartial({
                    migration: true,
                });
                break;
            default:
        }
        if (req) {
            this.engine.client.sendSimulateScenario(req);
        }
    }
    /**
     * Browsers have different policies regarding audio playback. Most requiring
     * some form of user interaction (click/tap/etc).
     * In those cases, audio will be silent until a click/tap triggering one of the following
     * - `startAudio`
     * - `getUserMedia`
     */
    startAudio() {
        return __awaiter(this, void 0, void 0, function* () {
            this.acquireAudioContext();
            const elements = [];
            this.participants.forEach((p) => {
                p.audioTracks.forEach((t) => {
                    if (t.track) {
                        t.track.attachedElements.forEach((e) => {
                            elements.push(e);
                        });
                    }
                });
            });
            try {
                yield Promise.all(elements.map((e) => e.play()));
                this.handleAudioPlaybackStarted();
            }
            catch (err) {
                this.handleAudioPlaybackFailed(err);
                throw err;
            }
        });
    }
    /**
     * Returns true if audio playback is enabled
     */
    get canPlaybackAudio() {
        return this.audioEnabled;
    }
    /**
     * Switches all active device used in this room to the given device.
     *
     * Note: setting AudioOutput is not supported on some browsers. See [setSinkId](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/setSinkId#browser_compatibility)
     *
     * @param kind use `videoinput` for camera track,
     *  `audioinput` for microphone track,
     *  `audiooutput` to set speaker for all incoming audio tracks
     * @param deviceId
     */
    switchActiveDevice(kind, deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (kind === 'audioinput') {
                const tracks = Array
                    .from(this.localParticipant.audioTracks.values())
                    .filter((track) => track.source === Track_1.Track.Source.Microphone);
                yield Promise.all(tracks.map((t) => { var _a; return (_a = t.audioTrack) === null || _a === void 0 ? void 0 : _a.setDeviceId(deviceId); }));
                this.options.audioCaptureDefaults.deviceId = deviceId;
            }
            else if (kind === 'videoinput') {
                const tracks = Array
                    .from(this.localParticipant.videoTracks.values())
                    .filter((track) => track.source === Track_1.Track.Source.Camera);
                yield Promise.all(tracks.map((t) => { var _a; return (_a = t.videoTrack) === null || _a === void 0 ? void 0 : _a.setDeviceId(deviceId); }));
                this.options.videoCaptureDefaults.deviceId = deviceId;
            }
            else if (kind === 'audiooutput') {
                const elements = [];
                this.participants.forEach((p) => {
                    p.audioTracks.forEach((t) => {
                        if (t.isSubscribed && t.track) {
                            t.track.attachedElements.forEach((e) => {
                                elements.push(e);
                            });
                        }
                    });
                });
                yield Promise.all(elements.map((e) => __awaiter(this, void 0, void 0, function* () {
                    if ('setSinkId' in e) {
                        /* @ts-ignore */
                        yield e.setSinkId(deviceId);
                    }
                })));
            }
        });
    }
    onTrackAdded(mediaTrack, stream, receiver) {
        const parts = utils_1.unpackStreamId(stream.id);
        const participantId = parts[0];
        let trackId = parts[1];
        if (!trackId || trackId === '')
            trackId = mediaTrack.id;
        const participant = this.getOrCreateParticipant(participantId);
        participant.addSubscribedMediaTrack(mediaTrack, trackId, stream, receiver, this.options.adaptiveStream);
    }
    handleDisconnect(shouldStopTracks = true) {
        if (this.state === RoomState.Disconnected) {
            return;
        }
        this.participants.forEach((p) => {
            p.tracks.forEach((pub) => {
                p.unpublishTrack(pub.trackSid);
            });
        });
        this.localParticipant.tracks.forEach((pub) => {
            var _a, _b;
            if (pub.track) {
                this.localParticipant.unpublishTrack(pub.track);
            }
            if (shouldStopTracks) {
                (_a = pub.track) === null || _a === void 0 ? void 0 : _a.detach();
                (_b = pub.track) === null || _b === void 0 ? void 0 : _b.stop();
            }
        });
        this.participants.clear();
        this.activeSpeakers = [];
        if (this.audioContext) {
            this.audioContext.close();
            this.audioContext = undefined;
        }
        window.removeEventListener('beforeunload', this.onBeforeUnload);
        navigator.mediaDevices.removeEventListener('devicechange', this.handleDeviceChange);
        this.state = RoomState.Disconnected;
        this.emit(events_2.RoomEvent.Disconnected);
        this.emit(events_2.RoomEvent.StateChanged, this.state);
    }
    handleParticipantDisconnected(sid, participant) {
        // remove and send event
        this.participants.delete(sid);
        if (!participant) {
            return;
        }
        participant.tracks.forEach((publication) => {
            participant.unpublishTrack(publication.trackSid);
        });
        this.emit(events_2.RoomEvent.ParticipantDisconnected, participant);
    }
    acquireAudioContext() {
        if (this.audioContext) {
            this.audioContext.close();
        }
        // by using an AudioContext, it reduces lag on audio elements
        // https://stackoverflow.com/questions/9811429/html5-audio-tag-on-safari-has-a-delay/54119854#54119854
        // @ts-ignore
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
            this.audioContext = new AudioContext();
        }
    }
    createParticipant(id, info) {
        let participant;
        if (info) {
            participant = RemoteParticipant_1.default.fromParticipantInfo(this.engine.client, info);
        }
        else {
            participant = new RemoteParticipant_1.default(this.engine.client, id, '');
        }
        return participant;
    }
    getOrCreateParticipant(id, info) {
        if (this.participants.has(id)) {
            return this.participants.get(id);
        }
        // it's possible for the RTC track to arrive before signaling data
        // when this happens, we'll create the participant and make the track work
        const participant = this.createParticipant(id, info);
        this.participants.set(id, participant);
        // also forward events
        // trackPublished is only fired for tracks added after both local participant
        // and remote participant joined the room
        participant
            .on(events_2.ParticipantEvent.TrackPublished, (trackPublication) => {
            this.emit(events_2.RoomEvent.TrackPublished, trackPublication, participant);
        })
            .on(events_2.ParticipantEvent.TrackSubscribed, (track, publication) => {
            // monitor playback status
            if (track.kind === Track_1.Track.Kind.Audio) {
                track.on(events_2.TrackEvent.AudioPlaybackStarted, this.handleAudioPlaybackStarted);
                track.on(events_2.TrackEvent.AudioPlaybackFailed, this.handleAudioPlaybackFailed);
            }
            this.emit(events_2.RoomEvent.TrackSubscribed, track, publication, participant);
        })
            .on(events_2.ParticipantEvent.TrackUnpublished, (publication) => {
            this.emit(events_2.RoomEvent.TrackUnpublished, publication, participant);
        })
            .on(events_2.ParticipantEvent.TrackUnsubscribed, (track, publication) => {
            this.emit(events_2.RoomEvent.TrackUnsubscribed, track, publication, participant);
        })
            .on(events_2.ParticipantEvent.TrackSubscriptionFailed, (sid) => {
            this.emit(events_2.RoomEvent.TrackSubscriptionFailed, sid, participant);
        })
            .on(events_2.ParticipantEvent.TrackMuted, (pub) => {
            this.emit(events_2.RoomEvent.TrackMuted, pub, participant);
        })
            .on(events_2.ParticipantEvent.TrackUnmuted, (pub) => {
            this.emit(events_2.RoomEvent.TrackUnmuted, pub, participant);
        })
            .on(events_2.ParticipantEvent.MetadataChanged, (metadata) => {
            this.emit(events_2.RoomEvent.MetadataChanged, metadata, participant);
        })
            .on(events_2.ParticipantEvent.ParticipantMetadataChanged, (metadata) => {
            this.emit(events_2.RoomEvent.ParticipantMetadataChanged, metadata, participant);
        })
            .on(events_2.ParticipantEvent.ConnectionQualityChanged, (quality) => {
            this.emit(events_2.RoomEvent.ConnectionQualityChanged, quality, participant);
        });
        return participant;
    }
    sendSyncState() {
        var _a;
        if (this.engine.subscriber === undefined
            || this.engine.subscriber.pc.localDescription === null) {
            return;
        }
        const previousSdp = this.engine.subscriber.pc.localDescription;
        /* 1. autosubscribe on, so subscribed tracks = all tracks - unsub tracks,
              in this case, we send unsub tracks, so server add all tracks to this
              subscribe pc and unsub special tracks from it.
           2. autosubscribe off, we send subscribed tracks.
        */
        const sendUnsub = ((_a = this.connOptions) === null || _a === void 0 ? void 0 : _a.autoSubscribe) || false;
        const trackSids = new Array();
        this.participants.forEach((participant) => {
            participant.tracks.forEach((track) => {
                if (track.isSubscribed !== sendUnsub) {
                    trackSids.push(track.trackSid);
                }
            });
        });
        this.engine.client.sendSyncState({
            answer: SignalClient_1.toProtoSessionDescription({
                sdp: previousSdp.sdp,
                type: previousSdp.type,
            }),
            subscription: {
                trackSids,
                subscribe: !sendUnsub,
                participantTracks: [],
            },
            publishTracks: this.localParticipant.publishedTracksInfo(),
        });
    }
    /**
     * After resuming, we'll need to notify the server of the current
     * subscription settings.
     */
    updateSubscriptions() {
        for (const p of this.participants.values()) {
            for (const pub of p.videoTracks.values()) {
                if (pub.isSubscribed && pub instanceof RemoteTrackPublication_1.default) {
                    pub.emitTrackUpdate();
                }
            }
        }
    }
    // /** @internal */
    emit(event, ...args) {
        logger_1.default.debug('room event', event, ...args);
        return super.emit(event, ...args);
    }
}
exports["default"] = Room;
//# sourceMappingURL=Room.js.map

/***/ }),

/***/ 7650:
/***/ (function(__unused_webpack_module, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MediaDeviceFailure = exports.PublishDataError = exports.UnexpectedConnectionState = exports.UnsupportedServer = exports.TrackInvalidError = exports.ConnectionError = exports.LivekitError = void 0;
class LivekitError extends Error {
    constructor(code, message) {
        super(message || 'an error has occured');
        this.code = code;
    }
}
exports.LivekitError = LivekitError;
class ConnectionError extends LivekitError {
    constructor(message) {
        super(1, message);
    }
}
exports.ConnectionError = ConnectionError;
class TrackInvalidError extends LivekitError {
    constructor(message) {
        super(20, message || 'Track is invalid');
    }
}
exports.TrackInvalidError = TrackInvalidError;
class UnsupportedServer extends LivekitError {
    constructor(message) {
        super(10, message || 'Unsupported server');
    }
}
exports.UnsupportedServer = UnsupportedServer;
class UnexpectedConnectionState extends LivekitError {
    constructor(message) {
        super(12, message || 'Unexpected connection state');
    }
}
exports.UnexpectedConnectionState = UnexpectedConnectionState;
class PublishDataError extends LivekitError {
    constructor(message) {
        super(13, message || 'Unable to publish data');
    }
}
exports.PublishDataError = PublishDataError;
var MediaDeviceFailure;
(function (MediaDeviceFailure) {
    // user rejected permissions
    MediaDeviceFailure["PermissionDenied"] = "PermissionDenied";
    // device is not available
    MediaDeviceFailure["NotFound"] = "NotFound";
    // device is in use. On Windows, only a single tab may get access to a device at a time.
    MediaDeviceFailure["DeviceInUse"] = "DeviceInUse";
    MediaDeviceFailure["Other"] = "Other";
})(MediaDeviceFailure = exports.MediaDeviceFailure || (exports.MediaDeviceFailure = {}));
(function (MediaDeviceFailure) {
    function getFailure(error) {
        if (error && 'name' in error) {
            if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
                return MediaDeviceFailure.NotFound;
            }
            if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
                return MediaDeviceFailure.PermissionDenied;
            }
            if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
                return MediaDeviceFailure.DeviceInUse;
            }
            return MediaDeviceFailure.Other;
        }
    }
    MediaDeviceFailure.getFailure = getFailure;
})(MediaDeviceFailure = exports.MediaDeviceFailure || (exports.MediaDeviceFailure = {}));
//# sourceMappingURL=errors.js.map

/***/ }),

/***/ 8911:
/***/ (function(__unused_webpack_module, exports) {

"use strict";

/**
 * Events are the primary way LiveKit notifies your application of changes.
 *
 * The following are events emitted by [[Room]], listen to room events like
 *
 * ```typescript
 * room.on(RoomEvent.TrackPublished, (track, publication, participant) => {})
 * ```
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TrackEvent = exports.EngineEvent = exports.ParticipantEvent = exports.RoomEvent = void 0;
var RoomEvent;
(function (RoomEvent) {
    /**
     * When the connection to the server has been interrupted and it's attempting
     * to reconnect.
     */
    RoomEvent["Reconnecting"] = "reconnecting";
    /**
     * Fires when a reconnection has been successful.
     */
    RoomEvent["Reconnected"] = "reconnected";
    /**
     * When disconnected from room. This fires when room.disconnect() is called or
     * when an unrecoverable connection issue had occured
     */
    RoomEvent["Disconnected"] = "disconnected";
    /**
     * Whenever the connection state of the room changes
     *
     * args: ([[RoomState]])
     */
    RoomEvent["StateChanged"] = "stateChanged";
    /**
     * When input or output devices on the machine have changed.
     */
    RoomEvent["MediaDevicesChanged"] = "mediaDevicesChanged";
    /**
     * When a [[RemoteParticipant]] joins *after* the local
     * participant. It will not emit events for participants that are already
     * in the room
     *
     * args: ([[RemoteParticipant]])
     */
    RoomEvent["ParticipantConnected"] = "participantConnected";
    /**
     * When a [[RemoteParticipant]] leaves *after* the local
     * participant has joined.
     *
     * args: ([[RemoteParticipant]])
     */
    RoomEvent["ParticipantDisconnected"] = "participantDisconnected";
    /**
     * When a new track is published to room *after* the local
     * participant has joined. It will not fire for tracks that are already published.
     *
     * A track published doesn't mean the participant has subscribed to it. It's
     * simply reflecting the state of the room.
     *
     * args: ([[RemoteTrackPublication]], [[RemoteParticipant]])
     */
    RoomEvent["TrackPublished"] = "trackPublished";
    /**
     * The [[LocalParticipant]] has subscribed to a new track. This event will **always**
     * fire as long as new tracks are ready for use.
     *
     * args: ([[RemoteTrack]], [[RemoteTrackPublication]], [[RemoteParticipant]])
     */
    RoomEvent["TrackSubscribed"] = "trackSubscribed";
    /**
     * Could not subscribe to a track
     *
     * args: (track sid, [[RemoteParticipant]])
     */
    RoomEvent["TrackSubscriptionFailed"] = "trackSubscriptionFailed";
    /**
     * A [[RemoteParticipant]] has unpublished a track
     *
     * args: ([[RemoteTrackPublication]], [[RemoteParticipant]])
     */
    RoomEvent["TrackUnpublished"] = "trackUnpublished";
    /**
     * A subscribed track is no longer available. Clients should listen to this
     * event and ensure they detach tracks.
     *
     * args: ([[Track]], [[RemoteTrackPublication]], [[RemoteParticipant]])
     */
    RoomEvent["TrackUnsubscribed"] = "trackUnsubscribed";
    /**
     * A track that was muted, fires on both [[RemoteParticipant]]s and [[LocalParticipant]]
     *
     * args: ([[TrackPublication]], [[Participant]])
     */
    RoomEvent["TrackMuted"] = "trackMuted";
    /**
     * A track that was unmuted, fires on both [[RemoteParticipant]]s and [[LocalParticipant]]
     *
     * args: ([[TrackPublication]], [[Participant]])
     */
    RoomEvent["TrackUnmuted"] = "trackUnmuted";
    /**
     * A local track was published successfully. This event is helpful to know
     * when to update your local UI with the newly published track.
     *
     * args: ([[LocalTrackPublication]], [[LocalParticipant]])
     */
    RoomEvent["LocalTrackPublished"] = "localTrackPublished";
    /**
     * A local track was unpublished. This event is helpful to know when to remove
     * the local track from your UI.
     *
     * When a user stops sharing their screen by pressing "End" on the browser UI,
     * this event will also fire.
     *
     * args: ([[LocalTrackPublication]], [[LocalParticipant]])
     */
    RoomEvent["LocalTrackUnpublished"] = "localTrackUnpublished";
    /**
     * Active speakers changed. List of speakers are ordered by their audio level.
     * loudest speakers first. This will include the LocalParticipant too.
     *
     * Speaker updates are sent only to the publishing participant and their subscribers.
     *
     * args: (Array<[[Participant]]>)
     */
    RoomEvent["ActiveSpeakersChanged"] = "activeSpeakersChanged";
    /**
     * @deprecated Use ParticipantMetadataChanged instead
     * @internal
     */
    RoomEvent["MetadataChanged"] = "metadataChanged";
    /**
     * Participant metadata is a simple way for app-specific state to be pushed to
     * all users.
     * When RoomService.UpdateParticipantMetadata is called to change a participant's
     * state, *all*  participants in the room will fire this event.
     *
     * args: (prevMetadata: string, [[Participant]])
     *
     */
    RoomEvent["ParticipantMetadataChanged"] = "participantMetadataChanged";
    /**
     * Room metadata is a simple way for app-specific state to be pushed to
     * all users.
     * When RoomService.UpdateRoomMetadata is called to change a room's state,
     * *all*  participants in the room will fire this event.
     *
     * args: (string)
     */
    RoomEvent["RoomMetadataChanged"] = "roomMetadataChanged";
    /**
     * Data received from another participant.
     * Data packets provides the ability to use LiveKit to send/receive arbitrary payloads.
     * All participants in the room will receive the messages sent to the room.
     *
     * args: (payload: Uint8Array, participant: [[Participant]], kind: [[DataPacket_Kind]])
     */
    RoomEvent["DataReceived"] = "dataReceived";
    /**
     * Connection quality was changed for a Participant. It'll receive updates
     * from the local participant, as well as any [[RemoteParticipant]]s that we are
     * subscribed to.
     *
     * args: (connectionQuality: [[ConnectionQuality]], participant: [[Participant]])
     */
    RoomEvent["ConnectionQualityChanged"] = "connectionQualityChanged";
    /**
     * StreamState indicates if a subscribed track has been paused by the SFU
     * (typically this happens because of subscriber's bandwidth constraints)
     *
     * When bandwidth conditions allow, the track will be resumed automatically.
     * TrackStreamStateChanged will also be emitted when that happens.
     *
     * args: (pub: [[RemoteTrackPublication]], streamState: [[Track.StreamState]],
     *        participant: [[RemoteParticipant]])
     */
    RoomEvent["TrackStreamStateChanged"] = "trackStreamStateChanged";
    /**
     * One of subscribed tracks have changed its permissions for the current
     * participant. If permission was revoked, then the track will no longer
     * be subscribed. If permission was granted, a TrackSubscribed event will
     * be emitted.
     *
     * args: (pub: [[RemoteTrackPublication]],
     *        status: [[TrackPublication.SubscriptionStatus]],
     *        participant: [[RemoteParticipant]])
     */
    RoomEvent["TrackSubscriptionPermissionChanged"] = "trackSubscriptionPermissionChanged";
    /**
     * LiveKit will attempt to autoplay all audio tracks when you attach them to
     * audio elements. However, if that fails, we'll notify you via AudioPlaybackStatusChanged.
     * `Room.canPlayAudio` will indicate if audio playback is permitted.
     */
    RoomEvent["AudioPlaybackStatusChanged"] = "audioPlaybackChanged";
    /**
     * When we have encountered an error while attempting to create a track.
     * The errors take place in getUserMedia().
     * Use MediaDeviceFailure.getFailure(error) to get the reason of failure.
     * [[getAudioCreateError]] and [[getVideoCreateError]] will indicate if it had
     * an error while creating the audio or video track respectively.
     *
     * args: (error: Error)
     */
    RoomEvent["MediaDevicesError"] = "mediaDevicesError";
})(RoomEvent = exports.RoomEvent || (exports.RoomEvent = {}));
var ParticipantEvent;
(function (ParticipantEvent) {
    /**
     * When a new track is published to room *after* the local
     * participant has joined. It will not fire for tracks that are already published.
     *
     * A track published doesn't mean the participant has subscribed to it. It's
     * simply reflecting the state of the room.
     *
     * args: ([[RemoteTrackPublication]])
     */
    ParticipantEvent["TrackPublished"] = "trackPublished";
    /**
     * Successfully subscribed to the [[RemoteParticipant]]'s track.
     * This event will **always** fire as long as new tracks are ready for use.
     *
     * args: ([[RemoteTrack]], [[RemoteTrackPublication]])
     */
    ParticipantEvent["TrackSubscribed"] = "trackSubscribed";
    /**
     * Could not subscribe to a track
     *
     * args: (track sid)
     */
    ParticipantEvent["TrackSubscriptionFailed"] = "trackSubscriptionFailed";
    /**
     * A [[RemoteParticipant]] has unpublished a track
     *
     * args: ([[RemoteTrackPublication]])
     */
    ParticipantEvent["TrackUnpublished"] = "trackUnpublished";
    /**
     * A subscribed track is no longer available. Clients should listen to this
     * event and ensure they detach tracks.
     *
     * args: ([[RemoteTrack]], [[RemoteTrackPublication]])
     */
    ParticipantEvent["TrackUnsubscribed"] = "trackUnsubscribed";
    /**
     * A track that was muted, fires on both [[RemoteParticipant]]s and [[LocalParticipant]]
     *
     * args: ([[TrackPublication]])
     */
    ParticipantEvent["TrackMuted"] = "trackMuted";
    /**
     * A track that was unmuted, fires on both [[RemoteParticipant]]s and [[LocalParticipant]]
     *
     * args: ([[TrackPublication]])
     */
    ParticipantEvent["TrackUnmuted"] = "trackUnmuted";
    /**
     * A local track was published successfully. This event is helpful to know
     * when to update your local UI with the newly published track.
     *
     * args: ([[LocalTrackPublication]])
     */
    ParticipantEvent["LocalTrackPublished"] = "localTrackPublished";
    /**
     * A local track was unpublished. This event is helpful to know when to remove
     * the local track from your UI.
     *
     * When a user stops sharing their screen by pressing "End" on the browser UI,
     * this event will also fire.
     *
     * args: ([[LocalTrackPublication]])
     */
    ParticipantEvent["LocalTrackUnpublished"] = "localTrackUnpublished";
    /**
     * @deprecated Use ParticipantMetadataChanged instead
     * @internal
     */
    ParticipantEvent["MetadataChanged"] = "metadataChanged";
    /**
     * Participant metadata is a simple way for app-specific state to be pushed to
     * all users.
     * When RoomService.UpdateParticipantMetadata is called to change a participant's
     * state, *all*  participants in the room will fire this event.
     * To access the current metadata, see [[Participant.metadata]].
     *
     * args: (prevMetadata: string)
     *
     */
    ParticipantEvent["ParticipantMetadataChanged"] = "participantMetadataChanged";
    /**
     * Data received from this participant as sender.
     * Data packets provides the ability to use LiveKit to send/receive arbitrary payloads.
     * All participants in the room will receive the messages sent to the room.
     *
     * args: (payload: Uint8Array, kind: [[DataPacket_Kind]])
     */
    ParticipantEvent["DataReceived"] = "dataReceived";
    /**
     * Has speaking status changed for the current participant
     *
     * args: (speaking: boolean)
     */
    ParticipantEvent["IsSpeakingChanged"] = "isSpeakingChanged";
    /**
     * Connection quality was changed for a Participant. It'll receive updates
     * from the local participant, as well as any [[RemoteParticipant]]s that we are
     * subscribed to.
     *
     * args: (connectionQuality: [[ConnectionQuality]])
     */
    ParticipantEvent["ConnectionQualityChanged"] = "connectionQualityChanged";
    /**
     * StreamState indicates if a subscribed track has been paused by the SFU
     * (typically this happens because of subscriber's bandwidth constraints)
     *
     * When bandwidth conditions allow, the track will be resumed automatically.
     * TrackStreamStateChanged will also be emitted when that happens.
     *
     * args: (pub: [[RemoteTrackPublication]], streamState: [[Track.StreamState]])
     */
    ParticipantEvent["TrackStreamStateChanged"] = "trackStreamStateChanged";
    /**
     * One of subscribed tracks have changed its permissions for the current
     * participant. If permission was revoked, then the track will no longer
     * be subscribed. If permission was granted, a TrackSubscribed event will
     * be emitted.
     *
     * args: (pub: [[RemoteTrackPublication]],
     *        status: [[TrackPublication.SubscriptionStatus]])
     */
    ParticipantEvent["TrackSubscriptionPermissionChanged"] = "trackSubscriptionPermissionChanged";
    // fired only on LocalParticipant
    /** @internal */
    ParticipantEvent["MediaDevicesError"] = "mediaDevicesError";
})(ParticipantEvent = exports.ParticipantEvent || (exports.ParticipantEvent = {}));
/** @internal */
var EngineEvent;
(function (EngineEvent) {
    EngineEvent["TransportsCreated"] = "transportsCreated";
    EngineEvent["Connected"] = "connected";
    EngineEvent["Disconnected"] = "disconnected";
    EngineEvent["Resuming"] = "resuming";
    EngineEvent["Resumed"] = "resumed";
    EngineEvent["Restarting"] = "restarting";
    EngineEvent["Restarted"] = "restarted";
    EngineEvent["SignalResumed"] = "signalResumed";
    EngineEvent["MediaTrackAdded"] = "mediaTrackAdded";
    EngineEvent["ActiveSpeakersUpdate"] = "activeSpeakersUpdate";
    EngineEvent["DataPacketReceived"] = "dataPacketReceived";
})(EngineEvent = exports.EngineEvent || (exports.EngineEvent = {}));
var TrackEvent;
(function (TrackEvent) {
    TrackEvent["Message"] = "message";
    TrackEvent["Muted"] = "muted";
    TrackEvent["Unmuted"] = "unmuted";
    TrackEvent["Ended"] = "ended";
    /** @internal */
    TrackEvent["UpdateSettings"] = "updateSettings";
    /** @internal */
    TrackEvent["UpdateSubscription"] = "updateSubscription";
    /** @internal */
    TrackEvent["AudioPlaybackStarted"] = "audioPlaybackStarted";
    /** @internal */
    TrackEvent["AudioPlaybackFailed"] = "audioPlaybackFailed";
    /** @internal */
    TrackEvent["VisibilityChanged"] = "visibilityChanged";
    /** @internal */
    TrackEvent["VideoDimensionsChanged"] = "videoDimensionsChanged";
})(TrackEvent = exports.TrackEvent || (exports.TrackEvent = {}));
//# sourceMappingURL=events.js.map

/***/ }),

/***/ 4149:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const logger_1 = __importDefault(__webpack_require__(2662));
const livekit_rtc_1 = __webpack_require__(4658);
const errors_1 = __webpack_require__(7650);
const events_1 = __webpack_require__(8911);
const LocalAudioTrack_1 = __importDefault(__webpack_require__(8669));
const LocalTrackPublication_1 = __importDefault(__webpack_require__(170));
const LocalVideoTrack_1 = __importStar(__webpack_require__(6887));
const options_1 = __webpack_require__(6669);
const Track_1 = __webpack_require__(410);
const utils_1 = __webpack_require__(9565);
const Participant_1 = __importDefault(__webpack_require__(2070));
const ParticipantTrackPermission_1 = __webpack_require__(8792);
const publishUtils_1 = __webpack_require__(5482);
const RemoteParticipant_1 = __importDefault(__webpack_require__(1488));
class LocalParticipant extends Participant_1.default {
    /** @internal */
    constructor(sid, identity, engine, options) {
        super(sid, identity);
        this.pendingPublishing = new Set();
        /** @internal */
        this.onTrackUnmuted = (track) => {
            this.onTrackMuted(track, false);
        };
        // when the local track changes in mute status, we'll notify server as such
        /** @internal */
        this.onTrackMuted = (track, muted) => {
            if (muted === undefined) {
                muted = true;
            }
            if (!track.sid) {
                logger_1.default.error('could not update mute status for unpublished track', track);
                return;
            }
            this.engine.updateMuteStatus(track.sid, muted);
        };
        this.handleSubscribedQualityUpdate = (update) => {
            var _a, _b;
            if (!((_a = this.roomOptions) === null || _a === void 0 ? void 0 : _a.dynacast)) {
                return;
            }
            const pub = this.videoTracks.get(update.trackSid);
            if (!pub) {
                logger_1.default.warn('handleSubscribedQualityUpdate', 'received subscribed quality update for unknown track', update.trackSid);
                return;
            }
            (_b = pub.videoTrack) === null || _b === void 0 ? void 0 : _b.setPublishingLayers(update.subscribedQualities);
        };
        this.onTrackUnpublish = (track) => {
            this.unpublishTrack(track);
        };
        this.audioTracks = new Map();
        this.videoTracks = new Map();
        this.tracks = new Map();
        this.engine = engine;
        this.roomOptions = options;
        this.engine.client.onRemoteMuteChanged = (trackSid, muted) => {
            const pub = this.tracks.get(trackSid);
            if (!pub || !pub.track) {
                return;
            }
            if (muted) {
                pub.mute();
            }
            else {
                pub.unmute();
            }
        };
        this.engine.client.onSubscribedQualityUpdate = this.handleSubscribedQualityUpdate;
    }
    get lastCameraError() {
        return this.cameraError;
    }
    get lastMicrophoneError() {
        return this.microphoneError;
    }
    getTrack(source) {
        const track = super.getTrack(source);
        if (track) {
            return track;
        }
    }
    getTrackByName(name) {
        const track = super.getTrackByName(name);
        if (track) {
            return track;
        }
    }
    /**
     * Enable or disable a participant's camera track.
     *
     * If a track has already published, it'll mute or unmute the track.
     */
    setCameraEnabled(enabled) {
        return this.setTrackEnabled(Track_1.Track.Source.Camera, enabled);
    }
    /**
     * Enable or disable a participant's microphone track.
     *
     * If a track has already published, it'll mute or unmute the track.
     */
    setMicrophoneEnabled(enabled) {
        return this.setTrackEnabled(Track_1.Track.Source.Microphone, enabled);
    }
    /**
     * Start or stop sharing a participant's screen
     */
    setScreenShareEnabled(enabled) {
        return this.setTrackEnabled(Track_1.Track.Source.ScreenShare, enabled);
    }
    /**
     * Enable or disable publishing for a track by source. This serves as a simple
     * way to manage the common tracks (camera, mic, or screen share)
     */
    setTrackEnabled(source, enabled) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.default.debug('setTrackEnabled', source, enabled);
            const track = this.getTrack(source);
            if (enabled) {
                if (track) {
                    yield track.unmute();
                }
                else {
                    let localTrack;
                    if (this.pendingPublishing.has(source)) {
                        logger_1.default.info('skipping duplicate published source', source);
                        // no-op it's already been requested
                        return;
                    }
                    this.pendingPublishing.add(source);
                    try {
                        switch (source) {
                            case Track_1.Track.Source.Camera:
                                [localTrack] = yield this.createTracks({
                                    video: true,
                                });
                                break;
                            case Track_1.Track.Source.Microphone:
                                [localTrack] = yield this.createTracks({
                                    audio: true,
                                });
                                break;
                            case Track_1.Track.Source.ScreenShare:
                                [localTrack] = yield this.createScreenTracks({ audio: false });
                                break;
                            default:
                                throw new errors_1.TrackInvalidError(source);
                        }
                        yield this.publishTrack(localTrack);
                    }
                    catch (e) {
                        if (e instanceof Error && !(e instanceof errors_1.TrackInvalidError)) {
                            this.emit(events_1.ParticipantEvent.MediaDevicesError, e);
                        }
                        throw e;
                    }
                    finally {
                        this.pendingPublishing.delete(source);
                    }
                }
            }
            else if (track && track.track) {
                // screenshare cannot be muted, unpublish instead
                if (source === Track_1.Track.Source.ScreenShare) {
                    this.unpublishTrack(track.track);
                }
                else {
                    yield track.mute();
                }
            }
        });
    }
    /**
     * Publish both camera and microphone at the same time. This is useful for
     * displaying a single Permission Dialog box to the end user.
     */
    enableCameraAndMicrophone() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.pendingPublishing.has(Track_1.Track.Source.Camera)
                || this.pendingPublishing.has(Track_1.Track.Source.Microphone)) {
                // no-op it's already been requested
                return;
            }
            this.pendingPublishing.add(Track_1.Track.Source.Camera);
            this.pendingPublishing.add(Track_1.Track.Source.Microphone);
            try {
                const tracks = yield this.createTracks({
                    audio: true,
                    video: true,
                });
                yield Promise.all(tracks.map((track) => this.publishTrack(track)));
            }
            finally {
                this.pendingPublishing.delete(Track_1.Track.Source.Camera);
                this.pendingPublishing.delete(Track_1.Track.Source.Microphone);
            }
        });
    }
    /**
     * Create local camera and/or microphone tracks
     * @param options
     * @returns
     */
    createTracks(options) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const opts = utils_1.mergeDefaultOptions(options, (_a = this.roomOptions) === null || _a === void 0 ? void 0 : _a.audioCaptureDefaults, (_b = this.roomOptions) === null || _b === void 0 ? void 0 : _b.videoCaptureDefaults);
            const constraints = utils_1.constraintsForOptions(opts);
            let stream;
            try {
                stream = yield navigator.mediaDevices.getUserMedia(constraints);
            }
            catch (err) {
                if (err instanceof Error) {
                    if (constraints.audio) {
                        this.microphoneError = err;
                    }
                    if (constraints.video) {
                        this.cameraError = err;
                    }
                }
                throw err;
            }
            if (constraints.audio) {
                this.microphoneError = undefined;
            }
            if (constraints.video) {
                this.cameraError = undefined;
            }
            return stream.getTracks().map((mediaStreamTrack) => {
                const isAudio = mediaStreamTrack.kind === 'audio';
                let trackOptions = isAudio ? options.audio : options.video;
                if (typeof trackOptions === 'boolean' || !trackOptions) {
                    trackOptions = {};
                }
                let trackConstraints;
                const conOrBool = isAudio ? constraints.audio : constraints.video;
                if (typeof conOrBool !== 'boolean') {
                    trackConstraints = conOrBool;
                }
                const track = publishUtils_1.mediaTrackToLocalTrack(mediaStreamTrack, trackConstraints);
                if (track.kind === Track_1.Track.Kind.Video) {
                    track.source = Track_1.Track.Source.Camera;
                }
                else if (track.kind === Track_1.Track.Kind.Audio) {
                    track.source = Track_1.Track.Source.Microphone;
                }
                return track;
            });
        });
    }
    /**
     * Creates a screen capture tracks with getDisplayMedia().
     * A LocalVideoTrack is always created and returned.
     * If { audio: true }, and the browser supports audio capture, a LocalAudioTrack is also created.
     */
    createScreenTracks(options) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (options === undefined) {
                options = {};
            }
            if (options.resolution === undefined) {
                options.resolution = options_1.VideoPresets.fhd.resolution;
            }
            let videoConstraints = true;
            if (options.resolution) {
                videoConstraints = {
                    width: options.resolution.width,
                    height: options.resolution.height,
                    frameRate: options.resolution.frameRate,
                };
            }
            // typescript definition is missing getDisplayMedia: https://github.com/microsoft/TypeScript/issues/33232
            // @ts-ignore
            const stream = yield navigator.mediaDevices.getDisplayMedia({
                audio: (_a = options.audio) !== null && _a !== void 0 ? _a : false,
                video: videoConstraints,
            });
            const tracks = stream.getVideoTracks();
            if (tracks.length === 0) {
                throw new errors_1.TrackInvalidError('no video track found');
            }
            const screenVideo = new LocalVideoTrack_1.default(tracks[0]);
            screenVideo.source = Track_1.Track.Source.ScreenShare;
            const localTracks = [screenVideo];
            if (stream.getAudioTracks().length > 0) {
                const screenAudio = new LocalAudioTrack_1.default(stream.getAudioTracks()[0]);
                screenAudio.source = Track_1.Track.Source.ScreenShareAudio;
                localTracks.push(screenAudio);
            }
            return localTracks;
        });
    }
    /**
     * Publish a new track to the room
     * @param track
     * @param options
     */
    publishTrack(track, options) {
        var _a, _b, _c, _d, _e, _f;
        return __awaiter(this, void 0, void 0, function* () {
            const opts = Object.assign(Object.assign({}, (_a = this.roomOptions) === null || _a === void 0 ? void 0 : _a.publishDefaults), options);
            // convert raw media track into audio or video track
            if (track instanceof MediaStreamTrack) {
                switch (track.kind) {
                    case 'audio':
                        track = new LocalAudioTrack_1.default(track);
                        break;
                    case 'video':
                        track = new LocalVideoTrack_1.default(track);
                        break;
                    default:
                        throw new errors_1.TrackInvalidError(`unsupported MediaStreamTrack kind ${track.kind}`);
                }
            }
            // is it already published? if so skip
            let existingPublication;
            this.tracks.forEach((publication) => {
                if (!publication.track) {
                    return;
                }
                if (publication.track === track) {
                    existingPublication = publication;
                }
            });
            if (existingPublication)
                return existingPublication;
            if (opts.source) {
                track.source = opts.source;
            }
            if (opts.stopMicTrackOnMute && track instanceof LocalAudioTrack_1.default) {
                track.stopOnMute = true;
            }
            // handle track actions
            track.on(events_1.TrackEvent.Muted, this.onTrackMuted);
            track.on(events_1.TrackEvent.Unmuted, this.onTrackUnmuted);
            track.on(events_1.TrackEvent.Ended, this.onTrackUnpublish);
            // create track publication from track
            const req = livekit_rtc_1.AddTrackRequest.fromPartial({
                // get local track id for use during publishing
                cid: track.mediaStreamTrack.id,
                name: options === null || options === void 0 ? void 0 : options.name,
                type: Track_1.Track.kindToProto(track.kind),
                muted: track.isMuted,
                source: Track_1.Track.sourceToProto(track.source),
                disableDtx: !((_b = opts === null || opts === void 0 ? void 0 : opts.dtx) !== null && _b !== void 0 ? _b : true),
            });
            // compute encodings and layers for video
            let encodings;
            if (track.kind === Track_1.Track.Kind.Video) {
                // TODO: support react native, which doesn't expose getSettings
                const settings = track.mediaStreamTrack.getSettings();
                const width = (_c = settings.width) !== null && _c !== void 0 ? _c : (_d = track.dimensions) === null || _d === void 0 ? void 0 : _d.width;
                const height = (_e = settings.height) !== null && _e !== void 0 ? _e : (_f = track.dimensions) === null || _f === void 0 ? void 0 : _f.height;
                // width and height should be defined for video
                req.width = width !== null && width !== void 0 ? width : 0;
                req.height = height !== null && height !== void 0 ? height : 0;
                encodings = publishUtils_1.computeVideoEncodings(track.source === Track_1.Track.Source.ScreenShare, width, height, opts);
                req.layers = LocalVideoTrack_1.videoLayersFromEncodings(req.width, req.height, encodings);
            }
            else if (track.kind === Track_1.Track.Kind.Audio && opts.audioBitrate) {
                encodings = [
                    {
                        maxBitrate: opts.audioBitrate,
                    },
                ];
            }
            const ti = yield this.engine.addTrack(req);
            const publication = new LocalTrackPublication_1.default(track.kind, ti, track);
            track.sid = ti.sid;
            if (!this.engine.publisher) {
                throw new errors_1.UnexpectedConnectionState('publisher is closed');
            }
            logger_1.default.debug(`publishing ${track.kind} with encodings`, encodings, ti);
            const transceiverInit = { direction: 'sendonly' };
            if (encodings) {
                transceiverInit.sendEncodings = encodings;
            }
            const transceiver = this.engine.publisher.pc.addTransceiver(track.mediaStreamTrack, transceiverInit);
            this.engine.negotiate();
            // store RTPSender
            track.sender = transceiver.sender;
            if (track instanceof LocalVideoTrack_1.default) {
                track.startMonitor(this.engine.client);
            }
            else if (track instanceof LocalAudioTrack_1.default) {
                track.startMonitor();
            }
            if (opts.videoCodec) {
                this.setPreferredCodec(transceiver, track.kind, opts.videoCodec);
            }
            this.addTrackPublication(publication);
            // send event for publication
            this.emit(events_1.ParticipantEvent.LocalTrackPublished, publication);
            return publication;
        });
    }
    unpublishTrack(track, stopOnUnpublish) {
        var _a, _b;
        // look through all published tracks to find the right ones
        const publication = this.getPublicationForTrack(track);
        logger_1.default.debug('unpublishTrack', 'unpublishing track', track);
        if (!publication || !publication.track) {
            logger_1.default.warn('unpublishTrack', 'track was not unpublished because no publication was found', track);
            return null;
        }
        track = publication.track;
        track.off(events_1.TrackEvent.Muted, this.onTrackMuted);
        track.off(events_1.TrackEvent.Unmuted, this.onTrackUnmuted);
        track.off(events_1.TrackEvent.Ended, this.onTrackUnpublish);
        if (stopOnUnpublish === undefined) {
            stopOnUnpublish = (_b = (_a = this.roomOptions) === null || _a === void 0 ? void 0 : _a.stopLocalTrackOnUnpublish) !== null && _b !== void 0 ? _b : true;
        }
        if (stopOnUnpublish) {
            track.stop();
        }
        const { mediaStreamTrack } = track;
        if (this.engine.publisher) {
            const senders = this.engine.publisher.pc.getSenders();
            senders.forEach((sender) => {
                var _a;
                if (sender.track === mediaStreamTrack) {
                    try {
                        (_a = this.engine.publisher) === null || _a === void 0 ? void 0 : _a.pc.removeTrack(sender);
                        this.engine.negotiate();
                    }
                    catch (e) {
                        logger_1.default.warn('unpublishTrack', 'failed to remove track', e);
                    }
                }
            });
        }
        // remove from our maps
        this.tracks.delete(publication.trackSid);
        switch (publication.kind) {
            case Track_1.Track.Kind.Audio:
                this.audioTracks.delete(publication.trackSid);
                break;
            case Track_1.Track.Kind.Video:
                this.videoTracks.delete(publication.trackSid);
                break;
            default:
                break;
        }
        publication.setTrack(undefined);
        this.emit(events_1.ParticipantEvent.LocalTrackUnpublished, publication);
        return publication;
    }
    unpublishTracks(tracks) {
        const publications = [];
        tracks.forEach((track) => {
            const pub = this.unpublishTrack(track);
            if (pub) {
                publications.push(pub);
            }
        });
        return publications;
    }
    /**
     * Publish a new data payload to the room. Data will be forwarded to each
     * participant in the room if the destination argument is empty
     *
     * @param data Uint8Array of the payload. To send string data, use TextEncoder.encode
     * @param kind whether to send this as reliable or lossy.
     * For data that you need delivery guarantee (such as chat messages), use Reliable.
     * For data that should arrive as quickly as possible, but you are ok with dropped
     * packets, use Lossy.
     * @param destination the participants who will receive the message
     */
    publishData(data, kind, destination) {
        return __awaiter(this, void 0, void 0, function* () {
            const dest = [];
            if (destination !== undefined) {
                destination.forEach((val) => {
                    if (val instanceof RemoteParticipant_1.default) {
                        dest.push(val.sid);
                    }
                    else {
                        dest.push(val);
                    }
                });
            }
            const packet = {
                kind,
                user: {
                    participantSid: this.sid,
                    payload: data,
                    destinationSids: dest,
                },
            };
            yield this.engine.sendDataPacket(packet, kind);
        });
    }
    /**
     * Control who can subscribe to LocalParticipant's published tracks.
     *
     * By default, all participants can subscribe. This allows fine-grained control over
     * who is able to subscribe at a participant and track level.
     *
     * Note: if access is given at a track-level (i.e. both [allParticipantsAllowed] and
     * [ParticipantTrackPermission.allTracksAllowed] are false), any newer published tracks
     * will not grant permissions to any participants and will require a subsequent
     * permissions update to allow subscription.
     *
     * @param allParticipantsAllowed Allows all participants to subscribe all tracks.
     *  Takes precedence over [[participantTrackPermissions]] if set to true.
     *  By default this is set to true.
     * @param participantTrackPermissions Full list of individual permissions per
     *  participant/track. Any omitted participants will not receive any permissions.
     */
    setTrackSubscriptionPermissions(allParticipantsAllowed, participantTrackPermissions = []) {
        this.engine.client.sendUpdateSubscriptionPermissions(allParticipantsAllowed, participantTrackPermissions.map((p) => ParticipantTrackPermission_1.trackPermissionToProto(p)));
    }
    getPublicationForTrack(track) {
        let publication;
        this.tracks.forEach((pub) => {
            const localTrack = pub.track;
            if (!localTrack) {
                return;
            }
            // this looks overly complicated due to this object tree
            if (track instanceof MediaStreamTrack) {
                if (localTrack instanceof LocalAudioTrack_1.default
                    || localTrack instanceof LocalVideoTrack_1.default) {
                    if (localTrack.mediaStreamTrack === track) {
                        publication = pub;
                    }
                }
            }
            else if (track === localTrack) {
                publication = pub;
            }
        });
        return publication;
    }
    setPreferredCodec(transceiver, kind, videoCodec) {
        if (!('getCapabilities' in RTCRtpSender)) {
            return;
        }
        const cap = RTCRtpSender.getCapabilities(kind);
        if (!cap)
            return;
        const selected = cap.codecs.find((c) => {
            const codec = c.mimeType.toLowerCase();
            const matchesVideoCodec = codec === `video/${videoCodec}`;
            // for h264 codecs that have sdpFmtpLine available, use only if the
            // profile-level-id is 42e01f for cross-browser compatibility
            if (videoCodec === 'h264' && c.sdpFmtpLine) {
                return matchesVideoCodec && c.sdpFmtpLine.includes('profile-level-id=42e01f');
            }
            return matchesVideoCodec || codec === 'audio/opus';
        });
        if (selected && 'setCodecPreferences' in transceiver) {
            // @ts-ignore
            transceiver.setCodecPreferences([selected]);
        }
    }
    /** @internal */
    publishedTracksInfo() {
        const infos = [];
        this.tracks.forEach((track) => {
            if (track.track !== undefined) {
                infos.push({
                    cid: track.track.mediaStreamTrack.id,
                    track: track.trackInfo,
                });
            }
        });
        return infos;
    }
}
exports["default"] = LocalParticipant;
//# sourceMappingURL=LocalParticipant.js.map

/***/ }),

/***/ 2070:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ConnectionQuality = void 0;
const events_1 = __webpack_require__(7187);
const livekit_models_1 = __webpack_require__(8983);
const events_2 = __webpack_require__(8911);
const Track_1 = __webpack_require__(410);
var ConnectionQuality;
(function (ConnectionQuality) {
    ConnectionQuality["Excellent"] = "excellent";
    ConnectionQuality["Good"] = "good";
    ConnectionQuality["Poor"] = "poor";
    ConnectionQuality["Unknown"] = "unknown";
})(ConnectionQuality = exports.ConnectionQuality || (exports.ConnectionQuality = {}));
function qualityFromProto(q) {
    switch (q) {
        case livekit_models_1.ConnectionQuality.EXCELLENT:
            return ConnectionQuality.Excellent;
        case livekit_models_1.ConnectionQuality.GOOD:
            return ConnectionQuality.Good;
        case livekit_models_1.ConnectionQuality.POOR:
            return ConnectionQuality.Poor;
        default:
            return ConnectionQuality.Unknown;
    }
}
class Participant extends events_1.EventEmitter {
    /** @internal */
    constructor(sid, identity) {
        super();
        /** audio level between 0-1.0, 1 being loudest, 0 being softest */
        this.audioLevel = 0;
        /** if participant is currently speaking */
        this.isSpeaking = false;
        this._connectionQuality = ConnectionQuality.Unknown;
        this.sid = sid;
        this.identity = identity;
        this.audioTracks = new Map();
        this.videoTracks = new Map();
        this.tracks = new Map();
    }
    getTracks() {
        return Array.from(this.tracks.values());
    }
    /**
     * Finds the first track that matches the source filter, for example, getting
     * the user's camera track with getTrackBySource(Track.Source.Camera).
     * @param source
     * @returns
     */
    getTrack(source) {
        if (source === Track_1.Track.Source.Unknown) {
            return;
        }
        for (const [, pub] of this.tracks) {
            if (pub.source === source) {
                return pub;
            }
            if (pub.source === Track_1.Track.Source.Unknown) {
                if (source === Track_1.Track.Source.Microphone && pub.kind === Track_1.Track.Kind.Audio && pub.trackName !== 'screen') {
                    return pub;
                }
                if (source === Track_1.Track.Source.Camera && pub.kind === Track_1.Track.Kind.Video && pub.trackName !== 'screen') {
                    return pub;
                }
                if (source === Track_1.Track.Source.ScreenShare && pub.kind === Track_1.Track.Kind.Video && pub.trackName === 'screen') {
                    return pub;
                }
                if (source === Track_1.Track.Source.ScreenShareAudio && pub.kind === Track_1.Track.Kind.Audio && pub.trackName === 'screen') {
                    return pub;
                }
            }
        }
    }
    /**
     * Finds the first track that matches the track's name.
     * @param name
     * @returns
     */
    getTrackByName(name) {
        for (const [, pub] of this.tracks) {
            if (pub.trackName === name) {
                return pub;
            }
        }
    }
    get connectionQuality() {
        return this._connectionQuality;
    }
    get isCameraEnabled() {
        var _a;
        const track = this.getTrack(Track_1.Track.Source.Camera);
        return !((_a = track === null || track === void 0 ? void 0 : track.isMuted) !== null && _a !== void 0 ? _a : true);
    }
    get isMicrophoneEnabled() {
        var _a;
        const track = this.getTrack(Track_1.Track.Source.Microphone);
        return !((_a = track === null || track === void 0 ? void 0 : track.isMuted) !== null && _a !== void 0 ? _a : true);
    }
    get isScreenShareEnabled() {
        const track = this.getTrack(Track_1.Track.Source.ScreenShare);
        return !!track;
    }
    /** when participant joined the room */
    get joinedAt() {
        if (this.participantInfo) {
            return new Date(this.participantInfo.joinedAt * 1000);
        }
        return new Date();
    }
    /** @internal */
    updateInfo(info) {
        this.identity = info.identity;
        this.sid = info.sid;
        this.name = info.name;
        this.setMetadata(info.metadata);
        // set this last so setMetadata can detect changes
        this.participantInfo = info;
    }
    /** @internal */
    setMetadata(md) {
        const changed = !this.participantInfo || this.participantInfo.metadata !== md;
        const prevMetadata = this.metadata;
        this.metadata = md;
        if (changed) {
            this.emit(events_2.ParticipantEvent.MetadataChanged, prevMetadata);
            this.emit(events_2.ParticipantEvent.ParticipantMetadataChanged, prevMetadata);
        }
    }
    /** @internal */
    setIsSpeaking(speaking) {
        if (speaking === this.isSpeaking) {
            return;
        }
        this.isSpeaking = speaking;
        if (speaking) {
            this.lastSpokeAt = new Date();
        }
        this.emit(events_2.ParticipantEvent.IsSpeakingChanged, speaking);
    }
    /** @internal */
    setConnectionQuality(q) {
        const prevQuality = this._connectionQuality;
        this._connectionQuality = qualityFromProto(q);
        if (prevQuality !== this._connectionQuality) {
            this.emit(events_2.ParticipantEvent.ConnectionQualityChanged, this._connectionQuality);
        }
    }
    addTrackPublication(publication) {
        // forward publication driven events
        publication.on(events_2.TrackEvent.Muted, () => {
            this.emit(events_2.ParticipantEvent.TrackMuted, publication);
        });
        publication.on(events_2.TrackEvent.Unmuted, () => {
            this.emit(events_2.ParticipantEvent.TrackUnmuted, publication);
        });
        const pub = publication;
        if (pub.track) {
            pub.track.sid = publication.trackSid;
        }
        this.tracks.set(publication.trackSid, publication);
        switch (publication.kind) {
            case Track_1.Track.Kind.Audio:
                this.audioTracks.set(publication.trackSid, publication);
                break;
            case Track_1.Track.Kind.Video:
                this.videoTracks.set(publication.trackSid, publication);
                break;
            default:
                break;
        }
    }
}
exports["default"] = Participant;
//# sourceMappingURL=Participant.js.map

/***/ }),

/***/ 8792:
/***/ (function(__unused_webpack_module, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.trackPermissionToProto = void 0;
function trackPermissionToProto(perms) {
    var _a;
    if (!perms.participantSid) {
        throw new Error('Invalid track permission, missing participantSid');
    }
    return {
        participantSid: perms.participantSid,
        allTracks: (_a = perms.allowAll) !== null && _a !== void 0 ? _a : false,
        trackSids: perms.allowedTrackSids || [],
    };
}
exports.trackPermissionToProto = trackPermissionToProto;
//# sourceMappingURL=ParticipantTrackPermission.js.map

/***/ }),

/***/ 1488:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const logger_1 = __importDefault(__webpack_require__(2662));
const events_1 = __webpack_require__(8911);
const RemoteAudioTrack_1 = __importDefault(__webpack_require__(5941));
const RemoteTrackPublication_1 = __importDefault(__webpack_require__(297));
const RemoteVideoTrack_1 = __importDefault(__webpack_require__(466));
const Track_1 = __webpack_require__(410);
const Participant_1 = __importDefault(__webpack_require__(2070));
class RemoteParticipant extends Participant_1.default {
    /** @internal */
    constructor(signalClient, id, name) {
        super(id, name || '');
        this.signalClient = signalClient;
        this.tracks = new Map();
        this.audioTracks = new Map();
        this.videoTracks = new Map();
    }
    /** @internal */
    static fromParticipantInfo(signalClient, pi) {
        const rp = new RemoteParticipant(signalClient, pi.sid, pi.identity);
        rp.updateInfo(pi);
        return rp;
    }
    addTrackPublication(publication) {
        super.addTrackPublication(publication);
        // register action events
        publication.on(events_1.TrackEvent.UpdateSettings, (settings) => {
            this.signalClient.sendUpdateTrackSettings(settings);
        });
        publication.on(events_1.TrackEvent.UpdateSubscription, (sub) => {
            sub.participantTracks.forEach((pt) => {
                pt.participantSid = this.sid;
            });
            this.signalClient.sendUpdateSubscription(sub);
        });
        publication.on(events_1.TrackEvent.Ended, (track) => {
            this.emit(events_1.ParticipantEvent.TrackUnsubscribed, track, publication);
        });
    }
    getTrack(source) {
        const track = super.getTrack(source);
        if (track) {
            return track;
        }
    }
    getTrackByName(name) {
        const track = super.getTrackByName(name);
        if (track) {
            return track;
        }
    }
    /** @internal */
    addSubscribedMediaTrack(mediaTrack, sid, mediaStream, receiver, adaptiveStream, triesLeft) {
        // find the track publication
        // it's possible for the media track to arrive before participant info
        let publication = this.getTrackPublication(sid);
        // it's also possible that the browser didn't honor our original track id
        // FireFox would use its own local uuid instead of server track id
        if (!publication) {
            if (!sid.startsWith('TR')) {
                // find the first track that matches type
                this.tracks.forEach((p) => {
                    if (!publication && mediaTrack.kind === p.kind.toString()) {
                        publication = p;
                    }
                });
            }
        }
        // when we couldn't locate the track, it's possible that the metadata hasn't
        // yet arrived. Wait a bit longer for it to arrive, or fire an error
        if (!publication) {
            if (triesLeft === 0) {
                logger_1.default.error('could not find published track', this.sid, sid);
                this.emit(events_1.ParticipantEvent.TrackSubscriptionFailed, sid);
                return;
            }
            if (triesLeft === undefined)
                triesLeft = 20;
            setTimeout(() => {
                this.addSubscribedMediaTrack(mediaTrack, sid, mediaStream, receiver, adaptiveStream, triesLeft - 1);
            }, 150);
            return;
        }
        const isVideo = mediaTrack.kind === 'video';
        let track;
        if (isVideo) {
            track = new RemoteVideoTrack_1.default(mediaTrack, sid, receiver, adaptiveStream);
        }
        else {
            track = new RemoteAudioTrack_1.default(mediaTrack, sid, receiver);
        }
        // set track info
        track.source = publication.source;
        // keep publication's muted status
        track.isMuted = publication.isMuted;
        track.setMediaStream(mediaStream);
        track.start();
        publication.setTrack(track);
        this.emit(events_1.ParticipantEvent.TrackSubscribed, track, publication);
        return publication;
    }
    /** @internal */
    get hasMetadata() {
        return !!this.participantInfo;
    }
    getTrackPublication(sid) {
        return this.tracks.get(sid);
    }
    /** @internal */
    updateInfo(info) {
        const alreadyHasMetadata = this.hasMetadata;
        super.updateInfo(info);
        // we are getting a list of all available tracks, reconcile in here
        // and send out events for changes
        // reconcile track publications, publish events only if metadata is already there
        // i.e. changes since the local participant has joined
        const validTracks = new Map();
        const newTracks = new Map();
        info.tracks.forEach((ti) => {
            let publication = this.getTrackPublication(ti.sid);
            if (!publication) {
                // new publication
                const kind = Track_1.Track.kindFromProto(ti.type);
                if (!kind) {
                    return;
                }
                publication = new RemoteTrackPublication_1.default(kind, ti.sid, ti.name);
                publication.updateInfo(ti);
                newTracks.set(ti.sid, publication);
                this.addTrackPublication(publication);
            }
            else {
                publication.updateInfo(ti);
            }
            validTracks.set(ti.sid, publication);
        });
        // send new tracks
        if (alreadyHasMetadata) {
            newTracks.forEach((publication) => {
                this.emit(events_1.ParticipantEvent.TrackPublished, publication);
            });
        }
        // detect removed tracks
        this.tracks.forEach((publication) => {
            if (!validTracks.has(publication.trackSid)) {
                this.unpublishTrack(publication.trackSid, true);
            }
        });
    }
    /** @internal */
    unpublishTrack(sid, sendUnpublish) {
        const publication = this.tracks.get(sid);
        if (!publication) {
            return;
        }
        this.tracks.delete(sid);
        // remove from the right type map
        switch (publication.kind) {
            case Track_1.Track.Kind.Audio:
                this.audioTracks.delete(sid);
                break;
            case Track_1.Track.Kind.Video:
                this.videoTracks.delete(sid);
                break;
            default:
                break;
        }
        // also send unsubscribe, if track is actively subscribed
        const { track } = publication;
        if (track) {
            const { isSubscribed } = publication;
            track.stop();
            publication.setTrack(undefined);
            // always send unsubscribed, since apps may rely on this
            if (isSubscribed) {
                this.emit(events_1.ParticipantEvent.TrackUnsubscribed, track, publication);
            }
        }
        if (sendUnpublish) {
            this.emit(events_1.ParticipantEvent.TrackUnpublished, publication);
        }
    }
    /** @internal */
    emit(event, ...args) {
        logger_1.default.trace('participant event', this.sid, event, ...args);
        return super.emit(event, ...args);
    }
}
exports["default"] = RemoteParticipant;
//# sourceMappingURL=RemoteParticipant.js.map

/***/ }),

/***/ 5482:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.presetsForResolution = exports.determineAppropriateEncoding = exports.computeVideoEncodings = exports.presetsScreenShare = exports.presets43 = exports.presets169 = exports.mediaTrackToLocalTrack = void 0;
const logger_1 = __importDefault(__webpack_require__(2662));
const errors_1 = __webpack_require__(7650);
const LocalAudioTrack_1 = __importDefault(__webpack_require__(8669));
const LocalVideoTrack_1 = __importDefault(__webpack_require__(6887));
const options_1 = __webpack_require__(6669);
/** @internal */
function mediaTrackToLocalTrack(mediaStreamTrack, constraints) {
    switch (mediaStreamTrack.kind) {
        case 'audio':
            return new LocalAudioTrack_1.default(mediaStreamTrack, constraints);
        case 'video':
            return new LocalVideoTrack_1.default(mediaStreamTrack, constraints);
        default:
            throw new errors_1.TrackInvalidError(`unsupported track type: ${mediaStreamTrack.kind}`);
    }
}
exports.mediaTrackToLocalTrack = mediaTrackToLocalTrack;
/* @internal */
exports.presets169 = [
    options_1.VideoPresets.qvga,
    options_1.VideoPresets.vga,
    options_1.VideoPresets.qhd,
    options_1.VideoPresets.hd,
    options_1.VideoPresets.fhd,
];
/* @internal */
exports.presets43 = [
    options_1.VideoPresets43.qvga,
    options_1.VideoPresets43.vga,
    options_1.VideoPresets43.qhd,
    options_1.VideoPresets43.hd,
    options_1.VideoPresets43.fhd,
];
/* @internal */
exports.presetsScreenShare = [
    options_1.ScreenSharePresets.vga,
    options_1.ScreenSharePresets.hd_8,
    options_1.ScreenSharePresets.hd_15,
    options_1.ScreenSharePresets.fhd_15,
    options_1.ScreenSharePresets.fhd_30,
];
const videoRids = ['q', 'h', 'f'];
/* @internal */
function computeVideoEncodings(isScreenShare, width, height, options) {
    let videoEncoding = options === null || options === void 0 ? void 0 : options.videoEncoding;
    if (isScreenShare) {
        videoEncoding = options === null || options === void 0 ? void 0 : options.screenShareEncoding;
    }
    const useSimulcast = !isScreenShare && (options === null || options === void 0 ? void 0 : options.simulcast);
    if ((!videoEncoding && !useSimulcast) || !width || !height) {
        // when we aren't simulcasting, will need to return a single encoding without
        // capping bandwidth. we always require a encoding for dynacast
        return [{}];
    }
    if (!videoEncoding) {
        // find the right encoding based on width/height
        videoEncoding = determineAppropriateEncoding(isScreenShare, width, height);
        logger_1.default.debug('using video encoding', videoEncoding);
    }
    if (!useSimulcast) {
        return [videoEncoding];
    }
    const presets = presetsForResolution(isScreenShare, width, height);
    let midPreset;
    const lowPreset = presets[0];
    if (presets.length > 1) {
        [, midPreset] = presets;
    }
    const original = new options_1.VideoPreset(width, height, videoEncoding.maxBitrate, videoEncoding.maxFramerate);
    // NOTE:
    //   1. Ordering of these encodings is important. Chrome seems
    //      to use the index into encodings to decide which layer
    //      to disable when CPU constrained.
    //      So encodings should be ordered in increasing spatial
    //      resolution order.
    //   2. ion-sfu translates rids into layers. So, all encodings
    //      should have the base layer `q` and then more added
    //      based on other conditions.
    const size = Math.max(width, height);
    if (size >= 960 && midPreset) {
        return encodingsFromPresets(width, height, [
            lowPreset, midPreset, original,
        ]);
    }
    if (size >= 500) {
        return encodingsFromPresets(width, height, [
            lowPreset, original,
        ]);
    }
    return encodingsFromPresets(width, height, [
        original,
    ]);
}
exports.computeVideoEncodings = computeVideoEncodings;
/* @internal */
function determineAppropriateEncoding(isScreenShare, width, height) {
    const presets = presetsForResolution(isScreenShare, width, height);
    let { encoding } = presets[0];
    // handle portrait by swapping dimensions
    const size = Math.max(width, height);
    for (let i = 0; i < presets.length; i += 1) {
        const preset = presets[i];
        encoding = preset.encoding;
        if (preset.width >= size) {
            break;
        }
    }
    return encoding;
}
exports.determineAppropriateEncoding = determineAppropriateEncoding;
/* @internal */
function presetsForResolution(isScreenShare, width, height) {
    if (isScreenShare) {
        return exports.presetsScreenShare;
    }
    const aspect = width > height ? width / height : height / width;
    if (Math.abs(aspect - 16.0 / 9) < Math.abs(aspect - 4.0 / 3)) {
        return exports.presets169;
    }
    return exports.presets43;
}
exports.presetsForResolution = presetsForResolution;
// presets should be ordered by low, medium, high
function encodingsFromPresets(width, height, presets) {
    const encodings = [];
    presets.forEach((preset, idx) => {
        if (idx >= videoRids.length) {
            return;
        }
        const size = Math.min(width, height);
        const rid = videoRids[idx];
        encodings.push({
            rid,
            scaleResolutionDownBy: size / Math.min(preset.width, preset.height),
            maxBitrate: preset.encoding.maxBitrate,
            /* @ts-ignore */
            maxFramerate: preset.encoding.maxFramerate,
        });
    });
    return encodings;
}
//# sourceMappingURL=publishUtils.js.map

/***/ }),

/***/ 4448:
/***/ (function(__unused_webpack_module, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.computeBitrate = exports.monitorFrequency = void 0;
exports.monitorFrequency = 2000;
function computeBitrate(currentStats, prevStats) {
    if (!prevStats) {
        return 0;
    }
    let bytesNow;
    let bytesPrev;
    if ('bytesReceived' in currentStats) {
        bytesNow = currentStats.bytesReceived;
        bytesPrev = prevStats.bytesReceived;
    }
    else if ('bytesSent' in currentStats) {
        bytesNow = currentStats.bytesSent;
        bytesPrev = prevStats.bytesSent;
    }
    if (bytesNow === undefined || bytesPrev === undefined
        || currentStats.timestamp === undefined || prevStats.timestamp === undefined) {
        return 0;
    }
    return ((bytesNow - bytesPrev) * 8 * 1000) / (currentStats.timestamp - prevStats.timestamp);
}
exports.computeBitrate = computeBitrate;
//# sourceMappingURL=stats.js.map

/***/ }),

/***/ 8669:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const logger_1 = __importDefault(__webpack_require__(2662));
const stats_1 = __webpack_require__(4448);
const LocalTrack_1 = __importDefault(__webpack_require__(5728));
const Track_1 = __webpack_require__(410);
const utils_1 = __webpack_require__(9565);
class LocalAudioTrack extends LocalTrack_1.default {
    constructor(mediaTrack, constraints) {
        super(mediaTrack, Track_1.Track.Kind.Audio, constraints);
        /** @internal */
        this.stopOnMute = false;
        this.monitorSender = () => __awaiter(this, void 0, void 0, function* () {
            if (!this.sender) {
                this._currentBitrate = 0;
                return;
            }
            let stats;
            try {
                stats = yield this.getSenderStats();
            }
            catch (e) {
                logger_1.default.error('could not get audio sender stats', e);
                return;
            }
            if (stats && this.prevStats) {
                this._currentBitrate = stats_1.computeBitrate(stats, this.prevStats);
            }
            this.prevStats = stats;
            setTimeout(() => {
                this.monitorSender();
            }, stats_1.monitorFrequency);
        });
    }
    setDeviceId(deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.constraints.deviceId === deviceId) {
                return;
            }
            this.constraints.deviceId = deviceId;
            if (!this.isMuted) {
                yield this.restartTrack();
            }
        });
    }
    mute() {
        const _super = Object.create(null, {
            mute: { get: () => super.mute }
        });
        return __awaiter(this, void 0, void 0, function* () {
            // disabled special handling as it will cause BT headsets to switch communication modes
            if (this.source === Track_1.Track.Source.Microphone && this.stopOnMute) {
                logger_1.default.debug('stopping mic track');
                // also stop the track, so that microphone indicator is turned off
                this.mediaStreamTrack.stop();
            }
            yield _super.mute.call(this);
            return this;
        });
    }
    unmute() {
        const _super = Object.create(null, {
            unmute: { get: () => super.unmute }
        });
        return __awaiter(this, void 0, void 0, function* () {
            if (this.source === Track_1.Track.Source.Microphone && this.stopOnMute) {
                logger_1.default.debug('reacquiring mic track');
                yield this.restartTrack();
            }
            yield _super.unmute.call(this);
            return this;
        });
    }
    restartTrack(options) {
        return __awaiter(this, void 0, void 0, function* () {
            let constraints;
            if (options) {
                const streamConstraints = utils_1.constraintsForOptions({ audio: options });
                if (typeof streamConstraints.audio !== 'boolean') {
                    constraints = streamConstraints.audio;
                }
            }
            yield this.restart(constraints);
        });
    }
    /* @internal */
    startMonitor() {
        setTimeout(() => {
            this.monitorSender();
        }, stats_1.monitorFrequency);
    }
    getSenderStats() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.sender) {
                return undefined;
            }
            const stats = yield this.sender.getStats();
            let audioStats;
            stats.forEach((v) => {
                if (v.type === 'outbound-rtp') {
                    audioStats = {
                        type: 'audio',
                        streamId: v.id,
                        packetsSent: v.packetsSent,
                        packetsLost: v.packetsLost,
                        bytesSent: v.bytesSent,
                        timestamp: v.timestamp,
                        roundTripTime: v.roundTripTime,
                        jitter: v.jitter,
                    };
                }
            });
            return audioStats;
        });
    }
}
exports["default"] = LocalAudioTrack;
//# sourceMappingURL=LocalAudioTrack.js.map

/***/ }),

/***/ 5728:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const logger_1 = __importDefault(__webpack_require__(2662));
const DeviceManager_1 = __importDefault(__webpack_require__(1480));
const errors_1 = __webpack_require__(7650);
const events_1 = __webpack_require__(8911);
const Track_1 = __webpack_require__(410);
class LocalTrack extends Track_1.Track {
    constructor(mediaTrack, kind, constraints) {
        super(mediaTrack, kind);
        this.handleEnded = () => {
            this.emit(events_1.TrackEvent.Ended, this);
        };
        this.mediaStreamTrack.addEventListener('ended', this.handleEnded);
        this.constraints = constraints !== null && constraints !== void 0 ? constraints : mediaTrack.getConstraints();
    }
    get id() {
        return this.mediaStreamTrack.id;
    }
    get dimensions() {
        if (this.kind !== Track_1.Track.Kind.Video) {
            return undefined;
        }
        const { width, height } = this.mediaStreamTrack.getSettings();
        if (width && height) {
            return {
                width,
                height,
            };
        }
        return undefined;
    }
    /**
     * @returns DeviceID of the device that is currently being used for this track
     */
    getDeviceId() {
        return __awaiter(this, void 0, void 0, function* () {
            // screen share doesn't have a usable device id
            if (this.source === Track_1.Track.Source.ScreenShare) {
                return;
            }
            const { deviceId, groupId } = this.mediaStreamTrack.getSettings();
            const kind = this.kind === Track_1.Track.Kind.Audio ? 'audioinput' : 'videoinput';
            return DeviceManager_1.default.getInstance().normalizeDeviceId(kind, deviceId, groupId);
        });
    }
    mute() {
        return __awaiter(this, void 0, void 0, function* () {
            this.setTrackMuted(true);
            return this;
        });
    }
    unmute() {
        return __awaiter(this, void 0, void 0, function* () {
            this.setTrackMuted(false);
            return this;
        });
    }
    restart(constraints) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.sender) {
                throw new errors_1.TrackInvalidError('unable to restart an unpublished track');
            }
            if (!constraints) {
                constraints = this.constraints;
            }
            logger_1.default.debug('restarting track with constraints', constraints);
            const streamConstraints = {
                audio: false,
                video: false,
            };
            if (this.kind === Track_1.Track.Kind.Video) {
                streamConstraints.video = constraints;
            }
            else {
                streamConstraints.audio = constraints;
            }
            // detach
            this.attachedElements.forEach((el) => {
                Track_1.detachTrack(this.mediaStreamTrack, el);
            });
            this.mediaStreamTrack.removeEventListener('ended', this.handleEnded);
            // on Safari, the old audio track must be stopped before attempting to acquire
            // the new track, otherwise the new track will stop with
            // 'A MediaStreamTrack ended due to a capture failure`
            this.mediaStreamTrack.stop();
            // create new track and attach
            const mediaStream = yield navigator.mediaDevices.getUserMedia(streamConstraints);
            const newTrack = mediaStream.getTracks()[0];
            newTrack.addEventListener('ended', this.handleEnded);
            logger_1.default.debug('re-acquired MediaStreamTrack');
            yield this.sender.replaceTrack(newTrack);
            this.mediaStreamTrack = newTrack;
            this.attachedElements.forEach((el) => {
                Track_1.attachToElement(newTrack, el);
            });
            this.constraints = constraints;
            return this;
        });
    }
    setTrackMuted(muted) {
        if (this.isMuted === muted) {
            return;
        }
        this.isMuted = muted;
        this.mediaStreamTrack.enabled = !muted;
        this.emit(muted ? events_1.TrackEvent.Muted : events_1.TrackEvent.Unmuted, this);
    }
}
exports["default"] = LocalTrack;
//# sourceMappingURL=LocalTrack.js.map

/***/ }),

/***/ 170:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const events_1 = __webpack_require__(8911);
const TrackPublication_1 = __webpack_require__(2184);
class LocalTrackPublication extends TrackPublication_1.TrackPublication {
    constructor(kind, ti, track) {
        super(kind, ti.sid, ti.name);
        this.handleTrackEnded = (track) => {
            this.emit(events_1.TrackEvent.Ended, track);
        };
        this.updateInfo(ti);
        this.setTrack(track);
    }
    setTrack(track) {
        if (this.track) {
            this.track.off(events_1.TrackEvent.Ended, this.handleTrackEnded);
        }
        super.setTrack(track);
        if (track) {
            track.on(events_1.TrackEvent.Ended, this.handleTrackEnded);
        }
    }
    get isMuted() {
        if (this.track) {
            return this.track.isMuted;
        }
        return super.isMuted;
    }
    get audioTrack() {
        return super.audioTrack;
    }
    get videoTrack() {
        return super.videoTrack;
    }
    /**
     * Mute the track associated with this publication
     */
    mute() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            return (_a = this.track) === null || _a === void 0 ? void 0 : _a.mute();
        });
    }
    /**
     * Unmute track associated with this publication
     */
    unmute() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            return (_a = this.track) === null || _a === void 0 ? void 0 : _a.unmute();
        });
    }
}
exports["default"] = LocalTrackPublication;
//# sourceMappingURL=LocalTrackPublication.js.map

/***/ }),

/***/ 6887:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.videoLayersFromEncodings = exports.videoQualityForRid = void 0;
const logger_1 = __importDefault(__webpack_require__(2662));
const livekit_models_1 = __webpack_require__(8983);
const stats_1 = __webpack_require__(4448);
const utils_1 = __webpack_require__(1981);
const LocalTrack_1 = __importDefault(__webpack_require__(5728));
const Track_1 = __webpack_require__(410);
const utils_2 = __webpack_require__(9565);
class LocalVideoTrack extends LocalTrack_1.default {
    constructor(mediaTrack, constraints) {
        super(mediaTrack, Track_1.Track.Kind.Video, constraints);
        this.monitorSender = () => __awaiter(this, void 0, void 0, function* () {
            if (!this.sender) {
                this._currentBitrate = 0;
                return;
            }
            let stats;
            try {
                stats = yield this.getSenderStats();
            }
            catch (e) {
                logger_1.default.error('could not get audio sender stats', e);
                return;
            }
            const statsMap = new Map(stats.map((s) => [s.rid, s]));
            if (this.prevStats) {
                let totalBitrate = 0;
                statsMap.forEach((s, key) => {
                    var _a;
                    const prev = (_a = this.prevStats) === null || _a === void 0 ? void 0 : _a.get(key);
                    totalBitrate += stats_1.computeBitrate(s, prev);
                });
                this._currentBitrate = totalBitrate;
            }
            this.prevStats = statsMap;
            setTimeout(() => {
                this.monitorSender();
            }, stats_1.monitorFrequency);
        });
    }
    get isSimulcast() {
        if (this.sender && this.sender.getParameters().encodings.length > 1) {
            return true;
        }
        return false;
    }
    /* @internal */
    startMonitor(signalClient) {
        var _a;
        this.signalClient = signalClient;
        // save original encodings
        const params = (_a = this.sender) === null || _a === void 0 ? void 0 : _a.getParameters();
        if (params) {
            this.encodings = params.encodings;
        }
        setTimeout(() => {
            this.monitorSender();
        }, stats_1.monitorFrequency);
    }
    stop() {
        this.sender = undefined;
        this.mediaStreamTrack.getConstraints();
        super.stop();
    }
    mute() {
        const _super = Object.create(null, {
            mute: { get: () => super.mute }
        });
        return __awaiter(this, void 0, void 0, function* () {
            if (this.source === Track_1.Track.Source.Camera) {
                logger_1.default.debug('stopping camera track');
                // also stop the track, so that camera indicator is turned off
                this.mediaStreamTrack.stop();
            }
            yield _super.mute.call(this);
            return this;
        });
    }
    unmute() {
        const _super = Object.create(null, {
            unmute: { get: () => super.unmute }
        });
        return __awaiter(this, void 0, void 0, function* () {
            if (this.source === Track_1.Track.Source.Camera) {
                logger_1.default.debug('reacquiring camera track');
                yield this.restartTrack();
            }
            yield _super.unmute.call(this);
            return this;
        });
    }
    getSenderStats() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.sender) {
                return [];
            }
            const items = [];
            const stats = yield this.sender.getStats();
            stats.forEach((v) => {
                var _a;
                if (v.type === 'outbound-rtp') {
                    const vs = {
                        type: 'video',
                        streamId: v.id,
                        frameHeight: v.frameHeight,
                        frameWidth: v.frameWidth,
                        firCount: v.firCount,
                        pliCount: v.pliCount,
                        nackCount: v.nackCount,
                        packetsSent: v.packetsSent,
                        bytesSent: v.bytesSent,
                        framesSent: v.framesSent,
                        timestamp: v.timestamp,
                        rid: (_a = v.rid) !== null && _a !== void 0 ? _a : '',
                        retransmittedPacketsSent: v.retransmittedPacketsSent,
                        qualityLimitationReason: v.qualityLimitationReason,
                        qualityLimitationResolutionChanges: v.qualityLimitationResolutionChanges,
                    };
                    // locate the appropriate remote-inbound-rtp item
                    const r = stats.get(v.remoteId);
                    if (r) {
                        vs.jitter = r.jitter;
                        vs.packetsLost = r.packetsLost;
                        vs.roundTripTime = r.roundTripTime;
                    }
                    items.push(vs);
                }
            });
            return items;
        });
    }
    setPublishingQuality(maxQuality) {
        const qualities = [];
        for (let q = livekit_models_1.VideoQuality.LOW; q <= livekit_models_1.VideoQuality.HIGH; q += 1) {
            qualities.push({
                quality: q,
                enabled: q <= maxQuality,
            });
        }
        logger_1.default.debug('setting publishing quality. max quality', maxQuality);
        this.setPublishingLayers(qualities);
    }
    setDeviceId(deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.constraints.deviceId === deviceId) {
                return;
            }
            this.constraints.deviceId = deviceId;
            // when video is muted, underlying media stream track is stopped and
            // will be restarted later
            if (!this.isMuted) {
                yield this.restartTrack();
            }
        });
    }
    restartTrack(options) {
        return __awaiter(this, void 0, void 0, function* () {
            let constraints;
            if (options) {
                const streamConstraints = utils_2.constraintsForOptions({ video: options });
                if (typeof streamConstraints.video !== 'boolean') {
                    constraints = streamConstraints.video;
                }
            }
            yield this.restart(constraints);
        });
    }
    /**
     * @internal
     * Sets layers that should be publishing
     */
    setPublishingLayers(qualities) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.default.debug('setting publishing layers', qualities);
            if (!this.sender || !this.encodings) {
                return;
            }
            const params = this.sender.getParameters();
            const { encodings } = params;
            if (!encodings) {
                return;
            }
            if (encodings.length !== this.encodings.length) {
                logger_1.default.warn('cannot set publishing layers, encodings mismatch');
                return;
            }
            let hasChanged = false;
            encodings.forEach((encoding, idx) => {
                var _a;
                let rid = (_a = encoding.rid) !== null && _a !== void 0 ? _a : '';
                if (rid === '') {
                    rid = 'q';
                }
                const quality = videoQualityForRid(rid);
                const subscribedQuality = qualities.find((q) => q.quality === quality);
                if (!subscribedQuality) {
                    return;
                }
                if (encoding.active !== subscribedQuality.enabled) {
                    hasChanged = true;
                    encoding.active = subscribedQuality.enabled;
                    logger_1.default.debug(`setting layer ${subscribedQuality.quality} to ${encoding.active ? 'enabled' : 'disabled'}`);
                    // FireFox does not support setting encoding.active to false, so we
                    // have a workaround of lowering its bitrate and resolution to the min.
                    if (utils_1.isFireFox()) {
                        if (subscribedQuality.enabled) {
                            encoding.scaleResolutionDownBy = this.encodings[idx].scaleResolutionDownBy;
                            encoding.maxBitrate = this.encodings[idx].maxBitrate;
                            /* @ts-ignore */
                            encoding.maxFrameRate = this.encodings[idx].maxFrameRate;
                        }
                        else {
                            encoding.scaleResolutionDownBy = 4;
                            encoding.maxBitrate = 10;
                            /* @ts-ignore */
                            encoding.maxFrameRate = 2;
                        }
                    }
                }
            });
            if (hasChanged) {
                params.encodings = encodings;
                yield this.sender.setParameters(params);
            }
        });
    }
}
exports["default"] = LocalVideoTrack;
function videoQualityForRid(rid) {
    switch (rid) {
        case 'f':
            return livekit_models_1.VideoQuality.HIGH;
        case 'h':
            return livekit_models_1.VideoQuality.MEDIUM;
        case 'q':
            return livekit_models_1.VideoQuality.LOW;
        default:
            return livekit_models_1.VideoQuality.UNRECOGNIZED;
    }
}
exports.videoQualityForRid = videoQualityForRid;
function videoLayersFromEncodings(width, height, encodings) {
    // default to a single layer, HQ
    if (!encodings) {
        return [{
                quality: livekit_models_1.VideoQuality.HIGH,
                width,
                height,
                bitrate: 0,
                ssrc: 0,
            }];
    }
    return encodings.map((encoding) => {
        var _a, _b, _c;
        const scale = (_a = encoding.scaleResolutionDownBy) !== null && _a !== void 0 ? _a : 1;
        let quality = videoQualityForRid((_b = encoding.rid) !== null && _b !== void 0 ? _b : '');
        if (quality === livekit_models_1.VideoQuality.UNRECOGNIZED && encodings.length === 1) {
            quality = livekit_models_1.VideoQuality.HIGH;
        }
        return {
            quality,
            width: width / scale,
            height: height / scale,
            bitrate: (_c = encoding.maxBitrate) !== null && _c !== void 0 ? _c : 0,
            ssrc: 0,
        };
    });
}
exports.videoLayersFromEncodings = videoLayersFromEncodings;
//# sourceMappingURL=LocalVideoTrack.js.map

/***/ }),

/***/ 5941:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const stats_1 = __webpack_require__(4448);
const RemoteTrack_1 = __importDefault(__webpack_require__(5785));
const Track_1 = __webpack_require__(410);
class RemoteAudioTrack extends RemoteTrack_1.default {
    constructor(mediaTrack, sid, receiver) {
        super(mediaTrack, sid, Track_1.Track.Kind.Audio, receiver);
        this.monitorReceiver = () => __awaiter(this, void 0, void 0, function* () {
            if (!this.receiver) {
                this._currentBitrate = 0;
                return;
            }
            const stats = yield this.getReceiverStats();
            if (stats && this.prevStats && this.receiver) {
                this._currentBitrate = stats_1.computeBitrate(stats, this.prevStats);
            }
            this.prevStats = stats;
            setTimeout(() => {
                this.monitorReceiver();
            }, stats_1.monitorFrequency);
        });
    }
    getReceiverStats() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.receiver) {
                return;
            }
            const stats = yield this.receiver.getStats();
            let receiverStats;
            stats.forEach((v) => {
                if (v.type === 'inbound-rtp') {
                    receiverStats = {
                        type: 'audio',
                        timestamp: v.timestamp,
                        jitter: v.jitter,
                        bytesReceived: v.bytesReceived,
                        concealedSamples: v.concealedSamples,
                        concealmentEvents: v.concealmentEvents,
                        silentConcealedSamples: v.silentConcealedSamples,
                        silentConcealmentEvents: v.silentConcealmentEvents,
                        totalAudioEnergy: v.totalAudioEnergy,
                        totalSamplesDuration: v.totalSamplesDuration,
                    };
                }
            });
            return receiverStats;
        });
    }
}
exports["default"] = RemoteAudioTrack;
//# sourceMappingURL=RemoteAudioTrack.js.map

/***/ }),

/***/ 5785:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const events_1 = __webpack_require__(8911);
const stats_1 = __webpack_require__(4448);
const Track_1 = __webpack_require__(410);
class RemoteTrack extends Track_1.Track {
    constructor(mediaTrack, sid, kind, receiver) {
        super(mediaTrack, kind);
        this.sid = sid;
        this.receiver = receiver;
    }
    /** @internal */
    setMuted(muted) {
        if (this.isMuted !== muted) {
            this.isMuted = muted;
            this.emit(muted ? events_1.TrackEvent.Muted : events_1.TrackEvent.Unmuted, this);
        }
    }
    /** @internal */
    setMediaStream(stream) {
        // this is needed to determine when the track is finished
        // we send each track down in its own MediaStream, so we can assume the
        // current track is the only one that can be removed.
        stream.onremovetrack = () => {
            this.receiver = undefined;
            this._currentBitrate = 0;
            this.emit(events_1.TrackEvent.Ended, this);
        };
    }
    start() {
        this.startMonitor();
        // use `enabled` of track to enable re-use of transceiver
        super.enable();
    }
    stop() {
        // use `enabled` of track to enable re-use of transceiver
        super.disable();
    }
    /* @internal */
    startMonitor() {
        setTimeout(() => {
            this.monitorReceiver();
        }, stats_1.monitorFrequency);
    }
}
exports["default"] = RemoteTrack;
//# sourceMappingURL=RemoteTrack.js.map

/***/ }),

/***/ 297:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const logger_1 = __importDefault(__webpack_require__(2662));
const livekit_models_1 = __webpack_require__(8983);
const livekit_rtc_1 = __webpack_require__(4658);
const events_1 = __webpack_require__(8911);
const RemoteVideoTrack_1 = __importDefault(__webpack_require__(466));
const TrackPublication_1 = __webpack_require__(2184);
class RemoteTrackPublication extends TrackPublication_1.TrackPublication {
    constructor() {
        super(...arguments);
        /** @internal */
        this._allowed = true;
        this.disabled = false;
        this.currentVideoQuality = livekit_models_1.VideoQuality.HIGH;
        this.handleEnded = (track) => {
            this.emit(events_1.TrackEvent.Ended, track);
        };
        this.handleVisibilityChange = (visible) => {
            logger_1.default.debug('adaptivestream video visibility', this.trackSid, `visible=${visible}`);
            this.disabled = !visible;
            this.emitTrackUpdate();
        };
        this.handleVideoDimensionsChange = (dimensions) => {
            logger_1.default.debug('adaptivestream video dimensions', this.trackSid, `${dimensions.width}x${dimensions.height}`);
            this.videoDimensions = dimensions;
            this.emitTrackUpdate();
        };
    }
    /**
     * Subscribe or unsubscribe to this remote track
     * @param subscribed true to subscribe to a track, false to unsubscribe
     */
    setSubscribed(subscribed) {
        this.subscribed = subscribed;
        const sub = {
            trackSids: [this.trackSid],
            subscribe: this.subscribed,
            participantTracks: [{
                    // sending an empty participant id since TrackPublication doesn't keep it
                    // this is filled in by the participant that receives this message
                    participantSid: '',
                    trackSids: [this.trackSid],
                }],
        };
        this.emit(events_1.TrackEvent.UpdateSubscription, sub);
    }
    get subscriptionStatus() {
        if (this.subscribed === false || !super.isSubscribed) {
            return TrackPublication_1.TrackPublication.SubscriptionStatus.Unsubscribed;
        }
        if (!this._allowed) {
            return TrackPublication_1.TrackPublication.SubscriptionStatus.NotAllowed;
        }
        return TrackPublication_1.TrackPublication.SubscriptionStatus.Subscribed;
    }
    /**
     * Returns true if track is subscribed, and ready for playback
     */
    get isSubscribed() {
        if (this.subscribed === false) {
            return false;
        }
        if (!this._allowed) {
            return false;
        }
        return super.isSubscribed;
    }
    get isEnabled() {
        return !this.disabled;
    }
    /**
     * disable server from sending down data for this track. this is useful when
     * the participant is off screen, you may disable streaming down their video
     * to reduce bandwidth requirements
     * @param enabled
     */
    setEnabled(enabled) {
        if (!this.isManualOperationAllowed() || this.disabled === !enabled) {
            return;
        }
        this.disabled = !enabled;
        this.emitTrackUpdate();
    }
    /**
     * for tracks that support simulcasting, adjust subscribed quality
     *
     * This indicates the highest quality the client can accept. if network
     * bandwidth does not allow, server will automatically reduce quality to
     * optimize for uninterrupted video
     */
    setVideoQuality(quality) {
        if (!this.isManualOperationAllowed() || this.currentVideoQuality === quality) {
            return;
        }
        this.currentVideoQuality = quality;
        this.videoDimensions = undefined;
        this.emitTrackUpdate();
    }
    setVideoDimensions(dimensions) {
        var _a, _b;
        if (!this.isManualOperationAllowed()) {
            return;
        }
        if (((_a = this.videoDimensions) === null || _a === void 0 ? void 0 : _a.width) === dimensions.width
            && ((_b = this.videoDimensions) === null || _b === void 0 ? void 0 : _b.height) === dimensions.height) {
            return;
        }
        if (this.track instanceof RemoteVideoTrack_1.default) {
            this.videoDimensions = dimensions;
        }
        this.currentVideoQuality = undefined;
        this.emitTrackUpdate();
    }
    get videoQuality() {
        return this.currentVideoQuality;
    }
    setTrack(track) {
        if (this.track) {
            // unregister listener
            this.track.off(events_1.TrackEvent.VideoDimensionsChanged, this.handleVideoDimensionsChange);
            this.track.off(events_1.TrackEvent.VisibilityChanged, this.handleVisibilityChange);
            this.track.off(events_1.TrackEvent.Ended, this.handleEnded);
        }
        super.setTrack(track);
        if (track) {
            track.sid = this.trackSid;
            track.on(events_1.TrackEvent.VideoDimensionsChanged, this.handleVideoDimensionsChange);
            track.on(events_1.TrackEvent.VisibilityChanged, this.handleVisibilityChange);
            track.on(events_1.TrackEvent.Ended, this.handleEnded);
        }
    }
    /** @internal */
    updateInfo(info) {
        var _a;
        super.updateInfo(info);
        this.metadataMuted = info.muted;
        (_a = this.track) === null || _a === void 0 ? void 0 : _a.setMuted(info.muted);
    }
    isManualOperationAllowed() {
        if (this.isAdaptiveStream) {
            logger_1.default.warn('adaptive stream is enabled, cannot change track settings', this.trackSid);
            return false;
        }
        if (!this.isSubscribed) {
            logger_1.default.warn('cannot update track settings when not subscribed', this.trackSid);
            return false;
        }
        return true;
    }
    get isAdaptiveStream() {
        return this.track instanceof RemoteVideoTrack_1.default && this.track.isAdaptiveStream;
    }
    /* @internal */
    emitTrackUpdate() {
        const settings = livekit_rtc_1.UpdateTrackSettings.fromPartial({
            trackSids: [this.trackSid],
            disabled: this.disabled,
        });
        if (this.videoDimensions) {
            settings.width = this.videoDimensions.width;
            settings.height = this.videoDimensions.height;
        }
        else if (this.currentVideoQuality !== undefined) {
            settings.quality = this.currentVideoQuality;
        }
        else {
            // defaults to high quality
            settings.quality = livekit_models_1.VideoQuality.HIGH;
        }
        this.emit(events_1.TrackEvent.UpdateSettings, settings);
    }
}
exports["default"] = RemoteTrackPublication;
//# sourceMappingURL=RemoteTrackPublication.js.map

/***/ }),

/***/ 466:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const ts_debounce_1 = __webpack_require__(2938);
const events_1 = __webpack_require__(8911);
const stats_1 = __webpack_require__(4448);
const utils_1 = __webpack_require__(1981);
const RemoteTrack_1 = __importDefault(__webpack_require__(5785));
const Track_1 = __webpack_require__(410);
const REACTION_DELAY = 100;
class RemoteVideoTrack extends RemoteTrack_1.default {
    constructor(mediaTrack, sid, receiver, adaptiveStream) {
        super(mediaTrack, sid, Track_1.Track.Kind.Video, receiver);
        this.elementInfos = [];
        this.monitorReceiver = () => __awaiter(this, void 0, void 0, function* () {
            if (!this.receiver) {
                this._currentBitrate = 0;
                return;
            }
            const stats = yield this.getReceiverStats();
            if (stats && this.prevStats && this.receiver) {
                this._currentBitrate = stats_1.computeBitrate(stats, this.prevStats);
            }
            this.prevStats = stats;
            setTimeout(() => {
                this.monitorReceiver();
            }, stats_1.monitorFrequency);
        });
        this.handleVisibilityChanged = (entry) => {
            const { target, isIntersecting } = entry;
            const elementInfo = this.elementInfos.find((info) => info.element === target);
            if (elementInfo) {
                elementInfo.visible = isIntersecting;
                elementInfo.visibilityChangedAt = Date.now();
            }
            this.updateVisibility();
        };
        this.debouncedHandleResize = ts_debounce_1.debounce(() => {
            this.updateDimensions();
        }, REACTION_DELAY);
        this.adaptiveStream = adaptiveStream;
    }
    get isAdaptiveStream() {
        var _a;
        return (_a = this.adaptiveStream) !== null && _a !== void 0 ? _a : false;
    }
    /** @internal */
    setMuted(muted) {
        super.setMuted(muted);
        this.attachedElements.forEach((element) => {
            // detach or attach
            if (muted) {
                Track_1.detachTrack(this.mediaStreamTrack, element);
            }
            else {
                Track_1.attachToElement(this.mediaStreamTrack, element);
            }
        });
    }
    attach(element) {
        if (!element) {
            element = super.attach();
        }
        else {
            super.attach(element);
        }
        // It's possible attach is called multiple times on an element. When that's
        // the case, we'd want to avoid adding duplicate elementInfos
        if (this.adaptiveStream
            && this.elementInfos.find((info) => info.element === element) === undefined) {
            this.elementInfos.push({
                element,
                visible: true, // default visible
            });
            element
                .handleResize = this.debouncedHandleResize;
            element
                .handleVisibilityChanged = this.handleVisibilityChanged;
            utils_1.getIntersectionObserver().observe(element);
            utils_1.getResizeObserver().observe(element);
            // trigger the first resize update cycle
            // if the tab is backgrounded, the initial resize event does not fire until
            // the tab comes into focus for the first time.
            this.debouncedHandleResize();
        }
        return element;
    }
    detach(element) {
        let detachedElements = [];
        if (element) {
            this.stopObservingElement(element);
            return super.detach(element);
        }
        detachedElements = super.detach();
        for (const e of detachedElements) {
            this.stopObservingElement(e);
        }
        return detachedElements;
    }
    getReceiverStats() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.receiver) {
                return;
            }
            const stats = yield this.receiver.getStats();
            let receiverStats;
            stats.forEach((v) => {
                if (v.type === 'inbound-rtp') {
                    receiverStats = {
                        type: 'video',
                        framesDecoded: v.framesDecoded,
                        framesDropped: v.framesDropped,
                        framesReceived: v.framesReceived,
                        packetsReceived: v.packetsReceived,
                        packetsLost: v.packetsLost,
                        frameWidth: v.frameWidth,
                        frameHeight: v.frameHeight,
                        pliCount: v.pliCount,
                        firCount: v.firCount,
                        nackCount: v.nackCount,
                        jitter: v.jitter,
                        timestamp: v.timestamp,
                        bytesReceived: v.bytesReceived,
                    };
                }
            });
            return receiverStats;
        });
    }
    stopObservingElement(element) {
        var _a, _b;
        (_a = utils_1.getIntersectionObserver()) === null || _a === void 0 ? void 0 : _a.unobserve(element);
        (_b = utils_1.getResizeObserver()) === null || _b === void 0 ? void 0 : _b.unobserve(element);
        this.elementInfos = this.elementInfos.filter((info) => info.element !== element);
    }
    updateVisibility() {
        const lastVisibilityChange = this.elementInfos.reduce((prev, info) => Math.max(prev, info.visibilityChangedAt || 0), 0);
        const isVisible = this.elementInfos.some((info) => info.visible);
        if (this.lastVisible === isVisible) {
            return;
        }
        if (!isVisible && Date.now() - lastVisibilityChange < REACTION_DELAY) {
            // delay hidden events
            setTimeout(() => {
                this.updateVisibility();
            }, REACTION_DELAY);
            return;
        }
        this.lastVisible = isVisible;
        this.emit(events_1.TrackEvent.VisibilityChanged, isVisible, this);
    }
    updateDimensions() {
        var _a, _b;
        let maxWidth = 0;
        let maxHeight = 0;
        for (const info of this.elementInfos) {
            if (info.element.clientWidth + info.element.clientHeight > maxWidth + maxHeight) {
                maxWidth = info.element.clientWidth;
                maxHeight = info.element.clientHeight;
            }
        }
        if (((_a = this.lastDimensions) === null || _a === void 0 ? void 0 : _a.width) === maxWidth && ((_b = this.lastDimensions) === null || _b === void 0 ? void 0 : _b.height) === maxHeight) {
            return;
        }
        this.lastDimensions = {
            width: maxWidth,
            height: maxHeight,
        };
        this.emit(events_1.TrackEvent.VideoDimensionsChanged, this.lastDimensions, this);
    }
}
exports["default"] = RemoteVideoTrack;
//# sourceMappingURL=RemoteVideoTrack.js.map

/***/ }),

/***/ 410:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.detachTrack = exports.attachToElement = exports.Track = void 0;
const events_1 = __webpack_require__(7187);
const livekit_models_1 = __webpack_require__(8983);
const livekit_rtc_1 = __webpack_require__(4658);
const events_2 = __webpack_require__(8911);
const utils_1 = __webpack_require__(1981);
// keep old audio elements when detached, we would re-use them since on iOS
// Safari tracks which audio elements have been "blessed" by the user.
const recycledElements = [];
class Track extends events_1.EventEmitter {
    constructor(mediaTrack, kind) {
        super();
        this.attachedElements = [];
        this.isMuted = false;
        this.streamState = Track.StreamState.Active;
        this._currentBitrate = 0;
        this.kind = kind;
        this.mediaStreamTrack = mediaTrack;
        this.source = Track.Source.Unknown;
    }
    /** current receive bits per second */
    get currentBitrate() {
        return this._currentBitrate;
    }
    attach(element) {
        let elementType = 'audio';
        if (this.kind === Track.Kind.Video) {
            elementType = 'video';
        }
        if (!element) {
            if (elementType === 'audio') {
                recycledElements.forEach((e) => {
                    if (e.parentElement === null && !element) {
                        element = e;
                    }
                });
                if (element) {
                    // remove it from pool
                    recycledElements.splice(recycledElements.indexOf(element), 1);
                }
            }
            if (!element) {
                element = document.createElement(elementType);
            }
        }
        if (!this.attachedElements.includes(element)) {
            this.attachedElements.push(element);
        }
        // even if we believe it's already attached to the element, it's possible
        // the element's srcObject was set to something else out of band.
        // we'll want to re-attach it in that case
        attachToElement(this.mediaStreamTrack, element);
        if (element instanceof HTMLAudioElement) {
            // manually play audio to detect audio playback status
            element.play()
                .then(() => {
                this.emit(events_2.TrackEvent.AudioPlaybackStarted);
            })
                .catch((e) => {
                this.emit(events_2.TrackEvent.AudioPlaybackFailed, e);
            });
        }
        return element;
    }
    detach(element) {
        // detach from a single element
        if (element) {
            detachTrack(this.mediaStreamTrack, element);
            const idx = this.attachedElements.indexOf(element);
            if (idx >= 0) {
                this.attachedElements.splice(idx, 1);
                this.recycleElement(element);
            }
            return element;
        }
        const detached = [];
        this.attachedElements.forEach((elm) => {
            detachTrack(this.mediaStreamTrack, elm);
            detached.push(elm);
            this.recycleElement(elm);
        });
        // remove all tracks
        this.attachedElements = [];
        return detached;
    }
    stop() {
        this.mediaStreamTrack.stop();
    }
    enable() {
        this.mediaStreamTrack.enabled = true;
    }
    disable() {
        this.mediaStreamTrack.enabled = false;
    }
    recycleElement(element) {
        if (element instanceof HTMLAudioElement) {
            // we only need to re-use a single element
            let shouldCache = true;
            element.pause();
            recycledElements.forEach((e) => {
                if (!e.parentElement) {
                    shouldCache = false;
                }
            });
            if (shouldCache) {
                recycledElements.push(element);
            }
        }
    }
}
exports.Track = Track;
/** @internal */
function attachToElement(track, element) {
    let mediaStream;
    if (element.srcObject instanceof MediaStream) {
        mediaStream = element.srcObject;
    }
    else {
        mediaStream = new MediaStream();
    }
    // check if track matches existing track
    let existingTracks;
    if (track.kind === 'audio') {
        existingTracks = mediaStream.getAudioTracks();
    }
    else {
        existingTracks = mediaStream.getVideoTracks();
    }
    if (!existingTracks.includes(track)) {
        existingTracks.forEach((et) => {
            mediaStream.removeTrack(et);
        });
        mediaStream.addTrack(track);
    }
    // avoid flicker
    if (element.srcObject !== mediaStream) {
        element.srcObject = mediaStream;
        if ((utils_1.isSafari() || utils_1.isFireFox()) && element instanceof HTMLVideoElement) {
            // Firefox also has a timing issue where video doesn't actually get attached unless
            // performed out-of-band
            // Safari 15 has a bug where in certain layouts, video element renders
            // black until the page is resized or other changes take place.
            // Resetting the src triggers it to render.
            // https://developer.apple.com/forums/thread/690523
            setTimeout(() => {
                element.srcObject = mediaStream;
            }, 0);
        }
    }
    element.autoplay = true;
    if (element instanceof HTMLVideoElement) {
        element.playsInline = true;
    }
}
exports.attachToElement = attachToElement;
/** @internal */
function detachTrack(track, element) {
    if (element.srcObject instanceof MediaStream) {
        const mediaStream = element.srcObject;
        mediaStream.removeTrack(track);
        element.srcObject = null;
    }
}
exports.detachTrack = detachTrack;
(function (Track) {
    let Kind;
    (function (Kind) {
        Kind["Audio"] = "audio";
        Kind["Video"] = "video";
        Kind["Unknown"] = "unknown";
    })(Kind = Track.Kind || (Track.Kind = {}));
    let Source;
    (function (Source) {
        Source["Camera"] = "camera";
        Source["Microphone"] = "microphone";
        Source["ScreenShare"] = "screen_share";
        Source["ScreenShareAudio"] = "screen_share_audio";
        Source["Unknown"] = "unknown";
    })(Source = Track.Source || (Track.Source = {}));
    let StreamState;
    (function (StreamState) {
        StreamState["Active"] = "active";
        StreamState["Paused"] = "paused";
        StreamState["Unknown"] = "unknown";
    })(StreamState = Track.StreamState || (Track.StreamState = {}));
    /** @internal */
    function kindToProto(k) {
        switch (k) {
            case Kind.Audio:
                return livekit_models_1.TrackType.AUDIO;
            case Kind.Video:
                return livekit_models_1.TrackType.VIDEO;
            default:
                return livekit_models_1.TrackType.UNRECOGNIZED;
        }
    }
    Track.kindToProto = kindToProto;
    /** @internal */
    function kindFromProto(t) {
        switch (t) {
            case livekit_models_1.TrackType.AUDIO:
                return Kind.Audio;
            case livekit_models_1.TrackType.VIDEO:
                return Kind.Video;
            default:
                return Kind.Unknown;
        }
    }
    Track.kindFromProto = kindFromProto;
    /** @internal */
    function sourceToProto(s) {
        switch (s) {
            case Source.Camera:
                return livekit_models_1.TrackSource.CAMERA;
            case Source.Microphone:
                return livekit_models_1.TrackSource.MICROPHONE;
            case Source.ScreenShare:
                return livekit_models_1.TrackSource.SCREEN_SHARE;
            case Source.ScreenShareAudio:
                return livekit_models_1.TrackSource.SCREEN_SHARE_AUDIO;
            default:
                return livekit_models_1.TrackSource.UNRECOGNIZED;
        }
    }
    Track.sourceToProto = sourceToProto;
    /** @internal */
    function sourceFromProto(s) {
        switch (s) {
            case livekit_models_1.TrackSource.CAMERA:
                return Source.Camera;
            case livekit_models_1.TrackSource.MICROPHONE:
                return Source.Microphone;
            case livekit_models_1.TrackSource.SCREEN_SHARE:
                return Source.ScreenShare;
            case livekit_models_1.TrackSource.SCREEN_SHARE_AUDIO:
                return Source.ScreenShareAudio;
            default:
                return Source.Unknown;
        }
    }
    Track.sourceFromProto = sourceFromProto;
    /** @internal */
    function streamStateFromProto(s) {
        switch (s) {
            case livekit_rtc_1.StreamState.ACTIVE:
                return StreamState.Active;
            case livekit_rtc_1.StreamState.PAUSED:
                return StreamState.Paused;
            default:
                return StreamState.Unknown;
        }
    }
    Track.streamStateFromProto = streamStateFromProto;
})(Track = exports.Track || (exports.Track = {}));
//# sourceMappingURL=Track.js.map

/***/ }),

/***/ 2184:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TrackPublication = void 0;
const events_1 = __webpack_require__(7187);
const events_2 = __webpack_require__(8911);
const LocalAudioTrack_1 = __importDefault(__webpack_require__(8669));
const LocalVideoTrack_1 = __importDefault(__webpack_require__(6887));
const RemoteAudioTrack_1 = __importDefault(__webpack_require__(5941));
const RemoteVideoTrack_1 = __importDefault(__webpack_require__(466));
const Track_1 = __webpack_require__(410);
class TrackPublication extends events_1.EventEmitter {
    constructor(kind, id, name) {
        super();
        this.metadataMuted = false;
        this.handleMuted = () => {
            this.emit(events_2.TrackEvent.Muted);
        };
        this.handleUnmuted = () => {
            this.emit(events_2.TrackEvent.Unmuted);
        };
        this.kind = kind;
        this.trackSid = id;
        this.trackName = name;
        this.source = Track_1.Track.Source.Unknown;
    }
    /** @internal */
    setTrack(track) {
        if (this.track) {
            this.track.off(events_2.TrackEvent.Muted, this.handleMuted);
            this.track.off(events_2.TrackEvent.Unmuted, this.handleUnmuted);
        }
        this.track = track;
        if (track) {
            // forward events
            track.on(events_2.TrackEvent.Muted, this.handleMuted);
            track.on(events_2.TrackEvent.Unmuted, this.handleUnmuted);
        }
    }
    get isMuted() {
        return this.metadataMuted;
    }
    get isEnabled() {
        return true;
    }
    get isSubscribed() {
        return this.track !== undefined;
    }
    /**
     * an [AudioTrack] if this publication holds an audio track
     */
    get audioTrack() {
        if (this.track instanceof LocalAudioTrack_1.default || this.track instanceof RemoteAudioTrack_1.default) {
            return this.track;
        }
    }
    /**
     * an [VideoTrack] if this publication holds a video track
     */
    get videoTrack() {
        if (this.track instanceof LocalVideoTrack_1.default || this.track instanceof RemoteVideoTrack_1.default) {
            return this.track;
        }
    }
    /** @internal */
    updateInfo(info) {
        this.trackSid = info.sid;
        this.trackName = info.name;
        this.source = Track_1.Track.sourceFromProto(info.source);
        this.mimeType = info.mimeType;
        if (this.kind === Track_1.Track.Kind.Video && info.width > 0) {
            this.dimensions = {
                width: info.width,
                height: info.height,
            };
            this.simulcasted = info.simulcast;
        }
        this.trackInfo = info;
    }
}
exports.TrackPublication = TrackPublication;
(function (TrackPublication) {
    let SubscriptionStatus;
    (function (SubscriptionStatus) {
        SubscriptionStatus["Subscribed"] = "subscribed";
        SubscriptionStatus["NotAllowed"] = "not_allowed";
        SubscriptionStatus["Unsubscribed"] = "unsubscribed";
    })(SubscriptionStatus = TrackPublication.SubscriptionStatus || (TrackPublication.SubscriptionStatus = {}));
})(TrackPublication = exports.TrackPublication || (exports.TrackPublication = {}));
//# sourceMappingURL=TrackPublication.js.map

/***/ }),

/***/ 119:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.createLocalScreenTracks = exports.createLocalAudioTrack = exports.createLocalVideoTrack = exports.createLocalTracks = void 0;
const errors_1 = __webpack_require__(7650);
const publishUtils_1 = __webpack_require__(5482);
const defaults_1 = __webpack_require__(1442);
const LocalAudioTrack_1 = __importDefault(__webpack_require__(8669));
const LocalVideoTrack_1 = __importDefault(__webpack_require__(6887));
const options_1 = __webpack_require__(6669);
const Track_1 = __webpack_require__(410);
const utils_1 = __webpack_require__(9565);
/**
 * Creates a local video and audio track at the same time. When acquiring both
 * audio and video tracks together, it'll display a single permission prompt to
 * the user instead of two separate ones.
 * @param options
 */
function createLocalTracks(options) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        // set default options to true
        options !== null && options !== void 0 ? options : (options = {});
        (_a = options.audio) !== null && _a !== void 0 ? _a : (options.audio = true);
        (_b = options.video) !== null && _b !== void 0 ? _b : (options.video = true);
        const opts = utils_1.mergeDefaultOptions(options, defaults_1.audioDefaults, defaults_1.videoDefaults);
        const constraints = utils_1.constraintsForOptions(opts);
        const stream = yield navigator.mediaDevices.getUserMedia(constraints);
        return stream.getTracks().map((mediaStreamTrack) => {
            const isAudio = mediaStreamTrack.kind === 'audio';
            let trackOptions = isAudio ? options.audio : options.video;
            if (typeof trackOptions === 'boolean' || !trackOptions) {
                trackOptions = {};
            }
            let trackConstraints;
            const conOrBool = isAudio ? constraints.audio : constraints.video;
            if (typeof conOrBool !== 'boolean') {
                trackConstraints = conOrBool;
            }
            const track = publishUtils_1.mediaTrackToLocalTrack(mediaStreamTrack, trackConstraints);
            if (track.kind === Track_1.Track.Kind.Video) {
                track.source = Track_1.Track.Source.Camera;
            }
            else if (track.kind === Track_1.Track.Kind.Audio) {
                track.source = Track_1.Track.Source.Microphone;
            }
            return track;
        });
    });
}
exports.createLocalTracks = createLocalTracks;
/**
 * Creates a [[LocalVideoTrack]] with getUserMedia()
 * @param options
 */
function createLocalVideoTrack(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const tracks = yield createLocalTracks({
            audio: false,
            video: options,
        });
        return tracks[0];
    });
}
exports.createLocalVideoTrack = createLocalVideoTrack;
function createLocalAudioTrack(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const tracks = yield createLocalTracks({
            audio: options,
            video: false,
        });
        return tracks[0];
    });
}
exports.createLocalAudioTrack = createLocalAudioTrack;
/**
 * Creates a screen capture tracks with getDisplayMedia().
 * A LocalVideoTrack is always created and returned.
 * If { audio: true }, and the browser supports audio capture, a LocalAudioTrack is also created.
 */
function createLocalScreenTracks(options) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        if (options === undefined) {
            options = {};
        }
        if (options.resolution === undefined) {
            options.resolution = options_1.VideoPresets.fhd.resolution;
        }
        let videoConstraints = true;
        if (options.resolution) {
            videoConstraints = {
                width: options.resolution.width,
                height: options.resolution.height,
            };
        }
        // typescript definition is missing getDisplayMedia: https://github.com/microsoft/TypeScript/issues/33232
        // @ts-ignore
        const stream = yield navigator.mediaDevices.getDisplayMedia({
            audio: (_a = options.audio) !== null && _a !== void 0 ? _a : false,
            video: videoConstraints,
        });
        const tracks = stream.getVideoTracks();
        if (tracks.length === 0) {
            throw new errors_1.TrackInvalidError('no video track found');
        }
        const screenVideo = new LocalVideoTrack_1.default(tracks[0]);
        screenVideo.source = Track_1.Track.Source.ScreenShare;
        const localTracks = [screenVideo];
        if (stream.getAudioTracks().length > 0) {
            const screenAudio = new LocalAudioTrack_1.default(stream.getAudioTracks()[0]);
            screenAudio.source = Track_1.Track.Source.ScreenShareAudio;
            localTracks.push(screenAudio);
        }
        return localTracks;
    });
}
exports.createLocalScreenTracks = createLocalScreenTracks;
//# sourceMappingURL=create.js.map

/***/ }),

/***/ 1442:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.videoDefaults = exports.audioDefaults = exports.publishDefaults = void 0;
const options_1 = __webpack_require__(6669);
exports.publishDefaults = {
    audioBitrate: options_1.AudioPresets.speech.maxBitrate,
    dtx: true,
    simulcast: true,
    screenShareEncoding: options_1.ScreenSharePresets.hd_15.encoding,
    stopMicTrackOnMute: false,
};
exports.audioDefaults = {
    autoGainControl: true,
    channelCount: 1,
    echoCancellation: true,
    noiseSuppression: true,
};
exports.videoDefaults = {
    resolution: options_1.VideoPresets.qhd.resolution,
};
//# sourceMappingURL=defaults.js.map

/***/ }),

/***/ 6669:
/***/ (function(__unused_webpack_module, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ScreenSharePresets = exports.VideoPresets43 = exports.VideoPresets = exports.AudioPresets = exports.VideoPreset = void 0;
class VideoPreset {
    constructor(width, height, maxBitrate, maxFramerate) {
        this.width = width;
        this.height = height;
        this.encoding = {
            maxBitrate,
            maxFramerate,
        };
    }
    get resolution() {
        return {
            width: this.width,
            height: this.height,
            frameRate: this.encoding.maxFramerate,
            aspectRatio: this.width / this.height,
        };
    }
}
exports.VideoPreset = VideoPreset;
var AudioPresets;
(function (AudioPresets) {
    AudioPresets.telephone = {
        maxBitrate: 12000,
    };
    AudioPresets.speech = {
        maxBitrate: 20000,
    };
    AudioPresets.music = {
        maxBitrate: 32000,
    };
})(AudioPresets = exports.AudioPresets || (exports.AudioPresets = {}));
/**
 * Sane presets for video resolution/encoding
 */
exports.VideoPresets = {
    qvga: new VideoPreset(320, 180, 120000, 10),
    vga: new VideoPreset(640, 360, 300000, 20),
    qhd: new VideoPreset(960, 540, 600000, 25),
    hd: new VideoPreset(1280, 720, 2000000, 30),
    fhd: new VideoPreset(1920, 1080, 3000000, 30),
};
/**
 * Four by three presets
 */
exports.VideoPresets43 = {
    qvga: new VideoPreset(240, 180, 90000, 10),
    vga: new VideoPreset(480, 360, 225000, 20),
    qhd: new VideoPreset(720, 540, 450000, 25),
    hd: new VideoPreset(960, 720, 1500000, 30),
    fhd: new VideoPreset(1440, 1080, 2800000, 30),
};
exports.ScreenSharePresets = {
    vga: new VideoPreset(640, 360, 200000, 3),
    hd_8: new VideoPreset(1280, 720, 400000, 5),
    hd_15: new VideoPreset(1280, 720, 1000000, 15),
    fhd_15: new VideoPreset(1920, 1080, 1500000, 15),
    fhd_30: new VideoPreset(1920, 1080, 3000000, 30),
};
//# sourceMappingURL=options.js.map

/***/ }),

/***/ 5884:
/***/ (function(__unused_webpack_module, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
//# sourceMappingURL=types.js.map

/***/ }),

/***/ 9565:
/***/ (function(__unused_webpack_module, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.constraintsForOptions = exports.mergeDefaultOptions = void 0;
function mergeDefaultOptions(options, audioDefaults, videoDefaults) {
    const opts = Object.assign({}, options);
    if (opts.audio === true)
        opts.audio = {};
    if (opts.video === true)
        opts.video = {};
    // use defaults
    if (opts.audio) {
        mergeObjectWithoutOverwriting(opts.audio, audioDefaults);
    }
    if (opts.video) {
        mergeObjectWithoutOverwriting(opts.video, videoDefaults);
    }
    return opts;
}
exports.mergeDefaultOptions = mergeDefaultOptions;
function mergeObjectWithoutOverwriting(mainObject, objectToMerge) {
    Object.keys(objectToMerge).forEach((key) => {
        if (mainObject[key] === undefined)
            mainObject[key] = objectToMerge[key];
    });
    return mainObject;
}
function constraintsForOptions(options) {
    const constraints = {};
    if (options.video) {
        // default video options
        if (typeof options.video === 'object') {
            const videoOptions = {};
            const target = videoOptions;
            const source = options.video;
            Object.keys(source).forEach((key) => {
                switch (key) {
                    case 'resolution':
                        // flatten VideoResolution fields
                        mergeObjectWithoutOverwriting(target, source.resolution);
                        break;
                    default:
                        target[key] = source[key];
                }
            });
            constraints.video = videoOptions;
        }
        else {
            constraints.video = options.video;
        }
    }
    else {
        constraints.video = false;
    }
    if (options.audio) {
        if (typeof options.audio === 'object') {
            constraints.audio = options.audio;
        }
        else {
            constraints.audio = true;
        }
    }
    else {
        constraints.audio = false;
    }
    return constraints;
}
exports.constraintsForOptions = constraintsForOptions;
//# sourceMappingURL=utils.js.map

/***/ }),

/***/ 1981:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getClientInfo = exports.getIntersectionObserver = exports.getResizeObserver = exports.isSafari = exports.isFireFox = exports.sleep = exports.unpackStreamId = void 0;
const livekit_models_1 = __webpack_require__(8983);
const version_1 = __webpack_require__(6942);
const separator = '|';
function unpackStreamId(packed) {
    const parts = packed.split(separator);
    if (parts.length > 1) {
        return [parts[0], packed.substr(parts[0].length + 1)];
    }
    return [packed, ''];
}
exports.unpackStreamId = unpackStreamId;
function sleep(duration) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve) => setTimeout(resolve, duration));
    });
}
exports.sleep = sleep;
function isFireFox() {
    return navigator.userAgent.indexOf('Firefox') !== -1;
}
exports.isFireFox = isFireFox;
function isSafari() {
    return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}
exports.isSafari = isSafari;
function roDispatchCallback(entries) {
    for (const entry of entries) {
        entry.target.handleResize(entry);
    }
}
function ioDispatchCallback(entries) {
    for (const entry of entries) {
        entry.target.handleVisibilityChanged(entry);
    }
}
let resizeObserver = null;
const getResizeObserver = () => {
    if (!resizeObserver)
        resizeObserver = new ResizeObserver(roDispatchCallback);
    return resizeObserver;
};
exports.getResizeObserver = getResizeObserver;
let intersectionObserver = null;
const getIntersectionObserver = () => {
    if (!intersectionObserver)
        intersectionObserver = new IntersectionObserver(ioDispatchCallback);
    return intersectionObserver;
};
exports.getIntersectionObserver = getIntersectionObserver;
function getClientInfo() {
    const info = livekit_models_1.ClientInfo.fromPartial({
        sdk: livekit_models_1.ClientInfo_SDK.JS,
        protocol: version_1.protocolVersion,
        version: version_1.version,
    });
    return info;
}
exports.getClientInfo = getClientInfo;
//# sourceMappingURL=utils.js.map

/***/ }),

/***/ 6942:
/***/ (function(__unused_webpack_module, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.protocolVersion = exports.version = void 0;
exports.version = '0.16.6';
exports.protocolVersion = 6;
//# sourceMappingURL=version.js.map

/***/ }),

/***/ 2043:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;/*
* loglevel - https://github.com/pimterry/loglevel
*
* Copyright (c) 2013 Tim Perry
* Licensed under the MIT license.
*/
(function (root, definition) {
    "use strict";
    if (true) {
        !(__WEBPACK_AMD_DEFINE_FACTORY__ = (definition),
		__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
		(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
		__WEBPACK_AMD_DEFINE_FACTORY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    } else {}
}(this, function () {
    "use strict";

    // Slightly dubious tricks to cut down minimized file size
    var noop = function() {};
    var undefinedType = "undefined";
    var isIE = (typeof window !== undefinedType) && (typeof window.navigator !== undefinedType) && (
        /Trident\/|MSIE /.test(window.navigator.userAgent)
    );

    var logMethods = [
        "trace",
        "debug",
        "info",
        "warn",
        "error"
    ];

    // Cross-browser bind equivalent that works at least back to IE6
    function bindMethod(obj, methodName) {
        var method = obj[methodName];
        if (typeof method.bind === 'function') {
            return method.bind(obj);
        } else {
            try {
                return Function.prototype.bind.call(method, obj);
            } catch (e) {
                // Missing bind shim or IE8 + Modernizr, fallback to wrapping
                return function() {
                    return Function.prototype.apply.apply(method, [obj, arguments]);
                };
            }
        }
    }

    // Trace() doesn't print the message in IE, so for that case we need to wrap it
    function traceForIE() {
        if (console.log) {
            if (console.log.apply) {
                console.log.apply(console, arguments);
            } else {
                // In old IE, native console methods themselves don't have apply().
                Function.prototype.apply.apply(console.log, [console, arguments]);
            }
        }
        if (console.trace) console.trace();
    }

    // Build the best logging method possible for this env
    // Wherever possible we want to bind, not wrap, to preserve stack traces
    function realMethod(methodName) {
        if (methodName === 'debug') {
            methodName = 'log';
        }

        if (typeof console === undefinedType) {
            return false; // No method possible, for now - fixed later by enableLoggingWhenConsoleArrives
        } else if (methodName === 'trace' && isIE) {
            return traceForIE;
        } else if (console[methodName] !== undefined) {
            return bindMethod(console, methodName);
        } else if (console.log !== undefined) {
            return bindMethod(console, 'log');
        } else {
            return noop;
        }
    }

    // These private functions always need `this` to be set properly

    function replaceLoggingMethods(level, loggerName) {
        /*jshint validthis:true */
        for (var i = 0; i < logMethods.length; i++) {
            var methodName = logMethods[i];
            this[methodName] = (i < level) ?
                noop :
                this.methodFactory(methodName, level, loggerName);
        }

        // Define log.log as an alias for log.debug
        this.log = this.debug;
    }

    // In old IE versions, the console isn't present until you first open it.
    // We build realMethod() replacements here that regenerate logging methods
    function enableLoggingWhenConsoleArrives(methodName, level, loggerName) {
        return function () {
            if (typeof console !== undefinedType) {
                replaceLoggingMethods.call(this, level, loggerName);
                this[methodName].apply(this, arguments);
            }
        };
    }

    // By default, we use closely bound real methods wherever possible, and
    // otherwise we wait for a console to appear, and then try again.
    function defaultMethodFactory(methodName, level, loggerName) {
        /*jshint validthis:true */
        return realMethod(methodName) ||
               enableLoggingWhenConsoleArrives.apply(this, arguments);
    }

    function Logger(name, defaultLevel, factory) {
      var self = this;
      var currentLevel;
      defaultLevel = defaultLevel == null ? "WARN" : defaultLevel;

      var storageKey = "loglevel";
      if (typeof name === "string") {
        storageKey += ":" + name;
      } else if (typeof name === "symbol") {
        storageKey = undefined;
      }

      function persistLevelIfPossible(levelNum) {
          var levelName = (logMethods[levelNum] || 'silent').toUpperCase();

          if (typeof window === undefinedType || !storageKey) return;

          // Use localStorage if available
          try {
              window.localStorage[storageKey] = levelName;
              return;
          } catch (ignore) {}

          // Use session cookie as fallback
          try {
              window.document.cookie =
                encodeURIComponent(storageKey) + "=" + levelName + ";";
          } catch (ignore) {}
      }

      function getPersistedLevel() {
          var storedLevel;

          if (typeof window === undefinedType || !storageKey) return;

          try {
              storedLevel = window.localStorage[storageKey];
          } catch (ignore) {}

          // Fallback to cookies if local storage gives us nothing
          if (typeof storedLevel === undefinedType) {
              try {
                  var cookie = window.document.cookie;
                  var location = cookie.indexOf(
                      encodeURIComponent(storageKey) + "=");
                  if (location !== -1) {
                      storedLevel = /^([^;]+)/.exec(cookie.slice(location))[1];
                  }
              } catch (ignore) {}
          }

          // If the stored level is not valid, treat it as if nothing was stored.
          if (self.levels[storedLevel] === undefined) {
              storedLevel = undefined;
          }

          return storedLevel;
      }

      function clearPersistedLevel() {
          if (typeof window === undefinedType || !storageKey) return;

          // Use localStorage if available
          try {
              window.localStorage.removeItem(storageKey);
              return;
          } catch (ignore) {}

          // Use session cookie as fallback
          try {
              window.document.cookie =
                encodeURIComponent(storageKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
          } catch (ignore) {}
      }

      /*
       *
       * Public logger API - see https://github.com/pimterry/loglevel for details
       *
       */

      self.name = name;

      self.levels = { "TRACE": 0, "DEBUG": 1, "INFO": 2, "WARN": 3,
          "ERROR": 4, "SILENT": 5};

      self.methodFactory = factory || defaultMethodFactory;

      self.getLevel = function () {
          return currentLevel;
      };

      self.setLevel = function (level, persist) {
          if (typeof level === "string" && self.levels[level.toUpperCase()] !== undefined) {
              level = self.levels[level.toUpperCase()];
          }
          if (typeof level === "number" && level >= 0 && level <= self.levels.SILENT) {
              currentLevel = level;
              if (persist !== false) {  // defaults to true
                  persistLevelIfPossible(level);
              }
              replaceLoggingMethods.call(self, level, name);
              if (typeof console === undefinedType && level < self.levels.SILENT) {
                  return "No console available for logging";
              }
          } else {
              throw "log.setLevel() called with invalid level: " + level;
          }
      };

      self.setDefaultLevel = function (level) {
          defaultLevel = level;
          if (!getPersistedLevel()) {
              self.setLevel(level, false);
          }
      };

      self.resetLevel = function () {
          self.setLevel(defaultLevel, false);
          clearPersistedLevel();
      };

      self.enableAll = function(persist) {
          self.setLevel(self.levels.TRACE, persist);
      };

      self.disableAll = function(persist) {
          self.setLevel(self.levels.SILENT, persist);
      };

      // Initialize with the right level
      var initialLevel = getPersistedLevel();
      if (initialLevel == null) {
          initialLevel = defaultLevel;
      }
      self.setLevel(initialLevel, false);
    }

    /*
     *
     * Top-level API
     *
     */

    var defaultLogger = new Logger();

    var _loggersByName = {};
    defaultLogger.getLogger = function getLogger(name) {
        if ((typeof name !== "symbol" && typeof name !== "string") || name === "") {
          throw new TypeError("You must supply a name when creating a logger.");
        }

        var logger = _loggersByName[name];
        if (!logger) {
          logger = _loggersByName[name] = new Logger(
            name, defaultLogger.getLevel(), defaultLogger.methodFactory);
        }
        return logger;
    };

    // Grab the current global log variable in case of overwrite
    var _log = (typeof window !== undefinedType) ? window.log : undefined;
    defaultLogger.noConflict = function() {
        if (typeof window !== undefinedType &&
               window.log === defaultLogger) {
            window.log = _log;
        }

        return defaultLogger;
    };

    defaultLogger.getLoggers = function getLoggers() {
        return _loggersByName;
    };

    // ES6 default export, for compatibility
    defaultLogger['default'] = defaultLogger;

    return defaultLogger;
}));


/***/ }),

/***/ 3720:
/***/ (function(module) {

module.exports = Long;

/**
 * wasm optimizations, to do native i64 multiplication and divide
 */
var wasm = null;

try {
  wasm = new WebAssembly.Instance(new WebAssembly.Module(new Uint8Array([
    0, 97, 115, 109, 1, 0, 0, 0, 1, 13, 2, 96, 0, 1, 127, 96, 4, 127, 127, 127, 127, 1, 127, 3, 7, 6, 0, 1, 1, 1, 1, 1, 6, 6, 1, 127, 1, 65, 0, 11, 7, 50, 6, 3, 109, 117, 108, 0, 1, 5, 100, 105, 118, 95, 115, 0, 2, 5, 100, 105, 118, 95, 117, 0, 3, 5, 114, 101, 109, 95, 115, 0, 4, 5, 114, 101, 109, 95, 117, 0, 5, 8, 103, 101, 116, 95, 104, 105, 103, 104, 0, 0, 10, 191, 1, 6, 4, 0, 35, 0, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 126, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 127, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 128, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 129, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 130, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11
  ])), {}).exports;
} catch (e) {
  // no wasm support :(
}

/**
 * Constructs a 64 bit two's-complement integer, given its low and high 32 bit values as *signed* integers.
 *  See the from* functions below for more convenient ways of constructing Longs.
 * @exports Long
 * @class A Long class for representing a 64 bit two's-complement integer value.
 * @param {number} low The low (signed) 32 bits of the long
 * @param {number} high The high (signed) 32 bits of the long
 * @param {boolean=} unsigned Whether unsigned or not, defaults to signed
 * @constructor
 */
function Long(low, high, unsigned) {

    /**
     * The low 32 bits as a signed value.
     * @type {number}
     */
    this.low = low | 0;

    /**
     * The high 32 bits as a signed value.
     * @type {number}
     */
    this.high = high | 0;

    /**
     * Whether unsigned or not.
     * @type {boolean}
     */
    this.unsigned = !!unsigned;
}

// The internal representation of a long is the two given signed, 32-bit values.
// We use 32-bit pieces because these are the size of integers on which
// Javascript performs bit-operations.  For operations like addition and
// multiplication, we split each number into 16 bit pieces, which can easily be
// multiplied within Javascript's floating-point representation without overflow
// or change in sign.
//
// In the algorithms below, we frequently reduce the negative case to the
// positive case by negating the input(s) and then post-processing the result.
// Note that we must ALWAYS check specially whether those values are MIN_VALUE
// (-2^63) because -MIN_VALUE == MIN_VALUE (since 2^63 cannot be represented as
// a positive number, it overflows back into a negative).  Not handling this
// case would often result in infinite recursion.
//
// Common constant values ZERO, ONE, NEG_ONE, etc. are defined below the from*
// methods on which they depend.

/**
 * An indicator used to reliably determine if an object is a Long or not.
 * @type {boolean}
 * @const
 * @private
 */
Long.prototype.__isLong__;

Object.defineProperty(Long.prototype, "__isLong__", { value: true });

/**
 * @function
 * @param {*} obj Object
 * @returns {boolean}
 * @inner
 */
function isLong(obj) {
    return (obj && obj["__isLong__"]) === true;
}

/**
 * Tests if the specified object is a Long.
 * @function
 * @param {*} obj Object
 * @returns {boolean}
 */
Long.isLong = isLong;

/**
 * A cache of the Long representations of small integer values.
 * @type {!Object}
 * @inner
 */
var INT_CACHE = {};

/**
 * A cache of the Long representations of small unsigned integer values.
 * @type {!Object}
 * @inner
 */
var UINT_CACHE = {};

/**
 * @param {number} value
 * @param {boolean=} unsigned
 * @returns {!Long}
 * @inner
 */
function fromInt(value, unsigned) {
    var obj, cachedObj, cache;
    if (unsigned) {
        value >>>= 0;
        if (cache = (0 <= value && value < 256)) {
            cachedObj = UINT_CACHE[value];
            if (cachedObj)
                return cachedObj;
        }
        obj = fromBits(value, (value | 0) < 0 ? -1 : 0, true);
        if (cache)
            UINT_CACHE[value] = obj;
        return obj;
    } else {
        value |= 0;
        if (cache = (-128 <= value && value < 128)) {
            cachedObj = INT_CACHE[value];
            if (cachedObj)
                return cachedObj;
        }
        obj = fromBits(value, value < 0 ? -1 : 0, false);
        if (cache)
            INT_CACHE[value] = obj;
        return obj;
    }
}

/**
 * Returns a Long representing the given 32 bit integer value.
 * @function
 * @param {number} value The 32 bit integer in question
 * @param {boolean=} unsigned Whether unsigned or not, defaults to signed
 * @returns {!Long} The corresponding Long value
 */
Long.fromInt = fromInt;

/**
 * @param {number} value
 * @param {boolean=} unsigned
 * @returns {!Long}
 * @inner
 */
function fromNumber(value, unsigned) {
    if (isNaN(value))
        return unsigned ? UZERO : ZERO;
    if (unsigned) {
        if (value < 0)
            return UZERO;
        if (value >= TWO_PWR_64_DBL)
            return MAX_UNSIGNED_VALUE;
    } else {
        if (value <= -TWO_PWR_63_DBL)
            return MIN_VALUE;
        if (value + 1 >= TWO_PWR_63_DBL)
            return MAX_VALUE;
    }
    if (value < 0)
        return fromNumber(-value, unsigned).neg();
    return fromBits((value % TWO_PWR_32_DBL) | 0, (value / TWO_PWR_32_DBL) | 0, unsigned);
}

/**
 * Returns a Long representing the given value, provided that it is a finite number. Otherwise, zero is returned.
 * @function
 * @param {number} value The number in question
 * @param {boolean=} unsigned Whether unsigned or not, defaults to signed
 * @returns {!Long} The corresponding Long value
 */
Long.fromNumber = fromNumber;

/**
 * @param {number} lowBits
 * @param {number} highBits
 * @param {boolean=} unsigned
 * @returns {!Long}
 * @inner
 */
function fromBits(lowBits, highBits, unsigned) {
    return new Long(lowBits, highBits, unsigned);
}

/**
 * Returns a Long representing the 64 bit integer that comes by concatenating the given low and high bits. Each is
 *  assumed to use 32 bits.
 * @function
 * @param {number} lowBits The low 32 bits
 * @param {number} highBits The high 32 bits
 * @param {boolean=} unsigned Whether unsigned or not, defaults to signed
 * @returns {!Long} The corresponding Long value
 */
Long.fromBits = fromBits;

/**
 * @function
 * @param {number} base
 * @param {number} exponent
 * @returns {number}
 * @inner
 */
var pow_dbl = Math.pow; // Used 4 times (4*8 to 15+4)

/**
 * @param {string} str
 * @param {(boolean|number)=} unsigned
 * @param {number=} radix
 * @returns {!Long}
 * @inner
 */
function fromString(str, unsigned, radix) {
    if (str.length === 0)
        throw Error('empty string');
    if (str === "NaN" || str === "Infinity" || str === "+Infinity" || str === "-Infinity")
        return ZERO;
    if (typeof unsigned === 'number') {
        // For goog.math.long compatibility
        radix = unsigned,
        unsigned = false;
    } else {
        unsigned = !! unsigned;
    }
    radix = radix || 10;
    if (radix < 2 || 36 < radix)
        throw RangeError('radix');

    var p;
    if ((p = str.indexOf('-')) > 0)
        throw Error('interior hyphen');
    else if (p === 0) {
        return fromString(str.substring(1), unsigned, radix).neg();
    }

    // Do several (8) digits each time through the loop, so as to
    // minimize the calls to the very expensive emulated div.
    var radixToPower = fromNumber(pow_dbl(radix, 8));

    var result = ZERO;
    for (var i = 0; i < str.length; i += 8) {
        var size = Math.min(8, str.length - i),
            value = parseInt(str.substring(i, i + size), radix);
        if (size < 8) {
            var power = fromNumber(pow_dbl(radix, size));
            result = result.mul(power).add(fromNumber(value));
        } else {
            result = result.mul(radixToPower);
            result = result.add(fromNumber(value));
        }
    }
    result.unsigned = unsigned;
    return result;
}

/**
 * Returns a Long representation of the given string, written using the specified radix.
 * @function
 * @param {string} str The textual representation of the Long
 * @param {(boolean|number)=} unsigned Whether unsigned or not, defaults to signed
 * @param {number=} radix The radix in which the text is written (2-36), defaults to 10
 * @returns {!Long} The corresponding Long value
 */
Long.fromString = fromString;

/**
 * @function
 * @param {!Long|number|string|!{low: number, high: number, unsigned: boolean}} val
 * @param {boolean=} unsigned
 * @returns {!Long}
 * @inner
 */
function fromValue(val, unsigned) {
    if (typeof val === 'number')
        return fromNumber(val, unsigned);
    if (typeof val === 'string')
        return fromString(val, unsigned);
    // Throws for non-objects, converts non-instanceof Long:
    return fromBits(val.low, val.high, typeof unsigned === 'boolean' ? unsigned : val.unsigned);
}

/**
 * Converts the specified value to a Long using the appropriate from* function for its type.
 * @function
 * @param {!Long|number|string|!{low: number, high: number, unsigned: boolean}} val Value
 * @param {boolean=} unsigned Whether unsigned or not, defaults to signed
 * @returns {!Long}
 */
Long.fromValue = fromValue;

// NOTE: the compiler should inline these constant values below and then remove these variables, so there should be
// no runtime penalty for these.

/**
 * @type {number}
 * @const
 * @inner
 */
var TWO_PWR_16_DBL = 1 << 16;

/**
 * @type {number}
 * @const
 * @inner
 */
var TWO_PWR_24_DBL = 1 << 24;

/**
 * @type {number}
 * @const
 * @inner
 */
var TWO_PWR_32_DBL = TWO_PWR_16_DBL * TWO_PWR_16_DBL;

/**
 * @type {number}
 * @const
 * @inner
 */
var TWO_PWR_64_DBL = TWO_PWR_32_DBL * TWO_PWR_32_DBL;

/**
 * @type {number}
 * @const
 * @inner
 */
var TWO_PWR_63_DBL = TWO_PWR_64_DBL / 2;

/**
 * @type {!Long}
 * @const
 * @inner
 */
var TWO_PWR_24 = fromInt(TWO_PWR_24_DBL);

/**
 * @type {!Long}
 * @inner
 */
var ZERO = fromInt(0);

/**
 * Signed zero.
 * @type {!Long}
 */
Long.ZERO = ZERO;

/**
 * @type {!Long}
 * @inner
 */
var UZERO = fromInt(0, true);

/**
 * Unsigned zero.
 * @type {!Long}
 */
Long.UZERO = UZERO;

/**
 * @type {!Long}
 * @inner
 */
var ONE = fromInt(1);

/**
 * Signed one.
 * @type {!Long}
 */
Long.ONE = ONE;

/**
 * @type {!Long}
 * @inner
 */
var UONE = fromInt(1, true);

/**
 * Unsigned one.
 * @type {!Long}
 */
Long.UONE = UONE;

/**
 * @type {!Long}
 * @inner
 */
var NEG_ONE = fromInt(-1);

/**
 * Signed negative one.
 * @type {!Long}
 */
Long.NEG_ONE = NEG_ONE;

/**
 * @type {!Long}
 * @inner
 */
var MAX_VALUE = fromBits(0xFFFFFFFF|0, 0x7FFFFFFF|0, false);

/**
 * Maximum signed value.
 * @type {!Long}
 */
Long.MAX_VALUE = MAX_VALUE;

/**
 * @type {!Long}
 * @inner
 */
var MAX_UNSIGNED_VALUE = fromBits(0xFFFFFFFF|0, 0xFFFFFFFF|0, true);

/**
 * Maximum unsigned value.
 * @type {!Long}
 */
Long.MAX_UNSIGNED_VALUE = MAX_UNSIGNED_VALUE;

/**
 * @type {!Long}
 * @inner
 */
var MIN_VALUE = fromBits(0, 0x80000000|0, false);

/**
 * Minimum signed value.
 * @type {!Long}
 */
Long.MIN_VALUE = MIN_VALUE;

/**
 * @alias Long.prototype
 * @inner
 */
var LongPrototype = Long.prototype;

/**
 * Converts the Long to a 32 bit integer, assuming it is a 32 bit integer.
 * @returns {number}
 */
LongPrototype.toInt = function toInt() {
    return this.unsigned ? this.low >>> 0 : this.low;
};

/**
 * Converts the Long to a the nearest floating-point representation of this value (double, 53 bit mantissa).
 * @returns {number}
 */
LongPrototype.toNumber = function toNumber() {
    if (this.unsigned)
        return ((this.high >>> 0) * TWO_PWR_32_DBL) + (this.low >>> 0);
    return this.high * TWO_PWR_32_DBL + (this.low >>> 0);
};

/**
 * Converts the Long to a string written in the specified radix.
 * @param {number=} radix Radix (2-36), defaults to 10
 * @returns {string}
 * @override
 * @throws {RangeError} If `radix` is out of range
 */
LongPrototype.toString = function toString(radix) {
    radix = radix || 10;
    if (radix < 2 || 36 < radix)
        throw RangeError('radix');
    if (this.isZero())
        return '0';
    if (this.isNegative()) { // Unsigned Longs are never negative
        if (this.eq(MIN_VALUE)) {
            // We need to change the Long value before it can be negated, so we remove
            // the bottom-most digit in this base and then recurse to do the rest.
            var radixLong = fromNumber(radix),
                div = this.div(radixLong),
                rem1 = div.mul(radixLong).sub(this);
            return div.toString(radix) + rem1.toInt().toString(radix);
        } else
            return '-' + this.neg().toString(radix);
    }

    // Do several (6) digits each time through the loop, so as to
    // minimize the calls to the very expensive emulated div.
    var radixToPower = fromNumber(pow_dbl(radix, 6), this.unsigned),
        rem = this;
    var result = '';
    while (true) {
        var remDiv = rem.div(radixToPower),
            intval = rem.sub(remDiv.mul(radixToPower)).toInt() >>> 0,
            digits = intval.toString(radix);
        rem = remDiv;
        if (rem.isZero())
            return digits + result;
        else {
            while (digits.length < 6)
                digits = '0' + digits;
            result = '' + digits + result;
        }
    }
};

/**
 * Gets the high 32 bits as a signed integer.
 * @returns {number} Signed high bits
 */
LongPrototype.getHighBits = function getHighBits() {
    return this.high;
};

/**
 * Gets the high 32 bits as an unsigned integer.
 * @returns {number} Unsigned high bits
 */
LongPrototype.getHighBitsUnsigned = function getHighBitsUnsigned() {
    return this.high >>> 0;
};

/**
 * Gets the low 32 bits as a signed integer.
 * @returns {number} Signed low bits
 */
LongPrototype.getLowBits = function getLowBits() {
    return this.low;
};

/**
 * Gets the low 32 bits as an unsigned integer.
 * @returns {number} Unsigned low bits
 */
LongPrototype.getLowBitsUnsigned = function getLowBitsUnsigned() {
    return this.low >>> 0;
};

/**
 * Gets the number of bits needed to represent the absolute value of this Long.
 * @returns {number}
 */
LongPrototype.getNumBitsAbs = function getNumBitsAbs() {
    if (this.isNegative()) // Unsigned Longs are never negative
        return this.eq(MIN_VALUE) ? 64 : this.neg().getNumBitsAbs();
    var val = this.high != 0 ? this.high : this.low;
    for (var bit = 31; bit > 0; bit--)
        if ((val & (1 << bit)) != 0)
            break;
    return this.high != 0 ? bit + 33 : bit + 1;
};

/**
 * Tests if this Long's value equals zero.
 * @returns {boolean}
 */
LongPrototype.isZero = function isZero() {
    return this.high === 0 && this.low === 0;
};

/**
 * Tests if this Long's value equals zero. This is an alias of {@link Long#isZero}.
 * @returns {boolean}
 */
LongPrototype.eqz = LongPrototype.isZero;

/**
 * Tests if this Long's value is negative.
 * @returns {boolean}
 */
LongPrototype.isNegative = function isNegative() {
    return !this.unsigned && this.high < 0;
};

/**
 * Tests if this Long's value is positive.
 * @returns {boolean}
 */
LongPrototype.isPositive = function isPositive() {
    return this.unsigned || this.high >= 0;
};

/**
 * Tests if this Long's value is odd.
 * @returns {boolean}
 */
LongPrototype.isOdd = function isOdd() {
    return (this.low & 1) === 1;
};

/**
 * Tests if this Long's value is even.
 * @returns {boolean}
 */
LongPrototype.isEven = function isEven() {
    return (this.low & 1) === 0;
};

/**
 * Tests if this Long's value equals the specified's.
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
LongPrototype.equals = function equals(other) {
    if (!isLong(other))
        other = fromValue(other);
    if (this.unsigned !== other.unsigned && (this.high >>> 31) === 1 && (other.high >>> 31) === 1)
        return false;
    return this.high === other.high && this.low === other.low;
};

/**
 * Tests if this Long's value equals the specified's. This is an alias of {@link Long#equals}.
 * @function
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
LongPrototype.eq = LongPrototype.equals;

/**
 * Tests if this Long's value differs from the specified's.
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
LongPrototype.notEquals = function notEquals(other) {
    return !this.eq(/* validates */ other);
};

/**
 * Tests if this Long's value differs from the specified's. This is an alias of {@link Long#notEquals}.
 * @function
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
LongPrototype.neq = LongPrototype.notEquals;

/**
 * Tests if this Long's value differs from the specified's. This is an alias of {@link Long#notEquals}.
 * @function
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
LongPrototype.ne = LongPrototype.notEquals;

/**
 * Tests if this Long's value is less than the specified's.
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
LongPrototype.lessThan = function lessThan(other) {
    return this.comp(/* validates */ other) < 0;
};

/**
 * Tests if this Long's value is less than the specified's. This is an alias of {@link Long#lessThan}.
 * @function
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
LongPrototype.lt = LongPrototype.lessThan;

/**
 * Tests if this Long's value is less than or equal the specified's.
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
LongPrototype.lessThanOrEqual = function lessThanOrEqual(other) {
    return this.comp(/* validates */ other) <= 0;
};

/**
 * Tests if this Long's value is less than or equal the specified's. This is an alias of {@link Long#lessThanOrEqual}.
 * @function
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
LongPrototype.lte = LongPrototype.lessThanOrEqual;

/**
 * Tests if this Long's value is less than or equal the specified's. This is an alias of {@link Long#lessThanOrEqual}.
 * @function
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
LongPrototype.le = LongPrototype.lessThanOrEqual;

/**
 * Tests if this Long's value is greater than the specified's.
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
LongPrototype.greaterThan = function greaterThan(other) {
    return this.comp(/* validates */ other) > 0;
};

/**
 * Tests if this Long's value is greater than the specified's. This is an alias of {@link Long#greaterThan}.
 * @function
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
LongPrototype.gt = LongPrototype.greaterThan;

/**
 * Tests if this Long's value is greater than or equal the specified's.
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
LongPrototype.greaterThanOrEqual = function greaterThanOrEqual(other) {
    return this.comp(/* validates */ other) >= 0;
};

/**
 * Tests if this Long's value is greater than or equal the specified's. This is an alias of {@link Long#greaterThanOrEqual}.
 * @function
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
LongPrototype.gte = LongPrototype.greaterThanOrEqual;

/**
 * Tests if this Long's value is greater than or equal the specified's. This is an alias of {@link Long#greaterThanOrEqual}.
 * @function
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
LongPrototype.ge = LongPrototype.greaterThanOrEqual;

/**
 * Compares this Long's value with the specified's.
 * @param {!Long|number|string} other Other value
 * @returns {number} 0 if they are the same, 1 if the this is greater and -1
 *  if the given one is greater
 */
LongPrototype.compare = function compare(other) {
    if (!isLong(other))
        other = fromValue(other);
    if (this.eq(other))
        return 0;
    var thisNeg = this.isNegative(),
        otherNeg = other.isNegative();
    if (thisNeg && !otherNeg)
        return -1;
    if (!thisNeg && otherNeg)
        return 1;
    // At this point the sign bits are the same
    if (!this.unsigned)
        return this.sub(other).isNegative() ? -1 : 1;
    // Both are positive if at least one is unsigned
    return (other.high >>> 0) > (this.high >>> 0) || (other.high === this.high && (other.low >>> 0) > (this.low >>> 0)) ? -1 : 1;
};

/**
 * Compares this Long's value with the specified's. This is an alias of {@link Long#compare}.
 * @function
 * @param {!Long|number|string} other Other value
 * @returns {number} 0 if they are the same, 1 if the this is greater and -1
 *  if the given one is greater
 */
LongPrototype.comp = LongPrototype.compare;

/**
 * Negates this Long's value.
 * @returns {!Long} Negated Long
 */
LongPrototype.negate = function negate() {
    if (!this.unsigned && this.eq(MIN_VALUE))
        return MIN_VALUE;
    return this.not().add(ONE);
};

/**
 * Negates this Long's value. This is an alias of {@link Long#negate}.
 * @function
 * @returns {!Long} Negated Long
 */
LongPrototype.neg = LongPrototype.negate;

/**
 * Returns the sum of this and the specified Long.
 * @param {!Long|number|string} addend Addend
 * @returns {!Long} Sum
 */
LongPrototype.add = function add(addend) {
    if (!isLong(addend))
        addend = fromValue(addend);

    // Divide each number into 4 chunks of 16 bits, and then sum the chunks.

    var a48 = this.high >>> 16;
    var a32 = this.high & 0xFFFF;
    var a16 = this.low >>> 16;
    var a00 = this.low & 0xFFFF;

    var b48 = addend.high >>> 16;
    var b32 = addend.high & 0xFFFF;
    var b16 = addend.low >>> 16;
    var b00 = addend.low & 0xFFFF;

    var c48 = 0, c32 = 0, c16 = 0, c00 = 0;
    c00 += a00 + b00;
    c16 += c00 >>> 16;
    c00 &= 0xFFFF;
    c16 += a16 + b16;
    c32 += c16 >>> 16;
    c16 &= 0xFFFF;
    c32 += a32 + b32;
    c48 += c32 >>> 16;
    c32 &= 0xFFFF;
    c48 += a48 + b48;
    c48 &= 0xFFFF;
    return fromBits((c16 << 16) | c00, (c48 << 16) | c32, this.unsigned);
};

/**
 * Returns the difference of this and the specified Long.
 * @param {!Long|number|string} subtrahend Subtrahend
 * @returns {!Long} Difference
 */
LongPrototype.subtract = function subtract(subtrahend) {
    if (!isLong(subtrahend))
        subtrahend = fromValue(subtrahend);
    return this.add(subtrahend.neg());
};

/**
 * Returns the difference of this and the specified Long. This is an alias of {@link Long#subtract}.
 * @function
 * @param {!Long|number|string} subtrahend Subtrahend
 * @returns {!Long} Difference
 */
LongPrototype.sub = LongPrototype.subtract;

/**
 * Returns the product of this and the specified Long.
 * @param {!Long|number|string} multiplier Multiplier
 * @returns {!Long} Product
 */
LongPrototype.multiply = function multiply(multiplier) {
    if (this.isZero())
        return ZERO;
    if (!isLong(multiplier))
        multiplier = fromValue(multiplier);

    // use wasm support if present
    if (wasm) {
        var low = wasm.mul(this.low,
                           this.high,
                           multiplier.low,
                           multiplier.high);
        return fromBits(low, wasm.get_high(), this.unsigned);
    }

    if (multiplier.isZero())
        return ZERO;
    if (this.eq(MIN_VALUE))
        return multiplier.isOdd() ? MIN_VALUE : ZERO;
    if (multiplier.eq(MIN_VALUE))
        return this.isOdd() ? MIN_VALUE : ZERO;

    if (this.isNegative()) {
        if (multiplier.isNegative())
            return this.neg().mul(multiplier.neg());
        else
            return this.neg().mul(multiplier).neg();
    } else if (multiplier.isNegative())
        return this.mul(multiplier.neg()).neg();

    // If both longs are small, use float multiplication
    if (this.lt(TWO_PWR_24) && multiplier.lt(TWO_PWR_24))
        return fromNumber(this.toNumber() * multiplier.toNumber(), this.unsigned);

    // Divide each long into 4 chunks of 16 bits, and then add up 4x4 products.
    // We can skip products that would overflow.

    var a48 = this.high >>> 16;
    var a32 = this.high & 0xFFFF;
    var a16 = this.low >>> 16;
    var a00 = this.low & 0xFFFF;

    var b48 = multiplier.high >>> 16;
    var b32 = multiplier.high & 0xFFFF;
    var b16 = multiplier.low >>> 16;
    var b00 = multiplier.low & 0xFFFF;

    var c48 = 0, c32 = 0, c16 = 0, c00 = 0;
    c00 += a00 * b00;
    c16 += c00 >>> 16;
    c00 &= 0xFFFF;
    c16 += a16 * b00;
    c32 += c16 >>> 16;
    c16 &= 0xFFFF;
    c16 += a00 * b16;
    c32 += c16 >>> 16;
    c16 &= 0xFFFF;
    c32 += a32 * b00;
    c48 += c32 >>> 16;
    c32 &= 0xFFFF;
    c32 += a16 * b16;
    c48 += c32 >>> 16;
    c32 &= 0xFFFF;
    c32 += a00 * b32;
    c48 += c32 >>> 16;
    c32 &= 0xFFFF;
    c48 += a48 * b00 + a32 * b16 + a16 * b32 + a00 * b48;
    c48 &= 0xFFFF;
    return fromBits((c16 << 16) | c00, (c48 << 16) | c32, this.unsigned);
};

/**
 * Returns the product of this and the specified Long. This is an alias of {@link Long#multiply}.
 * @function
 * @param {!Long|number|string} multiplier Multiplier
 * @returns {!Long} Product
 */
LongPrototype.mul = LongPrototype.multiply;

/**
 * Returns this Long divided by the specified. The result is signed if this Long is signed or
 *  unsigned if this Long is unsigned.
 * @param {!Long|number|string} divisor Divisor
 * @returns {!Long} Quotient
 */
LongPrototype.divide = function divide(divisor) {
    if (!isLong(divisor))
        divisor = fromValue(divisor);
    if (divisor.isZero())
        throw Error('division by zero');

    // use wasm support if present
    if (wasm) {
        // guard against signed division overflow: the largest
        // negative number / -1 would be 1 larger than the largest
        // positive number, due to two's complement.
        if (!this.unsigned &&
            this.high === -0x80000000 &&
            divisor.low === -1 && divisor.high === -1) {
            // be consistent with non-wasm code path
            return this;
        }
        var low = (this.unsigned ? wasm.div_u : wasm.div_s)(
            this.low,
            this.high,
            divisor.low,
            divisor.high
        );
        return fromBits(low, wasm.get_high(), this.unsigned);
    }

    if (this.isZero())
        return this.unsigned ? UZERO : ZERO;
    var approx, rem, res;
    if (!this.unsigned) {
        // This section is only relevant for signed longs and is derived from the
        // closure library as a whole.
        if (this.eq(MIN_VALUE)) {
            if (divisor.eq(ONE) || divisor.eq(NEG_ONE))
                return MIN_VALUE;  // recall that -MIN_VALUE == MIN_VALUE
            else if (divisor.eq(MIN_VALUE))
                return ONE;
            else {
                // At this point, we have |other| >= 2, so |this/other| < |MIN_VALUE|.
                var halfThis = this.shr(1);
                approx = halfThis.div(divisor).shl(1);
                if (approx.eq(ZERO)) {
                    return divisor.isNegative() ? ONE : NEG_ONE;
                } else {
                    rem = this.sub(divisor.mul(approx));
                    res = approx.add(rem.div(divisor));
                    return res;
                }
            }
        } else if (divisor.eq(MIN_VALUE))
            return this.unsigned ? UZERO : ZERO;
        if (this.isNegative()) {
            if (divisor.isNegative())
                return this.neg().div(divisor.neg());
            return this.neg().div(divisor).neg();
        } else if (divisor.isNegative())
            return this.div(divisor.neg()).neg();
        res = ZERO;
    } else {
        // The algorithm below has not been made for unsigned longs. It's therefore
        // required to take special care of the MSB prior to running it.
        if (!divisor.unsigned)
            divisor = divisor.toUnsigned();
        if (divisor.gt(this))
            return UZERO;
        if (divisor.gt(this.shru(1))) // 15 >>> 1 = 7 ; with divisor = 8 ; true
            return UONE;
        res = UZERO;
    }

    // Repeat the following until the remainder is less than other:  find a
    // floating-point that approximates remainder / other *from below*, add this
    // into the result, and subtract it from the remainder.  It is critical that
    // the approximate value is less than or equal to the real value so that the
    // remainder never becomes negative.
    rem = this;
    while (rem.gte(divisor)) {
        // Approximate the result of division. This may be a little greater or
        // smaller than the actual value.
        approx = Math.max(1, Math.floor(rem.toNumber() / divisor.toNumber()));

        // We will tweak the approximate result by changing it in the 48-th digit or
        // the smallest non-fractional digit, whichever is larger.
        var log2 = Math.ceil(Math.log(approx) / Math.LN2),
            delta = (log2 <= 48) ? 1 : pow_dbl(2, log2 - 48),

        // Decrease the approximation until it is smaller than the remainder.  Note
        // that if it is too large, the product overflows and is negative.
            approxRes = fromNumber(approx),
            approxRem = approxRes.mul(divisor);
        while (approxRem.isNegative() || approxRem.gt(rem)) {
            approx -= delta;
            approxRes = fromNumber(approx, this.unsigned);
            approxRem = approxRes.mul(divisor);
        }

        // We know the answer can't be zero... and actually, zero would cause
        // infinite recursion since we would make no progress.
        if (approxRes.isZero())
            approxRes = ONE;

        res = res.add(approxRes);
        rem = rem.sub(approxRem);
    }
    return res;
};

/**
 * Returns this Long divided by the specified. This is an alias of {@link Long#divide}.
 * @function
 * @param {!Long|number|string} divisor Divisor
 * @returns {!Long} Quotient
 */
LongPrototype.div = LongPrototype.divide;

/**
 * Returns this Long modulo the specified.
 * @param {!Long|number|string} divisor Divisor
 * @returns {!Long} Remainder
 */
LongPrototype.modulo = function modulo(divisor) {
    if (!isLong(divisor))
        divisor = fromValue(divisor);

    // use wasm support if present
    if (wasm) {
        var low = (this.unsigned ? wasm.rem_u : wasm.rem_s)(
            this.low,
            this.high,
            divisor.low,
            divisor.high
        );
        return fromBits(low, wasm.get_high(), this.unsigned);
    }

    return this.sub(this.div(divisor).mul(divisor));
};

/**
 * Returns this Long modulo the specified. This is an alias of {@link Long#modulo}.
 * @function
 * @param {!Long|number|string} divisor Divisor
 * @returns {!Long} Remainder
 */
LongPrototype.mod = LongPrototype.modulo;

/**
 * Returns this Long modulo the specified. This is an alias of {@link Long#modulo}.
 * @function
 * @param {!Long|number|string} divisor Divisor
 * @returns {!Long} Remainder
 */
LongPrototype.rem = LongPrototype.modulo;

/**
 * Returns the bitwise NOT of this Long.
 * @returns {!Long}
 */
LongPrototype.not = function not() {
    return fromBits(~this.low, ~this.high, this.unsigned);
};

/**
 * Returns the bitwise AND of this Long and the specified.
 * @param {!Long|number|string} other Other Long
 * @returns {!Long}
 */
LongPrototype.and = function and(other) {
    if (!isLong(other))
        other = fromValue(other);
    return fromBits(this.low & other.low, this.high & other.high, this.unsigned);
};

/**
 * Returns the bitwise OR of this Long and the specified.
 * @param {!Long|number|string} other Other Long
 * @returns {!Long}
 */
LongPrototype.or = function or(other) {
    if (!isLong(other))
        other = fromValue(other);
    return fromBits(this.low | other.low, this.high | other.high, this.unsigned);
};

/**
 * Returns the bitwise XOR of this Long and the given one.
 * @param {!Long|number|string} other Other Long
 * @returns {!Long}
 */
LongPrototype.xor = function xor(other) {
    if (!isLong(other))
        other = fromValue(other);
    return fromBits(this.low ^ other.low, this.high ^ other.high, this.unsigned);
};

/**
 * Returns this Long with bits shifted to the left by the given amount.
 * @param {number|!Long} numBits Number of bits
 * @returns {!Long} Shifted Long
 */
LongPrototype.shiftLeft = function shiftLeft(numBits) {
    if (isLong(numBits))
        numBits = numBits.toInt();
    if ((numBits &= 63) === 0)
        return this;
    else if (numBits < 32)
        return fromBits(this.low << numBits, (this.high << numBits) | (this.low >>> (32 - numBits)), this.unsigned);
    else
        return fromBits(0, this.low << (numBits - 32), this.unsigned);
};

/**
 * Returns this Long with bits shifted to the left by the given amount. This is an alias of {@link Long#shiftLeft}.
 * @function
 * @param {number|!Long} numBits Number of bits
 * @returns {!Long} Shifted Long
 */
LongPrototype.shl = LongPrototype.shiftLeft;

/**
 * Returns this Long with bits arithmetically shifted to the right by the given amount.
 * @param {number|!Long} numBits Number of bits
 * @returns {!Long} Shifted Long
 */
LongPrototype.shiftRight = function shiftRight(numBits) {
    if (isLong(numBits))
        numBits = numBits.toInt();
    if ((numBits &= 63) === 0)
        return this;
    else if (numBits < 32)
        return fromBits((this.low >>> numBits) | (this.high << (32 - numBits)), this.high >> numBits, this.unsigned);
    else
        return fromBits(this.high >> (numBits - 32), this.high >= 0 ? 0 : -1, this.unsigned);
};

/**
 * Returns this Long with bits arithmetically shifted to the right by the given amount. This is an alias of {@link Long#shiftRight}.
 * @function
 * @param {number|!Long} numBits Number of bits
 * @returns {!Long} Shifted Long
 */
LongPrototype.shr = LongPrototype.shiftRight;

/**
 * Returns this Long with bits logically shifted to the right by the given amount.
 * @param {number|!Long} numBits Number of bits
 * @returns {!Long} Shifted Long
 */
LongPrototype.shiftRightUnsigned = function shiftRightUnsigned(numBits) {
    if (isLong(numBits))
        numBits = numBits.toInt();
    numBits &= 63;
    if (numBits === 0)
        return this;
    else {
        var high = this.high;
        if (numBits < 32) {
            var low = this.low;
            return fromBits((low >>> numBits) | (high << (32 - numBits)), high >>> numBits, this.unsigned);
        } else if (numBits === 32)
            return fromBits(high, 0, this.unsigned);
        else
            return fromBits(high >>> (numBits - 32), 0, this.unsigned);
    }
};

/**
 * Returns this Long with bits logically shifted to the right by the given amount. This is an alias of {@link Long#shiftRightUnsigned}.
 * @function
 * @param {number|!Long} numBits Number of bits
 * @returns {!Long} Shifted Long
 */
LongPrototype.shru = LongPrototype.shiftRightUnsigned;

/**
 * Returns this Long with bits logically shifted to the right by the given amount. This is an alias of {@link Long#shiftRightUnsigned}.
 * @function
 * @param {number|!Long} numBits Number of bits
 * @returns {!Long} Shifted Long
 */
LongPrototype.shr_u = LongPrototype.shiftRightUnsigned;

/**
 * Converts this Long to signed.
 * @returns {!Long} Signed long
 */
LongPrototype.toSigned = function toSigned() {
    if (!this.unsigned)
        return this;
    return fromBits(this.low, this.high, false);
};

/**
 * Converts this Long to unsigned.
 * @returns {!Long} Unsigned long
 */
LongPrototype.toUnsigned = function toUnsigned() {
    if (this.unsigned)
        return this;
    return fromBits(this.low, this.high, true);
};

/**
 * Converts this Long to its byte representation.
 * @param {boolean=} le Whether little or big endian, defaults to big endian
 * @returns {!Array.<number>} Byte representation
 */
LongPrototype.toBytes = function toBytes(le) {
    return le ? this.toBytesLE() : this.toBytesBE();
};

/**
 * Converts this Long to its little endian byte representation.
 * @returns {!Array.<number>} Little endian byte representation
 */
LongPrototype.toBytesLE = function toBytesLE() {
    var hi = this.high,
        lo = this.low;
    return [
        lo        & 0xff,
        lo >>>  8 & 0xff,
        lo >>> 16 & 0xff,
        lo >>> 24       ,
        hi        & 0xff,
        hi >>>  8 & 0xff,
        hi >>> 16 & 0xff,
        hi >>> 24
    ];
};

/**
 * Converts this Long to its big endian byte representation.
 * @returns {!Array.<number>} Big endian byte representation
 */
LongPrototype.toBytesBE = function toBytesBE() {
    var hi = this.high,
        lo = this.low;
    return [
        hi >>> 24       ,
        hi >>> 16 & 0xff,
        hi >>>  8 & 0xff,
        hi        & 0xff,
        lo >>> 24       ,
        lo >>> 16 & 0xff,
        lo >>>  8 & 0xff,
        lo        & 0xff
    ];
};

/**
 * Creates a Long from its byte representation.
 * @param {!Array.<number>} bytes Byte representation
 * @param {boolean=} unsigned Whether unsigned or not, defaults to signed
 * @param {boolean=} le Whether little or big endian, defaults to big endian
 * @returns {Long} The corresponding Long value
 */
Long.fromBytes = function fromBytes(bytes, unsigned, le) {
    return le ? Long.fromBytesLE(bytes, unsigned) : Long.fromBytesBE(bytes, unsigned);
};

/**
 * Creates a Long from its little endian byte representation.
 * @param {!Array.<number>} bytes Little endian byte representation
 * @param {boolean=} unsigned Whether unsigned or not, defaults to signed
 * @returns {Long} The corresponding Long value
 */
Long.fromBytesLE = function fromBytesLE(bytes, unsigned) {
    return new Long(
        bytes[0]       |
        bytes[1] <<  8 |
        bytes[2] << 16 |
        bytes[3] << 24,
        bytes[4]       |
        bytes[5] <<  8 |
        bytes[6] << 16 |
        bytes[7] << 24,
        unsigned
    );
};

/**
 * Creates a Long from its big endian byte representation.
 * @param {!Array.<number>} bytes Big endian byte representation
 * @param {boolean=} unsigned Whether unsigned or not, defaults to signed
 * @returns {Long} The corresponding Long value
 */
Long.fromBytesBE = function fromBytesBE(bytes, unsigned) {
    return new Long(
        bytes[4] << 24 |
        bytes[5] << 16 |
        bytes[6] <<  8 |
        bytes[7],
        bytes[0] << 24 |
        bytes[1] << 16 |
        bytes[2] <<  8 |
        bytes[3],
        unsigned
    );
};


/***/ }),

/***/ 2100:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
// minimal library entry point.


module.exports = __webpack_require__(9482);


/***/ }),

/***/ 9482:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var protobuf = exports;

/**
 * Build type, one of `"full"`, `"light"` or `"minimal"`.
 * @name build
 * @type {string}
 * @const
 */
protobuf.build = "minimal";

// Serialization
protobuf.Writer       = __webpack_require__(1173);
protobuf.BufferWriter = __webpack_require__(3155);
protobuf.Reader       = __webpack_require__(1408);
protobuf.BufferReader = __webpack_require__(593);

// Utility
protobuf.util         = __webpack_require__(9693);
protobuf.rpc          = __webpack_require__(5994);
protobuf.roots        = __webpack_require__(5054);
protobuf.configure    = configure;

/* istanbul ignore next */
/**
 * Reconfigures the library according to the environment.
 * @returns {undefined}
 */
function configure() {
    protobuf.util._configure();
    protobuf.Writer._configure(protobuf.BufferWriter);
    protobuf.Reader._configure(protobuf.BufferReader);
}

// Set up buffer utility according to the environment
configure();


/***/ }),

/***/ 1408:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

module.exports = Reader;

var util      = __webpack_require__(9693);

var BufferReader; // cyclic

var LongBits  = util.LongBits,
    utf8      = util.utf8;

/* istanbul ignore next */
function indexOutOfRange(reader, writeLength) {
    return RangeError("index out of range: " + reader.pos + " + " + (writeLength || 1) + " > " + reader.len);
}

/**
 * Constructs a new reader instance using the specified buffer.
 * @classdesc Wire format reader using `Uint8Array` if available, otherwise `Array`.
 * @constructor
 * @param {Uint8Array} buffer Buffer to read from
 */
function Reader(buffer) {

    /**
     * Read buffer.
     * @type {Uint8Array}
     */
    this.buf = buffer;

    /**
     * Read buffer position.
     * @type {number}
     */
    this.pos = 0;

    /**
     * Read buffer length.
     * @type {number}
     */
    this.len = buffer.length;
}

var create_array = typeof Uint8Array !== "undefined"
    ? function create_typed_array(buffer) {
        if (buffer instanceof Uint8Array || Array.isArray(buffer))
            return new Reader(buffer);
        throw Error("illegal buffer");
    }
    /* istanbul ignore next */
    : function create_array(buffer) {
        if (Array.isArray(buffer))
            return new Reader(buffer);
        throw Error("illegal buffer");
    };

var create = function create() {
    return util.Buffer
        ? function create_buffer_setup(buffer) {
            return (Reader.create = function create_buffer(buffer) {
                return util.Buffer.isBuffer(buffer)
                    ? new BufferReader(buffer)
                    /* istanbul ignore next */
                    : create_array(buffer);
            })(buffer);
        }
        /* istanbul ignore next */
        : create_array;
};

/**
 * Creates a new reader using the specified buffer.
 * @function
 * @param {Uint8Array|Buffer} buffer Buffer to read from
 * @returns {Reader|BufferReader} A {@link BufferReader} if `buffer` is a Buffer, otherwise a {@link Reader}
 * @throws {Error} If `buffer` is not a valid buffer
 */
Reader.create = create();

Reader.prototype._slice = util.Array.prototype.subarray || /* istanbul ignore next */ util.Array.prototype.slice;

/**
 * Reads a varint as an unsigned 32 bit value.
 * @function
 * @returns {number} Value read
 */
Reader.prototype.uint32 = (function read_uint32_setup() {
    var value = 4294967295; // optimizer type-hint, tends to deopt otherwise (?!)
    return function read_uint32() {
        value = (         this.buf[this.pos] & 127       ) >>> 0; if (this.buf[this.pos++] < 128) return value;
        value = (value | (this.buf[this.pos] & 127) <<  7) >>> 0; if (this.buf[this.pos++] < 128) return value;
        value = (value | (this.buf[this.pos] & 127) << 14) >>> 0; if (this.buf[this.pos++] < 128) return value;
        value = (value | (this.buf[this.pos] & 127) << 21) >>> 0; if (this.buf[this.pos++] < 128) return value;
        value = (value | (this.buf[this.pos] &  15) << 28) >>> 0; if (this.buf[this.pos++] < 128) return value;

        /* istanbul ignore if */
        if ((this.pos += 5) > this.len) {
            this.pos = this.len;
            throw indexOutOfRange(this, 10);
        }
        return value;
    };
})();

/**
 * Reads a varint as a signed 32 bit value.
 * @returns {number} Value read
 */
Reader.prototype.int32 = function read_int32() {
    return this.uint32() | 0;
};

/**
 * Reads a zig-zag encoded varint as a signed 32 bit value.
 * @returns {number} Value read
 */
Reader.prototype.sint32 = function read_sint32() {
    var value = this.uint32();
    return value >>> 1 ^ -(value & 1) | 0;
};

/* eslint-disable no-invalid-this */

function readLongVarint() {
    // tends to deopt with local vars for octet etc.
    var bits = new LongBits(0, 0);
    var i = 0;
    if (this.len - this.pos > 4) { // fast route (lo)
        for (; i < 4; ++i) {
            // 1st..4th
            bits.lo = (bits.lo | (this.buf[this.pos] & 127) << i * 7) >>> 0;
            if (this.buf[this.pos++] < 128)
                return bits;
        }
        // 5th
        bits.lo = (bits.lo | (this.buf[this.pos] & 127) << 28) >>> 0;
        bits.hi = (bits.hi | (this.buf[this.pos] & 127) >>  4) >>> 0;
        if (this.buf[this.pos++] < 128)
            return bits;
        i = 0;
    } else {
        for (; i < 3; ++i) {
            /* istanbul ignore if */
            if (this.pos >= this.len)
                throw indexOutOfRange(this);
            // 1st..3th
            bits.lo = (bits.lo | (this.buf[this.pos] & 127) << i * 7) >>> 0;
            if (this.buf[this.pos++] < 128)
                return bits;
        }
        // 4th
        bits.lo = (bits.lo | (this.buf[this.pos++] & 127) << i * 7) >>> 0;
        return bits;
    }
    if (this.len - this.pos > 4) { // fast route (hi)
        for (; i < 5; ++i) {
            // 6th..10th
            bits.hi = (bits.hi | (this.buf[this.pos] & 127) << i * 7 + 3) >>> 0;
            if (this.buf[this.pos++] < 128)
                return bits;
        }
    } else {
        for (; i < 5; ++i) {
            /* istanbul ignore if */
            if (this.pos >= this.len)
                throw indexOutOfRange(this);
            // 6th..10th
            bits.hi = (bits.hi | (this.buf[this.pos] & 127) << i * 7 + 3) >>> 0;
            if (this.buf[this.pos++] < 128)
                return bits;
        }
    }
    /* istanbul ignore next */
    throw Error("invalid varint encoding");
}

/* eslint-enable no-invalid-this */

/**
 * Reads a varint as a signed 64 bit value.
 * @name Reader#int64
 * @function
 * @returns {Long} Value read
 */

/**
 * Reads a varint as an unsigned 64 bit value.
 * @name Reader#uint64
 * @function
 * @returns {Long} Value read
 */

/**
 * Reads a zig-zag encoded varint as a signed 64 bit value.
 * @name Reader#sint64
 * @function
 * @returns {Long} Value read
 */

/**
 * Reads a varint as a boolean.
 * @returns {boolean} Value read
 */
Reader.prototype.bool = function read_bool() {
    return this.uint32() !== 0;
};

function readFixed32_end(buf, end) { // note that this uses `end`, not `pos`
    return (buf[end - 4]
          | buf[end - 3] << 8
          | buf[end - 2] << 16
          | buf[end - 1] << 24) >>> 0;
}

/**
 * Reads fixed 32 bits as an unsigned 32 bit integer.
 * @returns {number} Value read
 */
Reader.prototype.fixed32 = function read_fixed32() {

    /* istanbul ignore if */
    if (this.pos + 4 > this.len)
        throw indexOutOfRange(this, 4);

    return readFixed32_end(this.buf, this.pos += 4);
};

/**
 * Reads fixed 32 bits as a signed 32 bit integer.
 * @returns {number} Value read
 */
Reader.prototype.sfixed32 = function read_sfixed32() {

    /* istanbul ignore if */
    if (this.pos + 4 > this.len)
        throw indexOutOfRange(this, 4);

    return readFixed32_end(this.buf, this.pos += 4) | 0;
};

/* eslint-disable no-invalid-this */

function readFixed64(/* this: Reader */) {

    /* istanbul ignore if */
    if (this.pos + 8 > this.len)
        throw indexOutOfRange(this, 8);

    return new LongBits(readFixed32_end(this.buf, this.pos += 4), readFixed32_end(this.buf, this.pos += 4));
}

/* eslint-enable no-invalid-this */

/**
 * Reads fixed 64 bits.
 * @name Reader#fixed64
 * @function
 * @returns {Long} Value read
 */

/**
 * Reads zig-zag encoded fixed 64 bits.
 * @name Reader#sfixed64
 * @function
 * @returns {Long} Value read
 */

/**
 * Reads a float (32 bit) as a number.
 * @function
 * @returns {number} Value read
 */
Reader.prototype.float = function read_float() {

    /* istanbul ignore if */
    if (this.pos + 4 > this.len)
        throw indexOutOfRange(this, 4);

    var value = util.float.readFloatLE(this.buf, this.pos);
    this.pos += 4;
    return value;
};

/**
 * Reads a double (64 bit float) as a number.
 * @function
 * @returns {number} Value read
 */
Reader.prototype.double = function read_double() {

    /* istanbul ignore if */
    if (this.pos + 8 > this.len)
        throw indexOutOfRange(this, 4);

    var value = util.float.readDoubleLE(this.buf, this.pos);
    this.pos += 8;
    return value;
};

/**
 * Reads a sequence of bytes preceeded by its length as a varint.
 * @returns {Uint8Array} Value read
 */
Reader.prototype.bytes = function read_bytes() {
    var length = this.uint32(),
        start  = this.pos,
        end    = this.pos + length;

    /* istanbul ignore if */
    if (end > this.len)
        throw indexOutOfRange(this, length);

    this.pos += length;
    if (Array.isArray(this.buf)) // plain array
        return this.buf.slice(start, end);
    return start === end // fix for IE 10/Win8 and others' subarray returning array of size 1
        ? new this.buf.constructor(0)
        : this._slice.call(this.buf, start, end);
};

/**
 * Reads a string preceeded by its byte length as a varint.
 * @returns {string} Value read
 */
Reader.prototype.string = function read_string() {
    var bytes = this.bytes();
    return utf8.read(bytes, 0, bytes.length);
};

/**
 * Skips the specified number of bytes if specified, otherwise skips a varint.
 * @param {number} [length] Length if known, otherwise a varint is assumed
 * @returns {Reader} `this`
 */
Reader.prototype.skip = function skip(length) {
    if (typeof length === "number") {
        /* istanbul ignore if */
        if (this.pos + length > this.len)
            throw indexOutOfRange(this, length);
        this.pos += length;
    } else {
        do {
            /* istanbul ignore if */
            if (this.pos >= this.len)
                throw indexOutOfRange(this);
        } while (this.buf[this.pos++] & 128);
    }
    return this;
};

/**
 * Skips the next element of the specified wire type.
 * @param {number} wireType Wire type received
 * @returns {Reader} `this`
 */
Reader.prototype.skipType = function(wireType) {
    switch (wireType) {
        case 0:
            this.skip();
            break;
        case 1:
            this.skip(8);
            break;
        case 2:
            this.skip(this.uint32());
            break;
        case 3:
            while ((wireType = this.uint32() & 7) !== 4) {
                this.skipType(wireType);
            }
            break;
        case 5:
            this.skip(4);
            break;

        /* istanbul ignore next */
        default:
            throw Error("invalid wire type " + wireType + " at offset " + this.pos);
    }
    return this;
};

Reader._configure = function(BufferReader_) {
    BufferReader = BufferReader_;
    Reader.create = create();
    BufferReader._configure();

    var fn = util.Long ? "toLong" : /* istanbul ignore next */ "toNumber";
    util.merge(Reader.prototype, {

        int64: function read_int64() {
            return readLongVarint.call(this)[fn](false);
        },

        uint64: function read_uint64() {
            return readLongVarint.call(this)[fn](true);
        },

        sint64: function read_sint64() {
            return readLongVarint.call(this).zzDecode()[fn](false);
        },

        fixed64: function read_fixed64() {
            return readFixed64.call(this)[fn](true);
        },

        sfixed64: function read_sfixed64() {
            return readFixed64.call(this)[fn](false);
        }

    });
};


/***/ }),

/***/ 593:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

module.exports = BufferReader;

// extends Reader
var Reader = __webpack_require__(1408);
(BufferReader.prototype = Object.create(Reader.prototype)).constructor = BufferReader;

var util = __webpack_require__(9693);

/**
 * Constructs a new buffer reader instance.
 * @classdesc Wire format reader using node buffers.
 * @extends Reader
 * @constructor
 * @param {Buffer} buffer Buffer to read from
 */
function BufferReader(buffer) {
    Reader.call(this, buffer);

    /**
     * Read buffer.
     * @name BufferReader#buf
     * @type {Buffer}
     */
}

BufferReader._configure = function () {
    /* istanbul ignore else */
    if (util.Buffer)
        BufferReader.prototype._slice = util.Buffer.prototype.slice;
};


/**
 * @override
 */
BufferReader.prototype.string = function read_string_buffer() {
    var len = this.uint32(); // modifies pos
    return this.buf.utf8Slice
        ? this.buf.utf8Slice(this.pos, this.pos = Math.min(this.pos + len, this.len))
        : this.buf.toString("utf-8", this.pos, this.pos = Math.min(this.pos + len, this.len));
};

/**
 * Reads a sequence of bytes preceeded by its length as a varint.
 * @name BufferReader#bytes
 * @function
 * @returns {Buffer} Value read
 */

BufferReader._configure();


/***/ }),

/***/ 5054:
/***/ (function(module) {

"use strict";

module.exports = {};

/**
 * Named roots.
 * This is where pbjs stores generated structures (the option `-r, --root` specifies a name).
 * Can also be used manually to make roots available accross modules.
 * @name roots
 * @type {Object.<string,Root>}
 * @example
 * // pbjs -r myroot -o compiled.js ...
 *
 * // in another module:
 * require("./compiled.js");
 *
 * // in any subsequent module:
 * var root = protobuf.roots["myroot"];
 */


/***/ }),

/***/ 5994:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


/**
 * Streaming RPC helpers.
 * @namespace
 */
var rpc = exports;

/**
 * RPC implementation passed to {@link Service#create} performing a service request on network level, i.e. by utilizing http requests or websockets.
 * @typedef RPCImpl
 * @type {function}
 * @param {Method|rpc.ServiceMethod<Message<{}>,Message<{}>>} method Reflected or static method being called
 * @param {Uint8Array} requestData Request data
 * @param {RPCImplCallback} callback Callback function
 * @returns {undefined}
 * @example
 * function rpcImpl(method, requestData, callback) {
 *     if (protobuf.util.lcFirst(method.name) !== "myMethod") // compatible with static code
 *         throw Error("no such method");
 *     asynchronouslyObtainAResponse(requestData, function(err, responseData) {
 *         callback(err, responseData);
 *     });
 * }
 */

/**
 * Node-style callback as used by {@link RPCImpl}.
 * @typedef RPCImplCallback
 * @type {function}
 * @param {Error|null} error Error, if any, otherwise `null`
 * @param {Uint8Array|null} [response] Response data or `null` to signal end of stream, if there hasn't been an error
 * @returns {undefined}
 */

rpc.Service = __webpack_require__(7948);


/***/ }),

/***/ 7948:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

module.exports = Service;

var util = __webpack_require__(9693);

// Extends EventEmitter
(Service.prototype = Object.create(util.EventEmitter.prototype)).constructor = Service;

/**
 * A service method callback as used by {@link rpc.ServiceMethod|ServiceMethod}.
 *
 * Differs from {@link RPCImplCallback} in that it is an actual callback of a service method which may not return `response = null`.
 * @typedef rpc.ServiceMethodCallback
 * @template TRes extends Message<TRes>
 * @type {function}
 * @param {Error|null} error Error, if any
 * @param {TRes} [response] Response message
 * @returns {undefined}
 */

/**
 * A service method part of a {@link rpc.Service} as created by {@link Service.create}.
 * @typedef rpc.ServiceMethod
 * @template TReq extends Message<TReq>
 * @template TRes extends Message<TRes>
 * @type {function}
 * @param {TReq|Properties<TReq>} request Request message or plain object
 * @param {rpc.ServiceMethodCallback<TRes>} [callback] Node-style callback called with the error, if any, and the response message
 * @returns {Promise<Message<TRes>>} Promise if `callback` has been omitted, otherwise `undefined`
 */

/**
 * Constructs a new RPC service instance.
 * @classdesc An RPC service as returned by {@link Service#create}.
 * @exports rpc.Service
 * @extends util.EventEmitter
 * @constructor
 * @param {RPCImpl} rpcImpl RPC implementation
 * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
 * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
 */
function Service(rpcImpl, requestDelimited, responseDelimited) {

    if (typeof rpcImpl !== "function")
        throw TypeError("rpcImpl must be a function");

    util.EventEmitter.call(this);

    /**
     * RPC implementation. Becomes `null` once the service is ended.
     * @type {RPCImpl|null}
     */
    this.rpcImpl = rpcImpl;

    /**
     * Whether requests are length-delimited.
     * @type {boolean}
     */
    this.requestDelimited = Boolean(requestDelimited);

    /**
     * Whether responses are length-delimited.
     * @type {boolean}
     */
    this.responseDelimited = Boolean(responseDelimited);
}

/**
 * Calls a service method through {@link rpc.Service#rpcImpl|rpcImpl}.
 * @param {Method|rpc.ServiceMethod<TReq,TRes>} method Reflected or static method
 * @param {Constructor<TReq>} requestCtor Request constructor
 * @param {Constructor<TRes>} responseCtor Response constructor
 * @param {TReq|Properties<TReq>} request Request message or plain object
 * @param {rpc.ServiceMethodCallback<TRes>} callback Service callback
 * @returns {undefined}
 * @template TReq extends Message<TReq>
 * @template TRes extends Message<TRes>
 */
Service.prototype.rpcCall = function rpcCall(method, requestCtor, responseCtor, request, callback) {

    if (!request)
        throw TypeError("request must be specified");

    var self = this;
    if (!callback)
        return util.asPromise(rpcCall, self, method, requestCtor, responseCtor, request);

    if (!self.rpcImpl) {
        setTimeout(function() { callback(Error("already ended")); }, 0);
        return undefined;
    }

    try {
        return self.rpcImpl(
            method,
            requestCtor[self.requestDelimited ? "encodeDelimited" : "encode"](request).finish(),
            function rpcCallback(err, response) {

                if (err) {
                    self.emit("error", err, method);
                    return callback(err);
                }

                if (response === null) {
                    self.end(/* endedByRPC */ true);
                    return undefined;
                }

                if (!(response instanceof responseCtor)) {
                    try {
                        response = responseCtor[self.responseDelimited ? "decodeDelimited" : "decode"](response);
                    } catch (err) {
                        self.emit("error", err, method);
                        return callback(err);
                    }
                }

                self.emit("data", response, method);
                return callback(null, response);
            }
        );
    } catch (err) {
        self.emit("error", err, method);
        setTimeout(function() { callback(err); }, 0);
        return undefined;
    }
};

/**
 * Ends this service and emits the `end` event.
 * @param {boolean} [endedByRPC=false] Whether the service has been ended by the RPC implementation.
 * @returns {rpc.Service} `this`
 */
Service.prototype.end = function end(endedByRPC) {
    if (this.rpcImpl) {
        if (!endedByRPC) // signal end to rpcImpl
            this.rpcImpl(null, null, null);
        this.rpcImpl = null;
        this.emit("end").off();
    }
    return this;
};


/***/ }),

/***/ 1945:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

module.exports = LongBits;

var util = __webpack_require__(9693);

/**
 * Constructs new long bits.
 * @classdesc Helper class for working with the low and high bits of a 64 bit value.
 * @memberof util
 * @constructor
 * @param {number} lo Low 32 bits, unsigned
 * @param {number} hi High 32 bits, unsigned
 */
function LongBits(lo, hi) {

    // note that the casts below are theoretically unnecessary as of today, but older statically
    // generated converter code might still call the ctor with signed 32bits. kept for compat.

    /**
     * Low bits.
     * @type {number}
     */
    this.lo = lo >>> 0;

    /**
     * High bits.
     * @type {number}
     */
    this.hi = hi >>> 0;
}

/**
 * Zero bits.
 * @memberof util.LongBits
 * @type {util.LongBits}
 */
var zero = LongBits.zero = new LongBits(0, 0);

zero.toNumber = function() { return 0; };
zero.zzEncode = zero.zzDecode = function() { return this; };
zero.length = function() { return 1; };

/**
 * Zero hash.
 * @memberof util.LongBits
 * @type {string}
 */
var zeroHash = LongBits.zeroHash = "\0\0\0\0\0\0\0\0";

/**
 * Constructs new long bits from the specified number.
 * @param {number} value Value
 * @returns {util.LongBits} Instance
 */
LongBits.fromNumber = function fromNumber(value) {
    if (value === 0)
        return zero;
    var sign = value < 0;
    if (sign)
        value = -value;
    var lo = value >>> 0,
        hi = (value - lo) / 4294967296 >>> 0;
    if (sign) {
        hi = ~hi >>> 0;
        lo = ~lo >>> 0;
        if (++lo > 4294967295) {
            lo = 0;
            if (++hi > 4294967295)
                hi = 0;
        }
    }
    return new LongBits(lo, hi);
};

/**
 * Constructs new long bits from a number, long or string.
 * @param {Long|number|string} value Value
 * @returns {util.LongBits} Instance
 */
LongBits.from = function from(value) {
    if (typeof value === "number")
        return LongBits.fromNumber(value);
    if (util.isString(value)) {
        /* istanbul ignore else */
        if (util.Long)
            value = util.Long.fromString(value);
        else
            return LongBits.fromNumber(parseInt(value, 10));
    }
    return value.low || value.high ? new LongBits(value.low >>> 0, value.high >>> 0) : zero;
};

/**
 * Converts this long bits to a possibly unsafe JavaScript number.
 * @param {boolean} [unsigned=false] Whether unsigned or not
 * @returns {number} Possibly unsafe number
 */
LongBits.prototype.toNumber = function toNumber(unsigned) {
    if (!unsigned && this.hi >>> 31) {
        var lo = ~this.lo + 1 >>> 0,
            hi = ~this.hi     >>> 0;
        if (!lo)
            hi = hi + 1 >>> 0;
        return -(lo + hi * 4294967296);
    }
    return this.lo + this.hi * 4294967296;
};

/**
 * Converts this long bits to a long.
 * @param {boolean} [unsigned=false] Whether unsigned or not
 * @returns {Long} Long
 */
LongBits.prototype.toLong = function toLong(unsigned) {
    return util.Long
        ? new util.Long(this.lo | 0, this.hi | 0, Boolean(unsigned))
        /* istanbul ignore next */
        : { low: this.lo | 0, high: this.hi | 0, unsigned: Boolean(unsigned) };
};

var charCodeAt = String.prototype.charCodeAt;

/**
 * Constructs new long bits from the specified 8 characters long hash.
 * @param {string} hash Hash
 * @returns {util.LongBits} Bits
 */
LongBits.fromHash = function fromHash(hash) {
    if (hash === zeroHash)
        return zero;
    return new LongBits(
        ( charCodeAt.call(hash, 0)
        | charCodeAt.call(hash, 1) << 8
        | charCodeAt.call(hash, 2) << 16
        | charCodeAt.call(hash, 3) << 24) >>> 0
    ,
        ( charCodeAt.call(hash, 4)
        | charCodeAt.call(hash, 5) << 8
        | charCodeAt.call(hash, 6) << 16
        | charCodeAt.call(hash, 7) << 24) >>> 0
    );
};

/**
 * Converts this long bits to a 8 characters long hash.
 * @returns {string} Hash
 */
LongBits.prototype.toHash = function toHash() {
    return String.fromCharCode(
        this.lo        & 255,
        this.lo >>> 8  & 255,
        this.lo >>> 16 & 255,
        this.lo >>> 24      ,
        this.hi        & 255,
        this.hi >>> 8  & 255,
        this.hi >>> 16 & 255,
        this.hi >>> 24
    );
};

/**
 * Zig-zag encodes this long bits.
 * @returns {util.LongBits} `this`
 */
LongBits.prototype.zzEncode = function zzEncode() {
    var mask =   this.hi >> 31;
    this.hi  = ((this.hi << 1 | this.lo >>> 31) ^ mask) >>> 0;
    this.lo  = ( this.lo << 1                   ^ mask) >>> 0;
    return this;
};

/**
 * Zig-zag decodes this long bits.
 * @returns {util.LongBits} `this`
 */
LongBits.prototype.zzDecode = function zzDecode() {
    var mask = -(this.lo & 1);
    this.lo  = ((this.lo >>> 1 | this.hi << 31) ^ mask) >>> 0;
    this.hi  = ( this.hi >>> 1                  ^ mask) >>> 0;
    return this;
};

/**
 * Calculates the length of this longbits when encoded as a varint.
 * @returns {number} Length
 */
LongBits.prototype.length = function length() {
    var part0 =  this.lo,
        part1 = (this.lo >>> 28 | this.hi << 4) >>> 0,
        part2 =  this.hi >>> 24;
    return part2 === 0
         ? part1 === 0
           ? part0 < 16384
             ? part0 < 128 ? 1 : 2
             : part0 < 2097152 ? 3 : 4
           : part1 < 16384
             ? part1 < 128 ? 5 : 6
             : part1 < 2097152 ? 7 : 8
         : part2 < 128 ? 9 : 10;
};


/***/ }),

/***/ 9693:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var util = exports;

// used to return a Promise where callback is omitted
util.asPromise = __webpack_require__(4537);

// converts to / from base64 encoded strings
util.base64 = __webpack_require__(7419);

// base class of rpc.Service
util.EventEmitter = __webpack_require__(9211);

// float handling accross browsers
util.float = __webpack_require__(945);

// requires modules optionally and hides the call from bundlers
util.inquire = __webpack_require__(7199);

// converts to / from utf8 encoded strings
util.utf8 = __webpack_require__(4997);

// provides a node-like buffer pool in the browser
util.pool = __webpack_require__(6662);

// utility to work with the low and high bits of a 64 bit value
util.LongBits = __webpack_require__(1945);

/**
 * Whether running within node or not.
 * @memberof util
 * @type {boolean}
 */
util.isNode = Boolean(typeof __webpack_require__.g !== "undefined"
                   && __webpack_require__.g
                   && __webpack_require__.g.process
                   && __webpack_require__.g.process.versions
                   && __webpack_require__.g.process.versions.node);

/**
 * Global object reference.
 * @memberof util
 * @type {Object}
 */
util.global = util.isNode && __webpack_require__.g
           || typeof window !== "undefined" && window
           || typeof self   !== "undefined" && self
           || this; // eslint-disable-line no-invalid-this

/**
 * An immuable empty array.
 * @memberof util
 * @type {Array.<*>}
 * @const
 */
util.emptyArray = Object.freeze ? Object.freeze([]) : /* istanbul ignore next */ []; // used on prototypes

/**
 * An immutable empty object.
 * @type {Object}
 * @const
 */
util.emptyObject = Object.freeze ? Object.freeze({}) : /* istanbul ignore next */ {}; // used on prototypes

/**
 * Tests if the specified value is an integer.
 * @function
 * @param {*} value Value to test
 * @returns {boolean} `true` if the value is an integer
 */
util.isInteger = Number.isInteger || /* istanbul ignore next */ function isInteger(value) {
    return typeof value === "number" && isFinite(value) && Math.floor(value) === value;
};

/**
 * Tests if the specified value is a string.
 * @param {*} value Value to test
 * @returns {boolean} `true` if the value is a string
 */
util.isString = function isString(value) {
    return typeof value === "string" || value instanceof String;
};

/**
 * Tests if the specified value is a non-null object.
 * @param {*} value Value to test
 * @returns {boolean} `true` if the value is a non-null object
 */
util.isObject = function isObject(value) {
    return value && typeof value === "object";
};

/**
 * Checks if a property on a message is considered to be present.
 * This is an alias of {@link util.isSet}.
 * @function
 * @param {Object} obj Plain object or message instance
 * @param {string} prop Property name
 * @returns {boolean} `true` if considered to be present, otherwise `false`
 */
util.isset =

/**
 * Checks if a property on a message is considered to be present.
 * @param {Object} obj Plain object or message instance
 * @param {string} prop Property name
 * @returns {boolean} `true` if considered to be present, otherwise `false`
 */
util.isSet = function isSet(obj, prop) {
    var value = obj[prop];
    if (value != null && obj.hasOwnProperty(prop)) // eslint-disable-line eqeqeq, no-prototype-builtins
        return typeof value !== "object" || (Array.isArray(value) ? value.length : Object.keys(value).length) > 0;
    return false;
};

/**
 * Any compatible Buffer instance.
 * This is a minimal stand-alone definition of a Buffer instance. The actual type is that exported by node's typings.
 * @interface Buffer
 * @extends Uint8Array
 */

/**
 * Node's Buffer class if available.
 * @type {Constructor<Buffer>}
 */
util.Buffer = (function() {
    try {
        var Buffer = util.inquire("buffer").Buffer;
        // refuse to use non-node buffers if not explicitly assigned (perf reasons):
        return Buffer.prototype.utf8Write ? Buffer : /* istanbul ignore next */ null;
    } catch (e) {
        /* istanbul ignore next */
        return null;
    }
})();

// Internal alias of or polyfull for Buffer.from.
util._Buffer_from = null;

// Internal alias of or polyfill for Buffer.allocUnsafe.
util._Buffer_allocUnsafe = null;

/**
 * Creates a new buffer of whatever type supported by the environment.
 * @param {number|number[]} [sizeOrArray=0] Buffer size or number array
 * @returns {Uint8Array|Buffer} Buffer
 */
util.newBuffer = function newBuffer(sizeOrArray) {
    /* istanbul ignore next */
    return typeof sizeOrArray === "number"
        ? util.Buffer
            ? util._Buffer_allocUnsafe(sizeOrArray)
            : new util.Array(sizeOrArray)
        : util.Buffer
            ? util._Buffer_from(sizeOrArray)
            : typeof Uint8Array === "undefined"
                ? sizeOrArray
                : new Uint8Array(sizeOrArray);
};

/**
 * Array implementation used in the browser. `Uint8Array` if supported, otherwise `Array`.
 * @type {Constructor<Uint8Array>}
 */
util.Array = typeof Uint8Array !== "undefined" ? Uint8Array /* istanbul ignore next */ : Array;

/**
 * Any compatible Long instance.
 * This is a minimal stand-alone definition of a Long instance. The actual type is that exported by long.js.
 * @interface Long
 * @property {number} low Low bits
 * @property {number} high High bits
 * @property {boolean} unsigned Whether unsigned or not
 */

/**
 * Long.js's Long class if available.
 * @type {Constructor<Long>}
 */
util.Long = /* istanbul ignore next */ util.global.dcodeIO && /* istanbul ignore next */ util.global.dcodeIO.Long
         || /* istanbul ignore next */ util.global.Long
         || util.inquire("long");

/**
 * Regular expression used to verify 2 bit (`bool`) map keys.
 * @type {RegExp}
 * @const
 */
util.key2Re = /^true|false|0|1$/;

/**
 * Regular expression used to verify 32 bit (`int32` etc.) map keys.
 * @type {RegExp}
 * @const
 */
util.key32Re = /^-?(?:0|[1-9][0-9]*)$/;

/**
 * Regular expression used to verify 64 bit (`int64` etc.) map keys.
 * @type {RegExp}
 * @const
 */
util.key64Re = /^(?:[\\x00-\\xff]{8}|-?(?:0|[1-9][0-9]*))$/;

/**
 * Converts a number or long to an 8 characters long hash string.
 * @param {Long|number} value Value to convert
 * @returns {string} Hash
 */
util.longToHash = function longToHash(value) {
    return value
        ? util.LongBits.from(value).toHash()
        : util.LongBits.zeroHash;
};

/**
 * Converts an 8 characters long hash string to a long or number.
 * @param {string} hash Hash
 * @param {boolean} [unsigned=false] Whether unsigned or not
 * @returns {Long|number} Original value
 */
util.longFromHash = function longFromHash(hash, unsigned) {
    var bits = util.LongBits.fromHash(hash);
    if (util.Long)
        return util.Long.fromBits(bits.lo, bits.hi, unsigned);
    return bits.toNumber(Boolean(unsigned));
};

/**
 * Merges the properties of the source object into the destination object.
 * @memberof util
 * @param {Object.<string,*>} dst Destination object
 * @param {Object.<string,*>} src Source object
 * @param {boolean} [ifNotSet=false] Merges only if the key is not already set
 * @returns {Object.<string,*>} Destination object
 */
function merge(dst, src, ifNotSet) { // used by converters
    for (var keys = Object.keys(src), i = 0; i < keys.length; ++i)
        if (dst[keys[i]] === undefined || !ifNotSet)
            dst[keys[i]] = src[keys[i]];
    return dst;
}

util.merge = merge;

/**
 * Converts the first character of a string to lower case.
 * @param {string} str String to convert
 * @returns {string} Converted string
 */
util.lcFirst = function lcFirst(str) {
    return str.charAt(0).toLowerCase() + str.substring(1);
};

/**
 * Creates a custom error constructor.
 * @memberof util
 * @param {string} name Error name
 * @returns {Constructor<Error>} Custom error constructor
 */
function newError(name) {

    function CustomError(message, properties) {

        if (!(this instanceof CustomError))
            return new CustomError(message, properties);

        // Error.call(this, message);
        // ^ just returns a new error instance because the ctor can be called as a function

        Object.defineProperty(this, "message", { get: function() { return message; } });

        /* istanbul ignore next */
        if (Error.captureStackTrace) // node
            Error.captureStackTrace(this, CustomError);
        else
            Object.defineProperty(this, "stack", { value: new Error().stack || "" });

        if (properties)
            merge(this, properties);
    }

    (CustomError.prototype = Object.create(Error.prototype)).constructor = CustomError;

    Object.defineProperty(CustomError.prototype, "name", { get: function() { return name; } });

    CustomError.prototype.toString = function toString() {
        return this.name + ": " + this.message;
    };

    return CustomError;
}

util.newError = newError;

/**
 * Constructs a new protocol error.
 * @classdesc Error subclass indicating a protocol specifc error.
 * @memberof util
 * @extends Error
 * @template T extends Message<T>
 * @constructor
 * @param {string} message Error message
 * @param {Object.<string,*>} [properties] Additional properties
 * @example
 * try {
 *     MyMessage.decode(someBuffer); // throws if required fields are missing
 * } catch (e) {
 *     if (e instanceof ProtocolError && e.instance)
 *         console.log("decoded so far: " + JSON.stringify(e.instance));
 * }
 */
util.ProtocolError = newError("ProtocolError");

/**
 * So far decoded message instance.
 * @name util.ProtocolError#instance
 * @type {Message<T>}
 */

/**
 * A OneOf getter as returned by {@link util.oneOfGetter}.
 * @typedef OneOfGetter
 * @type {function}
 * @returns {string|undefined} Set field name, if any
 */

/**
 * Builds a getter for a oneof's present field name.
 * @param {string[]} fieldNames Field names
 * @returns {OneOfGetter} Unbound getter
 */
util.oneOfGetter = function getOneOf(fieldNames) {
    var fieldMap = {};
    for (var i = 0; i < fieldNames.length; ++i)
        fieldMap[fieldNames[i]] = 1;

    /**
     * @returns {string|undefined} Set field name, if any
     * @this Object
     * @ignore
     */
    return function() { // eslint-disable-line consistent-return
        for (var keys = Object.keys(this), i = keys.length - 1; i > -1; --i)
            if (fieldMap[keys[i]] === 1 && this[keys[i]] !== undefined && this[keys[i]] !== null)
                return keys[i];
    };
};

/**
 * A OneOf setter as returned by {@link util.oneOfSetter}.
 * @typedef OneOfSetter
 * @type {function}
 * @param {string|undefined} value Field name
 * @returns {undefined}
 */

/**
 * Builds a setter for a oneof's present field name.
 * @param {string[]} fieldNames Field names
 * @returns {OneOfSetter} Unbound setter
 */
util.oneOfSetter = function setOneOf(fieldNames) {

    /**
     * @param {string} name Field name
     * @returns {undefined}
     * @this Object
     * @ignore
     */
    return function(name) {
        for (var i = 0; i < fieldNames.length; ++i)
            if (fieldNames[i] !== name)
                delete this[fieldNames[i]];
    };
};

/**
 * Default conversion options used for {@link Message#toJSON} implementations.
 *
 * These options are close to proto3's JSON mapping with the exception that internal types like Any are handled just like messages. More precisely:
 *
 * - Longs become strings
 * - Enums become string keys
 * - Bytes become base64 encoded strings
 * - (Sub-)Messages become plain objects
 * - Maps become plain objects with all string keys
 * - Repeated fields become arrays
 * - NaN and Infinity for float and double fields become strings
 *
 * @type {IConversionOptions}
 * @see https://developers.google.com/protocol-buffers/docs/proto3?hl=en#json
 */
util.toJSONOptions = {
    longs: String,
    enums: String,
    bytes: String,
    json: true
};

// Sets up buffer utility according to the environment (called in index-minimal)
util._configure = function() {
    var Buffer = util.Buffer;
    /* istanbul ignore if */
    if (!Buffer) {
        util._Buffer_from = util._Buffer_allocUnsafe = null;
        return;
    }
    // because node 4.x buffers are incompatible & immutable
    // see: https://github.com/dcodeIO/protobuf.js/pull/665
    util._Buffer_from = Buffer.from !== Uint8Array.from && Buffer.from ||
        /* istanbul ignore next */
        function Buffer_from(value, encoding) {
            return new Buffer(value, encoding);
        };
    util._Buffer_allocUnsafe = Buffer.allocUnsafe ||
        /* istanbul ignore next */
        function Buffer_allocUnsafe(size) {
            return new Buffer(size);
        };
};


/***/ }),

/***/ 1173:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

module.exports = Writer;

var util      = __webpack_require__(9693);

var BufferWriter; // cyclic

var LongBits  = util.LongBits,
    base64    = util.base64,
    utf8      = util.utf8;

/**
 * Constructs a new writer operation instance.
 * @classdesc Scheduled writer operation.
 * @constructor
 * @param {function(*, Uint8Array, number)} fn Function to call
 * @param {number} len Value byte length
 * @param {*} val Value to write
 * @ignore
 */
function Op(fn, len, val) {

    /**
     * Function to call.
     * @type {function(Uint8Array, number, *)}
     */
    this.fn = fn;

    /**
     * Value byte length.
     * @type {number}
     */
    this.len = len;

    /**
     * Next operation.
     * @type {Writer.Op|undefined}
     */
    this.next = undefined;

    /**
     * Value to write.
     * @type {*}
     */
    this.val = val; // type varies
}

/* istanbul ignore next */
function noop() {} // eslint-disable-line no-empty-function

/**
 * Constructs a new writer state instance.
 * @classdesc Copied writer state.
 * @memberof Writer
 * @constructor
 * @param {Writer} writer Writer to copy state from
 * @ignore
 */
function State(writer) {

    /**
     * Current head.
     * @type {Writer.Op}
     */
    this.head = writer.head;

    /**
     * Current tail.
     * @type {Writer.Op}
     */
    this.tail = writer.tail;

    /**
     * Current buffer length.
     * @type {number}
     */
    this.len = writer.len;

    /**
     * Next state.
     * @type {State|null}
     */
    this.next = writer.states;
}

/**
 * Constructs a new writer instance.
 * @classdesc Wire format writer using `Uint8Array` if available, otherwise `Array`.
 * @constructor
 */
function Writer() {

    /**
     * Current length.
     * @type {number}
     */
    this.len = 0;

    /**
     * Operations head.
     * @type {Object}
     */
    this.head = new Op(noop, 0, 0);

    /**
     * Operations tail
     * @type {Object}
     */
    this.tail = this.head;

    /**
     * Linked forked states.
     * @type {Object|null}
     */
    this.states = null;

    // When a value is written, the writer calculates its byte length and puts it into a linked
    // list of operations to perform when finish() is called. This both allows us to allocate
    // buffers of the exact required size and reduces the amount of work we have to do compared
    // to first calculating over objects and then encoding over objects. In our case, the encoding
    // part is just a linked list walk calling operations with already prepared values.
}

var create = function create() {
    return util.Buffer
        ? function create_buffer_setup() {
            return (Writer.create = function create_buffer() {
                return new BufferWriter();
            })();
        }
        /* istanbul ignore next */
        : function create_array() {
            return new Writer();
        };
};

/**
 * Creates a new writer.
 * @function
 * @returns {BufferWriter|Writer} A {@link BufferWriter} when Buffers are supported, otherwise a {@link Writer}
 */
Writer.create = create();

/**
 * Allocates a buffer of the specified size.
 * @param {number} size Buffer size
 * @returns {Uint8Array} Buffer
 */
Writer.alloc = function alloc(size) {
    return new util.Array(size);
};

// Use Uint8Array buffer pool in the browser, just like node does with buffers
/* istanbul ignore else */
if (util.Array !== Array)
    Writer.alloc = util.pool(Writer.alloc, util.Array.prototype.subarray);

/**
 * Pushes a new operation to the queue.
 * @param {function(Uint8Array, number, *)} fn Function to call
 * @param {number} len Value byte length
 * @param {number} val Value to write
 * @returns {Writer} `this`
 * @private
 */
Writer.prototype._push = function push(fn, len, val) {
    this.tail = this.tail.next = new Op(fn, len, val);
    this.len += len;
    return this;
};

function writeByte(val, buf, pos) {
    buf[pos] = val & 255;
}

function writeVarint32(val, buf, pos) {
    while (val > 127) {
        buf[pos++] = val & 127 | 128;
        val >>>= 7;
    }
    buf[pos] = val;
}

/**
 * Constructs a new varint writer operation instance.
 * @classdesc Scheduled varint writer operation.
 * @extends Op
 * @constructor
 * @param {number} len Value byte length
 * @param {number} val Value to write
 * @ignore
 */
function VarintOp(len, val) {
    this.len = len;
    this.next = undefined;
    this.val = val;
}

VarintOp.prototype = Object.create(Op.prototype);
VarintOp.prototype.fn = writeVarint32;

/**
 * Writes an unsigned 32 bit value as a varint.
 * @param {number} value Value to write
 * @returns {Writer} `this`
 */
Writer.prototype.uint32 = function write_uint32(value) {
    // here, the call to this.push has been inlined and a varint specific Op subclass is used.
    // uint32 is by far the most frequently used operation and benefits significantly from this.
    this.len += (this.tail = this.tail.next = new VarintOp(
        (value = value >>> 0)
                < 128       ? 1
        : value < 16384     ? 2
        : value < 2097152   ? 3
        : value < 268435456 ? 4
        :                     5,
    value)).len;
    return this;
};

/**
 * Writes a signed 32 bit value as a varint.
 * @function
 * @param {number} value Value to write
 * @returns {Writer} `this`
 */
Writer.prototype.int32 = function write_int32(value) {
    return value < 0
        ? this._push(writeVarint64, 10, LongBits.fromNumber(value)) // 10 bytes per spec
        : this.uint32(value);
};

/**
 * Writes a 32 bit value as a varint, zig-zag encoded.
 * @param {number} value Value to write
 * @returns {Writer} `this`
 */
Writer.prototype.sint32 = function write_sint32(value) {
    return this.uint32((value << 1 ^ value >> 31) >>> 0);
};

function writeVarint64(val, buf, pos) {
    while (val.hi) {
        buf[pos++] = val.lo & 127 | 128;
        val.lo = (val.lo >>> 7 | val.hi << 25) >>> 0;
        val.hi >>>= 7;
    }
    while (val.lo > 127) {
        buf[pos++] = val.lo & 127 | 128;
        val.lo = val.lo >>> 7;
    }
    buf[pos++] = val.lo;
}

/**
 * Writes an unsigned 64 bit value as a varint.
 * @param {Long|number|string} value Value to write
 * @returns {Writer} `this`
 * @throws {TypeError} If `value` is a string and no long library is present.
 */
Writer.prototype.uint64 = function write_uint64(value) {
    var bits = LongBits.from(value);
    return this._push(writeVarint64, bits.length(), bits);
};

/**
 * Writes a signed 64 bit value as a varint.
 * @function
 * @param {Long|number|string} value Value to write
 * @returns {Writer} `this`
 * @throws {TypeError} If `value` is a string and no long library is present.
 */
Writer.prototype.int64 = Writer.prototype.uint64;

/**
 * Writes a signed 64 bit value as a varint, zig-zag encoded.
 * @param {Long|number|string} value Value to write
 * @returns {Writer} `this`
 * @throws {TypeError} If `value` is a string and no long library is present.
 */
Writer.prototype.sint64 = function write_sint64(value) {
    var bits = LongBits.from(value).zzEncode();
    return this._push(writeVarint64, bits.length(), bits);
};

/**
 * Writes a boolish value as a varint.
 * @param {boolean} value Value to write
 * @returns {Writer} `this`
 */
Writer.prototype.bool = function write_bool(value) {
    return this._push(writeByte, 1, value ? 1 : 0);
};

function writeFixed32(val, buf, pos) {
    buf[pos    ] =  val         & 255;
    buf[pos + 1] =  val >>> 8   & 255;
    buf[pos + 2] =  val >>> 16  & 255;
    buf[pos + 3] =  val >>> 24;
}

/**
 * Writes an unsigned 32 bit value as fixed 32 bits.
 * @param {number} value Value to write
 * @returns {Writer} `this`
 */
Writer.prototype.fixed32 = function write_fixed32(value) {
    return this._push(writeFixed32, 4, value >>> 0);
};

/**
 * Writes a signed 32 bit value as fixed 32 bits.
 * @function
 * @param {number} value Value to write
 * @returns {Writer} `this`
 */
Writer.prototype.sfixed32 = Writer.prototype.fixed32;

/**
 * Writes an unsigned 64 bit value as fixed 64 bits.
 * @param {Long|number|string} value Value to write
 * @returns {Writer} `this`
 * @throws {TypeError} If `value` is a string and no long library is present.
 */
Writer.prototype.fixed64 = function write_fixed64(value) {
    var bits = LongBits.from(value);
    return this._push(writeFixed32, 4, bits.lo)._push(writeFixed32, 4, bits.hi);
};

/**
 * Writes a signed 64 bit value as fixed 64 bits.
 * @function
 * @param {Long|number|string} value Value to write
 * @returns {Writer} `this`
 * @throws {TypeError} If `value` is a string and no long library is present.
 */
Writer.prototype.sfixed64 = Writer.prototype.fixed64;

/**
 * Writes a float (32 bit).
 * @function
 * @param {number} value Value to write
 * @returns {Writer} `this`
 */
Writer.prototype.float = function write_float(value) {
    return this._push(util.float.writeFloatLE, 4, value);
};

/**
 * Writes a double (64 bit float).
 * @function
 * @param {number} value Value to write
 * @returns {Writer} `this`
 */
Writer.prototype.double = function write_double(value) {
    return this._push(util.float.writeDoubleLE, 8, value);
};

var writeBytes = util.Array.prototype.set
    ? function writeBytes_set(val, buf, pos) {
        buf.set(val, pos); // also works for plain array values
    }
    /* istanbul ignore next */
    : function writeBytes_for(val, buf, pos) {
        for (var i = 0; i < val.length; ++i)
            buf[pos + i] = val[i];
    };

/**
 * Writes a sequence of bytes.
 * @param {Uint8Array|string} value Buffer or base64 encoded string to write
 * @returns {Writer} `this`
 */
Writer.prototype.bytes = function write_bytes(value) {
    var len = value.length >>> 0;
    if (!len)
        return this._push(writeByte, 1, 0);
    if (util.isString(value)) {
        var buf = Writer.alloc(len = base64.length(value));
        base64.decode(value, buf, 0);
        value = buf;
    }
    return this.uint32(len)._push(writeBytes, len, value);
};

/**
 * Writes a string.
 * @param {string} value Value to write
 * @returns {Writer} `this`
 */
Writer.prototype.string = function write_string(value) {
    var len = utf8.length(value);
    return len
        ? this.uint32(len)._push(utf8.write, len, value)
        : this._push(writeByte, 1, 0);
};

/**
 * Forks this writer's state by pushing it to a stack.
 * Calling {@link Writer#reset|reset} or {@link Writer#ldelim|ldelim} resets the writer to the previous state.
 * @returns {Writer} `this`
 */
Writer.prototype.fork = function fork() {
    this.states = new State(this);
    this.head = this.tail = new Op(noop, 0, 0);
    this.len = 0;
    return this;
};

/**
 * Resets this instance to the last state.
 * @returns {Writer} `this`
 */
Writer.prototype.reset = function reset() {
    if (this.states) {
        this.head   = this.states.head;
        this.tail   = this.states.tail;
        this.len    = this.states.len;
        this.states = this.states.next;
    } else {
        this.head = this.tail = new Op(noop, 0, 0);
        this.len  = 0;
    }
    return this;
};

/**
 * Resets to the last state and appends the fork state's current write length as a varint followed by its operations.
 * @returns {Writer} `this`
 */
Writer.prototype.ldelim = function ldelim() {
    var head = this.head,
        tail = this.tail,
        len  = this.len;
    this.reset().uint32(len);
    if (len) {
        this.tail.next = head.next; // skip noop
        this.tail = tail;
        this.len += len;
    }
    return this;
};

/**
 * Finishes the write operation.
 * @returns {Uint8Array} Finished buffer
 */
Writer.prototype.finish = function finish() {
    var head = this.head.next, // skip noop
        buf  = this.constructor.alloc(this.len),
        pos  = 0;
    while (head) {
        head.fn(head.val, buf, pos);
        pos += head.len;
        head = head.next;
    }
    // this.head = this.tail = null;
    return buf;
};

Writer._configure = function(BufferWriter_) {
    BufferWriter = BufferWriter_;
    Writer.create = create();
    BufferWriter._configure();
};


/***/ }),

/***/ 3155:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

module.exports = BufferWriter;

// extends Writer
var Writer = __webpack_require__(1173);
(BufferWriter.prototype = Object.create(Writer.prototype)).constructor = BufferWriter;

var util = __webpack_require__(9693);

/**
 * Constructs a new buffer writer instance.
 * @classdesc Wire format writer using node buffers.
 * @extends Writer
 * @constructor
 */
function BufferWriter() {
    Writer.call(this);
}

BufferWriter._configure = function () {
    /**
     * Allocates a buffer of the specified size.
     * @function
     * @param {number} size Buffer size
     * @returns {Buffer} Buffer
     */
    BufferWriter.alloc = util._Buffer_allocUnsafe;

    BufferWriter.writeBytesBuffer = util.Buffer && util.Buffer.prototype instanceof Uint8Array && util.Buffer.prototype.set.name === "set"
        ? function writeBytesBuffer_set(val, buf, pos) {
          buf.set(val, pos); // faster than copy (requires node >= 4 where Buffers extend Uint8Array and set is properly inherited)
          // also works for plain array values
        }
        /* istanbul ignore next */
        : function writeBytesBuffer_copy(val, buf, pos) {
          if (val.copy) // Buffer values
            val.copy(buf, pos, 0, val.length);
          else for (var i = 0; i < val.length;) // plain array values
            buf[pos++] = val[i++];
        };
};


/**
 * @override
 */
BufferWriter.prototype.bytes = function write_bytes_buffer(value) {
    if (util.isString(value))
        value = util._Buffer_from(value, "base64");
    var len = value.length >>> 0;
    this.uint32(len);
    if (len)
        this._push(BufferWriter.writeBytesBuffer, len, value);
    return this;
};

function writeStringBuffer(val, buf, pos) {
    if (val.length < 40) // plain js is faster for short strings (probably due to redundant assertions)
        util.utf8.write(val, buf, pos);
    else if (buf.utf8Write)
        buf.utf8Write(val, pos);
    else
        buf.write(val, pos);
}

/**
 * @override
 */
BufferWriter.prototype.string = function write_string_buffer(value) {
    var len = util.Buffer.byteLength(value);
    this.uint32(len);
    if (len)
        this._push(writeStringBuffer, len, value);
    return this;
};


/**
 * Finishes the write operation.
 * @name BufferWriter#finish
 * @function
 * @returns {Buffer} Finished buffer
 */

BufferWriter._configure();


/***/ }),

/***/ 7539:
/***/ (function(module) {

"use strict";
/* eslint-env node */


// SDP helpers.
const SDPUtils = {};

// Generate an alphanumeric identifier for cname or mids.
// TODO: use UUIDs instead? https://gist.github.com/jed/982883
SDPUtils.generateIdentifier = function() {
  return Math.random().toString(36).substr(2, 10);
};

// The RTCP CNAME used by all peerconnections from the same JS.
SDPUtils.localCName = SDPUtils.generateIdentifier();

// Splits SDP into lines, dealing with both CRLF and LF.
SDPUtils.splitLines = function(blob) {
  return blob.trim().split('\n').map(line => line.trim());
};
// Splits SDP into sessionpart and mediasections. Ensures CRLF.
SDPUtils.splitSections = function(blob) {
  const parts = blob.split('\nm=');
  return parts.map((part, index) => (index > 0 ?
    'm=' + part : part).trim() + '\r\n');
};

// Returns the session description.
SDPUtils.getDescription = function(blob) {
  const sections = SDPUtils.splitSections(blob);
  return sections && sections[0];
};

// Returns the individual media sections.
SDPUtils.getMediaSections = function(blob) {
  const sections = SDPUtils.splitSections(blob);
  sections.shift();
  return sections;
};

// Returns lines that start with a certain prefix.
SDPUtils.matchPrefix = function(blob, prefix) {
  return SDPUtils.splitLines(blob).filter(line => line.indexOf(prefix) === 0);
};

// Parses an ICE candidate line. Sample input:
// candidate:702786350 2 udp 41819902 8.8.8.8 60769 typ relay raddr 8.8.8.8
// rport 55996"
// Input can be prefixed with a=.
SDPUtils.parseCandidate = function(line) {
  let parts;
  // Parse both variants.
  if (line.indexOf('a=candidate:') === 0) {
    parts = line.substring(12).split(' ');
  } else {
    parts = line.substring(10).split(' ');
  }

  const candidate = {
    foundation: parts[0],
    component: {1: 'rtp', 2: 'rtcp'}[parts[1]] || parts[1],
    protocol: parts[2].toLowerCase(),
    priority: parseInt(parts[3], 10),
    ip: parts[4],
    address: parts[4], // address is an alias for ip.
    port: parseInt(parts[5], 10),
    // skip parts[6] == 'typ'
    type: parts[7],
  };

  for (let i = 8; i < parts.length; i += 2) {
    switch (parts[i]) {
      case 'raddr':
        candidate.relatedAddress = parts[i + 1];
        break;
      case 'rport':
        candidate.relatedPort = parseInt(parts[i + 1], 10);
        break;
      case 'tcptype':
        candidate.tcpType = parts[i + 1];
        break;
      case 'ufrag':
        candidate.ufrag = parts[i + 1]; // for backward compatibility.
        candidate.usernameFragment = parts[i + 1];
        break;
      default: // extension handling, in particular ufrag. Don't overwrite.
        if (candidate[parts[i]] === undefined) {
          candidate[parts[i]] = parts[i + 1];
        }
        break;
    }
  }
  return candidate;
};

// Translates a candidate object into SDP candidate attribute.
// This does not include the a= prefix!
SDPUtils.writeCandidate = function(candidate) {
  const sdp = [];
  sdp.push(candidate.foundation);

  const component = candidate.component;
  if (component === 'rtp') {
    sdp.push(1);
  } else if (component === 'rtcp') {
    sdp.push(2);
  } else {
    sdp.push(component);
  }
  sdp.push(candidate.protocol.toUpperCase());
  sdp.push(candidate.priority);
  sdp.push(candidate.address || candidate.ip);
  sdp.push(candidate.port);

  const type = candidate.type;
  sdp.push('typ');
  sdp.push(type);
  if (type !== 'host' && candidate.relatedAddress &&
      candidate.relatedPort) {
    sdp.push('raddr');
    sdp.push(candidate.relatedAddress);
    sdp.push('rport');
    sdp.push(candidate.relatedPort);
  }
  if (candidate.tcpType && candidate.protocol.toLowerCase() === 'tcp') {
    sdp.push('tcptype');
    sdp.push(candidate.tcpType);
  }
  if (candidate.usernameFragment || candidate.ufrag) {
    sdp.push('ufrag');
    sdp.push(candidate.usernameFragment || candidate.ufrag);
  }
  return 'candidate:' + sdp.join(' ');
};

// Parses an ice-options line, returns an array of option tags.
// Sample input:
// a=ice-options:foo bar
SDPUtils.parseIceOptions = function(line) {
  return line.substr(14).split(' ');
};

// Parses a rtpmap line, returns RTCRtpCoddecParameters. Sample input:
// a=rtpmap:111 opus/48000/2
SDPUtils.parseRtpMap = function(line) {
  let parts = line.substr(9).split(' ');
  const parsed = {
    payloadType: parseInt(parts.shift(), 10), // was: id
  };

  parts = parts[0].split('/');

  parsed.name = parts[0];
  parsed.clockRate = parseInt(parts[1], 10); // was: clockrate
  parsed.channels = parts.length === 3 ? parseInt(parts[2], 10) : 1;
  // legacy alias, got renamed back to channels in ORTC.
  parsed.numChannels = parsed.channels;
  return parsed;
};

// Generates a rtpmap line from RTCRtpCodecCapability or
// RTCRtpCodecParameters.
SDPUtils.writeRtpMap = function(codec) {
  let pt = codec.payloadType;
  if (codec.preferredPayloadType !== undefined) {
    pt = codec.preferredPayloadType;
  }
  const channels = codec.channels || codec.numChannels || 1;
  return 'a=rtpmap:' + pt + ' ' + codec.name + '/' + codec.clockRate +
      (channels !== 1 ? '/' + channels : '') + '\r\n';
};

// Parses a extmap line (headerextension from RFC 5285). Sample input:
// a=extmap:2 urn:ietf:params:rtp-hdrext:toffset
// a=extmap:2/sendonly urn:ietf:params:rtp-hdrext:toffset
SDPUtils.parseExtmap = function(line) {
  const parts = line.substr(9).split(' ');
  return {
    id: parseInt(parts[0], 10),
    direction: parts[0].indexOf('/') > 0 ? parts[0].split('/')[1] : 'sendrecv',
    uri: parts[1],
  };
};

// Generates an extmap line from RTCRtpHeaderExtensionParameters or
// RTCRtpHeaderExtension.
SDPUtils.writeExtmap = function(headerExtension) {
  return 'a=extmap:' + (headerExtension.id || headerExtension.preferredId) +
      (headerExtension.direction && headerExtension.direction !== 'sendrecv'
        ? '/' + headerExtension.direction
        : '') +
      ' ' + headerExtension.uri + '\r\n';
};

// Parses a fmtp line, returns dictionary. Sample input:
// a=fmtp:96 vbr=on;cng=on
// Also deals with vbr=on; cng=on
SDPUtils.parseFmtp = function(line) {
  const parsed = {};
  let kv;
  const parts = line.substr(line.indexOf(' ') + 1).split(';');
  for (let j = 0; j < parts.length; j++) {
    kv = parts[j].trim().split('=');
    parsed[kv[0].trim()] = kv[1];
  }
  return parsed;
};

// Generates a fmtp line from RTCRtpCodecCapability or RTCRtpCodecParameters.
SDPUtils.writeFmtp = function(codec) {
  let line = '';
  let pt = codec.payloadType;
  if (codec.preferredPayloadType !== undefined) {
    pt = codec.preferredPayloadType;
  }
  if (codec.parameters && Object.keys(codec.parameters).length) {
    const params = [];
    Object.keys(codec.parameters).forEach(param => {
      if (codec.parameters[param] !== undefined) {
        params.push(param + '=' + codec.parameters[param]);
      } else {
        params.push(param);
      }
    });
    line += 'a=fmtp:' + pt + ' ' + params.join(';') + '\r\n';
  }
  return line;
};

// Parses a rtcp-fb line, returns RTCPRtcpFeedback object. Sample input:
// a=rtcp-fb:98 nack rpsi
SDPUtils.parseRtcpFb = function(line) {
  const parts = line.substr(line.indexOf(' ') + 1).split(' ');
  return {
    type: parts.shift(),
    parameter: parts.join(' '),
  };
};

// Generate a=rtcp-fb lines from RTCRtpCodecCapability or RTCRtpCodecParameters.
SDPUtils.writeRtcpFb = function(codec) {
  let lines = '';
  let pt = codec.payloadType;
  if (codec.preferredPayloadType !== undefined) {
    pt = codec.preferredPayloadType;
  }
  if (codec.rtcpFeedback && codec.rtcpFeedback.length) {
    // FIXME: special handling for trr-int?
    codec.rtcpFeedback.forEach(fb => {
      lines += 'a=rtcp-fb:' + pt + ' ' + fb.type +
      (fb.parameter && fb.parameter.length ? ' ' + fb.parameter : '') +
          '\r\n';
    });
  }
  return lines;
};

// Parses a RFC 5576 ssrc media attribute. Sample input:
// a=ssrc:3735928559 cname:something
SDPUtils.parseSsrcMedia = function(line) {
  const sp = line.indexOf(' ');
  const parts = {
    ssrc: parseInt(line.substr(7, sp - 7), 10),
  };
  const colon = line.indexOf(':', sp);
  if (colon > -1) {
    parts.attribute = line.substr(sp + 1, colon - sp - 1);
    parts.value = line.substr(colon + 1);
  } else {
    parts.attribute = line.substr(sp + 1);
  }
  return parts;
};

// Parse a ssrc-group line (see RFC 5576). Sample input:
// a=ssrc-group:semantics 12 34
SDPUtils.parseSsrcGroup = function(line) {
  const parts = line.substr(13).split(' ');
  return {
    semantics: parts.shift(),
    ssrcs: parts.map(ssrc => parseInt(ssrc, 10)),
  };
};

// Extracts the MID (RFC 5888) from a media section.
// Returns the MID or undefined if no mid line was found.
SDPUtils.getMid = function(mediaSection) {
  const mid = SDPUtils.matchPrefix(mediaSection, 'a=mid:')[0];
  if (mid) {
    return mid.substr(6);
  }
};

// Parses a fingerprint line for DTLS-SRTP.
SDPUtils.parseFingerprint = function(line) {
  const parts = line.substr(14).split(' ');
  return {
    algorithm: parts[0].toLowerCase(), // algorithm is case-sensitive in Edge.
    value: parts[1].toUpperCase(), // the definition is upper-case in RFC 4572.
  };
};

// Extracts DTLS parameters from SDP media section or sessionpart.
// FIXME: for consistency with other functions this should only
//   get the fingerprint line as input. See also getIceParameters.
SDPUtils.getDtlsParameters = function(mediaSection, sessionpart) {
  const lines = SDPUtils.matchPrefix(mediaSection + sessionpart,
    'a=fingerprint:');
  // Note: a=setup line is ignored since we use the 'auto' role in Edge.
  return {
    role: 'auto',
    fingerprints: lines.map(SDPUtils.parseFingerprint),
  };
};

// Serializes DTLS parameters to SDP.
SDPUtils.writeDtlsParameters = function(params, setupType) {
  let sdp = 'a=setup:' + setupType + '\r\n';
  params.fingerprints.forEach(fp => {
    sdp += 'a=fingerprint:' + fp.algorithm + ' ' + fp.value + '\r\n';
  });
  return sdp;
};

// Parses a=crypto lines into
//   https://rawgit.com/aboba/edgertc/master/msortc-rs4.html#dictionary-rtcsrtpsdesparameters-members
SDPUtils.parseCryptoLine = function(line) {
  const parts = line.substr(9).split(' ');
  return {
    tag: parseInt(parts[0], 10),
    cryptoSuite: parts[1],
    keyParams: parts[2],
    sessionParams: parts.slice(3),
  };
};

SDPUtils.writeCryptoLine = function(parameters) {
  return 'a=crypto:' + parameters.tag + ' ' +
    parameters.cryptoSuite + ' ' +
    (typeof parameters.keyParams === 'object'
      ? SDPUtils.writeCryptoKeyParams(parameters.keyParams)
      : parameters.keyParams) +
    (parameters.sessionParams ? ' ' + parameters.sessionParams.join(' ') : '') +
    '\r\n';
};

// Parses the crypto key parameters into
//   https://rawgit.com/aboba/edgertc/master/msortc-rs4.html#rtcsrtpkeyparam*
SDPUtils.parseCryptoKeyParams = function(keyParams) {
  if (keyParams.indexOf('inline:') !== 0) {
    return null;
  }
  const parts = keyParams.substr(7).split('|');
  return {
    keyMethod: 'inline',
    keySalt: parts[0],
    lifeTime: parts[1],
    mkiValue: parts[2] ? parts[2].split(':')[0] : undefined,
    mkiLength: parts[2] ? parts[2].split(':')[1] : undefined,
  };
};

SDPUtils.writeCryptoKeyParams = function(keyParams) {
  return keyParams.keyMethod + ':'
    + keyParams.keySalt +
    (keyParams.lifeTime ? '|' + keyParams.lifeTime : '') +
    (keyParams.mkiValue && keyParams.mkiLength
      ? '|' + keyParams.mkiValue + ':' + keyParams.mkiLength
      : '');
};

// Extracts all SDES parameters.
SDPUtils.getCryptoParameters = function(mediaSection, sessionpart) {
  const lines = SDPUtils.matchPrefix(mediaSection + sessionpart,
    'a=crypto:');
  return lines.map(SDPUtils.parseCryptoLine);
};

// Parses ICE information from SDP media section or sessionpart.
// FIXME: for consistency with other functions this should only
//   get the ice-ufrag and ice-pwd lines as input.
SDPUtils.getIceParameters = function(mediaSection, sessionpart) {
  const ufrag = SDPUtils.matchPrefix(mediaSection + sessionpart,
    'a=ice-ufrag:')[0];
  const pwd = SDPUtils.matchPrefix(mediaSection + sessionpart,
    'a=ice-pwd:')[0];
  if (!(ufrag && pwd)) {
    return null;
  }
  return {
    usernameFragment: ufrag.substr(12),
    password: pwd.substr(10),
  };
};

// Serializes ICE parameters to SDP.
SDPUtils.writeIceParameters = function(params) {
  let sdp = 'a=ice-ufrag:' + params.usernameFragment + '\r\n' +
      'a=ice-pwd:' + params.password + '\r\n';
  if (params.iceLite) {
    sdp += 'a=ice-lite\r\n';
  }
  return sdp;
};

// Parses the SDP media section and returns RTCRtpParameters.
SDPUtils.parseRtpParameters = function(mediaSection) {
  const description = {
    codecs: [],
    headerExtensions: [],
    fecMechanisms: [],
    rtcp: [],
  };
  const lines = SDPUtils.splitLines(mediaSection);
  const mline = lines[0].split(' ');
  for (let i = 3; i < mline.length; i++) { // find all codecs from mline[3..]
    const pt = mline[i];
    const rtpmapline = SDPUtils.matchPrefix(
      mediaSection, 'a=rtpmap:' + pt + ' ')[0];
    if (rtpmapline) {
      const codec = SDPUtils.parseRtpMap(rtpmapline);
      const fmtps = SDPUtils.matchPrefix(
        mediaSection, 'a=fmtp:' + pt + ' ');
      // Only the first a=fmtp:<pt> is considered.
      codec.parameters = fmtps.length ? SDPUtils.parseFmtp(fmtps[0]) : {};
      codec.rtcpFeedback = SDPUtils.matchPrefix(
        mediaSection, 'a=rtcp-fb:' + pt + ' ')
        .map(SDPUtils.parseRtcpFb);
      description.codecs.push(codec);
      // parse FEC mechanisms from rtpmap lines.
      switch (codec.name.toUpperCase()) {
        case 'RED':
        case 'ULPFEC':
          description.fecMechanisms.push(codec.name.toUpperCase());
          break;
        default: // only RED and ULPFEC are recognized as FEC mechanisms.
          break;
      }
    }
  }
  SDPUtils.matchPrefix(mediaSection, 'a=extmap:').forEach(line => {
    description.headerExtensions.push(SDPUtils.parseExtmap(line));
  });
  // FIXME: parse rtcp.
  return description;
};

// Generates parts of the SDP media section describing the capabilities /
// parameters.
SDPUtils.writeRtpDescription = function(kind, caps) {
  let sdp = '';

  // Build the mline.
  sdp += 'm=' + kind + ' ';
  sdp += caps.codecs.length > 0 ? '9' : '0'; // reject if no codecs.
  sdp += ' UDP/TLS/RTP/SAVPF ';
  sdp += caps.codecs.map(codec => {
    if (codec.preferredPayloadType !== undefined) {
      return codec.preferredPayloadType;
    }
    return codec.payloadType;
  }).join(' ') + '\r\n';

  sdp += 'c=IN IP4 0.0.0.0\r\n';
  sdp += 'a=rtcp:9 IN IP4 0.0.0.0\r\n';

  // Add a=rtpmap lines for each codec. Also fmtp and rtcp-fb.
  caps.codecs.forEach(codec => {
    sdp += SDPUtils.writeRtpMap(codec);
    sdp += SDPUtils.writeFmtp(codec);
    sdp += SDPUtils.writeRtcpFb(codec);
  });
  let maxptime = 0;
  caps.codecs.forEach(codec => {
    if (codec.maxptime > maxptime) {
      maxptime = codec.maxptime;
    }
  });
  if (maxptime > 0) {
    sdp += 'a=maxptime:' + maxptime + '\r\n';
  }

  if (caps.headerExtensions) {
    caps.headerExtensions.forEach(extension => {
      sdp += SDPUtils.writeExtmap(extension);
    });
  }
  // FIXME: write fecMechanisms.
  return sdp;
};

// Parses the SDP media section and returns an array of
// RTCRtpEncodingParameters.
SDPUtils.parseRtpEncodingParameters = function(mediaSection) {
  const encodingParameters = [];
  const description = SDPUtils.parseRtpParameters(mediaSection);
  const hasRed = description.fecMechanisms.indexOf('RED') !== -1;
  const hasUlpfec = description.fecMechanisms.indexOf('ULPFEC') !== -1;

  // filter a=ssrc:... cname:, ignore PlanB-msid
  const ssrcs = SDPUtils.matchPrefix(mediaSection, 'a=ssrc:')
    .map(line => SDPUtils.parseSsrcMedia(line))
    .filter(parts => parts.attribute === 'cname');
  const primarySsrc = ssrcs.length > 0 && ssrcs[0].ssrc;
  let secondarySsrc;

  const flows = SDPUtils.matchPrefix(mediaSection, 'a=ssrc-group:FID')
    .map(line => {
      const parts = line.substr(17).split(' ');
      return parts.map(part => parseInt(part, 10));
    });
  if (flows.length > 0 && flows[0].length > 1 && flows[0][0] === primarySsrc) {
    secondarySsrc = flows[0][1];
  }

  description.codecs.forEach(codec => {
    if (codec.name.toUpperCase() === 'RTX' && codec.parameters.apt) {
      let encParam = {
        ssrc: primarySsrc,
        codecPayloadType: parseInt(codec.parameters.apt, 10),
      };
      if (primarySsrc && secondarySsrc) {
        encParam.rtx = {ssrc: secondarySsrc};
      }
      encodingParameters.push(encParam);
      if (hasRed) {
        encParam = JSON.parse(JSON.stringify(encParam));
        encParam.fec = {
          ssrc: primarySsrc,
          mechanism: hasUlpfec ? 'red+ulpfec' : 'red',
        };
        encodingParameters.push(encParam);
      }
    }
  });
  if (encodingParameters.length === 0 && primarySsrc) {
    encodingParameters.push({
      ssrc: primarySsrc,
    });
  }

  // we support both b=AS and b=TIAS but interpret AS as TIAS.
  let bandwidth = SDPUtils.matchPrefix(mediaSection, 'b=');
  if (bandwidth.length) {
    if (bandwidth[0].indexOf('b=TIAS:') === 0) {
      bandwidth = parseInt(bandwidth[0].substr(7), 10);
    } else if (bandwidth[0].indexOf('b=AS:') === 0) {
      // use formula from JSEP to convert b=AS to TIAS value.
      bandwidth = parseInt(bandwidth[0].substr(5), 10) * 1000 * 0.95
          - (50 * 40 * 8);
    } else {
      bandwidth = undefined;
    }
    encodingParameters.forEach(params => {
      params.maxBitrate = bandwidth;
    });
  }
  return encodingParameters;
};

// parses http://draft.ortc.org/#rtcrtcpparameters*
SDPUtils.parseRtcpParameters = function(mediaSection) {
  const rtcpParameters = {};

  // Gets the first SSRC. Note that with RTX there might be multiple
  // SSRCs.
  const remoteSsrc = SDPUtils.matchPrefix(mediaSection, 'a=ssrc:')
    .map(line => SDPUtils.parseSsrcMedia(line))
    .filter(obj => obj.attribute === 'cname')[0];
  if (remoteSsrc) {
    rtcpParameters.cname = remoteSsrc.value;
    rtcpParameters.ssrc = remoteSsrc.ssrc;
  }

  // Edge uses the compound attribute instead of reducedSize
  // compound is !reducedSize
  const rsize = SDPUtils.matchPrefix(mediaSection, 'a=rtcp-rsize');
  rtcpParameters.reducedSize = rsize.length > 0;
  rtcpParameters.compound = rsize.length === 0;

  // parses the rtcp-mux attrіbute.
  // Note that Edge does not support unmuxed RTCP.
  const mux = SDPUtils.matchPrefix(mediaSection, 'a=rtcp-mux');
  rtcpParameters.mux = mux.length > 0;

  return rtcpParameters;
};

SDPUtils.writeRtcpParameters = function(rtcpParameters) {
  let sdp = '';
  if (rtcpParameters.reducedSize) {
    sdp += 'a=rtcp-rsize\r\n';
  }
  if (rtcpParameters.mux) {
    sdp += 'a=rtcp-mux\r\n';
  }
  if (rtcpParameters.ssrc !== undefined && rtcpParameters.cname) {
    sdp += 'a=ssrc:' + rtcpParameters.ssrc +
      ' cname:' + rtcpParameters.cname + '\r\n';
  }
  return sdp;
};


// parses either a=msid: or a=ssrc:... msid lines and returns
// the id of the MediaStream and MediaStreamTrack.
SDPUtils.parseMsid = function(mediaSection) {
  let parts;
  const spec = SDPUtils.matchPrefix(mediaSection, 'a=msid:');
  if (spec.length === 1) {
    parts = spec[0].substr(7).split(' ');
    return {stream: parts[0], track: parts[1]};
  }
  const planB = SDPUtils.matchPrefix(mediaSection, 'a=ssrc:')
    .map(line => SDPUtils.parseSsrcMedia(line))
    .filter(msidParts => msidParts.attribute === 'msid');
  if (planB.length > 0) {
    parts = planB[0].value.split(' ');
    return {stream: parts[0], track: parts[1]};
  }
};

// SCTP
// parses draft-ietf-mmusic-sctp-sdp-26 first and falls back
// to draft-ietf-mmusic-sctp-sdp-05
SDPUtils.parseSctpDescription = function(mediaSection) {
  const mline = SDPUtils.parseMLine(mediaSection);
  const maxSizeLine = SDPUtils.matchPrefix(mediaSection, 'a=max-message-size:');
  let maxMessageSize;
  if (maxSizeLine.length > 0) {
    maxMessageSize = parseInt(maxSizeLine[0].substr(19), 10);
  }
  if (isNaN(maxMessageSize)) {
    maxMessageSize = 65536;
  }
  const sctpPort = SDPUtils.matchPrefix(mediaSection, 'a=sctp-port:');
  if (sctpPort.length > 0) {
    return {
      port: parseInt(sctpPort[0].substr(12), 10),
      protocol: mline.fmt,
      maxMessageSize,
    };
  }
  const sctpMapLines = SDPUtils.matchPrefix(mediaSection, 'a=sctpmap:');
  if (sctpMapLines.length > 0) {
    const parts = sctpMapLines[0]
      .substr(10)
      .split(' ');
    return {
      port: parseInt(parts[0], 10),
      protocol: parts[1],
      maxMessageSize,
    };
  }
};

// SCTP
// outputs the draft-ietf-mmusic-sctp-sdp-26 version that all browsers
// support by now receiving in this format, unless we originally parsed
// as the draft-ietf-mmusic-sctp-sdp-05 format (indicated by the m-line
// protocol of DTLS/SCTP -- without UDP/ or TCP/)
SDPUtils.writeSctpDescription = function(media, sctp) {
  let output = [];
  if (media.protocol !== 'DTLS/SCTP') {
    output = [
      'm=' + media.kind + ' 9 ' + media.protocol + ' ' + sctp.protocol + '\r\n',
      'c=IN IP4 0.0.0.0\r\n',
      'a=sctp-port:' + sctp.port + '\r\n',
    ];
  } else {
    output = [
      'm=' + media.kind + ' 9 ' + media.protocol + ' ' + sctp.port + '\r\n',
      'c=IN IP4 0.0.0.0\r\n',
      'a=sctpmap:' + sctp.port + ' ' + sctp.protocol + ' 65535\r\n',
    ];
  }
  if (sctp.maxMessageSize !== undefined) {
    output.push('a=max-message-size:' + sctp.maxMessageSize + '\r\n');
  }
  return output.join('');
};

// Generate a session ID for SDP.
// https://tools.ietf.org/html/draft-ietf-rtcweb-jsep-20#section-5.2.1
// recommends using a cryptographically random +ve 64-bit value
// but right now this should be acceptable and within the right range
SDPUtils.generateSessionId = function() {
  return Math.random().toString().substr(2, 21);
};

// Write boiler plate for start of SDP
// sessId argument is optional - if not supplied it will
// be generated randomly
// sessVersion is optional and defaults to 2
// sessUser is optional and defaults to 'thisisadapterortc'
SDPUtils.writeSessionBoilerplate = function(sessId, sessVer, sessUser) {
  let sessionId;
  const version = sessVer !== undefined ? sessVer : 2;
  if (sessId) {
    sessionId = sessId;
  } else {
    sessionId = SDPUtils.generateSessionId();
  }
  const user = sessUser || 'thisisadapterortc';
  // FIXME: sess-id should be an NTP timestamp.
  return 'v=0\r\n' +
      'o=' + user + ' ' + sessionId + ' ' + version +
        ' IN IP4 127.0.0.1\r\n' +
      's=-\r\n' +
      't=0 0\r\n';
};

// Gets the direction from the mediaSection or the sessionpart.
SDPUtils.getDirection = function(mediaSection, sessionpart) {
  // Look for sendrecv, sendonly, recvonly, inactive, default to sendrecv.
  const lines = SDPUtils.splitLines(mediaSection);
  for (let i = 0; i < lines.length; i++) {
    switch (lines[i]) {
      case 'a=sendrecv':
      case 'a=sendonly':
      case 'a=recvonly':
      case 'a=inactive':
        return lines[i].substr(2);
      default:
        // FIXME: What should happen here?
    }
  }
  if (sessionpart) {
    return SDPUtils.getDirection(sessionpart);
  }
  return 'sendrecv';
};

SDPUtils.getKind = function(mediaSection) {
  const lines = SDPUtils.splitLines(mediaSection);
  const mline = lines[0].split(' ');
  return mline[0].substr(2);
};

SDPUtils.isRejected = function(mediaSection) {
  return mediaSection.split(' ', 2)[1] === '0';
};

SDPUtils.parseMLine = function(mediaSection) {
  const lines = SDPUtils.splitLines(mediaSection);
  const parts = lines[0].substr(2).split(' ');
  return {
    kind: parts[0],
    port: parseInt(parts[1], 10),
    protocol: parts[2],
    fmt: parts.slice(3).join(' '),
  };
};

SDPUtils.parseOLine = function(mediaSection) {
  const line = SDPUtils.matchPrefix(mediaSection, 'o=')[0];
  const parts = line.substr(2).split(' ');
  return {
    username: parts[0],
    sessionId: parts[1],
    sessionVersion: parseInt(parts[2], 10),
    netType: parts[3],
    addressType: parts[4],
    address: parts[5],
  };
};

// a very naive interpretation of a valid SDP.
SDPUtils.isValidSDP = function(blob) {
  if (typeof blob !== 'string' || blob.length === 0) {
    return false;
  }
  const lines = SDPUtils.splitLines(blob);
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].length < 2 || lines[i].charAt(1) !== '=') {
      return false;
    }
    // TODO: check the modifier a bit more.
  }
  return true;
};

// Expose public methods.
if (true) {
  module.exports = SDPUtils;
}


/***/ }),

/***/ 2938:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "debounce": function() { return /* binding */ r; }
/* harmony export */ });
function r(r,e,n){var i,t,o;void 0===e&&(e=50),void 0===n&&(n={});var a=null!=(i=n.isImmediate)&&i,u=null!=(t=n.callback)&&t,c=n.maxWait,v=Date.now(),l=[];function f(){if(void 0!==c){var r=Date.now()-v;if(r+e>=c)return c-r}return e}var d=function(){var e=[].slice.call(arguments),n=this;return new Promise(function(i,t){var c=a&&void 0===o;if(void 0!==o&&clearTimeout(o),o=setTimeout(function(){if(o=void 0,v=Date.now(),!a){var i=r.apply(n,e);u&&u(i),l.forEach(function(r){return(0,r.resolve)(i)}),l=[]}},f()),c){var d=r.apply(n,e);return u&&u(d),i(d)}l.push({resolve:i,reject:t})})};return d.cancel=function(r){void 0!==o&&clearTimeout(o),l.forEach(function(e){return(0,e.reject)(r)}),l=[]},d}
//# sourceMappingURL=index.esm.js.map


/***/ }),

/***/ 835:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": function() { return /* binding */ adapter_core; }
});

// NAMESPACE OBJECT: ./node_modules/webrtc-adapter/src/js/chrome/chrome_shim.js
var chrome_shim_namespaceObject = {};
__webpack_require__.r(chrome_shim_namespaceObject);
__webpack_require__.d(chrome_shim_namespaceObject, {
  "fixNegotiationNeeded": function() { return fixNegotiationNeeded; },
  "shimAddTrackRemoveTrack": function() { return shimAddTrackRemoveTrack; },
  "shimAddTrackRemoveTrackWithNative": function() { return shimAddTrackRemoveTrackWithNative; },
  "shimGetDisplayMedia": function() { return shimGetDisplayMedia; },
  "shimGetSendersWithDtmf": function() { return shimGetSendersWithDtmf; },
  "shimGetStats": function() { return shimGetStats; },
  "shimGetUserMedia": function() { return shimGetUserMedia; },
  "shimMediaStream": function() { return shimMediaStream; },
  "shimOnTrack": function() { return shimOnTrack; },
  "shimPeerConnection": function() { return shimPeerConnection; },
  "shimSenderReceiverGetStats": function() { return shimSenderReceiverGetStats; }
});

// NAMESPACE OBJECT: ./node_modules/webrtc-adapter/src/js/firefox/firefox_shim.js
var firefox_shim_namespaceObject = {};
__webpack_require__.r(firefox_shim_namespaceObject);
__webpack_require__.d(firefox_shim_namespaceObject, {
  "shimAddTransceiver": function() { return shimAddTransceiver; },
  "shimCreateAnswer": function() { return shimCreateAnswer; },
  "shimCreateOffer": function() { return shimCreateOffer; },
  "shimGetDisplayMedia": function() { return getdisplaymedia_shimGetDisplayMedia; },
  "shimGetParameters": function() { return shimGetParameters; },
  "shimGetUserMedia": function() { return getusermedia_shimGetUserMedia; },
  "shimOnTrack": function() { return firefox_shim_shimOnTrack; },
  "shimPeerConnection": function() { return firefox_shim_shimPeerConnection; },
  "shimRTCDataChannel": function() { return shimRTCDataChannel; },
  "shimReceiverGetStats": function() { return shimReceiverGetStats; },
  "shimRemoveStream": function() { return shimRemoveStream; },
  "shimSenderGetStats": function() { return shimSenderGetStats; }
});

// NAMESPACE OBJECT: ./node_modules/webrtc-adapter/src/js/safari/safari_shim.js
var safari_shim_namespaceObject = {};
__webpack_require__.r(safari_shim_namespaceObject);
__webpack_require__.d(safari_shim_namespaceObject, {
  "shimAudioContext": function() { return shimAudioContext; },
  "shimCallbacksAPI": function() { return shimCallbacksAPI; },
  "shimConstraints": function() { return shimConstraints; },
  "shimCreateOfferLegacy": function() { return shimCreateOfferLegacy; },
  "shimGetUserMedia": function() { return safari_shim_shimGetUserMedia; },
  "shimLocalStreamsAPI": function() { return shimLocalStreamsAPI; },
  "shimRTCIceServerUrls": function() { return shimRTCIceServerUrls; },
  "shimRemoteStreamsAPI": function() { return shimRemoteStreamsAPI; },
  "shimTrackEventTransceiver": function() { return shimTrackEventTransceiver; }
});

// NAMESPACE OBJECT: ./node_modules/webrtc-adapter/src/js/common_shim.js
var common_shim_namespaceObject = {};
__webpack_require__.r(common_shim_namespaceObject);
__webpack_require__.d(common_shim_namespaceObject, {
  "removeExtmapAllowMixed": function() { return removeExtmapAllowMixed; },
  "shimAddIceCandidateNullOrEmpty": function() { return shimAddIceCandidateNullOrEmpty; },
  "shimConnectionState": function() { return shimConnectionState; },
  "shimMaxMessageSize": function() { return shimMaxMessageSize; },
  "shimParameterlessSetLocalDescription": function() { return shimParameterlessSetLocalDescription; },
  "shimRTCIceCandidate": function() { return shimRTCIceCandidate; },
  "shimSendThrowTypeError": function() { return shimSendThrowTypeError; }
});

;// CONCATENATED MODULE: ./node_modules/webrtc-adapter/src/js/utils.js
/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
 /* eslint-env node */


let logDisabled_ = true;
let deprecationWarnings_ = true;

/**
 * Extract browser version out of the provided user agent string.
 *
 * @param {!string} uastring userAgent string.
 * @param {!string} expr Regular expression used as match criteria.
 * @param {!number} pos position in the version string to be returned.
 * @return {!number} browser version.
 */
function extractVersion(uastring, expr, pos) {
  const match = uastring.match(expr);
  return match && match.length >= pos && parseInt(match[pos], 10);
}

// Wraps the peerconnection event eventNameToWrap in a function
// which returns the modified event object (or false to prevent
// the event).
function wrapPeerConnectionEvent(window, eventNameToWrap, wrapper) {
  if (!window.RTCPeerConnection) {
    return;
  }
  const proto = window.RTCPeerConnection.prototype;
  const nativeAddEventListener = proto.addEventListener;
  proto.addEventListener = function(nativeEventName, cb) {
    if (nativeEventName !== eventNameToWrap) {
      return nativeAddEventListener.apply(this, arguments);
    }
    const wrappedCallback = (e) => {
      const modifiedEvent = wrapper(e);
      if (modifiedEvent) {
        if (cb.handleEvent) {
          cb.handleEvent(modifiedEvent);
        } else {
          cb(modifiedEvent);
        }
      }
    };
    this._eventMap = this._eventMap || {};
    if (!this._eventMap[eventNameToWrap]) {
      this._eventMap[eventNameToWrap] = new Map();
    }
    this._eventMap[eventNameToWrap].set(cb, wrappedCallback);
    return nativeAddEventListener.apply(this, [nativeEventName,
      wrappedCallback]);
  };

  const nativeRemoveEventListener = proto.removeEventListener;
  proto.removeEventListener = function(nativeEventName, cb) {
    if (nativeEventName !== eventNameToWrap || !this._eventMap
        || !this._eventMap[eventNameToWrap]) {
      return nativeRemoveEventListener.apply(this, arguments);
    }
    if (!this._eventMap[eventNameToWrap].has(cb)) {
      return nativeRemoveEventListener.apply(this, arguments);
    }
    const unwrappedCb = this._eventMap[eventNameToWrap].get(cb);
    this._eventMap[eventNameToWrap].delete(cb);
    if (this._eventMap[eventNameToWrap].size === 0) {
      delete this._eventMap[eventNameToWrap];
    }
    if (Object.keys(this._eventMap).length === 0) {
      delete this._eventMap;
    }
    return nativeRemoveEventListener.apply(this, [nativeEventName,
      unwrappedCb]);
  };

  Object.defineProperty(proto, 'on' + eventNameToWrap, {
    get() {
      return this['_on' + eventNameToWrap];
    },
    set(cb) {
      if (this['_on' + eventNameToWrap]) {
        this.removeEventListener(eventNameToWrap,
            this['_on' + eventNameToWrap]);
        delete this['_on' + eventNameToWrap];
      }
      if (cb) {
        this.addEventListener(eventNameToWrap,
            this['_on' + eventNameToWrap] = cb);
      }
    },
    enumerable: true,
    configurable: true
  });
}

function disableLog(bool) {
  if (typeof bool !== 'boolean') {
    return new Error('Argument type: ' + typeof bool +
        '. Please use a boolean.');
  }
  logDisabled_ = bool;
  return (bool) ? 'adapter.js logging disabled' :
      'adapter.js logging enabled';
}

/**
 * Disable or enable deprecation warnings
 * @param {!boolean} bool set to true to disable warnings.
 */
function disableWarnings(bool) {
  if (typeof bool !== 'boolean') {
    return new Error('Argument type: ' + typeof bool +
        '. Please use a boolean.');
  }
  deprecationWarnings_ = !bool;
  return 'adapter.js deprecation warnings ' + (bool ? 'disabled' : 'enabled');
}

function log() {
  if (typeof window === 'object') {
    if (logDisabled_) {
      return;
    }
    if (typeof console !== 'undefined' && typeof console.log === 'function') {
      console.log.apply(console, arguments);
    }
  }
}

/**
 * Shows a deprecation warning suggesting the modern and spec-compatible API.
 */
function deprecated(oldMethod, newMethod) {
  if (!deprecationWarnings_) {
    return;
  }
  console.warn(oldMethod + ' is deprecated, please use ' + newMethod +
      ' instead.');
}

/**
 * Browser detector.
 *
 * @return {object} result containing browser and version
 *     properties.
 */
function detectBrowser(window) {
  // Returned result object.
  const result = {browser: null, version: null};

  // Fail early if it's not a browser
  if (typeof window === 'undefined' || !window.navigator) {
    result.browser = 'Not a browser.';
    return result;
  }

  const {navigator} = window;

  if (navigator.mozGetUserMedia) { // Firefox.
    result.browser = 'firefox';
    result.version = extractVersion(navigator.userAgent,
        /Firefox\/(\d+)\./, 1);
  } else if (navigator.webkitGetUserMedia ||
      (window.isSecureContext === false && window.webkitRTCPeerConnection &&
       !window.RTCIceGatherer)) {
    // Chrome, Chromium, Webview, Opera.
    // Version matches Chrome/WebRTC version.
    // Chrome 74 removed webkitGetUserMedia on http as well so we need the
    // more complicated fallback to webkitRTCPeerConnection.
    result.browser = 'chrome';
    result.version = extractVersion(navigator.userAgent,
        /Chrom(e|ium)\/(\d+)\./, 2);
  } else if (window.RTCPeerConnection &&
      navigator.userAgent.match(/AppleWebKit\/(\d+)\./)) { // Safari.
    result.browser = 'safari';
    result.version = extractVersion(navigator.userAgent,
        /AppleWebKit\/(\d+)\./, 1);
    result.supportsUnifiedPlan = window.RTCRtpTransceiver &&
        'currentDirection' in window.RTCRtpTransceiver.prototype;
  } else { // Default fallthrough: not supported.
    result.browser = 'Not a supported browser.';
    return result;
  }

  return result;
}

/**
 * Checks if something is an object.
 *
 * @param {*} val The something you want to check.
 * @return true if val is an object, false otherwise.
 */
function isObject(val) {
  return Object.prototype.toString.call(val) === '[object Object]';
}

/**
 * Remove all empty objects and undefined values
 * from a nested object -- an enhanced and vanilla version
 * of Lodash's `compact`.
 */
function compactObject(data) {
  if (!isObject(data)) {
    return data;
  }

  return Object.keys(data).reduce(function(accumulator, key) {
    const isObj = isObject(data[key]);
    const value = isObj ? compactObject(data[key]) : data[key];
    const isEmptyObject = isObj && !Object.keys(value).length;
    if (value === undefined || isEmptyObject) {
      return accumulator;
    }
    return Object.assign(accumulator, {[key]: value});
  }, {});
}

/* iterates the stats graph recursively. */
function walkStats(stats, base, resultSet) {
  if (!base || resultSet.has(base.id)) {
    return;
  }
  resultSet.set(base.id, base);
  Object.keys(base).forEach(name => {
    if (name.endsWith('Id')) {
      walkStats(stats, stats.get(base[name]), resultSet);
    } else if (name.endsWith('Ids')) {
      base[name].forEach(id => {
        walkStats(stats, stats.get(id), resultSet);
      });
    }
  });
}

/* filter getStats for a sender/receiver track. */
function filterStats(result, track, outbound) {
  const streamStatsType = outbound ? 'outbound-rtp' : 'inbound-rtp';
  const filteredResult = new Map();
  if (track === null) {
    return filteredResult;
  }
  const trackStats = [];
  result.forEach(value => {
    if (value.type === 'track' &&
        value.trackIdentifier === track.id) {
      trackStats.push(value);
    }
  });
  trackStats.forEach(trackStat => {
    result.forEach(stats => {
      if (stats.type === streamStatsType && stats.trackId === trackStat.id) {
        walkStats(result, stats, filteredResult);
      }
    });
  });
  return filteredResult;
}


;// CONCATENATED MODULE: ./node_modules/webrtc-adapter/src/js/chrome/getusermedia.js
/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
/* eslint-env node */


const logging = log;

function shimGetUserMedia(window, browserDetails) {
  const navigator = window && window.navigator;

  if (!navigator.mediaDevices) {
    return;
  }

  const constraintsToChrome_ = function(c) {
    if (typeof c !== 'object' || c.mandatory || c.optional) {
      return c;
    }
    const cc = {};
    Object.keys(c).forEach(key => {
      if (key === 'require' || key === 'advanced' || key === 'mediaSource') {
        return;
      }
      const r = (typeof c[key] === 'object') ? c[key] : {ideal: c[key]};
      if (r.exact !== undefined && typeof r.exact === 'number') {
        r.min = r.max = r.exact;
      }
      const oldname_ = function(prefix, name) {
        if (prefix) {
          return prefix + name.charAt(0).toUpperCase() + name.slice(1);
        }
        return (name === 'deviceId') ? 'sourceId' : name;
      };
      if (r.ideal !== undefined) {
        cc.optional = cc.optional || [];
        let oc = {};
        if (typeof r.ideal === 'number') {
          oc[oldname_('min', key)] = r.ideal;
          cc.optional.push(oc);
          oc = {};
          oc[oldname_('max', key)] = r.ideal;
          cc.optional.push(oc);
        } else {
          oc[oldname_('', key)] = r.ideal;
          cc.optional.push(oc);
        }
      }
      if (r.exact !== undefined && typeof r.exact !== 'number') {
        cc.mandatory = cc.mandatory || {};
        cc.mandatory[oldname_('', key)] = r.exact;
      } else {
        ['min', 'max'].forEach(mix => {
          if (r[mix] !== undefined) {
            cc.mandatory = cc.mandatory || {};
            cc.mandatory[oldname_(mix, key)] = r[mix];
          }
        });
      }
    });
    if (c.advanced) {
      cc.optional = (cc.optional || []).concat(c.advanced);
    }
    return cc;
  };

  const shimConstraints_ = function(constraints, func) {
    if (browserDetails.version >= 61) {
      return func(constraints);
    }
    constraints = JSON.parse(JSON.stringify(constraints));
    if (constraints && typeof constraints.audio === 'object') {
      const remap = function(obj, a, b) {
        if (a in obj && !(b in obj)) {
          obj[b] = obj[a];
          delete obj[a];
        }
      };
      constraints = JSON.parse(JSON.stringify(constraints));
      remap(constraints.audio, 'autoGainControl', 'googAutoGainControl');
      remap(constraints.audio, 'noiseSuppression', 'googNoiseSuppression');
      constraints.audio = constraintsToChrome_(constraints.audio);
    }
    if (constraints && typeof constraints.video === 'object') {
      // Shim facingMode for mobile & surface pro.
      let face = constraints.video.facingMode;
      face = face && ((typeof face === 'object') ? face : {ideal: face});
      const getSupportedFacingModeLies = browserDetails.version < 66;

      if ((face && (face.exact === 'user' || face.exact === 'environment' ||
                    face.ideal === 'user' || face.ideal === 'environment')) &&
          !(navigator.mediaDevices.getSupportedConstraints &&
            navigator.mediaDevices.getSupportedConstraints().facingMode &&
            !getSupportedFacingModeLies)) {
        delete constraints.video.facingMode;
        let matches;
        if (face.exact === 'environment' || face.ideal === 'environment') {
          matches = ['back', 'rear'];
        } else if (face.exact === 'user' || face.ideal === 'user') {
          matches = ['front'];
        }
        if (matches) {
          // Look for matches in label, or use last cam for back (typical).
          return navigator.mediaDevices.enumerateDevices()
          .then(devices => {
            devices = devices.filter(d => d.kind === 'videoinput');
            let dev = devices.find(d => matches.some(match =>
              d.label.toLowerCase().includes(match)));
            if (!dev && devices.length && matches.includes('back')) {
              dev = devices[devices.length - 1]; // more likely the back cam
            }
            if (dev) {
              constraints.video.deviceId = face.exact ? {exact: dev.deviceId} :
                                                        {ideal: dev.deviceId};
            }
            constraints.video = constraintsToChrome_(constraints.video);
            logging('chrome: ' + JSON.stringify(constraints));
            return func(constraints);
          });
        }
      }
      constraints.video = constraintsToChrome_(constraints.video);
    }
    logging('chrome: ' + JSON.stringify(constraints));
    return func(constraints);
  };

  const shimError_ = function(e) {
    if (browserDetails.version >= 64) {
      return e;
    }
    return {
      name: {
        PermissionDeniedError: 'NotAllowedError',
        PermissionDismissedError: 'NotAllowedError',
        InvalidStateError: 'NotAllowedError',
        DevicesNotFoundError: 'NotFoundError',
        ConstraintNotSatisfiedError: 'OverconstrainedError',
        TrackStartError: 'NotReadableError',
        MediaDeviceFailedDueToShutdown: 'NotAllowedError',
        MediaDeviceKillSwitchOn: 'NotAllowedError',
        TabCaptureError: 'AbortError',
        ScreenCaptureError: 'AbortError',
        DeviceCaptureError: 'AbortError'
      }[e.name] || e.name,
      message: e.message,
      constraint: e.constraint || e.constraintName,
      toString() {
        return this.name + (this.message && ': ') + this.message;
      }
    };
  };

  const getUserMedia_ = function(constraints, onSuccess, onError) {
    shimConstraints_(constraints, c => {
      navigator.webkitGetUserMedia(c, onSuccess, e => {
        if (onError) {
          onError(shimError_(e));
        }
      });
    });
  };
  navigator.getUserMedia = getUserMedia_.bind(navigator);

  // Even though Chrome 45 has navigator.mediaDevices and a getUserMedia
  // function which returns a Promise, it does not accept spec-style
  // constraints.
  if (navigator.mediaDevices.getUserMedia) {
    const origGetUserMedia = navigator.mediaDevices.getUserMedia.
        bind(navigator.mediaDevices);
    navigator.mediaDevices.getUserMedia = function(cs) {
      return shimConstraints_(cs, c => origGetUserMedia(c).then(stream => {
        if (c.audio && !stream.getAudioTracks().length ||
            c.video && !stream.getVideoTracks().length) {
          stream.getTracks().forEach(track => {
            track.stop();
          });
          throw new DOMException('', 'NotFoundError');
        }
        return stream;
      }, e => Promise.reject(shimError_(e))));
    };
  }
}

;// CONCATENATED MODULE: ./node_modules/webrtc-adapter/src/js/chrome/getdisplaymedia.js
/*
 *  Copyright (c) 2018 The adapter.js project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
/* eslint-env node */

function shimGetDisplayMedia(window, getSourceId) {
  if (window.navigator.mediaDevices &&
    'getDisplayMedia' in window.navigator.mediaDevices) {
    return;
  }
  if (!(window.navigator.mediaDevices)) {
    return;
  }
  // getSourceId is a function that returns a promise resolving with
  // the sourceId of the screen/window/tab to be shared.
  if (typeof getSourceId !== 'function') {
    console.error('shimGetDisplayMedia: getSourceId argument is not ' +
        'a function');
    return;
  }
  window.navigator.mediaDevices.getDisplayMedia =
    function getDisplayMedia(constraints) {
      return getSourceId(constraints)
        .then(sourceId => {
          const widthSpecified = constraints.video && constraints.video.width;
          const heightSpecified = constraints.video &&
            constraints.video.height;
          const frameRateSpecified = constraints.video &&
            constraints.video.frameRate;
          constraints.video = {
            mandatory: {
              chromeMediaSource: 'desktop',
              chromeMediaSourceId: sourceId,
              maxFrameRate: frameRateSpecified || 3
            }
          };
          if (widthSpecified) {
            constraints.video.mandatory.maxWidth = widthSpecified;
          }
          if (heightSpecified) {
            constraints.video.mandatory.maxHeight = heightSpecified;
          }
          return window.navigator.mediaDevices.getUserMedia(constraints);
        });
    };
}

;// CONCATENATED MODULE: ./node_modules/webrtc-adapter/src/js/chrome/chrome_shim.js
/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
 /* eslint-env node */






function shimMediaStream(window) {
  window.MediaStream = window.MediaStream || window.webkitMediaStream;
}

function shimOnTrack(window) {
  if (typeof window === 'object' && window.RTCPeerConnection && !('ontrack' in
      window.RTCPeerConnection.prototype)) {
    Object.defineProperty(window.RTCPeerConnection.prototype, 'ontrack', {
      get() {
        return this._ontrack;
      },
      set(f) {
        if (this._ontrack) {
          this.removeEventListener('track', this._ontrack);
        }
        this.addEventListener('track', this._ontrack = f);
      },
      enumerable: true,
      configurable: true
    });
    const origSetRemoteDescription =
        window.RTCPeerConnection.prototype.setRemoteDescription;
    window.RTCPeerConnection.prototype.setRemoteDescription =
      function setRemoteDescription() {
        if (!this._ontrackpoly) {
          this._ontrackpoly = (e) => {
            // onaddstream does not fire when a track is added to an existing
            // stream. But stream.onaddtrack is implemented so we use that.
            e.stream.addEventListener('addtrack', te => {
              let receiver;
              if (window.RTCPeerConnection.prototype.getReceivers) {
                receiver = this.getReceivers()
                  .find(r => r.track && r.track.id === te.track.id);
              } else {
                receiver = {track: te.track};
              }

              const event = new Event('track');
              event.track = te.track;
              event.receiver = receiver;
              event.transceiver = {receiver};
              event.streams = [e.stream];
              this.dispatchEvent(event);
            });
            e.stream.getTracks().forEach(track => {
              let receiver;
              if (window.RTCPeerConnection.prototype.getReceivers) {
                receiver = this.getReceivers()
                  .find(r => r.track && r.track.id === track.id);
              } else {
                receiver = {track};
              }
              const event = new Event('track');
              event.track = track;
              event.receiver = receiver;
              event.transceiver = {receiver};
              event.streams = [e.stream];
              this.dispatchEvent(event);
            });
          };
          this.addEventListener('addstream', this._ontrackpoly);
        }
        return origSetRemoteDescription.apply(this, arguments);
      };
  } else {
    // even if RTCRtpTransceiver is in window, it is only used and
    // emitted in unified-plan. Unfortunately this means we need
    // to unconditionally wrap the event.
    wrapPeerConnectionEvent(window, 'track', e => {
      if (!e.transceiver) {
        Object.defineProperty(e, 'transceiver',
          {value: {receiver: e.receiver}});
      }
      return e;
    });
  }
}

function shimGetSendersWithDtmf(window) {
  // Overrides addTrack/removeTrack, depends on shimAddTrackRemoveTrack.
  if (typeof window === 'object' && window.RTCPeerConnection &&
      !('getSenders' in window.RTCPeerConnection.prototype) &&
      'createDTMFSender' in window.RTCPeerConnection.prototype) {
    const shimSenderWithDtmf = function(pc, track) {
      return {
        track,
        get dtmf() {
          if (this._dtmf === undefined) {
            if (track.kind === 'audio') {
              this._dtmf = pc.createDTMFSender(track);
            } else {
              this._dtmf = null;
            }
          }
          return this._dtmf;
        },
        _pc: pc
      };
    };

    // augment addTrack when getSenders is not available.
    if (!window.RTCPeerConnection.prototype.getSenders) {
      window.RTCPeerConnection.prototype.getSenders = function getSenders() {
        this._senders = this._senders || [];
        return this._senders.slice(); // return a copy of the internal state.
      };
      const origAddTrack = window.RTCPeerConnection.prototype.addTrack;
      window.RTCPeerConnection.prototype.addTrack =
        function addTrack(track, stream) {
          let sender = origAddTrack.apply(this, arguments);
          if (!sender) {
            sender = shimSenderWithDtmf(this, track);
            this._senders.push(sender);
          }
          return sender;
        };

      const origRemoveTrack = window.RTCPeerConnection.prototype.removeTrack;
      window.RTCPeerConnection.prototype.removeTrack =
        function removeTrack(sender) {
          origRemoveTrack.apply(this, arguments);
          const idx = this._senders.indexOf(sender);
          if (idx !== -1) {
            this._senders.splice(idx, 1);
          }
        };
    }
    const origAddStream = window.RTCPeerConnection.prototype.addStream;
    window.RTCPeerConnection.prototype.addStream = function addStream(stream) {
      this._senders = this._senders || [];
      origAddStream.apply(this, [stream]);
      stream.getTracks().forEach(track => {
        this._senders.push(shimSenderWithDtmf(this, track));
      });
    };

    const origRemoveStream = window.RTCPeerConnection.prototype.removeStream;
    window.RTCPeerConnection.prototype.removeStream =
      function removeStream(stream) {
        this._senders = this._senders || [];
        origRemoveStream.apply(this, [stream]);

        stream.getTracks().forEach(track => {
          const sender = this._senders.find(s => s.track === track);
          if (sender) { // remove sender
            this._senders.splice(this._senders.indexOf(sender), 1);
          }
        });
      };
  } else if (typeof window === 'object' && window.RTCPeerConnection &&
             'getSenders' in window.RTCPeerConnection.prototype &&
             'createDTMFSender' in window.RTCPeerConnection.prototype &&
             window.RTCRtpSender &&
             !('dtmf' in window.RTCRtpSender.prototype)) {
    const origGetSenders = window.RTCPeerConnection.prototype.getSenders;
    window.RTCPeerConnection.prototype.getSenders = function getSenders() {
      const senders = origGetSenders.apply(this, []);
      senders.forEach(sender => sender._pc = this);
      return senders;
    };

    Object.defineProperty(window.RTCRtpSender.prototype, 'dtmf', {
      get() {
        if (this._dtmf === undefined) {
          if (this.track.kind === 'audio') {
            this._dtmf = this._pc.createDTMFSender(this.track);
          } else {
            this._dtmf = null;
          }
        }
        return this._dtmf;
      }
    });
  }
}

function shimGetStats(window) {
  if (!window.RTCPeerConnection) {
    return;
  }

  const origGetStats = window.RTCPeerConnection.prototype.getStats;
  window.RTCPeerConnection.prototype.getStats = function getStats() {
    const [selector, onSucc, onErr] = arguments;

    // If selector is a function then we are in the old style stats so just
    // pass back the original getStats format to avoid breaking old users.
    if (arguments.length > 0 && typeof selector === 'function') {
      return origGetStats.apply(this, arguments);
    }

    // When spec-style getStats is supported, return those when called with
    // either no arguments or the selector argument is null.
    if (origGetStats.length === 0 && (arguments.length === 0 ||
        typeof selector !== 'function')) {
      return origGetStats.apply(this, []);
    }

    const fixChromeStats_ = function(response) {
      const standardReport = {};
      const reports = response.result();
      reports.forEach(report => {
        const standardStats = {
          id: report.id,
          timestamp: report.timestamp,
          type: {
            localcandidate: 'local-candidate',
            remotecandidate: 'remote-candidate'
          }[report.type] || report.type
        };
        report.names().forEach(name => {
          standardStats[name] = report.stat(name);
        });
        standardReport[standardStats.id] = standardStats;
      });

      return standardReport;
    };

    // shim getStats with maplike support
    const makeMapStats = function(stats) {
      return new Map(Object.keys(stats).map(key => [key, stats[key]]));
    };

    if (arguments.length >= 2) {
      const successCallbackWrapper_ = function(response) {
        onSucc(makeMapStats(fixChromeStats_(response)));
      };

      return origGetStats.apply(this, [successCallbackWrapper_,
        selector]);
    }

    // promise-support
    return new Promise((resolve, reject) => {
      origGetStats.apply(this, [
        function(response) {
          resolve(makeMapStats(fixChromeStats_(response)));
        }, reject]);
    }).then(onSucc, onErr);
  };
}

function shimSenderReceiverGetStats(window) {
  if (!(typeof window === 'object' && window.RTCPeerConnection &&
      window.RTCRtpSender && window.RTCRtpReceiver)) {
    return;
  }

  // shim sender stats.
  if (!('getStats' in window.RTCRtpSender.prototype)) {
    const origGetSenders = window.RTCPeerConnection.prototype.getSenders;
    if (origGetSenders) {
      window.RTCPeerConnection.prototype.getSenders = function getSenders() {
        const senders = origGetSenders.apply(this, []);
        senders.forEach(sender => sender._pc = this);
        return senders;
      };
    }

    const origAddTrack = window.RTCPeerConnection.prototype.addTrack;
    if (origAddTrack) {
      window.RTCPeerConnection.prototype.addTrack = function addTrack() {
        const sender = origAddTrack.apply(this, arguments);
        sender._pc = this;
        return sender;
      };
    }
    window.RTCRtpSender.prototype.getStats = function getStats() {
      const sender = this;
      return this._pc.getStats().then(result =>
        /* Note: this will include stats of all senders that
         *   send a track with the same id as sender.track as
         *   it is not possible to identify the RTCRtpSender.
         */
        filterStats(result, sender.track, true));
    };
  }

  // shim receiver stats.
  if (!('getStats' in window.RTCRtpReceiver.prototype)) {
    const origGetReceivers = window.RTCPeerConnection.prototype.getReceivers;
    if (origGetReceivers) {
      window.RTCPeerConnection.prototype.getReceivers =
        function getReceivers() {
          const receivers = origGetReceivers.apply(this, []);
          receivers.forEach(receiver => receiver._pc = this);
          return receivers;
        };
    }
    wrapPeerConnectionEvent(window, 'track', e => {
      e.receiver._pc = e.srcElement;
      return e;
    });
    window.RTCRtpReceiver.prototype.getStats = function getStats() {
      const receiver = this;
      return this._pc.getStats().then(result =>
        filterStats(result, receiver.track, false));
    };
  }

  if (!('getStats' in window.RTCRtpSender.prototype &&
      'getStats' in window.RTCRtpReceiver.prototype)) {
    return;
  }

  // shim RTCPeerConnection.getStats(track).
  const origGetStats = window.RTCPeerConnection.prototype.getStats;
  window.RTCPeerConnection.prototype.getStats = function getStats() {
    if (arguments.length > 0 &&
        arguments[0] instanceof window.MediaStreamTrack) {
      const track = arguments[0];
      let sender;
      let receiver;
      let err;
      this.getSenders().forEach(s => {
        if (s.track === track) {
          if (sender) {
            err = true;
          } else {
            sender = s;
          }
        }
      });
      this.getReceivers().forEach(r => {
        if (r.track === track) {
          if (receiver) {
            err = true;
          } else {
            receiver = r;
          }
        }
        return r.track === track;
      });
      if (err || (sender && receiver)) {
        return Promise.reject(new DOMException(
          'There are more than one sender or receiver for the track.',
          'InvalidAccessError'));
      } else if (sender) {
        return sender.getStats();
      } else if (receiver) {
        return receiver.getStats();
      }
      return Promise.reject(new DOMException(
        'There is no sender or receiver for the track.',
        'InvalidAccessError'));
    }
    return origGetStats.apply(this, arguments);
  };
}

function shimAddTrackRemoveTrackWithNative(window) {
  // shim addTrack/removeTrack with native variants in order to make
  // the interactions with legacy getLocalStreams behave as in other browsers.
  // Keeps a mapping stream.id => [stream, rtpsenders...]
  window.RTCPeerConnection.prototype.getLocalStreams =
    function getLocalStreams() {
      this._shimmedLocalStreams = this._shimmedLocalStreams || {};
      return Object.keys(this._shimmedLocalStreams)
        .map(streamId => this._shimmedLocalStreams[streamId][0]);
    };

  const origAddTrack = window.RTCPeerConnection.prototype.addTrack;
  window.RTCPeerConnection.prototype.addTrack =
    function addTrack(track, stream) {
      if (!stream) {
        return origAddTrack.apply(this, arguments);
      }
      this._shimmedLocalStreams = this._shimmedLocalStreams || {};

      const sender = origAddTrack.apply(this, arguments);
      if (!this._shimmedLocalStreams[stream.id]) {
        this._shimmedLocalStreams[stream.id] = [stream, sender];
      } else if (this._shimmedLocalStreams[stream.id].indexOf(sender) === -1) {
        this._shimmedLocalStreams[stream.id].push(sender);
      }
      return sender;
    };

  const origAddStream = window.RTCPeerConnection.prototype.addStream;
  window.RTCPeerConnection.prototype.addStream = function addStream(stream) {
    this._shimmedLocalStreams = this._shimmedLocalStreams || {};

    stream.getTracks().forEach(track => {
      const alreadyExists = this.getSenders().find(s => s.track === track);
      if (alreadyExists) {
        throw new DOMException('Track already exists.',
            'InvalidAccessError');
      }
    });
    const existingSenders = this.getSenders();
    origAddStream.apply(this, arguments);
    const newSenders = this.getSenders()
      .filter(newSender => existingSenders.indexOf(newSender) === -1);
    this._shimmedLocalStreams[stream.id] = [stream].concat(newSenders);
  };

  const origRemoveStream = window.RTCPeerConnection.prototype.removeStream;
  window.RTCPeerConnection.prototype.removeStream =
    function removeStream(stream) {
      this._shimmedLocalStreams = this._shimmedLocalStreams || {};
      delete this._shimmedLocalStreams[stream.id];
      return origRemoveStream.apply(this, arguments);
    };

  const origRemoveTrack = window.RTCPeerConnection.prototype.removeTrack;
  window.RTCPeerConnection.prototype.removeTrack =
    function removeTrack(sender) {
      this._shimmedLocalStreams = this._shimmedLocalStreams || {};
      if (sender) {
        Object.keys(this._shimmedLocalStreams).forEach(streamId => {
          const idx = this._shimmedLocalStreams[streamId].indexOf(sender);
          if (idx !== -1) {
            this._shimmedLocalStreams[streamId].splice(idx, 1);
          }
          if (this._shimmedLocalStreams[streamId].length === 1) {
            delete this._shimmedLocalStreams[streamId];
          }
        });
      }
      return origRemoveTrack.apply(this, arguments);
    };
}

function shimAddTrackRemoveTrack(window, browserDetails) {
  if (!window.RTCPeerConnection) {
    return;
  }
  // shim addTrack and removeTrack.
  if (window.RTCPeerConnection.prototype.addTrack &&
      browserDetails.version >= 65) {
    return shimAddTrackRemoveTrackWithNative(window);
  }

  // also shim pc.getLocalStreams when addTrack is shimmed
  // to return the original streams.
  const origGetLocalStreams = window.RTCPeerConnection.prototype
      .getLocalStreams;
  window.RTCPeerConnection.prototype.getLocalStreams =
    function getLocalStreams() {
      const nativeStreams = origGetLocalStreams.apply(this);
      this._reverseStreams = this._reverseStreams || {};
      return nativeStreams.map(stream => this._reverseStreams[stream.id]);
    };

  const origAddStream = window.RTCPeerConnection.prototype.addStream;
  window.RTCPeerConnection.prototype.addStream = function addStream(stream) {
    this._streams = this._streams || {};
    this._reverseStreams = this._reverseStreams || {};

    stream.getTracks().forEach(track => {
      const alreadyExists = this.getSenders().find(s => s.track === track);
      if (alreadyExists) {
        throw new DOMException('Track already exists.',
            'InvalidAccessError');
      }
    });
    // Add identity mapping for consistency with addTrack.
    // Unless this is being used with a stream from addTrack.
    if (!this._reverseStreams[stream.id]) {
      const newStream = new window.MediaStream(stream.getTracks());
      this._streams[stream.id] = newStream;
      this._reverseStreams[newStream.id] = stream;
      stream = newStream;
    }
    origAddStream.apply(this, [stream]);
  };

  const origRemoveStream = window.RTCPeerConnection.prototype.removeStream;
  window.RTCPeerConnection.prototype.removeStream =
    function removeStream(stream) {
      this._streams = this._streams || {};
      this._reverseStreams = this._reverseStreams || {};

      origRemoveStream.apply(this, [(this._streams[stream.id] || stream)]);
      delete this._reverseStreams[(this._streams[stream.id] ?
          this._streams[stream.id].id : stream.id)];
      delete this._streams[stream.id];
    };

  window.RTCPeerConnection.prototype.addTrack =
    function addTrack(track, stream) {
      if (this.signalingState === 'closed') {
        throw new DOMException(
          'The RTCPeerConnection\'s signalingState is \'closed\'.',
          'InvalidStateError');
      }
      const streams = [].slice.call(arguments, 1);
      if (streams.length !== 1 ||
          !streams[0].getTracks().find(t => t === track)) {
        // this is not fully correct but all we can manage without
        // [[associated MediaStreams]] internal slot.
        throw new DOMException(
          'The adapter.js addTrack polyfill only supports a single ' +
          ' stream which is associated with the specified track.',
          'NotSupportedError');
      }

      const alreadyExists = this.getSenders().find(s => s.track === track);
      if (alreadyExists) {
        throw new DOMException('Track already exists.',
            'InvalidAccessError');
      }

      this._streams = this._streams || {};
      this._reverseStreams = this._reverseStreams || {};
      const oldStream = this._streams[stream.id];
      if (oldStream) {
        // this is using odd Chrome behaviour, use with caution:
        // https://bugs.chromium.org/p/webrtc/issues/detail?id=7815
        // Note: we rely on the high-level addTrack/dtmf shim to
        // create the sender with a dtmf sender.
        oldStream.addTrack(track);

        // Trigger ONN async.
        Promise.resolve().then(() => {
          this.dispatchEvent(new Event('negotiationneeded'));
        });
      } else {
        const newStream = new window.MediaStream([track]);
        this._streams[stream.id] = newStream;
        this._reverseStreams[newStream.id] = stream;
        this.addStream(newStream);
      }
      return this.getSenders().find(s => s.track === track);
    };

  // replace the internal stream id with the external one and
  // vice versa.
  function replaceInternalStreamId(pc, description) {
    let sdp = description.sdp;
    Object.keys(pc._reverseStreams || []).forEach(internalId => {
      const externalStream = pc._reverseStreams[internalId];
      const internalStream = pc._streams[externalStream.id];
      sdp = sdp.replace(new RegExp(internalStream.id, 'g'),
          externalStream.id);
    });
    return new RTCSessionDescription({
      type: description.type,
      sdp
    });
  }
  function replaceExternalStreamId(pc, description) {
    let sdp = description.sdp;
    Object.keys(pc._reverseStreams || []).forEach(internalId => {
      const externalStream = pc._reverseStreams[internalId];
      const internalStream = pc._streams[externalStream.id];
      sdp = sdp.replace(new RegExp(externalStream.id, 'g'),
          internalStream.id);
    });
    return new RTCSessionDescription({
      type: description.type,
      sdp
    });
  }
  ['createOffer', 'createAnswer'].forEach(function(method) {
    const nativeMethod = window.RTCPeerConnection.prototype[method];
    const methodObj = {[method]() {
      const args = arguments;
      const isLegacyCall = arguments.length &&
          typeof arguments[0] === 'function';
      if (isLegacyCall) {
        return nativeMethod.apply(this, [
          (description) => {
            const desc = replaceInternalStreamId(this, description);
            args[0].apply(null, [desc]);
          },
          (err) => {
            if (args[1]) {
              args[1].apply(null, err);
            }
          }, arguments[2]
        ]);
      }
      return nativeMethod.apply(this, arguments)
      .then(description => replaceInternalStreamId(this, description));
    }};
    window.RTCPeerConnection.prototype[method] = methodObj[method];
  });

  const origSetLocalDescription =
      window.RTCPeerConnection.prototype.setLocalDescription;
  window.RTCPeerConnection.prototype.setLocalDescription =
    function setLocalDescription() {
      if (!arguments.length || !arguments[0].type) {
        return origSetLocalDescription.apply(this, arguments);
      }
      arguments[0] = replaceExternalStreamId(this, arguments[0]);
      return origSetLocalDescription.apply(this, arguments);
    };

  // TODO: mangle getStats: https://w3c.github.io/webrtc-stats/#dom-rtcmediastreamstats-streamidentifier

  const origLocalDescription = Object.getOwnPropertyDescriptor(
      window.RTCPeerConnection.prototype, 'localDescription');
  Object.defineProperty(window.RTCPeerConnection.prototype,
      'localDescription', {
        get() {
          const description = origLocalDescription.get.apply(this);
          if (description.type === '') {
            return description;
          }
          return replaceInternalStreamId(this, description);
        }
      });

  window.RTCPeerConnection.prototype.removeTrack =
    function removeTrack(sender) {
      if (this.signalingState === 'closed') {
        throw new DOMException(
          'The RTCPeerConnection\'s signalingState is \'closed\'.',
          'InvalidStateError');
      }
      // We can not yet check for sender instanceof RTCRtpSender
      // since we shim RTPSender. So we check if sender._pc is set.
      if (!sender._pc) {
        throw new DOMException('Argument 1 of RTCPeerConnection.removeTrack ' +
            'does not implement interface RTCRtpSender.', 'TypeError');
      }
      const isLocal = sender._pc === this;
      if (!isLocal) {
        throw new DOMException('Sender was not created by this connection.',
            'InvalidAccessError');
      }

      // Search for the native stream the senders track belongs to.
      this._streams = this._streams || {};
      let stream;
      Object.keys(this._streams).forEach(streamid => {
        const hasTrack = this._streams[streamid].getTracks()
          .find(track => sender.track === track);
        if (hasTrack) {
          stream = this._streams[streamid];
        }
      });

      if (stream) {
        if (stream.getTracks().length === 1) {
          // if this is the last track of the stream, remove the stream. This
          // takes care of any shimmed _senders.
          this.removeStream(this._reverseStreams[stream.id]);
        } else {
          // relying on the same odd chrome behaviour as above.
          stream.removeTrack(sender.track);
        }
        this.dispatchEvent(new Event('negotiationneeded'));
      }
    };
}

function shimPeerConnection(window, browserDetails) {
  if (!window.RTCPeerConnection && window.webkitRTCPeerConnection) {
    // very basic support for old versions.
    window.RTCPeerConnection = window.webkitRTCPeerConnection;
  }
  if (!window.RTCPeerConnection) {
    return;
  }

  // shim implicit creation of RTCSessionDescription/RTCIceCandidate
  if (browserDetails.version < 53) {
    ['setLocalDescription', 'setRemoteDescription', 'addIceCandidate']
        .forEach(function(method) {
          const nativeMethod = window.RTCPeerConnection.prototype[method];
          const methodObj = {[method]() {
            arguments[0] = new ((method === 'addIceCandidate') ?
                window.RTCIceCandidate :
                window.RTCSessionDescription)(arguments[0]);
            return nativeMethod.apply(this, arguments);
          }};
          window.RTCPeerConnection.prototype[method] = methodObj[method];
        });
  }
}

// Attempt to fix ONN in plan-b mode.
function fixNegotiationNeeded(window, browserDetails) {
  wrapPeerConnectionEvent(window, 'negotiationneeded', e => {
    const pc = e.target;
    if (browserDetails.version < 72 || (pc.getConfiguration &&
        pc.getConfiguration().sdpSemantics === 'plan-b')) {
      if (pc.signalingState !== 'stable') {
        return;
      }
    }
    return e;
  });
}

;// CONCATENATED MODULE: ./node_modules/webrtc-adapter/src/js/firefox/getusermedia.js
/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
/* eslint-env node */




function getusermedia_shimGetUserMedia(window, browserDetails) {
  const navigator = window && window.navigator;
  const MediaStreamTrack = window && window.MediaStreamTrack;

  navigator.getUserMedia = function(constraints, onSuccess, onError) {
    // Replace Firefox 44+'s deprecation warning with unprefixed version.
    deprecated('navigator.getUserMedia',
        'navigator.mediaDevices.getUserMedia');
    navigator.mediaDevices.getUserMedia(constraints).then(onSuccess, onError);
  };

  if (!(browserDetails.version > 55 &&
      'autoGainControl' in navigator.mediaDevices.getSupportedConstraints())) {
    const remap = function(obj, a, b) {
      if (a in obj && !(b in obj)) {
        obj[b] = obj[a];
        delete obj[a];
      }
    };

    const nativeGetUserMedia = navigator.mediaDevices.getUserMedia.
        bind(navigator.mediaDevices);
    navigator.mediaDevices.getUserMedia = function(c) {
      if (typeof c === 'object' && typeof c.audio === 'object') {
        c = JSON.parse(JSON.stringify(c));
        remap(c.audio, 'autoGainControl', 'mozAutoGainControl');
        remap(c.audio, 'noiseSuppression', 'mozNoiseSuppression');
      }
      return nativeGetUserMedia(c);
    };

    if (MediaStreamTrack && MediaStreamTrack.prototype.getSettings) {
      const nativeGetSettings = MediaStreamTrack.prototype.getSettings;
      MediaStreamTrack.prototype.getSettings = function() {
        const obj = nativeGetSettings.apply(this, arguments);
        remap(obj, 'mozAutoGainControl', 'autoGainControl');
        remap(obj, 'mozNoiseSuppression', 'noiseSuppression');
        return obj;
      };
    }

    if (MediaStreamTrack && MediaStreamTrack.prototype.applyConstraints) {
      const nativeApplyConstraints =
        MediaStreamTrack.prototype.applyConstraints;
      MediaStreamTrack.prototype.applyConstraints = function(c) {
        if (this.kind === 'audio' && typeof c === 'object') {
          c = JSON.parse(JSON.stringify(c));
          remap(c, 'autoGainControl', 'mozAutoGainControl');
          remap(c, 'noiseSuppression', 'mozNoiseSuppression');
        }
        return nativeApplyConstraints.apply(this, [c]);
      };
    }
  }
}

;// CONCATENATED MODULE: ./node_modules/webrtc-adapter/src/js/firefox/getdisplaymedia.js
/*
 *  Copyright (c) 2018 The adapter.js project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
/* eslint-env node */


function getdisplaymedia_shimGetDisplayMedia(window, preferredMediaSource) {
  if (window.navigator.mediaDevices &&
    'getDisplayMedia' in window.navigator.mediaDevices) {
    return;
  }
  if (!(window.navigator.mediaDevices)) {
    return;
  }
  window.navigator.mediaDevices.getDisplayMedia =
    function getDisplayMedia(constraints) {
      if (!(constraints && constraints.video)) {
        const err = new DOMException('getDisplayMedia without video ' +
            'constraints is undefined');
        err.name = 'NotFoundError';
        // from https://heycam.github.io/webidl/#idl-DOMException-error-names
        err.code = 8;
        return Promise.reject(err);
      }
      if (constraints.video === true) {
        constraints.video = {mediaSource: preferredMediaSource};
      } else {
        constraints.video.mediaSource = preferredMediaSource;
      }
      return window.navigator.mediaDevices.getUserMedia(constraints);
    };
}

;// CONCATENATED MODULE: ./node_modules/webrtc-adapter/src/js/firefox/firefox_shim.js
/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
/* eslint-env node */






function firefox_shim_shimOnTrack(window) {
  if (typeof window === 'object' && window.RTCTrackEvent &&
      ('receiver' in window.RTCTrackEvent.prototype) &&
      !('transceiver' in window.RTCTrackEvent.prototype)) {
    Object.defineProperty(window.RTCTrackEvent.prototype, 'transceiver', {
      get() {
        return {receiver: this.receiver};
      }
    });
  }
}

function firefox_shim_shimPeerConnection(window, browserDetails) {
  if (typeof window !== 'object' ||
      !(window.RTCPeerConnection || window.mozRTCPeerConnection)) {
    return; // probably media.peerconnection.enabled=false in about:config
  }
  if (!window.RTCPeerConnection && window.mozRTCPeerConnection) {
    // very basic support for old versions.
    window.RTCPeerConnection = window.mozRTCPeerConnection;
  }

  if (browserDetails.version < 53) {
    // shim away need for obsolete RTCIceCandidate/RTCSessionDescription.
    ['setLocalDescription', 'setRemoteDescription', 'addIceCandidate']
        .forEach(function(method) {
          const nativeMethod = window.RTCPeerConnection.prototype[method];
          const methodObj = {[method]() {
            arguments[0] = new ((method === 'addIceCandidate') ?
                window.RTCIceCandidate :
                window.RTCSessionDescription)(arguments[0]);
            return nativeMethod.apply(this, arguments);
          }};
          window.RTCPeerConnection.prototype[method] = methodObj[method];
        });
  }

  const modernStatsTypes = {
    inboundrtp: 'inbound-rtp',
    outboundrtp: 'outbound-rtp',
    candidatepair: 'candidate-pair',
    localcandidate: 'local-candidate',
    remotecandidate: 'remote-candidate'
  };

  const nativeGetStats = window.RTCPeerConnection.prototype.getStats;
  window.RTCPeerConnection.prototype.getStats = function getStats() {
    const [selector, onSucc, onErr] = arguments;
    return nativeGetStats.apply(this, [selector || null])
      .then(stats => {
        if (browserDetails.version < 53 && !onSucc) {
          // Shim only promise getStats with spec-hyphens in type names
          // Leave callback version alone; misc old uses of forEach before Map
          try {
            stats.forEach(stat => {
              stat.type = modernStatsTypes[stat.type] || stat.type;
            });
          } catch (e) {
            if (e.name !== 'TypeError') {
              throw e;
            }
            // Avoid TypeError: "type" is read-only, in old versions. 34-43ish
            stats.forEach((stat, i) => {
              stats.set(i, Object.assign({}, stat, {
                type: modernStatsTypes[stat.type] || stat.type
              }));
            });
          }
        }
        return stats;
      })
      .then(onSucc, onErr);
  };
}

function shimSenderGetStats(window) {
  if (!(typeof window === 'object' && window.RTCPeerConnection &&
      window.RTCRtpSender)) {
    return;
  }
  if (window.RTCRtpSender && 'getStats' in window.RTCRtpSender.prototype) {
    return;
  }
  const origGetSenders = window.RTCPeerConnection.prototype.getSenders;
  if (origGetSenders) {
    window.RTCPeerConnection.prototype.getSenders = function getSenders() {
      const senders = origGetSenders.apply(this, []);
      senders.forEach(sender => sender._pc = this);
      return senders;
    };
  }

  const origAddTrack = window.RTCPeerConnection.prototype.addTrack;
  if (origAddTrack) {
    window.RTCPeerConnection.prototype.addTrack = function addTrack() {
      const sender = origAddTrack.apply(this, arguments);
      sender._pc = this;
      return sender;
    };
  }
  window.RTCRtpSender.prototype.getStats = function getStats() {
    return this.track ? this._pc.getStats(this.track) :
        Promise.resolve(new Map());
  };
}

function shimReceiverGetStats(window) {
  if (!(typeof window === 'object' && window.RTCPeerConnection &&
      window.RTCRtpSender)) {
    return;
  }
  if (window.RTCRtpSender && 'getStats' in window.RTCRtpReceiver.prototype) {
    return;
  }
  const origGetReceivers = window.RTCPeerConnection.prototype.getReceivers;
  if (origGetReceivers) {
    window.RTCPeerConnection.prototype.getReceivers = function getReceivers() {
      const receivers = origGetReceivers.apply(this, []);
      receivers.forEach(receiver => receiver._pc = this);
      return receivers;
    };
  }
  wrapPeerConnectionEvent(window, 'track', e => {
    e.receiver._pc = e.srcElement;
    return e;
  });
  window.RTCRtpReceiver.prototype.getStats = function getStats() {
    return this._pc.getStats(this.track);
  };
}

function shimRemoveStream(window) {
  if (!window.RTCPeerConnection ||
      'removeStream' in window.RTCPeerConnection.prototype) {
    return;
  }
  window.RTCPeerConnection.prototype.removeStream =
    function removeStream(stream) {
      deprecated('removeStream', 'removeTrack');
      this.getSenders().forEach(sender => {
        if (sender.track && stream.getTracks().includes(sender.track)) {
          this.removeTrack(sender);
        }
      });
    };
}

function shimRTCDataChannel(window) {
  // rename DataChannel to RTCDataChannel (native fix in FF60):
  // https://bugzilla.mozilla.org/show_bug.cgi?id=1173851
  if (window.DataChannel && !window.RTCDataChannel) {
    window.RTCDataChannel = window.DataChannel;
  }
}

function shimAddTransceiver(window) {
  // https://github.com/webrtcHacks/adapter/issues/998#issuecomment-516921647
  // Firefox ignores the init sendEncodings options passed to addTransceiver
  // https://bugzilla.mozilla.org/show_bug.cgi?id=1396918
  if (!(typeof window === 'object' && window.RTCPeerConnection)) {
    return;
  }
  const origAddTransceiver = window.RTCPeerConnection.prototype.addTransceiver;
  if (origAddTransceiver) {
    window.RTCPeerConnection.prototype.addTransceiver =
      function addTransceiver() {
        this.setParametersPromises = [];
        const initParameters = arguments[1];
        const shouldPerformCheck = initParameters &&
                                  'sendEncodings' in initParameters;
        if (shouldPerformCheck) {
          // If sendEncodings params are provided, validate grammar
          initParameters.sendEncodings.forEach((encodingParam) => {
            if ('rid' in encodingParam) {
              const ridRegex = /^[a-z0-9]{0,16}$/i;
              if (!ridRegex.test(encodingParam.rid)) {
                throw new TypeError('Invalid RID value provided.');
              }
            }
            if ('scaleResolutionDownBy' in encodingParam) {
              if (!(parseFloat(encodingParam.scaleResolutionDownBy) >= 1.0)) {
                throw new RangeError('scale_resolution_down_by must be >= 1.0');
              }
            }
            if ('maxFramerate' in encodingParam) {
              if (!(parseFloat(encodingParam.maxFramerate) >= 0)) {
                throw new RangeError('max_framerate must be >= 0.0');
              }
            }
          });
        }
        const transceiver = origAddTransceiver.apply(this, arguments);
        if (shouldPerformCheck) {
          // Check if the init options were applied. If not we do this in an
          // asynchronous way and save the promise reference in a global object.
          // This is an ugly hack, but at the same time is way more robust than
          // checking the sender parameters before and after the createOffer
          // Also note that after the createoffer we are not 100% sure that
          // the params were asynchronously applied so we might miss the
          // opportunity to recreate offer.
          const {sender} = transceiver;
          const params = sender.getParameters();
          if (!('encodings' in params) ||
              // Avoid being fooled by patched getParameters() below.
              (params.encodings.length === 1 &&
               Object.keys(params.encodings[0]).length === 0)) {
            params.encodings = initParameters.sendEncodings;
            sender.sendEncodings = initParameters.sendEncodings;
            this.setParametersPromises.push(sender.setParameters(params)
              .then(() => {
                delete sender.sendEncodings;
              }).catch(() => {
                delete sender.sendEncodings;
              })
            );
          }
        }
        return transceiver;
      };
  }
}

function shimGetParameters(window) {
  if (!(typeof window === 'object' && window.RTCRtpSender)) {
    return;
  }
  const origGetParameters = window.RTCRtpSender.prototype.getParameters;
  if (origGetParameters) {
    window.RTCRtpSender.prototype.getParameters =
      function getParameters() {
        const params = origGetParameters.apply(this, arguments);
        if (!('encodings' in params)) {
          params.encodings = [].concat(this.sendEncodings || [{}]);
        }
        return params;
      };
  }
}

function shimCreateOffer(window) {
  // https://github.com/webrtcHacks/adapter/issues/998#issuecomment-516921647
  // Firefox ignores the init sendEncodings options passed to addTransceiver
  // https://bugzilla.mozilla.org/show_bug.cgi?id=1396918
  if (!(typeof window === 'object' && window.RTCPeerConnection)) {
    return;
  }
  const origCreateOffer = window.RTCPeerConnection.prototype.createOffer;
  window.RTCPeerConnection.prototype.createOffer = function createOffer() {
    if (this.setParametersPromises && this.setParametersPromises.length) {
      return Promise.all(this.setParametersPromises)
      .then(() => {
        return origCreateOffer.apply(this, arguments);
      })
      .finally(() => {
        this.setParametersPromises = [];
      });
    }
    return origCreateOffer.apply(this, arguments);
  };
}

function shimCreateAnswer(window) {
  // https://github.com/webrtcHacks/adapter/issues/998#issuecomment-516921647
  // Firefox ignores the init sendEncodings options passed to addTransceiver
  // https://bugzilla.mozilla.org/show_bug.cgi?id=1396918
  if (!(typeof window === 'object' && window.RTCPeerConnection)) {
    return;
  }
  const origCreateAnswer = window.RTCPeerConnection.prototype.createAnswer;
  window.RTCPeerConnection.prototype.createAnswer = function createAnswer() {
    if (this.setParametersPromises && this.setParametersPromises.length) {
      return Promise.all(this.setParametersPromises)
      .then(() => {
        return origCreateAnswer.apply(this, arguments);
      })
      .finally(() => {
        this.setParametersPromises = [];
      });
    }
    return origCreateAnswer.apply(this, arguments);
  };
}

;// CONCATENATED MODULE: ./node_modules/webrtc-adapter/src/js/safari/safari_shim.js
/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */



function shimLocalStreamsAPI(window) {
  if (typeof window !== 'object' || !window.RTCPeerConnection) {
    return;
  }
  if (!('getLocalStreams' in window.RTCPeerConnection.prototype)) {
    window.RTCPeerConnection.prototype.getLocalStreams =
      function getLocalStreams() {
        if (!this._localStreams) {
          this._localStreams = [];
        }
        return this._localStreams;
      };
  }
  if (!('addStream' in window.RTCPeerConnection.prototype)) {
    const _addTrack = window.RTCPeerConnection.prototype.addTrack;
    window.RTCPeerConnection.prototype.addStream = function addStream(stream) {
      if (!this._localStreams) {
        this._localStreams = [];
      }
      if (!this._localStreams.includes(stream)) {
        this._localStreams.push(stream);
      }
      // Try to emulate Chrome's behaviour of adding in audio-video order.
      // Safari orders by track id.
      stream.getAudioTracks().forEach(track => _addTrack.call(this, track,
        stream));
      stream.getVideoTracks().forEach(track => _addTrack.call(this, track,
        stream));
    };

    window.RTCPeerConnection.prototype.addTrack =
      function addTrack(track, ...streams) {
        if (streams) {
          streams.forEach((stream) => {
            if (!this._localStreams) {
              this._localStreams = [stream];
            } else if (!this._localStreams.includes(stream)) {
              this._localStreams.push(stream);
            }
          });
        }
        return _addTrack.apply(this, arguments);
      };
  }
  if (!('removeStream' in window.RTCPeerConnection.prototype)) {
    window.RTCPeerConnection.prototype.removeStream =
      function removeStream(stream) {
        if (!this._localStreams) {
          this._localStreams = [];
        }
        const index = this._localStreams.indexOf(stream);
        if (index === -1) {
          return;
        }
        this._localStreams.splice(index, 1);
        const tracks = stream.getTracks();
        this.getSenders().forEach(sender => {
          if (tracks.includes(sender.track)) {
            this.removeTrack(sender);
          }
        });
      };
  }
}

function shimRemoteStreamsAPI(window) {
  if (typeof window !== 'object' || !window.RTCPeerConnection) {
    return;
  }
  if (!('getRemoteStreams' in window.RTCPeerConnection.prototype)) {
    window.RTCPeerConnection.prototype.getRemoteStreams =
      function getRemoteStreams() {
        return this._remoteStreams ? this._remoteStreams : [];
      };
  }
  if (!('onaddstream' in window.RTCPeerConnection.prototype)) {
    Object.defineProperty(window.RTCPeerConnection.prototype, 'onaddstream', {
      get() {
        return this._onaddstream;
      },
      set(f) {
        if (this._onaddstream) {
          this.removeEventListener('addstream', this._onaddstream);
          this.removeEventListener('track', this._onaddstreampoly);
        }
        this.addEventListener('addstream', this._onaddstream = f);
        this.addEventListener('track', this._onaddstreampoly = (e) => {
          e.streams.forEach(stream => {
            if (!this._remoteStreams) {
              this._remoteStreams = [];
            }
            if (this._remoteStreams.includes(stream)) {
              return;
            }
            this._remoteStreams.push(stream);
            const event = new Event('addstream');
            event.stream = stream;
            this.dispatchEvent(event);
          });
        });
      }
    });
    const origSetRemoteDescription =
      window.RTCPeerConnection.prototype.setRemoteDescription;
    window.RTCPeerConnection.prototype.setRemoteDescription =
      function setRemoteDescription() {
        const pc = this;
        if (!this._onaddstreampoly) {
          this.addEventListener('track', this._onaddstreampoly = function(e) {
            e.streams.forEach(stream => {
              if (!pc._remoteStreams) {
                pc._remoteStreams = [];
              }
              if (pc._remoteStreams.indexOf(stream) >= 0) {
                return;
              }
              pc._remoteStreams.push(stream);
              const event = new Event('addstream');
              event.stream = stream;
              pc.dispatchEvent(event);
            });
          });
        }
        return origSetRemoteDescription.apply(pc, arguments);
      };
  }
}

function shimCallbacksAPI(window) {
  if (typeof window !== 'object' || !window.RTCPeerConnection) {
    return;
  }
  const prototype = window.RTCPeerConnection.prototype;
  const origCreateOffer = prototype.createOffer;
  const origCreateAnswer = prototype.createAnswer;
  const setLocalDescription = prototype.setLocalDescription;
  const setRemoteDescription = prototype.setRemoteDescription;
  const addIceCandidate = prototype.addIceCandidate;

  prototype.createOffer =
    function createOffer(successCallback, failureCallback) {
      const options = (arguments.length >= 2) ? arguments[2] : arguments[0];
      const promise = origCreateOffer.apply(this, [options]);
      if (!failureCallback) {
        return promise;
      }
      promise.then(successCallback, failureCallback);
      return Promise.resolve();
    };

  prototype.createAnswer =
    function createAnswer(successCallback, failureCallback) {
      const options = (arguments.length >= 2) ? arguments[2] : arguments[0];
      const promise = origCreateAnswer.apply(this, [options]);
      if (!failureCallback) {
        return promise;
      }
      promise.then(successCallback, failureCallback);
      return Promise.resolve();
    };

  let withCallback = function(description, successCallback, failureCallback) {
    const promise = setLocalDescription.apply(this, [description]);
    if (!failureCallback) {
      return promise;
    }
    promise.then(successCallback, failureCallback);
    return Promise.resolve();
  };
  prototype.setLocalDescription = withCallback;

  withCallback = function(description, successCallback, failureCallback) {
    const promise = setRemoteDescription.apply(this, [description]);
    if (!failureCallback) {
      return promise;
    }
    promise.then(successCallback, failureCallback);
    return Promise.resolve();
  };
  prototype.setRemoteDescription = withCallback;

  withCallback = function(candidate, successCallback, failureCallback) {
    const promise = addIceCandidate.apply(this, [candidate]);
    if (!failureCallback) {
      return promise;
    }
    promise.then(successCallback, failureCallback);
    return Promise.resolve();
  };
  prototype.addIceCandidate = withCallback;
}

function safari_shim_shimGetUserMedia(window) {
  const navigator = window && window.navigator;

  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    // shim not needed in Safari 12.1
    const mediaDevices = navigator.mediaDevices;
    const _getUserMedia = mediaDevices.getUserMedia.bind(mediaDevices);
    navigator.mediaDevices.getUserMedia = (constraints) => {
      return _getUserMedia(shimConstraints(constraints));
    };
  }

  if (!navigator.getUserMedia && navigator.mediaDevices &&
    navigator.mediaDevices.getUserMedia) {
    navigator.getUserMedia = function getUserMedia(constraints, cb, errcb) {
      navigator.mediaDevices.getUserMedia(constraints)
      .then(cb, errcb);
    }.bind(navigator);
  }
}

function shimConstraints(constraints) {
  if (constraints && constraints.video !== undefined) {
    return Object.assign({},
      constraints,
      {video: compactObject(constraints.video)}
    );
  }

  return constraints;
}

function shimRTCIceServerUrls(window) {
  if (!window.RTCPeerConnection) {
    return;
  }
  // migrate from non-spec RTCIceServer.url to RTCIceServer.urls
  const OrigPeerConnection = window.RTCPeerConnection;
  window.RTCPeerConnection =
    function RTCPeerConnection(pcConfig, pcConstraints) {
      if (pcConfig && pcConfig.iceServers) {
        const newIceServers = [];
        for (let i = 0; i < pcConfig.iceServers.length; i++) {
          let server = pcConfig.iceServers[i];
          if (!server.hasOwnProperty('urls') &&
              server.hasOwnProperty('url')) {
            deprecated('RTCIceServer.url', 'RTCIceServer.urls');
            server = JSON.parse(JSON.stringify(server));
            server.urls = server.url;
            delete server.url;
            newIceServers.push(server);
          } else {
            newIceServers.push(pcConfig.iceServers[i]);
          }
        }
        pcConfig.iceServers = newIceServers;
      }
      return new OrigPeerConnection(pcConfig, pcConstraints);
    };
  window.RTCPeerConnection.prototype = OrigPeerConnection.prototype;
  // wrap static methods. Currently just generateCertificate.
  if ('generateCertificate' in OrigPeerConnection) {
    Object.defineProperty(window.RTCPeerConnection, 'generateCertificate', {
      get() {
        return OrigPeerConnection.generateCertificate;
      }
    });
  }
}

function shimTrackEventTransceiver(window) {
  // Add event.transceiver member over deprecated event.receiver
  if (typeof window === 'object' && window.RTCTrackEvent &&
      'receiver' in window.RTCTrackEvent.prototype &&
      !('transceiver' in window.RTCTrackEvent.prototype)) {
    Object.defineProperty(window.RTCTrackEvent.prototype, 'transceiver', {
      get() {
        return {receiver: this.receiver};
      }
    });
  }
}

function shimCreateOfferLegacy(window) {
  const origCreateOffer = window.RTCPeerConnection.prototype.createOffer;
  window.RTCPeerConnection.prototype.createOffer =
    function createOffer(offerOptions) {
      if (offerOptions) {
        if (typeof offerOptions.offerToReceiveAudio !== 'undefined') {
          // support bit values
          offerOptions.offerToReceiveAudio =
            !!offerOptions.offerToReceiveAudio;
        }
        const audioTransceiver = this.getTransceivers().find(transceiver =>
          transceiver.receiver.track.kind === 'audio');
        if (offerOptions.offerToReceiveAudio === false && audioTransceiver) {
          if (audioTransceiver.direction === 'sendrecv') {
            if (audioTransceiver.setDirection) {
              audioTransceiver.setDirection('sendonly');
            } else {
              audioTransceiver.direction = 'sendonly';
            }
          } else if (audioTransceiver.direction === 'recvonly') {
            if (audioTransceiver.setDirection) {
              audioTransceiver.setDirection('inactive');
            } else {
              audioTransceiver.direction = 'inactive';
            }
          }
        } else if (offerOptions.offerToReceiveAudio === true &&
            !audioTransceiver) {
          this.addTransceiver('audio', {direction: 'recvonly'});
        }

        if (typeof offerOptions.offerToReceiveVideo !== 'undefined') {
          // support bit values
          offerOptions.offerToReceiveVideo =
            !!offerOptions.offerToReceiveVideo;
        }
        const videoTransceiver = this.getTransceivers().find(transceiver =>
          transceiver.receiver.track.kind === 'video');
        if (offerOptions.offerToReceiveVideo === false && videoTransceiver) {
          if (videoTransceiver.direction === 'sendrecv') {
            if (videoTransceiver.setDirection) {
              videoTransceiver.setDirection('sendonly');
            } else {
              videoTransceiver.direction = 'sendonly';
            }
          } else if (videoTransceiver.direction === 'recvonly') {
            if (videoTransceiver.setDirection) {
              videoTransceiver.setDirection('inactive');
            } else {
              videoTransceiver.direction = 'inactive';
            }
          }
        } else if (offerOptions.offerToReceiveVideo === true &&
            !videoTransceiver) {
          this.addTransceiver('video', {direction: 'recvonly'});
        }
      }
      return origCreateOffer.apply(this, arguments);
    };
}

function shimAudioContext(window) {
  if (typeof window !== 'object' || window.AudioContext) {
    return;
  }
  window.AudioContext = window.webkitAudioContext;
}


// EXTERNAL MODULE: ./node_modules/sdp/sdp.js
var sdp = __webpack_require__(7539);
var sdp_default = /*#__PURE__*/__webpack_require__.n(sdp);
;// CONCATENATED MODULE: ./node_modules/webrtc-adapter/src/js/common_shim.js
/*
 *  Copyright (c) 2017 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
/* eslint-env node */





function shimRTCIceCandidate(window) {
  // foundation is arbitrarily chosen as an indicator for full support for
  // https://w3c.github.io/webrtc-pc/#rtcicecandidate-interface
  if (!window.RTCIceCandidate || (window.RTCIceCandidate && 'foundation' in
      window.RTCIceCandidate.prototype)) {
    return;
  }

  const NativeRTCIceCandidate = window.RTCIceCandidate;
  window.RTCIceCandidate = function RTCIceCandidate(args) {
    // Remove the a= which shouldn't be part of the candidate string.
    if (typeof args === 'object' && args.candidate &&
        args.candidate.indexOf('a=') === 0) {
      args = JSON.parse(JSON.stringify(args));
      args.candidate = args.candidate.substr(2);
    }

    if (args.candidate && args.candidate.length) {
      // Augment the native candidate with the parsed fields.
      const nativeCandidate = new NativeRTCIceCandidate(args);
      const parsedCandidate = sdp_default().parseCandidate(args.candidate);
      const augmentedCandidate = Object.assign(nativeCandidate,
          parsedCandidate);

      // Add a serializer that does not serialize the extra attributes.
      augmentedCandidate.toJSON = function toJSON() {
        return {
          candidate: augmentedCandidate.candidate,
          sdpMid: augmentedCandidate.sdpMid,
          sdpMLineIndex: augmentedCandidate.sdpMLineIndex,
          usernameFragment: augmentedCandidate.usernameFragment,
        };
      };
      return augmentedCandidate;
    }
    return new NativeRTCIceCandidate(args);
  };
  window.RTCIceCandidate.prototype = NativeRTCIceCandidate.prototype;

  // Hook up the augmented candidate in onicecandidate and
  // addEventListener('icecandidate', ...)
  wrapPeerConnectionEvent(window, 'icecandidate', e => {
    if (e.candidate) {
      Object.defineProperty(e, 'candidate', {
        value: new window.RTCIceCandidate(e.candidate),
        writable: 'false'
      });
    }
    return e;
  });
}

function shimMaxMessageSize(window, browserDetails) {
  if (!window.RTCPeerConnection) {
    return;
  }

  if (!('sctp' in window.RTCPeerConnection.prototype)) {
    Object.defineProperty(window.RTCPeerConnection.prototype, 'sctp', {
      get() {
        return typeof this._sctp === 'undefined' ? null : this._sctp;
      }
    });
  }

  const sctpInDescription = function(description) {
    if (!description || !description.sdp) {
      return false;
    }
    const sections = sdp_default().splitSections(description.sdp);
    sections.shift();
    return sections.some(mediaSection => {
      const mLine = sdp_default().parseMLine(mediaSection);
      return mLine && mLine.kind === 'application'
          && mLine.protocol.indexOf('SCTP') !== -1;
    });
  };

  const getRemoteFirefoxVersion = function(description) {
    // TODO: Is there a better solution for detecting Firefox?
    const match = description.sdp.match(/mozilla...THIS_IS_SDPARTA-(\d+)/);
    if (match === null || match.length < 2) {
      return -1;
    }
    const version = parseInt(match[1], 10);
    // Test for NaN (yes, this is ugly)
    return version !== version ? -1 : version;
  };

  const getCanSendMaxMessageSize = function(remoteIsFirefox) {
    // Every implementation we know can send at least 64 KiB.
    // Note: Although Chrome is technically able to send up to 256 KiB, the
    //       data does not reach the other peer reliably.
    //       See: https://bugs.chromium.org/p/webrtc/issues/detail?id=8419
    let canSendMaxMessageSize = 65536;
    if (browserDetails.browser === 'firefox') {
      if (browserDetails.version < 57) {
        if (remoteIsFirefox === -1) {
          // FF < 57 will send in 16 KiB chunks using the deprecated PPID
          // fragmentation.
          canSendMaxMessageSize = 16384;
        } else {
          // However, other FF (and RAWRTC) can reassemble PPID-fragmented
          // messages. Thus, supporting ~2 GiB when sending.
          canSendMaxMessageSize = 2147483637;
        }
      } else if (browserDetails.version < 60) {
        // Currently, all FF >= 57 will reset the remote maximum message size
        // to the default value when a data channel is created at a later
        // stage. :(
        // See: https://bugzilla.mozilla.org/show_bug.cgi?id=1426831
        canSendMaxMessageSize =
          browserDetails.version === 57 ? 65535 : 65536;
      } else {
        // FF >= 60 supports sending ~2 GiB
        canSendMaxMessageSize = 2147483637;
      }
    }
    return canSendMaxMessageSize;
  };

  const getMaxMessageSize = function(description, remoteIsFirefox) {
    // Note: 65536 bytes is the default value from the SDP spec. Also,
    //       every implementation we know supports receiving 65536 bytes.
    let maxMessageSize = 65536;

    // FF 57 has a slightly incorrect default remote max message size, so
    // we need to adjust it here to avoid a failure when sending.
    // See: https://bugzilla.mozilla.org/show_bug.cgi?id=1425697
    if (browserDetails.browser === 'firefox'
         && browserDetails.version === 57) {
      maxMessageSize = 65535;
    }

    const match = sdp_default().matchPrefix(description.sdp,
      'a=max-message-size:');
    if (match.length > 0) {
      maxMessageSize = parseInt(match[0].substr(19), 10);
    } else if (browserDetails.browser === 'firefox' &&
                remoteIsFirefox !== -1) {
      // If the maximum message size is not present in the remote SDP and
      // both local and remote are Firefox, the remote peer can receive
      // ~2 GiB.
      maxMessageSize = 2147483637;
    }
    return maxMessageSize;
  };

  const origSetRemoteDescription =
      window.RTCPeerConnection.prototype.setRemoteDescription;
  window.RTCPeerConnection.prototype.setRemoteDescription =
    function setRemoteDescription() {
      this._sctp = null;
      // Chrome decided to not expose .sctp in plan-b mode.
      // As usual, adapter.js has to do an 'ugly worakaround'
      // to cover up the mess.
      if (browserDetails.browser === 'chrome' && browserDetails.version >= 76) {
        const {sdpSemantics} = this.getConfiguration();
        if (sdpSemantics === 'plan-b') {
          Object.defineProperty(this, 'sctp', {
            get() {
              return typeof this._sctp === 'undefined' ? null : this._sctp;
            },
            enumerable: true,
            configurable: true,
          });
        }
      }

      if (sctpInDescription(arguments[0])) {
        // Check if the remote is FF.
        const isFirefox = getRemoteFirefoxVersion(arguments[0]);

        // Get the maximum message size the local peer is capable of sending
        const canSendMMS = getCanSendMaxMessageSize(isFirefox);

        // Get the maximum message size of the remote peer.
        const remoteMMS = getMaxMessageSize(arguments[0], isFirefox);

        // Determine final maximum message size
        let maxMessageSize;
        if (canSendMMS === 0 && remoteMMS === 0) {
          maxMessageSize = Number.POSITIVE_INFINITY;
        } else if (canSendMMS === 0 || remoteMMS === 0) {
          maxMessageSize = Math.max(canSendMMS, remoteMMS);
        } else {
          maxMessageSize = Math.min(canSendMMS, remoteMMS);
        }

        // Create a dummy RTCSctpTransport object and the 'maxMessageSize'
        // attribute.
        const sctp = {};
        Object.defineProperty(sctp, 'maxMessageSize', {
          get() {
            return maxMessageSize;
          }
        });
        this._sctp = sctp;
      }

      return origSetRemoteDescription.apply(this, arguments);
    };
}

function shimSendThrowTypeError(window) {
  if (!(window.RTCPeerConnection &&
      'createDataChannel' in window.RTCPeerConnection.prototype)) {
    return;
  }

  // Note: Although Firefox >= 57 has a native implementation, the maximum
  //       message size can be reset for all data channels at a later stage.
  //       See: https://bugzilla.mozilla.org/show_bug.cgi?id=1426831

  function wrapDcSend(dc, pc) {
    const origDataChannelSend = dc.send;
    dc.send = function send() {
      const data = arguments[0];
      const length = data.length || data.size || data.byteLength;
      if (dc.readyState === 'open' &&
          pc.sctp && length > pc.sctp.maxMessageSize) {
        throw new TypeError('Message too large (can send a maximum of ' +
          pc.sctp.maxMessageSize + ' bytes)');
      }
      return origDataChannelSend.apply(dc, arguments);
    };
  }
  const origCreateDataChannel =
    window.RTCPeerConnection.prototype.createDataChannel;
  window.RTCPeerConnection.prototype.createDataChannel =
    function createDataChannel() {
      const dataChannel = origCreateDataChannel.apply(this, arguments);
      wrapDcSend(dataChannel, this);
      return dataChannel;
    };
  wrapPeerConnectionEvent(window, 'datachannel', e => {
    wrapDcSend(e.channel, e.target);
    return e;
  });
}


/* shims RTCConnectionState by pretending it is the same as iceConnectionState.
 * See https://bugs.chromium.org/p/webrtc/issues/detail?id=6145#c12
 * for why this is a valid hack in Chrome. In Firefox it is slightly incorrect
 * since DTLS failures would be hidden. See
 * https://bugzilla.mozilla.org/show_bug.cgi?id=1265827
 * for the Firefox tracking bug.
 */
function shimConnectionState(window) {
  if (!window.RTCPeerConnection ||
      'connectionState' in window.RTCPeerConnection.prototype) {
    return;
  }
  const proto = window.RTCPeerConnection.prototype;
  Object.defineProperty(proto, 'connectionState', {
    get() {
      return {
        completed: 'connected',
        checking: 'connecting'
      }[this.iceConnectionState] || this.iceConnectionState;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(proto, 'onconnectionstatechange', {
    get() {
      return this._onconnectionstatechange || null;
    },
    set(cb) {
      if (this._onconnectionstatechange) {
        this.removeEventListener('connectionstatechange',
            this._onconnectionstatechange);
        delete this._onconnectionstatechange;
      }
      if (cb) {
        this.addEventListener('connectionstatechange',
            this._onconnectionstatechange = cb);
      }
    },
    enumerable: true,
    configurable: true
  });

  ['setLocalDescription', 'setRemoteDescription'].forEach((method) => {
    const origMethod = proto[method];
    proto[method] = function() {
      if (!this._connectionstatechangepoly) {
        this._connectionstatechangepoly = e => {
          const pc = e.target;
          if (pc._lastConnectionState !== pc.connectionState) {
            pc._lastConnectionState = pc.connectionState;
            const newEvent = new Event('connectionstatechange', e);
            pc.dispatchEvent(newEvent);
          }
          return e;
        };
        this.addEventListener('iceconnectionstatechange',
          this._connectionstatechangepoly);
      }
      return origMethod.apply(this, arguments);
    };
  });
}

function removeExtmapAllowMixed(window, browserDetails) {
  /* remove a=extmap-allow-mixed for webrtc.org < M71 */
  if (!window.RTCPeerConnection) {
    return;
  }
  if (browserDetails.browser === 'chrome' && browserDetails.version >= 71) {
    return;
  }
  if (browserDetails.browser === 'safari' && browserDetails.version >= 605) {
    return;
  }
  const nativeSRD = window.RTCPeerConnection.prototype.setRemoteDescription;
  window.RTCPeerConnection.prototype.setRemoteDescription =
  function setRemoteDescription(desc) {
    if (desc && desc.sdp && desc.sdp.indexOf('\na=extmap-allow-mixed') !== -1) {
      const sdp = desc.sdp.split('\n').filter((line) => {
        return line.trim() !== 'a=extmap-allow-mixed';
      }).join('\n');
      // Safari enforces read-only-ness of RTCSessionDescription fields.
      if (window.RTCSessionDescription &&
          desc instanceof window.RTCSessionDescription) {
        arguments[0] = new window.RTCSessionDescription({
          type: desc.type,
          sdp,
        });
      } else {
        desc.sdp = sdp;
      }
    }
    return nativeSRD.apply(this, arguments);
  };
}

function shimAddIceCandidateNullOrEmpty(window, browserDetails) {
  // Support for addIceCandidate(null or undefined)
  // as well as addIceCandidate({candidate: "", ...})
  // https://bugs.chromium.org/p/chromium/issues/detail?id=978582
  // Note: must be called before other polyfills which change the signature.
  if (!(window.RTCPeerConnection && window.RTCPeerConnection.prototype)) {
    return;
  }
  const nativeAddIceCandidate =
      window.RTCPeerConnection.prototype.addIceCandidate;
  if (!nativeAddIceCandidate || nativeAddIceCandidate.length === 0) {
    return;
  }
  window.RTCPeerConnection.prototype.addIceCandidate =
    function addIceCandidate() {
      if (!arguments[0]) {
        if (arguments[1]) {
          arguments[1].apply(null);
        }
        return Promise.resolve();
      }
      // Firefox 68+ emits and processes {candidate: "", ...}, ignore
      // in older versions.
      // Native support for ignoring exists for Chrome M77+.
      // Safari ignores as well, exact version unknown but works in the same
      // version that also ignores addIceCandidate(null).
      if (((browserDetails.browser === 'chrome' && browserDetails.version < 78)
           || (browserDetails.browser === 'firefox'
               && browserDetails.version < 68)
           || (browserDetails.browser === 'safari'))
          && arguments[0] && arguments[0].candidate === '') {
        return Promise.resolve();
      }
      return nativeAddIceCandidate.apply(this, arguments);
    };
}

// Note: Make sure to call this ahead of APIs that modify
// setLocalDescription.length
function shimParameterlessSetLocalDescription(window, browserDetails) {
  if (!(window.RTCPeerConnection && window.RTCPeerConnection.prototype)) {
    return;
  }
  const nativeSetLocalDescription =
      window.RTCPeerConnection.prototype.setLocalDescription;
  if (!nativeSetLocalDescription || nativeSetLocalDescription.length === 0) {
    return;
  }
  window.RTCPeerConnection.prototype.setLocalDescription =
    function setLocalDescription() {
      let desc = arguments[0] || {};
      if (typeof desc !== 'object' || (desc.type && desc.sdp)) {
        return nativeSetLocalDescription.apply(this, arguments);
      }
      // The remaining steps should technically happen when SLD comes off the
      // RTCPeerConnection's operations chain (not ahead of going on it), but
      // this is too difficult to shim. Instead, this shim only covers the
      // common case where the operations chain is empty. This is imperfect, but
      // should cover many cases. Rationale: Even if we can't reduce the glare
      // window to zero on imperfect implementations, there's value in tapping
      // into the perfect negotiation pattern that several browsers support.
      desc = {type: desc.type, sdp: desc.sdp};
      if (!desc.type) {
        switch (this.signalingState) {
          case 'stable':
          case 'have-local-offer':
          case 'have-remote-pranswer':
            desc.type = 'offer';
            break;
          default:
            desc.type = 'answer';
            break;
        }
      }
      if (desc.sdp || (desc.type !== 'offer' && desc.type !== 'answer')) {
        return nativeSetLocalDescription.apply(this, [desc]);
      }
      const func = desc.type === 'offer' ? this.createOffer : this.createAnswer;
      return func.apply(this)
        .then(d => nativeSetLocalDescription.apply(this, [d]));
    };
}

;// CONCATENATED MODULE: ./node_modules/webrtc-adapter/src/js/adapter_factory.js
/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */


  // Browser shims.






// Shimming starts here.
function adapterFactory({window} = {}, options = {
  shimChrome: true,
  shimFirefox: true,
  shimSafari: true,
}) {
  // Utils.
  const logging = log;
  const browserDetails = detectBrowser(window);

  const adapter = {
    browserDetails,
    commonShim: common_shim_namespaceObject,
    extractVersion: extractVersion,
    disableLog: disableLog,
    disableWarnings: disableWarnings,
    // Expose sdp as a convenience. For production apps include directly.
    sdp: sdp,
  };

  // Shim browser if found.
  switch (browserDetails.browser) {
    case 'chrome':
      if (!chrome_shim_namespaceObject || !shimPeerConnection ||
          !options.shimChrome) {
        logging('Chrome shim is not included in this adapter release.');
        return adapter;
      }
      if (browserDetails.version === null) {
        logging('Chrome shim can not determine version, not shimming.');
        return adapter;
      }
      logging('adapter.js shimming chrome.');
      // Export to the adapter global object visible in the browser.
      adapter.browserShim = chrome_shim_namespaceObject;

      // Must be called before shimPeerConnection.
      shimAddIceCandidateNullOrEmpty(window, browserDetails);
      shimParameterlessSetLocalDescription(window, browserDetails);

      shimGetUserMedia(window, browserDetails);
      shimMediaStream(window, browserDetails);
      shimPeerConnection(window, browserDetails);
      shimOnTrack(window, browserDetails);
      shimAddTrackRemoveTrack(window, browserDetails);
      shimGetSendersWithDtmf(window, browserDetails);
      shimGetStats(window, browserDetails);
      shimSenderReceiverGetStats(window, browserDetails);
      fixNegotiationNeeded(window, browserDetails);

      shimRTCIceCandidate(window, browserDetails);
      shimConnectionState(window, browserDetails);
      shimMaxMessageSize(window, browserDetails);
      shimSendThrowTypeError(window, browserDetails);
      removeExtmapAllowMixed(window, browserDetails);
      break;
    case 'firefox':
      if (!firefox_shim_namespaceObject || !firefox_shim_shimPeerConnection ||
          !options.shimFirefox) {
        logging('Firefox shim is not included in this adapter release.');
        return adapter;
      }
      logging('adapter.js shimming firefox.');
      // Export to the adapter global object visible in the browser.
      adapter.browserShim = firefox_shim_namespaceObject;

      // Must be called before shimPeerConnection.
      shimAddIceCandidateNullOrEmpty(window, browserDetails);
      shimParameterlessSetLocalDescription(window, browserDetails);

      getusermedia_shimGetUserMedia(window, browserDetails);
      firefox_shim_shimPeerConnection(window, browserDetails);
      firefox_shim_shimOnTrack(window, browserDetails);
      shimRemoveStream(window, browserDetails);
      shimSenderGetStats(window, browserDetails);
      shimReceiverGetStats(window, browserDetails);
      shimRTCDataChannel(window, browserDetails);
      shimAddTransceiver(window, browserDetails);
      shimGetParameters(window, browserDetails);
      shimCreateOffer(window, browserDetails);
      shimCreateAnswer(window, browserDetails);

      shimRTCIceCandidate(window, browserDetails);
      shimConnectionState(window, browserDetails);
      shimMaxMessageSize(window, browserDetails);
      shimSendThrowTypeError(window, browserDetails);
      break;
    case 'safari':
      if (!safari_shim_namespaceObject || !options.shimSafari) {
        logging('Safari shim is not included in this adapter release.');
        return adapter;
      }
      logging('adapter.js shimming safari.');
      // Export to the adapter global object visible in the browser.
      adapter.browserShim = safari_shim_namespaceObject;

      // Must be called before shimCallbackAPI.
      shimAddIceCandidateNullOrEmpty(window, browserDetails);
      shimParameterlessSetLocalDescription(window, browserDetails);

      shimRTCIceServerUrls(window, browserDetails);
      shimCreateOfferLegacy(window, browserDetails);
      shimCallbacksAPI(window, browserDetails);
      shimLocalStreamsAPI(window, browserDetails);
      shimRemoteStreamsAPI(window, browserDetails);
      shimTrackEventTransceiver(window, browserDetails);
      safari_shim_shimGetUserMedia(window, browserDetails);
      shimAudioContext(window, browserDetails);

      shimRTCIceCandidate(window, browserDetails);
      shimMaxMessageSize(window, browserDetails);
      shimSendThrowTypeError(window, browserDetails);
      removeExtmapAllowMixed(window, browserDetails);
      break;
    default:
      logging('Unsupported browser!');
      break;
  }

  return adapter;
}

;// CONCATENATED MODULE: ./node_modules/webrtc-adapter/src/js/adapter_core.js
/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
/* eslint-env node */





const adapter =
  adapterFactory({window: typeof window === 'undefined' ? undefined : window});
/* harmony default export */ var adapter_core = (adapter);


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	!function() {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = function(result, chunkIds, fn, priority) {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var chunkIds = deferred[i][0];
/******/ 				var fn = deferred[i][1];
/******/ 				var priority = deferred[i][2];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every(function(key) { return __webpack_require__.O[key](chunkIds[j]); })) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	!function() {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = function(module) {
/******/ 			var getter = module && module.__esModule ?
/******/ 				function() { return module['default']; } :
/******/ 				function() { return module; };
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	!function() {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	!function() {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			588: 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = function(chunkId) { return installedChunks[chunkId] === 0; };
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = function(parentChunkLoadingFunction, data) {
/******/ 			var chunkIds = data[0];
/******/ 			var moreModules = data[1];
/******/ 			var runtime = data[2];
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some(function(id) { return installedChunks[id] !== 0; })) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = this["webpackChunk_name_"] = this["webpackChunk_name_"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	}();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(8219);
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	window.livekit = __webpack_exports__;
/******/ 	
/******/ })()
;