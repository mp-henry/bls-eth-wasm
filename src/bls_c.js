
var Module = (() => {
  var _scriptDir = typeof document !== 'undefined' && document.currentScript ? document.currentScript.src : undefined;
  if (typeof __filename !== 'undefined') _scriptDir ||= __filename;
  return (
function(moduleArg = {}) {

var Module = moduleArg;

var readyPromiseResolve, readyPromiseReject;

Module["ready"] = new Promise((resolve, reject) => {
 readyPromiseResolve = resolve;
 readyPromiseReject = reject;
});

var moduleOverrides = Object.assign({}, Module);

var arguments_ = [];

var thisProgram = "./this.program";

var quit_ = (status, toThrow) => {
 throw toThrow;
};

var ENVIRONMENT_IS_WEB = typeof window == "object";

var ENVIRONMENT_IS_WORKER = typeof importScripts == "function";

var ENVIRONMENT_IS_NODE = typeof process == "object" && typeof process.versions == "object" && typeof process.versions.node == "string";

var scriptDirectory = "";

function locateFile(path) {
 if (Module["locateFile"]) {
  return Module["locateFile"](path, scriptDirectory);
 }
 return scriptDirectory + path;
}

var read_, readAsync, readBinary;

if (ENVIRONMENT_IS_NODE) {
// var fs = require("fs");
// var nodePath = require("path");
 if (ENVIRONMENT_IS_WORKER) {
  scriptDirectory = nodePath.dirname(scriptDirectory) + "/";
 } else {
  scriptDirectory = __dirname + "/";
 }
 read_ = (filename, binary) => {
  filename = isFileURI(filename) ? new URL(filename) : nodePath.normalize(filename);
  return fs.readFileSync(filename, binary ? undefined : "utf8");
 };
 readBinary = filename => {
  var ret = read_(filename, true);
  if (!ret.buffer) {
   ret = new Uint8Array(ret);
  }
  return ret;
 };
 readAsync = (filename, onload, onerror, binary = true) => {
  filename = isFileURI(filename) ? new URL(filename) : nodePath.normalize(filename);
  fs.readFile(filename, binary ? undefined : "utf8", (err, data) => {
   if (err) onerror(err); else onload(binary ? data.buffer : data);
  });
 };
 if (!Module["thisProgram"] && process.argv.length > 1) {
  thisProgram = process.argv[1].replace(/\\/g, "/");
 }
 arguments_ = process.argv.slice(2);
 quit_ = (status, toThrow) => {
  process.exitCode = status;
  throw toThrow;
 };
} else if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
 if (ENVIRONMENT_IS_WORKER) {
  scriptDirectory = self.location.href;
 } else if (typeof document != "undefined" && document.currentScript) {
  scriptDirectory = document.currentScript.src;
 }
 if (_scriptDir) {
  scriptDirectory = _scriptDir;
 }
 if (scriptDirectory.startsWith("blob:")) {
  scriptDirectory = "";
 } else {
  scriptDirectory = scriptDirectory.substr(0, scriptDirectory.replace(/[?#].*/, "").lastIndexOf("/") + 1);
 }
 {
  read_ = url => {
   var xhr = new XMLHttpRequest;
   xhr.open("GET", url, false);
   xhr.send(null);
   return xhr.responseText;
  };
  if (ENVIRONMENT_IS_WORKER) {
   readBinary = url => {
    var xhr = new XMLHttpRequest;
    xhr.open("GET", url, false);
    xhr.responseType = "arraybuffer";
    xhr.send(null);
    return new Uint8Array(/** @type{!ArrayBuffer} */ (xhr.response));
   };
  }
  readAsync = (url, onload, onerror) => {
   var xhr = new XMLHttpRequest;
   xhr.open("GET", url, true);
   xhr.responseType = "arraybuffer";
   xhr.onload = () => {
    if (xhr.status == 200 || (xhr.status == 0 && xhr.response)) {
     onload(xhr.response);
     return;
    }
    onerror();
   };
   xhr.onerror = onerror;
   xhr.send(null);
  };
 }
} else {}

var out = Module["print"] || console.log.bind(console);

var err = Module["printErr"] || console.error.bind(console);

Object.assign(Module, moduleOverrides);

moduleOverrides = null;

if (Module["arguments"]) arguments_ = Module["arguments"];

if (Module["thisProgram"]) thisProgram = Module["thisProgram"];

if (Module["quit"]) quit_ = Module["quit"];

var wasmBinary;

if (Module["wasmBinary"]) wasmBinary = Module["wasmBinary"];

var wasmMemory;

var ABORT = false;

var EXITSTATUS;

var /** @type {!Int8Array} */ HEAP8, /** @type {!Uint8Array} */ HEAPU8, /** @type {!Int16Array} */ HEAP16, /** @type {!Uint16Array} */ HEAPU16, /** @type {!Int32Array} */ HEAP32, /** @type {!Uint32Array} */ HEAPU32, /** @type {!Float32Array} */ HEAPF32, /** @type {!Float64Array} */ HEAPF64;

function updateMemoryViews() {
 var b = wasmMemory.buffer;
 Module["HEAP8"] = HEAP8 = new Int8Array(b);
 Module["HEAP16"] = HEAP16 = new Int16Array(b);
 Module["HEAPU8"] = HEAPU8 = new Uint8Array(b);
 Module["HEAPU16"] = HEAPU16 = new Uint16Array(b);
 Module["HEAP32"] = HEAP32 = new Int32Array(b);
 Module["HEAPU32"] = HEAPU32 = new Uint32Array(b);
 Module["HEAPF32"] = HEAPF32 = new Float32Array(b);
 Module["HEAPF64"] = HEAPF64 = new Float64Array(b);
}

var __ATPRERUN__ = [];

var __ATINIT__ = [];

var __ATPOSTRUN__ = [];

var runtimeInitialized = false;

function preRun() {
 if (Module["preRun"]) {
  if (typeof Module["preRun"] == "function") Module["preRun"] = [ Module["preRun"] ];
  while (Module["preRun"].length) {
   addOnPreRun(Module["preRun"].shift());
  }
 }
 callRuntimeCallbacks(__ATPRERUN__);
}

function initRuntime() {
 runtimeInitialized = true;
 callRuntimeCallbacks(__ATINIT__);
}

function postRun() {
 if (Module["postRun"]) {
  if (typeof Module["postRun"] == "function") Module["postRun"] = [ Module["postRun"] ];
  while (Module["postRun"].length) {
   addOnPostRun(Module["postRun"].shift());
  }
 }
 callRuntimeCallbacks(__ATPOSTRUN__);
}

function addOnPreRun(cb) {
 __ATPRERUN__.unshift(cb);
}

function addOnInit(cb) {
 __ATINIT__.unshift(cb);
}

function addOnPostRun(cb) {
 __ATPOSTRUN__.unshift(cb);
}

var runDependencies = 0;

var runDependencyWatcher = null;

var dependenciesFulfilled = null;

function addRunDependency(id) {
 runDependencies++;
 Module["monitorRunDependencies"]?.(runDependencies);
}

function removeRunDependency(id) {
 runDependencies--;
 Module["monitorRunDependencies"]?.(runDependencies);
 if (runDependencies == 0) {
  if (runDependencyWatcher !== null) {
   clearInterval(runDependencyWatcher);
   runDependencyWatcher = null;
  }
  if (dependenciesFulfilled) {
   var callback = dependenciesFulfilled;
   dependenciesFulfilled = null;
   callback();
  }
 }
}

/** @param {string|number=} what */ function abort(what) {
 Module["onAbort"]?.(what);
 what = "Aborted(" + what + ")";
 err(what);
 ABORT = true;
 EXITSTATUS = 1;
 what += ". Build with -sASSERTIONS for more info.";
 /** @suppress {checkTypes} */ var e = new WebAssembly.RuntimeError(what);
 readyPromiseReject(e);
 throw e;
}

var dataURIPrefix = "data:application/octet-stream;base64,";

/**
 * Indicates whether filename is a base64 data URI.
 * @noinline
 */ var isDataURI = filename => filename.startsWith(dataURIPrefix);

/**
 * Indicates whether filename is delivered via file protocol (as opposed to http/https)
 * @noinline
 */ var isFileURI = filename => filename.startsWith("file://");

var wasmBinaryFile;

wasmBinaryFile = "bls_c.wasm";

if (!isDataURI(wasmBinaryFile)) {
 wasmBinaryFile = locateFile(wasmBinaryFile);
}

function getBinarySync(file) {
 if (file == wasmBinaryFile && wasmBinary) {
  return new Uint8Array(wasmBinary);
 }
 if (readBinary) {
  return readBinary(file);
 }
 throw "both async and sync fetching of the wasm failed";
}

function getBinaryPromise(binaryFile) {
 if (!wasmBinary && (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER)) {
  if (typeof fetch == "function" && !isFileURI(binaryFile)) {
   return fetch(binaryFile, {
    credentials: "same-origin"
   }).then(response => {
    if (!response["ok"]) {
     throw `failed to load wasm binary file at '${binaryFile}'`;
    }
    return response["arrayBuffer"]();
   }).catch(() => getBinarySync(binaryFile));
  } else if (readAsync) {
   return new Promise((resolve, reject) => {
    readAsync(binaryFile, response => resolve(new Uint8Array(/** @type{!ArrayBuffer} */ (response))), reject);
   });
  }
 }
 return Promise.resolve().then(() => getBinarySync(binaryFile));
}

function instantiateArrayBuffer(binaryFile, imports, receiver) {
 return getBinaryPromise(binaryFile).then(binary => WebAssembly.instantiate(binary, imports)).then(receiver, reason => {
  err(`failed to asynchronously prepare wasm: ${reason}`);
  abort(reason);
 });
}

function instantiateAsync(binary, binaryFile, imports, callback) {
 if (!binary && typeof WebAssembly.instantiateStreaming == "function" && !isDataURI(binaryFile) && !isFileURI(binaryFile) && !ENVIRONMENT_IS_NODE && typeof fetch == "function") {
  return fetch(binaryFile, {
   credentials: "same-origin"
  }).then(response => {
   /** @suppress {checkTypes} */ var result = WebAssembly.instantiateStreaming(response, imports);
   return result.then(callback, function(reason) {
    err(`wasm streaming compile failed: ${reason}`);
    err("falling back to ArrayBuffer instantiation");
    return instantiateArrayBuffer(binaryFile, imports, callback);
   });
  });
 }
 return instantiateArrayBuffer(binaryFile, imports, callback);
}

function createWasm() {
 var info = {
  "a": wasmImports
 };
 /** @param {WebAssembly.Module=} module*/ function receiveInstance(instance, module) {
  wasmExports = instance.exports;
  wasmMemory = wasmExports["c"];
  updateMemoryViews();
  addOnInit(wasmExports["d"]);
  removeRunDependency("wasm-instantiate");
  return wasmExports;
 }
 addRunDependency("wasm-instantiate");
 function receiveInstantiationResult(result) {
  receiveInstance(result["instance"]);
 }
 if (Module["instantiateWasm"]) {
  try {
   return Module["instantiateWasm"](info, receiveInstance);
  } catch (e) {
   err(`Module.instantiateWasm callback failed with error: ${e}`);
   readyPromiseReject(e);
  }
 }
 instantiateAsync(wasmBinary, wasmBinaryFile, info, receiveInstantiationResult).catch(readyPromiseReject);
 return {};
}

var callRuntimeCallbacks = callbacks => {
 while (callbacks.length > 0) {
  callbacks.shift()(Module);
 }
};

var noExitRuntime = Module["noExitRuntime"] || true;

var _emscripten_memcpy_js = (dest, src, num) => HEAPU8.copyWithin(dest, src, src + num);

var _emscripten_resize_heap = requestedSize => {
 var oldSize = HEAPU8.length;
 requestedSize >>>= 0;
 return false;
};

var wasmImports = {
 /** @export */ b: _emscripten_memcpy_js,
 /** @export */ a: _emscripten_resize_heap
};

var wasmExports = createWasm();

var ___wasm_call_ctors = () => (___wasm_call_ctors = wasmExports["d"])();

var _mclBnMalloc = Module["_mclBnMalloc"] = a0 => (_mclBnMalloc = Module["_mclBnMalloc"] = wasmExports["e"])(a0);

var _mclBnFree = Module["_mclBnFree"] = a0 => (_mclBnFree = Module["_mclBnFree"] = wasmExports["f"])(a0);

var _mclBn_getVersion = Module["_mclBn_getVersion"] = () => (_mclBn_getVersion = Module["_mclBn_getVersion"] = wasmExports["g"])();

var _mclBn_init = Module["_mclBn_init"] = (a0, a1) => (_mclBn_init = Module["_mclBn_init"] = wasmExports["h"])(a0, a1);

var _mclBn_getCurveType = Module["_mclBn_getCurveType"] = () => (_mclBn_getCurveType = Module["_mclBn_getCurveType"] = wasmExports["i"])();

var _mclBn_getOpUnitSize = Module["_mclBn_getOpUnitSize"] = () => (_mclBn_getOpUnitSize = Module["_mclBn_getOpUnitSize"] = wasmExports["j"])();

var _mclBn_getG1ByteSize = Module["_mclBn_getG1ByteSize"] = () => (_mclBn_getG1ByteSize = Module["_mclBn_getG1ByteSize"] = wasmExports["k"])();

var _mclBn_getG2ByteSize = Module["_mclBn_getG2ByteSize"] = () => (_mclBn_getG2ByteSize = Module["_mclBn_getG2ByteSize"] = wasmExports["l"])();

var _mclBn_getFrByteSize = Module["_mclBn_getFrByteSize"] = () => (_mclBn_getFrByteSize = Module["_mclBn_getFrByteSize"] = wasmExports["m"])();

var _mclBn_getFpByteSize = Module["_mclBn_getFpByteSize"] = () => (_mclBn_getFpByteSize = Module["_mclBn_getFpByteSize"] = wasmExports["n"])();

var _mclBn_getCurveOrder = Module["_mclBn_getCurveOrder"] = (a0, a1) => (_mclBn_getCurveOrder = Module["_mclBn_getCurveOrder"] = wasmExports["o"])(a0, a1);

var _mclBn_getFieldOrder = Module["_mclBn_getFieldOrder"] = (a0, a1) => (_mclBn_getFieldOrder = Module["_mclBn_getFieldOrder"] = wasmExports["p"])(a0, a1);

var _mclBn_setETHserialization = Module["_mclBn_setETHserialization"] = a0 => (_mclBn_setETHserialization = Module["_mclBn_setETHserialization"] = wasmExports["q"])(a0);

var _mclBn_getETHserialization = Module["_mclBn_getETHserialization"] = () => (_mclBn_getETHserialization = Module["_mclBn_getETHserialization"] = wasmExports["r"])();

var _mclBn_setMapToMode = Module["_mclBn_setMapToMode"] = a0 => (_mclBn_setMapToMode = Module["_mclBn_setMapToMode"] = wasmExports["s"])(a0);

var _mclBnG1_setDst = Module["_mclBnG1_setDst"] = (a0, a1) => (_mclBnG1_setDst = Module["_mclBnG1_setDst"] = wasmExports["t"])(a0, a1);

var _mclBnG2_setDst = Module["_mclBnG2_setDst"] = (a0, a1) => (_mclBnG2_setDst = Module["_mclBnG2_setDst"] = wasmExports["u"])(a0, a1);

var _mclBnFr_clear = Module["_mclBnFr_clear"] = a0 => (_mclBnFr_clear = Module["_mclBnFr_clear"] = wasmExports["v"])(a0);

var _mclBnFr_setInt = Module["_mclBnFr_setInt"] = (a0, a1) => (_mclBnFr_setInt = Module["_mclBnFr_setInt"] = wasmExports["w"])(a0, a1);

var _mclBnFr_setInt32 = Module["_mclBnFr_setInt32"] = (a0, a1) => (_mclBnFr_setInt32 = Module["_mclBnFr_setInt32"] = wasmExports["x"])(a0, a1);

var _mclBnFr_setStr = Module["_mclBnFr_setStr"] = (a0, a1, a2, a3) => (_mclBnFr_setStr = Module["_mclBnFr_setStr"] = wasmExports["y"])(a0, a1, a2, a3);

var _mclBnFr_setLittleEndian = Module["_mclBnFr_setLittleEndian"] = (a0, a1, a2) => (_mclBnFr_setLittleEndian = Module["_mclBnFr_setLittleEndian"] = wasmExports["z"])(a0, a1, a2);

var _mclBnFr_setBigEndianMod = Module["_mclBnFr_setBigEndianMod"] = (a0, a1, a2) => (_mclBnFr_setBigEndianMod = Module["_mclBnFr_setBigEndianMod"] = wasmExports["A"])(a0, a1, a2);

var _mclBnFr_getLittleEndian = Module["_mclBnFr_getLittleEndian"] = (a0, a1, a2) => (_mclBnFr_getLittleEndian = Module["_mclBnFr_getLittleEndian"] = wasmExports["B"])(a0, a1, a2);

var _mclBnFr_setLittleEndianMod = Module["_mclBnFr_setLittleEndianMod"] = (a0, a1, a2) => (_mclBnFr_setLittleEndianMod = Module["_mclBnFr_setLittleEndianMod"] = wasmExports["C"])(a0, a1, a2);

var _mclBnFr_deserialize = Module["_mclBnFr_deserialize"] = (a0, a1, a2) => (_mclBnFr_deserialize = Module["_mclBnFr_deserialize"] = wasmExports["D"])(a0, a1, a2);

var _mclBnFr_isValid = Module["_mclBnFr_isValid"] = a0 => (_mclBnFr_isValid = Module["_mclBnFr_isValid"] = wasmExports["E"])(a0);

var _mclBnFr_isEqual = Module["_mclBnFr_isEqual"] = (a0, a1) => (_mclBnFr_isEqual = Module["_mclBnFr_isEqual"] = wasmExports["F"])(a0, a1);

var _mclBnFr_isZero = Module["_mclBnFr_isZero"] = a0 => (_mclBnFr_isZero = Module["_mclBnFr_isZero"] = wasmExports["G"])(a0);

var _mclBnFr_isOne = Module["_mclBnFr_isOne"] = a0 => (_mclBnFr_isOne = Module["_mclBnFr_isOne"] = wasmExports["H"])(a0);

var _mclBnFr_isOdd = Module["_mclBnFr_isOdd"] = a0 => (_mclBnFr_isOdd = Module["_mclBnFr_isOdd"] = wasmExports["I"])(a0);

var _mclBnFr_isNegative = Module["_mclBnFr_isNegative"] = a0 => (_mclBnFr_isNegative = Module["_mclBnFr_isNegative"] = wasmExports["J"])(a0);

var _mclBnFr_cmp = Module["_mclBnFr_cmp"] = (a0, a1) => (_mclBnFr_cmp = Module["_mclBnFr_cmp"] = wasmExports["K"])(a0, a1);

var _mclBnFr_setByCSPRNG = Module["_mclBnFr_setByCSPRNG"] = a0 => (_mclBnFr_setByCSPRNG = Module["_mclBnFr_setByCSPRNG"] = wasmExports["L"])(a0);

var _mclBnFp_setByCSPRNG = Module["_mclBnFp_setByCSPRNG"] = a0 => (_mclBnFp_setByCSPRNG = Module["_mclBnFp_setByCSPRNG"] = wasmExports["M"])(a0);

var _mclBn_setRandFunc = Module["_mclBn_setRandFunc"] = (a0, a1) => (_mclBn_setRandFunc = Module["_mclBn_setRandFunc"] = wasmExports["N"])(a0, a1);

var _mclBnFr_setHashOf = Module["_mclBnFr_setHashOf"] = (a0, a1, a2) => (_mclBnFr_setHashOf = Module["_mclBnFr_setHashOf"] = wasmExports["O"])(a0, a1, a2);

var _mclBnFr_getStr = Module["_mclBnFr_getStr"] = (a0, a1, a2, a3) => (_mclBnFr_getStr = Module["_mclBnFr_getStr"] = wasmExports["P"])(a0, a1, a2, a3);

var _mclBnFr_serialize = Module["_mclBnFr_serialize"] = (a0, a1, a2) => (_mclBnFr_serialize = Module["_mclBnFr_serialize"] = wasmExports["Q"])(a0, a1, a2);

var _mclBnFr_neg = Module["_mclBnFr_neg"] = (a0, a1) => (_mclBnFr_neg = Module["_mclBnFr_neg"] = wasmExports["R"])(a0, a1);

var _mclBnFr_inv = Module["_mclBnFr_inv"] = (a0, a1) => (_mclBnFr_inv = Module["_mclBnFr_inv"] = wasmExports["S"])(a0, a1);

var _mclBnFr_sqr = Module["_mclBnFr_sqr"] = (a0, a1) => (_mclBnFr_sqr = Module["_mclBnFr_sqr"] = wasmExports["T"])(a0, a1);

var _mclBnFr_add = Module["_mclBnFr_add"] = (a0, a1, a2) => (_mclBnFr_add = Module["_mclBnFr_add"] = wasmExports["U"])(a0, a1, a2);

var _mclBnFr_sub = Module["_mclBnFr_sub"] = (a0, a1, a2) => (_mclBnFr_sub = Module["_mclBnFr_sub"] = wasmExports["V"])(a0, a1, a2);

var _mclBnFr_mul = Module["_mclBnFr_mul"] = (a0, a1, a2) => (_mclBnFr_mul = Module["_mclBnFr_mul"] = wasmExports["W"])(a0, a1, a2);

var _mclBnFr_div = Module["_mclBnFr_div"] = (a0, a1, a2) => (_mclBnFr_div = Module["_mclBnFr_div"] = wasmExports["X"])(a0, a1, a2);

var _mclBnFp_neg = Module["_mclBnFp_neg"] = (a0, a1) => (_mclBnFp_neg = Module["_mclBnFp_neg"] = wasmExports["Y"])(a0, a1);

var _mclBnFp_inv = Module["_mclBnFp_inv"] = (a0, a1) => (_mclBnFp_inv = Module["_mclBnFp_inv"] = wasmExports["Z"])(a0, a1);

var _mclBnFp_sqr = Module["_mclBnFp_sqr"] = (a0, a1) => (_mclBnFp_sqr = Module["_mclBnFp_sqr"] = wasmExports["_"])(a0, a1);

var _mclBnFp_add = Module["_mclBnFp_add"] = (a0, a1, a2) => (_mclBnFp_add = Module["_mclBnFp_add"] = wasmExports["$"])(a0, a1, a2);

var _mclBnFp_sub = Module["_mclBnFp_sub"] = (a0, a1, a2) => (_mclBnFp_sub = Module["_mclBnFp_sub"] = wasmExports["aa"])(a0, a1, a2);

var _mclBnFp_mul = Module["_mclBnFp_mul"] = (a0, a1, a2) => (_mclBnFp_mul = Module["_mclBnFp_mul"] = wasmExports["ba"])(a0, a1, a2);

var _mclBnFp_div = Module["_mclBnFp_div"] = (a0, a1, a2) => (_mclBnFp_div = Module["_mclBnFp_div"] = wasmExports["ca"])(a0, a1, a2);

var _mclBnFp2_neg = Module["_mclBnFp2_neg"] = (a0, a1) => (_mclBnFp2_neg = Module["_mclBnFp2_neg"] = wasmExports["da"])(a0, a1);

var _mclBnFp2_inv = Module["_mclBnFp2_inv"] = (a0, a1) => (_mclBnFp2_inv = Module["_mclBnFp2_inv"] = wasmExports["ea"])(a0, a1);

var _mclBnFp2_sqr = Module["_mclBnFp2_sqr"] = (a0, a1) => (_mclBnFp2_sqr = Module["_mclBnFp2_sqr"] = wasmExports["fa"])(a0, a1);

var _mclBnFp2_add = Module["_mclBnFp2_add"] = (a0, a1, a2) => (_mclBnFp2_add = Module["_mclBnFp2_add"] = wasmExports["ga"])(a0, a1, a2);

var _mclBnFp2_sub = Module["_mclBnFp2_sub"] = (a0, a1, a2) => (_mclBnFp2_sub = Module["_mclBnFp2_sub"] = wasmExports["ha"])(a0, a1, a2);

var _mclBnFp2_mul = Module["_mclBnFp2_mul"] = (a0, a1, a2) => (_mclBnFp2_mul = Module["_mclBnFp2_mul"] = wasmExports["ia"])(a0, a1, a2);

var _mclBnFp2_div = Module["_mclBnFp2_div"] = (a0, a1, a2) => (_mclBnFp2_div = Module["_mclBnFp2_div"] = wasmExports["ja"])(a0, a1, a2);

var _mclBnFr_squareRoot = Module["_mclBnFr_squareRoot"] = (a0, a1) => (_mclBnFr_squareRoot = Module["_mclBnFr_squareRoot"] = wasmExports["ka"])(a0, a1);

var _mclBnFp_squareRoot = Module["_mclBnFp_squareRoot"] = (a0, a1) => (_mclBnFp_squareRoot = Module["_mclBnFp_squareRoot"] = wasmExports["la"])(a0, a1);

var _mclBnFp2_squareRoot = Module["_mclBnFp2_squareRoot"] = (a0, a1) => (_mclBnFp2_squareRoot = Module["_mclBnFp2_squareRoot"] = wasmExports["ma"])(a0, a1);

var _mclBnG1_clear = Module["_mclBnG1_clear"] = a0 => (_mclBnG1_clear = Module["_mclBnG1_clear"] = wasmExports["na"])(a0);

var _mclBnG1_setStr = Module["_mclBnG1_setStr"] = (a0, a1, a2, a3) => (_mclBnG1_setStr = Module["_mclBnG1_setStr"] = wasmExports["oa"])(a0, a1, a2, a3);

var _mclBnG1_deserialize = Module["_mclBnG1_deserialize"] = (a0, a1, a2) => (_mclBnG1_deserialize = Module["_mclBnG1_deserialize"] = wasmExports["pa"])(a0, a1, a2);

var _mclBnG1_isValid = Module["_mclBnG1_isValid"] = a0 => (_mclBnG1_isValid = Module["_mclBnG1_isValid"] = wasmExports["qa"])(a0);

var _mclBnG1_isEqual = Module["_mclBnG1_isEqual"] = (a0, a1) => (_mclBnG1_isEqual = Module["_mclBnG1_isEqual"] = wasmExports["ra"])(a0, a1);

var _mclBnG1_isZero = Module["_mclBnG1_isZero"] = a0 => (_mclBnG1_isZero = Module["_mclBnG1_isZero"] = wasmExports["sa"])(a0);

var _mclBnG1_isValidOrder = Module["_mclBnG1_isValidOrder"] = a0 => (_mclBnG1_isValidOrder = Module["_mclBnG1_isValidOrder"] = wasmExports["ta"])(a0);

var _mclBnG1_hashAndMapTo = Module["_mclBnG1_hashAndMapTo"] = (a0, a1, a2) => (_mclBnG1_hashAndMapTo = Module["_mclBnG1_hashAndMapTo"] = wasmExports["ua"])(a0, a1, a2);

var _mclBnG1_hashAndMapToWithDst = Module["_mclBnG1_hashAndMapToWithDst"] = (a0, a1, a2, a3, a4) => (_mclBnG1_hashAndMapToWithDst = Module["_mclBnG1_hashAndMapToWithDst"] = wasmExports["va"])(a0, a1, a2, a3, a4);

var _mclBnG1_getStr = Module["_mclBnG1_getStr"] = (a0, a1, a2, a3) => (_mclBnG1_getStr = Module["_mclBnG1_getStr"] = wasmExports["wa"])(a0, a1, a2, a3);

var _mclBnG1_serialize = Module["_mclBnG1_serialize"] = (a0, a1, a2) => (_mclBnG1_serialize = Module["_mclBnG1_serialize"] = wasmExports["xa"])(a0, a1, a2);

var _mclBnG1_neg = Module["_mclBnG1_neg"] = (a0, a1) => (_mclBnG1_neg = Module["_mclBnG1_neg"] = wasmExports["ya"])(a0, a1);

var _mclBnG1_dbl = Module["_mclBnG1_dbl"] = (a0, a1) => (_mclBnG1_dbl = Module["_mclBnG1_dbl"] = wasmExports["za"])(a0, a1);

var _mclBnG1_normalize = Module["_mclBnG1_normalize"] = (a0, a1) => (_mclBnG1_normalize = Module["_mclBnG1_normalize"] = wasmExports["Aa"])(a0, a1);

var _mclBnG1_add = Module["_mclBnG1_add"] = (a0, a1, a2) => (_mclBnG1_add = Module["_mclBnG1_add"] = wasmExports["Ba"])(a0, a1, a2);

var _mclBnG1_sub = Module["_mclBnG1_sub"] = (a0, a1, a2) => (_mclBnG1_sub = Module["_mclBnG1_sub"] = wasmExports["Ca"])(a0, a1, a2);

var _mclBnG1_mul = Module["_mclBnG1_mul"] = (a0, a1, a2) => (_mclBnG1_mul = Module["_mclBnG1_mul"] = wasmExports["Da"])(a0, a1, a2);

var _mclBnG1_mulCT = Module["_mclBnG1_mulCT"] = (a0, a1, a2) => (_mclBnG1_mulCT = Module["_mclBnG1_mulCT"] = wasmExports["Ea"])(a0, a1, a2);

var _mclBnG2_clear = Module["_mclBnG2_clear"] = a0 => (_mclBnG2_clear = Module["_mclBnG2_clear"] = wasmExports["Fa"])(a0);

var _mclBnG2_setStr = Module["_mclBnG2_setStr"] = (a0, a1, a2, a3) => (_mclBnG2_setStr = Module["_mclBnG2_setStr"] = wasmExports["Ga"])(a0, a1, a2, a3);

var _mclBnG2_deserialize = Module["_mclBnG2_deserialize"] = (a0, a1, a2) => (_mclBnG2_deserialize = Module["_mclBnG2_deserialize"] = wasmExports["Ha"])(a0, a1, a2);

var _mclBnG2_isValid = Module["_mclBnG2_isValid"] = a0 => (_mclBnG2_isValid = Module["_mclBnG2_isValid"] = wasmExports["Ia"])(a0);

var _mclBnG2_isEqual = Module["_mclBnG2_isEqual"] = (a0, a1) => (_mclBnG2_isEqual = Module["_mclBnG2_isEqual"] = wasmExports["Ja"])(a0, a1);

var _mclBnG2_isZero = Module["_mclBnG2_isZero"] = a0 => (_mclBnG2_isZero = Module["_mclBnG2_isZero"] = wasmExports["Ka"])(a0);

var _mclBnG2_isValidOrder = Module["_mclBnG2_isValidOrder"] = a0 => (_mclBnG2_isValidOrder = Module["_mclBnG2_isValidOrder"] = wasmExports["La"])(a0);

var _mclBnG2_hashAndMapTo = Module["_mclBnG2_hashAndMapTo"] = (a0, a1, a2) => (_mclBnG2_hashAndMapTo = Module["_mclBnG2_hashAndMapTo"] = wasmExports["Ma"])(a0, a1, a2);

var _mclBnG2_hashAndMapToWithDst = Module["_mclBnG2_hashAndMapToWithDst"] = (a0, a1, a2, a3, a4) => (_mclBnG2_hashAndMapToWithDst = Module["_mclBnG2_hashAndMapToWithDst"] = wasmExports["Na"])(a0, a1, a2, a3, a4);

var _mclBnG2_getStr = Module["_mclBnG2_getStr"] = (a0, a1, a2, a3) => (_mclBnG2_getStr = Module["_mclBnG2_getStr"] = wasmExports["Oa"])(a0, a1, a2, a3);

var _mclBnG2_serialize = Module["_mclBnG2_serialize"] = (a0, a1, a2) => (_mclBnG2_serialize = Module["_mclBnG2_serialize"] = wasmExports["Pa"])(a0, a1, a2);

var _mclBnG2_neg = Module["_mclBnG2_neg"] = (a0, a1) => (_mclBnG2_neg = Module["_mclBnG2_neg"] = wasmExports["Qa"])(a0, a1);

var _mclBnG2_dbl = Module["_mclBnG2_dbl"] = (a0, a1) => (_mclBnG2_dbl = Module["_mclBnG2_dbl"] = wasmExports["Ra"])(a0, a1);

var _mclBnG2_normalize = Module["_mclBnG2_normalize"] = (a0, a1) => (_mclBnG2_normalize = Module["_mclBnG2_normalize"] = wasmExports["Sa"])(a0, a1);

var _mclBnG2_add = Module["_mclBnG2_add"] = (a0, a1, a2) => (_mclBnG2_add = Module["_mclBnG2_add"] = wasmExports["Ta"])(a0, a1, a2);

var _mclBnG2_sub = Module["_mclBnG2_sub"] = (a0, a1, a2) => (_mclBnG2_sub = Module["_mclBnG2_sub"] = wasmExports["Ua"])(a0, a1, a2);

var _mclBnG2_mul = Module["_mclBnG2_mul"] = (a0, a1, a2) => (_mclBnG2_mul = Module["_mclBnG2_mul"] = wasmExports["Va"])(a0, a1, a2);

var _mclBnG2_mulCT = Module["_mclBnG2_mulCT"] = (a0, a1, a2) => (_mclBnG2_mulCT = Module["_mclBnG2_mulCT"] = wasmExports["Wa"])(a0, a1, a2);

var _mclBnGT_clear = Module["_mclBnGT_clear"] = a0 => (_mclBnGT_clear = Module["_mclBnGT_clear"] = wasmExports["Xa"])(a0);

var _mclBnGT_setInt = Module["_mclBnGT_setInt"] = (a0, a1) => (_mclBnGT_setInt = Module["_mclBnGT_setInt"] = wasmExports["Ya"])(a0, a1);

var _mclBnGT_setInt32 = Module["_mclBnGT_setInt32"] = (a0, a1) => (_mclBnGT_setInt32 = Module["_mclBnGT_setInt32"] = wasmExports["Za"])(a0, a1);

var _mclBnGT_setStr = Module["_mclBnGT_setStr"] = (a0, a1, a2, a3) => (_mclBnGT_setStr = Module["_mclBnGT_setStr"] = wasmExports["_a"])(a0, a1, a2, a3);

var _mclBnGT_deserialize = Module["_mclBnGT_deserialize"] = (a0, a1, a2) => (_mclBnGT_deserialize = Module["_mclBnGT_deserialize"] = wasmExports["$a"])(a0, a1, a2);

var _mclBnGT_isEqual = Module["_mclBnGT_isEqual"] = (a0, a1) => (_mclBnGT_isEqual = Module["_mclBnGT_isEqual"] = wasmExports["ab"])(a0, a1);

var _mclBnGT_isZero = Module["_mclBnGT_isZero"] = a0 => (_mclBnGT_isZero = Module["_mclBnGT_isZero"] = wasmExports["bb"])(a0);

var _mclBnGT_isOne = Module["_mclBnGT_isOne"] = a0 => (_mclBnGT_isOne = Module["_mclBnGT_isOne"] = wasmExports["cb"])(a0);

var _mclBnGT_isValid = Module["_mclBnGT_isValid"] = a0 => (_mclBnGT_isValid = Module["_mclBnGT_isValid"] = wasmExports["db"])(a0);

var _mclBnGT_getStr = Module["_mclBnGT_getStr"] = (a0, a1, a2, a3) => (_mclBnGT_getStr = Module["_mclBnGT_getStr"] = wasmExports["eb"])(a0, a1, a2, a3);

var _mclBnGT_serialize = Module["_mclBnGT_serialize"] = (a0, a1, a2) => (_mclBnGT_serialize = Module["_mclBnGT_serialize"] = wasmExports["fb"])(a0, a1, a2);

var _mclBnGT_neg = Module["_mclBnGT_neg"] = (a0, a1) => (_mclBnGT_neg = Module["_mclBnGT_neg"] = wasmExports["gb"])(a0, a1);

var _mclBnGT_inv = Module["_mclBnGT_inv"] = (a0, a1) => (_mclBnGT_inv = Module["_mclBnGT_inv"] = wasmExports["hb"])(a0, a1);

var _mclBnGT_invGeneric = Module["_mclBnGT_invGeneric"] = (a0, a1) => (_mclBnGT_invGeneric = Module["_mclBnGT_invGeneric"] = wasmExports["ib"])(a0, a1);

var _mclBnGT_sqr = Module["_mclBnGT_sqr"] = (a0, a1) => (_mclBnGT_sqr = Module["_mclBnGT_sqr"] = wasmExports["jb"])(a0, a1);

var _mclBnGT_add = Module["_mclBnGT_add"] = (a0, a1, a2) => (_mclBnGT_add = Module["_mclBnGT_add"] = wasmExports["kb"])(a0, a1, a2);

var _mclBnGT_sub = Module["_mclBnGT_sub"] = (a0, a1, a2) => (_mclBnGT_sub = Module["_mclBnGT_sub"] = wasmExports["lb"])(a0, a1, a2);

var _mclBnGT_mul = Module["_mclBnGT_mul"] = (a0, a1, a2) => (_mclBnGT_mul = Module["_mclBnGT_mul"] = wasmExports["mb"])(a0, a1, a2);

var _mclBnGT_div = Module["_mclBnGT_div"] = (a0, a1, a2) => (_mclBnGT_div = Module["_mclBnGT_div"] = wasmExports["nb"])(a0, a1, a2);

var _mclBnGT_pow = Module["_mclBnGT_pow"] = (a0, a1, a2) => (_mclBnGT_pow = Module["_mclBnGT_pow"] = wasmExports["ob"])(a0, a1, a2);

var _mclBnGT_powGeneric = Module["_mclBnGT_powGeneric"] = (a0, a1, a2) => (_mclBnGT_powGeneric = Module["_mclBnGT_powGeneric"] = wasmExports["pb"])(a0, a1, a2);

var _mclBnG1_mulVec = Module["_mclBnG1_mulVec"] = (a0, a1, a2, a3) => (_mclBnG1_mulVec = Module["_mclBnG1_mulVec"] = wasmExports["qb"])(a0, a1, a2, a3);

var _mclBnG2_mulVec = Module["_mclBnG2_mulVec"] = (a0, a1, a2, a3) => (_mclBnG2_mulVec = Module["_mclBnG2_mulVec"] = wasmExports["rb"])(a0, a1, a2, a3);

var _mclBnGT_powVec = Module["_mclBnGT_powVec"] = (a0, a1, a2, a3) => (_mclBnGT_powVec = Module["_mclBnGT_powVec"] = wasmExports["sb"])(a0, a1, a2, a3);

var _mclBn_pairing = Module["_mclBn_pairing"] = (a0, a1, a2) => (_mclBn_pairing = Module["_mclBn_pairing"] = wasmExports["tb"])(a0, a1, a2);

var _mclBn_finalExp = Module["_mclBn_finalExp"] = (a0, a1) => (_mclBn_finalExp = Module["_mclBn_finalExp"] = wasmExports["ub"])(a0, a1);

var _mclBn_millerLoop = Module["_mclBn_millerLoop"] = (a0, a1, a2) => (_mclBn_millerLoop = Module["_mclBn_millerLoop"] = wasmExports["vb"])(a0, a1, a2);

var _mclBn_millerLoopVec = Module["_mclBn_millerLoopVec"] = (a0, a1, a2, a3) => (_mclBn_millerLoopVec = Module["_mclBn_millerLoopVec"] = wasmExports["wb"])(a0, a1, a2, a3);

var _mclBn_millerLoopVecMT = Module["_mclBn_millerLoopVecMT"] = (a0, a1, a2, a3, a4) => (_mclBn_millerLoopVecMT = Module["_mclBn_millerLoopVecMT"] = wasmExports["xb"])(a0, a1, a2, a3, a4);

var _mclBnG1_mulVecMT = Module["_mclBnG1_mulVecMT"] = (a0, a1, a2, a3, a4) => (_mclBnG1_mulVecMT = Module["_mclBnG1_mulVecMT"] = wasmExports["yb"])(a0, a1, a2, a3, a4);

var _mclBnG2_mulVecMT = Module["_mclBnG2_mulVecMT"] = (a0, a1, a2, a3, a4) => (_mclBnG2_mulVecMT = Module["_mclBnG2_mulVecMT"] = wasmExports["zb"])(a0, a1, a2, a3, a4);

var _mclBn_getUint64NumToPrecompute = Module["_mclBn_getUint64NumToPrecompute"] = () => (_mclBn_getUint64NumToPrecompute = Module["_mclBn_getUint64NumToPrecompute"] = wasmExports["Ab"])();

var _mclBn_precomputeG2 = Module["_mclBn_precomputeG2"] = (a0, a1) => (_mclBn_precomputeG2 = Module["_mclBn_precomputeG2"] = wasmExports["Bb"])(a0, a1);

var _mclBn_precomputedMillerLoop = Module["_mclBn_precomputedMillerLoop"] = (a0, a1, a2) => (_mclBn_precomputedMillerLoop = Module["_mclBn_precomputedMillerLoop"] = wasmExports["Cb"])(a0, a1, a2);

var _mclBn_precomputedMillerLoop2 = Module["_mclBn_precomputedMillerLoop2"] = (a0, a1, a2, a3, a4) => (_mclBn_precomputedMillerLoop2 = Module["_mclBn_precomputedMillerLoop2"] = wasmExports["Db"])(a0, a1, a2, a3, a4);

var _mclBn_precomputedMillerLoop2mixed = Module["_mclBn_precomputedMillerLoop2mixed"] = (a0, a1, a2, a3, a4) => (_mclBn_precomputedMillerLoop2mixed = Module["_mclBn_precomputedMillerLoop2mixed"] = wasmExports["Eb"])(a0, a1, a2, a3, a4);

var _mclBn_FrLagrangeInterpolation = Module["_mclBn_FrLagrangeInterpolation"] = (a0, a1, a2, a3) => (_mclBn_FrLagrangeInterpolation = Module["_mclBn_FrLagrangeInterpolation"] = wasmExports["Fb"])(a0, a1, a2, a3);

var _mclBn_G1LagrangeInterpolation = Module["_mclBn_G1LagrangeInterpolation"] = (a0, a1, a2, a3) => (_mclBn_G1LagrangeInterpolation = Module["_mclBn_G1LagrangeInterpolation"] = wasmExports["Gb"])(a0, a1, a2, a3);

var _mclBn_G2LagrangeInterpolation = Module["_mclBn_G2LagrangeInterpolation"] = (a0, a1, a2, a3) => (_mclBn_G2LagrangeInterpolation = Module["_mclBn_G2LagrangeInterpolation"] = wasmExports["Hb"])(a0, a1, a2, a3);

var _mclBn_FrEvaluatePolynomial = Module["_mclBn_FrEvaluatePolynomial"] = (a0, a1, a2, a3) => (_mclBn_FrEvaluatePolynomial = Module["_mclBn_FrEvaluatePolynomial"] = wasmExports["Ib"])(a0, a1, a2, a3);

var _mclBn_G1EvaluatePolynomial = Module["_mclBn_G1EvaluatePolynomial"] = (a0, a1, a2, a3) => (_mclBn_G1EvaluatePolynomial = Module["_mclBn_G1EvaluatePolynomial"] = wasmExports["Jb"])(a0, a1, a2, a3);

var _mclBn_G2EvaluatePolynomial = Module["_mclBn_G2EvaluatePolynomial"] = (a0, a1, a2, a3) => (_mclBn_G2EvaluatePolynomial = Module["_mclBn_G2EvaluatePolynomial"] = wasmExports["Kb"])(a0, a1, a2, a3);

var _mclBn_verifyOrderG1 = Module["_mclBn_verifyOrderG1"] = a0 => (_mclBn_verifyOrderG1 = Module["_mclBn_verifyOrderG1"] = wasmExports["Lb"])(a0);

var _mclBn_verifyOrderG2 = Module["_mclBn_verifyOrderG2"] = a0 => (_mclBn_verifyOrderG2 = Module["_mclBn_verifyOrderG2"] = wasmExports["Mb"])(a0);

var _mclBnFp_setInt = Module["_mclBnFp_setInt"] = (a0, a1) => (_mclBnFp_setInt = Module["_mclBnFp_setInt"] = wasmExports["Nb"])(a0, a1);

var _mclBnFp_setInt32 = Module["_mclBnFp_setInt32"] = (a0, a1) => (_mclBnFp_setInt32 = Module["_mclBnFp_setInt32"] = wasmExports["Ob"])(a0, a1);

var _mclBnFp_getStr = Module["_mclBnFp_getStr"] = (a0, a1, a2, a3) => (_mclBnFp_getStr = Module["_mclBnFp_getStr"] = wasmExports["Pb"])(a0, a1, a2, a3);

var _mclBnFp_setStr = Module["_mclBnFp_setStr"] = (a0, a1, a2, a3) => (_mclBnFp_setStr = Module["_mclBnFp_setStr"] = wasmExports["Qb"])(a0, a1, a2, a3);

var _mclBnFp_deserialize = Module["_mclBnFp_deserialize"] = (a0, a1, a2) => (_mclBnFp_deserialize = Module["_mclBnFp_deserialize"] = wasmExports["Rb"])(a0, a1, a2);

var _mclBnFp_serialize = Module["_mclBnFp_serialize"] = (a0, a1, a2) => (_mclBnFp_serialize = Module["_mclBnFp_serialize"] = wasmExports["Sb"])(a0, a1, a2);

var _mclBnFp_clear = Module["_mclBnFp_clear"] = a0 => (_mclBnFp_clear = Module["_mclBnFp_clear"] = wasmExports["Tb"])(a0);

var _mclBnFp_setLittleEndian = Module["_mclBnFp_setLittleEndian"] = (a0, a1, a2) => (_mclBnFp_setLittleEndian = Module["_mclBnFp_setLittleEndian"] = wasmExports["Ub"])(a0, a1, a2);

var _mclBnFp_setLittleEndianMod = Module["_mclBnFp_setLittleEndianMod"] = (a0, a1, a2) => (_mclBnFp_setLittleEndianMod = Module["_mclBnFp_setLittleEndianMod"] = wasmExports["Vb"])(a0, a1, a2);

var _mclBnFp_setBigEndianMod = Module["_mclBnFp_setBigEndianMod"] = (a0, a1, a2) => (_mclBnFp_setBigEndianMod = Module["_mclBnFp_setBigEndianMod"] = wasmExports["Wb"])(a0, a1, a2);

var _mclBnFp_getLittleEndian = Module["_mclBnFp_getLittleEndian"] = (a0, a1, a2) => (_mclBnFp_getLittleEndian = Module["_mclBnFp_getLittleEndian"] = wasmExports["Xb"])(a0, a1, a2);

var _mclBnFp_isValid = Module["_mclBnFp_isValid"] = a0 => (_mclBnFp_isValid = Module["_mclBnFp_isValid"] = wasmExports["Yb"])(a0);

var _mclBnFp_isEqual = Module["_mclBnFp_isEqual"] = (a0, a1) => (_mclBnFp_isEqual = Module["_mclBnFp_isEqual"] = wasmExports["Zb"])(a0, a1);

var _mclBnFp_isZero = Module["_mclBnFp_isZero"] = a0 => (_mclBnFp_isZero = Module["_mclBnFp_isZero"] = wasmExports["_b"])(a0);

var _mclBnFp_isOne = Module["_mclBnFp_isOne"] = a0 => (_mclBnFp_isOne = Module["_mclBnFp_isOne"] = wasmExports["$b"])(a0);

var _mclBnFp_isOdd = Module["_mclBnFp_isOdd"] = a0 => (_mclBnFp_isOdd = Module["_mclBnFp_isOdd"] = wasmExports["ac"])(a0);

var _mclBnFp_isNegative = Module["_mclBnFp_isNegative"] = a0 => (_mclBnFp_isNegative = Module["_mclBnFp_isNegative"] = wasmExports["bc"])(a0);

var _mclBnFp_cmp = Module["_mclBnFp_cmp"] = (a0, a1) => (_mclBnFp_cmp = Module["_mclBnFp_cmp"] = wasmExports["cc"])(a0, a1);

var _mclBnFp_setHashOf = Module["_mclBnFp_setHashOf"] = (a0, a1, a2) => (_mclBnFp_setHashOf = Module["_mclBnFp_setHashOf"] = wasmExports["dc"])(a0, a1, a2);

var _mclBnFp_mapToG1 = Module["_mclBnFp_mapToG1"] = (a0, a1) => (_mclBnFp_mapToG1 = Module["_mclBnFp_mapToG1"] = wasmExports["ec"])(a0, a1);

var _mclBnFp2_deserialize = Module["_mclBnFp2_deserialize"] = (a0, a1, a2) => (_mclBnFp2_deserialize = Module["_mclBnFp2_deserialize"] = wasmExports["fc"])(a0, a1, a2);

var _mclBnFp2_serialize = Module["_mclBnFp2_serialize"] = (a0, a1, a2) => (_mclBnFp2_serialize = Module["_mclBnFp2_serialize"] = wasmExports["gc"])(a0, a1, a2);

var _mclBnFp2_clear = Module["_mclBnFp2_clear"] = a0 => (_mclBnFp2_clear = Module["_mclBnFp2_clear"] = wasmExports["hc"])(a0);

var _mclBnFp2_isEqual = Module["_mclBnFp2_isEqual"] = (a0, a1) => (_mclBnFp2_isEqual = Module["_mclBnFp2_isEqual"] = wasmExports["ic"])(a0, a1);

var _mclBnFp2_isZero = Module["_mclBnFp2_isZero"] = a0 => (_mclBnFp2_isZero = Module["_mclBnFp2_isZero"] = wasmExports["jc"])(a0);

var _mclBnFp2_isOne = Module["_mclBnFp2_isOne"] = a0 => (_mclBnFp2_isOne = Module["_mclBnFp2_isOne"] = wasmExports["kc"])(a0);

var _mclBnFp2_mapToG2 = Module["_mclBnFp2_mapToG2"] = (a0, a1) => (_mclBnFp2_mapToG2 = Module["_mclBnFp2_mapToG2"] = wasmExports["lc"])(a0, a1);

var _mclBnG1_getBasePoint = Module["_mclBnG1_getBasePoint"] = a0 => (_mclBnG1_getBasePoint = Module["_mclBnG1_getBasePoint"] = wasmExports["mc"])(a0);

var _blsSetETHmode = Module["_blsSetETHmode"] = a0 => (_blsSetETHmode = Module["_blsSetETHmode"] = wasmExports["nc"])(a0);

var _blsSetMapToMode = Module["_blsSetMapToMode"] = a0 => (_blsSetMapToMode = Module["_blsSetMapToMode"] = wasmExports["oc"])(a0);

var _blsInit = Module["_blsInit"] = (a0, a1) => (_blsInit = Module["_blsInit"] = wasmExports["pc"])(a0, a1);

var _blsSetETHserialization = Module["_blsSetETHserialization"] = a0 => (_blsSetETHserialization = Module["_blsSetETHserialization"] = wasmExports["qc"])(a0);

var _blsMalloc = Module["_blsMalloc"] = a0 => (_blsMalloc = Module["_blsMalloc"] = wasmExports["rc"])(a0);

var _blsFree = Module["_blsFree"] = a0 => (_blsFree = Module["_blsFree"] = wasmExports["sc"])(a0);

var _blsIdSetInt = Module["_blsIdSetInt"] = (a0, a1) => (_blsIdSetInt = Module["_blsIdSetInt"] = wasmExports["tc"])(a0, a1);

var _blsSecretKeySetLittleEndian = Module["_blsSecretKeySetLittleEndian"] = (a0, a1, a2) => (_blsSecretKeySetLittleEndian = Module["_blsSecretKeySetLittleEndian"] = wasmExports["uc"])(a0, a1, a2);

var _blsSecretKeySetLittleEndianMod = Module["_blsSecretKeySetLittleEndianMod"] = (a0, a1, a2) => (_blsSecretKeySetLittleEndianMod = Module["_blsSecretKeySetLittleEndianMod"] = wasmExports["vc"])(a0, a1, a2);

var _blsGetPublicKey = Module["_blsGetPublicKey"] = (a0, a1) => (_blsGetPublicKey = Module["_blsGetPublicKey"] = wasmExports["wc"])(a0, a1);

var _blsHashToSignature = Module["_blsHashToSignature"] = (a0, a1, a2) => (_blsHashToSignature = Module["_blsHashToSignature"] = wasmExports["xc"])(a0, a1, a2);

var _blsSign = Module["_blsSign"] = (a0, a1, a2, a3) => (_blsSign = Module["_blsSign"] = wasmExports["yc"])(a0, a1, a2, a3);

var _blsVerify = Module["_blsVerify"] = (a0, a1, a2, a3) => (_blsVerify = Module["_blsVerify"] = wasmExports["zc"])(a0, a1, a2, a3);

var _blsMultiVerifySub = Module["_blsMultiVerifySub"] = (a0, a1, a2, a3, a4, a5, a6, a7, a8) => (_blsMultiVerifySub = Module["_blsMultiVerifySub"] = wasmExports["Ac"])(a0, a1, a2, a3, a4, a5, a6, a7, a8);

var _blsMultiVerifyFinal = Module["_blsMultiVerifyFinal"] = (a0, a1) => (_blsMultiVerifyFinal = Module["_blsMultiVerifyFinal"] = wasmExports["Bc"])(a0, a1);

var _blsMultiVerify = Module["_blsMultiVerify"] = (a0, a1, a2, a3, a4, a5, a6, a7) => (_blsMultiVerify = Module["_blsMultiVerify"] = wasmExports["Cc"])(a0, a1, a2, a3, a4, a5, a6, a7);

var _blsAggregateSignature = Module["_blsAggregateSignature"] = (a0, a1, a2) => (_blsAggregateSignature = Module["_blsAggregateSignature"] = wasmExports["Dc"])(a0, a1, a2);

var _blsSignatureAdd = Module["_blsSignatureAdd"] = (a0, a1) => (_blsSignatureAdd = Module["_blsSignatureAdd"] = wasmExports["Ec"])(a0, a1);

var _blsPublicKeyAdd = Module["_blsPublicKeyAdd"] = (a0, a1) => (_blsPublicKeyAdd = Module["_blsPublicKeyAdd"] = wasmExports["Fc"])(a0, a1);

var _blsFastAggregateVerify = Module["_blsFastAggregateVerify"] = (a0, a1, a2, a3, a4) => (_blsFastAggregateVerify = Module["_blsFastAggregateVerify"] = wasmExports["Gc"])(a0, a1, a2, a3, a4);

var _blsAggregateVerifyNoCheck = Module["_blsAggregateVerifyNoCheck"] = (a0, a1, a2, a3, a4) => (_blsAggregateVerifyNoCheck = Module["_blsAggregateVerifyNoCheck"] = wasmExports["Hc"])(a0, a1, a2, a3, a4);

var _blsIdSerialize = Module["_blsIdSerialize"] = (a0, a1, a2) => (_blsIdSerialize = Module["_blsIdSerialize"] = wasmExports["Ic"])(a0, a1, a2);

var _blsSecretKeySerialize = Module["_blsSecretKeySerialize"] = (a0, a1, a2) => (_blsSecretKeySerialize = Module["_blsSecretKeySerialize"] = wasmExports["Jc"])(a0, a1, a2);

var _blsPublicKeySerialize = Module["_blsPublicKeySerialize"] = (a0, a1, a2) => (_blsPublicKeySerialize = Module["_blsPublicKeySerialize"] = wasmExports["Kc"])(a0, a1, a2);

var _blsSignatureSerialize = Module["_blsSignatureSerialize"] = (a0, a1, a2) => (_blsSignatureSerialize = Module["_blsSignatureSerialize"] = wasmExports["Lc"])(a0, a1, a2);

var _blsIdDeserialize = Module["_blsIdDeserialize"] = (a0, a1, a2) => (_blsIdDeserialize = Module["_blsIdDeserialize"] = wasmExports["Mc"])(a0, a1, a2);

var _blsSecretKeyDeserialize = Module["_blsSecretKeyDeserialize"] = (a0, a1, a2) => (_blsSecretKeyDeserialize = Module["_blsSecretKeyDeserialize"] = wasmExports["Nc"])(a0, a1, a2);

var _blsPublicKeyDeserialize = Module["_blsPublicKeyDeserialize"] = (a0, a1, a2) => (_blsPublicKeyDeserialize = Module["_blsPublicKeyDeserialize"] = wasmExports["Oc"])(a0, a1, a2);

var _blsSignatureDeserialize = Module["_blsSignatureDeserialize"] = (a0, a1, a2) => (_blsSignatureDeserialize = Module["_blsSignatureDeserialize"] = wasmExports["Pc"])(a0, a1, a2);

var _blsIdIsEqual = Module["_blsIdIsEqual"] = (a0, a1) => (_blsIdIsEqual = Module["_blsIdIsEqual"] = wasmExports["Qc"])(a0, a1);

var _blsSecretKeyIsEqual = Module["_blsSecretKeyIsEqual"] = (a0, a1) => (_blsSecretKeyIsEqual = Module["_blsSecretKeyIsEqual"] = wasmExports["Rc"])(a0, a1);

var _blsPublicKeyIsEqual = Module["_blsPublicKeyIsEqual"] = (a0, a1) => (_blsPublicKeyIsEqual = Module["_blsPublicKeyIsEqual"] = wasmExports["Sc"])(a0, a1);

var _blsSignatureIsEqual = Module["_blsSignatureIsEqual"] = (a0, a1) => (_blsSignatureIsEqual = Module["_blsSignatureIsEqual"] = wasmExports["Tc"])(a0, a1);

var _blsIdIsZero = Module["_blsIdIsZero"] = a0 => (_blsIdIsZero = Module["_blsIdIsZero"] = wasmExports["Uc"])(a0);

var _blsSecretKeyIsZero = Module["_blsSecretKeyIsZero"] = a0 => (_blsSecretKeyIsZero = Module["_blsSecretKeyIsZero"] = wasmExports["Vc"])(a0);

var _blsPublicKeyIsZero = Module["_blsPublicKeyIsZero"] = a0 => (_blsPublicKeyIsZero = Module["_blsPublicKeyIsZero"] = wasmExports["Wc"])(a0);

var _blsSignatureIsZero = Module["_blsSignatureIsZero"] = a0 => (_blsSignatureIsZero = Module["_blsSignatureIsZero"] = wasmExports["Xc"])(a0);

var _blsSecretKeyShare = Module["_blsSecretKeyShare"] = (a0, a1, a2, a3) => (_blsSecretKeyShare = Module["_blsSecretKeyShare"] = wasmExports["Yc"])(a0, a1, a2, a3);

var _blsPublicKeyShare = Module["_blsPublicKeyShare"] = (a0, a1, a2, a3) => (_blsPublicKeyShare = Module["_blsPublicKeyShare"] = wasmExports["Zc"])(a0, a1, a2, a3);

var _blsSecretKeyRecover = Module["_blsSecretKeyRecover"] = (a0, a1, a2, a3) => (_blsSecretKeyRecover = Module["_blsSecretKeyRecover"] = wasmExports["_c"])(a0, a1, a2, a3);

var _blsPublicKeyRecover = Module["_blsPublicKeyRecover"] = (a0, a1, a2, a3) => (_blsPublicKeyRecover = Module["_blsPublicKeyRecover"] = wasmExports["$c"])(a0, a1, a2, a3);

var _blsSignatureRecover = Module["_blsSignatureRecover"] = (a0, a1, a2, a3) => (_blsSignatureRecover = Module["_blsSignatureRecover"] = wasmExports["ad"])(a0, a1, a2, a3);

var _blsSecretKeyAdd = Module["_blsSecretKeyAdd"] = (a0, a1) => (_blsSecretKeyAdd = Module["_blsSecretKeyAdd"] = wasmExports["bd"])(a0, a1);

var _blsSignatureVerifyOrder = Module["_blsSignatureVerifyOrder"] = a0 => (_blsSignatureVerifyOrder = Module["_blsSignatureVerifyOrder"] = wasmExports["cd"])(a0);

var _blsPublicKeyVerifyOrder = Module["_blsPublicKeyVerifyOrder"] = a0 => (_blsPublicKeyVerifyOrder = Module["_blsPublicKeyVerifyOrder"] = wasmExports["dd"])(a0);

var _blsSignatureIsValidOrder = Module["_blsSignatureIsValidOrder"] = a0 => (_blsSignatureIsValidOrder = Module["_blsSignatureIsValidOrder"] = wasmExports["ed"])(a0);

var _blsPublicKeyIsValidOrder = Module["_blsPublicKeyIsValidOrder"] = a0 => (_blsPublicKeyIsValidOrder = Module["_blsPublicKeyIsValidOrder"] = wasmExports["fd"])(a0);

var _blsVerifyAggregatedHashes = Module["_blsVerifyAggregatedHashes"] = (a0, a1, a2, a3, a4) => (_blsVerifyAggregatedHashes = Module["_blsVerifyAggregatedHashes"] = wasmExports["gd"])(a0, a1, a2, a3, a4);

var _blsSignHash = Module["_blsSignHash"] = (a0, a1, a2, a3) => (_blsSignHash = Module["_blsSignHash"] = wasmExports["hd"])(a0, a1, a2, a3);

var _blsPublicKeySerializeUncompressed = Module["_blsPublicKeySerializeUncompressed"] = (a0, a1, a2) => (_blsPublicKeySerializeUncompressed = Module["_blsPublicKeySerializeUncompressed"] = wasmExports["id"])(a0, a1, a2);

var _blsSignatureSerializeUncompressed = Module["_blsSignatureSerializeUncompressed"] = (a0, a1, a2) => (_blsSignatureSerializeUncompressed = Module["_blsSignatureSerializeUncompressed"] = wasmExports["jd"])(a0, a1, a2);

var _blsPublicKeyDeserializeUncompressed = Module["_blsPublicKeyDeserializeUncompressed"] = (a0, a1, a2) => (_blsPublicKeyDeserializeUncompressed = Module["_blsPublicKeyDeserializeUncompressed"] = wasmExports["kd"])(a0, a1, a2);

var _blsSignatureDeserializeUncompressed = Module["_blsSignatureDeserializeUncompressed"] = (a0, a1, a2) => (_blsSignatureDeserializeUncompressed = Module["_blsSignatureDeserializeUncompressed"] = wasmExports["ld"])(a0, a1, a2);

var _blsVerifyPairing = Module["_blsVerifyPairing"] = (a0, a1, a2) => (_blsVerifyPairing = Module["_blsVerifyPairing"] = wasmExports["md"])(a0, a1, a2);

var _blsVerifyHash = Module["_blsVerifyHash"] = (a0, a1, a2, a3) => (_blsVerifyHash = Module["_blsVerifyHash"] = wasmExports["nd"])(a0, a1, a2, a3);

var _blsSecretKeySub = Module["_blsSecretKeySub"] = (a0, a1) => (_blsSecretKeySub = Module["_blsSecretKeySub"] = wasmExports["od"])(a0, a1);

var _blsPublicKeySub = Module["_blsPublicKeySub"] = (a0, a1) => (_blsPublicKeySub = Module["_blsPublicKeySub"] = wasmExports["pd"])(a0, a1);

var _blsSignatureSub = Module["_blsSignatureSub"] = (a0, a1) => (_blsSignatureSub = Module["_blsSignatureSub"] = wasmExports["qd"])(a0, a1);

var _blsSecretKeyNeg = Module["_blsSecretKeyNeg"] = a0 => (_blsSecretKeyNeg = Module["_blsSecretKeyNeg"] = wasmExports["rd"])(a0);

var _blsPublicKeyNeg = Module["_blsPublicKeyNeg"] = a0 => (_blsPublicKeyNeg = Module["_blsPublicKeyNeg"] = wasmExports["sd"])(a0);

var _blsSignatureNeg = Module["_blsSignatureNeg"] = a0 => (_blsSignatureNeg = Module["_blsSignatureNeg"] = wasmExports["td"])(a0);

var _blsSecretKeyMul = Module["_blsSecretKeyMul"] = (a0, a1) => (_blsSecretKeyMul = Module["_blsSecretKeyMul"] = wasmExports["ud"])(a0, a1);

var _blsPublicKeyMul = Module["_blsPublicKeyMul"] = (a0, a1) => (_blsPublicKeyMul = Module["_blsPublicKeyMul"] = wasmExports["vd"])(a0, a1);

var _blsSignatureMul = Module["_blsSignatureMul"] = (a0, a1) => (_blsSignatureMul = Module["_blsSignatureMul"] = wasmExports["wd"])(a0, a1);

var _blsPublicKeyMulVec = Module["_blsPublicKeyMulVec"] = (a0, a1, a2, a3) => (_blsPublicKeyMulVec = Module["_blsPublicKeyMulVec"] = wasmExports["xd"])(a0, a1, a2, a3);

var _blsSignatureMulVec = Module["_blsSignatureMulVec"] = (a0, a1, a2, a3) => (_blsSignatureMulVec = Module["_blsSignatureMulVec"] = wasmExports["yd"])(a0, a1, a2, a3);

var _blsGetOpUnitSize = Module["_blsGetOpUnitSize"] = () => (_blsGetOpUnitSize = Module["_blsGetOpUnitSize"] = wasmExports["zd"])();

var _blsGetCurveOrder = Module["_blsGetCurveOrder"] = (a0, a1) => (_blsGetCurveOrder = Module["_blsGetCurveOrder"] = wasmExports["Ad"])(a0, a1);

var _blsGetFieldOrder = Module["_blsGetFieldOrder"] = (a0, a1) => (_blsGetFieldOrder = Module["_blsGetFieldOrder"] = wasmExports["Bd"])(a0, a1);

var _blsGetSerializedSecretKeyByteSize = Module["_blsGetSerializedSecretKeyByteSize"] = () => (_blsGetSerializedSecretKeyByteSize = Module["_blsGetSerializedSecretKeyByteSize"] = wasmExports["Cd"])();

var _blsGetFrByteSize = Module["_blsGetFrByteSize"] = () => (_blsGetFrByteSize = Module["_blsGetFrByteSize"] = wasmExports["Dd"])();

var _blsGetSerializedPublicKeyByteSize = Module["_blsGetSerializedPublicKeyByteSize"] = () => (_blsGetSerializedPublicKeyByteSize = Module["_blsGetSerializedPublicKeyByteSize"] = wasmExports["Ed"])();

var _blsGetG1ByteSize = Module["_blsGetG1ByteSize"] = () => (_blsGetG1ByteSize = Module["_blsGetG1ByteSize"] = wasmExports["Fd"])();

var _blsGetSerializedSignatureByteSize = Module["_blsGetSerializedSignatureByteSize"] = () => (_blsGetSerializedSignatureByteSize = Module["_blsGetSerializedSignatureByteSize"] = wasmExports["Gd"])();

var _blsGetGeneratorOfPublicKey = Module["_blsGetGeneratorOfPublicKey"] = a0 => (_blsGetGeneratorOfPublicKey = Module["_blsGetGeneratorOfPublicKey"] = wasmExports["Hd"])(a0);

var _blsSetGeneratorOfPublicKey = Module["_blsSetGeneratorOfPublicKey"] = a0 => (_blsSetGeneratorOfPublicKey = Module["_blsSetGeneratorOfPublicKey"] = wasmExports["Id"])(a0);

var _blsIdSetDecStr = Module["_blsIdSetDecStr"] = (a0, a1, a2) => (_blsIdSetDecStr = Module["_blsIdSetDecStr"] = wasmExports["Jd"])(a0, a1, a2);

var _blsIdSetHexStr = Module["_blsIdSetHexStr"] = (a0, a1, a2) => (_blsIdSetHexStr = Module["_blsIdSetHexStr"] = wasmExports["Kd"])(a0, a1, a2);

var _blsIdSetLittleEndian = Module["_blsIdSetLittleEndian"] = (a0, a1, a2) => (_blsIdSetLittleEndian = Module["_blsIdSetLittleEndian"] = wasmExports["Ld"])(a0, a1, a2);

var _blsIdGetDecStr = Module["_blsIdGetDecStr"] = (a0, a1, a2) => (_blsIdGetDecStr = Module["_blsIdGetDecStr"] = wasmExports["Md"])(a0, a1, a2);

var _blsIdGetHexStr = Module["_blsIdGetHexStr"] = (a0, a1, a2) => (_blsIdGetHexStr = Module["_blsIdGetHexStr"] = wasmExports["Nd"])(a0, a1, a2);

var _blsHashToSecretKey = Module["_blsHashToSecretKey"] = (a0, a1, a2) => (_blsHashToSecretKey = Module["_blsHashToSecretKey"] = wasmExports["Od"])(a0, a1, a2);

var _blsGetPop = Module["_blsGetPop"] = (a0, a1) => (_blsGetPop = Module["_blsGetPop"] = wasmExports["Pd"])(a0, a1);

var _blsVerifyPop = Module["_blsVerifyPop"] = (a0, a1) => (_blsVerifyPop = Module["_blsVerifyPop"] = wasmExports["Qd"])(a0, a1);

var _blsIdGetLittleEndian = Module["_blsIdGetLittleEndian"] = (a0, a1, a2) => (_blsIdGetLittleEndian = Module["_blsIdGetLittleEndian"] = wasmExports["Rd"])(a0, a1, a2);

var _blsSecretKeySetDecStr = Module["_blsSecretKeySetDecStr"] = (a0, a1, a2) => (_blsSecretKeySetDecStr = Module["_blsSecretKeySetDecStr"] = wasmExports["Sd"])(a0, a1, a2);

var _blsSecretKeySetHexStr = Module["_blsSecretKeySetHexStr"] = (a0, a1, a2) => (_blsSecretKeySetHexStr = Module["_blsSecretKeySetHexStr"] = wasmExports["Td"])(a0, a1, a2);

var _blsSecretKeyGetLittleEndian = Module["_blsSecretKeyGetLittleEndian"] = (a0, a1, a2) => (_blsSecretKeyGetLittleEndian = Module["_blsSecretKeyGetLittleEndian"] = wasmExports["Ud"])(a0, a1, a2);

var _blsSecretKeyGetDecStr = Module["_blsSecretKeyGetDecStr"] = (a0, a1, a2) => (_blsSecretKeyGetDecStr = Module["_blsSecretKeyGetDecStr"] = wasmExports["Vd"])(a0, a1, a2);

var _blsSecretKeyGetHexStr = Module["_blsSecretKeyGetHexStr"] = (a0, a1, a2) => (_blsSecretKeyGetHexStr = Module["_blsSecretKeyGetHexStr"] = wasmExports["Wd"])(a0, a1, a2);

var _blsPublicKeySetHexStr = Module["_blsPublicKeySetHexStr"] = (a0, a1, a2) => (_blsPublicKeySetHexStr = Module["_blsPublicKeySetHexStr"] = wasmExports["Xd"])(a0, a1, a2);

var _blsPublicKeyGetHexStr = Module["_blsPublicKeyGetHexStr"] = (a0, a1, a2) => (_blsPublicKeyGetHexStr = Module["_blsPublicKeyGetHexStr"] = wasmExports["Yd"])(a0, a1, a2);

var _blsSignatureSetHexStr = Module["_blsSignatureSetHexStr"] = (a0, a1, a2) => (_blsSignatureSetHexStr = Module["_blsSignatureSetHexStr"] = wasmExports["Zd"])(a0, a1, a2);

var _blsSignatureGetHexStr = Module["_blsSignatureGetHexStr"] = (a0, a1, a2) => (_blsSignatureGetHexStr = Module["_blsSignatureGetHexStr"] = wasmExports["_d"])(a0, a1, a2);

var _blsDHKeyExchange = Module["_blsDHKeyExchange"] = (a0, a1, a2) => (_blsDHKeyExchange = Module["_blsDHKeyExchange"] = wasmExports["$d"])(a0, a1, a2);

var _blsMultiAggregateSignature = Module["_blsMultiAggregateSignature"] = (a0, a1, a2, a3) => (_blsMultiAggregateSignature = Module["_blsMultiAggregateSignature"] = wasmExports["ae"])(a0, a1, a2, a3);

var _blsMultiAggregatePublicKey = Module["_blsMultiAggregatePublicKey"] = (a0, a1, a2) => (_blsMultiAggregatePublicKey = Module["_blsMultiAggregatePublicKey"] = wasmExports["be"])(a0, a1, a2);

var calledRun;

dependenciesFulfilled = function runCaller() {
 if (!calledRun) run();
 if (!calledRun) dependenciesFulfilled = runCaller;
};

function run() {
 if (runDependencies > 0) {
  return;
 }
 preRun();
 if (runDependencies > 0) {
  return;
 }
 function doRun() {
  if (calledRun) return;
  calledRun = true;
  Module["calledRun"] = true;
  if (ABORT) return;
  initRuntime();
  readyPromiseResolve(Module);
  if (Module["onRuntimeInitialized"]) Module["onRuntimeInitialized"]();
  postRun();
 }
 if (Module["setStatus"]) {
  Module["setStatus"]("Running...");
  setTimeout(function() {
   setTimeout(function() {
    Module["setStatus"]("");
   }, 1);
   doRun();
  }, 1);
 } else {
  doRun();
 }
}

if (Module["preInit"]) {
 if (typeof Module["preInit"] == "function") Module["preInit"] = [ Module["preInit"] ];
 while (Module["preInit"].length > 0) {
  Module["preInit"].pop()();
 }
}

run();


  return moduleArg.ready
}
);
})();
if (typeof exports === 'object' && typeof module === 'object')
  module.exports = Module;
else if (typeof define === 'function' && define['amd'])
  define([], () => Module);
