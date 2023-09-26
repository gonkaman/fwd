(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // ../pipe/js/lib/index.js
  var require_lib = __commonJS({
    "../pipe/js/lib/index.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.resolve = exports.pipeAsync = exports.pipe = void 0;
      var pipeEnd = (arg) => arg;
      var pipe2 = (init) => {
        if (init === pipeEnd)
          return init;
        return (entry) => entry === pipeEnd ? init : (0, exports.pipe)((arg) => entry(init(arg)));
      };
      exports.pipe = pipe2;
      var pipeAsync = (init) => {
        if (init === pipeEnd)
          return init;
        return (entry, onRejected) => entry === pipeEnd ? init : (0, exports.pipeAsync)((arg) => Promise.resolve(init(arg)).then((value) => entry(value), onRejected));
      };
      exports.pipeAsync = pipeAsync;
      var resolve2 = (builder) => builder(pipeEnd);
      exports.resolve = resolve2;
    }
  });

  // index.ts
  var import_fwd_pipe = __toESM(require_lib());
  function add1(n) {
    const res = n + 1;
    console.log("called add1 with " + n + " ==> " + res);
    return res;
  }
  function add3(n) {
    const res = n + 3;
    console.log("called add3 with " + n + " ==> " + res);
    return res;
  }
  function mult5(n) {
    const res = n * 5;
    console.log("called mult5 with " + n + " ==> " + res);
    return res;
  }
  function minus11(n) {
    const res = n - 11;
    console.log("called minus11 with " + n + " ==> " + res);
    return res;
  }
  var process = (0, import_fwd_pipe.resolve)((0, import_fwd_pipe.pipe)(add1)(add3)(mult5)(minus11)(console.log));
  console.log("\nProcess for 2:");
  process(2);
  console.log("\nProcess for 10:");
  process(10);
  console.log("\nProcess for 7:");
  process(7);
})();
