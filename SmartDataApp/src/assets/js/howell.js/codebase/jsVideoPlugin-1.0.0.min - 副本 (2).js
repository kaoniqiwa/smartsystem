(function e(t, n) {
if (typeof exports === "object" && typeof module === "object") module.exports = n();
else if (typeof define === "function" && define.amd) define([], n);
else {
var i = n();
for (var r in i) (typeof exports === "object" ? exports : t)[r] = i[r] } })(window, function () {
return function (e) {
var t = {};
function n(i) {
if (t[i]) {
return t[i].exports }
var r = t[i] = {
i: i, l: false, exports: {} };
e[i].call(r.exports, r, r.exports, n);
r.l = true;
return r.exports } n.m = e;
n.c = t;
n.d = function (e, t, i) {
if (!n.o(e, t)) {
Object.defineProperty(e, t, {
enumerable: true, get: i }) } };
n.r = function (e) {
if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
Object.defineProperty(e, Symbol.toStringTag, {
value: "Module" }) } Object.defineProperty(e, "__esModule", {
value: true }) };
n.t = function (e, t) {
if (t & 1) e = n(e);
if (t & 8)
return e;
if (t & 4 && typeof e === "object" && e && e.__esModule)
return e;
var i = Object.create(null);
n.r(i);
Object.defineProperty(i, "default", {
enumerable: true, value: e });
if (t & 2 && typeof e != "string") for (var r in e) n.d(i, r, function (t) {
return e[t] }.bind(null, r));
return i };
n.n = function (e) {
var t = e && e.__esModule ? function i() {
return e["default"] } : function r() {
return e };
n.d(t, "a", t);
return t };
n.o = function (e, t) {
return Object.prototype.hasOwnProperty.call(e, t) };
n.p = "";
return n(n.s = 13) }([function (e, t, n) {
"use strict";
var i = typeof Uint8Array !== "undefined" && typeof Uint16Array !== "undefined" && typeof Int32Array !== "undefined";
function r(e, t) {
return Object.prototype.hasOwnProperty.call(e, t) } t.assign = function (e) {
var t = Array.prototype.slice.call(arguments, 1);
while (t.length) {
var n = t.shift();
if (!n) {
continue } if (typeof n !== "object") {
throw new TypeError(n + "must be non-object") } for (var i in n) {
if (r(n, i)) {
e[i] = n[i] } } }
return e };
t.shrinkBuf = function (e, t) {
if (e.length === t) {
return e } if (e.subarray) {
return e.subarray(0, t) } e.length = t;
return e };
var o = {
arraySet: function (e, t, n, i, r) {
if (t.subarray && e.subarray) {
e.set(t.subarray(n, n + i), r);
return } for (var o = 0;
o < i;
o++) {
e[r + o] = t[n + o] } }, flattenChunks: function (e) {
var t, n, i, r, o, a;
i = 0;
for (t = 0, n = e.length;
t < n;
t++) {
i += e[t].length } a = new Uint8Array(i);
r = 0;
for (t = 0, n = e.length;
t < n;
t++) {
o = e[t];
a.set(o, r);
r += o.length }
return a } };
var a = {
arraySet: function (e, t, n, i, r) {
for (var o = 0;
o < i;
o++) {
e[r + o] = t[n + o] } }, flattenChunks: function (e) {
return [].concat.apply([], e) } };
t.setTyped = function (e) {
if (e) {
t.Buf8 = Uint8Array;
t.Buf16 = Uint16Array;
t.Buf32 = Int32Array;
t.assign(t, o) } else {
t.Buf8 = Array;
t.Buf16 = Array;
t.Buf32 = Array;
t.assign(t, a) } };
t.setTyped(i) }, function (e, t, n) {
var i = n(17);
var r = n(18);
var o = r;
o.v1 = i;
o.v4 = r;
e.exports = o }, function (e, t, n) {
"use strict";
Object.defineProperty(t, "__esModule", {
value: true });
var i = function () {
function e(e, t) {
for (var n = 0;
n < t.length;
n++) {
var i = t[n];
i.enumerable = i.enumerable || false;
i.configurable = true;
if ("value" in i) i.writable = true;
Object.defineProperty(e, i.key, i) } }
return function (t, n, i) {
if (n) e(t.prototype, n);
if (i) e(t, i);
return t } }();
function r(e, t) {
if (!(e instanceof t)) {
throw new TypeError("Cannot call a class as a function") } }
var o = function () {
function e() {
r(this, e) } i(e, [{
key: "browser", value: function t() {
var e = /(edge)[/]([\w.]+)/;
var t = /(chrome)[/]([\w.]+)/;
var n = /(safari)[/]([\w.]+)/;
var i = /(opera)(?:.*version)?[/]([\w.]+)/;
var r = /(msie) ([\w.]+)/;
var o = /(trident.*rv:)([\w.]+)/;
var a = /(mozilla)(?:.*? rv:([\w.]+))?/;
var s = navigator.userAgent.toLowerCase();
var u = e.exec(s) || t.exec(s) || n.exec(s) || i.exec(s) || r.exec(s) || o.exec(s) || s.indexOf("compatible") < 0 && a.exec(s) || ["unknow", "0"];
if (u.length > 0 && u[1].indexOf("trident") > -1) {
u[1] = "msie" }
var l = {};
l[u[1]] = true;
l.version = u[2];
return l } }, {
key: "getCreateWndMode", value: function n() {
var e = navigator.userAgent;
var t = navigator.platform;
var n = "Win64" === t || "Win32" === t || "Windows" === t;
var i = this.browser();
var r = true;
if (window.top !== window) {
r = false } else {
if (n) {
if (e.indexOf("Windows NT 10.0") > -1 && i.chrome) {
r = false } if (i.edge) {
r = false } } else {
r = false } }
return r } }, {
key: "getWndPostion", value: function o(e, t, n) {
var i = 0;
var r = 0;
var o = e.offset();
var a = this.getDevicePixelRatio();
var s = parseInt(e.css("border-left-width"), 10);
var u = parseInt(e.css("border-top-width"), 10);
if (t) {
if (this.browser().msie) {
var l = window.outerWidth - window.innerWidth - (window.screenLeft - window.screenX);
i = o.left + (window.screenLeft - window.screenX) + s - l;
r = o.top + (window.screenTop - window.screenY) + u } else {
var f = 0;
var c = 0;
var h = Math.round((window.outerWidth - window.innerWidth) / 2);
if (this.browser().chrome) {
if (-8 === h || 0 === window.screen.height - window.outerHeight) {
if (-8 === h) {
f = 8;
c = 8 } } else if (8 === h) {
f = -5 } else if (0 === h) {
c = 8 } } if (this.browser().mozilla) {
if (7 === h || 6 === h) {
f = -6 } else if (8 === h) {
f = -8 } else if (0 === h) {} if (window.opener) {
f = f - 8;
c = c - 30;
if (8 === h) {
f = f + 8 } } } i = o.left + h + s + f;
r = o.top + (window.outerHeight - window.innerHeight - h) + u + c } } else {
if (this.browser().msie) {
var d = window.outerWidth - window.innerWidth - (window.screenLeft - window.screenX);
i = o.left + (window.screenLeft - window.screenX) + s - d;
r = o.top + (window.screenTop - window.screenY) + u } else {
var v = (window.outerWidth - window.innerWidth) / 2;
i = o.left + v + s;
r = o.top + (window.outerHeight - window.innerHeight - v) + u;
if (this.browser().chrome) {
if (0 === v) {
i += 8;
r += 8 } } } } if (this.browser().chrome) {
i = o.left + s;
r = o.top + u }
var p = 0;
var m = 0;
if (n && $("#" + n).length) {
var y = $("#" + n).offset();
if (!this.browser().msie) {
p = window.scrollX;
m = window.scrollY }
var S = Math.round((y.left - p) * a);
var g = Math.round((y.top - m) * a);
i += S;
r += g } else {
if (!this.browser().msie) {
p = window.scrollX;
m = window.scrollY } i = Math.round((i - p) * a);
r = Math.round((r - m) * a) }
return {
left: i, top: r } } }, {
key: "detectPort", value: function a(e, t, n) {
var i = this;
var r = [];
var o = null;
if (sessionStorage) {
o = sessionStorage.getItem("LocalServiceControlPort");
if (o !== null) {
o = parseInt(o, 10) } } for (var a = e;
a <= t;
a++) {
if (a === o) {
continue } r.push(a) } if (o !== null) {
r.unshift(o) }
var s = 0;
var u = function v() {
s++;
if (r.length === s && n.error) {
n.error() } };
var l = function p(e) {
if (sessionStorage) {
sessionStorage.setItem("LocalServiceControlPort", e) } if (n.success) {
n.success(e) } };
var f = (new Date).getTime();
var c = function m(e, t) {
setTimeout(function () {
i.createImageHttp(r[t], {
oSessionInfo: n.oSessionInfo, timeStamp: f + t, success: function e(t) {
l(t) }, error: function o() {
u() } }) }, 100) };
for (var h = 0, d = r.length;
h < d;
h++) {
c(d, h) } } }, {
key: "createImageHttp", value: function s(e, t) {
var n = new Image;
n.onload = function () {
if (t.success) {
t.success(e) } };
n.onerror = function () {
if (t.error) {
t.error() } };
n.onabort = function () {
if (t.abort) {
t.abort() } };
var i = "http://127.0.0.1:" + e + "/imghttp/local?update=" + t.timeStamp;
var r = t.oSessionInfo;
if (r) {
i += "&sessionID=" + r.sessionID + "&user=" + r.user + "&challenge=" + r.challenge + "&iterations=" + r.iterations + "&random=" + r.random } n.src = i } }, {
key: "utf8to16", value: function u(e) {
var t = "";
var n = 0;
var i = void 0;
var r = void 0;
var o = void 0;
var a = void 0;
i = e.length;
while (n < i) {
r = e.charCodeAt(n++);
switch (r >> 4) {
case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7: t += e.charAt(n - 1);
break;
case 12: case 13: o = e.charCodeAt(n++);
t += String.fromCharCode((r & 31) << 6 | o & 63);
break;
case 14: o = e.charCodeAt(n++);
a = e.charCodeAt(n++);
t += String.fromCharCode((r & 15) << 12 | (o & 63) << 6 | (a & 63) << 0);
break;
default:
break } }
return t } }, {
key: "createEventScript", value: function l(e, t, n) {
var i = document.createElement("script");
i.htmlFor = e;
i.event = t;
i.innerHTML = n;
document.getElementById(e).appendChild(i) } }, {
key: "getDevicePixelRatio", value: function f() {
var e = window.devicePixelRatio || window.screen.deviceXDPI / window.screen.logicalXDPI;
return e } }, {
key: "createxmlDoc", value: function c() {
var e;
var t = ["MSXML2.DOMDocument", "MSXML2.DOMDocument.5.0", "MSXML2.DOMDocument.4.0", "MSXML2.DOMDocument.3.0", "Microsoft.XmlDom"];
for (var n = 0, i = t.length;
n < i;
n++) {
try {
e = new ActiveXObject(t[n]);
break } catch (r) {
e = document.implementation.createDocument("", "", null);
break } } e.async = "false";
return e } }, {
key: "parseXmlFromStr", value: function h(e) {
if (null === e || "" === e) {
return null }
var t = this.createxmlDoc();
if (navigator.appName === "Netscape" || navigator.appName === "Opera") {
var n = new DOMParser;
t = n.parseFromString(e, "text/xml") } else {
t.loadXML(e) }
return t } }]);
return e }();
var a = t.oUtils = new o }, function (e, t, n) {
"use strict";
e.exports = {
2: "need dictionary", 1: "stream end", 0: "", "-1": "file error", "-2": "stream error", "-3": "data error", "-4": "insufficient memory", "-5": "buffer error", "-6": "incompatible version" } }, function (e, t, n) {
"use strict";
Object.defineProperty(t, "__esModule", {
value: true });
var i = function () {
function e(e, t) {
for (var n = 0;
n < t.length;
n++) {
var i = t[n];
i.enumerable = i.enumerable || false;
i.configurable = true;
if ("value" in i) i.writable = true;
Object.defineProperty(e, i.key, i) } }
return function (t, n, i) {
if (n) e(t.prototype, n);
if (i) e(t, i);
return t } }();
function r(e, t) {
if (!(e instanceof t)) {
throw new TypeError("Cannot call a class as a function") } }
var o = function () {
function e() {
r(this, e);
this._keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=" } i(e, [{
key: "$", value: function t(e) {
var t = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/;
var n = /^(?:\s*(<[\w\W]+>)[^>]*|.([\w-]*))$/;
if (t.test(e)) {
var i = t.exec(e);
return document.getElementById(i[2]) } else if (n.test(e)) {
var r = n.exec(e);
var o = document.getElementsByTagName("*");
var a = [];
for (var s = 0, u = o.length;
s < u;
s++) {
if (o[s].className.match(new RegExp("(\\s|^)" + r[2] + "(\\s|$)"))) {
a.push(o[s]) } }
return a } } }, {
key: "dateFormat", value: function n(e, t) {
var n = {
"M+": e.getMonth() + 1, "d+": e.getDate(), "h+": e.getHours(), "m+": e.getMinutes(), "s+": e.getSeconds(), "q+": Math.floor((e.getMonth() + 3) / 3), S: e.getMilliseconds() };
if (/(y+)/.test(t)) {
t = t.replace(RegExp.$1, (e.getFullYear() + "").substr(4 - RegExp.$1.length)) } for (var i in n) {
if (new RegExp("(" + i + ")").test(t)) {
t = t.replace(RegExp.$1, RegExp.$1.length === 1 ? n[i] : ("00" + n[i]).substr(("" + n[i]).length)) } }
return t } }, {
key: "downloadFile", value: function o(e, t) {
var n = e;
if (!(e instanceof Blob || e instanceof File)) {
n = new Blob([e]) }
var i = window.URL.createObjectURL(n);
var r = window.document.createElement("a");
r.href = i;
r.download = t;
var o = document.createEvent("MouseEvents");
o.initEvent("click", true, true);
r.dispatchEvent(o) } }, {
key: "createxmlDoc", value: function a() {
var e;
var t = ["MSXML2.DOMDocument", "MSXML2.DOMDocument.5.0", "MSXML2.DOMDocument.4.0", "MSXML2.DOMDocument.3.0", "Microsoft.XmlDom"];
for (var n = 0, i = t.length;
n < i;
n++) {
try {
e = new ActiveXObject(t[n]);
break } catch (r) {
e = document.implementation.createDocument("", "", null);
break } } e.async = "false";
return e } }, {
key: "parseXmlFromStr", value: function s(e) {
if (null === e || "" === e) {
return null }
var t = this.createxmlDoc();
if (navigator.appName === "Netscape" || navigator.appName === "Opera") {
var n = new DOMParser;
t = n.parseFromString(e, "text/xml") } else {
t.loadXML(e) }
return t } }, {
key: "encode", value: function u(e) {
var t = "";
var n;
var i;
var r;
var o;
var a;
var s;
var u;
var l = 0;
e = this._utf8_encode(e);
while (l < e.length) {
n = e.charCodeAt(l++);
i = e.charCodeAt(l++);
r = e.charCodeAt(l++);
o = n >> 2;
a = (n & 3) << 4 | i >> 4;
s = (i & 15) << 2 | r >> 6;
u = r & 63;
if (isNaN(i)) {
s = u = 64 } else if (isNaN(r)) {
u = 64 } t = t + this._keyStr.charAt(o) + this._keyStr.charAt(a) + this._keyStr.charAt(s) + this._keyStr.charAt(u) }
return t } }, {
key: "decode", value: function l(e) {
var t = "";
var n;
var i;
var r;
var o;
var a;
var s;
var u;
var l = 0;
e = e.replace(/[^A-Za-z0-9+/=]/g, "");
while (l < e.length) {
o = this._keyStr.indexOf(e.charAt(l++));
a = this._keyStr.indexOf(e.charAt(l++));
s = this._keyStr.indexOf(e.charAt(l++));
u = this._keyStr.indexOf(e.charAt(l++));
n = o << 2 | a >> 4;
i = (a & 15) << 4 | s >> 2;
r = (s & 3) << 6 | u;
t = t + String.fromCharCode(n);
if (s !== 64) {
t = t + String.fromCharCode(i) } if (u !== 64) {
t = t + String.fromCharCode(r) } } t = this._utf8_decode(t);
return t } }, {
key: "_utf8_encode", value: function f(e) {
e = e.replace(/\r\n/g, "\n");
var t = "";
for (var n = 0;
n < e.length;
n++) {
var i = e.charCodeAt(n);
if (i < 128) {
t += String.fromCharCode(i) } else if (i > 127 && i < 2048) {
t += String.fromCharCode(i >> 6 | 192);
t += String.fromCharCode(i & 63 | 128) } else {
t += String.fromCharCode(i >> 12 | 224);
t += String.fromCharCode(i >> 6 & 63 | 128);
t += String.fromCharCode(i & 63 | 128) } }
return t } }, {
key: "_utf8_decode", value: function c(e) {
var t = "";
var n = 0;
var i = 0;
var r = 0;
while (n < e.length) {
i = e.charCodeAt(n);
if (i < 128) {
t += String.fromCharCode(i);
n++ } else if (i > 191 && i < 224) {
r = e.charCodeAt(n + 1);
t += String.fromCharCode((i & 31) << 6 | r & 63);
n += 2 } else {
r = e.charCodeAt(n + 1);
var o = e.charCodeAt(n + 2);
t += String.fromCharCode((i & 15) << 12 | (r & 63) << 6 | o & 63);
n += 3 } }
return t } }, {
key: "isFirefox", value: function h() {
var e = false;
var t = navigator.userAgent.toLowerCase();
var n = "";
var i = -1;
if (t.match(/firefox\/([\d.]+)/)) {
n = t.match(/firefox\/([\d.]+)/)[1];
i = parseInt(n.split(".")[0], 10);
if (i > -1) {
e = true } }
return e } }, {
key: "isSafari", value: function d() {
var e = false;
var t = navigator.userAgent.toLowerCase();
var n = "";
var i = -1;
if (t.match(/version\/([\d.]+).safari./)) {
n = t.match(/version\/([\d.]+).safari./)[1];
i = parseInt(n.split(".")[0], 10);
if (i > -1) {
e = true } }
return e } }, {
key: "isEdge", value: function v() {
return navigator.userAgent.toLowerCase().indexOf("edge") > -1 } }]);
return e }();
var a = t.oTool = new o }, function (e, t) {
var n = typeof crypto != "undefined" && crypto.getRandomValues && crypto.getRandomValues.bind(crypto) || typeof msCrypto != "undefined" && typeof window.msCrypto.getRandomValues == "function" && msCrypto.getRandomValues.bind(msCrypto);
if (n) {
var i = new Uint8Array(16);
e.exports = function t() {
n(i);
return i } } else {
var r = new Array(16);
e.exports = function t() {
for (var e = 0, t;
e < 16;
e++) {
if ((e & 3) === 0) t = Math.random() * 4294967296;
r[e] = t >>> ((e & 3) << 3) & 255 }
return r } } }, function (e, t) {
var n = [];
for (var i = 0;
i < 256;
++i) {
n[i] = (i + 256).toString(16).substr(1) } function r(e, t) {
var i = t || 0;
var r = n;
return [r[e[i++]], r[e[i++]], r[e[i++]], r[e[i++]], "-", r[e[i++]], r[e[i++]], "-", r[e[i++]], r[e[i++]], "-", r[e[i++]], r[e[i++]], "-", r[e[i++]], r[e[i++]], r[e[i++]], r[e[i++]], r[e[i++]], r[e[i++]]].join("") } e.exports = r }, function (e, t, n) {
"use strict";
function i(e, t, n, i) {
var r = e & 65535 | 0, o = e >>> 16 & 65535 | 0, a = 0;
while (n !== 0) {
a = n > 2e3 ? 2e3 : n;
n -= a;
do {
r = r + t[i++] | 0;
o = o + r | 0 } while (--a);
r %= 65521;
o %= 65521 }
return r | o << 16 | 0 } e.exports = i }, function (e, t, n) {
"use strict";
function i() {
var e, t = [];
for (var n = 0;
n < 256;
n++) {
e = n;
for (var i = 0;
i < 8;
i++) {
e = e & 1 ? 3988292384 ^ e >>> 1 : e >>> 1 } t[n] = e }
return t }
var r = i();
function o(e, t, n, i) {
var o = r, a = i + n;
e ^= -1;
for (var s = i;
s < a;
s++) {
e = e >>> 8 ^ o[(e ^ t[s]) & 255] }
return e ^ -1 } e.exports = o }, function (e, t, n) {
"use strict";
var i = n(0);
var r = true;
var o = true;
try {
String.fromCharCode.apply(null, [0]) } catch (l) {
r = false } try {
String.fromCharCode.apply(null, new Uint8Array(1)) } catch (l) {
o = false }
var a = new i.Buf8(256);
for (var s = 0;
s < 256;
s++) {
a[s] = s >= 252 ? 6 : s >= 248 ? 5 : s >= 240 ? 4 : s >= 224 ? 3 : s >= 192 ? 2 : 1 } a[254] = a[254] = 1;
t.string2buf = function (e) {
var t, n, r, o, a, s = e.length, u = 0;
for (o = 0;
o < s;
o++) {
n = e.charCodeAt(o);
if ((n & 64512) === 55296 && o + 1 < s) {
r = e.charCodeAt(o + 1);
if ((r & 64512) === 56320) {
n = 65536 + (n - 55296 << 10) + (r - 56320);
o++ } } u += n < 128 ? 1 : n < 2048 ? 2 : n < 65536 ? 3 : 4 } t = new i.Buf8(u);
for (a = 0, o = 0;
a < u;
o++) {
n = e.charCodeAt(o);
if ((n & 64512) === 55296 && o + 1 < s) {
r = e.charCodeAt(o + 1);
if ((r & 64512) === 56320) {
n = 65536 + (n - 55296 << 10) + (r - 56320);
o++ } } if (n < 128) {
t[a++] = n } else if (n < 2048) {
t[a++] = 192 | n >>> 6;
t[a++] = 128 | n & 63 } else if (n < 65536) {
t[a++] = 224 | n >>> 12;
t[a++] = 128 | n >>> 6 & 63;
t[a++] = 128 | n & 63 } else {
t[a++] = 240 | n >>> 18;
t[a++] = 128 | n >>> 12 & 63;
t[a++] = 128 | n >>> 6 & 63;
t[a++] = 128 | n & 63 } }
return t };
function u(e, t) {
if (t < 65537) {
if (e.subarray && o || !e.subarray && r) {
return String.fromCharCode.apply(null, i.shrinkBuf(e, t)) } }
var n = "";
for (var a = 0;
a < t;
a++) {
n += String.fromCharCode(e[a]) }
return n } t.buf2binstring = function (e) {
return u(e, e.length) };
t.binstring2buf = function (e) {
var t = new i.Buf8(e.length);
for (var n = 0, r = t.length;
n < r;
n++) {
t[n] = e.charCodeAt(n) }
return t };
t.buf2string = function (e, t) {
var n, i, r, o;
var s = t || e.length;
var l = new Array(s * 2);
for (i = 0, n = 0;
n < s;) {
r = e[n++];
if (r < 128) {
l[i++] = r;
continue } o = a[r];
if (o > 4) {
l[i++] = 65533;
n += o - 1;
continue } r &= o === 2 ? 31 : o === 3 ? 15 : 7;
while (o > 1 && n < s) {
r = r << 6 | e[n++] & 63;
o-- } if (o > 1) {
l[i++] = 65533;
continue } if (r < 65536) {
l[i++] = r } else {
r -= 65536;
l[i++] = 55296 | r >> 10 & 1023;
l[i++] = 56320 | r & 1023 } }
return u(l, i) };
t.utf8border = function (e, t) {
var n;
t = t || e.length;
if (t > e.length) {
t = e.length } n = t - 1;
while (n >= 0 && (e[n] & 192) === 128) {
n-- } if (n < 0) {
return t } if (n === 0) {
return t }
return n + a[e[n]] > t ? n : t } }, function (e, t, n) {
"use strict";
function i() {
this.input = null;
this.next_in = 0;
this.avail_in = 0;
this.total_in = 0;
this.output = null;
this.next_out = 0;
this.avail_out = 0;
this.total_out = 0;
this.msg = "";
this.state = null;
this.data_type = 2;
this.adler = 0 } e.exports = i }, function (e, t, n) {
"use strict";
e.exports = {
Z_NO_FLUSH: 0, Z_PARTIAL_FLUSH: 1, Z_SYNC_FLUSH: 2, Z_FULL_FLUSH: 3, Z_FINISH: 4, Z_BLOCK: 5, Z_TREES: 6, Z_OK: 0, Z_STREAM_END: 1, Z_NEED_DICT: 2, Z_ERRNO: -1, Z_STREAM_ERROR: -2, Z_DATA_ERROR: -3, Z_BUF_ERROR: -5, Z_NO_COMPRESSION: 0, Z_BEST_SPEED: 1, Z_BEST_COMPRESSION: 9, Z_DEFAULT_COMPRESSION: -1, Z_FILTERED: 1, Z_HUFFMAN_ONLY: 2, Z_RLE: 3, Z_FIXED: 4, Z_DEFAULT_STRATEGY: 0, Z_BINARY: 0, Z_TEXT: 1, Z_UNKNOWN: 2, Z_DEFLATED: 8 } }, function (e, t, n) {
"use strict";
Object.defineProperty(t, "__esModule", {
value: true });
var i = function () {
function e(e, t) {
for (var n = 0;
n < t.length;
n++) {
var i = t[n];
i.enumerable = i.enumerable || false;
i.configurable = true;
if ("value" in i) i.writable = true;
Object.defineProperty(e, i.key, i) } }
return function (t, n, i) {
if (n) e(t.prototype, n);
if (i) e(t, i);
return t } }();
function r(e, t) {
if (!(e instanceof t)) {
throw new TypeError("Cannot call a class as a function") } }
var o = function () {
function e() {
r(this, e);
this._keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=" } i(e, [{
key: "browser", value: function t() {
var e = /(edge)[/]([\w.]+)/;
var t = /(chrome)[/]([\w.]+)/;
var n = /(safari)[/]([\w.]+)/;
var i = /(opera)(?:.*version)?[/]([\w.]+)/;
var r = /(msie) ([\w.]+)/;
var o = /(trident.*rv:)([\w.]+)/;
var a = /(mozilla)(?:.*? rv:([\w.]+))?/;
var s = navigator.userAgent.toLowerCase();
var u = e.exec(s) || t.exec(s) || n.exec(s) || i.exec(s) || r.exec(s) || o.exec(s) || s.indexOf("compatible") < 0 && a.exec(s) || ["unknow", "0"];
if (u.length > 0 && u[1].indexOf("trident") > -1) {
u[1] = "msie" }
var l = {};
l[u[1]] = true;
l.version = Math.floor(u[2].split(".")[0]);
if (l.safari) {
var f = s.indexOf("version/") + 8;
var c = s.indexOf(" safari/");
var h = s.slice(f, c);
l.version = Math.floor(h.split(".")[0]) }
return l } }, {
key: "createEventScript", value: function n(e, t, i) {
var r = document.createElement("script");
r.htmlFor = e;
r.event = t;
r.innerHTML = i;
document.getElementById(e).appendChild(r) } }, {
key: "createxmlDoc", value: function o() {
var e;
var t = ["MSXML2.DOMDocument", "MSXML2.DOMDocument.5.0", "MSXML2.DOMDocument.4.0", "MSXML2.DOMDocument.3.0", "Microsoft.XmlDom"];
for (var n = 0, i = t.length;
n < i;
n++) {
try {
e = new ActiveXObject(t[n]);
break } catch (r) {
e = document.implementation.createDocument("", "", null);
break } } e.async = "false";
return e } }, {
key: "parseXmlFromStr", value: function a(e) {
if (null === e || "" === e) {
return null }
var t = this.createxmlDoc();
if (navigator.appName === "Netscape" || navigator.appName === "Opera") {
var n = new DOMParser;
t = n.parseFromString(e, "text/xml") } else {
t.loadXML(e) }
return t } }, {
key: "isNotSupportNoPlugin", value: function s() {
var e = this.browser();
var t = false;
if (e.edge && e.version < 16) {
t = true } else if (e.safari && e.version < 11) {
t = true } else if (e.chrome && e.version < 57) {
t = true } else if (e.firfox && e.version < 52) {
t = true }
return t } }, {
key: "encode", value: function u(e) {
var t = "";
var n;
var i;
var r;
var o;
var a;
var s;
var u;
var l = 0;
e = this._utf8_encode(e);
while (l < e.length) {
n = e.charCodeAt(l++);
i = e.charCodeAt(l++);
r = e.charCodeAt(l++);
o = n >> 2;
a = (n & 3) << 4 | i >> 4;
s = (i & 15) << 2 | r >> 6;
u = r & 63;
if (isNaN(i)) {
s = u = 64 } else if (isNaN(r)) {
u = 64 } t = t + this._keyStr.charAt(o) + this._keyStr.charAt(a) + this._keyStr.charAt(s) + this._keyStr.charAt(u) }
return t } }, {
key: "decode", value: function l(e) {
var t = "";
var n;
var i;
var r;
var o;
var a;
var s;
var u;
var l = 0;
e = e.replace(/[^A-Za-z0-9+/=]/g, "");
while (l < e.length) {
o = this._keyStr.indexOf(e.charAt(l++));
a = this._keyStr.indexOf(e.charAt(l++));
s = this._keyStr.indexOf(e.charAt(l++));
u = this._keyStr.indexOf(e.charAt(l++));
n = o << 2 | a >> 4;
i = (a & 15) << 4 | s >> 2;
r = (s & 3) << 6 | u;
t = t + String.fromCharCode(n);
if (s !== 64) {
t = t + String.fromCharCode(i) } if (u !== 64) {
t = t + String.fromCharCode(r) } } t = this._utf8_decode(t);
return t } }, {
key: "_utf8_encode", value: function f(e) {
e = e.replace(/\r\n/g, "\n");
var t = "";
for (var n = 0;
n < e.length;
n++) {
var i = e.charCodeAt(n);
if (i < 128) {
t += String.fromCharCode(i) } else if (i > 127 && i < 2048) {
t += String.fromCharCode(i >> 6 | 192);
t += String.fromCharCode(i & 63 | 128) } else {
t += String.fromCharCode(i >> 12 | 224);
t += String.fromCharCode(i >> 6 & 63 | 128);
t += String.fromCharCode(i & 63 | 128) } }
return t } }, {
key: "_utf8_decode", value: function c(e) {
var t = "";
var n = 0;
var i = 0;
var r = 0;
while (n < e.length) {
i = e.charCodeAt(n);
if (i < 128) {
t += String.fromCharCode(i);
n++ } else if (i > 191 && i < 224) {
r = e.charCodeAt(n + 1);
t += String.fromCharCode((i & 31) << 6 | r & 63);
n += 2 } else {
r = e.charCodeAt(n + 1);
var o = e.charCodeAt(n + 2);
t += String.fromCharCode((i & 15) << 12 | (r & 63) << 6 | o & 63);
n += 3 } }
return t } }, {
key: "colorTransfer", value: function h(e) {
var t = parseInt(e, 10);
var n = t.toString(16);
n = "0" + n;
return n.substring(n.length - 2) } }, {
key: "colorRgb", value: function d(e) {
var t = e.toLowerCase();
var n = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
if (t && n.test(t)) {
if (t.length === 4) {
var i = "#";
for (var r = 1;
r < 4;
r += 1) {
i += t.slice(r, r + 1).concat(t.slice(r, r + 1)) } t = i }
var o = [];
for (var a = 1;
a < 7;
a += 2) {
o.push(parseInt("0x" + t.slice(a, a + 2), 16)) }
return o }
return [0, 0, 0] } }]);
return e }();
var a = t.oUtils = new o }, function (e, t, n) {
e.exports = n(14) }, function (e, t, n) {
"use strict";
Object.defineProperty(t, "__esModule", {
value: true });
t.JSVideoPlugin = undefined;
var i = function () {
function e(e, t) {
for (var n = 0;
n < t.length;
n++) {
var i = t[n];
i.enumerable = i.enumerable || false;
i.configurable = true;
if ("value" in i) i.writable = true;
Object.defineProperty(e, i.key, i) } }
return function (t, n, i) {
if (n) e(t.prototype, n);
if (i) e(t, i);
return t } }();
var r = n(15);
var o = n(28);
var a = n(42);
var s = n(12);
function u(e, t) {
if (!(e instanceof t)) {
throw new TypeError("Cannot call a class as a function") } }
var l = function () {
var e = function () {
function e(t) {
u(this, e);
var n = {
szId: "playWnd", iType: 0, iWidth: 400, iHeight: 300, iMaxSplit: 4, iCurrentSplit: 2, szPlayMode: "normal", szBasePath: "./dist", onConnectSuccess: null, onConnectError: null, oSessionInfo: null, bNewInstance: false };
this.oOptions = $.extend(n, t);
this.oPlugin = null;
this.iPluginMode = 0;
this._getVideoPlugin() } i(e, [{
key: "_getVideoPlugin", value: function t() {
var e = this;
if (s.oUtils.browser().msie) {
e.oPlugin = new a.ActiveXControl({
szId: e.oOptions.szId, iType: e.oOptions.iType, iWidth: e.oOptions.iWidth, iHeight: e.oOptions.iHeight, iMaxSplit: e.oOptions.iMaxSplit, iCurrentSplit: e.oOptions.iCurrentSplit, szPlayMode: e.oOptions.szPlayMode, szIframeId: e.oOptions.szIframeId });
e.iPluginMode = 0;
if (e.oPlugin.oPlugin) {
setTimeout(function () {
e.oOptions.onConnectSuccess && e.oOptions.onConnectSuccess() }, 500) } else {
setTimeout(function () {
e.oOptions.onConnectError && e.oOptions.onConnectError() }, 500) } } else {
if (window._oMultiVideoPlugin && !e.oOptions.bNewInstance) {
e.oPlugin = window._oMultiVideoPlugin;
e.iPluginMode = 2;
if (e.oOptions.iType !== 0) {
e.oPlugin.JS_CreateWnd(e.oOptions.szId, e.oOptions.iWidth, e.oOptions.iHeight).then(function () {
setTimeout(function () {
e.JS_ArrangeWindow(e.oOptions.iCurrentSplit, []).then(function () {}, function () {});
e.oOptions.onConnectSuccess && e.oOptions.onConnectSuccess() }, 50) }, function () {}) } else {
setTimeout(function () {
e.JS_ArrangeWindow(e.oOptions.iCurrentSplit, []).then(function () {}, function () {});
e.oOptions.onConnectSuccess && e.oOptions.onConnectSuccess() }, 50) } } else {
e.oPlugin = new o.LocalServiceControl({
bNoDetectPort: e.oOptions.bNoDetectPort, oSessionInfo: e.oOptions.oSessionInfo, szPluginContainer: e.oOptions.szId, szIframeId: e.oOptions.szIframeId, cbConnectSuccess: function t() {
window._oMultiVideoPlugin = e.oPlugin;
if (e.oOptions.iType !== 0) {
e.oPlugin.JS_CreateWnd(e.oOptions.szId, e.oOptions.iWidth, e.oOptions.iHeight).then(function () {
e.iPluginMode = 2;
setTimeout(function () {
e.oPlugin.bLocalServiceRunning = true;
e.JS_ArrangeWindow(e.oOptions.iCurrentSplit, []).then(function () {}, function () {});
e.oOptions.onConnectSuccess && e.oOptions.onConnectSuccess() }, 50) }, function () {}) } else {
e.iPluginMode = 2;
setTimeout(function () {
e.oPlugin.bLocalServiceRunning = true;
e.JS_ArrangeWindow(e.oOptions.iCurrentSplit, []).then(function () {}, function () {});
e.oOptions.onConnectSuccess && e.oOptions.onConnectSuccess() }, 50) } }, cbConnectError: function n() {
if (!s.oUtils.isNotSupportNoPlugin()) {
setTimeout(function () {
e.oPlugin = new r.JSPlugin({
szId: e.oOptions.szId, iType: e.oOptions.iType, iWidth: e.oOptions.iWidth, iHeight: e.oOptions.iHeight, iMaxSplit: e.oOptions.iMaxSplit, iCurrentSplit: e.oOptions.iCurrentSplit, szBasePath: e.oOptions.szBasePath, szPlayMode: e.oOptions.szPlayMode, oStyle: e.oOptions.oStyle, szIframeId: e.oOptions.szIframeId });
e.iPluginMode = 1;
e.oOptions.onConnectSuccess && e.oOptions.onConnectSuccess() }, 100) } else {
e.oOptions.onConnectError && e.oOptions.onConnectError() } }, cbConnectClose: function i() {
e.oOptions.onConnectClose && e.oOptions.onConnectClose();
e.oPlugin = null }, bUseInQT: e.oOptions.bUseInQT }) } } } }, {
key: "JS_GetVideoMode", value: function n() {
return this.iPluginMode } }, {
key: "JS_CreateWnd", value: function l(e, t, n) {
return this.oPlugin.JS_CreateWnd(e, t, n) } }, {
key: "JS_ShowWnd", value: function f() {
return this.oPlugin.JS_ShowWnd() } }, {
key: "JS_HideWnd", value: function c() {
return this.oPlugin.JS_HideWnd() } }, {
key: "JS_SetWndCover", value: function h(e, t) {
return this.oPlugin.JS_SetWndCover(e, t) } }, {
key: "JS_CheckLocalServiceConnected", value: function d() {
return o.LocalServiceControl.prototype.JS_CheckLocalServiceConnected() } }, {
key: "JS_SetWindowControlCallback", value: function v(e) {
this.oPlugin.JS_SetWindowControlCallback(e) } }, {
key: "JS_ArrangeWindow", value: function p(e, t) {
return this.oPlugin.JS_ArrangeWindow(e, t) } }, {
key: "JS_SetSecretKey", value: function m(e, t, n) {
return this.oPlugin.JS_SetSecretKey(e, t, n) } }, {
key: "JS_SetOriginalString", value: function y(e, t) {
return this.oPlugin.JS_SetOriginalString(e, t) } }, {
key: "JS_GetEncryptString", value: function S(e, t, n) {
return this.oPlugin.JS_GetEncryptString(e, t, n) } }, {
key: "JS_GetDecryptString", value: function g(e, t, n) {
return this.oPlugin.JS_GetDecryptString(e, t, n) } }, {
key: "JS_DestroyPlugin", value: function _() {
return this.oPlugin.JS_DestroyPlugin(this.oOptions.bNewInstance) } }, {
key: "JS_Play", value: function P(e, t, n, i, r) {
var o = false;
if (e.indexOf("transcoding") > -1) {
o = true }
var a = e.indexOf("://") + 3;
var u = e.substring(a).indexOf("/");
var l = e.substring(0, u + a);
var f = e.substring(u + a + 1);
if (this.iPluginMode === 0 || this.iPluginMode === 2) {
if (!i && !r) {
if (this.oPlugin.iProtocolType === 0 || typeof this.oPlugin.iProtocolType === "undefined") {
e = l.replace(/video/g, "http") + "/SDK/play/" + (parseInt(f, 10) - 1) + "/004" } else {
e = l.replace(/video/g, "rtsp") + "/ISAPI/streaming/channels/" + f } if (f === "0") {
if (this.oPlugin.iProtocolType === 0 || typeof this.oPlugin.iProtocolType === "undefined") {
e = l.replace(/video/g, "http") + "/SDK/play/100/004/ZeroStreaming" } else {
e = l.replace(/video/g, "rtsp") + "/ISAPI/Custom/SelfExt/ContentMgmt/ZeroStreaming/channels/101" } } } else {
if (this.oPlugin.iProtocolType === 0 || typeof this.oPlugin.iProtocolType === "undefined") {
e = l.replace(/video/g, "http") + "/SDK/playback/" + (parseInt(f, 10) - 1) + (o ? "/transcoding" : "");
if (t.secondAuth) {
e = e + (e.indexOf("?") >= 0 ? "&" : "?") + t.secondAuth } } else {
e = l.replace(/video/g, "rtsp") + "/ISAPI/streaming/tracks/" + f + "?starttime=" + i + "&endtime=" + r } }
var c = t.auth;
var h = s.oUtils.decode(c);
if (this.oPlugin.iProtocolType !== 0 && h.indexOf(":::4:") === -1) {
c = t.userInfo } e = e.replace(/https/g, "http");
e = e.replace(/rtsps/g, "rtsp");
return this.oPlugin.JS_Play(e, {
auth: c }, n, i, r) } else if (this.iPluginMode === 1) {
e = e.replace(/video/g, "ws");
var d = s.oUtils.decode(t.auth);
var v = {
sessionID: d.split("::")[1] };
if (d.indexOf(":::3:") > -1) {
v = {
sessionID: d.split(":::3:")[1] } } else if (d.indexOf(":::4:") > -1) {
v = {
token: d.split(":::4:")[1] } } t.secondAuth && (v.secondAuth = t.secondAuth);
return this.oPlugin.JS_Play(e, v, n, i, r) } } }, {
key: "JS_ReversePlay", value: function w(e, t, n, i, r) {
var o = e.indexOf("://") + 3;
var a = e.substring(o).indexOf("/");
var u = e.substring(0, a + o);
var l = e.substring(a + o + 1);
if (this.iPluginMode === 0 || this.iPluginMode === 2) {
if (this.oPlugin.iProtocolType === 0 || typeof this.oPlugin.iProtocolType === "undefined") {
e = u.replace(/video/g, "http") + "/SDK/playback/" + (parseInt(l, 10) - 1) + "/reversePlay";
if (t.secondAuth) {
e = e + (e.indexOf("?") >= 0 ? "&" : "?") + t.secondAuth } } else {
e = u.replace(/video/g, "rtsp") + "/ISAPI/streaming/tracks/" + l + "?starttime=" + i + "&endtime=" + r }
var f = t.auth;
var c = s.oUtils.decode(f);
if (this.oPlugin.iProtocolType !== 0 && c.indexOf(":::4:") === -1) {
f = t.userInfo } e = e.replace(/https/g, "http");
return this.oPlugin.JS_ReversePlay(e, {
auth: f }, n, i, r) } else if (this.iPluginMode === 1) {
e = u.replace(/video/g, "ws");
return this.oPlugin.JS_ReversePlay(e, t, n, i, r) } } }, {
key: "JS_Stop", value: function b(e) {
return this.oPlugin.JS_Stop(e) } }, {
key: "JS_Seek", value: function k(e, t, n) {
return this.oPlugin.JS_Seek(e, t, n) } }, {
key: "JS_StopRealPlayAll", value: function C() {
return this.oPlugin.JS_StopRealPlayAll() } }, {
key: "JS_Pause", value: function R(e) {
return this.oPlugin.JS_Pause(e) } }, {
key: "JS_Resume", value: function T(e) {
return this.oPlugin.JS_Resume(e) } }, {
key: "JS_Slow", value: function I(e) {
return this.oPlugin.JS_Slow(e) } }, {
key: "JS_Fast", value: function x(e) {
return this.oPlugin.JS_Fast(e) } }, {
key: "JS_Transmission", value: function D(e, t) {
return this.oPlugin.JS_Transmission(e, t) } }, {
key: "JS_FrameForward", value: function z(e) {
return this.oPlugin.JS_FrameForward(e) } }, {
key: "JS_GetOSDTime", value: function M(e) {
return this.oPlugin.JS_GetOSDTime(e) } }, {
key: "JS_GetPlayInfo", value: function E(e) {
return this.oPlugin.JS_GetPlayInfo(e) } }, {
key: "JS_OpenSound", value: function O(e) {
return this.oPlugin.JS_OpenSound(e) } }, {
key: "JS_CloseSound", value: function F() {
return this.oPlugin.JS_CloseSound() } }, {
key: "JS_GetVolume", value: function q(e) {
return this.oPlugin.JS_GetVolume(e) } }, {
key: "JS_SetVolume", value: function J(e, t) {
return this.oPlugin.JS_SetVolume(e, t) } }, {
key: "JS_EnableZoom", value: function W(e, t) {
return this.oPlugin.JS_EnableZoom(e, t) } }, {
key: "JS_DisableZoom", value: function L(e) {
return this.oPlugin.JS_DisableZoom(e) } }, {
key: "JS_CapturePicture", value: function A(e, t, n) {
return this.oPlugin.JS_CapturePicture(e, t, n) } }, {
key: "JS_StartSave", value: function B(e, t) {
return this.oPlugin.JS_StartSave(e, t) } }, {
key: "JS_StopSave", value: function U(e) {
return this.oPlugin.JS_StopSave(e) } }, {
key: "JS_StartTalk", value: function H(e, t, n, i, r, o, a, s, u) {
return this.oPlugin.JS_StartTalk(e, t, n, i, r, o, a, s, u) } }, {
key: "JS_StopTalk", value: function N() {
return this.oPlugin.JS_StopTalk() } }, {
key: "JS_SetPlayMode", value: function G(e) {
return this.oPlugin.JS_SetPlayMode(e) } }, {
key: "JS_SetFullScreenCapability", value: function j(e) {
return this.oPlugin.JS_SetFullScreenCapability(e) } }, {
key: "JS_FullScreenDisplay", value: function V(e) {
return this.oPlugin.JS_FullScreenDisplay(e) } }, {
key: "JS_EnableIVS", value: function X(e, t, n) {
return this.oPlugin.JS_EnableIVS(e, t, n) } }, {
key: "JS_SRInit", value: function Y(e, t) {
return this.oPlugin.JS_SRInit(e, t) } }, {
key: "JS_SRPTZ", value: function Z(e, t, n) {
return this.oPlugin.JS_SRPTZ(e, t, n) } }, {
key: "JS_SetPlaybackDrawType", value: function K(e, t) {
return this.oPlugin.JS_SetPlaybackDrawType(e, t) } }, {
key: "JS_SetPlayBackType", value: function Q(e) {
return this.oPlugin.JS_SetPlayBackType(e) } }, {
key: "JS_SetTrsPlayBackParam", value: function ee(e, t) {
return this.oPlugin.JS_SetTrsPlayBackParam(e, t) } }, {
key: "JS_GetLocalConfig", value: function te() {
return this.oPlugin.JS_GetLocalConfig() } }, {
key: "JS_SetLocalConfig", value: function ne(e) {
return this.oPlugin.JS_SetLocalConfig(e) } }, {
key: "JS_GetLastError", value: function ie() {
return this.oPlugin.JS_GetLastError() } }, {
key: "JS_OpenFileBrowser", value: function re(e, t) {
return this.oPlugin.JS_OpenFileBrowser(e, t) } }, {
key: "JS_OpenDirectory", value: function oe(e) {
return this.oPlugin.JS_OpenDirectory(e) } }, {
key: "JS_StartAsynUpload", value: function ae(e, t, n, i) {
return this.oPlugin.JS_StartAsynUpload(e, t, n, i) } }, {
key: "JS_StopAsynUpload", value: function se() {
return this.oPlugin.JS_StopAsynUpload() } }, {
key: "JS_GetUploadErrorInfo", value: function ue() {
return this.oPlugin.JS_GetUploadErrorInfo() } }, {
key: "JS_UploadFile", value: function le(e, t, n, i) {
return this.oPlugin.JS_UploadFile(e, t, n, i) } }, {
key: "JS_GetIpcImportErrorInfo", value: function fe() {
return this.oPlugin.JS_GetIpcImportErrorInfo() } }, {
key: "JS_DownloadFile", value: function ce(e, t, n, i, r, o) {
return this.oPlugin.JS_DownloadFile(e, t, n, i, r, o) } }, {
key: "JS_StartUpgrade", value: function he(e, t, n, i, r) {
return this.oPlugin.JS_StartUpgrade(e, t, n, i, r) } }, {
key: "JS_StopUpgrade", value: function de() {
return this.oPlugin.JS_StopUpgrade() } }, {
key: "JS_GetUpgradeStatus", value: function ve() {
return this.oPlugin.JS_GetUpgradeStatus() } }, {
key: "JS_GetUpgradeProgress", value: function pe() {
return this.oPlugin.JS_GetUpgradeProgress() } }, {
key: "JS_ExportDeviceLog", value: function me(e, t, n) {
var i = null;
if (this.iPluginMode !== 0) {
i = r.JSPlugin.prototype.JS_ExportDeviceLog(e, t, n) } else {
i = this.oPlugin.JS_ExportDeviceLog(e, t, n) }
return i } }, {
key: "JS_ExportReport", value: function ye(e, t, n) {
var i = null;
if (this.iPluginMode !== 0) {
i = r.JSPlugin.prototype.JS_ExportReport(e, t, n) } else {
i = this.oPlugin.JS_ExportReport(e, t, n) }
return i } }, {
key: "JS_StartAsyncDownload", value: function Se(e, t, n, i) {
return this.oPlugin.JS_StartAsyncDownload(e, t, n, i) } }, {
key: "JS_StopAsyncDownload", value: function ge(e) {
return this.oPlugin.JS_StopAsyncDownload(e) } }, {
key: "JS_GetDownloadStatus", value: function _e(e) {
return this.oPlugin.JS_GetDownloadStatus(e) } }, {
key: "JS_GetDownloadProgress", value: function Pe(e) {
return this.oPlugin.JS_GetDownloadProgress(e) } }, {
key: "JS_EnablePDC", value: function we(e, t) {
return this.oPlugin.JS_EnablePDC(e, t) } }, {
key: "JS_Resize", value: function be(e, t) {
return this.oPlugin.JS_Resize(e, t) } }, {
key: "JS_SetDrawCallback", value: function ke(e, t, n, i, r, o) {
return this.oPlugin.JS_SetDrawCallback(e, t, n, i, r, o) } }, {
key: "JS_SetDrawStatus", value: function Ce(e, t, n) {
return this.oPlugin.JS_SetDrawStatus(e, t, n) } }, {
key: "JS_ClearRegion", value: function Re() {
return this.oPlugin.JS_ClearRegion() } }, {
key: "JS_SetDrawShapeInfo", value: function Te(e, t) {
return this.oPlugin.JS_SetDrawShapeInfo(e, t) } }, {
key: "JS_SetGridInfo", value: function Ie(e) {
return this.oPlugin.JS_SetGridInfo(e) } }, {
key: "JS_GetGridInfo", value: function xe() {
return this.oPlugin.JS_GetGridInfo() } }, {
key: "JS_SetRectInfo", value: function De(e) {
return this.oPlugin.JS_SetRectInfo(e) } }, {
key: "JS_GetRectInfo", value: function ze() {
return this.oPlugin.JS_GetRectInfo() } }, {
key: "JS_SetPolygonInfo", value: function Me(e) {
return this.oPlugin.JS_SetPolygonInfo(e) } }, {
key: "JS_GetPolygonInfo", value: function Ee() {
return this.oPlugin.JS_GetPolygonInfo() } }, {
key: "JS_SetLineInfo", value: function Oe(e) {
return this.oPlugin.JS_SetLineInfo(e) } }, {
key: "JS_GetLineInfo", value: function Fe() {
return this.oPlugin.JS_GetLineInfo() } }, {
key: "JS_SetPointInfo", value: function qe(e, t) {
return this.oPlugin.JS_SetPointInfo(e, t) } }, {
key: "JS_GetPointInfo", value: function Je() {
return this.oPlugin.JS_GetPointInfo() } }, {
key: "JS_SetTextOverlay", value: function We(e) {
return this.oPlugin.JS_SetTextOverlay(e) } }, {
key: "JS_GetTextOverlay", value: function Le() {
return this.oPlugin.JS_GetTextOverlay() } }, {
key: "JS_ClearShapeByType", value: function Ae(e, t) {
return this.oPlugin.JS_ClearShapeByType(e, t) } }, {
key: "JS_ChooseShape", value: function Be(e, t) {
return this.oPlugin.JS_ChooseShape(e, t) } }, {
key: "JS_SetCorrectionType", value: function Ue(e) {
return this.oPlugin.JS_SetCorrectionType(e) } }, {
key: "JS_SetPlaceType", value: function $e(e) {
return this.oPlugin.JS_SetPlaceType(e) } }, {
key: "JS_StartFishListener", value: function He(e, t, n) {
return this.oPlugin.JS_StartFishListener(e, t, n) } }, {
key: "JS_StopFishListener", value: function Ne() {
return this.oPlugin.JS_StopFishListener() } }, {
key: "JS_SetFishBoxListInfo", value: function Ge(e) {
return this.oPlugin.JS_SetFishBoxListInfo(e) } }, {
key: "JS_GetFishBoxListInfo", value: function je() {
return this.oPlugin.JS_GetFishBoxListInfo() } }, {
key: "JS_ClearAllWndFishBoxInfo", value: function Ve() {
return this.oPlugin.JS_ClearAllWndFishBoxInfo() } }, {
key: "JS_SetFishWndProperty", value: function Xe(e, t, n) {
return this.oPlugin.JS_SetFishWndProperty(e, t, n) } }, {
key: "JS_SetFishParams", value: function Ye(e, t, n, i) {
return this.oPlugin.JS_SetFishParams(e, t, n, i) } }, {
key: "JS_ArrangeFECWindow", value: function Ze(e) {
return this.oPlugin.JS_ArrangeFECWindow(e) } }, {
key: "JS_StartFECScan", value: function Ke(e) {
return this.oPlugin.JS_StartFECScan(e) } }, {
key: "JS_StopFECScan", value: function Qe() {
return this.oPlugin.JS_StopFECScan() } }, {
key: "JS_FishEyePTZ", value: function et(e, t) {
return this.oPlugin.JS_FishEyePTZ(e, t) } }, {
key: "JS_FishEyeGetPreset", value: function tt() {
return this.oPlugin.JS_FishEyeGetPreset() } }, {
key: "JS_FishEyeSetPreset", value: function nt(e) {
return this.oPlugin.JS_FishEyeSetPreset(e) } }, {
key: "JS_StartFECCruise", value: function it(e) {
return this.oPlugin.JS_StartFECCruise(e) } }, {
key: "JS_StopFECCruise", value: function rt() {
return this.oPlugin.JS_StopFECCruise() } }, {
key: "JS_SetIsHttps", value: function ot(e) {
return this.oPlugin.JS_SetIsHttps(e) } }, {
key: "JS_SetReconnectInfo", value: function at(e, t) {
return this.oPlugin.JS_SetReconnectInfo(e, t) } }, {
key: "JS_CheckUpdate", value: function st(e) {
return this.oPlugin.JS_CheckUpdate(e) } }, {
key: "JS_SelectShape", value: function ut(e, t) {
return this.oPlugin.JS_SelectShape(e, t) } }, {
key: "JS_GetPictureSize", value: function lt(e) {
return this.oPlugin.JS_GetPictureSize(e) } }, {
key: "JS_SetOriginResolution", value: function ft(e, t, n) {
return this.oPlugin.JS_SetOriginResolution(e, t, n) } }, {
key: "JS_SetPlayWndMode", value: function ct(e, t, n) {
return this.oPlugin.JS_SetPlayWndMode(e, t, n) } }, {
key: "JS_UpdateWindowStyle", value: function ht(e) {
return this.oPlugin.JS_UpdateWindowStyle(e) } }, {
key: "JS_CuttingPartWindow", value: function dt(e, t, n, i) {
return this.oPlugin.JS_CuttingPartWindow(e, t, n, i) } }, {
key: "JS_RepairPartWindow", value: function vt(e, t, n, i) {
return this.oPlugin.JS_RepairPartWindow(e, t, n, i) } }, {
key: "JS_ClearAllCanvas", value: function pt() {
var e = null;
if (this.iPluginMode === 1) {
e = this.oPlugin.JS_ClearAllCanvas() } else {
e = new Promise(function (e) {
e() }) }
return e } }, {
key: "JS_PlayWithImg", value: function mt(e, t) {
return this.oPlugin.JS_PlayWithImg(e, t) } }]);
return e }();
e.getPluginMode = function (e) {
var t = 0;
var n = new Promise(function (n) {
if (s.oUtils.browser().msie || s.oUtils.browser().safari && s.oUtils.browser().version < 11 || s.oUtils.browser().firefox && s.oUtils.browser().version < 52 || s.oUtils.browser().chrome && s.oUtils.browser().version < 45) {
n(t) } else {
o.LocalServiceControl.prototype.JS_CheckLocalServiceConnected(e).then(function () {
t = 2;
n(t) }, function () {
t = 1;
n(t) }) } });
return n };
return e }();
t.JSVideoPlugin = l }, function (e, t, n) {
"use strict";
Object.defineProperty(t, "__esModule", {
value: true });
t.JSPlugin = undefined;
var i = function () {
function e(e, t) {
for (var n = 0;
n < t.length;
n++) {
var i = t[n];
i.enumerable = i.enumerable || false;
i.configurable = true;
if ("value" in i) i.writable = true;
Object.defineProperty(e, i.key, i) } }
return function (t, n, i) {
if (n) e(t.prototype, n);
if (i) e(t, i);
return t } }();
var r = n(4);
var o = n(16);
var a = n(25);
var s = n(26);
var u = n(27);
function l(e, t) {
if (!(e instanceof t)) {
throw new TypeError("Cannot call a class as a function") } }
var f = function () {
var e = null;
var t = 0;
var n = 1;
var f = 40;
var c = 1024 * 1024 * 4;
var h = 1001;
var d = 1002;
var v = 1003;
var p = 2001;
var m = 2002;
var y = new o.StreamClient;
var S = null;
var g = null;
var _ = Symbol("OPTIONS");
var P = Symbol("CURRENTPLAYRATE");
var w = Symbol("CURRENTSOUNDWND");
var b = Symbol("MAXWNDNUM");
var k = Symbol("MAXWNDNUM");
var C = Symbol("DRAWCANVAS");
var R = Symbol("SHAPEID");
var T = Symbol("WINDOWFULL");
var I = Symbol("SINGLEWINDOW");
var x = Symbol("FILETMP");
var D = Symbol("STATUSTMP");
var z = Symbol("UPGRADESTATUSURL");
var M = Symbol("CURWNDINDEX");
var E = Symbol("CALLBACKFUNCTION");
var O = Symbol("CALLBACKFUNCTIONS");
var F = Symbol("EVENTCALLBACK");
var q = Symbol("PLUGINVERSION");
var J = Symbol("CANFULLSCREEN");
function W() {
document.addEventListener("visibilitychange", function () {
if (document.hidden) {
for (var t = 0;
t < 16;
t++) {
if (e[k][t] && e[k][t].bLoad) {
e[k][t].oPlayCtrl.PlayM4_IsVisible(false) } } } else {
for (var n = 0;
n < 16;
n++) {
if (e[k][n] && e[k][n].bLoad) {
e[k][n].oPlayCtrl.PlayM4_IsVisible(true) } } } }, false) } function L(t, n) {
if (t && n) {
e[_].iWidth = t;
e[_].iHeight = n }
var i = e[_].iWidth % e[_].iCurrentSplit;
var r = e[_].iHeight % e[_].iCurrentSplit;
var o = (e[_].iWidth - i - e[_].iCurrentSplit * 2) / e[_].iCurrentSplit;
var a = (e[_].iHeight - r - e[_].iCurrentSplit * 2) / e[_].iCurrentSplit;
var s = (e[_].iWidth - i) / e[_].iCurrentSplit;
var u = (e[_].iHeight - r) / e[_].iCurrentSplit;
var l = e[_].iCurrentSplit;
if (e[_].szIframeId && $("#" + e[_].szIframeId).length) {
g = $("#" + e[_].szId, $("#" + e[_].szIframeId)[0].contentWindow.document) } else {
if (typeof e[_].szId === "string") {
g = $("#" + e[_].szId) } else {
g = e[_].szId } }
var f = '<div class="parent-wnd" style="overflow:hidden;width:100%; height:100%; position: relative;">';
for (var c = 0;
c < e[b];
c++) {
t = o + (c % l === l - 1 ? i : 0);
n = a + (c + l >= Math.pow(l, 2) ? r : 0);
var h = s + (c % l === l - 1 ? i : 0);
var d = u + (c + l >= Math.pow(l, 2) ? r : 0);
f += '<div style="float:left; background-color: ' + e[_].oStyle.background + "; position: relative; width: " + h + "px; height: " + d + 'px;">' + (c === 0 ? '<img style="display:none;" id="playImg' + c + '" src="">' : "") + '<canvas id="canvas_play' + c + '" class="play-window" style="border:1px solid ' + e[_].oStyle.border + ';" wid="' + c + '" width="' + t + '" height="' + n + '"></canvas>' + '<canvas id="canvas_draw' + c + '"  class="draw-window" style="position:absolute; top:0; left:0;" wid="' + c + '" width=' + h + " height=" + d + "></canvas>" + "</div>" } f += "</div>";
g.html(f);
g.find(".parent-wnd").eq(0).children().eq(0).find(".play-window").eq(0).css("border", "1px solid " + e[_].oStyle.borderSelect) } function A() {
e.EventCallback = function () {
return {
loadEventHandler: function t() {
window.loadEventHandler && window.loadEventHandler() }, zoomEventResponse: function n() {}, windowEventSelect: function i(t) {
if (e[M] === t) {
return } e[M] = t;
if (0 <= t) {
e[E] = e[O][t] } $(".draw-window").unbind();
e[C].setDrawStatus(false);
e[C] = null;
e[C] = new u.ESCanvas("canvas_draw" + t);
e[C].setShapeType("Rect");
e[C].setDrawStyle("#ff0000", "", 0);
if (e[k][t].bEZoom || e[k][t].bSetDrawCallback) {
if (e[k][t].bEZoom) {
e[C].setDrawStatus(true, function (n) {
if (n.startPos && n.endPos) {
if (n.startPos[0] > n.endPos[0]) {
e[k][t].oPlayCtrl.PlayM4_SetDisplayRegion(null, false) } else {
e[k][t].oPlayCtrl.PlayM4_SetDisplayRegion({
left: n.startPos[0], top: n.startPos[1], right: n.endPos[0], bottom: n.endPos[1] }, true) } } }) } else if (e[k][t].bSetDrawCallback) {
e[C].setDrawStatus(true, function (t) {
e[E](t) }) } } if (e[F].onGetSelectWndInfo) {
e[F].onGetSelectWndInfo(t) } }, pluginErrorHandler: function r(t, n, i) {
if (e[F].onPluginEventHandler) {
e[F].onPluginEventHandler(t, n, i) } }, windowEventOver: function o(t) {
if (e[F].onWindowEventOver) {
e[F].onWindowEventOver(t) } }, windowEventOut: function a(t) {
if (e[F].onWindowEventOut) {
e[F].onWindowEventOut(t) } }, windowEventUp: function s(t) {
if (e[F].onWindowEventUp) {
e[F].onWindowEventUp(t) } }, windowFullCcreenChange: function l(t) {
if (e[F].onWindowFullCcreenChange) {
e[F].onWindowFullCcreenChange(t) } }, firstFrameDisplay: function f(t) {
if (e[F].onFirstFrameDisplay) {
e[F].onFirstFrameDisplay(t) } }, performanceLack: function c() {
if (e[F].onPerformanceLack) {
e[F].onPerformanceLack() } }, mouseEvent: function h(t, n, i, r) {
if (e[F].onMouseEvent) {
e[F].onMouseEvent({
eventType: n, point: [i, r], wndIndex: t }) } } } }() } function B() {
A();
g.find(".parent-wnd").eq(0).children().each(function (t) {
var n = this;
var i = false;
$(n).unbind().bind("mousedown", function (n) {
g.find(".parent-wnd").eq(0).find(".play-window").css("border", "1px solid " + e[_].oStyle.border);
g.find(".parent-wnd").eq(0).children().eq(t).find(".play-window").eq(0).css("border", "1px solid " + e[_].oStyle.borderSelect);
e.EventCallback.windowEventSelect(parseInt(g.find(".parent-wnd").eq(0).children().eq(t).find(".play-window").eq(0).attr("wid"), 10));
i = true;
var r = n.offsetX / e[C].m_iCanvasWidth;
var o = n.offsetY / e[C].m_iCanvasHeight;
if (n.button === 2) {
e.EventCallback.mouseEvent(t, 4, r, o) } else if (n.button === 0) {
e.EventCallback.mouseEvent(t, 1, r, o) } n.stopPropagation() });
$(n).bind("mousemove", function (n) {
var r = n.offsetX / e[C].m_iCanvasWidth;
var o = n.offsetY / e[C].m_iCanvasHeight;
if (i) {
e.EventCallback.mouseEvent(t, 7, r, o) } else {
e.EventCallback.mouseEvent(t, 6, r, o) } n.stopPropagation() });
$(n).bind("mousewheel", function (n) {
var i = n.offsetX / e[C].m_iCanvasWidth;
var r = n.offsetY / e[C].m_iCanvasHeight;
e.EventCallback.mouseEvent(t, 8, i, r);
n.stopPropagation() });
$(n).bind("mouseover", function (n) {
e.EventCallback.windowEventOver(t);
n.stopPropagation() });
$(n).bind("mouseout", function (n) {
e.EventCallback.windowEventOut(t);
n.stopPropagation() });
$(n).bind("mouseup", function (n) {
i = false;
e.EventCallback.windowEventUp(t);
var r = n.offsetX / e[C].m_iCanvasWidth;
var o = n.offsetY / e[C].m_iCanvasHeight;
if (n.button === 2) {
e.EventCallback.mouseEvent(t, 5, r, o) } else if (n.button === 0) {
e.EventCallback.mouseEvent(t, 3, r, o) } });
$(n).bind("dblclick", function (i) {
if (!e[k][e[M]].bPlay) {
return } if (!e[J]) {
return }
var r = document.fullscreen || document.webkitIsFullScreen || document.mozFullScreen || false;
var o = $(n).get(0);
if (!r) {
if (o.requestFullScreen) {
o.requestFullScreen() } else if (o.webkitRequestFullScreen) {
o.webkitRequestFullScreen() } else if (o.mozRequestFullScreen) {
o.mozRequestFullScreen() } e[I] = $(n) } else {
if (g.find(".parent-wnd").eq(0).width() === $(window).width()) {
return } if (document.exitFullscreen) {
document.exitFullscreen() } else if (document.webkitCancelFullScreen) {
document.webkitCancelFullScreen() } else if (document.mozCancelFullScreen) {
document.mozCancelFullScreen() } e[I] = null;
e[T] = false }
var a = i.offsetX / e[C].m_iCanvasWidth;
var s = i.offsetX / e[C].m_iCanvasHeight;
e.EventCallback.mouseEvent(t, 2, a, s);
i.stopPropagation() }) });
if (typeof document.fullScreen !== "undefined") {
document.addEventListener("fullscreenchange", function () {
var t = document.fullscreen || false;
e.EventCallback.windowFullCcreenChange(t) }) } else if (typeof document.webkitIsFullScreen !== "undefined") {
document.addEventListener("webkitfullscreenchange", function () {
var t = document.webkitIsFullScreen || false;
e.EventCallback.windowFullCcreenChange(t) }) } else if (typeof document.mozFullScreen !== "undefined") {
document.addEventListener("mozfullscreenchange", function () {
var t = document.mozFullScreen || false;
e.EventCallback.windowFullCcreenChange(t) }) } } function U() {
var t = g.find(".parent-wnd").eq(0).children().length;
var n = e[_].iWidth % e[_].iCurrentSplit;
var i = e[_].iHeight % e[_].iCurrentSplit;
var r = (e[_].iWidth - n - e[_].iCurrentSplit * 2) / e[_].iCurrentSplit;
var o = (e[_].iHeight - i - e[_].iCurrentSplit * 2) / e[_].iCurrentSplit;
var a = (e[_].iWidth - n) / e[_].iCurrentSplit;
var s = (e[_].iHeight - i) / e[_].iCurrentSplit;
var u = e[_].iCurrentSplit;
for (var l = 0;
l < t;
l++) {
var f = r + (l % u === u - 1 ? n : 0);
var c = o + (l + u >= Math.pow(u, 2) ? i : 0);
var h = a + (l % u === u - 1 ? n : 0);
var d = s + (l + u >= Math.pow(u, 2) ? i : 0);
g.find(".parent-wnd").eq(0).children().eq(l).width(h);
g.find(".parent-wnd").eq(0).children().eq(l).height(d);
g.find(".parent-wnd").eq(0).children().eq(l).find(".draw-window").attr("width", h);
g.find(".parent-wnd").eq(0).children().eq(l).find(".draw-window").attr("height", d);
g.find(".parent-wnd").eq(0).children().eq(l).find(".play-window").attr("width", f);
g.find(".parent-wnd").eq(0).children().eq(l).find(".play-window").attr("height", c) } g.find(".parent-wnd").eq(e[M]).find(".play-window").css("border", "1px solid " + e[_].oStyle.border);
g.find(".parent-wnd").eq(e[M]).children().eq(0).find(".play-window").eq(0).css("border", "1px solid " + e[_].oStyle.borderSelect) } function H(i, r, o, a, s, u, l) {
if (!$("#" + e[k][o].windowID).length) {
return }
var p = false;
if (a && s) {
p = true } e[k][o].bLoad = true;
y.openStream(i, r, function (i) {
if (i.bHead && !e[k][o].bPlay) {
e[k][o].bPlay = true;
e[k][o].aHead = new Uint8Array(i.buf);
e[k][o].oPlayCtrl.PlayM4_OpenStream(i.buf, f, 1024 * 1024 * 2);
if (e[k][o].szSecretKey !== "") {
setTimeout(function () {
e[k][o].oPlayCtrl.PlayM4_SetSecretKey(1, e[k][o].szSecretKey, 128);
e[k][o].szSecretKey = "" }, 100) } if (e[k][o].aHead[8] === 4) {
e[k][o].oPlayCtrl.PlayM4_SetStreamOpenMode(0) } else {
e[k][o].oPlayCtrl.PlayM4_SetStreamOpenMode(1) } e[k][o].oPlayCtrl.PlayM4_SetInputBufSize(c);
e[k][o].oPlayCtrl.PlayM4_Play(e[k][o].windowID) } else {
var r = new Uint8Array(i.buf);
var a = e[k][o].oPlayCtrl.PlayM4_GetInputBufSize();
var s = e[k][o].oPlayCtrl.PlayM4_GetYUVBufSize();
if (s === 2 && !e[k][o].bFirstFrame) {
e[k][o].bFirstFrame = true;
e.EventCallback.firstFrameDisplay(o) }
var u = e[k][o].oPlayCtrl.PlayM4_GetDecodeFrameType();
if (a > c * .5 && a < c * .8 && e[k][o].iRate === 1) {
if (u !== n && !e[k][o].bFrameForward) {
e[k][o].oPlayCtrl.PlayM4_SetDecodeFrameType(n) } e.EventCallback.performanceLack() } else if (a >= c * .8) {} if (s > 10 && s < 15 && !e[k][o].bFrameForward) {
if (u !== n) {
e[k][o].oPlayCtrl.PlayM4_SetDecodeFrameType(n) } e.EventCallback.performanceLack() } else if (s > 15) {} if (s < 10 && a < c * .5 && e[k][o].iRate === 1) {
if (u !== t) {
e[k][o].oPlayCtrl.PlayM4_SetDecodeFrameType(t) } } if (i.statusString) {
e.EventCallback.pluginErrorHandler(o, h, i) } else if (i.type && i.type === "exception") {
e.EventCallback.pluginErrorHandler(o, d, i) } else {
e[k][o].oPlayCtrl.PlayM4_InputData(r, r.length) } } if (e[k][o].szStorageUUID) {
S.inputData(e[k][o].szStorageUUID, i.buf) } i = null }, function () {
if (e[k][o].bPlay) {
e.EventCallback.pluginErrorHandler(o, v);
e[k][o].bPlay = false;
e[k][o].bFrameForward = false;
e[k][o].iRate = 1;
if (e[k][o].oPlayCtrl) {
e[k][o].oPlayCtrl.PlayM4_Stop();
e[k][o].oPlayCtrl.PlayM4_CloseStream() } } }).then(function (t) {
e[k][o].szStreamUUID = t;
y.startPlay(t, a, s, r).then(function () {
if (p) {
e[k][o].szPlayType = "playback";
e[k][o].iRate = 1;
e[k][o].oPlayCtrl.PlayM4_PlayRate(e[k][o].iRate) } else {
e[k][o].szPlayType = "realplay" } u() }, function (e) {
l(e) }) }, function (e) {
l(e) }) }
var N = function () {
function o(n) {
l(this, o);
e = this;
var i = {
szId: "playWnd", iType: 1, iWidth: 400, iHeight: 300, iMaxSplit: 4, iCurrentSplit: 2, szBasePath: "./" };
this[_] = $.extend(i, n);
var r = {
border: "#343434", borderSelect: "#FFCC00", background: "#4C4B4B" };
r = $.extend(r, n.oStyle);
this[_].oStyle = r;
if (this[_].iCurrentSplit > this[_].iMaxSplit) {
this[_].iCurrentSplit = this[_].iMaxSplit } this[P] = 1;
this[w] = -1;
this[b] = this[_].iMaxSplit * this[_].iMaxSplit;
this[R] = "";
this[T] = false;
this[I] = null;
this[x] = null;
this[D] = "";
this[z] = "";
this[M] = -1;
this[E] = null;
this[O] = [];
this[F] = {};
this[J] = true;
this[q] = "V1.2.0 build20181011";
S = new s.StorageManager(this[_].szBasePath + "/transform");
if (e[_].szIframeId && $("#" + e[_].szIframeId).length) {
g = $("#" + e[_].szId, $("#" + e[_].szIframeId)[0].contentWindow.document) } else {
if (typeof e[_].szId === "string") {
g = $("#" + e[_].szId) } else {
g = e[_].szId } } this[k] = [];
for (var a = 0;
a < this[b];
a++) {
this[k][a] = {};
this[k][a].bSelect = false;
this[k][a].bPlay = false;
this[k][a].bPause = false;
this[k][a].bRecord = false;
this[k][a].oPlayCtrl = null;
this[k][a].szPlayType = "";
this[k][a].szStorageUUID = "";
this[k][a].szStreamUUID = "";
this[k][a].aHead = [];
this[k][a].bLoad = false;
this[k][a].windowID = "canvas_play" + a;
this[k][a].drawID = "canvas_draw" + a;
this[k][a].iRate = 1;
this[k][a].bEZoom = false;
this[k][a].bSetDrawCallback = false;
this[k][a].szSecretKey = "";
this[k][a].bFrameForward = false;
this[k][a].iDecodeType = t;
this[k][a].bFirstFrame = false } W();
L();
this[C] = new u.ESCanvas("canvas_draw0");
if (this[_].iType === 0) {
g.hide() } B();
e.EventCallback.windowEventSelect(0) } i(o, [{
key: "JS_UpdateWindowStyle", value: function f(e) {
this[_].oStyle = e;
U() } }, {
key: "JS_CreateWnd", value: function c(t, n, i) {
var r = new Promise(function (t) {
L(n, i);
e[C].updateCanvas("canvas_draw0");
e[C].clearAllShape();
if (i === 0 || n === 0) {
g.hide() } else {
g.show() } e.EventCallback.windowEventSelect(0);
B();
e[x] = null;
t() });
return r } }, {
key: "JS_ShowWnd", value: function h() {
var e = new Promise(function (e) {
e() });
return e } }, {
key: "JS_HideWnd", value: function d() {
var e = new Promise(function (e) {
e() });
return e } }, {
key: "JS_SetWndCover", value: function v() {
var e = new Promise(function (e) {
e() });
return e } }, {
key: "JS_SetWindowControlCallback", value: function A(t) {
e[F] = t;
t && e[C].setDrawEventCallback(t.onDrawEvent) } }, {
key: "JS_ArrangeWindow", value: function N(t) {
var n = new Promise(function (n) {
if (t < e[_].iMaxSplit) {
e[_].iCurrentSplit = t } else {
e[_].iCurrentSplit = e[_].iMaxSplit } if (r.oTool.isFirefox()) {
for (var i = 0;
i < e[_].iMaxSplit * e[_].iMaxSplit;
i++) {
if (e[k][i].oPlayCtrl) {
e[k][i].oPlayCtrl.PlayM4_ClearCanvas() } } } U();
e.EventCallback.windowEventSelect(0);
n() });
return n } }, {
key: "JS_SetSecretKey", value: function G(t, n) {
var i = new Promise(function (i, r) {
if (t < 0) {
r();
return } if (n === "" || typeof n === "undefined") {
r();
return } e[k][t].szSecretKey = n;
i() });
return i } }, {
key: "JS_SetOriginalString", value: function j() {
var e = new Promise(function (e) {
e() });
return e } }, {
key: "JS_GetEncryptString", value: function V() {
var e = new Promise(function (e) {
e("") });
return e } }, {
key: "JS_GetDecryptString", value: function X() {
var e = new Promise(function (e) {
e("") });
return e } }, {
key: "JS_DestroyPlugin", value: function Y() {
var t = new Promise(function (t) {
e[k].forEach(function (e) {
if (e.bPlay) {
e.oPlayCtrl.PlayM4_CloseStream() } if (e.oPlayCtrl) {
e.oPlayCtrl.PlayM4_Destroy();
e.oPlayCtrl = null;
e.bLoad = false } });
e[C].setShapeType("");
t() });
return t } }, {
key: "JS_Play", value: function Z(n, i, r, o, s) {
var u = new Promise(function (u, l) {
if (r < 0 || r > e[b] - 1) {
l();
return } if (e[k][r].bFrameForward) {
l();
return } if (e[k][r].bPlay) {
e.JS_Stop(r) } setTimeout(function () {
e[k][r].bFirstFrame = false;
e[k][r].iDecodeType = t;
if (e[k][r].oPlayCtrl) {
H(n, i, r, o, s, u, l) } else {
e[k][r].oPlayCtrl = new a.JSPlayCtrl(e[_].szBasePath + "/playctrl/", function (t) {
if (t.cmd === "loaded" && !e[k][r].bLoad) {
H(n, i, r, o, s, u, l) } else if (t.cmd === "OnebyOne") {
if (!t.status) {
if (!e[k][r].bPause) {
y.pause(e[k][r].szStreamUUID);
e[k][r].bPause = true } } else {
if (e[k][r].bPause) {
y.resume(e[k][r].szStreamUUID);
e[k][r].bPause = false } } } else if (t.cmd === "GetFrameData") {
e.EventCallback.pluginErrorHandler(r, p) } }, r) } }, 200) });
return u } }, {
key: "JS_ReversePlay", value: function K() {
var e = new Promise(function (e) {
e() });
return e } }, {
key: "JS_SetTrsPlayBackParam", value: function Q() {
var e = new Promise(function (e) {
e() });
return e } }, {
key: "JS_Stop", value: function ee(t) {
var n = new Promise(function (n, i) {
if (t < 0 || t > e[b] - 1) {
i();
return } if (e[k][t].szStorageUUID) {
e.JS_StopSave(t) } if (e[k][t].bEZoom) {
e.JS_DisableZoom(t) } if (e[w] === t) {
e[w] = -1 } y.stop(e[k][t].szStreamUUID).then(function () {
e[k][t].bPlay = false;
e[k][t].bFrameForward = false;
e[k][t].iRate = 1;
if (e[k][t].oPlayCtrl) {
e[k][t].oPlayCtrl.PlayM4_Stop();
e[k][t].oPlayCtrl.PlayM4_CloseStream() } setTimeout(function () {
n() }, 500) }, function () {
setTimeout(function () {
i() }, 500) }) });
return n } }, {
key: "JS_Seek", value: function te(t, n, i) {
var r = new Promise(function (r, o) {
if (t < 0 || t > e[b] - 1) {
o();
return } if (!e[k][t].bPlay) {
o();
return } y.seek(e[k][t].szStreamUUID, n, i).then(function () {
r() }, function (e) {
o(e) }) });
return r } }, {
key: "JS_StopRealPlayAll", value: function ne() {
var t = new Promise(function (t) {
y.stopAll();
e[k].forEach(function (t, n) {
if (t.bPlay) {
if (t.szStorageUUID) {
e.JS_StopSave(n) } if (t.bEZoom) {
e.JS_DisableZoom(n) } t.oPlayCtrl.PlayM4_Stop();
t.oPlayCtrl.PlayM4_CloseStream() } t.bPlay = false });
e[w] = -1;
t() });
return t } }, {
key: "JS_Pause", value: function ie(t) {
var n = new Promise(function (n, i) {
if (t < 0 || t > e[b] - 1) {
i();
return } if (!e[k][t].bPlay) {
i();
return } if (e[k][t].bFrameForward) {
i();
return } y.pause(e[k][t].szStreamUUID).then(function () {
e[k][t].oPlayCtrl.PlayM4_Pause(true);
e[k][t].bPause = true;
n() }, function (e) {
i(e) }) });
return n } }, {
key: "JS_Resume", value: function re(i) {
var r = new Promise(function (r, o) {
if (i < 0 || i > e[b] - 1) {
o();
return } if (!e[k][i].bPlay) {
o();
return } y.resume(e[k][i].szStreamUUID).then(function () {
if (e[P] !== 1) {
e[k][i].iRate = e[P];
y.setPlayRate(e[k][i].szStreamUUID, e[k][i].iRate);
e[k][i].oPlayCtrl.PlayM4_PlayRate(e[k][i].iRate);
if (e[P] > 1) {
e[k][i].oPlayCtrl.PlayM4_SetDecodeFrameType(n) } else {
e[k][i].oPlayCtrl.PlayM4_SetDecodeFrameType(t) } } if (e[k][i].bFrameForward) {
e[k][i].oPlayCtrl.PlayM4_Play(e[k][i].windowID);
e[k][i].bFrameForward = false } else {
e[k][i].oPlayCtrl.PlayM4_Pause(false) } e[k][i].bPause = false;
r() }, function (e) {
o(e) }) });
return r } }, {
key: "JS_Slow", value: function oe(i) {
var r = new Promise(function (r, o) {
if (i < 0 || i > e[b] - 1) {
o();
return } if (!e[k][i].bPlay) {
o();
return } if (e[k][i].szPlayType !== "playback") {
o();
return } if (e[k][i].iRate === -8) {
o();
return } if (e[k][i].bFrameForward) {
o();
return } if (e[k][i].iRate < 0 && e[k][i].iRate > -8) {
e[k][i].iRate *= 2 } if (e[k][i].iRate === 1) {
e[k][i].iRate *= -2 } if (e[k][i].iRate > 1) {
e[k][i].iRate /= 2 } y.setPlayRate(e[k][i].szStreamUUID, e[k][i].iRate).then(function () {
if (e[k][i].iRate < 2) {
e[k][i].oPlayCtrl.PlayM4_SetDecodeFrameType(t) } else {
e[k][i].oPlayCtrl.PlayM4_SetDecodeFrameType(n);
e[k][i].oPlayCtrl.PlayM4_SetIFrameDecInterval(0) } e[k][i].oPlayCtrl.PlayM4_PlayRate(e[k][i].iRate);
r() }, function (e) {
o(e) }) });
return r } }, {
key: "JS_Fast", value: function ae(i) {
var r = new Promise(function (r, o) {
if (i < 0 || i > e[b] - 1) {
o();
return } if (!e[k][i].bPlay) {
o();
return } if (e[k][i].szPlayType !== "playback") {
o();
return } if (e[k][i].bFrameForward) {
o();
return } if (e[k][i].iRate === 8) {
o();
return } if (e[k][i].iRate === -2) {
e[k][i].iRate = 1 } else if (e[k][i].iRate < -2) {
e[k][i].iRate /= 2 } else if (e[k][i].iRate > 0 && e[k][i].iRate < 8) {
e[k][i].iRate *= 2 } y.setPlayRate(e[k][i].szStreamUUID, e[k][i].iRate).then(function () {
if (e[k][i].iRate < 2) {
e[k][i].oPlayCtrl.PlayM4_SetDecodeFrameType(t) } else {
e[k][i].oPlayCtrl.PlayM4_SetDecodeFrameType(n);
if (e[k][i].iRate === 8) {
e[k][i].oPlayCtrl.PlayM4_SetIFrameDecInterval(2) } else {
e[k][i].oPlayCtrl.PlayM4_SetIFrameDecInterval(0) } } e[k][i].oPlayCtrl.PlayM4_PlayRate(e[k][i].iRate);
r() }, function (e) {
o(e) }) });
return r } }, {
key: "JS_Transmission", value: function se(t, n) {
var i = new Promise(function (i, r) {
if (t < 0 || t > e[b] - 1) {
r();
return } if (!e[k][t].szStreamUUID) {
r();
return } y.transmission(e[k][t].szStreamUUID, n).then(function (e) {
i(e) }, function (e) {
r(e) }) });
return i } }, {
key: "JS_FrameForward", value: function ue(n) {
var i = new Promise(function (i, r) {
if (n < 0 || n > e[b] - 1) {
r();
return } if (!e[k][n].bPlay) {
r();
return } if (e[k][n].iRate !== 1) {
e[k][n].iRate = 1;
e[P] = e[k][n].iRate;
y.setPlayRate(e[k][n].szStreamUUID, e[k][n].iRate).then(function () {
e[k][n].oPlayCtrl.PlayM4_PlayRate(e[k][n].iRate);
e[k][n].oPlayCtrl.PlayM4_SetDecodeFrameType(t);
e[k][n].oPlayCtrl.PlayM4_OneByOne();
e[k][n].bFrameForward = true }, function (e) {
r(e) }) } else {
e[k][n].oPlayCtrl.PlayM4_PlayRate(e[k][n].iRate);
e[k][n].oPlayCtrl.PlayM4_SetDecodeFrameType(t);
e[k][n].oPlayCtrl.PlayM4_OneByOne();
e[k][n].bFrameForward = true } i() });
return i } }, {
key: "JS_GetOSDTime", value: function le(t) {
var n = new Promise(function (n, i) {
if (t < 0 || t > e[b] - 1) {
i();
return } if (!e[k][t].bPlay) {
i();
return }
var o = e[k][t].oPlayCtrl.PlayM4_GetOSDTime(function (e) {
var t = r.oTool.isSafari() || r.oTool.isEdge() ? "/" : " ";
var i = Date.parse(e.replace(/-/g, t)) / 1e3;
n(i) });
if (o !== 0) {
i();
return } });
return n } }, {
key: "JS_OpenSound", value: function fe(t) {
var n = new Promise(function (n, i) {
if (t < 0 || t > e[b] - 1) {
i();
return } if (!e[k][t].bPlay) {
i();
return } if (e[w] === t) {
i();
return } if (e[w] !== -1) {
e[k][e[w]].oPlayCtrl.PlayM4_StopSound() } if (e[k][t].oPlayCtrl.PlayM4_PlaySound(t) !== 0) {
i();
return } e[w] = t;
n() });
return n } }, {
key: "JS_CloseSound", value: function ce() {
var t = new Promise(function (t, n) {
var i = e[w];
if (i < 0 || i > e[b] - 1) {
n();
return } if (!e[k][i].bPlay) {
n();
return } if (e[k][i].oPlayCtrl.PlayM4_StopSound() !== 0) {
n();
return } e[w] = -1;
t() });
return t } }, {
key: "JS_GetVolume", value: function he(t) {
var n = new Promise(function (n) {
e[k][t].oPlayCtrl.PlayM4_GetVolume(function (e) {
n(e) }) });
return n } }, {
key: "JS_SetVolume", value: function de(t, n) {
var i = new Promise(function (i, r) {
if (e[k][t].oPlayCtrl.PlayM4_SetVolume(n) !== 0) {
r();
return } i() });
return i } }, {
key: "JS_EnableZoom", value: function ve(t) {
var n = new Promise(function (n, i) {
if (t < 0 || t > e[b] - 1) {
i();
return } if (!e[k][t].bPlay) {
i();
return } $(".draw-window").unbind();
e[C] = new u.ESCanvas("canvas_draw" + t);
e[C].setShapeType("Rect");
e[C].setDrawStyle("#ff0000", "", 0);
e[C].setDrawStatus(true, function (n) {
if (n.startPos && n.endPos) {
if (n.startPos[0] > n.endPos[0]) {
e[k][t].oPlayCtrl.PlayM4_SetDisplayRegion(null, false) } else {
e[k][t].oPlayCtrl.PlayM4_SetDisplayRegion({
left: n.startPos[0], top: n.startPos[1], right: n.endPos[0], bottom: n.endPos[1] }, true) } } });
e[k][t].bEZoom = true;
n() });
return n } }, {
key: "JS_DisableZoom", value: function pe(t) {
var n = new Promise(function (n, i) {
if (t < 0 || t > e[b] - 1) {
i();
return } if (!e[k][t].bPlay) {
i();
return } e[C].setDrawStatus(false);
if (e[k][t].oPlayCtrl.PlayM4_SetDisplayRegion(null, false) !== 0) {
i();
return } e[k][t].bEZoom = false;
e[F] && e[F].onDrawEvent && e[C].setDrawEventCallback(e[F].onDrawEvent);
n() });
return n } }, {
key: "JS_CapturePicture", value: function me(t, n, i) {
var o = new Promise(function (o, a) {
if (t < 0 || t > e[b] - 1) {
a();
return } if (!e[k][t].bPlay) {
a();
return } if (!i) {
i = "JPEG" } if (i === "BMP") {
e[k][t].oPlayCtrl.PlayM4_GetBMP(function (e) {
if (e === 6) {
a(m) } else {
r.oTool.downloadFile(e, n + ".BMP");
o() } }) } else if (i === "JPEG") {
e[k][t].oPlayCtrl.PlayM4_GetJPEG(function (e) {
if (e === 6) {
a(m) } else {
r.oTool.downloadFile(e, n + ".jpeg");
o() } }) } });
return o } }, {
key: "JS_StartSave", value: function ye(t, n) {
var i = new Promise(function (i, r) {
if (t < 0 || t > e[b] - 1) {
r();
return } if (!e[k][t].bPlay) {
r();
return } if (n.indexOf(".mp4") < 0) {
n = n + ".mp4" }
var o = e[k][t].aHead;
var a = 0;
if (e[k][t].szPlayType === "playback") {
a = 1 } S.startRecord(n, o, 2, a, {
cbEventHandler: function s(n) {
e.EventCallback.pluginErrorHandler(t, n) } }).then(function (n) {
e[k][t].szStorageUUID = n;
i() }, function () {
r() }) });
return i } }, {
key: "JS_StopSave", value: function Se(t) {
var n = new Promise(function (n, i) {
if (!e[k][t].szStorageUUID) {
i();
return } S.stopRecord(e[k][t].szStorageUUID).then(function () {
e[k][t].szStorageUUID = "";
n() }, function (e) {
i(e) }) });
return n } }, {
key: "JS_StartTalk", value: function ge() {
var e = new Promise(function (e) {
e() });
return e } }, {
key: "JS_StopTalk", value: function _e() {
var e = new Promise(function (e) {
e() });
return e } }, {
key: "JS_SetPlayMode", value: function Pe() {
var e = new Promise(function (e) {
e() });
return e } }, {
key: "JS_SetFullScreenCapability", value: function we(t) {
var n = new Promise(function (n) {
e[J] = !!t;
n() });
return n } }, {
key: "JS_FullScreenDisplay", value: function be(t) {
var n = new Promise(function (n) {
if (t) {
var i = g.get(0);
if (i.requestFullScreen) {
i.requestFullScreen() } else if (i.webkitRequestFullScreen) {
i.webkitRequestFullScreen() } else if (i.mozRequestFullScreen) {
i.mozRequestFullScreen() } } e[T] = t;
n() });
return n } }, {
key: "JS_FullScreenSingle", value: function ke(t) {
if (!e[k][t].bPlay) {
return }
var n = document.fullscreen || document.webkitIsFullScreen || document.mozFullScreen || false;
var i = g.find(".parent-wnd").eq(0).children().eq(t).get(0);
if (!n) {
if (i.requestFullScreen) {
i.requestFullScreen() } else if (i.webkitRequestFullScreen) {
i.webkitRequestFullScreen() } else if (i.mozRequestFullScreen) {
i.mozRequestFullScreen() } e[I] = g.find(".parent-wnd").eq(0).children().eq(t) } else {
if (g.find(".parent-wnd").eq(0).width() === $(window).width()) {
return } if (document.exitFullscreen) {
document.exitFullscreen() } else if (document.webkitCancelFullScreen) {
document.webkitCancelFullScreen() } else if (document.mozCancelFullScreen) {
document.mozCancelFullScreen() } e[I] = null;
e[T] = false } } }, {
key: "JS_EnableIVS", value: function Ce() {
var e = new Promise(function (e) {
e() });
return e } }, {
key: "JS_SRInit", value: function Re() {
var e = new Promise(function (e) {
e() });
return e } }, {
key: "JS_SRPTZ", value: function Te() {
var e = new Promise(function (e) {
e() });
return e } }, {
key: "JS_SetPlaybackDrawType", value: function Ie() {
var e = new Promise(function (e) {
e() });
return e } }, {
key: "JS_GetLocalConfig", value: function xe() {
var e = {
protocolType: 0, streamType: 0, packgeSize: 1, playWndType: 0, buffNumberType: 2, recordPath: "", capturePath: "", playbackFilePath: "", playbackPicPath: "", downloadPath: "", snapScenePicPath: "", snapViewPicPath: "", ivsMode: -1, realPlayAll: 0, captureFileFormat: 0, osdPosInfo: 0, osdPicInfo: 1, showWizard: 1, secretKey: "", showFireBox: 0, showFireDistance: 0, showFireMaxTemperature: 0, showFireMaxTemperaturePos: 0, showTemperaturePoint: 0, showTemperatureLine: 0, showTemperatureBox: 0, captureIncludeTemperatureInfo: 0 };
var t = new Promise(function (t) {
t(e) });
return t } }, {
key: "JS_SetLocalConfig", value: function De() {
var e = new Promise(function (e) {
e() });
return e } }, {
key: "JS_GetLastError", value: function ze() {
var e = 0;
var t = new Promise(function (t, n) {
if (e < 0) {
n() } else {
t(e) } });
return t } }, {
key: "JS_OpenFileBrowser", value: function Me(t, n) {
var i = new Promise(function (i) {
e[x] = null;
var r = window.document.createElement("input");
r.type = "file";
if (n.toLowerCase() === "bmp") {
r.accept = "image/bmp" } if (t === 0) {
r.setAttribute("webkitdirectory", "") } r.addEventListener("change", function () {
var n = "";
if (t === 1) {
e[x] = r.files[0];
n = r.files[0].name } else if (t === 0) {
e[x] = r.files } i(n) });
var o = document.createEvent("MouseEvents");
o.initEvent("click", true, true);
r.dispatchEvent(o) });
return i } }, {
key: "JS_OpenDirectory", value: function Ee() {
var e = new Promise(function (e) {
e() });
return e } }, {
key: "JS_StartAsynUpload", value: function Oe(t) {
var n = new Promise(function (n) {
var i = new XMLHttpRequest;
i.onreadystatechange = function () {
if (i.readyState === 4) {
e[D] = i.responseText } };
i.open("put", t, true);
i.send(e[x]);
n() });
return n } }, {
key: "JS_StopAsynUpload", value: function Fe() {
var t = new Promise(function (t) {
e[D] = "";
t() });
return t } }, {
key: "JS_UploadFile", value: function qe(t, n, i, o) {
var a = new Promise(function (n, i) {
var a = new XMLHttpRequest;
a.onreadystatechange = function () {
if (a.readyState === 4) {
if (a.status !== 200) {
i(r.oTool.parseXmlFromStr(a.responseText)) } else {
n() } } };
a.open("put", t, false);
if ("application/x-x509-ca-cert" === o || "application/x-pem-file" === o) {
a.setRequestHeader("Content-Type", o) } else {
a.setRequestHeader("Content-Type", "oct/stream") } a.send(e[x]) });
return a } }, {
key: "JS_GetUploadErrorInfo", value: function Je() {
var t = new Promise(function (t, n) {
if (typeof e[D] === "string" && e[D].length > 0) {
t(e[D]) } else {
n() } });
return t } }, {
key: "JS_DownloadFile", value: function We(e) {
var t = new Promise(function (t) {
$("body").append('<a id="jsplugin_download_a" href="' + e + '"><li id="jsplugin_download_li"></li></a>');
$("#jsplugin_download_li").trigger("click");
$("#jsplugin_download_a").remove();
t() });
return t } }, {
key: "JS_StartUpgrade", value: function Le(t, n) {
var i = new Promise(function (i, o) {
if (!t) {
o();
return } if (!n) {
o();
return } e[D] = 0;
var a = new XMLHttpRequest;
a.onreadystatechange = function () {
if (a.readyState === 4) {
if (a.status === 200) {
e[D] = 100;
i() } else {
e[D] = 1;
var t = r.oTool.parseXmlFromStr(a.responseText);
if ($(t).find("subStatusCode").text() === "lowPrivilege") {
o(403) } else {
o() } } } };
a.open("put", t, true);
a.send(e[x]);
e[z] = n });
return i } }, {
key: "JS_StopUpgrade", value: function Ae() {
var t = new Promise(function (t) {
e[x] = null;
t() });
return t } }, {
key: "JS_GetUpgradeStatus", value: function Be() {
var t = new Promise(function (t) {
if (e[D] === 100) {
t(0) } t(e[D]) });
return t } }, {
key: "JS_GetUpgradeProgress", value: function Ue() {
var t = new Promise(function (t) {
var n = 0;
var i = new XMLHttpRequest;
i.onreadystatechange = function () {
if (i.readyState === 4) {
if (i.status === 200) {
n = parseInt($(r.oTool.parseXmlFromStr(i.responseText)).find("percent").text(), 10) } } };
i.open("get", e[z], false);
i.send(null);
if (e[D] === 100) {
t(100) } t(n) });
return t } }, {
key: "JS_ExportDeviceLog", value: function $e(e, t, n) {
var i = new Promise(function (i) {
var r = [];
var o = [];
r = r.concat($(e).find("searchMatchItem").toArray());
for (var a = 0;
a < r.length;
a++) {
o[a] = [];
o[a][0] = $(r[a]).find("logtime").text().replace("T", " ").replace("Z", "");
o[a][1] = $(r[a]).find("majortype").text();
o[a][2] = $(r[a]).find("minortype").text();
o[a][3] = $(r[a]).find("channelid").text();
o[a][4] = $(r[a]).find("userName").text();
o[a][5] = $(r[a]).find("remoteaddress").text() }
var s = [];
function u(e) {
s.push(e);
var t = e.slice("");
if (/^[\u4e00-\u9fa5]/.test(e)) {
for (var n = 0;
n < 30 - t.length * 2;
n++) {
s.push(" ") } } else {
for (var i = 0;
i < 30 - t.length;
i++) {
s.push(" ") } } } u(" ");
u($(e).find("laLogTime").text());
u($(e).find("laLogMajorType").text());
u($(e).find("laLogMinorType").text());
u($(e).find("laLogChannel").text());
u($(e).find("laLogRemoteUser").text());
u($(e).find("laLogRemoteIP").text());
s.push("\r\n");
for (var l = 0;
l < o.length;
l++) {
var f = (l + 1).toString();
u(f);
for (var c = 0;
c < 6;
c++) {
u(o[l][c]) } s.push("\r\n") } s = s.join("");
var h = "\ufeff";
var d = void 0;
if (n === 5) {
d = new Blob([h + s], {
type: "text/csv" }) } else {
d = new Blob([s], {
type: "text/plain" });
t = "Log.txt" }
var v = (window.URL || window.webkitURL).createObjectURL(d);
var p = window.document.createElement("a");
p.href = v;
p.download = t;
var m = document.createEvent("MouseEvents");
m.initEvent("click", true, true);
p.dispatchEvent(m);
i() });
return i } }, {
key: "outCsv", value: function He(e, t, n, i) {
var r = "";
var o = "";
for (var a = 0;
a < n.length;
a++) {
o += $(e).find(n[a]).eq(0).text() + "," } o = o.slice(0, -1);
r += o + "\r\n";
for (var s = 0;
s < i.length;
s++) {
o = "";
for (var u = 0;
u < n.length;
u++) {
o += '"' + i[s][u] + '",' } o.slice(0, o.length - 1);
r += o + "\r\n" } if (r === "") {
return }
var l = "";
l += t;
var f = "\ufeff";
if (window.navigator.msSaveOrOpenBlob) {
var c = f + r;
var h = new Blob([decodeURIComponent(encodeURI(c))], {
type: "data:text/csv;charset=utf-8," });
navigator.msSaveBlob(h, l + ".csv") } else {
f = "data:text/csv;charset=utf-8,\ufeff";
var d = f + r;
var v = encodeURI(d);
var p = document.createElement("a");
p.setAttribute("href", v);
p.setAttribute("download", l + ".csv");
document.body.appendChild(p);
p.click() } } }, {
key: "JS_ExportReport", value: function Ne(e, t, n) {
var i = this;
var r = new Promise(function (r) {
var o = [];
var a = [];
var s = $(e).find("NameList").text().split(",");
o = o.concat($(e).find("tDataItem").toArray());
for (var u = 0;
u < o.length;
u++) {
a[u] = [];
for (var l = 0;
l < s.length;
l++) {
a[u][l] = $(o[u]).find(s[l]).text();
if (s[l] === "logtime") {
a[u][l] = a[u][l].replace("T", " ").replace("Z", "") } } }
var f = [];
if (n === 1) {
i.outCsv(e, t, s, a) } else {
var c = function n(e) {
f.push(e);
var t = e.slice("");
if (/^[\u4e00-\u9fa5]/.test(e)) {
for (var n = 0;
n < 30 - t.length * 2;
n++) {
f.push(" ") } } else {
for (var i = 0;
i < 30 - t.length;
i++) {
f.push(" ") } } };
c(" ");
for (var h = 0;
h < s.length;
h++) {
c($(e).find(s[h]).eq(0).text()) } f.push("\r\n");
for (var d = 0;
d < a.length;
d++) {
var v = (d + 1).toString();
c(v);
for (var p = 0;
p < s.length;
p++) {
c(a[d][p]) } f.push("\r\n") } f = f.join("");
var m = void 0;
m = new Blob([f], {
type: "text/plain" });
var y = (window.URL || window.webkitURL).createObjectURL(m);
var S = window.document.createElement("a");
S.href = y;
S.download = t;
var g = document.createEvent("MouseEvents");
g.initEvent("click", true, true);
S.dispatchEvent(g) } r() });
return r } }, {
key: "JS_StartAsyncDownload", value: function Ge(e, t, n, i) {
var o = new Promise(function (t) {
var o = $(r.oTool.parseXmlFromStr(i)).find("playbackURI").eq(0).text();
var a = e + (e.indexOf("?") >= 0 ? "&" : "?") + "playbackURI=" + o;
$("body").append('<a id="jsplugin_download_a" href="' + a + '" download=' + n + '><li id="jsplugin_download_li"></li></a>');
$("#jsplugin_download_li").trigger("click");
$("#jsplugin_download_a").remove();
t() });
return o } }, {
key: "JS_StopAsyncDownload", value: function je() {
var e = new Promise(function (e) {
e() });
return e } }, {
key: "JS_GetDownloadStatus", value: function Ve() {
var e = new Promise(function (e) {
e() });
return e } }, {
key: "JS_GetDownloadProgress", value: function Xe() {
var e = new Promise(function (e) {
e() });
return e } }, {
key: "JS_EnablePDC", value: function Ye() {
var e = new Promise(function (e) {
e() });
return e } }, {
key: "JS_Resize", value: function Ze(t, n) {
var i = new Promise(function (i) {
setTimeout(function () {
var i = document.fullscreen || document.webkitIsFullScreen || document.mozFullScreen || false;
if (e[T] && i) {
t = $(window).width();
n = $(window).height();
g.find("div").eq(0).css({
width: t, height: n }) } else {
g.find("div").eq(0).css({
width: t, height: n }) } e[_].iWidth = t;
e[_].iHeight = n;
if (r.oTool.isFirefox()) {
for (var o = 0;
o < e[_].iMaxSplit * e[_].iMaxSplit;
o++) {
if (e[k][o].oPlayCtrl) {
e[k][o].oPlayCtrl.PlayM4_ClearCanvas() } } } U();
if (e[I] && i) {
t = $(window).width();
n = $(window).height();
e[I].css({
width: t, height: n });
e[I].find("canvas").attr("width", t - 2);
e[I].find("canvas").attr("height", n - 2) } if (!i) {
e[I] = null;
e[T] = false } e[C].resizeCanvas();
e[C].canvasRedraw() }, 80);
i() });
return i } }, {
key: "JS_SetDrawCallback", value: function Ke(t, n, i, r, o) {
var a = new Promise(function (i, r) {
e[E] = null;
e[O][t] = null;
if (!e[k][t].bPlay) {
r();
return } if (n) {
$(".draw-window").unbind();
e[E] = o;
e[O][t] = o;
e[C] = new u.ESCanvas("canvas_draw" + t);
e[C].setShapeType("Rect");
e[C].setDrawStyle("#ff0000", "", 0);
e[C].setDrawStatus(true, function (e) {
o(e) });
e[k][t].bSetDrawCallback = true } else {
e[C].setDrawStatus(false);
e[k][t].bSetDrawCallback = false;
e[F] && e[F].onDrawEvent && e[C].setDrawEventCallback(e[F].onDrawEvent) } i() });
return a } }, {
key: "JS_SetDrawStatus", value: function Qe(t) {
var n = new Promise(function (n, i) {
if (!e[C]) {
i();
return } e[C].setDrawStatus(t);
n() });
return n } }, {
key: "JS_ClearRegion", value: function et() {
var t = new Promise(function (t, n) {
if (!e[C]) {
n();
return } e[C].clearAllShape();
t() });
return t } }, {
key: "JS_SetDrawShapeInfo", value: function tt(t, n) {
var i = new Promise(function (i, r) {
if (typeof t === "undefined" || t === "") {
r();
return } e[C].setShapeType(t);
e[C].setDrawStatus(true);
e[C].setDrawMutiShapeOneTime(false);
e[C].setDrawStyle(n.drawColor || "", n.fillColor || n.drawColor || "", n.translucent || 0);
if (n.maxShapeSupport && n.maxShapeSupport > 0) {
if (n.id) {
var o = e[C].getAllShapesInfo().length;
e[C].setMaxShapeSupport(o + 1) } else {
e[C].setMaxShapeSupport(n.maxShapeSupport) } } e[C].setCurrentShapeInfo({
szId: n.id, szTips: n.tips, iMinClosed: n.minPointSupport || 3, iMaxPointNum: n.maxPointSupport || 11, iPolygonType: 1, szDrawColor: n.drawColor || "", szFillColor: n.fillColor || n.drawColor || "", iTranslucent: n.translucent || 0, iRedrawMode: n.redrawMode || 0 });
i() });
return i } }, {
key: "JS_SetGridInfo", value: function nt(t) {
var n = new Promise(function (n, i) {
if (t === null || typeof t === "undefined") {
i();
return }
var r = "#ff0000";
if (t.drawColor) {
r = t.drawColor } e[C].setDrawStyle(r);
e[C].setShapesInfoByType("Grid", [{
gridMap: t.gridMap, gridColNum: t.gridColNum, gridRowNum: t.gridRowNum }]);
e[C].setShapeType("Grid");
n() });
return n } }, {
key: "JS_GetGridInfo", value: function it() {
var t = new Promise(function (t, n) {
if (!e[C]) {
n() }
var i = e[C].getShapesInfoByType("Grid")[0];
if (!i) {
n() } t({
gridColNum: i.gridColNum, gridRowNum: i.gridRowNum, gridMap: i.gridMap }) });
return t } }, {
key: "JS_SetRectInfo", value: function rt(t) {
var n = new Promise(function (n, i) {
if (typeof t === "undefined" || !t.length) {
i();
return } if (t[0] && t[0].maxShapeSupport && t[0].maxShapeSupport > 0) {
e[C].setMaxShapeSupport(t[0].maxShapeSupport) } else {
e[C].setMaxShapeSupport(10) } e[C].setDrawMutiShapeOneTime(false);
var r = [];
if (t.length > 0) {
for (var o = 0, a = t.length;
o < a;
o++) {
var s = t[o].points;
if (s.length > 0) {
r.push(t[o]) } } } if (r.length > 0) {
e[C].setShapesInfoByType("Rect", r);
n() } else {
i() } });
return n } }, {
key: "JS_GetRectInfo", value: function ot() {
var t = new Promise(function (t, n) {
if (!e[C]) {
n() }
var i = [];
var r = e[C].getShapesInfoByType("Rect");
for (var o = 0, a = r.length;
o < a;
o++) {
var s = r[o];
var u = {
id: s.id, points: s.points, tips: s.tips };
i.push(u) } t(i) });
return t } }, {
key: "JS_SetPolygonInfo", value: function at(t) {
var n = new Promise(function (n, i) {
if (typeof t === "undefined" || !t.length) {
i();
return } e[C].setMaxShapeSupport(10);
e[C].setDrawMutiShapeOneTime(false);
e[C].setShapeType("");
var r = [];
if (t.length > 0) {
for (var o = 0, a = t.length;
o < a;
o++) {
var s = t[o].points;
if (s.length > 0) {
e[C].setCurrentShapeInfo({
szId: t[o].id });
r.push(t[o]) } } } if (r.length > 0) {
e[C].setShapesInfoByType("Polygon", r);
n() } else {
i() } });
return n } }, {
key: "JS_GetPolygonInfo", value: function st() {
var t = new Promise(function (t) {
var n = [];
var i = e[C].getShapesInfoByType("Polygon");
for (var r = 0, o = i.length;
r < o;
r++) {
var a = i[r];
var s = {
id: a.id, points: a.points, closed: a.closed, tips: a.tips, drawColor: a.drawColor };
n.push(s) } t(n) });
return t } }, {
key: "JS_SetLineInfo", value: function ut(t) {
var n = new Promise(function (n, i) {
if (typeof t === "undefined" || !t.length) {
i();
return }
var r = [];
e[C].setMaxShapeSupport(10);
e[C].setDrawMutiShapeOneTime(false);
if (t.length > 0) {
for (var o = 0, a = t.length;
o < a;
o++) {
var s = e[C].getShapesInfoByType("Line");
for (var u = 0, l = s.length;
u < l;
u++) {
var f = s[u];
if (t[o].id === f.id) {
e[C].deleteRepeatByIdAndType(t[o].id, "Line") } }
var c = t[o].points;
if (c.length > 0) {
r.push(t[o]) } } } if (r.length > 0) {
e[C].setShapesInfoByType("Line", r);
n() } else {
i() } });
return n } }, {
key: "JS_GetLineInfo", value: function lt() {
var t = new Promise(function (t) {
var n = [];
var i = e[C].getShapesInfoByType("Line");
for (var r = 0, o = i.length;
r < o;
r++) {
var a = i[r];
var s = {
id: a.id, lineType: a.lineType, points: a.points, tips: a.tips, direction: a.direction, pdcArrow: a.pdcArrow };
n.push(s) } t(n) });
return t } }, {
key: "JS_SetTextOverlay", value: function ft(t) {
var n = new Promise(function (n) {
e[C] = null;
e[C] = new u.ESCanvas("canvas_draw" + e[M]);
e[C].setMaxShapeSupport(20);
e[C].clearShapeByType("RectOSD");
e[C].setDrawStyle("#ff0000", "#343434", .7);
var i = "";
var r = "";
var o = 0;
var a = 0;
if (t.channelName) {
i = t.channelName.name;
r = t.channelName.enable.toString();
o = t.channelName.point[0];
a = t.channelName.point[1];
e[C].addOSDShape(i, r, o, a, {
szOSDType: "overlay-ch", szAlignment: t.channelName.alignment || "0" }) } if (t.date) {
var s = t.date.dateType;
var l = t.date.showWeekDay;
var f = t.date.timeFormat;
var c = "";
var h = "";
i = "";
r = t.date.enable.toString();
o = t.date.point[0];
a = t.date.point[1];
var d = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var v = new Date;
if (l) {
c = d[v.getDay()] } if (f === "24hour") {
h = "" } else {
h = "AM/PM" } switch (s) {
case 0: i = "YYYY-MM-DD " + c + " hh:mm:ss " + h;
break;
case 1: i = "MM-DD-YYYY " + c + " hh:mm:ss " + h;
break;
case 2: i = "CHR-YYYY-MM-DD " + c + " hh:mm:ss " + h;
break;
case 3: i = "CHR-MM-DD-YYYY " + c + " hh:mm:ss " + h;
break;
case 4: i = "DD-MM-YYYY " + c + " hh:mm:ss " + h;
break;
case 5: i = "CHR-DD-MM-YYYY " + c + " hh:mm:ss " + h;
break;
default:
break }e[C].addOSDShape(i, r, o, a, {
szOSDType: "overlay-date", szDateStyle: s.toString(), szDisplayWeek: l.toString(), szClockType: f, szAlignment: t.date.alignment || "0" }) } if (t.text) {
var p = "";
var m = t.text.length;
i = "";
r = "";
o = 0;
a = 0;
for (var y = 0;
y < m;
y++) {
p = t.text[y].id;
i = t.text[y].text;
r = t.text[y].enable.toString();
o = t.text[y].point[0];
a = t.text[y].point[1];
e[C].addOSDShape(i, r, o, a, {
szOSDType: "overlay-text", szId: p, szAlignment: t.text[y].alignment || "0" }) } } n() });
return n } }, {
key: "JS_GetTextOverlay", value: function ct() {
var t = new Promise(function (t) {
var n = {};
var i = [];
var r = e[C].getShapesInfoByType("RectOSD");
for (var o = 0, a = r.length;
o < a;
o++) {
var s = r[o];
if (s.szOSDType === "overlay-ch") {
n.channelName = {
enable: s.szEnabled === "true", name: s.szText, alignment: s.szAlignment || "0", point: [s.iPositionX, s.iPositionY] } } if (s.szOSDType === "overlay-date") {
n.date = {
enable: s.szEnabled === "true", alignment: s.szAlignment || "0", dateType: parseInt(s.szDateStyle, 10), timeFormat: s.szClockType, showWeekDay: s.szDisplayWeek === "true", point: [s.iPositionX, s.iPositionY] } } if (s.szOSDType === "overlay-text") {
i.push({
id: s.szId, enable: s.szEnabled === "true", alignment: s.szAlignment || "0", text: s.szText, point: [s.iPositionX, s.iPositionY] }) } } n.text = i;
t(n) });
return t } }, {
key: "JS_SetPointInfo", value: function ht(e) {
var t = function n() {};
t(e) } }, {
key: "JS_GetPointInfo", value: function dt() {} }, {
key: "JS_ClearShapeByType", value: function vt(t) {
var n = new Promise(function (n, i) {
if (!e[C]) {
i();
return } if (t === "Choosed") {
var r = e[C].deleteChoosedShape();
n(r) } else {
e[C].clearShapeByType(t);
n() } });
return n } }, {
key: "JS_PlayWithImg", value: function pt(e, t) {
if (this[_].iType !== 1) {
return }
var n = $("#canvas_play" + e);
var i = n.width();
var r = n.height();
n.hide();
var o = $("#playImg" + e);
o.show();
o.css({
width: i + "px", height: r + "px", border: "1px solid " + this[_].oStyle.border, position: "absolute", left: 0 });
o.attr("src", t) } }, {
key: "JS_SetIsHttps", value: function mt() {
var e = new Promise(function (e) {
e() });
return e } }, {
key: "JS_SetReconnectInfo", value: function yt() {
var e = new Promise(function (e) {
e() });
return e } }, {
key: "JS_CheckUpdate", value: function St() {
var e = new Promise(function (e) {
e(false) });
return e } }, {
key: "JS_SelectShape", value: function gt(t, n) {
var i = new Promise(function (i, r) {
if (!t) {
r();
return } e[C].selectShapeById(t, "" + n);
i() });
return i } }, {
key: "JS_GetPictureSize", value: function _t() {
var e = new Promise(function (e) {
e() });
return e } }, {
key: "JS_SetOriginResolution", value: function Pt() {
var e = new Promise(function (e) {
e() });
return e } }, {
key: "JS_SetPlayWndMode", value: function wt() {
var e = new Promise(function (e) {
e() });
return e } }, {
key: "JS_UpdateWindowStyle", value: function bt(t) {
var n = new Promise(function (n) {
e[_].oStyle = t;
U();
n() });
return n } }, {
key: "JS_CuttingPartWindow", value: function kt() {
var e = new Promise(function (e) {
e() });
return e } }, {
key: "JS_RepairPartWindow", value: function Ct() {
var e = new Promise(function (e) {
e() });
return e } }, {
key: "JS_ClearAllCanvas", value: function Rt() {
var e = new Promise(function (e) {
$(".draw-window").each(function () {
$(this)[0].getContext("2d").clearRect(0, 0, $(this).width(), $(this).height()) });
e() });
return e } }]);
return o }();
return N }();
t.JSPlugin = f }, function (e, t, n) {
"use strict";
Object.defineProperty(t, "__esModule", {
value: true });
t.StreamClient = undefined;
var i = function () {
function e(e, t) {
for (var n = 0;
n < t.length;
n++) {
var i = t[n];
i.enumerable = i.enumerable || false;
i.configurable = true;
if ("value" in i) i.writable = true;
Object.defineProperty(e, i.key, i) } }
return function (t, n, i) {
if (n) e(t.prototype, n);
if (i) e(t, i);
return t } }();
var r = n(1);
var o = f(r);
var a = n(19);
var s = n(20);
var u = n(21);
var l = n(24);
function f(e) {
return e && e.__esModule ? e : {
"default": e } } function c(e, t) {
if (!(e instanceof t)) {
throw new TypeError("Cannot call a class as a function") } }
var h = function () {
var e = Symbol("WEBSOCKET");
var t = Symbol("GETINDEX");
var n = Symbol("PROTOCOLVERSION");
var r = Symbol("CIPHERSUITES");
var f = new a.DirectDeviceCustom;
var h = new s.DirectDevice;
var d = new u.LiveMedia;
var v = new l.LocalService;
var p = function () {
function a() {
c(this, a);
this[n] = "0.1";
this[r] = 0;
this[e] = [];
this.ERRORS = {};
this[t] = function (t) {
var n = -1;
for (var i = 0, r = this[e].length;
i < r;
i++) {
if (this[e][i].id === t) {
n = i;
break } }
return n } } i(a, [{
key: "openStream", value: function s(i, a, u, l) {
var c = false;
if (i.indexOf("[") > -1) {
c = true }
var p = this;
var m = i.split("://");
var y = m[0];
var S = "";
var g = 7681;
var _ = 1;
var P = 0;
if (c) {
S = m[1].split("]:")[0] + "]";
g = Math.floor(m[1].split("]:")[1].split("/")[0]);
_ = Math.floor(m[1].split("]:")[1].split("/")[1] / 100);
P = Math.floor(m[1].split("]:")[1].split("/")[1] % 100) - 1 } else {
S = m[1].split(":")[0];
g = Math.floor(m[1].split(":")[1].split("/")[0]);
_ = Math.floor(m[1].split(":")[1].split("/")[1] / 100);
P = Math.floor(m[1].split(":")[1].split("/")[1] % 100) - 1 } if (_ === 0) {
P = 0 } a = a || {};
var w = "&sessionID=";
if (a.token && !a.playURL) {
w = "&token=" }
var b = "";
if (a.secondAuth) {
var k = a.secondAuth.split("&");
if (k && k.length) {
k.forEach(function (e) {
if (-1 !== e.indexOf("security=") || -1 !== e.indexOf("iv=")) {
b += "&" + e } else {
var t = e.split("=");
if (t && 2 === t.length) {
a[t[0]] = t[1] } } }) } }
var C = a.sessionID || a.session || (a.playURL ? "" : a.token) || "";
var R = new window.WebSocket(y + "://" + S + ":" + g + (a.mode ? "/" + a.mode : "") + "?version=" + p[n] + "&cipherSuites=" + p[r] + w + C + b + (a.proxy ? "&proxy=" + a.proxy : ""));
R.binaryType = "arraybuffer";
var T = o["default"].v4();
var I = new Promise(function (i, o) {
R.onopen = function () {
if (!a.playURL && !a.sessionID && !a.deviceSerial && !a.token) {
p[e].push(f.createClientObject(R, T, _, P));
i(T) } };
R.onmessage = function (s) {
if (typeof s.data === "string") {
var l = JSON.parse(s.data);
var f = p[t](T);
if (l && l.version && l.cipherSuite) {
p[n] = l.version;
p[r] = parseInt(l.cipherSuite, 10);
if (l && l.PKD && l.rand) {
p[e].push(d.createClientObject(R, T, l.PKD, l.rand, a)) } else {
var c = "live://" + S + ":" + g + "/" + _ + "/" + P;
if (p[r] === -1) {
p[e].push(v.createClientObject(R, T, c, a)) } else {
p[e].push(h.createClientObject(R, T, c)) } } i(T);
return } if (l && l.sdp) {
var m = h.getMediaFromSdp(l.sdp);
u({
bHead: true, buf: m }) } if (l && l.cmd) {
if (l.cmd === "end") {
u({
type: "exception", cmd: l.cmd }) } } if (l && l.statusString) {
if (l.statusString.toLowerCase() === "ok") {
if (p[e][f].resolve) {
p[e][f].resolve(l) } } if (l.statusString.toLowerCase() !== "ok") {
var y = h.getError(l);
if (f > -1) {
if (p[e][f].reject) {
p[e][f].reject(y) } } else {
o(y) } } } } else {
var w = {};
var b = new Uint8Array(s.data);
if (b.byteLength === 64 || b.byteLength === 40) {
var k = -1;
var C = b.byteLength;
for (var I = 0;
I < C;
I++) {
if (b[I] === 73 && b[I + 1] === 77 && b[I + 2] === 75 && b[I + 3] === 72) {
k = I;
break } } if (k !== -1) {
var x = b.slice(k, k + 40);
w = {
bHead: true, buf: x } } else {
w = {
bHead: false, buf: b } } } else {
w = {
bHead: false, buf: b } } u(w);
b = null;
w = null;
s = null } };
R.onclose = function () {
for (var t = 0, n = p[e].length;
t < n;
t++) {
if (p[e][t].id === T) {
p[e][t].resolve();
p[e].splice(t, 1);
setTimeout(function () {
l() }, 200);
break } } o() } });
return I } }, {
key: "startPlay", value: function u(i, o, a, s) {
var u = this;
var l = this[t](i);
if (o && a && u[n] === "0.1") {
o = o.replace(/-/g, "").replace(/:/g, "");
a = a.replace(/-/g, "").replace(/:/g, "") }
var c = new Promise(function (t, i) {
if (l > -1) {
u[e][l].resolve = t;
u[e][l].reject = i;
var c = null;
if (!o || !a) {
if (u[e][l].iCurChannel === 0 && u[n] === "0.1") {
c = f.zeroPlayCmd(u[e][l].iCurChannel, u[e][l].iCurStream) } else {
if (u[n] !== "0.1") {
if (u[r] === 0) {
c = d.playCmd(u[e][l]) } else if (u[r] === 1) {
c = h.playCmd(u[e][l].playURL) } else if (u[r] === -1) {
c = v.playCmd(u[e][l]) } } else {
c = f.playCmd(u[e][l].iCurChannel, u[e][l].iCurStream) } } } else {
if (u[n] !== "0.1") {
if (u[r] === 0) {
c = d.playbackCmd(u[e][l], o, a) } else if (u[r] === 1) {
c = h.playbackCmd(o, a, u[e][l].playURL, s) } else if (u[r] === -1) {
c = v.playbackCmd(u[e][l], o, a) } } else {
c = f.playbackCmd(o, a, u[e][l].iCurChannel, u[e][l].iCurStream) } } u[e][l].socket.send(c);
if (u[n] === "0.1") {
t() } } else {
if (u[n] === "0.1") {
i() } } });
return c } }, {
key: "singleFrame", value: function l() {} }, {
key: "setPlayRate", value: function p(t, i) {
var r = this;
var o = new Promise(function (o, a) {
for (var s = 0, u = r[e].length;
s < u;
s++) {
if (r[e][s].id === t) {
if (r[n] === "0.1") {
var l = f.playRateCmd(i);
r[e][s].socket.send(l);
o();
break } else {
r[e][s].resolve = o;
r[e][s].reject = a;
var c = h.playRateCmd(i);
r[e][s].socket.send(c) } } } });
return o } }, {
key: "seek", value: function m(t, n, i) {
var r = this;
var o = new Promise(function (o, a) {
for (var s = 0, u = r[e].length;
s < u;
s++) {
if (r[e][s].id === t) {
r[e][s].resolve = o;
r[e][s].reject = a;
var l = d.seekCmd(n, i);
r[e][s].socket.send(l) } } });
return o } }, {
key: "pause", value: function y(t) {
var i = this;
var r = new Promise(function (r, o) {
for (var a = 0, s = i[e].length;
a < s;
a++) {
if (i[e][a].id === t) {
if (i[n] === "0.1") {
var u = f.pauseCmd();
i[e][a].socket.send(u);
r();
break } else {
i[e][a].resolve = r;
i[e][a].reject = o;
var l = h.pauseCmd();
i[e][a].socket.send(l) } } } });
return r } }, {
key: "transmission", value: function S(t, n) {
var i = this;
var r = new Promise(function (r, o) {
for (var a = 0, s = i[e].length;
a < s;
a++) {
if (i[e][a].id === t) {
i[e][a].resolve = r;
i[e][a].reject = o;
i[e][a].socket.send(n) } } });
return r } }, {
key: "resume", value: function g(t) {
var i = this;
var r = new Promise(function (r, o) {
for (var a = 0, s = i[e].length;
a < s;
a++) {
if (i[e][a].id === t) {
if (i[n] === "0.1") {
var u = f.resumeCmd();
i[e][a].socket.send(u);
r();
break } else {
i[e][a].resolve = r;
i[e][a].reject = o;
var l = h.resumeCmd();
i[e][a].socket.send(l) } } } });
return r } }, {
key: "stop", value: function _(t) {
var n = this;
var i = new Promise(function (i, r) {
if (!t) {
r() } else {
var o = -1;
for (var a = 0, s = n[e].length;
a < s;
a++) {
if (n[e][a].id === t) {
o = a;
n[e][a].resolve = i;
n[e][a].socket.close(1e3, "CLOSE");
break } } if (o === -1) {
r() } } });
return i } }, {
key: "stopAll", value: function P() {
var t = this;
for (var n = 0, i = t[e].length;
n < i;
n++) {
t[e][n].socket.close(1e3, "CLOSE") } } }]);
return a }();
return p }();
t.StreamClient = h }, function (e, t, n) {
var i = n(5);
var r = n(6);
var o;
var a;
var s = 0;
var u = 0;
function l(e, t, n) {
var l = t && n || 0;
var f = t || [];
e = e || {};
var c = e.node || o;
var h = e.clockseq !== undefined ? e.clockseq : a;
if (c == null || h == null) {
var d = i();
if (c == null) {
c = o = [d[0] | 1, d[1], d[2], d[3], d[4], d[5]] } if (h == null) {
h = a = (d[6] << 8 | d[7]) & 16383 } }
var v = e.msecs !== undefined ? e.msecs : (new Date).getTime();
var p = e.nsecs !== undefined ? e.nsecs : u + 1;
var m = v - s + (p - u) / 1e4;
if (m < 0 && e.clockseq === undefined) {
h = h + 1 & 16383 } if ((m < 0 || v > s) && e.nsecs === undefined) {
p = 0 } if (p >= 1e4) {
throw new Error("uuid.v1(): Can't create more than 10M uuids/sec") } s = v;
u = p;
a = h;
v += 122192928e5;
var y = ((v & 268435455) * 1e4 + p) % 4294967296;
f[l++] = y >>> 24 & 255;
f[l++] = y >>> 16 & 255;
f[l++] = y >>> 8 & 255;
f[l++] = y & 255;
var S = v / 4294967296 * 1e4 & 268435455;
f[l++] = S >>> 8 & 255;
f[l++] = S & 255;
f[l++] = S >>> 24 & 15 | 16;
f[l++] = S >>> 16 & 255;
f[l++] = h >>> 8 | 128;
f[l++] = h & 255;
for (var g = 0;
g < 6;
++g) {
f[l + g] = c[g] }
return t ? t : r(f) } e.exports = l }, function (e, t, n) {
var i = n(5);
var r = n(6);
function o(e, t, n) {
var o = t && n || 0;
if (typeof e == "string") {
t = e === "binary" ? new Array(16) : null;
e = null } e = e || {};
var a = e.random || (e.rng || i)();
a[6] = a[6] & 15 | 64;
a[8] = a[8] & 63 | 128;
if (t) {
for (var s = 0;
s < 16;
++s) {
t[o + s] = a[s] } }
return t || r(a) } e.exports = o }, function (e, t, n) {
"use strict";
Object.defineProperty(t, "__esModule", {
value: true });
var i = function () {
function e(e, t) {
for (var n = 0;
n < t.length;
n++) {
var i = t[n];
i.enumerable = i.enumerable || false;
i.configurable = true;
if ("value" in i) i.writable = true;
Object.defineProperty(e, i.key, i) } }
return function (t, n, i) {
if (n) e(t.prototype, n);
if (i) e(t, i);
return t } }();
function r(e, t) {
if (!(e instanceof t)) {
throw new TypeError("Cannot call a class as a function") } }
var o = function () {
var e = function () {
function e() {
r(this, e) } i(e, [{
key: "createClientObject", value: function t(e, n, i, r) {
return {
socket: e, id: n, iCurChannel: i, iCurStream: r, resolve: null, reject: null } } }, {
key: "zeroPlayCmd", value: function n(e, t) {
var n = [0, 0, 0, 44, 0, 0, 0, 0, 0, 0, 0, 0, 0, 19, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, e + 1, 0, 0, 0, t, 0, 0, 4, 0];
return new Uint8Array(n) } }, {
key: "playCmd", value: function o(e, t) {
var n = [0, 0, 0, 44, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, e, 0, 0, 0, t, 0, 0, 4, 0];
return new Uint8Array(n) } }, {
key: "playbackCmd", value: function a(e, t, n, i) {
var r = e.split("T")[0];
var o = e.split("T")[1];
var a = "0" + parseInt(r.substring(0, 4), 10).toString(16);
var s = parseInt(r.substring(4, 6), 10);
var u = parseInt(r.substring(6), 10);
var l = parseInt(o.substring(0, 2), 10);
var f = parseInt(o.substring(2, 4), 10);
var c = parseInt(o.substring(4, 6), 10);
var h = t.split("T")[0];
var d = t.split("T")[1];
var v = "0" + parseInt(h.substring(0, 4), 10).toString(16);
var p = parseInt(h.substring(4, 6), 10);
var m = parseInt(d.substring(0, 2), 10);
var y = parseInt(d.substring(2, 4), 10);
var S = parseInt(d.substring(4, 6), 10);
var g = [0, 0, 0, 96, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, n, 0, 0, parseInt(a.substring(0, 2), 16), parseInt(a.substring(2, 4), 16), 0, 0, 0, s, 0, 0, 0, u, 0, 0, 0, l, 0, 0, 0, f, 0, 0, 0, c, 0, 0, parseInt(v.substring(0, 2), 16), parseInt(v.substring(2, 4), 16), 0, 0, 0, p, 0, 0, 0, u, 0, 0, 0, m, 0, 0, 0, y, 0, 0, 0, S, 0, 0, 0, 0, 0, 0, 0, 0, i, 0, 0, 0];
return new Uint8Array(g) } }, {
key: "playRateCmd", value: function s(e) {
var t = (parseInt(e, 10) >>> 0).toString(16).toLocaleUpperCase().toString(16);
for (var n = t.length;
n < 8;
n++) {
t = "0" + t }
var i = [0, 0, 0, 0];
for (var r = 0, o = t.length;
r < o;
r = r + 2) {
i[Math.floor(r / 2)] = parseInt(t.substring(r, r + 2), 16) }
var a = [0, 0, 0, 36, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 1, 47, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, i[0], i[1], i[2], i[3]];
return new Uint8Array(a) } }, {
key: "pauseCmd", value: function u() {
var e = [0, 0, 0, 32, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 1, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
return new Uint8Array(e) } }, {
key: "resumeCmd", value: function l() {
var e = [0, 0, 0, 32, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 1, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
return new Uint8Array(e) } }]);
return e }();
return e }();
t.DirectDeviceCustom = o }, function (e, t, n) {
"use strict";
Object.defineProperty(t, "__esModule", {
value: true });
var i = function () {
function e(e, t) {
for (var n = 0;
n < t.length;
n++) {
var i = t[n];
i.enumerable = i.enumerable || false;
i.configurable = true;
if ("value" in i) i.writable = true;
Object.defineProperty(e, i.key, i) } }
return function (t, n, i) {
if (n) e(t.prototype, n);
if (i) e(t, i);
return t } }();
function r(e, t) {
if (!(e instanceof t)) {
throw new TypeError("Cannot call a class as a function") } }
var o = 2203;
var a = 2206;
var s = 2207;
var u = 3001;
var l = 3002;
var f = 3003;
var c = 3004;
var h = 3005;
var d = function () {
var e = function () {
function e() {
r(this, e) } i(e, [{
key: "createClientObject", value: function t(e, n, i) {
return {
socket: e, id: n, playURL: i, resolve: null, reject: null } } }, {
key: "getMediaFromSdp", value: function n(e) {
var t = e.indexOf("MEDIAINFO=") + 10;
var n = e.slice(t, t + 80);
var i = [];
for (var r = 0, o = n.length / 2;
r < o;
r++) {
i[r] = parseInt(n.slice(r * 2, r * 2 + 2), 16) }
return new Uint8Array(i) } }, {
key: "playCmd", value: function d(e) {
var t = {
sequence: 0, cmd: "realplay", url: e };
return JSON.stringify(t) } }, {
key: "playbackCmd", value: function v(e, t, n, i) {
var r = {
sequence: 0, cmd: "playback", url: n, startTime: e, endTime: t };
i && i.userName && (r.userName = i.userName);
i && i.password && (r.password = i.password);
return JSON.stringify(r) } }, {
key: "playRateCmd", value: function p(e) {
var t = {
sequence: 0, cmd: "speed", rate: e };
return JSON.stringify(t) } }, {
key: "pauseCmd", value: function m() {
var e = {
sequence: 0, cmd: "pause" };
return JSON.stringify(e) } }, {
key: "resumeCmd", value: function y() {
var e = {
sequence: 0, cmd: "resume" };
return JSON.stringify(e) } }, {
key: "getError", value: function S(e) {
var t = u;
if (e) {
if (parseInt(e.statusCode, 10) === 6 && e.subStatusCode === "streamLimit") {
t = l } else if (parseInt(e.statusCode, 10) === 4 && e.subStatusCode === "badAuthorization") {
t = f } else if (parseInt(e.statusCode, 10) === 4 && e.subStatusCode === "lowPrivilege") {
t = c } else if (parseInt(e.statusCode, 10) === 4 && e.subStatusCode === "notSupport") {
t = h } else if (parseInt(e.statusCode, 10) === 6 && e.subStatusCode === "incorrentUserNameOrPassword") {
t = o } else if (parseInt(e.statusCode, 10) === 6 && e.subStatusCode === "needDoubleVerification") {
t = a } else if (parseInt(e.statusCode, 10) === 6 && e.subStatusCode === "noDoubleVerificationUser") {
t = s } }
return t } }]);
return e }();
return e }();
t.DirectDevice = d }, function (e, t, n) {
"use strict";
Object.defineProperty(t, "__esModule", {
value: true });
t.LiveMedia = undefined;
var i = function () {
function e(e, t) {
for (var n = 0;
n < t.length;
n++) {
var i = t[n];
i.enumerable = i.enumerable || false;
i.configurable = true;
if ("value" in i) i.writable = true;
Object.defineProperty(e, i.key, i) } }
return function (t, n, i) {
if (n) e(t.prototype, n);
if (i) e(t, i);
return t } }();
var r = n(22);
var o = u(r);
var a = n(23);
var s = u(a);
function u(e) {
return e && e.__esModule ? e : {
"default": e } } function l(e, t) {
if (!(e instanceof t)) {
throw new TypeError("Cannot call a class as a function") } }
var f = function () {
var e = function () {
function e() {
l(this, e) } i(e, [{
key: "createClientObject", value: function t(e, n, i, r, o) {
var a = s["default"].AES.encrypt((new Date).getTime().toString(), s["default"].enc.Hex.parse("1234567891234567123456789123456712345678912345671234567891234567"), {
mode: s["default"].mode.CBC, iv: s["default"].enc.Hex.parse("12345678912345671234567891234567"), padding: s["default"].pad.Pkcs7 }).ciphertext.toString();
if (a.length < 64) {
a = a + a }
var u = s["default"].AES.encrypt((new Date).getTime().toString(), s["default"].enc.Hex.parse("12345678912345671234567891234567"), {
mode: s["default"].mode.CBC, iv: s["default"].enc.Hex.parse("12345678912345671234567891234567"), padding: s["default"].pad.Pkcs7 }).ciphertext.toString();
return {
socket: e, id: n, PKD: i, rand: r, playURL: o.playURL || "", auth: o.auth || "", token: o.token || "", key: a, iv: u, resolve: null, reject: null } } }, {
key: "playCmd", value: function n(e) {
var t = {
sequence: 0, cmd: "realplay", url: e.playURL, key: o["default"].encrypt(e.iv + ":" + e.key, e.PKD).cipher.split("?")[0], authorization: s["default"].AES.encrypt(e.rand + ":" + e.auth, s["default"].enc.Hex.parse(e.key), {
mode: s["default"].mode.CBC, iv: s["default"].enc.Hex.parse(e.iv), padding: s["default"].pad.Pkcs7 }).ciphertext.toString(), token: s["default"].AES.encrypt(e.token, s["default"].enc.Hex.parse(e.key), {
mode: s["default"].mode.CBC, iv: s["default"].enc.Hex.parse(e.iv), padding: s["default"].pad.Pkcs7 }).ciphertext.toString() };
return JSON.stringify(t) } }, {
key: "playbackCmd", value: function r(e, t, n) {
var i = {
sequence: 0, cmd: "playback", url: e.playURL, key: o["default"].encrypt(e.iv + ":" + e.key, e.PKD).cipher.split("?")[0], authorization: s["default"].AES.encrypt(e.rand + ":" + e.auth, s["default"].enc.Hex.parse(e.key), {
mode: s["default"].mode.CBC, iv: s["default"].enc.Hex.parse(e.iv), padding: s["default"].pad.Pkcs7 }).ciphertext.toString(), token: s["default"].AES.encrypt(e.token, s["default"].enc.Hex.parse(e.key), {
mode: s["default"].mode.CBC, iv: s["default"].enc.Hex.parse(e.iv), padding: s["default"].pad.Pkcs7 }).ciphertext.toString(), startTime: t, endTime: n };
return JSON.stringify(i) } }, {
key: "seekCmd", value: function a(e, t) {
var n = {
sequence: 0, cmd: "seek", startTime: e, endTime: t };
return JSON.stringify(n) } }]);
return e }();
return e }();
t.LiveMedia = f }, function (e, t, n) {
"use strict";
var r = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (e) {
return typeof e } : function (e) {
return e && typeof Symbol === "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e };
var o = {
appName: "Netscape", appVersion: 40 };
var a, s = 0xdeadbeefcafe, u = (s & 16777215) == 15715070;
function l(e, t, n) {
e != null && ("number" == typeof e ? this.fromNumber(e, t, n) : t == null && "string" != typeof e ? this.fromString(e, 256) : this.fromString(e, t)) } function f() {
return new l(null) } function c(e, t, n, i, r, o) {
for (;
--o >= 0;) {
var a = t * this[e++] + n[i] + r, r = Math.floor(a / 67108864);
n[i++] = a & 67108863 }
return r } function h(e, t, n, i, r, o) {
var a = t & 32767;
for (t >>= 15;
--o >= 0;) {
var s = this[e] & 32767, u = this[e++] >> 15, l = t * s + u * a, s = a * s + ((l & 32767) << 15) + n[i] + (r & 1073741823), r = (s >>> 30) + (l >>> 15) + t * u + (r >>> 30);
n[i++] = s & 1073741823 }
return r } function d(e, t, n, i, r, o) {
var a = t & 16383;
for (t >>= 14;
--o >= 0;) {
var s = this[e] & 16383, u = this[e++] >> 14, l = t * s + u * a, s = a * s + ((l & 16383) << 14) + n[i] + r, r = (s >> 28) + (l >> 14) + t * u;
n[i++] = s & 268435455 }
return r } u && o.appName == "Microsoft Internet Explorer" ? (l.prototype.am = h, a = 30) : u && o.appName != "Netscape" ? (l.prototype.am = c, a = 26) : (l.prototype.am = d, a = 28);
l.prototype.DB = a;
l.prototype.DM = (1 << a) - 1;
l.prototype.DV = 1 << a;
var p = 52;
l.prototype.FV = Math.pow(2, p);
l.prototype.F1 = p - a;
l.prototype.F2 = 2 * a - p;
var m = "0123456789abcdefghijklmnopqrstuvwxyz", y = [], S, g;
S = "0".charCodeAt(0);
for (g = 0;
g <= 9;
++g) {
y[S++] = g } S = "a".charCodeAt(0);
for (g = 10;
g < 36;
++g) {
y[S++] = g } S = "A".charCodeAt(0);
for (g = 10;
g < 36;
++g) {
y[S++] = g } function _(e) {
return m.charAt(e) } function P(e, t) {
var n = y[e.charCodeAt(t)];
return n == null ? -1 : n } function w(e) {
for (var t = this.t - 1;
t >= 0;
--t) {
e[t] = this[t] } e.t = this.t;
e.s = this.s } function b(e) {
this.t = 1;
this.s = e < 0 ? -1 : 0;
e > 0 ? this[0] = e : e < -1 ? this[0] = e + DV : this.t = 0 } function k(e) {
var t = f();
t.fromInt(e);
return t } function C(e, t) {
var n;
if (t == 16) n = 4;
else if (t == 8) n = 3;
else if (t == 256) n = 8;
else if (t == 2) n = 1;
else if (t == 32) n = 5;
else if (t == 4) n = 2;
else {
this.fromRadix(e, t);
return } this.s = this.t = 0;
for (var i = e.length, r = !1, o = 0;
--i >= 0;) {
var a = n == 8 ? e[i] & 255 : P(e, i);
a < 0 ? e.charAt(i) == "-" && (r = !0) : (r = !1, o == 0 ? this[this.t++] = a : o + n > this.DB ? (this[this.t - 1] |= (a & (1 << this.DB - o) - 1) << o, this[this.t++] = a >> this.DB - o) : this[this.t - 1] |= a << o, o += n, o >= this.DB && (o -= this.DB)) } if (n == 8 && (e[0] & 128) != 0) this.s = -1, o > 0 && (this[this.t - 1] |= (1 << this.DB - o) - 1 << o);
this.clamp();
r && l.ZERO.subTo(this, this) } function R() {
for (var e = this.s & this.DM;
this.t > 0 && this[this.t - 1] == e;) {
--this.t } } function T(e) {
if (this.s < 0)
return "-" + this.negate().toString(e);
if (e == 16) e = 4;
else if (e == 8) e = 3;
else if (e == 2) e = 1;
else if (e == 32) e = 5;
else if (e == 64) e = 6;
else if (e == 4) e = 2;
else
return this.toRadix(e);
var t = (1 << e) - 1, n, i = !1, r = "", o = this.t, a = this.DB - o * this.DB % e;
if (o-- > 0) {
if (a < this.DB && (n = this[o] >> a) > 0) i = !0, r = _(n);
for (;
o >= 0;) {
a < e ? (n = (this[o] & (1 << a) - 1) << e - a, n |= this[--o] >> (a += this.DB - e)) : (n = this[o] >> (a -= e) & t, a <= 0 && (a += this.DB, --o)), n > 0 && (i = !0), i && (r += _(n)) } }
return i ? r : "0" } function I() {
var e = f();
l.ZERO.subTo(this, e);
return e } function x() {
return this.s < 0 ? this.negate() : this } function D(e) {
var t = this.s - e.s;
if (t != 0)
return t;
var n = this.t, t = n - e.t;
if (t != 0)
return t;
for (;
--n >= 0;) {
if ((t = this[n] - e[n]) != 0)
return t }
return 0 } function z(e) {
var t = 1, n;
if ((n = e >>> 16) != 0) e = n, t += 16;
if ((n = e >> 8) != 0) e = n, t += 8;
if ((n = e >> 4) != 0) e = n, t += 4;
if ((n = e >> 2) != 0) e = n, t += 2;
e >> 1 != 0 && (t += 1);
return t } function M() {
return this.t <= 0 ? 0 : this.DB * (this.t - 1) + z(this[this.t - 1] ^ this.s & this.DM) } function E(e, t) {
var n;
for (n = this.t - 1;
n >= 0;
--n) {
t[n + e] = this[n] } for (n = e - 1;
n >= 0;
--n) {
t[n] = 0 } t.t = this.t + e;
t.s = this.s } function O(e, t) {
for (var n = e;
n < this.t;
++n) {
t[n - e] = this[n] } t.t = Math.max(this.t - e, 0);
t.s = this.s } function F(e, t) {
var n = e % this.DB, i = this.DB - n, r = (1 << i) - 1, o = Math.floor(e / this.DB), a = this.s << n & this.DM, s;
for (s = this.t - 1;
s >= 0;
--s) {
t[s + o + 1] = this[s] >> i | a, a = (this[s] & r) << n } for (s = o - 1;
s >= 0;
--s) {
t[s] = 0 } t[o] = a;
t.t = this.t + o + 1;
t.s = this.s;
t.clamp() } function q(e, t) {
t.s = this.s;
var n = Math.floor(e / this.DB);
if (n >= this.t) t.t = 0;
else {
var i = e % this.DB, r = this.DB - i, o = (1 << i) - 1;
t[0] = this[n] >> i;
for (var a = n + 1;
a < this.t;
++a) {
t[a - n - 1] |= (this[a] & o) << r, t[a - n] = this[a] >> i } i > 0 && (t[this.t - n - 1] |= (this.s & o) << r);
t.t = this.t - n;
t.clamp() } } function J(e, t) {
for (var n = 0, i = 0, r = Math.min(e.t, this.t);
n < r;) {
i += this[n] - e[n], t[n++] = i & this.DM, i >>= this.DB } if (e.t < this.t) {
for (i -= e.s;
n < this.t;) {
i += this[n], t[n++] = i & this.DM, i >>= this.DB } i += this.s } else {
for (i += this.s;
n < e.t;) {
i -= e[n], t[n++] = i & this.DM, i >>= this.DB } i -= e.s } t.s = i < 0 ? -1 : 0;
i < -1 ? t[n++] = this.DV + i : i > 0 && (t[n++] = i);
t.t = n;
t.clamp() } function W(e, t) {
var n = this.abs(), i = e.abs(), r = n.t;
for (t.t = r + i.t;
--r >= 0;) {
t[r] = 0 } for (r = 0;
r < i.t;
++r) {
t[r + n.t] = n.am(0, i[r], t, r, 0, n.t) } t.s = 0;
t.clamp();
this.s != e.s && l.ZERO.subTo(t, t) } function L(e) {
for (var t = this.abs(), n = e.t = 2 * t.t;
--n >= 0;) {
e[n] = 0 } for (n = 0;
n < t.t - 1;
++n) {
var i = t.am(n, t[n], e, 2 * n, 0, 1);
if ((e[n + t.t] += t.am(n + 1, 2 * t[n], e, 2 * n + 1, i, t.t - n - 1)) >= t.DV) e[n + t.t] -= t.DV, e[n + t.t + 1] = 1 } e.t > 0 && (e[e.t - 1] += t.am(n, t[n], e, 2 * n, 0, 1));
e.s = 0;
e.clamp() } function A(e, t, n) {
var i = e.abs();
if (!(i.t <= 0)) {
var r = this.abs();
if (r.t < i.t) t != null && t.fromInt(0), n != null && this.copyTo(n);
else {
n == null && (n = f());
var o = f(), a = this.s, e = e.s, s = this.DB - z(i[i.t - 1]);
s > 0 ? (i.lShiftTo(s, o), r.lShiftTo(s, n)) : (i.copyTo(o), r.copyTo(n));
i = o.t;
r = o[i - 1];
if (r != 0) {
var u = r * (1 << this.F1) + (i > 1 ? o[i - 2] >> this.F2 : 0), c = this.FV / u, u = (1 << this.F1) / u, h = 1 << this.F2, d = n.t, v = d - i, p = t == null ? f() : t;
o.dlShiftTo(v, p);
n.compareTo(p) >= 0 && (n[n.t++] = 1, n.subTo(p, n));
l.ONE.dlShiftTo(i, p);
for (p.subTo(o, o);
o.t < i;) {
o[o.t++] = 0 } for (;
--v >= 0;) {
var m = n[--d] == r ? this.DM : Math.floor(n[d] * c + (n[d - 1] + h) * u);
if ((n[d] += o.am(0, m, n, v, 0, i)) < m) {
o.dlShiftTo(v, p);
for (n.subTo(p, n);
n[d] < --m;) {
n.subTo(p, n) } } } t != null && (n.drShiftTo(i, t), a != e && l.ZERO.subTo(t, t));
n.t = i;
n.clamp();
s > 0 && n.rShiftTo(s, n);
a < 0 && l.ZERO.subTo(n, n) } } } } function B(e) {
var t = f();
this.abs().divRemTo(e, null, t);
this.s < 0 && t.compareTo(l.ZERO) > 0 && e.subTo(t, t);
return t } function U(e) {
this.m = e } function $(e) {
return e.s < 0 || e.compareTo(this.m) >= 0 ? e.mod(this.m) : e } function H(e) {
return e } function N(e) {
e.divRemTo(this.m, null, e) } function G(e, t, n) {
e.multiplyTo(t, n);
this.reduce(n) } function j(e, t) {
e.squareTo(t);
this.reduce(t) } U.prototype.convert = $;
U.prototype.revert = H;
U.prototype.reduce = N;
U.prototype.mulTo = G;
U.prototype.sqrTo = j;
function V() {
if (this.t < 1)
return 0;
var e = this[0];
if ((e & 1) == 0)
return 0;
var t = e & 3, t = t * (2 - (e & 15) * t) & 15, t = t * (2 - (e & 255) * t) & 255, t = t * (2 - ((e & 65535) * t & 65535)) & 65535, t = t * (2 - e * t % this.DV) % this.DV;
return t > 0 ? this.DV - t : -t } function X(e) {
this.m = e;
this.mp = e.invDigit();
this.mpl = this.mp & 32767;
this.mph = this.mp >> 15;
this.um = (1 << e.DB - 15) - 1;
this.mt2 = 2 * e.t } function Y(e) {
var t = f();
e.abs().dlShiftTo(this.m.t, t);
t.divRemTo(this.m, null, t);
e.s < 0 && t.compareTo(l.ZERO) > 0 && this.m.subTo(t, t);
return t } function Z(e) {
var t = f();
e.copyTo(t);
this.reduce(t);
return t } function K(e) {
for (;
e.t <= this.mt2;) {
e[e.t++] = 0 } for (var t = 0;
t < this.m.t;
++t) {
var n = e[t] & 32767, i = n * this.mpl + ((n * this.mph + (e[t] >> 15) * this.mpl & this.um) << 15) & e.DM, n = t + this.m.t;
for (e[n] += this.m.am(0, i, e, t, 0, this.m.t);
e[n] >= e.DV;) {
e[n] -= e.DV, e[++n]++ } } e.clamp();
e.drShiftTo(this.m.t, e);
e.compareTo(this.m) >= 0 && e.subTo(this.m, e) } function Q(e, t) {
e.squareTo(t);
this.reduce(t) } function ee(e, t, n) {
e.multiplyTo(t, n);
this.reduce(n) } X.prototype.convert = Y;
X.prototype.revert = Z;
X.prototype.reduce = K;
X.prototype.mulTo = ee;
X.prototype.sqrTo = Q;
function te() {
return (this.t > 0 ? this[0] & 1 : this.s) == 0 } function ne(e, t) {
if (e > 4294967295 || e < 1)
return l.ONE;
var n = f(), i = f(), r = t.convert(this), o = z(e) - 1;
for (r.copyTo(n);
--o >= 0;) {
if (t.sqrTo(n, i), (e & 1 << o) > 0) t.mulTo(i, r, n);
else
var a = n, n = i, i = a }
return t.revert(n) } function ie(e, t) {
var n;
n = e < 256 || t.isEven() ? new U(t) : new X(t);
return this.exp(e, n) } l.prototype.copyTo = w;
l.prototype.fromInt = b;
l.prototype.fromString = C;
l.prototype.clamp = R;
l.prototype.dlShiftTo = E;
l.prototype.drShiftTo = O;
l.prototype.lShiftTo = F;
l.prototype.rShiftTo = q;
l.prototype.subTo = J;
l.prototype.multiplyTo = W;
l.prototype.squareTo = L;
l.prototype.divRemTo = A;
l.prototype.invDigit = V;
l.prototype.isEven = te;
l.prototype.exp = ne;
l.prototype.toString = T;
l.prototype.negate = I;
l.prototype.abs = x;
l.prototype.compareTo = D;
l.prototype.bitLength = M;
l.prototype.mod = B;
l.prototype.modPowInt = ie;
l.ZERO = k(0);
l.ONE = k(1);
function re() {
var e = f();
this.copyTo(e);
return e } function oe() {
if (this.s < 0) {
if (this.t == 1)
return this[0] - this.DV;
else {
if (this.t == 0)
return -1 } } else if (this.t == 1)
return this[0];
else if (this.t == 0)
return 0;
return (this[1] & (1 << 32 - this.DB) - 1) << this.DB | this[0] } function ae() {
return this.t == 0 ? this.s : this[0] << 24 >> 24 } function se() {
return this.t == 0 ? this.s : this[0] << 16 >> 16 } function ue(e) {
return Math.floor(Math.LN2 * this.DB / Math.log(e)) } function le() {
return this.s < 0 ? -1 : this.t <= 0 || this.t == 1 && this[0] <= 0 ? 0 : 1 } function fe(e) {
e == null && (e = 10);
if (this.signum() == 0 || e < 2 || e > 36)
return "0";
var t = this.chunkSize(e), t = Math.pow(e, t), n = k(t), i = f(), r = f(), o = "";
for (this.divRemTo(n, i, r);
i.signum() > 0;) {
o = (t + r.intValue()).toString(e).substr(1) + o, i.divRemTo(n, i, r) }
return r.intValue().toString(e) + o } function ce(e, t) {
this.fromInt(0);
t == null && (t = 10);
for (var n = this.chunkSize(t), i = Math.pow(t, n), r = !1, o = 0, a = 0, s = 0;
s < e.length;
++s) {
var u = P(e, s);
u < 0 ? e.charAt(s) == "-" && this.signum() == 0 && (r = !0) : (a = t * a + u, ++o >= n && (this.dMultiply(i), this.dAddOffset(a, 0), a = o = 0)) } o > 0 && (this.dMultiply(Math.pow(t, o)), this.dAddOffset(a, 0));
r && l.ZERO.subTo(this, this) } function he(e, t, n) {
if ("number" == typeof t) {
if (e < 2) this.fromInt(1);
else {
this.fromNumber(e, n);
this.testBit(e - 1) || this.bitwiseTo(l.ONE.shiftLeft(e - 1), _e, this);
for (this.isEven() && this.dAddOffset(1, 0);
!this.isProbablePrime(t);) {
this.dAddOffset(2, 0), this.bitLength() > e && this.subTo(l.ONE.shiftLeft(e - 1), this) } } } else {
var n = [], i = e & 7;
n.length = (e >> 3) + 1;
t.nextBytes(n);
i > 0 ? n[0] &= (1 << i) - 1 : n[0] = 0;
this.fromString(n, 256) } } function de() {
var e = this.t, t = [];
t[0] = this.s;
var n = this.DB - e * this.DB % 8, i, r = 0;
if (e-- > 0) {
if (n < this.DB && (i = this[e] >> n) != (this.s & this.DM) >> n) t[r++] = i | this.s << this.DB - n;
for (;
e >= 0;) {
if (n < 8 ? (i = (this[e] & (1 << n) - 1) << 8 - n, i |= this[--e] >> (n += this.DB - 8)) : (i = this[e] >> (n -= 8) & 255, n <= 0 && (n += this.DB, --e)), (i & 128) != 0 && (i |= -256), r == 0 && (this.s & 128) != (i & 128) && ++r, r > 0 || i != this.s) t[r++] = i } }
return t } function ve(e) {
return this.compareTo(e) == 0 } function pe(e) {
return this.compareTo(e) < 0 ? this : e } function me(e) {
return this.compareTo(e) > 0 ? this : e } function ye(e, t, n) {
var i, r, o = Math.min(e.t, this.t);
for (i = 0;
i < o;
++i) {
n[i] = t(this[i], e[i]) } if (e.t < this.t) {
r = e.s & this.DM;
for (i = o;
i < this.t;
++i) {
n[i] = t(this[i], r) } n.t = this.t } else {
r = this.s & this.DM;
for (i = o;
i < e.t;
++i) {
n[i] = t(r, e[i]) } n.t = e.t } n.s = t(this.s, e.s);
n.clamp() } function Se(e, t) {
return e & t } function ge(e) {
var t = f();
this.bitwiseTo(e, Se, t);
return t } function _e(e, t) {
return e | t } function Pe(e) {
var t = f();
this.bitwiseTo(e, _e, t);
return t } function we(e, t) {
return e ^ t } function be(e) {
var t = f();
this.bitwiseTo(e, we, t);
return t } function ke(e, t) {
return e & ~t } function Ce(e) {
var t = f();
this.bitwiseTo(e, ke, t);
return t } function Re() {
for (var e = f(), t = 0;
t < this.t;
++t) {
e[t] = this.DM & ~this[t] } e.t = this.t;
e.s = ~this.s;
return e } function Te(e) {
var t = f();
e < 0 ? this.rShiftTo(-e, t) : this.lShiftTo(e, t);
return t } function Ie(e) {
var t = f();
e < 0 ? this.lShiftTo(-e, t) : this.rShiftTo(e, t);
return t } function xe(e) {
if (e == 0)
return -1;
var t = 0;
(e & 65535) == 0 && (e >>= 16, t += 16);
(e & 255) == 0 && (e >>= 8, t += 8);
(e & 15) == 0 && (e >>= 4, t += 4);
(e & 3) == 0 && (e >>= 2, t += 2);
(e & 1) == 0 && ++t;
return t } function De() {
for (var e = 0;
e < this.t;
++e) {
if (this[e] != 0)
return e * this.DB + xe(this[e]) }
return this.s < 0 ? this.t * this.DB : -1 } function ze(e) {
for (var t = 0;
e != 0;) {
e &= e - 1, ++t }
return t } function Me() {
for (var e = 0, t = this.s & this.DM, n = 0;
n < this.t;
++n) {
e += ze(this[n] ^ t) }
return e } function Ee(e) {
var t = Math.floor(e / this.DB);
return t >= this.t ? this.s != 0 : (this[t] & 1 << e % this.DB) != 0 } function Oe(e, t) {
var n = l.ONE.shiftLeft(e);
this.bitwiseTo(n, t, n);
return n } function Fe(e) {
return this.changeBit(e, _e) } function qe(e) {
return this.changeBit(e, ke) } function Je(e) {
return this.changeBit(e, we) } function We(e, t) {
for (var n = 0, i = 0, r = Math.min(e.t, this.t);
n < r;) {
i += this[n] + e[n], t[n++] = i & this.DM, i >>= this.DB } if (e.t < this.t) {
for (i += e.s;
n < this.t;) {
i += this[n], t[n++] = i & this.DM, i >>= this.DB } i += this.s } else {
for (i += this.s;
n < e.t;) {
i += e[n], t[n++] = i & this.DM, i >>= this.DB } i += e.s } t.s = i < 0 ? -1 : 0;
i > 0 ? t[n++] = i : i < -1 && (t[n++] = this.DV + i);
t.t = n;
t.clamp() } function Le(e) {
var t = f();
this.addTo(e, t);
return t } function Ae(e) {
var t = f();
this.subTo(e, t);
return t } function Be(e) {
var t = f();
this.multiplyTo(e, t);
return t } function Ue() {
var e = f();
this.squareTo(e);
return e } function $e(e) {
var t = f();
this.divRemTo(e, t, null);
return t } function He(e) {
var t = f();
this.divRemTo(e, null, t);
return t } function Ne(e) {
var t = f(), n = f();
this.divRemTo(e, t, n);
return [t, n] } function Ge(e) {
this[this.t] = this.am(0, e - 1, this, 0, 0, this.t);
++this.t;
this.clamp() } function je(e, t) {
if (e != 0) {
for (;
this.t <= t;) {
this[this.t++] = 0 } for (this[t] += e;
this[t] >= this.DV;) {
this[t] -= this.DV, ++t >= this.t && (this[this.t++] = 0), ++this[t] } } } function Ve() {} function Xe(e) {
return e } function Ye(e, t, n) {
e.multiplyTo(t, n) } function Ze(e, t) {
e.squareTo(t) } Ve.prototype.convert = Xe;
Ve.prototype.revert = Xe;
Ve.prototype.mulTo = Ye;
Ve.prototype.sqrTo = Ze;
function Ke(e) {
return this.exp(e, new Ve) } function Qe(e, t, n) {
var i = Math.min(this.t + e.t, t);
n.s = 0;
for (n.t = i;
i > 0;) {
n[--i] = 0 }
var r;
for (r = n.t - this.t;
i < r;
++i) {
n[i + this.t] = this.am(0, e[i], n, i, 0, this.t) } for (r = Math.min(e.t, t);
i < r;
++i) {
this.am(0, e[i], n, i, 0, t - i) } n.clamp() } function et(e, t, n) {
--t;
var i = n.t = this.t + e.t - t;
for (n.s = 0;
--i >= 0;) {
n[i] = 0 } for (i = Math.max(t - this.t, 0);
i < e.t;
++i) {
n[this.t + i - t] = this.am(t - i, e[i], n, 0, 0, this.t + i - t) } n.clamp();
n.drShiftTo(1, n) } function tt(e) {
this.r2 = f();
this.q3 = f();
l.ONE.dlShiftTo(2 * e.t, this.r2);
this.mu = this.r2.divide(e);
this.m = e } function nt(e) {
if (e.s < 0 || e.t > 2 * this.m.t)
return e.mod(this.m);
else if (e.compareTo(this.m) < 0)
return e;
else {
var t = f();
e.copyTo(t);
this.reduce(t);
return t } } function it(e) {
return e } function rt(e) {
e.drShiftTo(this.m.t - 1, this.r2);
if (e.t > this.m.t + 1) e.t = this.m.t + 1, e.clamp();
this.mu.multiplyUpperTo(this.r2, this.m.t + 1, this.q3);
for (this.m.multiplyLowerTo(this.q3, this.m.t + 1, this.r2);
e.compareTo(this.r2) < 0;) {
e.dAddOffset(1, this.m.t + 1) } for (e.subTo(this.r2, e);
e.compareTo(this.m) >= 0;) {
e.subTo(this.m, e) } } function ot(e, t) {
e.squareTo(t);
this.reduce(t) } function at(e, t, n) {
e.multiplyTo(t, n);
this.reduce(n) } tt.prototype.convert = nt;
tt.prototype.revert = it;
tt.prototype.reduce = rt;
tt.prototype.mulTo = at;
tt.prototype.sqrTo = ot;
function st(e, t) {
var n = e.bitLength(), i, r = k(1), o;
if (n <= 0)
return r;
else i = n < 18 ? 1 : n < 48 ? 3 : n < 144 ? 4 : n < 768 ? 5 : 6;
o = n < 8 ? new U(t) : t.isEven() ? new tt(t) : new X(t);
var a = [], s = 3, u = i - 1, l = (1 << i) - 1;
a[1] = o.convert(this);
if (i > 1) {
n = f();
for (o.sqrTo(a[1], n);
s <= l;) {
a[s] = f(), o.mulTo(n, a[s - 2], a[s]), s += 2 } } for (var c = e.t - 1, h, d = !0, v = f(), n = z(e[c]) - 1;
c >= 0;) {
n >= u ? h = e[c] >> n - u & l : (h = (e[c] & (1 << n + 1) - 1) << u - n, c > 0 && (h |= e[c - 1] >> this.DB + n - u));
for (s = i;
(h & 1) == 0;) {
h >>= 1, --s } if ((n -= s) < 0) n += this.DB, --c;
if (d) a[h].copyTo(r), d = !1;
else {
for (;
s > 1;) {
o.sqrTo(r, v), o.sqrTo(v, r), s -= 2 } s > 0 ? o.sqrTo(r, v) : (s = r, r = v, v = s);
o.mulTo(v, a[h], r) } for (;
c >= 0 && (e[c] & 1 << n) == 0;) {
o.sqrTo(r, v), s = r, r = v, v = s, --n < 0 && (n = this.DB - 1, --c) } }
return o.revert(r) } function ut(e) {
var t = this.s < 0 ? this.negate() : this.clone(), e = e.s < 0 ? e.negate() : e.clone();
if (t.compareTo(e) < 0)
var n = t, t = e, e = n;
var n = t.getLowestSetBit(), i = e.getLowestSetBit();
if (i < 0)
return t;
n < i && (i = n);
i > 0 && (t.rShiftTo(i, t), e.rShiftTo(i, e));
for (;
t.signum() > 0;) {
(n = t.getLowestSetBit()) > 0 && t.rShiftTo(n, t), (n = e.getLowestSetBit()) > 0 && e.rShiftTo(n, e), t.compareTo(e) >= 0 ? (t.subTo(e, t), t.rShiftTo(1, t)) : (e.subTo(t, e), e.rShiftTo(1, e)) } i > 0 && e.lShiftTo(i, e);
return e } function lt(e) {
if (e <= 0)
return 0;
var t = this.DV % e, n = this.s < 0 ? e - 1 : 0;
if (this.t > 0) if (t == 0) n = this[0] % e;
else for (var i = this.t - 1;
i >= 0;
--i) {
n = (t * n + this[i]) % e }
return n } function ft(e) {
var t = e.isEven();
if (this.isEven() && t || e.signum() == 0)
return l.ZERO;
for (var n = e.clone(), i = this.clone(), r = k(1), o = k(0), a = k(0), s = k(1);
n.signum() != 0;) {
for (;
n.isEven();) {
n.rShiftTo(1, n);
if (t) {
if (!r.isEven() || !o.isEven()) r.addTo(this, r), o.subTo(e, o);
r.rShiftTo(1, r) } else o.isEven() || o.subTo(e, o);
o.rShiftTo(1, o) } for (;
i.isEven();) {
i.rShiftTo(1, i);
if (t) {
if (!a.isEven() || !s.isEven()) a.addTo(this, a), s.subTo(e, s);
a.rShiftTo(1, a) } else s.isEven() || s.subTo(e, s);
s.rShiftTo(1, s) } n.compareTo(i) >= 0 ? (n.subTo(i, n), t && r.subTo(a, r), o.subTo(s, o)) : (i.subTo(n, i), t && a.subTo(r, a), s.subTo(o, s)) } if (i.compareTo(l.ONE) != 0)
return l.ZERO;
if (s.compareTo(e) >= 0)
return s.subtract(e);
if (s.signum() < 0) s.addTo(e, s);
else
return s;
return s.signum() < 0 ? s.add(e) : s }
var ct = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317, 331, 337, 347, 349, 353, 359, 367, 373, 379, 383, 389, 397, 401, 409, 419, 421, 431, 433, 439, 443, 449, 457, 461, 463, 467, 479, 487, 491, 499, 503, 509, 521, 523, 541, 547, 557, 563, 569, 571, 577, 587, 593, 599, 601, 607, 613, 617, 619, 631, 641, 643, 647, 653, 659, 661, 673, 677, 683, 691, 701, 709, 719, 727, 733, 739, 743, 751, 757, 761, 769, 773, 787, 797, 809, 811, 821, 823, 827, 829, 839, 853, 857, 859, 863, 877, 881, 883, 887, 907, 911, 919, 929, 937, 941, 947, 953, 967, 971, 977, 983, 991, 997], ht = 67108864 / ct[ct.length - 1];
function dt(e) {
var t, n = this.abs();
if (n.t == 1 && n[0] <= ct[ct.length - 1]) {
for (t = 0;
t < ct.length;
++t) {
if (n[0] == ct[t])
return !0 }
return !1 } if (n.isEven())
return !1;
for (t = 1;
t < ct.length;) {
for (var i = ct[t], r = t + 1;
r < ct.length && i < ht;) {
i *= ct[r++] } for (i = n.modInt(i);
t < r;) {
if (i % ct[t++] == 0)
return !1 } }
return n.millerRabin(e) } function vt(e) {
var t = this.subtract(l.ONE), n = t.getLowestSetBit();
if (n <= 0)
return !1;
var i = t.shiftRight(n), e = e + 1 >> 1;
if (e > ct.length) e = ct.length;
for (var r = f(), o = 0;
o < e;
++o) {
r.fromInt(ct[Math.floor(Math.random() * ct.length)]);
var a = r.modPow(i, this);
if (a.compareTo(l.ONE) != 0 && a.compareTo(t) != 0) {
for (var s = 1;
s++ < n && a.compareTo(t) != 0;) {
if (a = a.modPowInt(2, this), a.compareTo(l.ONE) == 0)
return !1 } if (a.compareTo(t) != 0)
return !1 } }
return !0 } l.prototype.chunkSize = ue;
l.prototype.toRadix = fe;
l.prototype.fromRadix = ce;
l.prototype.fromNumber = he;
l.prototype.bitwiseTo = ye;
l.prototype.changeBit = Oe;
l.prototype.addTo = We;
l.prototype.dMultiply = Ge;
l.prototype.dAddOffset = je;
l.prototype.multiplyLowerTo = Qe;
l.prototype.multiplyUpperTo = et;
l.prototype.modInt = lt;
l.prototype.millerRabin = vt;
l.prototype.clone = re;
l.prototype.intValue = oe;
l.prototype.byteValue = ae;
l.prototype.shortValue = se;
l.prototype.signum = le;
l.prototype.toByteArray = de;
l.prototype.equals = ve;
l.prototype.min = pe;
l.prototype.max = me;
l.prototype.and = ge;
l.prototype.or = Pe;
l.prototype.xor = be;
l.prototype.andNot = Ce;
l.prototype.not = Re;
l.prototype.shiftLeft = Te;
l.prototype.shiftRight = Ie;
l.prototype.getLowestSetBit = De;
l.prototype.bitCount = Me;
l.prototype.testBit = Ee;
l.prototype.setBit = Fe;
l.prototype.clearBit = qe;
l.prototype.flipBit = Je;
l.prototype.add = Le;
l.prototype.subtract = Ae;
l.prototype.multiply = Be;
l.prototype.divide = $e;
l.prototype.remainder = He;
l.prototype.divideAndRemainder = Ne;
l.prototype.modPow = st;
l.prototype.modInverse = ft;
l.prototype.pow = Ke;
l.prototype.gcd = ut;
l.prototype.isProbablePrime = dt;
l.prototype.square = Ue;
(function (e, t, n, i, o, a, s) {
function u(e) {
var t, i, r = this, o = e.length, a = 0, s = r.i = r.j = r.m = 0;
r.S = [];
r.c = [];
for (o || (e = [o++]);
a < n;) {
r.S[a] = a++ } for (a = 0;
a < n;
a++) {
t = r.S[a], s = s + t + e[a % o] & n - 1, i = r.S[s], r.S[a] = i, r.S[s] = t } r.g = function (e) {
var t = r.S, i = r.i + 1 & n - 1, o = t[i], a = r.j + o & n - 1, s = t[a];
t[i] = s;
t[a] = o;
for (var u = t[o + s & n - 1];
--e;) {
i = i + 1 & n - 1, o = t[i], a = a + o & n - 1, s = t[a], t[i] = s, t[a] = o, u = u * n + t[o + s & n - 1] } r.i = i;
r.j = a;
return u };
r.g(n) } function l(e, t, n, i, o) {
n = [];
o = typeof e === "undefined" ? "undefined" : r(e);
if (t && o == "object") for (i in e) {
if (i.indexOf("S") < 5) try {
n.push(l(e[i], t - 1)) } catch (a) {} }
return n.length ? n : e + (o != "string" ? "\0" : "") } function f(e, t, i, r) {
e += "";
for (r = i = 0;
r < e.length;
r++) {
var o = t, a = r & n - 1, s = (i ^= t[r & n - 1] * 19) + e.charCodeAt(r);
o[a] = s & n - 1 } e = "";
for (r in t) {
e += String.fromCharCode(t[r]) }
return e } t.seedrandom = function (r, c) {
var h = [], d, r = f(l(c ? [r, e] : arguments.length ? r : [(new Date).getTime(), e, window], 3), h);
d = new u(h);
f(d.S, e);
t.random = function () {
for (var e = d.g(i), t = s, r = 0;
e < o;) {
e = (e + r) * n, t *= n, r = d.g(1) } for (;
e >= a;) {
e /= 2, t /= 2, r >>>= 1 }
return (e + r) / t };
return r };
s = t.pow(n, i);
o = t.pow(2, o);
a = o * 2;
f(t.random(), e) })([], Math, 256, 6, 52);
function pt() {} function mt(e) {
var t;
for (t = 0;
t < e.length;
t++) {
e[t] = Math.floor(Math.random() * 256) } } pt.prototype.nextBytes = mt;
function yt() {
this.j = this.i = 0;
this.S = [] } function St(e) {
var t, n, i;
for (t = 0;
t < 256;
++t) {
this.S[t] = t } for (t = n = 0;
t < 256;
++t) {
n = n + this.S[t] + e[t % e.length] & 255, i = this.S[t], this.S[t] = this.S[n], this.S[n] = i } this.j = this.i = 0 } function gt() {
var e;
this.i = this.i + 1 & 255;
this.j = this.j + this.S[this.i] & 255;
e = this.S[this.i];
this.S[this.i] = this.S[this.j];
this.S[this.j] = e;
return this.S[e + this.S[this.i] & 255] } yt.prototype.init = St;
yt.prototype.next = gt;
function _t() {
return new yt }
var Pt = 256, wt, bt, kt;
function Ct(e) {
bt[kt++] ^= e & 255;
bt[kt++] ^= e >> 8 & 255;
bt[kt++] ^= e >> 16 & 255;
bt[kt++] ^= e >> 24 & 255;
kt >= Pt && (kt -= Pt) } function Rt() {
Ct((new Date).getTime()) } if (bt == null) {
bt = [];
kt = 0;
var Tt;
if (o.appName == "Netscape" && o.appVersion < "5" && window.crypto) {
var It = window.crypto.random(32);
for (Tt = 0;
Tt < It.length;
++Tt) {
bt[kt++] = It.charCodeAt(Tt) & 255 } } for (;
kt < Pt;) {
Tt = Math.floor(65536 * Math.random()), bt[kt++] = Tt >>> 8, bt[kt++] = Tt & 255 } kt = 0;
Rt() } function xt() {
if (wt == null) {
Rt();
wt = _t();
wt.init(bt);
for (kt = 0;
kt < bt.length;
++kt) {
bt[kt] = 0 } kt = 0 }
return wt.next() } function Dt(e) {
var t;
for (t = 0;
t < e.length;
++t) {
e[t] = xt() } } function zt() {} zt.prototype.nextBytes = Dt;
function Mt(e) {
function t(e, t) {
var n = (e & 65535) + (t & 65535);
return (e >> 16) + (t >> 16) + (n >> 16) << 16 | n & 65535 } function n(e, t) {
return e >>> t | e << 32 - t } e = function (e) {
for (var e = e.replace(/\r\n/g, "\n"), t = "", n = 0;
n < e.length;
n++) {
var i = e.charCodeAt(n);
i < 128 ? t += String.fromCharCode(i) : (i > 127 && i < 2048 ? t += String.fromCharCode(i >> 6 | 192) : (t += String.fromCharCode(i >> 12 | 224), t += String.fromCharCode(i >> 6 & 63 | 128)), t += String.fromCharCode(i & 63 | 128)) }
return t }(e);
return function (e) {
for (var t = "", n = 0;
n < e.length * 4;
n++) {
t += "0123456789abcdef".charAt(e[n >> 2] >> (3 - n % 4) * 8 + 4 & 15) + "0123456789abcdef".charAt(e[n >> 2] >> (3 - n % 4) * 8 & 15) }
return t }(function (e, i) {
var r = [1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298], o = [1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225], a = Array(64), s, u, l, f, c, h, d, v, p, m, y, S;
e[i >> 5] |= 128 << 24 - i % 32;
e[(i + 64 >> 9 << 4) + 15] = i;
for (p = 0;
p < e.length;
p += 16) {
s = o[0];
u = o[1];
l = o[2];
f = o[3];
c = o[4];
h = o[5];
d = o[6];
v = o[7];
for (m = 0;
m < 64;
m++) {
a[m] = m < 16 ? e[m + p] : t(t(t(n(a[m - 2], 17) ^ n(a[m - 2], 19) ^ a[m - 2] >>> 10, a[m - 7]), n(a[m - 15], 7) ^ n(a[m - 15], 18) ^ a[m - 15] >>> 3), a[m - 16]), y = t(t(t(t(v, n(c, 6) ^ n(c, 11) ^ n(c, 25)), c & h ^ ~c & d), r[m]), a[m]), S = t(n(s, 2) ^ n(s, 13) ^ n(s, 22), s & u ^ s & l ^ u & l), v = d, d = h, h = c, c = t(f, y), f = l, l = u, u = s, s = t(y, S) } o[0] = t(s, o[0]);
o[1] = t(u, o[1]);
o[2] = t(l, o[2]);
o[3] = t(f, o[3]);
o[4] = t(c, o[4]);
o[5] = t(h, o[5]);
o[6] = t(d, o[6]);
o[7] = t(v, o[7]) }
return o }(function (e) {
for (var t = [], n = 0;
n < e.length * 8;
n += 8) {
t[n >> 5] |= (e.charCodeAt(n / 8) & 255) << 24 - n % 32 }
return t }(e), e.length * 8)) }
var Et = {
hex: function hn(e) {
return Mt(e) } };
function Ot(e) {
function t(e, t) {
return e << t | e >>> 32 - t } function n(e) {
var t = "", n, i;
for (n = 7;
n >= 0;
n--) {
i = e >>> n * 4 & 15, t += i.toString(16) }
return t }
var i, r, o = Array(80), a = 1732584193, s = 4023233417, u = 2562383102, l = 271733878, f = 3285377520, c, h, d, v, p, e = function (e) {
for (var e = e.replace(/\r\n/g, "\n"), t = "", n = 0;
n < e.length;
n++) {
var i = e.charCodeAt(n);
i < 128 ? t += String.fromCharCode(i) : (i > 127 && i < 2048 ? t += String.fromCharCode(i >> 6 | 192) : (t += String.fromCharCode(i >> 12 | 224), t += String.fromCharCode(i >> 6 & 63 | 128)), t += String.fromCharCode(i & 63 | 128)) }
return t }(e);
c = e.length;
var m = [];
for (i = 0;
i < c - 3;
i += 4) {
r = e.charCodeAt(i) << 24 | e.charCodeAt(i + 1) << 16 | e.charCodeAt(i + 2) << 8 | e.charCodeAt(i + 3), m.push(r) } switch (c % 4) {
case 0: i = 2147483648;
break;
case 1: i = e.charCodeAt(c - 1) << 24 | 8388608;
break;
case 2: i = e.charCodeAt(c - 2) << 24 | e.charCodeAt(c - 1) << 16 | 32768;
break;
case 3: i = e.charCodeAt(c - 3) << 24 | e.charCodeAt(c - 2) << 16 | e.charCodeAt(c - 1) << 8 | 128 }for (m.push(i);
m.length % 16 != 14;) {
m.push(0) } m.push(c >>> 29);
m.push(c << 3 & 4294967295);
for (e = 0;
e < m.length;
e += 16) {
for (i = 0;
i < 16;
i++) {
o[i] = m[e + i] } for (i = 16;
i <= 79;
i++) {
o[i] = t(o[i - 3] ^ o[i - 8] ^ o[i - 14] ^ o[i - 16], 1) } r = a;
c = s;
h = u;
d = l;
v = f;
for (i = 0;
i <= 19;
i++) {
p = t(r, 5) + (c & h | ~c & d) + v + o[i] + 1518500249 & 4294967295, v = d, d = h, h = t(c, 30), c = r, r = p } for (i = 20;
i <= 39;
i++) {
p = t(r, 5) + (c ^ h ^ d) + v + o[i] + 1859775393 & 4294967295, v = d, d = h, h = t(c, 30), c = r, r = p } for (i = 40;
i <= 59;
i++) {
p = t(r, 5) + (c & h | c & d | h & d) + v + o[i] + 2400959708 & 4294967295, v = d, d = h, h = t(c, 30), c = r, r = p } for (i = 60;
i <= 79;
i++) {
p = t(r, 5) + (c ^ h ^ d) + v + o[i] + 3395469782 & 4294967295, v = d, d = h, h = t(c, 30), c = r, r = p } a = a + r & 4294967295;
s = s + c & 4294967295;
u = u + h & 4294967295;
l = l + d & 4294967295;
f = f + v & 4294967295 } p = n(a) + n(s) + n(u) + n(l) + n(f);
return p.toLowerCase() }
var Ft = {
hex: function dn(e) {
return Ot(e) } }, qt = function vn(e) {
function t(e, t) {
var n, i, r, o, a;
r = e & 2147483648;
o = t & 2147483648;
n = e & 1073741824;
i = t & 1073741824;
a = (e & 1073741823) + (t & 1073741823);
return n & i ? a ^ 2147483648 ^ r ^ o : n | i ? a & 1073741824 ? a ^ 3221225472 ^ r ^ o : a ^ 1073741824 ^ r ^ o : a ^ r ^ o } function n(e, n, i, r, o, a, s) {
e = t(e, t(t(n & i | ~n & r, o), s));
return t(e << a | e >>> 32 - a, n) } function i(e, n, i, r, o, a, s) {
e = t(e, t(t(n & r | i & ~r, o), s));
return t(e << a | e >>> 32 - a, n) } function r(e, n, i, r, o, a, s) {
e = t(e, t(t(n ^ i ^ r, o), s));
return t(e << a | e >>> 32 - a, n) } function o(e, n, i, r, o, a, s) {
e = t(e, t(t(i ^ (n | ~r), o), s));
return t(e << a | e >>> 32 - a, n) } function a(e) {
var t = "", n = "", i;
for (i = 0;
i <= 3;
i++) {
n = e >>> i * 8 & 255, n = "0" + n.toString(16), t += n.substr(n.length - 2, 2) }
return t }
var s = [], u, l, f, c, h, d, v, p, e = function (e) {
for (var e = e.replace(/\r\n/g, "\n"), t = "", n = 0;
n < e.length;
n++) {
var i = e.charCodeAt(n);
i < 128 ? t += String.fromCharCode(i) : (i > 127 && i < 2048 ? t += String.fromCharCode(i >> 6 | 192) : (t += String.fromCharCode(i >> 12 | 224), t += String.fromCharCode(i >> 6 & 63 | 128)), t += String.fromCharCode(i & 63 | 128)) }
return t }(e), s = function (e) {
var t, n = e.length;
t = n + 8;
for (var i = ((t - t % 64) / 64 + 1) * 16, r = Array(i - 1), o = 0, a = 0;
a < n;) {
t = (a - a % 4) / 4, o = a % 4 * 8, r[t] |= e.charCodeAt(a) << o, a++ } r[(a - a % 4) / 4] |= 128 << a % 4 * 8;
r[i - 2] = n << 3;
r[i - 1] = n >>> 29;
return r }(e);
h = 1732584193;
d = 4023233417;
v = 2562383102;
p = 271733878;
for (e = 0;
e < s.length;
e += 16) {
u = h, l = d, f = v, c = p, h = n(h, d, v, p, s[e + 0], 7, 3614090360), p = n(p, h, d, v, s[e + 1], 12, 3905402710), v = n(v, p, h, d, s[e + 2], 17, 606105819), d = n(d, v, p, h, s[e + 3], 22, 3250441966), h = n(h, d, v, p, s[e + 4], 7, 4118548399), p = n(p, h, d, v, s[e + 5], 12, 1200080426), v = n(v, p, h, d, s[e + 6], 17, 2821735955), d = n(d, v, p, h, s[e + 7], 22, 4249261313), h = n(h, d, v, p, s[e + 8], 7, 1770035416), p = n(p, h, d, v, s[e + 9], 12, 2336552879), v = n(v, p, h, d, s[e + 10], 17, 4294925233), d = n(d, v, p, h, s[e + 11], 22, 2304563134), h = n(h, d, v, p, s[e + 12], 7, 1804603682), p = n(p, h, d, v, s[e + 13], 12, 4254626195), v = n(v, p, h, d, s[e + 14], 17, 2792965006), d = n(d, v, p, h, s[e + 15], 22, 1236535329), h = i(h, d, v, p, s[e + 1], 5, 4129170786), p = i(p, h, d, v, s[e + 6], 9, 3225465664), v = i(v, p, h, d, s[e + 11], 14, 643717713), d = i(d, v, p, h, s[e + 0], 20, 3921069994), h = i(h, d, v, p, s[e + 5], 5, 3593408605), p = i(p, h, d, v, s[e + 10], 9, 38016083), v = i(v, p, h, d, s[e + 15], 14, 3634488961), d = i(d, v, p, h, s[e + 4], 20, 3889429448), h = i(h, d, v, p, s[e + 9], 5, 568446438), p = i(p, h, d, v, s[e + 14], 9, 3275163606), v = i(v, p, h, d, s[e + 3], 14, 4107603335), d = i(d, v, p, h, s[e + 8], 20, 1163531501), h = i(h, d, v, p, s[e + 13], 5, 2850285829), p = i(p, h, d, v, s[e + 2], 9, 4243563512), v = i(v, p, h, d, s[e + 7], 14, 1735328473), d = i(d, v, p, h, s[e + 12], 20, 2368359562), h = r(h, d, v, p, s[e + 5], 4, 4294588738), p = r(p, h, d, v, s[e + 8], 11, 2272392833), v = r(v, p, h, d, s[e + 11], 16, 1839030562), d = r(d, v, p, h, s[e + 14], 23, 4259657740), h = r(h, d, v, p, s[e + 1], 4, 2763975236), p = r(p, h, d, v, s[e + 4], 11, 1272893353), v = r(v, p, h, d, s[e + 7], 16, 4139469664), d = r(d, v, p, h, s[e + 10], 23, 3200236656), h = r(h, d, v, p, s[e + 13], 4, 681279174), p = r(p, h, d, v, s[e + 0], 11, 3936430074), v = r(v, p, h, d, s[e + 3], 16, 3572445317), d = r(d, v, p, h, s[e + 6], 23, 76029189), h = r(h, d, v, p, s[e + 9], 4, 3654602809), p = r(p, h, d, v, s[e + 12], 11, 3873151461), v = r(v, p, h, d, s[e + 15], 16, 530742520), d = r(d, v, p, h, s[e + 2], 23, 3299628645), h = o(h, d, v, p, s[e + 0], 6, 4096336452), p = o(p, h, d, v, s[e + 7], 10, 1126891415), v = o(v, p, h, d, s[e + 14], 15, 2878612391), d = o(d, v, p, h, s[e + 5], 21, 4237533241), h = o(h, d, v, p, s[e + 12], 6, 1700485571), p = o(p, h, d, v, s[e + 3], 10, 2399980690), v = o(v, p, h, d, s[e + 10], 15, 4293915773), d = o(d, v, p, h, s[e + 1], 21, 2240044497), h = o(h, d, v, p, s[e + 8], 6, 1873313359), p = o(p, h, d, v, s[e + 15], 10, 4264355552), v = o(v, p, h, d, s[e + 6], 15, 2734768916), d = o(d, v, p, h, s[e + 13], 21, 1309151649), h = o(h, d, v, p, s[e + 4], 6, 4149444226), p = o(p, h, d, v, s[e + 11], 10, 3174756917), v = o(v, p, h, d, s[e + 2], 15, 718787259), d = o(d, v, p, h, s[e + 9], 21, 3951481745), h = t(h, u), d = t(d, l), v = t(v, f), p = t(p, c) }
return (a(h) + a(d) + a(v) + a(p)).toLowerCase() };
function Jt(e, t) {
return new l(e, t) } function Wt(e, t) {
for (var n = "", i = 0;
i + t < e.length;) {
n += e.substring(i, i + t) + "\n", i += t }
return n + e.substring(i, e.length) } function Lt(e) {
return e < 16 ? "0" + e.toString(16) : e.toString(16) } function At(e, t) {
if (t < e.length + 11)
throw "Message too long for RSA (n=" + t + ", l=" + e.length + ")";
for (var n = [], i = e.length - 1;
i >= 0 && t > 0;) {
var r = e.charCodeAt(i--);
r < 128 ? n[--t] = r : r > 127 && r < 2048 ? (n[--t] = r & 63 | 128, n[--t] = r >> 6 | 192) : (n[--t] = r & 63 | 128, n[--t] = r >> 6 & 63 | 128, n[--t] = r >> 12 | 224) } n[--t] = 0;
i = new zt;
for (r = [];
t > 2;) {
for (r[0] = 0;
r[0] == 0;) {
i.nextBytes(r) } n[--t] = r[0] } n[--t] = 2;
n[--t] = 0;
return new l(n) } function Bt() {
this.n = null;
this.e = 0;
this.coeff = this.dmq1 = this.dmp1 = this.q = this.p = this.d = null } function Ut(e, t) {
e != null && t != null && e.length > 0 && t.length > 0 ? (this.n = Jt(e, 16), this.e = parseInt(t, 16)) : alert("Invalid RSA public key") } function $t(e) {
return e.modPowInt(this.e, this.n) } function Ht(e) {
e = At(e, this.n.bitLength() + 7 >> 3);
if (e == null)
return null;
e = this.doPublic(e);
if (e == null)
return null;
e = e.toString(16);
return (e.length & 1) == 0 ? e : "0" + e } Bt.prototype.doPublic = $t;
Bt.prototype.setPublic = Ut;
Bt.prototype.encrypt = Ht;
function Nt(e, t) {
for (var n = e.toByteArray(), i = 0;
i < n.length && n[i] == 0;) {
++i } if (n.length - i != t - 1 || n[i] != 2)
return null;
for (++i;
n[i] != 0;) {
if (++i >= n.length)
return null } for (var r = "";
++i < n.length;) {
var o = n[i] & 255;
o < 128 ? r += String.fromCharCode(o) : o > 191 && o < 224 ? (r += String.fromCharCode((o & 31) << 6 | n[i + 1] & 63), ++i) : (r += String.fromCharCode((o & 15) << 12 | (n[i + 1] & 63) << 6 | n[i + 2] & 63), i += 2) }
return r } function Gt(e, t, n) {
e != null && t != null && e.length > 0 && t.length > 0 ? (this.n = Jt(e, 16), this.e = parseInt(t, 16), this.d = Jt(n, 16)) : alert("Invalid RSA private key") } function jt(e, t, n, i, r, o, a, s) {
e != null && t != null && e.length > 0 && t.length > 0 ? (this.n = Jt(e, 16), this.e = parseInt(t, 16), this.d = Jt(n, 16), this.p = Jt(i, 16), this.q = Jt(r, 16), this.dmp1 = Jt(o, 16), this.dmq1 = Jt(a, 16), this.coeff = Jt(s, 16)) : alert("Invalid RSA private key") } function Vt(e, t) {
var n = new pt, i = e >> 1;
this.e = parseInt(t, 16);
for (var r = new l(t, 16);
;) {
for (;
;) {
if (this.p = new l(e - i, 1, n), this.p.subtract(l.ONE).gcd(r).compareTo(l.ONE) == 0 && this.p.isProbablePrime(10))
break } for (;
;) {
if (this.q = new l(i, 1, n), this.q.subtract(l.ONE).gcd(r).compareTo(l.ONE) == 0 && this.q.isProbablePrime(10))
break } if (this.p.compareTo(this.q) <= 0) {
var o = this.p;
this.p = this.q;
this.q = o }
var o = this.p.subtract(l.ONE), a = this.q.subtract(l.ONE), s = o.multiply(a);
if (s.gcd(r).compareTo(l.ONE) == 0) {
this.n = this.p.multiply(this.q);
this.d = r.modInverse(s);
this.dmp1 = this.d.mod(o);
this.dmq1 = this.d.mod(a);
this.coeff = this.q.modInverse(this.p);
break } } } function Xt(e) {
if (this.p == null || this.q == null)
return e.modPow(this.d, this.n);
for (var t = e.mod(this.p).modPow(this.dmp1, this.p), e = e.mod(this.q).modPow(this.dmq1, this.q);
t.compareTo(e) < 0;) {
t = t.add(this.p) }
return t.subtract(e).multiply(this.coeff).mod(this.p).multiply(this.q).add(e) } function Yt(e) {
e = this.doPrivate(Jt(e, 16));
return e == null ? null : Nt(e, this.n.bitLength() + 7 >> 3) } Bt.prototype.doPrivate = Xt;
Bt.prototype.setPrivate = Gt;
Bt.prototype.setPrivateEx = jt;
Bt.prototype.generate = Vt;
Bt.prototype.decrypt = Yt;
var Zt = [];
Zt.sha1 = "3021300906052b0e03021a05000414";
Zt.sha256 = "3031300d060960864801650304020105000420";
var Kt = [];
Kt.sha1 = Ft.hex;
Kt.sha256 = Et.hex;
function Qt(e, t, n) {
t /= 4;
for (var e = (0, Kt[n])(e), n = "00" + Zt[n] + e, e = "", t = t - 4 - n.length, i = 0;
i < t;
i += 2) {
e += "ff" }
return sPaddedMessageHex = "0001" + e + n } function en(e, t) {
var n = Qt(e, this.n.bitLength(), t);
return this.doPrivate(Jt(n, 16)).toString(16) } function tn(e) {
e = Qt(e, this.n.bitLength(), "sha1");
return this.doPrivate(Jt(e, 16)).toString(16) } function nn(e) {
e = Qt(e, this.n.bitLength(), "sha256");
return this.doPrivate(Jt(e, 16)).toString(16) } function rn(e, t, n) {
var i = new Bt;
i.setPublic(t, n);
return i.doPublic(e) } function on(e, t, n) {
return rn(e, t, n).toString(16).replace(/^1f+00/, "") } function an(e) {
for (var t in Zt) {
var n = Zt[t], i = n.length;
if (e.substring(0, i) == n)
return [t, e.substring(i)] }
return [] } function sn(e, t, n, i) {
t = on(t, n, i);
n = an(t);
if (n.length == 0)
return !1;
t = n[1];
e = (0, Kt[n[0]])(e);
return t == e } function un(e, t) {
var n = Jt(e, 16);
return sn(t, n, this.n.toString(16), this.e.toString(16)) } function ln(e, t) {
var t = t.replace(/[ \n]+/g, ""), n = this.doPublic(Jt(t, 16)).toString(16).replace(/^1f+00/, ""), i = an(n);
if (i.length == 0)
return !1;
n = i[1];
i = (0, Kt[i[0]])(e);
return n == i } Bt.prototype.signString = en;
Bt.prototype.signStringWithSHA1 = tn;
Bt.prototype.signStringWithSHA256 = nn;
Bt.prototype.verifyString = ln;
Bt.prototype.verifyHexSignatureForMessage = un;
var fn = function () {
var e = {
Sbox: [99, 124, 119, 123, 242, 107, 111, 197, 48, 1, 103, 43, 254, 215, 171, 118, 202, 130, 201, 125, 250, 89, 71, 240, 173, 212, 162, 175, 156, 164, 114, 192, 183, 253, 147, 38, 54, 63, 247, 204, 52, 165, 229, 241, 113, 216, 49, 21, 4, 199, 35, 195, 24, 150, 5, 154, 7, 18, 128, 226, 235, 39, 178, 117, 9, 131, 44, 26, 27, 110, 90, 160, 82, 59, 214, 179, 41, 227, 47, 132, 83, 209, 0, 237, 32, 252, 177, 91, 106, 203, 190, 57, 74, 76, 88, 207, 208, 239, 170, 251, 67, 77, 51, 133, 69, 249, 2, 127, 80, 60, 159, 168, 81, 163, 64, 143, 146, 157, 56, 245, 188, 182, 218, 33, 16, 255, 243, 210, 205, 12, 19, 236, 95, 151, 68, 23, 196, 167, 126, 61, 100, 93, 25, 115, 96, 129, 79, 220, 34, 42, 144, 136, 70, 238, 184, 20, 222, 94, 11, 219, 224, 50, 58, 10, 73, 6, 36, 92, 194, 211, 172, 98, 145, 149, 228, 121, 231, 200, 55, 109, 141, 213, 78, 169, 108, 86, 244, 234, 101, 122, 174, 8, 186, 120, 37, 46, 28, 166, 180, 198, 232, 221, 116, 31, 75, 189, 139, 138, 112, 62, 181, 102, 72, 3, 246, 14, 97, 53, 87, 185, 134, 193, 29, 158, 225, 248, 152, 17, 105, 217, 142, 148, 155, 30, 135, 233, 206, 85, 40, 223, 140, 161, 137, 13, 191, 230, 66, 104, 65, 153, 45, 15, 176, 84, 187, 22], ShiftRowTab: [0, 5, 10, 15, 4, 9, 14, 3, 8, 13, 2, 7, 12, 1, 6, 11] };
e.Init = function () {
e.Sbox_Inv = Array(256);
for (var t = 0;
t < 256;
t++) {
e.Sbox_Inv[e.Sbox[t]] = t } e.ShiftRowTab_Inv = Array(16);
for (t = 0;
t < 16;
t++) {
e.ShiftRowTab_Inv[e.ShiftRowTab[t]] = t } e.xtime = Array(256);
for (t = 0;
t < 128;
t++) {
e.xtime[t] = t << 1, e.xtime[128 + t] = t << 1 ^ 27 } };
e.Done = function () {
delete e.Sbox_Inv;
delete e.ShiftRowTab_Inv;
delete e.xtime };
e.ExpandKey = function (t) {
var n = t.length, i, r = 1;
switch (n) {
case 16: i = 176;
break;
case 24: i = 208;
break;
case 32: i = 240;
break;
default: alert("my.ExpandKey: Only key lengths of 16, 24 or 32 bytes allowed!") }for (var o = n;
o < i;
o += 4) {
var a = t.slice(o - 4, o);
if (o % n == 0) {
if (a = [e.Sbox[a[1]] ^ r, e.Sbox[a[2]], e.Sbox[a[3]], e.Sbox[a[0]]], (r <<= 1) >= 256) r ^= 283 } else n > 24 && o % n == 16 && (a = [e.Sbox[a[0]], e.Sbox[a[1]], e.Sbox[a[2]], e.Sbox[a[3]]]);
for (var s = 0;
s < 4;
s++) {
t[o + s] = t[o + s - n] ^ a[s] } } };
e.Encrypt = function (t, n) {
var i = n.length;
e.AddRoundKey(t, n.slice(0, 16));
for (var r = 16;
r < i - 16;
r += 16) {
e.SubBytes(t, e.Sbox), e.ShiftRows(t, e.ShiftRowTab), e.MixColumns(t), e.AddRoundKey(t, n.slice(r, r + 16)) } e.SubBytes(t, e.Sbox);
e.ShiftRows(t, e.ShiftRowTab);
e.AddRoundKey(t, n.slice(r, i)) };
e.Decrypt = function (t, n) {
var i = n.length;
e.AddRoundKey(t, n.slice(i - 16, i));
e.ShiftRows(t, e.ShiftRowTab_Inv);
e.SubBytes(t, e.Sbox_Inv);
for (i -= 32;
i >= 16;
i -= 16) {
e.AddRoundKey(t, n.slice(i, i + 16)), e.MixColumns_Inv(t), e.ShiftRows(t, e.ShiftRowTab_Inv), e.SubBytes(t, e.Sbox_Inv) } e.AddRoundKey(t, n.slice(0, 16)) };
e.SubBytes = function (e, t) {
for (var n = 0;
n < 16;
n++) {
e[n] = t[e[n]] } };
e.AddRoundKey = function (e, t) {
for (var n = 0;
n < 16;
n++) {
e[n] ^= t[n] } };
e.ShiftRows = function (e, t) {
for (var n = [].concat(e), i = 0;
i < 16;
i++) {
e[i] = n[t[i]] } };
e.MixColumns = function (t) {
for (var n = 0;
n < 16;
n += 4) {
var i = t[n + 0], r = t[n + 1], o = t[n + 2], a = t[n + 3], s = i ^ r ^ o ^ a;
t[n + 0] ^= s ^ e.xtime[i ^ r];
t[n + 1] ^= s ^ e.xtime[r ^ o];
t[n + 2] ^= s ^ e.xtime[o ^ a];
t[n + 3] ^= s ^ e.xtime[a ^ i] } };
e.MixColumns_Inv = function (t) {
for (var n = 0;
n < 16;
n += 4) {
var i = t[n + 0], r = t[n + 1], o = t[n + 2], a = t[n + 3], s = i ^ r ^ o ^ a, u = e.xtime[s], l = e.xtime[e.xtime[u ^ i ^ o]] ^ s;
s ^= e.xtime[e.xtime[u ^ r ^ a]];
t[n + 0] ^= l ^ e.xtime[i ^ r];
t[n + 1] ^= s ^ e.xtime[r ^ o];
t[n + 2] ^= l ^ e.xtime[o ^ a];
t[n + 3] ^= s ^ e.xtime[a ^ i] } };
return e }(), cn = function () {
var e = {};
fn.Init();
e.b256to64 = function (e) {
var t, n, i, r = "", o = 0, a = 0, s = e.length;
for (i = 0;
i < s;
i++) {
n = e.charCodeAt(i), a == 0 ? (r += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(n >> 2 & 63), t = (n & 3) << 4) : a == 1 ? (r += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(t | n >> 4 & 15), t = (n & 15) << 2) : a == 2 && (r += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(t | n >> 6 & 3), o += 1, r += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(n & 63)), o += 1, a += 1, a == 3 && (a = 0) } a > 0 && (r += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(t), r += "=");
a == 1 && (r += "=");
return r };
e.b64to256 = function (e) {
var t, n, i = "", r = 0, o = 0, a = e.length;
for (n = 0;
n < a;
n++) {
t = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".indexOf(e.charAt(n)), t >= 0 && (r && (i += String.fromCharCode(o | t >> 6 - r & 255)), r = r + 2 & 7, o = t << r & 255) }
return i };
e.b16to64 = function (e) {
var t, n, i = "";
e.length % 2 == 1 && (e = "0" + e);
for (t = 0;
t + 3 <= e.length;
t += 3) {
n = parseInt(e.substring(t, t + 3), 16), i += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(n >> 6) + "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(n & 63) } t + 1 == e.length ? (n = parseInt(e.substring(t, t + 1), 16), i += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(n << 2)) : t + 2 == e.length && (n = parseInt(e.substring(t, t + 2), 16), i += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(n >> 2) + "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt((n & 3) << 4));
for (;
(i.length & 3) > 0;) {
i += "=" }
return i };
e.b64to16 = function (e) {
var t = "", n, i = 0, r;
for (n = 0;
n < e.length;
++n) {
if (e.charAt(n) == "=")
break;
v = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".indexOf(e.charAt(n));
v < 0 || (i == 0 ? (t += _(v >> 2), r = v & 3, i = 1) : i == 1 ? (t += _(r << 2 | v >> 4), r = v & 15, i = 2) : i == 2 ? (t += _(r), t += _(v >> 2), r = v & 3, i = 3) : (t += _(r << 2 | v >> 4), t += _(v & 15), i = 0)) } i == 1 && (t += _(r << 2));
return t };
e.string2bytes = function (e) {
for (var t = [], n = 0;
n < e.length;
n++) {
t.push(e.charCodeAt(n)) }
return t };
e.bytes2string = function (e) {
for (var t = "", n = 0;
n < e.length;
n++) {
t += String.fromCharCode(e[n]) }
return t };
e.blockXOR = function (e, t) {
for (var n = Array(16), i = 0;
i < 16;
i++) {
n[i] = e[i] ^ t[i] }
return n };
e.blockIV = function () {
var e = new zt, t = Array(16);
e.nextBytes(t);
return t };
e.pad16 = function (e) {
var t = e.slice(0), n = (16 - e.length % 16) % 16;
for (i = e.length;
i < e.length + n;
i++) {
t.push(0) }
return t };
e.depad = function (e) {
for (e = e.slice(0);
e[e.length - 1] == 0;) {
e = e.slice(0, e.length - 1) }
return e };
e.encryptAESCBC = function (t, n) {
var i = n.slice(0);
fn.ExpandKey(i);
for (var r = e.string2bytes(t), r = e.pad16(r), o = e.blockIV(), a = 0;
a < r.length / 16;
a++) {
var s = r.slice(a * 16, a * 16 + 16), u = o.slice(a * 16, a * 16 + 16), s = e.blockXOR(u, s);
fn.Encrypt(s, i);
o = o.concat(s) } i = e.bytes2string(o);
return e.b256to64(i) };
e.decryptAESCBC = function (t, n) {
var i = n.slice(0);
fn.ExpandKey(i);
for (var t = e.b64to256(t), r = e.string2bytes(t), o = [], a = 1;
a < r.length / 16;
a++) {
var s = r.slice(a * 16, a * 16 + 16), u = r.slice((a - 1) * 16, (a - 1) * 16 + 16);
fn.Decrypt(s, i);
s = e.blockXOR(u, s);
o = o.concat(s) } o = e.depad(o);
return e.bytes2string(o) };
e.wrap60 = function (e) {
for (var t = "", n = 0;
n < e.length;
n++) {
n % 60 == 0 && n != 0 && (t += "\n"), t += e[n] }
return t };
e.generateAESKey = function () {
var e = Array(16);
(new zt).nextBytes(e);
return e };
e.generateRSAKey = function (e, t) {
Math.seedrandom(Et.hex(e));
var n = new Bt;
n.generate(t, "10001");
return n };
e.publicKeyString = function (e) {
return pubkey = e.n.toString(16) };
e.publicKeyID = function (e) {
return qt(e) };
e.publicKeyFromString = function (e) {
var e = e.split("|")[0], t = new Bt;
t.setPublic(e, "10001");
return t };
e.encrypt = function (t, n, i) {
var r = "";
try {
var o = e.publicKeyFromString(n);
r += o.encrypt(t) + "?" } catch (a) {
return {
status: "Invalid public key" } }
return {
status: "success", cipher: r } };
e.decrypt = function (e, t) {
var n = e.split("?"), i = t.decrypt(n[0]);
return {
status: "success", plaintext: i, signature: "unsigned" } };
return e }();
e.exports = cn }, function (e, t, n) {
"use strict";
Object.defineProperty(t, "__esModule", {
value: true });
var i = i || function (e, t) {
var n = {}, i = n.lib = {}, r = function d() {}, o = i.Base = {
extend: function v(e) {
r.prototype = this;
var t = new r;
e && t.mixIn(e);
t.hasOwnProperty("init") || (t.init = function () {
t.$super.init.apply(this, arguments) });
t.init.prototype = t;
t.$super = this;
return t }, create: function p() {
var e = this.extend();
e.init.apply(e, arguments);
return e }, init: function m() {}, mixIn: function y(e) {
for (var t in e) {
e.hasOwnProperty(t) && (this[t] = e[t]) } e.hasOwnProperty("toString") && (this.toString = e.toString) }, clone: function S() {
return this.init.prototype.extend(this) } }, a = i.WordArray = o.extend({
init: function g(e, n) {
e = this.words = e || [];
this.sigBytes = n != t ? n : 4 * e.length }, toString: function _(e) {
return (e || u).stringify(this) }, concat: function P(e) {
var t = this.words, n = e.words, i = this.sigBytes;
e = e.sigBytes;
this.clamp();
if (i % 4) for (var r = 0;
r < e;
r++) {
t[i + r >>> 2] |= (n[r >>> 2] >>> 24 - 8 * (r % 4) & 255) << 24 - 8 * ((i + r) % 4) } else if (65535 < n.length) for (r = 0;
r < e;
r += 4) {
t[i + r >>> 2] = n[r >>> 2] } else t.push.apply(t, n);
this.sigBytes += e;
return this }, clamp: function w() {
var t = this.words, n = this.sigBytes;
t[n >>> 2] &= 4294967295 << 32 - 8 * (n % 4);
t.length = e.ceil(n / 4) }, clone: function b() {
var e = o.clone.call(this);
e.words = this.words.slice(0);
return e }, random: function k(t) {
for (var n = [], i = 0;
i < t;
i += 4) {
n.push(4294967296 * e.random() | 0) }
return new a.init(n, t) } }), s = n.enc = {}, u = s.Hex = {
stringify: function C(e) {
var t = e.words;
e = e.sigBytes;
for (var n = [], i = 0;
i < e;
i++) {
var r = t[i >>> 2] >>> 24 - 8 * (i % 4) & 255;
n.push((r >>> 4).toString(16));
n.push((r & 15).toString(16)) }
return n.join("") }, parse: function R(e) {
for (var t = e.length, n = [], i = 0;
i < t;
i += 2) {
n[i >>> 3] |= parseInt(e.substr(i, 2), 16) << 24 - 4 * (i % 8) }
return new a.init(n, t / 2) } }, l = s.Latin1 = {
stringify: function T(e) {
var t = e.words;
e = e.sigBytes;
for (var n = [], i = 0;
i < e;
i++) {
n.push(String.fromCharCode(t[i >>> 2] >>> 24 - 8 * (i % 4) & 255)) }
return n.join("") }, parse: function I(e) {
for (var t = e.length, n = [], i = 0;
i < t;
i++) {
n[i >>> 2] |= (e.charCodeAt(i) & 255) << 24 - 8 * (i % 4) }
return new a.init(n, t) } }, f = s.Utf8 = {
stringify: function x(e) {
try {
return decodeURIComponent(escape(l.stringify(e))) } catch (t) {
throw Error("Malformed UTF-8 data") } }, parse: function D(e) {
return l.parse(unescape(encodeURIComponent(e))) } }, c = i.BufferedBlockAlgorithm = o.extend({
reset: function z() {
this._data = new a.init;
this._nDataBytes = 0 }, _append: function M(e) {
"string" == typeof e && (e = f.parse(e));
this._data.concat(e);
this._nDataBytes += e.sigBytes }, _process: function E(t) {
var n = this._data, i = n.words, r = n.sigBytes, o = this.blockSize, s = r / (4 * o), s = t ? e.ceil(s) : e.max((s | 0) - this._minBufferSize, 0);
t = s * o;
r = e.min(4 * t, r);
if (t) {
for (var u = 0;
u < t;
u += o) {
this._doProcessBlock(i, u) } u = i.splice(0, t);
n.sigBytes -= r }
return new a.init(u, r) }, clone: function O() {
var e = o.clone.call(this);
e._data = this._data.clone();
return e }, _minBufferSize: 0 });
i.Hasher = c.extend({
cfg: o.extend(), init: function F(e) {
this.cfg = this.cfg.extend(e);
this.reset() }, reset: function q() {
c.reset.call(this);
this._doReset() }, update: function J(e) {
this._append(e);
this._process();
return this }, finalize: function W(e) {
e && this._append(e);
return this._doFinalize() }, blockSize: 16, _createHelper: function L(e) {
return function (t, n) {
return new e.init(n).finalize(t) } }, _createHmacHelper: function A(e) {
return function (t, n) {
return new h.HMAC.init(e, n).finalize(t) } } });
var h = n.algo = {};
return n }(Math);
(function () {
var e = i, t = e.lib.WordArray;
e.enc.Base64 = {
stringify: function n(e) {
var t = e.words, n = e.sigBytes, i = this._map;
e.clamp();
e = [];
for (var r = 0;
r < n;
r += 3) {
for (var o = (t[r >>> 2] >>> 24 - 8 * (r % 4) & 255) << 16 | (t[r + 1 >>> 2] >>> 24 - 8 * ((r + 1) % 4) & 255) << 8 | t[r + 2 >>> 2] >>> 24 - 8 * ((r + 2) % 4) & 255, a = 0;
4 > a && r + .75 * a < n;
a++) {
e.push(i.charAt(o >>> 6 * (3 - a) & 63)) } } if (t = i.charAt(64)) for (;
e.length % 4;) {
e.push(t) }
return e.join("") }, parse: function r(e) {
var n = e.length, i = this._map, r = i.charAt(64);
r && (r = e.indexOf(r), -1 != r && (n = r));
for (var r = [], o = 0, a = 0;
a < n;
a++) {
if (a % 4) {
var s = i.indexOf(e.charAt(a - 1)) << 2 * (a % 4), u = i.indexOf(e.charAt(a)) >>> 6 - 2 * (a % 4);
r[o >>> 2] |= (s | u) << 24 - 8 * (o % 4);
o++ } }
return t.create(r, o) }, _map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=" } })();
(function (e) {
function t(e, t, n, i, r, o, a) {
e = e + (t & n | ~t & i) + r + a;
return (e << o | e >>> 32 - o) + t } function n(e, t, n, i, r, o, a) {
e = e + (t & i | n & ~i) + r + a;
return (e << o | e >>> 32 - o) + t } function r(e, t, n, i, r, o, a) {
e = e + (t ^ n ^ i) + r + a;
return (e << o | e >>> 32 - o) + t } function o(e, t, n, i, r, o, a) {
e = e + (n ^ (t | ~i)) + r + a;
return (e << o | e >>> 32 - o) + t } for (var a = i, s = a.lib, u = s.WordArray, l = s.Hasher, s = a.algo, f = [], c = 0;
64 > c;
c++) {
f[c] = 4294967296 * e.abs(e.sin(c + 1)) | 0 } s = s.MD5 = l.extend({
_doReset: function h() {
this._hash = new u.init([1732584193, 4023233417, 2562383102, 271733878]) }, _doProcessBlock: function d(e, i) {
for (var a = 0;
16 > a;
a++) {
var s = i + a, u = e[s];
e[s] = (u << 8 | u >>> 24) & 16711935 | (u << 24 | u >>> 8) & 4278255360 }
var a = this._hash.words, s = e[i + 0], u = e[i + 1], l = e[i + 2], c = e[i + 3], h = e[i + 4], d = e[i + 5], v = e[i + 6], p = e[i + 7], m = e[i + 8], y = e[i + 9], S = e[i + 10], g = e[i + 11], _ = e[i + 12], P = e[i + 13], w = e[i + 14], b = e[i + 15], k = a[0], C = a[1], R = a[2], T = a[3], k = t(k, C, R, T, s, 7, f[0]), T = t(T, k, C, R, u, 12, f[1]), R = t(R, T, k, C, l, 17, f[2]), C = t(C, R, T, k, c, 22, f[3]), k = t(k, C, R, T, h, 7, f[4]), T = t(T, k, C, R, d, 12, f[5]), R = t(R, T, k, C, v, 17, f[6]), C = t(C, R, T, k, p, 22, f[7]), k = t(k, C, R, T, m, 7, f[8]), T = t(T, k, C, R, y, 12, f[9]), R = t(R, T, k, C, S, 17, f[10]), C = t(C, R, T, k, g, 22, f[11]), k = t(k, C, R, T, _, 7, f[12]), T = t(T, k, C, R, P, 12, f[13]), R = t(R, T, k, C, w, 17, f[14]), C = t(C, R, T, k, b, 22, f[15]), k = n(k, C, R, T, u, 5, f[16]), T = n(T, k, C, R, v, 9, f[17]), R = n(R, T, k, C, g, 14, f[18]), C = n(C, R, T, k, s, 20, f[19]), k = n(k, C, R, T, d, 5, f[20]), T = n(T, k, C, R, S, 9, f[21]), R = n(R, T, k, C, b, 14, f[22]), C = n(C, R, T, k, h, 20, f[23]), k = n(k, C, R, T, y, 5, f[24]), T = n(T, k, C, R, w, 9, f[25]), R = n(R, T, k, C, c, 14, f[26]), C = n(C, R, T, k, m, 20, f[27]), k = n(k, C, R, T, P, 5, f[28]), T = n(T, k, C, R, l, 9, f[29]), R = n(R, T, k, C, p, 14, f[30]), C = n(C, R, T, k, _, 20, f[31]), k = r(k, C, R, T, d, 4, f[32]), T = r(T, k, C, R, m, 11, f[33]), R = r(R, T, k, C, g, 16, f[34]), C = r(C, R, T, k, w, 23, f[35]), k = r(k, C, R, T, u, 4, f[36]), T = r(T, k, C, R, h, 11, f[37]), R = r(R, T, k, C, p, 16, f[38]), C = r(C, R, T, k, S, 23, f[39]), k = r(k, C, R, T, P, 4, f[40]), T = r(T, k, C, R, s, 11, f[41]), R = r(R, T, k, C, c, 16, f[42]), C = r(C, R, T, k, v, 23, f[43]), k = r(k, C, R, T, y, 4, f[44]), T = r(T, k, C, R, _, 11, f[45]), R = r(R, T, k, C, b, 16, f[46]), C = r(C, R, T, k, l, 23, f[47]), k = o(k, C, R, T, s, 6, f[48]), T = o(T, k, C, R, p, 10, f[49]), R = o(R, T, k, C, w, 15, f[50]), C = o(C, R, T, k, d, 21, f[51]), k = o(k, C, R, T, _, 6, f[52]), T = o(T, k, C, R, c, 10, f[53]), R = o(R, T, k, C, S, 15, f[54]), C = o(C, R, T, k, u, 21, f[55]), k = o(k, C, R, T, m, 6, f[56]), T = o(T, k, C, R, b, 10, f[57]), R = o(R, T, k, C, v, 15, f[58]), C = o(C, R, T, k, P, 21, f[59]), k = o(k, C, R, T, h, 6, f[60]), T = o(T, k, C, R, g, 10, f[61]), R = o(R, T, k, C, l, 15, f[62]), C = o(C, R, T, k, y, 21, f[63]);
a[0] = a[0] + k | 0;
a[1] = a[1] + C | 0;
a[2] = a[2] + R | 0;
a[3] = a[3] + T | 0 }, _doFinalize: function v() {
var t = this._data, n = t.words, i = 8 * this._nDataBytes, r = 8 * t.sigBytes;
n[r >>> 5] |= 128 << 24 - r % 32;
var o = e.floor(i / 4294967296);
n[(r + 64 >>> 9 << 4) + 15] = (o << 8 | o >>> 24) & 16711935 | (o << 24 | o >>> 8) & 4278255360;
n[(r + 64 >>> 9 << 4) + 14] = (i << 8 | i >>> 24) & 16711935 | (i << 24 | i >>> 8) & 4278255360;
t.sigBytes = 4 * (n.length + 1);
this._process();
t = this._hash;
n = t.words;
for (i = 0;
4 > i;
i++) {
r = n[i], n[i] = (r << 8 | r >>> 24) & 16711935 | (r << 24 | r >>> 8) & 4278255360 }
return t }, clone: function p() {
var e = l.clone.call(this);
e._hash = this._hash.clone();
return e } });
a.MD5 = l._createHelper(s);
a.HmacMD5 = l._createHmacHelper(s) })(Math);
(function () {
var e = i, t = e.lib, n = t.Base, r = t.WordArray, t = e.algo, o = t.EvpKDF = n.extend({
cfg: n.extend({
keySize: 4, hasher: t.MD5, iterations: 1 }), init: function a(e) {
this.cfg = this.cfg.extend(e) }, compute: function s(e, t) {
for (var n = this.cfg, i = n.hasher.create(), o = r.create(), a = o.words, s = n.keySize, n = n.iterations;
a.length < s;) {
u && i.update(u);
var u = i.update(e).finalize(t);
i.reset();
for (var l = 1;
l < n;
l++) {
u = i.finalize(u), i.reset() } o.concat(u) } o.sigBytes = 4 * s;
return o } });
e.EvpKDF = function (e, t, n) {
return o.create(n).compute(e, t) } })();
i.lib.Cipher || function (e) {
var t = i, n = t.lib, r = n.Base, o = n.WordArray, a = n.BufferedBlockAlgorithm, s = t.enc.Base64, u = t.algo.EvpKDF, l = n.Cipher = a.extend({
cfg: r.extend(), createEncryptor: function m(e, t) {
return this.create(this._ENC_XFORM_MODE, e, t) }, createDecryptor: function y(e, t) {
return this.create(this._DEC_XFORM_MODE, e, t) }, init: function S(e, t, n) {
this.cfg = this.cfg.extend(n);
this._xformMode = e;
this._key = t;
this.reset() }, reset: function g() {
a.reset.call(this);
this._doReset() }, process: function _(e) {
this._append(e);
return this._process() }, finalize: function P(e) {
e && this._append(e);
return this._doFinalize() }, keySize: 4, ivSize: 4, _ENC_XFORM_MODE: 1, _DEC_XFORM_MODE: 2, _createHelper: function w(e) {
return {
encrypt: function t(n, i, r) {
return ("string" == typeof i ? p : v).encrypt(e, n, i, r) }, decrypt: function n(t, i, r) {
return ("string" == typeof i ? p : v).decrypt(e, t, i, r) } } } });
n.StreamCipher = l.extend({
_doFinalize: function b() {
return this._process(!0) }, blockSize: 1 });
var f = t.mode = {}, c = function k(t, n, i) {
var r = this._iv;
r ? this._iv = e : r = this._prevBlock;
for (var o = 0;
o < i;
o++) {
t[n + o] ^= r[o] } }, h = (n.BlockCipherMode = r.extend({
createEncryptor: function C(e, t) {
return this.Encryptor.create(e, t) }, createDecryptor: function R(e, t) {
return this.Decryptor.create(e, t) }, init: function T(e, t) {
this._cipher = e;
this._iv = t } })).extend();
h.Encryptor = h.extend({
processBlock: function I(e, t) {
var n = this._cipher, i = n.blockSize;
c.call(this, e, t, i);
n.encryptBlock(e, t);
this._prevBlock = e.slice(t, t + i) } });
h.Decryptor = h.extend({
processBlock: function x(e, t) {
var n = this._cipher, i = n.blockSize, r = e.slice(t, t + i);
n.decryptBlock(e, t);
c.call(this, e, t, i);
this._prevBlock = r } });
f = f.CBC = h;
h = (t.pad = {}).Pkcs7 = {
pad: function D(e, t) {
for (var n = 4 * t, n = n - e.sigBytes % n, i = n << 24 | n << 16 | n << 8 | n, r = [], a = 0;
a < n;
a += 4) {
r.push(i) } n = o.create(r, n);
e.concat(n) }, unpad: function z(e) {
e.sigBytes -= e.words[e.sigBytes - 1 >>> 2] & 255 } };
n.BlockCipher = l.extend({
cfg: l.cfg.extend({
mode: f, padding: h }), reset: function M() {
l.reset.call(this);
var e = this.cfg, t = e.iv, e = e.mode;
if (this._xformMode == this._ENC_XFORM_MODE)
var n = e.createEncryptor;
else n = e.createDecryptor, this._minBufferSize = 1;
this._mode = n.call(e, this, t && t.words) }, _doProcessBlock: function E(e, t) {
this._mode.processBlock(e, t) }, _doFinalize: function O() {
var e = this.cfg.padding;
if (this._xformMode == this._ENC_XFORM_MODE) {
e.pad(this._data, this.blockSize);
var t = this._process(!0) } else t = this._process(!0), e.unpad(t);
return t }, blockSize: 4 });
var d = n.CipherParams = r.extend({
init: function F(e) {
this.mixIn(e) }, toString: function q(e) {
return (e || this.formatter).stringify(this) } }), f = (t.format = {}).OpenSSL = {
stringify: function J(e) {
var t = e.ciphertext;
e = e.salt;
return (e ? o.create([1398893684, 1701076831]).concat(e).concat(t) : t).toString(s) }, parse: function W(e) {
e = s.parse(e);
var t = e.words;
if (1398893684 == t[0] && 1701076831 == t[1]) {
var n = o.create(t.slice(2, 4));
t.splice(0, 4);
e.sigBytes -= 16 }
return d.create({
ciphertext: e, salt: n }) } }, v = n.SerializableCipher = r.extend({
cfg: r.extend({
format: f }), encrypt: function L(e, t, n, i) {
i = this.cfg.extend(i);
var r = e.createEncryptor(n, i);
t = r.finalize(t);
r = r.cfg;
return d.create({
ciphertext: t, key: n, iv: r.iv, algorithm: e, mode: r.mode, padding: r.padding, blockSize: e.blockSize, formatter: i.format }) }, decrypt: function A(e, t, n, i) {
i = this.cfg.extend(i);
t = this._parse(t, i.format);
return e.createDecryptor(n, i).finalize(t.ciphertext) }, _parse: function B(e, t) {
return "string" == typeof e ? t.parse(e, this) : e } }), t = (t.kdf = {}).OpenSSL = {
execute: function U(e, t, n, i) {
i || (i = o.random(8));
e = u.create({
keySize: t + n }).compute(e, i);
n = o.create(e.words.slice(t), 4 * n);
e.sigBytes = 4 * t;
return d.create({
key: e, iv: n, salt: i }) } }, p = n.PasswordBasedCipher = v.extend({
cfg: v.cfg.extend({
kdf: t }), encrypt: function $(e, t, n, i) {
i = this.cfg.extend(i);
n = i.kdf.execute(n, e.keySize, e.ivSize);
i.iv = n.iv;
e = v.encrypt.call(this, e, t, n.key, i);
e.mixIn(n);
return e }, decrypt: function H(e, t, n, i) {
i = this.cfg.extend(i);
t = this._parse(t, i.format);
n = i.kdf.execute(n, e.keySize, e.ivSize, t.salt);
i.iv = n.iv;
return v.decrypt.call(this, e, t, n.key, i) } }) }();
(function () {
for (var e = i, t = e.lib.BlockCipher, n = e.algo, r = [], o = [], a = [], s = [], u = [], l = [], f = [], c = [], h = [], d = [], v = [], p = 0;
256 > p;
p++) {
v[p] = 128 > p ? p << 1 : p << 1 ^ 283 } for (var m = 0, y = 0, p = 0;
256 > p;
p++) {
var S = y ^ y << 1 ^ y << 2 ^ y << 3 ^ y << 4, S = S >>> 8 ^ S & 255 ^ 99;
r[m] = S;
o[S] = m;
var g = v[m], _ = v[g], P = v[_], w = 257 * v[S] ^ 16843008 * S;
a[m] = w << 24 | w >>> 8;
s[m] = w << 16 | w >>> 16;
u[m] = w << 8 | w >>> 24;
l[m] = w;
w = 16843009 * P ^ 65537 * _ ^ 257 * g ^ 16843008 * m;
f[S] = w << 24 | w >>> 8;
c[S] = w << 16 | w >>> 16;
h[S] = w << 8 | w >>> 24;
d[S] = w;
m ? (m = g ^ v[v[v[P ^ g]]], y ^= v[v[y]]) : m = y = 1 }
var b = [0, 1, 2, 4, 8, 16, 32, 64, 128, 27, 54], n = n.AES = t.extend({
_doReset: function k() {
for (var e = this._key, t = e.words, n = e.sigBytes / 4, e = 4 * ((this._nRounds = n + 6) + 1), i = this._keySchedule = [], o = 0;
o < e;
o++) {
if (o < n) i[o] = t[o];
else {
var a = i[o - 1];
o % n ? 6 < n && 4 == o % n && (a = r[a >>> 24] << 24 | r[a >>> 16 & 255] << 16 | r[a >>> 8 & 255] << 8 | r[a & 255]) : (a = a << 8 | a >>> 24, a = r[a >>> 24] << 24 | r[a >>> 16 & 255] << 16 | r[a >>> 8 & 255] << 8 | r[a & 255], a ^= b[o / n | 0] << 24);
i[o] = i[o - n] ^ a } } t = this._invKeySchedule = [];
for (n = 0;
n < e;
n++) {
o = e - n, a = n % 4 ? i[o] : i[o - 4], t[n] = 4 > n || 4 >= o ? a : f[r[a >>> 24]] ^ c[r[a >>> 16 & 255]] ^ h[r[a >>> 8 & 255]] ^ d[r[a & 255]] } }, encryptBlock: function C(e, t) {
this._doCryptBlock(e, t, this._keySchedule, a, s, u, l, r) }, decryptBlock: function R(e, t) {
var n = e[t + 1];
e[t + 1] = e[t + 3];
e[t + 3] = n;
this._doCryptBlock(e, t, this._invKeySchedule, f, c, h, d, o);
n = e[t + 1];
e[t + 1] = e[t + 3];
e[t + 3] = n }, _doCryptBlock: function T(e, t, n, i, r, o, a, s) {
for (var u = this._nRounds, l = e[t] ^ n[0], f = e[t + 1] ^ n[1], c = e[t + 2] ^ n[2], h = e[t + 3] ^ n[3], d = 4, v = 1;
v < u;
v++) {
var p = i[l >>> 24] ^ r[f >>> 16 & 255] ^ o[c >>> 8 & 255] ^ a[h & 255] ^ n[d++], m = i[f >>> 24] ^ r[c >>> 16 & 255] ^ o[h >>> 8 & 255] ^ a[l & 255] ^ n[d++], y = i[c >>> 24] ^ r[h >>> 16 & 255] ^ o[l >>> 8 & 255] ^ a[f & 255] ^ n[d++], h = i[h >>> 24] ^ r[l >>> 16 & 255] ^ o[f >>> 8 & 255] ^ a[c & 255] ^ n[d++], l = p, f = m, c = y } p = (s[l >>> 24] << 24 | s[f >>> 16 & 255] << 16 | s[c >>> 8 & 255] << 8 | s[h & 255]) ^ n[d++];
m = (s[f >>> 24] << 24 | s[c >>> 16 & 255] << 16 | s[h >>> 8 & 255] << 8 | s[l & 255]) ^ n[d++];
y = (s[c >>> 24] << 24 | s[h >>> 16 & 255] << 16 | s[l >>> 8 & 255] << 8 | s[f & 255]) ^ n[d++];
h = (s[h >>> 24] << 24 | s[l >>> 16 & 255] << 16 | s[f >>> 8 & 255] << 8 | s[c & 255]) ^ n[d++];
e[t] = p;
e[t + 1] = m;
e[t + 2] = y;
e[t + 3] = h }, keySize: 8 });
e.AES = t._createHelper(n) })();
t["default"] = i }, function (e, t, n) {
"use strict";
Object.defineProperty(t, "__esModule", {
value: true });
var i = function () {
function e(e, t) {
for (var n = 0;
n < t.length;
n++) {
var i = t[n];
i.enumerable = i.enumerable || false;
i.configurable = true;
if ("value" in i) i.writable = true;
Object.defineProperty(e, i.key, i) } }
return function (t, n, i) {
if (n) e(t.prototype, n);
if (i) e(t, i);
return t } }();
function r(e, t) {
if (!(e instanceof t)) {
throw new TypeError("Cannot call a class as a function") } }
var o = function () {
var e = function () {
function e() {
r(this, e) } i(e, [{
key: "createClientObject", value: function t(e, n, i, r) {
return {
socket: e, id: n, playURL: i, deviceSerial: r.deviceSerial || "", verificationCode: r.verificationCode || "", resolve: null, reject: null } } }, {
key: "playCmd", value: function n(e) {
var t = {
sequence: 0, cmd: "realplay", deviceSerial: e.deviceSerial, verificationCode: e.verificationCode, url: e.playURL };
return JSON.stringify(t) } }, {
key: "playbackCmd", value: function o(e, t, n) {
var i = {
sequence: 0, cmd: "playback", deviceSerial: e.deviceSerial, verificationCode: e.verificationCode, url: e.playURL, startTime: t, endTime: n };
return JSON.stringify(i) } }]);
return e }();
return e }();
t.LocalService = o }, function (e, t, n) {
"use strict";
Object.defineProperty(t, "__esModule", {
value: true });
var i = function () {
function e(e, t) {
for (var n = 0;
n < t.length;
n++) {
var i = t[n];
i.enumerable = i.enumerable || false;
i.configurable = true;
if ("value" in i) i.writable = true;
Object.defineProperty(e, i.key, i) } }
return function (t, n, i) {
if (n) e(t.prototype, n);
if (i) e(t, i);
return t } }();
function r(e, t) {
if (!(e instanceof t)) {
throw new TypeError("Cannot call a class as a function") } }
var o = 0;
var a = 1;
var s = 2;
var u = 3;
var l = 4;
var f = 5;
var c = 6;
var h = 7;
var d = 11;
var v = 12;
var p = 13;
var m = 14;
var y = 15;
var S = 16;
var g = 17;
var _ = 18;
var P = 19;
var w = 20;
var b = 21;
var k = 22;
var C = 24;
var R = 25;
var T = 26;
var I = 27;
var x = 28;
var D = 29;
var z = 30;
var M = 31;
var E = 33;
var O = 34;
var F = 99;
var q = 40;
var J = 41;
var W = 42;
var L = 43;
var A = 44;
var B = 45;
var U = 46;
var $ = 47;
var H = 48;
var N = 60;
var G = 61;
var j = 62;
var V = 63;
var X = {
AUDIO_G711_U: 28944, AUDIO_G711_A: 28945, AUDIO_G722_1: 29217, AUDIO_G726_U: 29280, AUDIO_G726_A: 29281, AUDIO_G726_2: 29282, AUDIO_AACLC: 8193, AUDIO_MPEG: 8192, AUDIO_NULL: 0 };
var Y = 0;
var Z = 1;
var K = 1;
var Q = 256;
var ee = 28944;
var te = 28945;
var ne = 0;
var ie = 1;
var re = "BMP";
var oe = "JPEG";
var ae = 0;
var se = 1;
var ue = 15;
var le = 8;
var fe = 1;
var ce = 25;
var he = 20;
var de = 5;
var ve = 5 * 1024 * 1024;
var pe = 5e3;
var me = {
left: 0, top: 0, right: 0, bottom: 0 };
var ye = false;
var Se = false;
var ge = {
id: null, cmd: null, data: null, errorCode: 0, status: null };
var _e = t.JSPlayCtrl = function () {
function e(t, n, i) {
r(this, e);
if (t != null && t !== undefined && typeof t === "string") {
this.szBasePath = t } else {
return a } if (n && typeof n === "function") {
this.fnCallBack = n } else {
return a } this.decodeWorker = null;
this.streamOpenMode = null;
this.bOpenStream = false;
this.audioRenderer = null;
this.aAudioBuffer = [];
this.iAudioBufferSize = 0;
this.oSuperRender = null;
this.aVideoFrameBuffer = [];
this.YUVBufferSize = fe;
this.szOSDTime = null;
this.bPlaySound = false;
this.bPlay = false;
this.bPause = false;
this.bOnebyOne = false;
this.bPlayRateChange = false;
this.bAudioTypeSupport = true;
this.dataCallBackFun = null;
this.YUVBufSizeCBFun = null;
this.nWidth = 0;
this.nHeight = 0;
this.sCanvasId = null;
this.aDisplayBuf = null;
this.bVisibility = true;
this.nDecFrameType = ae;
this.iCanvasWidth = 0;
this.iCanvasHeight = 0;
this.iZoomNum = 0;
this.iRatio_x = 1;
this.iRatio_y = 1;
this.stDisplayRect = {
top: 0, left: 0, right: 0, bottom: 0 };
this.bDisRect = false;
this.stYUVRect = {
top: 0, left: 0, right: 0, bottom: 0 };
this.aInputDataLens = [];
this.aInputDataBuffer = [];
this.bIsGetYUV = false;
this.bIsFirstFrame = true;
this.iInputMaxBufSize = ve;
this.bIsInput = false;
this.bIsInputBufOver = false;
this.iInputDataLen = pe;
var u = this;
this.setCallBack = function (e, t, n, r, o) {
var a = ge;
a.id = i;
a.cmd = t;
a.data = n;
a.errorCode = r;
a.status = o;
e.fnCallBack(a) };
if (!ye) {
ye = true;
var l = document.createElement("script");
l.type = "text/javascript";
l.src = u.szBasePath + "AudioRenderer.js";
var f = document.getElementsByTagName("head")[0];
f.appendChild(l);
l.onload = l.onreadystatechange = function () {
if (!this.readyState || this.readyState === "loaded" || this.readyState === "complete") {} } } if (!Se) {
Se = true;
var c = document.createElement("script");
c.type = "text/javascript";
c.src = u.szBasePath + "SuperRender_10.js";
var h = document.getElementsByTagName("head")[0];
h.appendChild(c);
c.onload = c.onreadystatechange = function () {
if (!this.readyState || this.readyState === "loaded" || this.readyState === "complete") {} } } this.convertErrorCode = function (e) {
switch (e) {
case 1:
return o;
case 98:
return a;
default:
return e } };
this.arrayBufferCopy = function (e) {
var t = e.byteLength;
var n = new Uint8Array(t);
var i = new Uint8Array(e);
var r = 0;
for (r = 0;
r < t;
r++) {
n[r] = i[r] }
return n };
this.inputDataFun = function () {
var e;
var t = 0;
u.bIsGetYUV = false;
if (u.bIsInputBufOver) {
console.log("inputDataFun over");
e = new Uint8Array(1) } else {
while (u.aInputDataLens.length > 0) {
t += u.aInputDataLens.shift();
if (t > u.iInputDataLen) {
break } } e = u.aInputDataBuffer.splice(0, t) }
var n = new Uint8Array(e);
var i = {
command: "InputData", data: n.buffer, dataSize: t };
if (u.bPlay) {
if (!u.bPause) {
u.decodeWorker.postMessage(i, [i.data]) } else {
if (u.bOnebyOne) {
u.decodeWorker.postMessage(i, [i.data]) } } } e = null;
n = null };
this.getPic = function (e, t) {
if (this.decodeWorker == null || this.oSuperRender == null) {
return s } if (!this.bPlay) {
return s } if (e && typeof e === "function") {
this.dataCallBackFun = e } else {
return a } if (0 === this.iZoomNum) {
this.stYUVRect.left = 0;
this.stYUVRect.top = 0;
this.stYUVRect.right = 0;
this.stYUVRect.bottom = 0 } else {
if (0 === this.iCanvasWidth || 0 === this.iCanvasHeight) {
this.stYUVRect.left = 0;
this.stYUVRect.top = 0;
this.stYUVRect.right = 0;
this.stYUVRect.bottom = 0 } else {
var n = this.nWidth / this.iCanvasWidth;
var i = this.nHeight / this.iCanvasHeight;
this.stYUVRect.left = Math.round(this.stDisplayRect.left * n);
this.stYUVRect.top = Math.round(this.stDisplayRect.top * i);
this.stYUVRect.right = Math.round(this.stDisplayRect.right * n);
this.stYUVRect.bottom = Math.round(this.stDisplayRect.bottom * i) } if (this.stYUVRect.right - this.stYUVRect.left < 32 || this.stYUVRect.bottom - this.stYUVRect.top < 32) {
return a } } if (this.aDisplayBuf == null) {
return s }
var r = this.arrayBufferCopy(this.aDisplayBuf);
var u = {
command: t, data: r.buffer, width: this.nWidth, height: this.nHeight, rect: this.stYUVRect };
this.decodeWorker.postMessage(u, [u.data]);
return o };
this.createWorker = function (e) {
if (window.Worker) {
if (this.decodeWorker == null) {
this.decodeWorker = new Worker(u.szBasePath + "DecodeWorker.js");
if (this.decodeWorker == null) {
return N } } this.decodeWorker.onmessage = function (t) {
var n = null;
var i = t.data;
switch (i["function"]) {
case "loaded": n = "loaded";
e.setCallBack(e, "loaded", 0, 0, true);
break;
case "SetStreamOpenMode": n = "SetStreamOpenMode";
break;
case "OpenStream": n = "OpenStream";
if (1 === i.errorCode) {
u.bOpenStream = true;
return }
break;
case "InputData": n = "InputData";
if (i.errorCode === d) {
u.bIsInputBufOver = true;
u.inputDataFun() } if (i.errorCode === M) {
u.bIsInputBufOver = false }
break;
case "GetFrameData": n = "GetFrameData";
if (i.data != null && i.frameInfo != null) {
var r = i.frameInfo.width;
var o = i.frameInfo.height } if (!u.bPlay) {
return } if (!u.bIsFirstFrame && i.errorCode === M) {
u.bIsInputBufOver = false;
setTimeout(u.inputDataFun(), 5);
break } else if (u.bIsInputBufOver) {
u.inputDataFun() } else {
if (i.type === "videoType") {
if (u.aInputDataLens.length > 0 && u.bIsInput) {
u.inputDataFun();
u.bIsInput = false } else {
u.bIsGetYUV = true } u.bIsFirstFrame = false } } if (u.bVisibility) {
switch (i.type) {
case "videoType": if (i.data == null || i.frameInfo == null) {
return a } u.bIsFirstFrame = false;
e.nWidth = i.frameInfo.width;
e.nHeight = i.frameInfo.height;
var s = new Object;
s.data = i.data;
s.osdTime = i.osd;
s.nWidth = i.frameInfo.width;
s.nHeight = i.frameInfo.height;
e.aVideoFrameBuffer.push(s);
s = null;
var l = e.aVideoFrameBuffer.length;
if (l > he) {
if (!e.bOnebyOne) {
e.aVideoFrameBuffer.splice(0, de) } } if (e.bOnebyOne) {
if (e.aVideoFrameBuffer.length >= ue) {
e.setCallBack(e, "OnebyOne", 0, 0, false);
e.bIsFirstFrame = true;
break } }
break;
case "audioType": if (e.bPlaySound && !e.bPlayRateChange) {
var f = new Uint8Array(i.data);
var c = e.aAudioBuffer.length;
for (var h = 0, v = f.length;
h < v;
h++) {
e.aAudioBuffer[c + h] = f[h] } e.iAudioBufferSize++;
f = null;
if (e.iAudioBufferSize >= ce) {
e.audioRenderer.Play(e.aAudioBuffer, e.aAudioBuffer.length, i.frameInfo);
e.aAudioBuffer.splice(0, e.aAudioBuffer.length);
e.aAudioBuffer.length = 0;
e.iAudioBufferSize = 0 } }
break;
case "privateType":
break;
default:
break } }
break;
case "PlaySound": n = "PlaySound";
break;
case "GetJPEG": n = "GetJPEG";
var p = i.data;
e.dataCallBackFun(p);
break;
case "GetBMP": n = "GetBMP";
var m = i.data;
e.dataCallBackFun(m);
break;
default:
break }if ("GetFrameData" !== n) {
e.setCallBack(e, n, 0, e.convertErrorCode(i.errorCode), true) } else {
if (S === i.errorCode) {
e.setCallBack(e, n, 0, e.convertErrorCode(i.errorCode), true) } } } } };
this.createWorker(u);
this.draw = function () {
if (u.bPlay) {
if (!u.bPause) {
requestAnimationFrame(u.draw) }
var e = u.aVideoFrameBuffer.length;
if (u.YUVBufSizeCBFun != null) {
u.YUVBufSizeCBFun(e) } if (u.bOnebyOne) {
if (e <= le) {
u.setCallBack(u, "OnebyOne", 0, M, true) } } if (e > u.YUVBufferSize) {
var t = u.aVideoFrameBuffer.shift();
u.aDisplayBuf = t.data;
var n = new Uint8Array(u.aDisplayBuf);
if (u.nWidth == 1920 && u.nHeight == 1088 || u.nWidth == 2688 && u.nHeight == 1520 && !u.bDisRect) {
var i = document.getElementById(u.sCanvasId).getBoundingClientRect();
var r = i.width;
var o = i.height - 8;
u.stDisRect = {
top: 0, left: 0, right: r, bottom: o };
u.oSuperRender.SR_SetDisplayRect(u.stDisRect) } else if (u.nWidth == 640 && u.nHeight == 368 && !u.bDisRect) {
var i = document.getElementById(u.sCanvasId).getBoundingClientRect();
var r = i.width;
var o = Math.floor(i.height * 360 / 368);
u.stDisRect = {
top: 0, left: 0, right: r, bottom: o };
u.oSuperRender.SR_SetDisplayRect(u.stDisRect) } u.oSuperRender.SR_DisplayFrameData(t.nWidth, t.nHeight, n);
n = null;
u.szOSDTime = t.osdTime;
t = null } } else {
if (!u.bPlay) {
u.aVideoFrameBuffer.splice(0, u.aVideoFrameBuffer.length);
u.aAudioBuffer.splice(0, u.aAudioBuffer.length) } } };
this.checkAudioType = function (e) {
var t = function r(e, t) {
var n = e[t] & 255 | (e[t + 1] & 255) << 8 | (e[t + 2] & 255) << 16 | (e[t + 3] & 255) << 24;
return n };
var n = [e[12], e[13], 0, 0];
var i = t(n, 0);
switch (i) {
case X.AUDIO_G711_A: case X.AUDIO_G711_U: case X.AUDIO_G722_1: case X.AUDIO_G726_2: case X.AUDIO_G726_A: case X.AUDIO_G726_U: case X.AUDIO_AACLC: case X.AUDIO_MPEG:
return o;
default:
return S } } } i(e, [{
key: "PlayM4_SetStreamOpenMode", value: function t(e) {
if (e == null || e === undefined) {
return a } if (e !== ne && e !== ie) {
return a } this.streamOpenMode = e;
console.log(">>>>>>>>> PlayM4_SetStreamOpenMode");
return o } }, {
key: "PlayM4_OpenStream", value: function n(e, t, i) {
if (this.decodeWorker == null) {
return s } if (e == null || t <= 0 || i <= 0) {
return a } this.bPlay = false;
this.bPause = false;
this.bOnebyOne = false;
this.bIsFirstFrame = true;
this.bIsGetYUV = false;
this.bIsInput = false;
var r = this.checkAudioType(e);
if (o !== r) {
this.bAudioTypeSupport = false } else {
this.bAudioTypeSupport = true } this.decodeWorker.postMessage({
command: "SetStreamOpenMode", data: this.streamOpenMode });
this.decodeWorker.postMessage({
command: "OpenStream", data: e, dataSize: t, bufPoolSize: i });
return o } }, {
key: "PlayM4_CloseStream", value: function u() {
if (this.decodeWorker === null || this.bOpenStream === false) {
return s } this.PlayM4_Stop();
this.decodeWorker.postMessage({
command: "CloseStream" });
if (this.oSuperRender !== null) {
this.oSuperRender.SR_Destroy();
this.oSuperRender = null } if (this.audioRenderer !== null) {
this.audioRenderer.Stop();
this.audioRenderer = null } this.aAudioBuffer.splice(0, this.aAudioBuffer.length);
this.aVideoFrameBuffer.splice(0, this.aVideoFrameBuffer.length);
this.aInputDataBuffer.splice(0, this.aInputDataBuffer.length);
this.aInputDataLens.splice(0, this.aInputDataLens.length);
this.bOpenStream = false;
this.iAudioBufferSize = 0;
return o } }, {
key: "PlayM4_Destroy", value: function l() {
if (this.decodeWorker === null) {
return o } this.PlayM4_CloseStream();
this.decodeWorker.terminate();
this.decodeWorker = null;
return o } }, {
key: "PlayM4_InputData", value: function f(e, t) {
if (this.decodeWorker === null || this.bOpenStream === false) {
return s }
var n = this.aInputDataBuffer.length;
if (t === 4) {
var i = new Uint8Array(e.buffer);
if (i[0] === 1 && i[1] === 2 && i[2] === 3 && i[3] === 4) {
console.log("intput end");
if (this.bIsFirstFrame) {
this.inputDataFun() } else {
if (this.bIsGetYUV) {
this.inputDataFun() } else {
this.bIsInput = true } } i = null;
return o } } if (n > this.iInputMaxBufSize) {
console.log("input over\n");
return d }
var r = null;
var a = t;
switch (this.streamOpenMode) {
case ie: r = new Uint8Array(e.buffer);
this.aInputDataLens.push(t);
break;
case ne: a = t + 4;
var u = new Uint32Array([t]);
var l = new Uint8Array(u.buffer);
r = new Uint8Array(a);
r.set(l, 0);
r.set(e, 4);
u = null;
l = null;
this.aInputDataLens.push(t + 4);
break;
default:
return S }for (var f = 0;
f < a;
f++) {
this.aInputDataBuffer[n + f] = r[f] } r = null;
if (this.bIsFirstFrame) {
this.inputDataFun() } else {
if (this.bIsGetYUV) {
this.inputDataFun() } else {
this.bIsInput = true } }
return o } }, {
key: "PlayM4_Play", value: function c(e) {
if (this.decodeWorker === null) {
return s } if (e !== null) {
if (typeof e !== "string") {
return a } } if (this.bOnebyOne) {
this.bPlayRateChange = false;
this.bOnebyOne = false;
this.bPause = false;
this.draw() } if (this.bPlay) {
return o } if (this.oSuperRender == null) {
this.oSuperRender = new SuperRender(e, this.szBasePath);
if (this.oSuperRender == null) {
return G } } if (this.audioRenderer == null) {
this.audioRenderer = new AudioRenderer;
if (this.audioRenderer == null) {
return G } } this.sCanvasId = e;
this.bPlay = true;
this.bPause = false;
this.bOnebyOne = false;
this.bPlaySound = false;
this.bPlayRateChange = false;
this.draw();
return o } }, {
key: "PlayM4_Stop", value: function h() {
if (this.decodeWorker == null || this.oSuperRender == null) {
return s } if (!this.bPlay) {
return s } if (this.bPlaySound) {
this.PlayM4_StopSound();
this.bPlaySound = true } this.bPlay = false;
this.bOnebyOne = false;
this.bPause = false;
this.oSuperRender.SR_SetDisplayRect(null);
this.iZoomNum = 0;
this.bDisRect = false;
this.oSuperRender.SR_DisplayFrameData(this.nWidth, this.nHeight, null);
return o } }, {
key: "PlayM4_PlayRate", value: function v(e) {
if (this.decodeWorker == null) {
return s } if (e === 1) {
this.bPlayRateChange = false } else {
this.bPlayRateChange = true } if (e < 1) {
e = 1 } this.iInputDataLen = e * pe;
return o } }, {
key: "PlayM4_Pause", value: function p(e) {
if (this.decodeWorker == null || this.oSuperRender == null) {
return s } if (!this.bPlay) {
return s } if (this.bOnebyOne) {
return s } if (typeof e !== "boolean") {
return a } this.bPause = e;
this.bIsFirstFrame = true;
if (e) {
if (this.bPlaySound) {
this.PlayM4_StopSound();
this.bPlaySound = true } } else {
if (this.bPlaySound) {
this.PlayM4_PlaySound() } this.draw() }
return o } }, {
key: "PlayM4_OneByOne", value: function m() {
if (this.decodeWorker == null || this.oSuperRender == null) {
return s } if (!this.bPlay) {
return s } this.iInputDataLen = pe;
this.bPause = true;
this.bOnebyOne = true;
this.bPlayRateChange = true;
this.draw();
return o } }, {
key: "PlayM4_PlaySound", value: function y(e) {
if (this.decodeWorker === null || this.bOpenStream === false) {
return s } if (!this.bAudioTypeSupport) {
return S } if (e < 0 || e > 16) {
return a } if (this.audioRenderer == null) {
this.audioRenderer = new AudioRenderer;
if (this.audioRenderer == null) {
return G } } this.audioRenderer.SetWndNum(e);
this.bPlaySound = true;
return o } }, {
key: "PlayM4_StopSound", value: function g() {
if (this.decodeWorker == null || this.audioRenderer == null) {
return s } if (!this.bPlaySound) {
return s } this.bPlaySound = false;
return o } }, {
key: "PlayM4_SetDisplayBuf", value: function _(e) {
if (this.decodeWorker == null) {
return s } if (e <= 0) {
return a } this.YUVBufferSize = e;
return o } }, {
key: "PlayM4_SetSecretKey", value: function P(e, t, n) {
if (this.decodeWorker == null || this.bOpenStream === false) {
return s } if (t == null) {
return a } if (Z === e) {
if (128 === n) {
if (t == null || t === undefined) {
return a } } else {
return a } } else if (Y === e) {} else {
return a } this.decodeWorker.postMessage({
command: "SetSecretKey", data: t, nKeyType: e, nKeyLen: n });
return o } }, {
key: "PlayM4_SetDecodeFrameType", value: function w(e) {
if (this.decodeWorker == null || this.oSuperRender == null) {
return s } if (e !== ae && e !== se) {
return a } this.nDecFrameType = e;
this.decodeWorker.postMessage({
command: "SetDecodeFrameType", data: e });
return o } }, {
key: "PlayM4_SetIFrameDecInterval", value: function b(e) {
if (this.nDecFrameType !== se) {
return s } if (e < 0) {
return a } this.decodeWorker.postMessage({
command: "SetIFrameDecInterval", data: e });
return o } }, {
key: "PlayM4_SetDisplayRegion", value: function k(e, t) {
if (this.decodeWorker === null || this.bPlay === false || this.oSuperRender === null) {
return s } if (this.canvasId === null) {
return s } if (t === true) {
if (e === null || e === undefined) {
return a } if (typeof e.left === "number" && typeof e.top === "number" && typeof e.right === "number" && typeof e.bottom === "number") {
if (e.right < 0 || e.left < 0 || e.top < 0 || e.bottom < 0) {
return a }
var n = e.left;
var i = e.right;
var r = e.top;
var u = e.bottom;
var l = document.getElementById(this.sCanvasId).getBoundingClientRect();
this.iCanvasWidth = l.width;
this.iCanvasHeight = l.height;
if (i - n < 16 || u - r < 16 || i - n > this.iCanvasWidth || u - r > this.iCanvasHeight) {
return a } if (this.iZoomNum !== 0) {
n = Math.round(n / this.iRatio_x) + this.stDisplayRect.left;
r = Math.round(r / this.iRatio_y) + this.stDisplayRect.top;
i = Math.round(i / this.iRatio_x) + this.stDisplayRect.left;
u = Math.round(u / this.iRatio_y) + this.stDisplayRect.top } this.stDisplayRect = {
top: r, left: n, right: i, bottom: u };
this.oSuperRender.SR_SetDisplayRect(this.stDisplayRect);
this.bDisRect = true;
var f = i - n;
var c = u - r;
this.iRatio_x = this.iCanvasWidth / f;
this.iRatio_y = this.iCanvasHeight / c;
this.iZoomNum++ } else {
return a } } else {
this.oSuperRender.SR_SetDisplayRect(null);
this.iZoomNum = 0;
this.bDisRect = false } if (this.bPause || this.bOnebyOne || this.bPlayRateChange) {
this.oSuperRender.SR_DisplayFrameData(this.nWidth, this.nHeight, new Uint8Array(this.aDisplayBuf)) }
return o } }, {
key: "PlayM4_GetBMP", value: function C(e) {
return this.getPic(e, "GetBMP") } }, {
key: "PlayM4_GetJPEG", value: function R(e) {
return this.getPic(e, "GetJPEG") } }, {
key: "PlayM4_SetVolume", value: function T(e) {
if (this.decodeWorker == null) {
return s } if (this.audioRenderer == null) {
return s } if (e < 0 || e > 100) {
return a } this.audioRenderer.SetVolume(e / 100);
return o } }, {
key: "PlayM4_GetVolume", value: function I(e) {
if (this.decodeWorker == null) {
return s } if (this.audioRenderer == null) {
return s } if (e && typeof e === "function") {
var t = this.audioRenderer.GetVolume();
if (t === null) {
return V } else {
e(Math.round(t * 10) * 10);
return o } } else {
return a } } }, {
key: "PlayM4_GetOSDTime", value: function x(e) {
if (this.decodeWorker == null) {
return s } if (!this.bPlay) {
return s } if (e && typeof e === "function") {
e(this.szOSDTime);
return o } else {
return a } } }, {
key: "PlayM4_IsVisible", value: function D(e) {
this.bVisibility = e;
return o } }, {
key: "PlayM4_GetSdkVersion", value: function z() {
return "07020135" } }, {
key: "PlayM4_GetInputBufSize", value: function E() {
return this.aInputDataBuffer.length } }, {
key: "PlayM4_SetInputBufSize", value: function O(e) {
if (e > 0) {
this.iInputMaxBufSize = e;
return o } else {
return a } } }, {
key: "PlayM4_GetYUVBufSize", value: function F() {
return this.aVideoFrameBuffer.length } }, {
key: "PlayM4_GetFrameResolution", value: function q(e) {
if (this.decodeWorker == null) {
return s } if (e && typeof e === "function") {
e(this.nWidth, this.nHeight);
return o } else {
return a } } }, {
key: "PlayM4_RegisterYUVBufSizeCB", value: function J(e) {
if (e && typeof e === "function") {
this.YUVBufSizeCBFun = e;
return o } else {
return a } } }, {
key: "PlayM4_UnRegisterYUVBufSizeCB", value: function W() {
if (this.YUVBufSizeCBFun != null) {
this.YUVBufSizeCBFun = null }
return o } }, {
key: "PlayM4_ClearCanvas", value: function L() {
if (this.oSuperRender == null) {
return s } this.oSuperRender.SR_DisplayFrameData(this.nWidth, this.nHeight, null);
return o } }, {
key: "PlayM4_ReleaseInputBuffer", value: function A() {
if (this.aInputDataBuffer === null) {
return s } this.aInputDataBuffer.splice(0, this.aInputDataBuffer.length);
this.aInputDataLens.splice(0, this.aInputDataLens.length);
return o } }, {
key: "PlayM4_GetDecodeFrameType", value: function B() {
return this.nDecFrameType } }]);
return e }() }, function (e, t, n) {
"use strict";
Object.defineProperty(t, "__esModule", {
value: true });
t.StorageManager = undefined;
var i = function () {
function e(e, t) {
for (var n = 0;
n < t.length;
n++) {
var i = t[n];
i.enumerable = i.enumerable || false;
i.configurable = true;
if ("value" in i) i.writable = true;
Object.defineProperty(e, i.key, i) } }
return function (t, n, i) {
if (n) e(t.prototype, n);
if (i) e(t, i);
return t } }();
var r = n(1);
var o = s(r);
var a = n(4);
function s(e) {
return e && e.__esModule ? e : {
"default": e } } function u(e, t) {
if (!(e instanceof t)) {
throw new TypeError("Cannot call a class as a function") } }
var l = "Web/RecordFiles/";
var f = "Web/PlaybackFiles/";
var c = 1e3;
var h = 1;
var d = 3001;
window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
window.URL = window.URL || window.webkitURL;
var v = function () {
function e(t, n, i, r) {
u(this, e);
this.szUUID = t;
this.szFileName = n;
this.iStreamType = i;
this.szPath = "";
this.bStart = false;
this.aStreamList = [];
this.options = r } i(e, [{
key: "init", value: function t() {
var e = this;
if (0 === this.iStreamType) {
this.szPath = l } else if (1 === this.iStreamType) {
this.szPath = f } this.szPath += this.getDateDir();
var t = e.szPath.split("/");
var n = new Promise(function (n) {
window.requestFileSystem(window.TEMPORARY, e.options.iFileSize, function (i) {
e.createDir(i.root, t, function () {
n() }) }, e.errorHandler) });
return n } }, {
key: "getDateDir", value: function n() {
return a.oTool.dateFormat(new Date, "yyyy-MM-dd") } }, {
key: "createDir", value: function r(e, t, n) {
var i = this;
if (t.length) {
e.getDirectory(t[0], {
create: true }, function (e) {
i.createDir(e, t.slice(1), n) }, i.errorHandler) } else {
n() } } }, {
key: "errorHandler", value: function o() {} }, {
key: "writeFileHeader", value: function s(e) {
var t = this;
window.requestFileSystem(window.TEMPORARY, t.options.iFileSize, function (n) {
n.root.getFile(t.szPath + "/" + t.szFileName, {
create: true }, function (n) {
n.createWriter(function (n) {
n.onwriteend = function () {
t.bStart = true;
t.writeFile(n) };
n.onerror = function () {};
n.seek(n.length);
var i = new Blob([e]);
n.write(i) }, t.errorHandler) }, t.errorHandler) }, t.errorHandler) } }, {
key: "writeFileContent", value: function h(e) {
this.aStreamList.push(e) } }, {
key: "writeFile", value: function v(e) {
var t = this;
if (this.bStart) {
if (this.aStreamList.length > 0) {
var n = this.aStreamList.shift();
e.seek(e.length);
if (e.length >= this.options.iFileSize) {
if (this.options.cbEventHandler) {
this.options.cbEventHandler(d, this.szUUID) }
return }
var i = new Blob([n]);
e.write(i) } else {
setTimeout(function () {
t.writeFile(e) }, c) } } } }, {
key: "stopWriteFile", value: function p() {
var e = this;
this.bStart = false;
this.aStreamList.length = 0;
var t = new Promise(function (t) {
window.requestFileSystem(window.TEMPORARY, e.options.iFileSize, function (n) {
n.root.getFile(e.szPath + "/" + e.szFileName, {
create: false }, function (e) {
e.file(function (e) {
t();
a.oTool.downloadFile(e, e.name) }) }, e.errorHandler) }, e.errorHandler) });
return t } }]);
return e }();
var p = function () {
function e(t, n, i, r, o, a, s) {
u(this, e);
this.szBasePath = t;
this.szUUID = n;
this.szFileName = i;
this.aHeadBuf = new Uint8Array(r);
this.iPackType = o;
this.iStreamType = a;
this.oWorker = null;
this.oFileSystem = null;
this.options = s } i(e, [{
key: "init", value: function t() {
var e = this;
var t = new Promise(function (t, n) {
e.initFileSystem().then(function () {
e.initWorker().then(function () {
t(e.szUUID) }, function (e) {
n(e) }) }, function (e) {
n(e) }) });
return t } }, {
key: "initFileSystem", value: function n() {
var e = this;
this.oFileSystem = new v(this.szUUID, this.szFileName, this.iStreamType, this.options);
var t = new Promise(function (t, n) {
e.oFileSystem.init().then(function () {
t() }, function (e) {
n(e) }) });
return t } }, {
key: "initWorker", value: function r() {
var e = this;
var t = new Promise(function (t) {
e.oWorker = new Worker(e.szBasePath + "/systemTransform-worker.min.js");
e.oWorker.onmessage = function (n) {
var i = n.data;
if ("loaded" === i.type) {
e.oWorker.postMessage({
type: "create", buf: e.aHeadBuf.buffer, len: 40, packType: e.iPackType }, [e.aHeadBuf.buffer]) } else if ("created" === i.type) {
t() } else if ("outputData" === i.type) {
var r = new Uint8Array(i.buf);
if (h === i.dType) {
e.oFileSystem.writeFileHeader(r) } else {
e.oFileSystem.writeFileContent(r) } } } });
return t } }, {
key: "inputData", value: function o(e) {
if (this.oWorker) {
var t = new Uint8Array(e);
this.oWorker.postMessage({
type: "inputData", buf: t.buffer, len: t.length }, [t.buffer]) } } }, {
key: "stopRecord", value: function a() {
var e = this;
var t = new Promise(function (t, n) {
if (e.oWorker) {
e.oWorker.postMessage({
type: "release" }) } else {
n() } if (e.oFileSystem) {
e.oFileSystem.stopWriteFile().then(function () {
t() }, function () {
n() }) } else {
n() } });
return t } }]);
return e }();
var m = function () {
var e = Symbol("STORAGELIST");
var t = function () {
function t(n, i) {
u(this, t);
this.szBasePath = n;
this[e] = {};
this.options = {
iFileSize: 1024 * 1024 * 1024 };
$.extend(this.options, i) } i(t, [{
key: "startRecord", value: function n(t, i, r, a, s) {
var u = this;
var l = o["default"].v4();
var f = $.extend({}, this.options, s);
var c = new p(this.szBasePath, l, t, i, r, a, f);
var h = new Promise(function (t, n) {
c.init().then(function (n) {
u[e][n] = c;
t(n) }, function (e) {
n(e) }) });
return h } }, {
key: "inputData", value: function r(t, n) {
var i = this[e][t];
if (i) {
i.inputData(n) } } }, {
key: "stopRecord", value: function a(t) {
var n = this;
var i = new Promise(function (i, r) {
var o = n[e][t];
if (o) {
o.stopRecord().then(function () {
delete n[e][t];
i() }, function () {
r() }) } else {
r() } });
return i } }]);
return t }();
return t }();
t.StorageManager = m }, function (e, t, n) {
"use strict";
Object.defineProperty(t, "__esModule", {
value: true });
var i = function () {
function e(e, t) {
for (var n = 0;
n < t.length;
n++) {
var i = t[n];
i.enumerable = i.enumerable || false;
i.configurable = true;
if ("value" in i) i.writable = true;
Object.defineProperty(e, i.key, i) } }
return function (t, n, i) {
if (n) e(t.prototype, n);
if (i) e(t, i);
return t } }();
function r(e, t) {
if (!e) {
throw new ReferenceError("this hasn't been initialised - super() hasn't been called") }
return t && (typeof t === "object" || typeof t === "function") ? t : e } function o(e, t) {
if (typeof t !== "function" && t !== null) {
throw new TypeError("Super expression must either be null or a function, not " + typeof t) } e.prototype = Object.create(t && t.prototype, {
constructor: {
value: e, enumerable: false, writable: true, configurable: true } });
if (t) Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t } function a(e, t) {
if (!(e instanceof t)) {
throw new TypeError("Cannot call a class as a function") } }
var s = function () {
var e = null;
var t = Symbol("CANVAS");
var n = Symbol("CONTEXT");
var s = Symbol("SHAPES");
var u = Symbol("DRAWSTATUS");
var l = Symbol("SHAPETYPE");
var f = Symbol("MAXSHAPENUMSUPPORT");
var c = Symbol("SHAPESTYLE");
var h = Symbol("POLYGONDRAWING");
var d = Symbol("CURRENTSHAPEINFO");
var v = Symbol("DRAWSHAPEMULTIONETIME");
var p = Symbol("EVENTCALLBACK");
var m = Symbol("DRAWEVENTCALLBACK");
function y() {
e[n].clearRect(0, 0, e.m_iCanvasWidth, e.m_iCanvasHeight);
for (var t = 0, i = e[s].length;
t < i;
t++) {
e[s][t].draw() } } function S(t) {
var n = e[s].length;
if (n < e[f]) {
e[s].push(t) } } function g() {
var n = false;
var i = 0;
var r = 0;
var o = "draw";
var a = null;
function c() {
var t = -1;
for (var n = 0, i = e[s].length;
n < i;
n++) {
if (e[s][n].m_bChoosed) {
t = n;
break } }
return t } e[t][0].oncontextmenu = function () {
return false };
e[t][0].onselectstart = function () {
return false };
e[t].unbind();
e[t].bind("mousedown", function (p) {
if (p.button === 2) {
if (e[h] && a) {
if (a.m_aPoint.length >= a.m_iMinClosed) {
a.m_bClosed = true;
e[h] = false;
a.setPointInfo(a.m_aPoint);
S(a);
y();
n = false;
if (!e[v] && 0 === a.m_iRedrawMode) {
e[u] = false } e[m] && e[m]({
id: +a.m_szId, type: a.m_szType, event: "drawEnd" }) } } } else if (p.button === 0) {
i = p.offsetX;
r = p.offsetY;
o = "draw";
if (!e[h]) {
var g = c();
if (g !== -1) {
if (e[s][g].inArc(p.offsetX, p.offsetY, 5)) {
o = "stretch" } } if (o !== "stretch") {
for (var _ = 0, w = e[s].length;
_ < w;
_++) {
if (e[s][_].inShape(p.offsetX, p.offsetY)) {
e[s][_].m_bChoosed = true;
e[s][_].getMouseDownPoints(p.offsetX, p.offsetY);
o = "drag";
e[m] && e[m]({
id: +e[s][_].m_szId, type: e[s][_].m_szType, event: "choosed" }) } else {
e[s][_].m_bChoosed = false } } } if (o === "drag") {
e[t][0].style.cursor = "move" } else {
e[t][0].style.cursor = "default" } if ("draw" === o && 1 === e[s].length && 1 === e[s][0].m_iRedrawMode && e[u]) {
e.deleteRepeatByIdAndType(e[s][0].m_szId, e[s][0].m_szType) } } if (o === "draw") {
if (e[u]) {
if (e[f] <= e[s].length && e[l] !== "Grid" && e[l] !== "Point") {
return } if (e[l] === "Rect") {
a = new P;
a.m_szId = e[d].szId || "";
a.m_szTips = e[d].szTips || "";
a.m_iRedrawMode = e[d].iRedrawMode } else if (e[l] === "Grid") {
if (e[s].length === 0) {
a = new b;
S(a) } } else if (e[l] === "Polygon") {
if (!e[h]) {
e[h] = true;
a = new C;
a.m_szId = e[d].szId || "";
a.m_szTips = e[d].szTips || "";
a.m_iMinClosed = e[d].iMinClosed || 3;
a.m_iMaxPointNum = e[d].iMaxPointNum || 11;
a.m_iPolygonType = e[d].iPolygonType;
a.m_szDrawColor = e[d].szDrawColor;
a.m_szFillColor = e[d].szFillColor;
a.m_iTranslucent = e[d].iTranslucent;
a.m_iRedrawMode = e[d].iRedrawMode } if (a.m_iPolygonType === 1) {
a.addPoint(i, r);
if (a.m_aPoint.length === a.m_iMaxPointNum) {
a.m_bClosed = true;
e[h] = false;
S(a);
y();
n = false;
if (!e[v] && 0 === a.m_iRedrawMode) {
e[u] = false } e[m] && e[m]({
id: +a.m_szId, type: a.m_szType, event: "drawEnd" }) } } } else if (e[l] === "Point") {
e.clearShapeByType("Point");
a = new R;
a.m_szId = e[d].szId || "";
a.m_szDrawColor = e[d].szDrawColor;
a.setPointInfo([[i, r]]);
S(a);
y() } } } n = true } });
e[t].bind("mousemove", function (t) {
if (!e[h]) {
var f = c();
if (f > -1) {
if (n) {
if (o === "drag") {
e[s][f].drag(t.offsetX, t.offsetY) } else if (o === "stretch") {
e[s][f].stretch(t.offsetX, t.offsetY);
e[m] && e[m]({
id: +e[s][f].m_szId, type: e[s][f].m_szType, event: "stretch" }) } } } else {
if (e[u]) {
if (n) {
if (e[l] === "Rect") {
a.move([[i, r], [t.offsetX, t.offsetY]]) } else if (e[l] === "Grid") {
e[s][0].move(i, r, t.offsetX, t.offsetY) } } } } } else {
if (e[u]) {
if (n) {
if (e[l] === "Polygon" && a.m_iPolygonType === 0) {
a.m_bClosed = true } y();
a.move(t.offsetX, t.offsetY, i, r) } } } });
e[t].bind("mouseup", function (s) {
e[t][0].style.cursor = "default";
if (a !== null && typeof a !== "undefined" && o === "draw" && e[u]) {
if (e[l] === "Rect") {
if (Math.abs(s.offsetX - i) > 2 && Math.abs(s.offsetY - r) > 2) {
S(a);
if (!e[v] && 0 === a.m_iRedrawMode && 1 === e[f]) {
e[u] = false } e[m] && e[m]({
id: +a.m_szId, type: a.m_szType, event: "drawEnd" }) } if (e[p]) {
var c = {
id: +a.m_szId, startPos: [], endPos: [], tips: a.m_szTips };
if (a.m_aPoint[0] && a.m_aPoint[2]) {
try {
var d = void 0;
var g = void 0;
var _ = void 0;
var P = void 0;
if (s.offsetX > i && s.offsetY > r) {
c.startPos = a.m_aPoint[0] || [s.offsetX, s.offsetY];
c.endPos = a.m_aPoint[2] || [s.offsetX, s.offsetY];
d = a.m_aPoint[0][0] / e.m_iCanvasWidth;
g = a.m_aPoint[0][1] / e.m_iCanvasHeight;
_ = a.m_aPoint[2][0] / e.m_iCanvasWidth;
P = a.m_aPoint[2][1] / e.m_iCanvasHeight } else {
c.startPos = a.m_aPoint[2] || [s.offsetX, s.offsetY];
c.endPos = a.m_aPoint[0] || [s.offsetX, s.offsetY];
d = a.m_aPoint[2][0] / e.m_iCanvasWidth;
g = a.m_aPoint[2][1] / e.m_iCanvasHeight;
_ = a.m_aPoint[0][0] / e.m_iCanvasWidth;
P = a.m_aPoint[0][1] / e.m_iCanvasHeight } c.points = [[d, g], [_, g], [_, P], [d, P]];
e[p] && e[p](c) } catch (w) {} } e.clearAllShape() } a = null } else if (e[l] === "Polygon" && a.m_iPolygonType === 0 && e[h]) {
if (Math.abs(s.offsetX - i) > 2 && Math.abs(s.offsetY - r) > 2) {
S(a);
e[h] = false;
if (!e[v] && 0 === a.m_iRedrawMode) {
e[u] = false } e[m] && e[m]({
id: +a.m_szId, type: a.m_szType, event: "drawEnd" }) } } } if (!e[h]) {
n = false } else {
n = true } if (!e[h]) {
y() } });
e[t].bind("dblclick", function () {
if (e[u]) {
if (e[l] === "Grid") {
e[s][0].m_szGridMap = "fffffcfffffcfffffcfffffcfffffcfffffcfffffcfffffcfffffcfffffcfffffcfffffcfffffcfffffcfffffcfffffcfffffcfffffc";
y() } } });
e[t].bind("mouseout", function () {
e[t][0].style.cursor = "default";
if (!e[h]) {
n = false } else {
n = true } }) }
var _ = function () {
function t() {
a(this, t);
this.m_szId = "";
this.m_aPoint = [];
this.m_bChoosed = false;
this.m_szDrawColor = e[c].szDrawColor;
this.m_szFillColor = e[c].szFillColor;
this.m_iTranslucent = e[c].iTranslucent;
this.m_iIndexChoosePoint = -1;
this.m_iDriftStartX = 0;
this.m_iDriftStartY = 0;
this.m_oEdgePoints = {
top: {
x: 0, y: 0 }, left: {
x: 0, y: 0 }, right: {
x: 0, y: 0 }, bottom: {
x: 0, y: 0 } };
this.m_szTips = "";
this.m_iEditType = 0;
this.m_iMinClosed = 3;
this.m_iMaxPointNum = 11;
this.m_bClosed = false;
this.m_iRedrawMode = 0 } i(t, [{
key: "draw", value: function n() {} }, {
key: "drag", value: function r(t, n) {
var i = this.m_aPoint.length;
var r = 0;
for (r = 0;
r < i;
r++) {
if (this.m_aPoint[r][0] + t - this.m_iDriftStartX > e.m_iCanvasWidth || this.m_aPoint[r][1] + n - this.m_iDriftStartY > e.m_iCanvasHeight || this.m_aPoint[r][0] + t - this.m_iDriftStartX < 0 || this.m_aPoint[r][1] + n - this.m_iDriftStartY < 0) {
this.m_iDriftStartX = t;
this.m_iDriftStartY = n;
return } } for (r = 0;
r < i;
r++) {
this.m_aPoint[r][0] = this.m_aPoint[r][0] + t - this.m_iDriftStartX;
this.m_aPoint[r][1] = this.m_aPoint[r][1] + n - this.m_iDriftStartY } this.m_iDriftStartX = t;
this.m_iDriftStartY = n;
this.setPointInfo(this.m_aPoint);
y() } }, {
key: "stretch", value: function o(e, t) {
if (this.m_iEditType === 0) {
if (this.m_iIndexChoosePoint !== -1) {
this.m_aPoint[this.m_iIndexChoosePoint][0] = e;
this.m_aPoint[this.m_iIndexChoosePoint][1] = t } this.setPointInfo(this.m_aPoint);
y() } } }, {
key: "inShape", value: function s(e, t) {
var n = false;
var i = this.m_aPoint.length;
for (var r = 0, o = i - 1;
r < i;
o = r++) {
if (this.m_aPoint[r][1] > t !== this.m_aPoint[o][1] > t && e < (this.m_aPoint[o][0] - this.m_aPoint[r][0]) * (t - this.m_aPoint[r][1]) / (this.m_aPoint[o][1] - this.m_aPoint[r][1]) + this.m_aPoint[r][0]) {
n = !n } }
return n } }, {
key: "inArc", value: function u(e, t, n) {
var i = false;
for (var r = 0, o = this.m_aPoint.length;
r < o;
r++) {
var a = Math.sqrt((e - this.m_aPoint[r][0]) * (e - this.m_aPoint[r][0]) + (t - this.m_aPoint[r][1]) * (t - this.m_aPoint[r][1]));
if (a < n) {
i = true;
this.m_iIndexChoosePoint = r;
break } }
return i } }, {
key: "getMouseDownPoints", value: function l(e, t) {
this.m_iDriftStartX = e;
this.m_iDriftStartY = t } }, {
key: "getPointInfo", value: function f() {
return this.m_aPoint } }, {
key: "setPointInfo", value: function h(e) {
if (e !== null && typeof e !== "undefined" && e.length > 0) {
this.m_aPoint = e;
this.setEdgePoints(e) } } }, {
key: "addPoint", value: function d(e, t) {
if (this.m_aPoint.length < this.m_iMaxPointNum) {
this.m_aPoint.push([e, t]) } if (this.m_aPoint.length === this.m_iMaxPointNum) {
this.setPointInfo(this.m_aPoint) } } }, {
key: "setEdgePoints", value: function v(e) {
for (var t = 0, n = e.length;
t < n;
t++) {
if (t === 0) {
this.m_oEdgePoints.top.x = e[t][0];
this.m_oEdgePoints.top.y = e[t][1];
this.m_oEdgePoints.left.x = e[t][0];
this.m_oEdgePoints.left.y = e[t][1];
this.m_oEdgePoints.right.x = e[t][0];
this.m_oEdgePoints.right.y = e[t][1];
this.m_oEdgePoints.bottom.x = e[t][0];
this.m_oEdgePoints.bottom.y = e[t][1] } else {
if (e[t][1] < this.m_oEdgePoints.top.y) {
this.m_oEdgePoints.top.x = e[t][0];
this.m_oEdgePoints.top.y = e[t][1] } if (e[t][0] > this.m_oEdgePoints.right.x) {
this.m_oEdgePoints.right.x = e[t][0];
this.m_oEdgePoints.right.y = e[t][1] } if (e[t][1] > this.m_oEdgePoints.bottom.y) {
this.m_oEdgePoints.bottom.x = e[t][0];
this.m_oEdgePoints.bottom.y = e[t][1] } if (e[t][0] < this.m_oEdgePoints.left.x) {
this.m_oEdgePoints.left.x = e[t][0];
this.m_oEdgePoints.left.y = e[t][1] } } } } }]);
return t }();
var P = function (t) {
o(s, t);
function s() {
a(this, s);
var e = r(this, (s.__proto__ || Object.getPrototypeOf(s)).call(this));
e.m_szType = "Rect";
return e } i(s, [{
key: "setPointInfo", value: function u(e) {
if (e !== null && typeof e !== "undefined") {
var t = e[0][0];
var n = e[0][1];
var i = e[0][0];
var r = e[0][1];
for (var o = 0, a = e.length;
o < a;
o++) {
if (t > e[o][0]) {
t = e[o][0] } if (n > e[o][1]) {
n = e[o][1] } if (i < e[o][0]) {
i = e[o][0] } if (r < e[o][1]) {
r = e[o][1] } } this.m_aPoint = [[t, n], [i, n], [i, r], [t, r]] } } }, {
key: "draw", value: function l() {
e[n].fillStyle = this.m_szFillColor;
e[n].strokeStyle = this.m_szDrawColor;
var t = this.m_aPoint[0][0];
var i = this.m_aPoint[0][1];
var r = this.m_aPoint[2][0] - t;
var o = this.m_aPoint[2][1] - i;
e[n].globalAlpha = this.m_iTranslucent;
e[n].fillRect(t, i, r, o);
e[n].globalAlpha = 1;
e[n].fillText(this.m_szTips, (t + this.m_aPoint[2][0]) / 2, (i + this.m_aPoint[2][1]) / 2);
if (this.m_bChoosed) {
var a = Math.round(r / 2);
var s = Math.round(o / 2);
if (this.m_iEditType === 0) {
var u = [t, t + a, t + r, t, t + r, t, t + a, t + r];
var l = [i, i, i, i + s, i + s, i + o, i + o, i + o];
for (var f = 0;
f < 8;
f++) {
e[n].beginPath();
e[n].arc(u[f], l[f], 3, 0, 360, false);
e[n].fillStyle = this.m_szDrawColor;
e[n].closePath();
e[n].fill() } } } e[n].strokeRect(t, i, r, o) } }, {
key: "stretch", value: function f(e, t) {
if (this.m_iEditType === 0) {
if (this.m_iIndexChoosePoint === 0) {
if (e < this.m_aPoint[2][0] && t < this.m_aPoint[2][1]) {
this.m_aPoint[0][0] = e;
this.m_aPoint[0][1] = t;
this.m_aPoint[3][0] = e;
this.m_aPoint[1][1] = t } } else if (this.m_iIndexChoosePoint === 1) {
if (t < this.m_aPoint[2][1]) {
this.m_aPoint[0][1] = t;
this.m_aPoint[1][1] = t } } else if (this.m_iIndexChoosePoint === 2) {
if (e > this.m_aPoint[3][0] && t < this.m_aPoint[3][1]) {
this.m_aPoint[1][0] = e;
this.m_aPoint[1][1] = t;
this.m_aPoint[2][0] = e;
this.m_aPoint[0][1] = t } } else if (this.m_iIndexChoosePoint === 3) {
if (e < this.m_aPoint[2][0]) {
this.m_aPoint[0][0] = e;
this.m_aPoint[3][0] = e } } else if (this.m_iIndexChoosePoint === 4) {
if (e > this.m_aPoint[0][0]) {
this.m_aPoint[1][0] = e;
this.m_aPoint[2][0] = e } } else if (this.m_iIndexChoosePoint === 5) {
if (e < this.m_aPoint[1][0] && t > this.m_aPoint[1][1]) {
this.m_aPoint[3][0] = e;
this.m_aPoint[3][1] = t;
this.m_aPoint[0][0] = e;
this.m_aPoint[2][1] = t } } else if (this.m_iIndexChoosePoint === 6) {
if (t > this.m_aPoint[1][1]) {
this.m_aPoint[2][1] = t;
this.m_aPoint[3][1] = t } } else if (this.m_iIndexChoosePoint === 7) {
if (e > this.m_aPoint[0][0] && t > this.m_aPoint[0][1]) {
this.m_aPoint[2][0] = e;
this.m_aPoint[2][1] = t;
this.m_aPoint[1][0] = e;
this.m_aPoint[3][1] = t } } y() } } }, {
key: "move", value: function c(e) {
y();
this.m_bChoosed = true;
var t = e[0][0];
var n = e[0][1];
var i = e[1][0];
var r = e[1][1];
this.setPointInfo([[t, n], [i, n], [i, r], [t, r]]);
this.draw() } }, {
key: "inArc", value: function h(e, t, n) {
var i = this.m_aPoint[0][0];
var r = this.m_aPoint[0][1];
var o = this.m_aPoint[2][0] - i;
var a = this.m_aPoint[2][1] - r;
var s = Math.round(o / 2);
var u = Math.round(a / 2);
var l = [i, i + s, i + o, i, i + o, i, i + s, i + o];
var f = [r, r, r, r + u, r + u, r + a, r + a, r + a];
for (var c = 0;
c < 8;
c++) {
var h = Math.sqrt((e - l[c]) * (e - l[c]) + (t - f[c]) * (t - f[c]));
if (h < n) {
this.m_iIndexChoosePoint = c;
return true } }
return false } }]);
return s }(_);
var w = function (t) {
o(s, t);
function s(e, t) {
a(this, s);
var n = r(this, (s.__proto__ || Object.getPrototypeOf(s)).call(this));
n.m_szType = "RectOSD";
n.m_szOSDType = "overlay-date";
n.m_szText = e || "";
n.m_szEnabled = t || "";
n.m_szDateStyle = "";
n.m_szClockType = "";
n.m_szDisplayWeek = "";
n.m_szId = "";
n.m_szAlignment = "0";
return n } i(s, [{
key: "draw", value: function u() {
if (this.m_szEnabled === "true") {
var t = this.m_aPoint[0][0];
var i = this.m_aPoint[0][1];
var r = this.m_aPoint[2][0] - t;
var o = this.m_aPoint[2][1] - i;
e[n].beginPath();
e[n].strokeStyle = this.m_szDrawColor;
e[n].globalAlpha = 1;
e[n].rect(t, i, r, o);
e[n].font = "15px serif";
e[n].strokeText(this.m_szText, t, i + 15);
e[n].stroke() } } }, {
key: "drag", value: function l(t, n) {
var i = this.m_aPoint.length;
var r = 0;
if ("0" === this.m_szAlignment) {
for (r = 0;
r < i;
r++) {
if (this.m_aPoint[r][1] + n - this.m_iDriftStartY > e.m_iCanvasHeight || this.m_aPoint[r][0] + t - this.m_iDriftStartX < 0 || this.m_aPoint[r][1] + n - this.m_iDriftStartY < 0) {
this.m_iDriftStartX = t;
this.m_iDriftStartY = n;
return } } for (r = 0;
r < i;
r++) {
this.m_aPoint[r][0] = this.m_aPoint[r][0] + t - this.m_iDriftStartX;
this.m_aPoint[r][1] = this.m_aPoint[r][1] + n - this.m_iDriftStartY } } else if ("1" === this.m_szAlignment || "2" === this.m_szAlignment) {
for (r = 0;
r < i;
r++) {
if (this.m_aPoint[r][1] + n - this.m_iDriftStartY > e.m_iCanvasHeight || this.m_aPoint[r][1] + n - this.m_iDriftStartY < 0) {
this.m_iDriftStartX = t;
this.m_iDriftStartY = n;
return } } for (r = 0;
r < i;
r++) {
this.m_aPoint[r][1] = this.m_aPoint[r][1] + n - this.m_iDriftStartY } } this.m_iDriftStartX = t;
this.m_iDriftStartY = n;
this.setEdgePoints(this.m_aPoint);
y() } }, {
key: "stretch", value: function f() {} }]);
return s }(_);
var b = function (t) {
o(s, t);
function s() {
a(this, s);
var e = r(this, (s.__proto__ || Object.getPrototypeOf(s)).call(this));
e.m_szType = "Grid";
e.m_iGridColNum = 22;
e.m_iGridRowNum = 18;
e.m_szGridMap = "";
e.m_aAddGridMap = [];
return e } i(s, [{
key: "draw", value: function u() {
var t = e.m_iCanvasWidth / this.m_iGridColNum;
var i = e.m_iCanvasHeight / this.m_iGridRowNum;
var r = "";
for (var o = 0;
o < this.m_iGridRowNum;
o++) {
var a = this.m_szGridMap.substring(o * 6, o * 6 + 6);
var s = parseInt("f" + a, 16).toString(2).split("").slice(4);
var u = "";
for (var l = 0;
l < this.m_iGridColNum;
l++) {
var f = "";
if (s[l] === "1") {
e[n].strokeStyle = this.m_szDrawColor;
e[n].globalAlpha = 1;
e[n].strokeRect(t * l, i * o, t, i);
f = "1" } else {
f = "0" } if (this.m_aAddGridMap.length) {
if (this.m_aAddGridMap[o][l] === 1) {
e[n].strokeStyle = this.m_szDrawColor;
e[n].strokeRect(t * l, i * o, t, i);
f = "1" } } u += f } r += parseInt("1111" + u + "00", 2).toString(16).substring(1) } this.m_szGridMap = r } }, {
key: "move", value: function l(t, n, i, r) {
var o = e.m_iCanvasWidth / this.m_iGridColNum;
var a = e.m_iCanvasHeight / this.m_iGridRowNum;
var s = Math.floor(t / o);
var u = Math.floor(n / a);
var l = Math.floor(Math.abs(i - t) / o);
var f = Math.floor(Math.abs(r - n) / a);
var c = 1;
var h = 1;
if (i - t > 0) {
c = 1 } else {
c = -1 } if (r - n > 0) {
h = 1 } else {
h = -1 }
var d = [];
for (var v = 0;
v < this.m_iGridRowNum;
v++) {
d[v] = [];
for (var p = 0;
p < this.m_iGridColNum;
p++) {
if (c === 1) {
if (h === 1) {
if (v >= u && v <= u + f && p >= s && p <= s + l) {
d[v][p] = 1 } else {
d[v][p] = 0 } } else {
if (v <= u && v >= u - f && p >= s && p <= s + l) {
d[v][p] = 1 } else {
d[v][p] = 0 } } } else {
if (h === 1) {
if (v >= u && v <= u + f && p <= s && p >= s - l) {
d[v][p] = 1 } else {
d[v][p] = 0 } } else {
if (v <= u && v >= u - f && p <= s && p >= s - l) {
d[v][p] = 1 } else {
d[v][p] = 0 } } } } } this.m_aAddGridMap = d;
this.draw() } }]);
return s }(_);
var k = function (t) {
o(s, t);
function s() {
a(this, s);
var e = r(this, (s.__proto__ || Object.getPrototypeOf(s)).call(this));
e.m_szType = "Line";
e.m_iLineType = 0;
e.m_iDirection = 0;
e.m_iArrowType = 0;
e.m_aCrossArrowPoint = [];
return e } i(s, [{
key: "draw", value: function u() {
if (this.m_iLineType === 0) {
this.drawNormalLine() } else if (this.m_iLineType === 1) {
this.drawArrowLine() } else if (this.m_iLineType === 3) {
this.drawCrossLine() } else if (this.m_iLineType === 4) {
this.drawLineCount() } } }, {
key: "drawNormalLine", value: function l() {
e[n].globalAlpha = 1;
if (this.m_aPoint.length > 0) {
e[n].beginPath();
e[n].strokeStyle = this.m_szDrawColor;
e[n].lineWidth = 2;
e[n].moveTo(this.m_aPoint[0][0], this.m_aPoint[0][1]);
for (var t = 1, i = this.m_aPoint.length;
t < i;
t++) {
e[n].lineTo(this.m_aPoint[t][0], this.m_aPoint[t][1]) } e[n].stroke();
if (this.m_bChoosed) {
for (var r = 0, o = this.m_aPoint.length;
r < o;
r++) {
e[n].beginPath();
e[n].fillStyle = this.m_szDrawColor;
e[n].arc(this.m_aPoint[r][0], this.m_aPoint[r][1], 3, 0, Math.PI * 2, true);
e[n].closePath();
e[n].fill() } } if (this.m_szTips !== "") {
e[n].strokeStyle = this.m_szDrawColor;
e[n].fillStyle = this.m_szDrawColor;
e[n].fillText(this.m_szTips, this.m_aPoint[0][0] + 10, this.m_aPoint[0][1] + 4) } } } }, {
key: "drawArrowLine", value: function f(t, i, r, o, a, s, u, l) {
s = typeof s !== "undefined" ? s : 30;
u = typeof u !== "undefined" ? u : 10;
l = typeof l !== "undefined" ? l : 1;
var f = Math.atan2(r - a, i - o) * 180 / Math.PI;
var c = (f + s) * Math.PI / 180;
var h = (f - s) * Math.PI / 180;
var d = u * Math.cos(c);
var v = u * Math.sin(c);
var p = u * Math.cos(h);
var m = u * Math.sin(h);
e[n].save();
e[n].beginPath();
var y = i - d;
var S = r - v;
e[n].moveTo(y, S);
e[n].lineTo(i, r);
y = i - p;
S = r - m;
e[n].lineTo(y, S);
e[n].moveTo(i, r);
e[n].lineTo(o, a);
if (t === 1) {
y = o + d;
S = a + v;
e[n].moveTo(y, S);
e[n].lineTo(o, a);
y = o + p;
S = a + m;
e[n].lineTo(y, S) } e[n].strokeStyle = this.m_szDrawColor;
e[n].lineWidth = l;
e[n].stroke();
e[n].restore() } }, {
key: "drawCrossLine", value: function c() {
this.drawNormalLine();
var t = (this.m_aPoint[0][0] + this.m_aPoint[1][0]) / 2;
var i = (this.m_aPoint[0][1] + this.m_aPoint[1][1]) / 2;
var r = Math.atan2(i - this.m_aPoint[0][1], t - this.m_aPoint[0][0]) * 180 / Math.PI;
var o = (r + 90) * Math.PI / 180;
var a = (r - 90) * Math.PI / 180;
var s = 25 * Math.cos(o);
var u = 25 * Math.sin(o);
var l = 25 * Math.cos(a);
var f = 25 * Math.sin(a);
var c = 0;
var h = 0;
c = t - s;
h = i - u;
var d = 0;
var v = 0;
if (this.m_iDirection === 0) {
d = -10;
v = -15 } else if (this.m_iDirection === 1) {
d = 10;
v = 10 } else {
d = 10;
v = -15 } if (this.m_iDirection !== 0) {
this.drawArrowLine(0, c, h, t, i) } e[n].strokeStyle = this.m_szDrawColor;
e[n].font = "8px";
e[n].strokeText("A", c + d, h + 4);
c = t - l;
h = i - f;
if (this.m_iDirection !== 1) {
this.drawArrowLine(0, c, h, t, i) } e[n].strokeStyle = this.m_szDrawColor;
e[n].font = "8px";
e[n].strokeText("B", c + v, h + 4) } }, {
key: "drawLineCount", value: function h() {
this.drawNormalLine();
var e = (this.m_aPoint[0][0] + this.m_aPoint[1][0]) / 2;
var t = (this.m_aPoint[0][1] + this.m_aPoint[1][1]) / 2;
var n = Math.atan2(t - this.m_aPoint[0][1], e - this.m_aPoint[0][0]) * 180 / Math.PI;
var i = (n + 90) * Math.PI / 180;
var r = (n - 90) * Math.PI / 180;
var o = 25 * Math.cos(i);
var a = 25 * Math.sin(i);
var s = 25 * Math.cos(r);
var u = 25 * Math.sin(r);
var l = 0;
var f = 0;
l = e - o;
f = t - a;
if (this.m_iArrowType === 1) {
l = e - s;
f = t - u;
this.drawArrowLine(0, l, f, e, t) } else if (this.m_iArrowType === 0) {
this.drawArrowLine(0, l, f, e, t) } this.m_aCrossArrowPoint = [[e, t], [l, f]] } }, {
key: "inShape", value: function d(e, t) {
var n = false;
for (var i = 0, r = this.m_aPoint.length - 1;
i < r;
i++) {
var o = Math.sqrt((this.m_aPoint[i + 1][0] - this.m_aPoint[i][0]) * (this.m_aPoint[i + 1][0] - this.m_aPoint[i][0]) + (this.m_aPoint[i + 1][1] - this.m_aPoint[i][1]) * (this.m_aPoint[i + 1][1] - this.m_aPoint[i][1]));
var a = Math.sqrt((e - this.m_aPoint[i][0]) * (e - this.m_aPoint[i][0]) + (t - this.m_aPoint[i][1]) * (t - this.m_aPoint[i][1]));
var s = Math.sqrt((e - this.m_aPoint[i + 1][0]) * (e - this.m_aPoint[i + 1][0]) + (t - this.m_aPoint[i + 1][1]) * (t - this.m_aPoint[i + 1][1]));
if (a + s - o < 1) {
n = true } }
return n } }]);
return s }(_);
var C = function (t) {
o(s, t);
function s() {
a(this, s);
var e = r(this, (s.__proto__ || Object.getPrototypeOf(s)).call(this));
e.m_szType = "Polygon";
e.m_iPolygonType = 1;
return e } i(s, [{
key: "setPointInfo", value: function u(e) {
if (e !== null && typeof e !== "undefined") {
if (this.m_iPolygonType === 0) {
var t = e[0][0];
var n = e[0][1];
var i = e[0][0];
var r = e[0][1];
for (var o = 0, a = e.length;
o < a;
o++) {
if (t > e[o][0]) {
t = e[o][0] } if (n > e[o][1]) {
n = e[o][1] } if (i < e[o][0]) {
i = e[o][0] } if (r < e[o][1]) {
r = e[o][1] } } this.m_aPoint = [[t, n], [i, n], [i, r], [t, r]] } else if (this.m_iPolygonType === 1) {
this.m_aPoint = e } else {
this.m_aPoint = e } this.setEdgePoints(e) } } }, {
key: "draw", value: function l() {
if (this.m_aPoint.length > 0) {
e[n].fillStyle = this.m_szFillColor;
e[n].strokeStyle = this.m_szDrawColor;
e[n].globalAlpha = 1;
var t = 0;
var i = 0;
if (this.m_bChoosed) {
for (t = 0, i = this.m_aPoint.length;
t < i;
t++) {
e[n].beginPath();
e[n].arc(this.m_aPoint[t][0], this.m_aPoint[t][1], 3, 0, 360, false);
e[n].fillStyle = this.m_szDrawColor;
e[n].closePath();
e[n].fill() } } e[n].beginPath();
e[n].moveTo(this.m_aPoint[0][0], this.m_aPoint[0][1]);
for (t = 0, i = this.m_aPoint.length;
t < i;
t++) {
if (t !== 0) {
e[n].lineTo(this.m_aPoint[t][0], this.m_aPoint[t][1]) } } e[n].stroke();
if (this.m_bClosed) {
e[n].fillText(this.m_szTips, (this.m_oEdgePoints.left.x + this.m_oEdgePoints.right.x) / 2, (this.m_oEdgePoints.top.y + this.m_oEdgePoints.bottom.y) / 2);
e[n].closePath();
e[n].stroke();
e[n].globalAlpha = this.m_iTranslucent;
e[n].fill() } } } }, {
key: "move", value: function f(t, i, r, o) {
if (this.m_iPolygonType === 1) {
if (this.m_aPoint.length < this.m_iMaxPointNum && this.m_aPoint.length > 0) {
e[n].fillStyle = this.m_szFillColor;
e[n].strokeStyle = this.m_szDrawColor;
e[n].globalAlpha = 1;
var a = 0;
var s = 0;
for (a = 0, s = this.m_aPoint.length;
a < s;
a++) {
e[n].beginPath();
e[n].arc(this.m_aPoint[a][0], this.m_aPoint[a][1], 3, 0, 360, false);
e[n].fillStyle = this.m_szDrawColor;
e[n].closePath();
e[n].fill() } e[n].beginPath();
e[n].moveTo(this.m_aPoint[0][0], this.m_aPoint[0][1]);
for (a = 0, s = this.m_aPoint.length;
a < s;
a++) {
if (a !== 0) {
e[n].lineTo(this.m_aPoint[a][0], this.m_aPoint[a][1]) } } e[n].lineTo(t, i);
e[n].closePath();
e[n].stroke() } } else if (this.m_iPolygonType === 0) {
this.m_bChoosed = true;
var u = r;
var l = o;
var f = t;
var c = i;
this.setPointInfo([[u, l], [f, l], [f, c], [u, c]]);
this.draw() } } }, {
key: "stretch", value: function c(e, t) {
if (this.m_iEditType === 0) {
if (this.m_iPolygonType === 1) {
if (this.m_iIndexChoosePoint !== -1) {
this.m_aPoint[this.m_iIndexChoosePoint][0] = e;
this.m_aPoint[this.m_iIndexChoosePoint][1] = t } } else {
if (this.m_iIndexChoosePoint === 0) {
if (e < this.m_aPoint[2][0] && t < this.m_aPoint[2][1]) {
this.m_aPoint[0][0] = e;
this.m_aPoint[0][1] = t;
this.m_aPoint[3][0] = e;
this.m_aPoint[1][1] = t } } else if (this.m_iIndexChoosePoint === 1) {
if (e > this.m_aPoint[3][0] && t < this.m_aPoint[3][1]) {
this.m_aPoint[1][0] = e;
this.m_aPoint[1][1] = t;
this.m_aPoint[2][0] = e;
this.m_aPoint[0][1] = t } } else if (this.m_iIndexChoosePoint === 2) {
if (e > this.m_aPoint[0][0] && t > this.m_aPoint[0][1]) {
this.m_aPoint[2][0] = e;
this.m_aPoint[2][1] = t;
this.m_aPoint[1][0] = e;
this.m_aPoint[3][1] = t } } else if (this.m_iIndexChoosePoint === 3) {
if (e < this.m_aPoint[1][0] && t > this.m_aPoint[1][1]) {
this.m_aPoint[3][0] = e;
this.m_aPoint[3][1] = t;
this.m_aPoint[0][0] = e;
this.m_aPoint[2][1] = t } } } this.setPointInfo(this.m_aPoint);
y() } } }]);
return s }(_);
var R = function (t) {
o(s, t);
function s() {
a(this, s);
var e = r(this, (s.__proto__ || Object.getPrototypeOf(s)).call(this));
e.m_szType = "Point";
e.m_szId = "";
return e } i(s, [{
key: "draw", value: function u() {
e[n].beginPath();
e[n].fillStyle = this.m_szDrawColor;
e[n].globalAlpha = 1;
e[n].arc(this.m_aPoint[0][0], this.m_aPoint[0][1], 10, 0, Math.PI * 2, true);
e[n].closePath();
e[n].fill() } }, {
key: "drag", value: function l() {} }, {
key: "stretch", value: function f() {} }]);
return s }(_);
var T = function () {
function r(i) {
a(this, r);
e = this;
this[t] = $("#" + i);
this[n] = this[t][0].getContext("2d");
this[s] = [];
this[u] = false;
this[l] = "";
this[f] = 10;
this[v] = true;
this[d] = {};
this[p] = null;
this[c] = {
szDrawColor: "#ff0000", szFillColor: "#343434", iTranslucent: .7 };
this[h] = false;
this.m_iCanvasWidth = this[t].width();
this.m_iCanvasHeight = this[t].height();
this.m_iHorizontalResolution = 0;
this.m_iVerticalResolution = 0;
this.m_szDisplayMode = "";
this.m_szVideoFormat = "";
g();
this[s].length = 0 } i(r, [{
key: "_getCanvasPoints", value: function o(e) {
var t = e.length;
var n = [];
for (var i = 0;
i < t;
i++) {
n.push([e[i][0] * this.m_iCanvasWidth, e[i][1] * this.m_iCanvasHeight]) }
return n } }, {
key: "_getNormalizedPoints", value: function _(e) {
var t = e.length;
var n = [];
for (var i = 0;
i < t;
i++) {
n.push([e[i][0] / this.m_iCanvasWidth, e[i][1] / this.m_iCanvasHeight]) }
return n } }, {
key: "setDrawMutiShapeOneTime", value: function T(e) {
this[v] = e } }, {
key: "setMaxShapeSupport", value: function I(e) {
this[f] = e } }, {
key: "getMaxShapeSupport", value: function x() {
return this[f] } }, {
key: "setDrawStatus", value: function D(e, t) {
this[u] = e;
if (t && e) {
this[p] = t } if (!e) {
this[p] = null } } }, {
key: "setShapeType", value: function z(e) {
this[l] = e;
y() } }, {
key: "setCurrentShapeInfo", value: function M(e) {
for (var t = 0, n = this[s].length;
t < n;
t++) {
if (this[s][t].m_szId === e.szId) {
this[s].splice(t, 1);
break } } y();
this[d] = e || {
szId: "", szTips: "", iMinClosed: 3, iMaxPointNum: 11, iPolygonType: 1, iRedrawMode: 0 } } }, {
key: "getShapeType", value: function E() {
return this[l] } }, {
key: "getAllShapesInfo", value: function O() {
var e = [];
for (var t = 0, n = this[s].length;
t < n;
t++) {
if (this[s][t].m_szType === "Grid") {
e.push({
szType: this[s][t].m_szType, szGridMap: this[s][t].m_szGridMap, iGridColNum: this[s][t].m_iGridColNum, iGridRowNum: this[s][t].m_iGridRowNum }) } else if (this[s][t].m_szType === "RectOSD") {
e.push({
szType: this[s][t].m_szType, szText: this[s][t].m_szText, szEnabled: this[s][t].m_szEnabled, szOSDType: this[s][t].m_szOSDType, iPositionX: this[s][t].m_aPoint[0][0] / this.m_iCanvasWidth, iPositionY: this[s][t].m_aPoint[0][1] / this.m_iCanvasHeight, szDateStyle: this[s][t].m_szDateStyle, szClockType: this[s][t].m_szClockType, szDisplayWeek: this[s][t].m_szDisplayWeek, szId: this[s][t].m_szId, szAlignment: this[s][t].m_szAlignment }) } else {
e.push({
szType: this[s][t].m_szType, aPoint: this._getNormalizedPoints(this[s][t].m_aPoint), szId: this[s][t].m_szId, bChoosed: this[s][t].m_bChoosed }) } }
return e } }, {
key: "deleteRepeatByIdAndType", value: function F(e, t) {
var n = this.getAllShapesInfo();
var i = n.length;
if (i > 0) {
for (var r = 0;
r < i;
r++) {
if (n[r].szType === t) {
if (Number(n[r].szId) === Number(e)) {
this.deleteShape(r) } } } } } }, {
key: "getShapesInfoByType", value: function q(e) {
var t = [];
for (var n = 0, i = this[s].length;
n < i;
n++) {
if (this[s][n].m_szType === e) {
if (this[s][n].m_szType === "Grid") {
t.push({
gridMap: this[s][n].m_szGridMap, gridColNum: this[s][n].m_iGridColNum, gridRowNum: this[s][n].m_iGridRowNum }) } else if (this[s][n].m_szType === "RectOSD") {
t.push({
szType: this[s][n].m_szType, szText: this[s][n].m_szText, szEnabled: this[s][n].m_szEnabled, szOSDType: this[s][n].m_szOSDType, iPositionX: this[s][n].m_aPoint[0][0] / this.m_iCanvasWidth, iPositionY: this[s][n].m_aPoint[0][1] / this.m_iCanvasHeight, szDateStyle: this[s][n].m_szDateStyle, szClockType: this[s][n].m_szClockType, szDisplayWeek: this[s][n].m_szDisplayWeek, szId: this[s][n].m_szId, szAlignment: this[s][n].m_szAlignment }) } else if (e === "Polygon") {
t.push({
id: this[s][n].m_szId, points: this._getNormalizedPoints(this[s][n].m_aPoint), closed: this[s][n].m_bClosed, tips: this[s][n].m_szTips, drawColor: this[s][n].m_szDrawColor }) } else if (e === "Line") {
var r = {
id: this[s][n].m_szId, points: this._getNormalizedPoints(this[s][n].m_aPoint), tips: this[s][n].m_szTips, lineType: this[s][n].m_iLineType, direction: this[s][n].m_iDirection };
if (r.lineType === 1 || r.lineType === 4) {
r.direction = this[s][n].m_iArrowType } if (r.lineType === 4) {
r.pdcArrow = this._getNormalizedPoints(this[s][n].m_aCrossArrowPoint) } t.push(r) } else if (e === "Rect") {
t.push({
id: this[s][n].m_szId, points: this._getNormalizedPoints(this[s][n].m_aPoint), tips: this[s][n].m_szTips }) } else {
t.push({
points: this._getNormalizedPoints(this[s][n].m_aPoint) }) } } }
return t } }, {
key: "setShapesInfoByType", value: function J(e, t) {
if (!t) {
t = [] }
var n = null;
if (e === "Rect" || e === "Polygon" || e === "Line" || e === "Point") {
for (var i = 0, r = t.length;
i < r;
i++) {
if (e === "Rect") {
if ("" !== t[i].id) {
this.deleteRepeatByIdAndType(t[i].id, "Rect") } n = new P;
n.m_szId = t[i].id;
n.m_iEditType = t[i].editType;
n.m_szTips = t[i].tips;
n.m_szDrawColor = t[i].drawColor;
n.m_szFillColor = t[i].fillColor || t[i].drawColor;
n.m_iTranslucent = t[i].translucent;
n.m_iRedrawMode = t[i].redrawMode } else if (e === "Polygon") {
if ("" !== t[i].id) {
this.deleteRepeatByIdAndType(t[i].id, "Polygon") } n = new C;
n.m_bClosed = t[i].closed;
n.m_szTips = t[i].tips;
n.m_szId = t[i].id || "";
n.m_iMinClosed = t[i].minPointSupport || 3;
n.m_iMaxPointNum = t[i].maxPointSupport || 11;
n.m_iEditType = t[i].editType;
n.m_szDrawColor = t[i].drawColor;
n.m_szFillColor = t[i].fillColor || t[i].drawColor;
n.m_iTranslucent = t[i].translucent;
n.m_iRedrawMode = t[i].redrawMode } else if (e === "Line") {
if ("" !== t[i].id) {
this.deleteRepeatByIdAndType(t[i].id, "Line") } n = new k;
n.m_iLineType = t[i].lineType;
n.m_szTips = t[i].tips;
n.m_szId = t[i].id;
n.m_iDirection = parseInt(t[i].direction, 10);
if (t[i].lineType === 1 || t[i].lineType === 4) {
n.m_iArrowType = parseInt(t[i].direction, 10) } n.m_szDrawColor = t[i].drawColor } else if (e === "Point") {
if ("" !== t[i].id) {
this.deleteRepeatByIdAndType(t[i].id, "Point") } n = new R;
n.m_szId = t[i].id;
n.m_szDrawColor = t[i].drawColor } n.setPointInfo(this._getCanvasPoints(t[i].points));
if (i === 0) {
n.m_bChoosed = true } S(n) } } else if (e === "Grid") {
n = new b;
n.m_szGridMap = t[0].gridMap || "";
n.m_iGridColNum = t[0].gridColNum || 22;
n.m_iGridRowNum = t[0].gridRowNum || 18;
S(n) } y() } }, {
key: "addOSDShape", value: function W(e, t, n, i, r) {
var o = n * this.m_iCanvasWidth;
var a = i * this.m_iCanvasHeight;
if (!o && !a) {
o = 0;
a = 0 } if (!r) {
r = {} }
var s = new w(e, t);
var u = e.length * 10;
s.m_szOSDType = r.szOSDType || "";
s.m_szDateStyle = r.szDateStyle || "";
s.m_szClockType = r.szClockType || "";
s.m_szDisplayWeek = r.szDisplayWeek || "";
s.m_szId = r.szId || "";
s.m_szAlignment = "" + r.szAlignment || "0";
if ("0" === s.m_szAlignment) {
s.m_aPoint = [[o, a], [u + o, a], [u + o, a + 20], [o, a + 20]] } else if ("1" === s.m_szAlignment) {
s.m_aPoint = [[0, a], [u, a], [u, a + 20], [0, a + 20]] } else if ("2" === s.m_szAlignment) {
s.m_aPoint = [[this.m_iCanvasWidth - u, a], [this.m_iCanvasWidth, a], [this.m_iCanvasWidth, a + 20], [this.m_iCanvasWidth - u, a + 20]] } else {
s.m_aPoint = [[o, a], [u + o, a], [u + o, a + 20], [o, a + 20]] } S(s);
y() } }, {
key: "selectShapeById", value: function L(t, n) {
for (var i = 0, r = e[s].length;
i < r;
i++) {
if (t === e[s][i].m_szType) {
if (n === e[s][i].m_szId + "") {
e[s][i].m_bChoosed = true } else {
e[s][i].m_bChoosed = false } } } y() } }, {
key: "setCanvasSize", value: function A(e, t) {
if (e > 0 && t > 0) {
this.m_iCanvasWidth = e;
this.m_iCanvasHeight = t;
y() } } }, {
key: "setDrawStyle", value: function B(e, t, n) {
this[c] = {
szDrawColor: e, szFillColor: t, iTranslucent: n } } }, {
key: "clearAllShape", value: function U() {
this[s].length = 0;
e[h] = false;
y() } }, {
key: "clearShapeByType", value: function H(t) {
var n = this[s].length;
for (var i = n;
i > 0;
i--) {
if (this[s][i - 1].m_szType === t) {
if (t === "Grid") {
this[s][i - 1].m_szGridMap = "";
this[s][i - 1].m_aAddGridMap = [] } else {
this[s].splice(i - 1, 1) } } } if ("Polygon" === t) {
e[h] = false } if (t === "All") {
this[s].length = 0 } y() } }, {
key: "deleteChoosedShape", value: function N() {
var e = this.getAllShapesInfo();
var t = e.length;
if (t > 0) {
for (var n = 0;
n < t;
n++) {
if (e[n].bChoosed) {
this.deleteShape(n);
return +e[n].szId } }
return -1 }
return -1 } }, {
key: "deleteShape", value: function G(e) {
if (this[s].length > e) {
this[s].splice(e, 1) } y() } }, {
key: "updateCanvas", value: function j(e) {
this[t] = $("#" + e);
this[n] = this[t][0].getContext("2d");
this.m_iCanvasWidth = this[t].width();
this.m_iCanvasHeight = this[t].height();
g() } }, {
key: "resizeCanvas", value: function V() {
this.m_iCanvasWidth = this[t].width();
this.m_iCanvasHeight = this[t].height() } }, {
key: "canvasRedraw", value: function X() {
y() } }, {
key: "setDrawEventCallback", value: function Y(e) {
this[m] = e } }]);
return r }();
return T }();
t.ESCanvas = s }, function (e, t, n) {
"use strict";
Object.defineProperty(t, "__esModule", {
value: true });
t.LocalServiceControl = undefined;
var i = function () {
function e(e, t) {
for (var n = 0;
n < t.length;
n++) {
var i = t[n];
i.enumerable = i.enumerable || false;
i.configurable = true;
if ("value" in i) i.writable = true;
Object.defineProperty(e, i.key, i) } }
return function (t, n, i) {
if (n) e(t.prototype, n);
if (i) e(t, i);
return t } }();
var r = n(29);
var o = n(2);
function a(e, t) {
if (!(e instanceof t)) {
throw new TypeError("Cannot call a class as a function") } }
var s = function () {
var e = function () {
function e(t) {
a(this, e);
var n = this;
var i = {
szPluginContainer: "", cbConnectSuccess: null, cbConnectError: null, cbConnectClose: null };
this.oOptions = $.extend(i, t);
if (this.oOptions.szIframeId && $("#" + this.oOptions.szIframeId).length) {
this.oOptions.oPluginContainer = $("#" + this.oOptions.szPluginContainer, $("#" + this.oOptions.szIframeId)[0].contentWindow.document) } else {
this.oOptions.oPluginContainer = $("#" + this.oOptions.szPluginContainer) } this.bFreeze = false;
this.bFocus = true;
this.bEmbed = o.oUtils.getCreateWndMode();
this.szWndId = "";
this.iCreateWndTimer = -1;
this.iUpdateParentWndTimer = -1;
this.bDevTool = false;
this.iVCTimeStart = -1;
this.iVCTimeEnd = -1;
this.oWndCover = {
left: 0, top: 0, right: 0, bottom: 0 };
this.bLocalServiceRunning = false;
this.fCurrentCallback = null;
this.afCurrentCallback = [];
this.iProtocolType = 0;
this.fVisibilityChange = function () {
if (document.hidden) {
n.iVCTimeStart = (new Date).getTime();
n.fHideWnd() } else {
n.iVCTimeEnd = (new Date).getTime();
var e = o.oUtils.browser();
if (e.chrome || e.mozilla) {
if (n.iUpdateParentWndTimer > 0) {
clearTimeout(n.iUpdateParentWndTimer);
n.iUpdateParentWndTimer = -1 } if (n.iVCTimeEnd - n.iVCTimeStart < 100) {
n.iUpdateParentWndTimer = setTimeout(function () {
n.oRequest.updateParentWnd().then(function () {
if (!n.bFreeze && !n.bDevTool) {
n.fShowWnd() } }, function () {}) }, 100) } else {
if (!n.bFreeze && !n.bDevTool) {
n.fShowWnd() } } } else {
if (!n.bFreeze && !n.bDevTool) {
n.fShowWnd() } } } };
this.fHideWnd = function () {
this.oRequest.hideWnd() };
this.fShowWnd = function () {
this.oRequest.showWnd() };
this.fUnload = function () {
$(window).off("unload", this.fUnload);
this.JS_Disconnect() };
this.fFocus = function () {
n.bFocus = true;
setTimeout(function () {
if (!document.hidden && !n.bFreeze && !n.bDevTool) {
n.fShowWnd() } }, 200) };
this.fBlur = function () {
this.bFocus = false };
this.oRequest = new r.Request({
szPluginContainer: this.oOptions.szPluginContainer, cbConnectSuccess: this.oOptions.cbConnectSuccess, cbConnectError: this.oOptions.cbConnectError, cbConnectClose: function s(e) {
if (n.iCreateWndTimer > 0) {
clearTimeout(n.iCreateWndTimer);
n.iCreateWndTimer = -1 } if (n.oOptions.cbConnectClose) {
n.oOptions.cbConnectClose(e) } }, oSessionInfo: this.oOptions.oSessionInfo, bNoDetectPort: this.oOptions.bNoDetectPort, bUseInQT: this.oOptions.bUseInQT });
if (this.oRequest !== null) {
$(window).on("unload", this.fUnload) } } i(e, [{
key: "JS_Disconnect", value: function t() {
this.oRequest.disconnect() } }, {
key: "JS_CreateWnd", value: function n(e, t, i) {
var r = this;
this.szWndId = e;
var a = new Promise(function (n, a) {
var s = null;
if (r.oOptions.szIframeId && $("#" + r.oOptions.szIframeId).length) {
s = $("#" + e, $("#" + r.oOptions.szIframeId)[0].contentWindow.document) } else {
s = $("#" + e) } if (s.length > 0) {
var u = o.oUtils.getWndPostion(s, r.bEmbed, r.oOptions.szIframeId);
var l = r.oOptions.szIframeId ? $("#" + r.oOptions.szIframeId)[0].contentWindow : window.top;
var f = l.document.title;
l.document.title = r.oRequest.getRequestUUID();
r.iCreateWndTimer = setTimeout(function () {
var e = "";
if (o.oUtils.browser().msie) {
e = "IEFrame" } else if (o.oUtils.browser().chrome) {
e = "Chrome" } if (!r.bDevTool) {
var s = o.oUtils.getDevicePixelRatio();
t = Math.round(t * s);
i = Math.round(i * s);
r.oRequest.destroyWnd().then(function () {
r.oRequest.createWnd(u.left, u.top, t, i, e, r.bEmbed).then(function () {
l.document.title = f;
n() }, function (e) {
l.document.title = f;
if (5001 === e.errorCode) {
if (!document.hidden && !r.bFreeze && r.bFocus) {
r.fShowWnd() } n() } else {
a(e) } }) }, function () {
r.oRequest.createWnd(u.left, u.top, t, i, e, r.bEmbed).then(function () {
l.document.title = f;
n() }, function (e) {
l.document.title = f;
if (5001 === e.errorCode) {
if (!document.hidden && !r.bFreeze && r.bFocus) {
r.fShowWnd() } n() } else {
a(e) } }) }) } }, 300);
document.addEventListener("visibilitychange", r.fVisibilityChange, false);
$(window).on("focus", r.fFocus);
$(window).on("blur", r.fBlur) } else {
a() } });
return a } }, {
key: "JS_CheckLocalServiceConnected", value: function s(e) {
var t = new Promise(function (t, n) {
r.Request.checkLocalServiceConnected(e).then(function () {
t() }, function () {
n() }) });
return t } }, {
key: "JS_ShowWnd", value: function u() {
var e = this;
var t = new Promise(function (t, n) {
if (!e.bLocalServiceRunning) {
n();
return } e.bFreeze = false;
if (!document.hidden && !e.bDevTool) {
e.fShowWnd() } t() });
return t } }, {
key: "JS_HideWnd", value: function l() {
var e = this;
var t = new Promise(function (t, n) {
if (!e.bLocalServiceRunning) {
n();
return } e.bFreeze = true;
e.fHideWnd();
t() });
return t } }, {
key: "JS_SetWndCover", value: function f(e, t) {
var n = this;
var i = new Promise(function (i, r) {
if (!n.bLocalServiceRunning) {
r();
return }
var a = o.oUtils.getDevicePixelRatio();
if (!o.oUtils.browser().msie) {
if ("left" === e) {
n.oWndCover.left = t } else if ("top" === e) {
n.oWndCover.top = t } else if ("right" === e) {
n.oWndCover.right = t } else if ("bottom" === e) {
n.oWndCover.bottom = t } } t = Math.round(t * a);
n.oRequest.setWndCover(e, t).then(function () {
i() }, function () {
r() }) });
return i } }, {
key: "JS_SetWindowControlCallback", value: function c(e) {
var t = this;
var n = {
onGetSelectWndInfo: function i(n) {
if (0 <= n.wndInfo.wndIndex) {
t.fCurrentCallback = t.afCurrentCallback[n.wndInfo.wndIndex] } if (e.onGetSelectWndInfo) {
e.onGetSelectWndInfo(parseInt(n.wndInfo.wndIndex, 10)) } }, onPluginEventHandler: function r(t) {
if (e.onPluginEventHandler) {
e.onPluginEventHandler(parseInt(t.wndIndex, 10), parseInt(t.eventType, 10)) } }, onDrawCallback: function o(e) {
if (t.fCurrentCallback) {
t.fCurrentCallback(e.shapeInfo) } }, onDrawEvent: function a(t) {
if (e.onDrawEvent) {
e.onDrawEvent(t) } }, onFisheyePTZInfo: function s(t) {
if (e.onFisheyePTZInfo) {
e.onFisheyePTZInfo(t.fishEyePTZInfo) } }, onFullScreenChange: function u(t) {
if (e.onFullScreenChange) {
e.onFullScreenChange(t.full) } }, onMouseEvent: function l(t) {
if (e.onMouseEvent) {
e.onMouseEvent(t.mouseInfo) } } };
this.oRequest.setWindowControlCallback(n) } }, {
key: "JS_ArrangeWindow", value: function h(e, t) {
var n = this;
var i = new Promise(function (i, r) {
if (!n.bLocalServiceRunning) {
r();
return } n.oRequest.arrangeWindow(e, t).then(function () {
i() }, function () {
r() }) });
return i } }, {
key: "JS_SetSecretKey", value: function d(e, t, n) {
var i = this;
var r = new Promise(function (e, r) {
if (!i.bLocalServiceRunning) {
r();
return } i.oRequest.setSecretKey(t, n).then(function () {
e() }, function (e) {
r(e.errorCode) }) });
return r } }, {
key: "JS_SetOriginalString", value: function v(e, t) {
var n = this;
var i = new Promise(function (i, r) {
if (!n.bLocalServiceRunning) {
r();
return } n.oRequest.setOriginalString(e, t).then(function () {
i() }, function (e) {
r(e.errorCode) }) });
return i } }, {
key: "JS_GetEncryptString", value: function p(e, t, n) {
var i = this;
var r = new Promise(function (r, o) {
if (!i.bLocalServiceRunning) {
o();
return } i.oRequest.getEncryptString(e, t, n).then(function (e) {
r(e.encryptString) }, function (e) {
o(e.errorCode) }) });
return r } }, {
key: "JS_GetDecryptString", value: function m(e, t, n) {
var i = this;
var r = new Promise(function (r, o) {
if (!i.bLocalServiceRunning) {
o();
return } i.oRequest.getDecryptString(e, t, n).then(function (e) {
r(e.decryptString) }, function (e) {
o(e.errorCode) }) });
return r } }, {
key: "JS_DestroyPlugin", value: function y(e) {
var t = this;
var n = new Promise(function (n, i) {
if (!t.bLocalServiceRunning) {
i();
return } t.oRequest.destroyWnd().then(function () {
if (e) {
t.JS_Disconnect() } n() }, function () {
i() }) });
return n } }, {
key: "JS_Play", value: function S(e, t, n, i, r) {
var o = this;
var a = new Promise(function (a, s) {
if (!o.bLocalServiceRunning) {
s();
return } o.oRequest.startPlay(e, t, n, i, r).then(function () {
a() }, function (e) {
s(e.errorCode) }) });
return a } }, {
key: "JS_ReversePlay", value: function g(e, t, n, i, r) {
var o = this;
var a = new Promise(function (a, s) {
if (!o.bLocalServiceRunning) {
s();
return } o.oRequest.reversePlay(e, t, n, i, r).then(function () {
a() }, function (e) {
s(e.errorCode) }) });
return a } }, {
key: "JS_Stop", value: function _(e) {
var t = this;
var n = new Promise(function (n, i) {
if (!t.bLocalServiceRunning) {
i();
return } t.oRequest.stop(e).then(function () {
n() }, function (e) {
i(e.errorCode) }) });
return n } }, {
key: "JS_Seek", value: function P() {
var e = new Promise(function (e) {
e() });
return e } }, {
key: "JS_StopRealPlayAll", value: function w() {
var e = this;
var t = new Promise(function (t, n) {
if (!e.bLocalServiceRunning) {
n();
return } e.oRequest.stopAll().then(function () {
t() }, function (e) {
n(e.errorCode) }) });
return t } }, {
key: "JS_Pause", value: function b(e) {
var t = this;
var n = new Promise(function (n, i) {
if (!t.bLocalServiceRunning) {
i();
return } t.oRequest.pause(e).then(function () {
n() }, function (e) {
i(e.errorCode) }) });
return n } }, {
key: "JS_Resume", value: function k(e) {
var t = this;
var n = new Promise(function (n, i) {
if (!t.bLocalServiceRunning) {
i();
return } t.oRequest.resume(e).then(function () {
n() }, function (e) {
i(e.errorCode) }) });
return n } }, {
key: "JS_Slow", value: function C(e) {
var t = this;
var n = new Promise(function (n, i) {
if (!t.bLocalServiceRunning) {
i();
return } t.oRequest.slow(e).then(function () {
n() }, function (e) {
i(e.errorCode) }) });
return n } }, {
key: "JS_Fast", value: function R(e) {
var t = this;
var n = new Promise(function (n, i) {
if (!t.bLocalServiceRunning) {
i();
return } t.oRequest.fast(e).then(function () {
n() }, function (e) {
i(e.errorCode) }) });
return n } }, {
key: "JS_Transmission", value: function T() {
var e = new Promise(function (e) {
e() });
return e } }, {
key: "JS_FrameForward", value: function I(e) {
var t = this;
var n = new Promise(function (n, i) {
if (!t.bLocalServiceRunning) {
i();
return } t.oRequest.frame(e).then(function () {
n() }, function (e) {
i(e.errorCode) }) });
return n } }, {
key: "JS_GetOSDTime", value: function x(e) {
var t = this;
var n = new Promise(function (n, i) {
if (!t.bLocalServiceRunning) {
i();
return } t.oRequest.getOSDTime(e).then(function (e) {
n(e.osdTime) }, function (e) {
i(e.errorCode) }) });
return n } }, {
key: "JS_GetPlayInfo", value: function D(e) {
var t = this;
var n = new Promise(function (n, i) {
if (!t.bLocalServiceRunning) {
i();
return } t.oRequest.getPlayInfo(e).then(function (e) {
n(e.playInfo) }, function (e) {
i(e.errorCode) }) });
return n } }, {
key: "JS_OpenSound", value: function z(e) {
var t = this;
var n = new Promise(function (n, i) {
if (!t.bLocalServiceRunning) {
i();
return } t.oRequest.openSound(e).then(function () {
n() }, function (e) {
i(e.errorCode) }) });
return n } }, {
key: "JS_CloseSound", value: function M() {
var e = this;
var t = new Promise(function (t, n) {
if (!e.bLocalServiceRunning) {
n();
return } e.oRequest.closeSound().then(function () {
t() }, function (e) {
n(e.errorCode) }) });
return t } }, {
key: "JS_GetVolume", value: function E(e) {
var t = this;
var n = new Promise(function (n, i) {
if (!t.bLocalServiceRunning) {
i();
return } t.oRequest.getVolume(e).then(function (e) {
n(e.volume) }, function (e) {
i(e.errorCode) }) });
return n } }, {
key: "JS_SetVolume", value: function O(e, t) {
var n = this;
var i = new Promise(function (i, r) {
if (!n.bLocalServiceRunning) {
r();
return } n.oRequest.setVolume(e, t).then(function () {
i() }, function (e) {
r(e.errorCode) }) });
return i } }, {
key: "JS_EnableZoom", value: function F(e, t) {
var n = this;
var i = new Promise(function (i, r) {
if (!n.bLocalServiceRunning) {
r();
return } n.oRequest.enableZoom(e, t).then(function () {
i() }, function (e) {
r(e.errorCode) }) });
return i } }, {
key: "JS_DisableZoom", value: function q(e) {
var t = this;
var n = new Promise(function (n, i) {
if (!t.bLocalServiceRunning) {
i();
return } t.oRequest.disableZoom(e).then(function () {
n() }, function (e) {
i(e.errorCode) }) });
return n } }, {
key: "JS_CapturePicture", value: function J(e, t) {
var n = this;
var i = new Promise(function (i, r) {
if (!n.bLocalServiceRunning) {
r();
return } n.oRequest.capture(e, t).then(function () {
i() }, function (e) {
r(e.errorCode) }) });
return i } }, {
key: "JS_StartSave", value: function W(e, t) {
var n = this;
var i = new Promise(function (i, r) {
if (!n.bLocalServiceRunning) {
r();
return } n.oRequest.startSave(e, t).then(function () {
i() }, function (e) {
r(e.errorCode) }) });
return i } }, {
key: "JS_StopSave", value: function L(e) {
var t = this;
var n = new Promise(function (n, i) {
if (!t.bLocalServiceRunning) {
i();
return } t.oRequest.stopSave(e).then(function () {
n() }, function (e) {
i(e.errorCode) }) });
return n } }, {
key: "JS_StartTalk", value: function A(e, t, n, i, r, o, a, s, u) {
var l = this;
var f = new Promise(function (f, c) {
if (!l.bLocalServiceRunning) {
c();
return } l.oRequest.startTalk(e, t, n, i, r, o, a, s, u).then(function () {
f() }, function (e) {
c(e.errorCode) }) });
return f } }, {
key: "JS_StopTalk", value: function B() {
var e = this;
var t = new Promise(function (t, n) {
if (!e.bLocalServiceRunning) {
n();
return } e.oRequest.stopTalk().then(function () {
t() }, function (e) {
n(e.errorCode) }) });
return t } }, {
key: "JS_SetPlayMode", value: function U() {
var e = new Promise(function (e) {
e() });
return e } }, {
key: "JS_SetFullScreenCapability", value: function H(e) {
var t = this;
var n = new Promise(function (n, i) {
if (!t.bLocalServiceRunning) {
i();
return } t.oRequest.setFullScreenCapability(e).then(function () {
n() }, function (e) {
i(e.errorCode) }) });
return n } }, {
key: "JS_FullScreenDisplay", value: function N(e) {
var t = this;
var n = new Promise(function (n, i) {
if (!t.bLocalServiceRunning) {
i();
return } t.oRequest.fullScreen(e).then(function () {
n() }, function (e) {
i(e.errorCode) }) });
return n } }, {
key: "JS_EnableIVS", value: function G(e, t, n) {
var i = this;
var r = new Promise(function (r, o) {
if (!i.bLocalServiceRunning) {
o();
return } i.oRequest.enableIVS(e, t, n).then(function () {
r() }, function (e) {
o(e.errorCode) }) });
return r } }, {
key: "JS_SRInit", value: function j(e, t) {
var n = this;
var i = new Promise(function (i, r) {
if (!n.bLocalServiceRunning) {
r();
return } n.oRequest.SRInit(e, t).then(function () {
i() }, function (e) {
r(e.errorCode) }) });
return i } }, {
key: "JS_SRPTZ", value: function V(e, t, n) {
var i = this;
var r = new Promise(function (r, o) {
if (!i.bLocalServiceRunning) {
o();
return } i.oRequest.SRPTZ(e, t, n).then(function () {
r() }, function (e) {
o(e.errorCode) }) });
return r } }, {
key: "JS_SetPlaybackDrawType", value: function X(e, t) {
var n = this;
var i = new Promise(function (i, r) {
if (!n.bLocalServiceRunning) {
r();
return } n.oRequest.setPlaybackDrawType(e, t).then(function () {
i() }, function (e) {
r(e.errorCode) }) });
return i } }, {
key: "JS_SetPlayBackType", value: function Y(e) {
var t = this;
var n = new Promise(function (n, i) {
if (!t.bLocalServiceRunning) {
i();
return } t.oRequest.setPlayBackType(e).then(function () {
n() }, function (e) {
i(e.errorCode) }) });
return n } }, {
key: "JS_SetTrsPlayBackParam", value: function Z(e, t) {
var n = this;
var i = new Promise(function (i, r) {
if (!n.bLocalServiceRunning) {
r();
return } n.oRequest.setTrsPlayBackParam(e, t).then(function () {
i() }, function (e) {
r(e.errorCode) }) });
return i } }, {
key: "JS_GetLocalConfig", value: function K() {
var e = this;
var t = new Promise(function (t, n) {
if (!e.bLocalServiceRunning) {
n();
return } e.oRequest.getLocalConfig().then(function (n) {
t(n.localConfig);
e.iProtocolType = parseInt(n.localConfig.protocolType, 10) }, function (e) {
n(e && e.errorCode) }) });
return t } }, {
key: "JS_SetLocalConfig", value: function Q(e) {
var t = this;
var n = new Promise(function (n, i) {
if (!t.bLocalServiceRunning) {
i();
return } t.oRequest.setLocalConfig(e).then(function () {
t.iProtocolType = parseInt(e.protocolType, 10);
n() }, function (e) {
i(e.errorCode) }) });
return n } }, {
key: "JS_GetLastError", value: function ee() {
var e = this;
var t = new Promise(function (t, n) {
if (!e.bLocalServiceRunning) {
n();
return } e.oRequest.getLastError().then(function (e) {
t(e.lastError) }, function (e) {
n(e.errorCode) }) });
return t } }, {
key: "JS_OpenFileBrowser", value: function te(e, t) {
var n = this;
var i = new Promise(function (i, r) {
if (!n.bLocalServiceRunning) {
r();
return } n.oRequest.browseFilePath(e, t).then(function (e) {
i(e.filepath) }, function (e) {
r(e.errorCode) }) });
return i } }, {
key: "JS_OpenDirectory", value: function ne(e) {
var t = this;
var n = new Promise(function (n, i) {
if (!t.bLocalServiceRunning) {
i();
return } t.oRequest.openDirectory(e).then(function () {
n() }, function (e) {
i(e.errorCode) }) });
return n } }, {
key: "JS_StartAsynUpload", value: function ie(e, t, n, i) {
var r = this;
var o = new Promise(function (o, a) {
if (!r.bLocalServiceRunning) {
a();
return } r.oRequest.startAsynUpload(e, t, n, i).then(function () {
o() }, function (e) {
a(e.errorCode) }) });
return o } }, {
key: "JS_StopAsynUpload", value: function re() {
var e = this;
var t = new Promise(function (t, n) {
if (!e.bLocalServiceRunning) {
n();
return } e.oRequest.stopAsynUpload().then(function () {
t() }, function (e) {
n(e.errorCode) }) });
return t } }, {
key: "JS_GetUploadErrorInfo", value: function oe() {
var e = this;
var t = new Promise(function (t, n) {
if (!e.bLocalServiceRunning) {
n();
return } e.oRequest.getUploadErrorInfo().then(function (e) {
t(e.errorInfo) }, function (e) {
n(e.errorCode) }) });
return t } }, {
key: "JS_UploadFile", value: function ae(e, t, n, i) {
var r = this;
var a = new Promise(function (a, s) {
if (!r.bLocalServiceRunning) {
s();
return } r.oRequest.uploadFile(e, t, n, i).then(function () {
a() }, function (e) {
s({
readyState: 4, status: e.errorCode, responseXML: e.errorInfo ? o.oUtils.parseXmlFromStr(e.errorInfo) : null }) }) });
return a } }, {
key: "JS_GetIpcImportErrorInfo", value: function se() {
var e = this;
var t = new Promise(function (t, n) {
if (!e.bLocalServiceRunning) {
n();
return } e.oRequest.getIpcImportErrorInfo().then(function (e) {
t(e.errorInfo) }, function (e) {
n(e.errorCode) }) });
return t } }, {
key: "JS_DownloadFile", value: function ue(e, t, n, i, r, a) {
var s = this;
var u = new Promise(function (u, l) {
if (!s.bLocalServiceRunning) {
l();
return } s.oRequest.downloadFile(e, t, n, i, r, a).then(function (e) {
if (typeof e.ret === "undefined") {
u(0) } else {
u(e.ret) } }, function (e) {
l({
readyState: 4, status: e.errorCode, responseXML: e.errorInfo ? o.oUtils.parseXmlFromStr(e.errorInfo) : null }) }) });
return u } }, {
key: "JS_StartUpgrade", value: function le(e, t, n, i, r) {
var o = this;
var a = new Promise(function (a, s) {
if (!o.bLocalServiceRunning) {
s();
return } o.oRequest.startUpgrade(e, t, n, i, r).then(function () {
a() }, function (e) {
s(e.errorCode) }) });
return a } }, {
key: "JS_StopUpgrade", value: function fe() {
var e = this;
var t = new Promise(function (t, n) {
if (!e.bLocalServiceRunning) {
n();
return } e.oRequest.stopUpgrade().then(function () {
t() }, function (e) {
n(e.errorCode) }) });
return t } }, {
key: "JS_GetUpgradeStatus", value: function ce() {
var e = this;
var t = new Promise(function (t, n) {
if (!e.bLocalServiceRunning) {
n();
return } e.oRequest.getUpgradeStatus().then(function (e) {
t(e.upgradeStatus) }, function (e) {
n(e.errorCode) }) });
return t } }, {
key: "JS_GetUpgradeProgress", value: function he() {
var e = this;
var t = new Promise(function (t, n) {
if (!e.bLocalServiceRunning) {
n();
return } e.oRequest.getUpgradeProgress().then(function (e) {
t(e.upgradeProgress) }, function (e) {
n(e.errorCode) }) });
return t } }, {
key: "JS_ExportDeviceLog", value: function de(e, t, n) {
var i = this;
var r = new Promise(function (r, o) {
if (!i.bLocalServiceRunning) {
o();
return } i.oRequest.exportDeviceLog(e, t, n).then(function (e) {
if (typeof e.ret === "undefined") {
r(0) } else {
r(e.ret) } }, function (e) {
o(e.errorCode) }) });
return r } }, {
key: "JS_ExportReport", value: function ve(e, t, n) {
var i = this;
var r = new Promise(function (r, o) {
if (!i.bLocalServiceRunning) {
o();
return } i.oRequest.exportReport(e, t, n).then(function (e) {
if (typeof e.ret === "undefined") {
r(0) } else {
r(e.ret) } }, function (e) {
o(e.errorCode) }) });
return r } }, {
key: "JS_StartAsyncDownload", value: function pe(e, t, n, i) {
var r = this;
var a = new Promise(function (a, s) {
if (!r.bLocalServiceRunning) {
s();
return } r.oRequest.startAsyncDownload(e, t, n, i).then(function (e) {
a(e.downloadId) }, function (e) {
s({
readyState: 4, status: e.errorCode, responseXML: e.errorInfo ? o.oUtils.parseXmlFromStr(e.errorInfo) : null }) }) });
return a } }, {
key: "JS_StopAsyncDownload", value: function me(e) {
var t = this;
var n = new Promise(function (n, i) {
if (!t.bLocalServiceRunning) {
i();
return } t.oRequest.stopAsyncDownload(e).then(function () {
n() }, function (e) {
i(e.errorCode) }) });
return n } }, {
key: "JS_GetDownloadStatus", value: function ye(e) {
var t = this;
var n = new Promise(function (n, i) {
if (!t.bLocalServiceRunning) {
i();
return } t.oRequest.getDownloadStatus(e).then(function (e) {
n(e.downloadStatus) }, function (e) {
i(e.errorCode) }) });
return n } }, {
key: "JS_GetDownloadProgress", value: function Se(e) {
var t = this;
var n = new Promise(function (n, i) {
if (!t.bLocalServiceRunning) {
i();
return } t.oRequest.getDownloadProgress(e).then(function (e) {
n(e.downloadProgress) }, function (e) {
i(e.errorCode) }) });
return n } }, {
key: "JS_EnablePDC", value: function ge(e, t) {
var n = this;
var i = new Promise(function (i, r) {
if (!n.bLocalServiceRunning) {
r();
return } n.oRequest.enablePDC(e, t).then(function () {
i() }, function (e) {
r(e.errorCode) }) });
return i } }, {
key: "JS_Resize", value: function _e(e, t) {
var n = this;
var i = new Promise(function (i, r) {
if (!n.bLocalServiceRunning) {
r();
return }
var a = null;
if (n.oOptions.szIframeId && $("#" + n.oOptions.szIframeId).length) {
a = $("#" + n.szWndId, $("#" + n.oOptions.szIframeId)[0].contentWindow.document) } else {
a = $("#" + n.szWndId) } if (a.length > 0) {
var s = o.oUtils.getWndPostion(a, n.bEmbed, n.oOptions.szIframeId);
var u = o.oUtils.getDevicePixelRatio();
if (!o.oUtils.browser().msie) {
if (n.oWndCover.left > 0) {
s.left = s.left + Math.round(n.oWndCover.left * u);
e = e - n.oWndCover.left } if (n.oWndCover.top > 0) {
s.top = s.top + Math.round(n.oWndCover.top * u);
t = t - n.oWndCover.top } if (n.oWndCover.right > 0) {
e = e - n.oWndCover.right } if (n.oWndCover.bottom > 0) {
t = t - n.oWndCover.bottom } } e = Math.round(e * u);
t = Math.round(t * u);
n.oRequest.setWndGeometry(s.left, s.top, e, t).then(function () {
i() }, function () {
r() }) } else {
r() } });
return i } }, {
key: "JS_SetDrawCallback", value: function Pe(e, t, n, i, r, o) {
var a = this;
o = o || {};
a.fCurrentCallback = null;
a.afCurrentCallback[e] = null;
var s = new Promise(function (s, u) {
if (!a.bLocalServiceRunning) {
u();
return } a.oRequest.setDrawCallback(e, t, n, i, o).then(function () {
a.fCurrentCallback = r;
a.afCurrentCallback[e] = r;
s() }, function (e) {
u(e.errorCode) }) });
return s } }, {
key: "JS_SetDrawStatus", value: function we(e) {
var t = this;
var n = new Promise(function (n, i) {
if (!t.bLocalServiceRunning) {
i();
return } t.oRequest.setDrawStatus(e).then(function () {
n() }, function (e) {
i(e.errorCode) }) });
return n } }, {
key: "JS_ClearRegion", value: function be() {
var e = this;
var t = new Promise(function (t, n) {
if (!e.bLocalServiceRunning) {
n();
return } e.oRequest.clearRegion().then(function () {
t() }, function (e) {
n(e.errorCode) }) });
return t } }, {
key: "JS_SetDrawShapeInfo", value: function ke(e, t) {
var n = this;
var i = new Promise(function (i, r) {
if (!n.bLocalServiceRunning) {
r();
return } n.oRequest.setDrawShapeInfo(e, t).then(function () {
i() }, function (e) {
r(e.errorCode) }) });
return i } }, {
key: "JS_SetGridInfo", value: function Ce(e) {
var t = this;
var n = new Promise(function (n, i) {
if (!t.bLocalServiceRunning) {
i();
return } t.oRequest.setGridInfo(e).then(function () {
n() }, function (e) {
i(e.errorCode) }) });
return n } }, {
key: "JS_GetGridInfo", value: function Re() {
var e = this;
var t = new Promise(function (t, n) {
if (!e.bLocalServiceRunning) {
n();
return } e.oRequest.getGridInfo().then(function (e) {
t(e.gridInfo) }, function (e) {
n(e.errorCode) }) });
return t } }, {
key: "JS_SetRectInfo", value: function Te(e) {
var t = this;
var n = new Promise(function (n, i) {
if (!t.bLocalServiceRunning) {
i();
return } t.oRequest.setRectInfo(e).then(function () {
n() }, function (e) {
i(e.errorCode) }) });
return n } }, {
key: "JS_GetRectInfo", value: function Ie() {
var e = this;
var t = new Promise(function (t, n) {
if (!e.bLocalServiceRunning) {
n();
return } e.oRequest.getRectInfo().then(function (e) {
t(e.rectInfo) }, function (e) {
n(e.errorCode) }) });
return t } }, {
key: "JS_SetPolygonInfo", value: function xe(e) {
var t = this;
var n = new Promise(function (n, i) {
if (!t.bLocalServiceRunning) {
i();
return } t.oRequest.setPolygonInfo(e).then(function () {
n() }, function (e) {
i(e.errorCode) }) });
return n } }, {
key: "JS_GetPolygonInfo", value: function De() {
var e = this;
var t = new Promise(function (t, n) {
if (!e.bLocalServiceRunning) {
n();
return } e.oRequest.getPolygonInfo().then(function (e) {
t(e.polygonInfo) }, function (e) {
n(e.errorCode) }) });
return t } }, {
key: "JS_SetLineInfo", value: function ze(e) {
var t = this;
var n = new Promise(function (n, i) {
if (!t.bLocalServiceRunning) {
i();
return } t.oRequest.setLineInfo(e).then(function () {
n() }, function (e) {
i(e.errorCode) }) });
return n } }, {
key: "JS_GetLineInfo", value: function Me() {
var e = this;
var t = new Promise(function (t, n) {
if (!e.bLocalServiceRunning) {
n();
return } e.oRequest.getLineInfo().then(function (e) {
t(e.lineInfo) }, function (e) {
n(e.errorCode) }) });
return t } }, {
key: "JS_SetPointInfo", value: function Ee(e) {
var t = this;
var n = new Promise(function (n, i) {
if (!t.bLocalServiceRunning) {
i();
return } t.oRequest.setPointInfo(e).then(function () {
n() }, function (e) {
i(e.errorCode) }) });
return n } }, {
key: "JS_GetPointInfo", value: function Oe() {
var e = this;
var t = new Promise(function (t, n) {
if (!e.bLocalServiceRunning) {
n();
return } e.oRequest.getPointInfo().then(function (e) {
t(e.pointInfo) }, function (e) {
n(e.errorCode) }) });
return t } }, {
key: "JS_SetTextOverlay", value: function Fe(e) {
var t = this;
var n = new Promise(function (n, i) {
if (!t.bLocalServiceRunning) {
i();
return } t.oRequest.setTextOverlay(e).then(function () {
n() }, function (e) {
i(e.errorCode) }) });
return n } }, {
key: "JS_GetTextOverlay", value: function qe() {
var e = this;
var t = new Promise(function (t, n) {
if (!e.bLocalServiceRunning) {
n();
return } e.oRequest.getTextOverlay().then(function (e) {
t(e.overlayInfo) }, function (e) {
n(e.errorCode) }) });
return t } }, {
key: "JS_ClearShapeByType", value: function Je(e, t) {
var n = this;
var i = new Promise(function (i, r) {
if (!n.bLocalServiceRunning) {
r();
return } n.oRequest.clearShapeByType(e, t).then(function (t) {
if ("Choosed" === e) {
i(t.clearedShapeId) } else {
i() } }, function (e) {
r(e.errorCode) }) });
return i } }, {
key: "JS_ChooseShape", value: function We(e, t) {
var n = this;
var i = new Promise(function (i, r) {
if (!n.bLocalServiceRunning) {
r();
return } n.oRequest.chooseShape(e, t).then(function () {
i() }, function (e) {
r(e.errorCode) }) });
return i } }, {
key: "JS_SetCorrectionType", value: function Le(e) {
var t = this;
var n = new Promise(function (n, i) {
if (!t.bLocalServiceRunning) {
i();
return } t.oRequest.setCorrectionType(e).then(function () {
n() }, function (e) {
i(e.errorCode) }) });
return n } }, {
key: "JS_SetPlaceType", value: function Ae(e) {
var t = this;
var n = new Promise(function (n, i) {
if (!t.bLocalServiceRunning) {
i();
return } t.oRequest.setPlaceType(e).then(function () {
n() }, function (e) {
i(e.errorCode) }) });
return n } }, {
key: "JS_StartFishListener", value: function Be(e, t, n) {
var i = this;
var r = new Promise(function (r, o) {
if (!i.bLocalServiceRunning) {
o();
return } i.oRequest.startFishListener(e, t, n).then(function () {
r() }, function (e) {
o(e.errorCode) }) });
return r } }, {
key: "JS_StopFishListener", value: function Ue() {
var e = this;
var t = new Promise(function (t, n) {
if (!e.bLocalServiceRunning) {
n();
return } e.oRequest.stopFishListener().then(function () {
t() }, function (e) {
n(e.errorCode) }) });
return t } }, {
key: "JS_SetFishBoxListInfo", value: function $e(e) {
var t = this;
var n = new Promise(function (n, i) {
if (!t.bLocalServiceRunning) {
i();
return } t.oRequest.setFishBoxListInfo(e).then(function () {
n() }, function (e) {
i(e.errorCode) }) });
return n } }, {
key: "JS_GetFishBoxListInfo", value: function He() {
var e = this;
var t = new Promise(function (t, n) {
if (!e.bLocalServiceRunning) {
n();
return } e.oRequest.getFishBoxListInfo().then(function (e) {
t(e.fishBoxList) }, function (e) {
n(e.errorCode) }) });
return t } }, {
key: "JS_ClearAllWndFishBoxInfo", value: function Ne() {
var e = this;
var t = new Promise(function (t, n) {
if (!e.bLocalServiceRunning) {
n();
return } e.oRequest.clearAllWndFishBoxInfo().then(function () {
t() }, function (e) {
n(e.errorCode) }) });
return t } }, {
key: "JS_SetFishWndProperty", value: function Ge(e, t, n) {
var i = this;
var r = new Promise(function (r, o) {
if (!i.bLocalServiceRunning) {
o();
return } i.oRequest.setFishWndProperty(e, t, n).then(function () {
r() }, function (e) {
o(e.errorCode) }) });
return r } }, {
key: "JS_SetFishParams", value: function je(e, t, n, i) {
var r = this;
var o = new Promise(function (o, a) {
if (!r.bLocalServiceRunning) {
a();
return } r.oRequest.setFishParams(e, t, n, i).then(function () {
o() }, function (e) {
a(e.errorCode) }) });
return o } }, {
key: "JS_ArrangeFECWindow", value: function Ve(e) {
var t = this;
var n = new Promise(function (n, i) {
if (!t.bLocalServiceRunning) {
i();
return } t.oRequest.arrangeFECWindow(e).then(function () {
n() }, function (e) {
i(e.errorCode) }) });
return n } }, {
key: "JS_StartFECScan", value: function Xe(e) {
var t = this;
var n = new Promise(function (n, i) {
if (!t.bLocalServiceRunning) {
i();
return } t.oRequest.startFECScan(e).then(function () {
n() }, function (e) {
i(e.errorCode) }) });
return n } }, {
key: "JS_StopFECScan", value: function Ye() {
var e = this;
var t = new Promise(function (t, n) {
if (!e.bLocalServiceRunning) {
n();
return } e.oRequest.stopFECScan().then(function () {
t() }, function (e) {
n(e.errorCode) }) });
return t } }, {
key: "JS_FishEyePTZ", value: function Ze(e, t) {
var n = this;
var i = new Promise(function (i, r) {
if (!n.bLocalServiceRunning) {
r();
return } n.oRequest.fishEyePTZ(e, t).then(function () {
i() }, function (e) {
r(e.errorCode) }) });
return i } }, {
key: "JS_FishEyeGetPreset", value: function Ke() {
var e = this;
var t = new Promise(function (t, n) {
if (!e.bLocalServiceRunning) {
n();
return } e.oRequest.fishEyeGetPreset().then(function (e) {
t(e.fishEyePreset) }, function (e) {
n(e.errorCode) }) });
return t } }, {
key: "JS_FishEyeSetPreset", value: function Qe(e) {
var t = this;
var n = new Promise(function (n, i) {
if (!t.bLocalServiceRunning) {
i();
return } t.oRequest.fishEyeSetPreset(e).then(function () {
n() }, function (e) {
i(e.errorCode) }) });
return n } }, {
key: "JS_StartFECCruise", value: function et(e) {
var t = this;
var n = new Promise(function (n, i) {
if (!t.bLocalServiceRunning) {
i();
return } t.oRequest.startFECCruise(e).then(function () {
n() }, function (e) {
i(e.errorCode) }) });
return n } }, {
key: "JS_StopFECCruise", value: function tt() {
var e = this;
var t = new Promise(function (t, n) {
if (!e.bLocalServiceRunning) {
n();
return } e.oRequest.stopFECCruise().then(function () {
t() }, function (e) {
n(e.errorCode) }) });
return t } }, {
key: "JS_SetIsHttps", value: function nt(e) {
var t = this;
var n = new Promise(function (n, i) {
if (!t.bLocalServiceRunning) {
i();
return } t.oRequest.setIsHttps(e).then(function () {
n() }, function (e) {
i(e.errorCode) }) });
return n } }, {
key: "JS_SetReconnectInfo", value: function it(e, t) {
var n = this;
var i = new Promise(function (i, r) {
if (!n.bLocalServiceRunning) {
r();
return } n.oRequest.setReconnectInfo(e, t).then(function () {
i() }, function (e) {
r(e.errorCode) }) });
return i } }, {
key: "JS_CheckUpdate", value: function rt(e) {
var t = this;
var n = new Promise(function (n, i) {
if (!t.bLocalServiceRunning) {
i();
return }
var r = o.oUtils.parseXmlFromStr(e);
var a = $(r).find("localServiceControl").eq(0).text();
t.oRequest.getLocalServiceVersion().then(function (e) {
var t = parseInt(e.localServiceVersion.replace(/\./g, ""), 10);
var i = parseInt(a.replace(/\./g, ""), 10);
var r = i > t;
n(r) }, function () {
i() }) });
return n } }, {
key: "JS_SelectShape", value: function ot(e, t) {
var n = this;
var i = new Promise(function (i, r) {
if (!n.bLocalServiceRunning) {
r();
return } n.oRequest.selectShape(e, t).then(function () {
i() }, function (e) {
r(e.errorCode) }) });
return i } }, {
key: "JS_GetPictureSize", value: function at(e) {
var t = this;
var n = new Promise(function (n, i) {
if (!t.bLocalServiceRunning) {
i();
return } t.oRequest.getPlayInfo(e).then(function (e) {
n(e.playInfo.playInfo) }, function (e) {
i(e.errorCode) }) });
return n } }, {
key: "JS_SetOriginResolution", value: function st(e, t, n) {
var i = this;
var r = new Promise(function (r, o) {
if (!i.bLocalServiceRunning) {
o();
return } i.oRequest.setOriginResolution(e, t, n).then(function () {
r() }, function (e) {
o(e.errorCode) }) });
return r } }, {
key: "JS_SetPlayWndMode", value: function ut(e, t, n) {
var i = this;
var r = new Promise(function (r, o) {
if (!i.bLocalServiceRunning) {
o();
return } i.oRequest.setPlayWndMode(e, t, n).then(function () {
r() }, function (e) {
o(e.errorCode) }) });
return r } }, {
key: "JS_CuttingPartWindow", value: function lt(e, t, n, i) {
var r = this;
var o = new Promise(function (o, a) {
if (!r.bLocalServiceRunning) {
a();
return } r.oRequest.cuttingPartWindow(e, t, n, i).then(function () {
o() }, function (e) {
a(e.errorCode) }) });
return o } }, {
key: "JS_RepairPartWindow", value: function ft(e, t, n, i) {
var r = this;
var o = new Promise(function (o, a) {
if (!r.bLocalServiceRunning) {
a();
return } r.oRequest.repairPartWindow(e, t, n, i).then(function () {
o() }, function (e) {
a(e.errorCode) }) });
return o } }]);
return e }();
return e }();
t.LocalServiceControl = s }, function (e, t, n) {
"use strict";
Object.defineProperty(t, "__esModule", {
value: true });
t.Request = undefined;
var i = function () {
function e(e, t) {
for (var n = 0;
n < t.length;
n++) {
var i = t[n];
i.enumerable = i.enumerable || false;
i.configurable = true;
if ("value" in i) i.writable = true;
Object.defineProperty(e, i.key, i) } }
return function (t, n, i) {
if (n) e(t.prototype, n);
if (i) e(t, i);
return t } }();
var r = n(30);
var o = n(31);
var a = n(41);
var s = n(2);
function u(e, t) {
if (!(e instanceof t)) {
throw new TypeError("Cannot call a class as a function") } }
var l = function () {
var e = 33686;
var t = 33695;
var n = function () {
function n(e) {
u(this, n);
var t = {
szPluginContainer: "", cbConnectSuccess: null, cbConnectError: null, cbConnectClose: null };
this.oOptions = $.extend(t, e);
this.iPort = -1;
this.oRequest = null;
this.isInit = false;
this.oCallbacks = {};
this.init(this.oOptions.oSessionInfo) } i(n, [{
key: "init", value: function l(n) {
var i = this;
if (i.oOptions.bNoDetectPort) {
i.oRequest = new r.WebSocketRequest({
iPort: 33686, cbConnectSuccess: i.oOptions.cbConnectSuccess, cbConnectError: i.oOptions.cbConnectError, cbConnectClose: i.oOptions.cbConnectClose }) } else {
if (i.oOptions.bUseInQT) {
i.oRequest = new a.WebChannelRequest({
iPort: i.iPort, cbConnectSuccess: i.oOptions.cbConnectSuccess, cbConnectError: i.oOptions.cbConnectError, cbConnectClose: i.oOptions.cbConnectClose }) } else {
s.oUtils.detectPort(e, t, {
oSessionInfo: n, success: function a(e) {
i.iPort = e;
if (s.oUtils.browser().msie) {} else {
if ("https:" === window.location.protocol) {
if (s.oUtils.browser().chrome) {
try {
i.oRequest = new r.WebSocketRequest({
iPort: i.iPort, cbConnectSuccess: i.oOptions.cbConnectSuccess, cbConnectError: i.oOptions.cbConnectError, cbConnectClose: i.oOptions.cbConnectClose }) } catch (n) {
i.oRequest = new o.ImageHttpRequest({
iPort: i.iPort, cbConnectSuccess: i.oOptions.cbConnectSuccess, cbConnectError: i.oOptions.cbConnectError, cbConnectClose: i.oOptions.cbConnectClose }) } } else {
i.oRequest = new o.ImageHttpRequest({
iPort: i.iPort, cbConnectSuccess: i.oOptions.cbConnectSuccess, cbConnectError: i.oOptions.cbConnectError, cbConnectClose: i.oOptions.cbConnectClose }) } } else {
if ("WebSocket" in window) {
i.oRequest = new r.WebSocketRequest({
iPort: i.iPort, cbConnectSuccess: i.oOptions.cbConnectSuccess, cbConnectError: i.oOptions.cbConnectError, cbConnectClose: i.oOptions.cbConnectClose }) } else {} } } i.isInit = true;
for (var t in i.oCallbacks) {
i.oRequest[t](i.oCallbacks[t]) } }, error: function u() {
if (i.oOptions.cbConnectError) {
i.oOptions.cbConnectError() } } }) } } } }, {
key: "setWindowControlCallback", value: function f(e) {
if (this.isInit) {
this.oRequest.setWindowControlCallback(e) } else {
this.oCallbacks.setWindowControlCallback = e } } }, {
key: "getServiceVersion", value: function c() {
return this.oRequest.getServiceVersion() } }, {
key: "getRequestUUID", value: function h() {
return this.oRequest.getRequestUUID() } }, {
key: "disconnect", value: function d() {
this.oRequest.disconnect() } }, {
key: "createWnd", value: function v(e, t, n, i, r, o) {
return this.oRequest.sendRequest({
cmd: "window.createWnd", rect: {
left: e, top: t, width: n, height: i }, className: r, embed: o }) } }, {
key: "showWnd", value: function p() {
return this.oRequest && this.oRequest.sendRequest({
cmd: "window.showWnd" }) } }, {
key: "hideWnd", value: function m() {
return this.oRequest && this.oRequest.sendRequest({
cmd: "window.hideWnd" }) } }, {
key: "destroyWnd", value: function y() {
return this.oRequest.sendRequest({
cmd: "window.destroyWnd" }) } }, {
key: "setWndGeometry", value: function S(e, t, n, i) {
return this.oRequest.sendRequest({
cmd: "window.setWndGeometry", rect: {
left: e, top: t, width: n, height: i } }) } }, {
key: "setWndCover", value: function g(e, t) {
return this.oRequest.sendRequest({
cmd: "window.setWndCover", position: e, size: t }) } }, {
key: "setWndZOrder", value: function _(e) {
return this.oRequest.sendRequest({
cmd: "window.setWndZOrder", flag: e }) } }, {
key: "updateParentWnd", value: function P() {
return this.oRequest.sendRequest({
cmd: "window.updateParentWnd" }) } }, {
key: "getLocalServiceVersion", value: function w() {
return this.oRequest.sendRequest({
cmd: "window.getLocalServiceVersion" }) } }, {
key: "startPlay", value: function b(e, t, n, i, r) {
if (t === null || typeof t === "undefined") {
t = {} }
var o = {
cmd: "video.startPlay", url: e, token: t.token || "", auth: t.auth || "", wndIndex: n, startTime: i || "", stopTime: r || "" };
return this.oRequest.sendRequest(o) } }, {
key: "stop", value: function k(e) {
return this.oRequest.sendRequest({
cmd: "video.stop", wndIndex: e }) } }, {
key: "stopAll", value: function C() {
return this.oRequest.sendRequest({
cmd: "video.stopAll" }) } }, {
key: "reversePlay", value: function R(e, t, n, i, r) {
if (t === null || typeof t === "undefined") {
t = {} }
var o = {
cmd: "video.reversePlay", url: e, token: t.token || "", auth: t.auth || "", wndIndex: n, startTime: i || "", stopTime: r || "" };
return this.oRequest.sendRequest(o) } }, {
key: "startSave", value: function T(e, t) {
var n = {
cmd: "video.startSave", wndIndex: e, fileName: t || "" };
return this.oRequest.sendRequest(n) } }, {
key: "stopSave", value: function I(e) {
var t = {
cmd: "video.stopSave", wndIndex: e };
return this.oRequest.sendRequest(t) } }, {
key: "getLastError", value: function x() {
var e = {
cmd: "video.getLastError" };
return this.oRequest.sendRequest(e) } }, {
key: "openSound", value: function D(e) {
var t = {
cmd: "video.openSound", wndIndex: e };
return this.oRequest.sendRequest(t) } }, {
key: "closeSound", value: function z() {
var e = {
cmd: "video.closeSound" };
return this.oRequest.sendRequest(e) } }, {
key: "getVolume", value: function M() {
var e = {
cmd: "video.getVolume" };
return this.oRequest.sendRequest(e) } }, {
key: "setVolume", value: function E(e, t) {
var n = {
cmd: "video.setVolume", wndIndex: e, volume: t };
return this.oRequest.sendRequest(n) } }, {
key: "pause", value: function O(e) {
var t = {
cmd: "video.pause", wndIndex: e };
return this.oRequest.sendRequest(t) } }, {
key: "resume", value: function F(e) {
var t = {
cmd: "video.resume", wndIndex: e };
return this.oRequest.sendRequest(t) } }, {
key: "slow", value: function q(e) {
var t = {
cmd: "video.slow", wndIndex: e };
return this.oRequest.sendRequest(t) } }, {
key: "fast", value: function J(e) {
var t = {
cmd: "video.fast", wndIndex: e };
return this.oRequest.sendRequest(t) } }, {
key: "frame", value: function W(e) {
var t = {
cmd: "video.frame", wndIndex: e };
return this.oRequest.sendRequest(t) } }, {
key: "getOSDTime", value: function L(e) {
var t = {
cmd: "video.getOSDTime", wndIndex: e };
return this.oRequest.sendRequest(t) } }, {
key: "getPlayInfo", value: function A(e) {
var t = {
cmd: "video.getPlayInfo", wndIndex: e };
return this.oRequest.sendRequest(t) } }, {
key: "capture", value: function B(e, t) {
var n = {
cmd: "video.capture", wndIndex: e, fileName: t || "" };
return this.oRequest.sendRequest(n) } }, {
key: "arrangeWindow", value: function U(e, t) {
var n = {
cmd: "video.arrangeWindow", type: e, custom: t || [] };
return this.oRequest.sendRequest(n) } }, {
key: "enableIVS", value: function H(e, t, n) {
var i = {
cmd: "video.enableIVS", wndIndex: e, type: t, enable: n };
return this.oRequest.sendRequest(i) } }, {
key: "setPlaybackDrawType", value: function N(e, t) {
var n = {
cmd: "video.setPlaybackDrawType", wndIndex: e, type: t };
return this.oRequest.sendRequest(n) } }, {
key: "setPlayBackType", value: function G(e) {
var t = {
cmd: "video.setPlayBackType", type: e };
return this.oRequest.sendRequest(t) } }, {
key: "setTrsPlayBackParam", value: function j(e, t) {
var n = {
cmd: "video.setTrsPlayBackParam", wndIndex: e, params: t };
return this.oRequest.sendRequest(n) } }, {
key: "startTalk", value: function V(e, t, n, i, r, o, a, s, u) {
var l = {
cmd: "video.startTalk", openUrl: e, closeUrl: t, dataUrl: n, auth: i, audioType: r, bitRate: o, sampleRate: a, soundChannel: s, deviceCastChannelNum: u };
return this.oRequest.sendRequest(l) } }, {
key: "stopTalk", value: function X() {
var e = {
cmd: "video.stopTalk" };
return this.oRequest.sendRequest(e) } }, {
key: "enableZoom", value: function Y(e, t) {
var n = {
cmd: "video.enableZoom", wndIndex: e, type: t };
return this.oRequest.sendRequest(n) } }, {
key: "disableZoom", value: function Z(e) {
var t = {
cmd: "video.disableZoom", wndIndex: e };
return this.oRequest.sendRequest(t) } }, {
key: "setFullScreenCapability", value: function K(e) {
var t = {
cmd: "video.setFullScreenCapability", mode: e };
return this.oRequest.sendRequest(t) } }, {
key: "fullScreen", value: function Q(e) {
var t = {
cmd: "video.fullScreen", full: e };
return this.oRequest.sendRequest(t) } }, {
key: "setSecretKey", value: function ee(e, t) {
var n = {
cmd: "video.setSecretKey", keyType: t, key: e };
return this.oRequest.sendRequest(n) } }, {
key: "getEncryptString", value: function te(e, t, n) {
var i = {
cmd: "video.getEncryptString", type: e, originalKey: t, encrypted: n };
return this.oRequest.sendRequest(i) } }, {
key: "setOriginalString", value: function ne(e, t) {
var n = {
cmd: "video.setOriginalString", key: e, encrypted: t };
return this.oRequest.sendRequest(n) } }, {
key: "getDecryptString", value: function ie(e, t, n) {
var i = {
cmd: "video.getDecryptString", type: e, encrypted: t, key: n };
return this.oRequest.sendRequest(i) } }, {
key: "getLocalConfig", value: function re() {
var e = {
cmd: "video.getLocalConfig" };
return this.oRequest.sendRequest(e) } }, {
key: "setLocalConfig", value: function oe(e) {
var t = {
cmd: "video.setLocalConfig", localConfig: e };
return this.oRequest.sendRequest(t) } }, {
key: "setPlayMode", value: function ae(e) {
var t = {
cmd: "video.setPlayMode", mode: e };
return this.oRequest.sendRequest(t) } }, {
key: "browseFilePath", value: function se(e, t) {
var n = {
cmd: "video.browseFilePath", mode: e, fileType: t };
return this.oRequest.sendRequest(n) } }, {
key: "openDirectory", value: function ue(e) {
var t = {
cmd: "video.openDirectory", dir: e };
return this.oRequest.sendRequest(t) } }, {
key: "startAsynUpload", value: function le(e, t, n, i) {
var r = {
cmd: "video.startAsynUpload", uploadUrl: e, statusUrl: t, auth: n, filepath: i };
return this.oRequest.sendRequest(r) } }, {
key: "stopAsynUpload", value: function fe() {
var e = {
cmd: "video.stopAsynUpload" };
return this.oRequest.sendRequest(e) } }, {
key: "getUploadErrorInfo", value: function ce() {
var e = {
cmd: "video.getUploadErrorInfo" };
return this.oRequest.sendRequest(e) } }, {
key: "uploadFile", value: function he(e, t, n, i) {
var r = {
cmd: "video.uploadFile", uploadUrl: e, auth: t, filepath: n, contentType: i };
return this.oRequest.sendRequest(r) } }, {
key: "getIpcImportErrorInfo", value: function de() {
var e = {
cmd: "video.getIpcImportErrorInfo" };
return this.oRequest.sendRequest(e) } }, {
key: "downloadFile", value: function ve(e, t, n, i, r, o) {
var a = {
cmd: "video.downloadFile", downloadUrl: e, auth: t, xmlContent: n, method: i, fileType: r, decode: o };
return this.oRequest.sendRequest(a) } }, {
key: "startUpgrade", value: function pe(e, t, n, i, r) {
var o = {
cmd: "video.startUpgrade", upgradeUrl: e, statusUrl: t, auth: n, filepath: i, upgradeFlag: r };
return this.oRequest.sendRequest(o) } }, {
key: "stopUpgrade", value: function me() {
var e = {
cmd: "video.stopUpgrade" };
return this.oRequest.sendRequest(e) } }, {
key: "getUpgradeStatus", value: function ye() {
var e = {
cmd: "video.getUpgradeStatus" };
return this.oRequest.sendRequest(e) } }, {
key: "getUpgradeProgress", value: function Se() {
var e = {
cmd: "video.getUpgradeProgress" };
return this.oRequest.sendRequest(e) } }, {
key: "exportDeviceLog", value: function ge(e, t, n) {
var i = {
cmd: "video.exportDeviceLog", logXml: e, filename: t, fileType: n };
return this.oRequest.sendRequest(i) } }, {
key: "enablePDC", value: function _e(e, t) {
var n = {
cmd: "video.enablePDC", wndIndex: e, enable: t };
return this.oRequest.sendRequest(n) } }, {
key: "exportReport", value: function Pe(e, t, n) {
var i = {
cmd: "video.exportReport", reportXml: e, filename: t, fileType: n };
return this.oRequest.sendRequest(i) } }, {
key: "startAsyncDownload", value: function we(e, t, n, i) {
var r = {
cmd: "video.startAsyncDownload", downloadUrl: e, auth: t, filename: n, downloadXml: i };
return this.oRequest.sendRequest(r) } }, {
key: "stopAsyncDownload", value: function be(e) {
var t = {
cmd: "video.stopAsyncDownload", downloadId: e };
return this.oRequest.sendRequest(t) } }, {
key: "getDownloadStatus", value: function ke(e) {
var t = {
cmd: "video.getDownloadStatus", downloadId: e };
return this.oRequest.sendRequest(t) } }, {
key: "getDownloadProgress", value: function Ce(e) {
var t = {
cmd: "video.getDownloadProgress", downloadId: e };
return this.oRequest.sendRequest(t) } }, {
key: "SRInit", value: function Re(e, t) {
var n = {
cmd: "video.SRInit", wndIndex: e, type: t };
return this.oRequest.sendRequest(n) } }, {
key: "SRPTZ", value: function Te(e, t, n) {
var i = {
cmd: "video.SRPTZ", wndIndex: e, direction: t, step: n };
return this.oRequest.sendRequest(i) } }, {
key: "setDrawCallback", value: function Ie(e, t, n, i, r) {
var o = {
cmd: "video.setDrawCallback", wndIndex: e, enable: t, type: n, display: i };
$.extend(o, r);
return this.oRequest.sendRequest(o) } }, {
key: "setDrawStatus", value: function xe(e) {
return this.oRequest.sendRequest({
cmd: "video.setDrawStatus", enable: e }) } }, {
key: "clearRegion", value: function De() {
return this.oRequest.sendRequest({
cmd: "video.clearRegion" }) } }, {
key: "setDrawShapeInfo", value: function ze(e, t) {
return this.oRequest.sendRequest({
cmd: "video.setDrawShapeInfo", drawType: e, drawInfo: t }) } }, {
key: "setGridInfo", value: function Me(e) {
return this.oRequest.sendRequest({
cmd: "video.setGridInfo", gridInfo: e }) } }, {
key: "getGridInfo", value: function Ee() {
return this.oRequest.sendRequest({
cmd: "video.getGridInfo" }) } }, {
key: "setPolygonInfo", value: function Oe(e) {
return this.oRequest.sendRequest({
cmd: "video.setPolygonInfo", polygonInfo: e }) } }, {
key: "getPolygonInfo", value: function Fe() {
return this.oRequest.sendRequest({
cmd: "video.getPolygonInfo" }) } }, {
key: "setLineInfo", value: function qe(e) {
return this.oRequest.sendRequest({
cmd: "video.setLineInfo", lineInfo: e }) } }, {
key: "getLineInfo", value: function Je() {
return this.oRequest.sendRequest({
cmd: "video.getLineInfo" }) } }, {
key: "setPointInfo", value: function We(e) {
return this.oRequest.sendRequest({
cmd: "video.setPointInfo", pointInfo: e }) } }, {
key: "getPointInfo", value: function Le() {
return this.oRequest.sendRequest({
cmd: "video.getPointInfo" }) } }, {
key: "setTextOverlay", value: function Ae(e) {
return this.oRequest.sendRequest({
cmd: "video.setTextOverlay", overlayInfo: e }) } }, {
key: "getTextOverlay", value: function Be() {
return this.oRequest.sendRequest({
cmd: "video.getTextOverlay" }) } }, {
key: "setRectInfo", value: function Ue(e) {
return this.oRequest.sendRequest({
cmd: "video.setRectInfo", rectInfo: e }) } }, {
key: "getRectInfo", value: function $e() {
return this.oRequest.sendRequest({
cmd: "video.getRectInfo" }) } }, {
key: "clearShapeByType", value: function He(e, t) {
return this.oRequest.sendRequest({
cmd: "video.clearShapeByType", type: e, id: t }) } }, {
key: "chooseShape", value: function Ne(e, t) {
return this.oRequest.sendRequest({
cmd: "video.chooseShape", type: e, id: t }) } }, {
key: "setCorrectionType", value: function Ge(e) {
return this.oRequest.sendRequest({
cmd: "video.setCorrectionType", type: e }) } }, {
key: "setPlaceType", value: function je(e) {
return this.oRequest.sendRequest({
cmd: "video.setPlaceType", type: e }) } }, {
key: "startFishListener", value: function Ve(e, t, n) {
return this.oRequest.sendRequest({
cmd: "video.startFishListener", url: e, auth: t, extData: n }) } }, {
key: "stopFishListener", value: function Xe() {
return this.oRequest.sendRequest({
cmd: "video.stopFishListener" }) } }, {
key: "setFishBoxListInfo", value: function Ye(e) {
return this.oRequest.sendRequest({
cmd: "video.setFishBoxListInfo", fishBoxList: e }) } }, {
key: "getFishBoxListInfo", value: function Ze() {
return this.oRequest.sendRequest({
cmd: "video.getFishBoxListInfo" }) } }, {
key: "clearAllWndFishBoxInfo", value: function Ke() {
return this.oRequest.sendRequest({
cmd: "video.clearAllWndFishBoxInfo" }) } }, {
key: "setFishWndProperty", value: function Qe(e, t, n) {
return this.oRequest.sendRequest({
cmd: "video.setFishWndProperty", wndIndex: e, type: t, id: n }) } }, {
key: "setFishParams", value: function et(e, t, n, i) {
return this.oRequest.sendRequest({
cmd: "video.setFishParams", top: e, right: t, bottom: n, left: i }) } }, {
key: "arrangeFECWindow", value: function tt(e) {
return this.oRequest.sendRequest({
cmd: "video.arrangeFECWindow", type: e }) } }, {
key: "startFECScan", value: function nt(e) {
return this.oRequest.sendRequest({
cmd: "video.startFECScan", speed: e }) } }, {
key: "stopFECScan", value: function it() {
return this.oRequest.sendRequest({
cmd: "video.stopFECScan" }) } }, {
key: "fishEyePTZ", value: function rt(e, t) {
return this.oRequest.sendRequest({
cmd: "video.fishEyePTZ", direction: e, speed: t }) } }, {
key: "fishEyeGetPreset", value: function ot() {
return this.oRequest.sendRequest({
cmd: "video.fishEyeGetPreset" }) } }, {
key: "fishEyeSetPreset", value: function at(e) {
return this.oRequest.sendRequest({
cmd: "video.fishEyeSetPreset", fishEyePreset: e }) } }, {
key: "startFECCruise", value: function st(e) {
return this.oRequest.sendRequest({
cmd: "video.startFECCruise", fishEyePresetList: e }) } }, {
key: "stopFECCruise", value: function ut() {
return this.oRequest.sendRequest({
cmd: "video.stopFECCruise" }) } }, {
key: "setIsHttps", value: function lt(e) {
return this.oRequest.sendRequest({
cmd: "video.setIsHttps", https: e }) } }, {
key: "setReconnectInfo", value: function ft(e, t) {
return this.oRequest.sendRequest({
cmd: "video.setReconnectInfo", wndIndex: e, auth: t }) } }, {
key: "selectShape", value: function ct(e, t) {
return this.oRequest.sendRequest({
cmd: "video.chooseShape", type: e, id: t }) } }, {
key: "getPlayInfo", value: function ht(e) {
return this.oRequest.sendRequest({
cmd: "video.getPlayInfo", wndIndex: e }) } }, {
key: "setOriginResolution", value: function dt(e, t, n) {
return this.oRequest.sendRequest({
cmd: "video.setWndResolution", wndIndex: e, width: t, height: n }) } }, {
key: "setPlayWndMode", value: function vt(e, t, n) {
return this.oRequest.sendRequest({
cmd: "video.setWndRatioMode", wndIndex: e, mode: t, allWnd: n }) } }, {
key: "cuttingPartWindow", value: function pt(e, t, n, i) {
return this.oRequest.sendRequest({
cmd: "window.cuttingPartWindow", rect: {
left: e, top: t, width: n, height: i }, round: 0 }) } }, {
key: "repairPartWindow", value: function mt(e, t, n, i) {
return this.oRequest.sendRequest({
cmd: "window.repairPartWindow", rect: {
left: e, top: t, width: n, height: i }, round: 0 }) } }]);
return n }();
n.checkLocalServiceConnected = function (n) {
var i = new Promise(function (i, r) {
s.oUtils.detectPort(e, t, {
oSessionInfo: n, success: function o() {
i() }, error: function a() {
r() } }) });
return i };
return n }();
t.Request = l }, function (e, t, n) {
"use strict";
Object.defineProperty(t, "__esModule", {
value: true });
t.WebSocketRequest = undefined;
var i = function () {
function e(e, t) {
for (var n = 0;
n < t.length;
n++) {
var i = t[n];
i.enumerable = i.enumerable || false;
i.configurable = true;
if ("value" in i) i.writable = true;
Object.defineProperty(e, i.key, i) } }
return function (t, n, i) {
if (n) e(t.prototype, n);
if (i) e(t, i);
return t } }();
var r = n(1);
var o = s(r);
var a = n(2);
function s(e) {
return e && e.__esModule ? e : {
"default": e } } function u(e, t) {
if (!(e instanceof t)) {
throw new TypeError("Cannot call a class as a function") } }
var l = function () {
var e = function () {
function e(t) {
u(this, e);
var n = {
iPort: -1, cbConnectSuccess: null, cbConnectError: null, cbConnectClose: null };
this.oOptions = $.extend(n, t);
this.oWebSocket = null;
this.szUUID = "";
this.szVersion = "";
this.oRequestList = {};
this.bNormalClose = false;
this.oWindowControlCallback = {};
this.init() } i(e, [{
key: "init", value: function t() {
var e = this;
var t = function n() {
if (e.oOptions.cbConnectClose) {
e.oOptions.cbConnectClose(e.bNormalClose) } e.bNormalClose = false };
e.oWebSocket = new WebSocket("ws://127.0.0.1:" + e.oOptions.iPort);
e.oWebSocket.onerror = function () {};
e.oWebSocket.onopen = function () {
var t = o["default"].v4();
var n = {
sequence: t, cmd: "system.webconnect" };
var i = JSON.stringify(n);
e.oWebSocket.send(i) };
e.oWebSocket.onmessage = function (t) {
var n = t.data;
if (!n) {
return }
var i = JSON.parse(n);
var r = i.sequence;
if (typeof r === "undefined" && typeof i.cmd === "undefined") {
e.szUUID = i.uuid;
e.szVersion = i.version;
if (e.oOptions.cbConnectSuccess) {
e.oOptions.cbConnectSuccess() } } else {
if (typeof i.cmd !== "undefined") {
e.parseCmd(i) } else {
if (typeof e.oRequestList[r] !== "undefined") {
if (0 === i.errorCode) {
e.oRequestList[r].resolve(i) } else {
e.oRequestList[r].reject(i) } delete e.oRequestList[r] } } } };
e.oWebSocket.onclose = function () {
e.oWebSocket = null;
if (a.oUtils.browser().mozilla) {
setTimeout(function () {
t() }, 100) } else {
t() } } } }, {
key: "setWindowControlCallback", value: function n(e) {
this.oWindowControlCallback = e } }, {
key: "getServiceVersion", value: function r() {
return this.szVersion } }, {
key: "getRequestUUID", value: function s() {
return this.szUUID } }, {
key: "disconnect", value: function l() {
this.bNormalClose = true;
if (this.oWebSocket && WebSocket.OPEN === this.oWebSocket.readyState) {
this.oWebSocket.close() } } }, {
key: "sendRequest", value: function f(e) {
var t = this;
var n = new Promise(function (n, i) {
var r = o["default"].v4();
e.sequence = r;
t.oRequestList[r] = {
resolve: n, reject: i };
e.uuid = t.szUUID;
e.timestamp = (new Date).getTime() + "";
var a = JSON.stringify(e);
if (t.oWebSocket && WebSocket.OPEN === t.oWebSocket.readyState) {
t.oWebSocket.send(a) } else {
i() } });
return n } }, {
key: "parseCmd", value: function c(e) {
var t = e.cmd;
var n = t.split(".");
var i = n[1];
if ("window" === n[0] || "video" === n[0]) {
if (this.oWindowControlCallback[i]) {
this.oWindowControlCallback[i](e) } } } }]);
return e }();
return e }();
t.WebSocketRequest = l }, function (e, t, n) {
"use strict";
Object.defineProperty(t, "__esModule", {
value: true });
t.ImageHttpRequest = undefined;
var i = function () {
function e(e, t) {
for (var n = 0;
n < t.length;
n++) {
var i = t[n];
i.enumerable = i.enumerable || false;
i.configurable = true;
if ("value" in i) i.writable = true;
Object.defineProperty(e, i.key, i) } }
return function (t, n, i) {
if (n) e(t.prototype, n);
if (i) e(t, i);
return t } }();
var r = n(1);
var o = l(r);
var a = n(32);
var s = l(a);
var u = n(2);
function l(e) {
return e && e.__esModule ? e : {
"default": e } } function f(e, t) {
if (!(e instanceof t)) {
throw new TypeError("Cannot call a class as a function") } }
var c = function () {
var e = function () {
function e(t) {
f(this, e);
var n = {
iPort: -1, cbConnectSuccess: null, cbConnectError: null, cbConnectClose: null };
this.oOptions = $.extend(n, t);
this.szHost = "http://127.0.0.1";
this.szUUID = "";
this.szVersion = "";
this.bNormalClose = false;
this.bConnected = false;
this.bInitConnect = true;
this.iGetErrorCount = 0;
this.oWindowControlCallback = {};
this.oUIControlCallback = {};
this.init() } i(e, [{
key: "init", value: function t() {
var e = this;
var t = o["default"].v4();
var n = {
sequence: t, cmd: "system.webconnect" };
var i = JSON.stringify(n);
e.sendImageHttp(e.szHost + ":" + e.oOptions.iPort + "/imghttp/local", i, t, {
success: function r(t) {
if (!t) {
return }
var n = JSON.parse(t);
e.szUUID = n.uuid;
e.szVersion = n.version;
e.bConnected = true;
e.bInitConnect = false;
setTimeout(function () {
e.imageHttpPolling() }, 100);
if (e.oOptions.cbConnectSuccess) {
e.oOptions.cbConnectSuccess() } }, error: function a() {} }) } }, {
key: "sendImageHttp", value: function n(e, t, i, r) {
var o = this;
var a = {
success: null, error: null, abort: null };
r = $.extend(a, r);
var u = encodeURIComponent(btoa(s["default"].deflate(t)));
var l = this.splitStr(u);
var f = [];
var c = "";
for (var h = 0, d = l.length;
h < d;
h++) {
if (h === d - 1) {
c = "update=" + (new Date).getTime() + "&isLast=true&data=" + l[h] + "&sequence=" + i } else {
c = "update=" + (new Date).getTime() + "&isLast=false&data=" + l[h] + "&sequence=" + i } f.push(c) } if (f.length > 0) {
var v = function t() {
o.imageHttp(e + "?" + f[0], {
success: function n(e) {
f.shift();
if (f.length > 0) {
if (o.bInitConnect || o.bConnected) {
t() } } else {
if (r.success) {
r.success(e) } } }, error: function i() {
if (r.error) {
r.error() } }, abort: function a() {
if (r.abort) {
r.abort() } } }) };
v() } } }, {
key: "splitStr", value: function r(e) {
var t = this.getByteLen(e);
var n = [];
var i = 1500;
for (var r = 0, o = Math.ceil(t / i);
r < o;
r++) {
n[r] = e.slice(i * r, i * (r + 1)) }
return n } }, {
key: "getByteLen", value: function a(e) {
var t = 0;
var n = "";
for (var i = 0, r = e.length;
i < r;
i++) {
n = e.charAt(i);
if (/[^\x20-\xff]/.test(n)) {
t += 2 } else {
t += 1 } }
return t } }, {
key: "imageHttp", value: function l(e, t) {
var n = {
success: null, error: null, abort: null };
t = $.extend(n, t);
var i = new Image;
i.onload = function () {
if (t.success) {
var e = document.createElement("canvas");
var n = e.getContext("2d");
var r = i.width;
var o = i.height;
e.width = r;
e.height = o;
try {
n.drawImage(i, 0, 0);
var a = n.getImageData(0, 0, r, o).data;
var s = "";
var l = -1;
for (var f = o - 1;
f >= 0;
f--) {
for (var c = 0;
c < r * 4;
c++) {
l = f * r * 4 + c;
if (0 === a[l]) {
break } else if (255 === a[l]) {
continue } else {
s += String.fromCharCode(a[l]) } } } t.success(u.oUtils.utf8to16(s)) } catch (h) {
if (t.error) {
t.error() } } } };
i.onerror = function () {
if (t.error) {
t.error() } };
i.onabort = function () {
if (t.abort) {
t.abort() } };
i.crossOrigin = "anonymous";
i.src = e } }, {
key: "setWindowControlCallback", value: function c(e) {
this.oWindowControlCallback = e } }, {
key: "getServiceVersion", value: function h() {
return this.szVersion } }, {
key: "getRequestUUID", value: function d() {
return this.szUUID } }, {
key: "disconnect", value: function v() {
var e = this;
var t = o["default"].v4();
var n = {
sequence: t, uuid: e.szUUID, cmd: "system.disconnect" };
var i = JSON.stringify(n);
if (e.bConnected) {
e.sendImageHttp(e.szHost + ":" + e.oOptions.iPort + "/imghttp/local", i, t, {
success: function n() {
e.bNormalClose = true;
e.bConnected = false }, error: function r() {
e.bConnected = false } }) } } }, {
key: "imageHttpPolling", value: function p() {
var e = this;
var t = o["default"].v4();
var n = {
sequence: t, uuid: e.szUUID, cmd: "system.get" };
var i = JSON.stringify(n);
if (e.bConnected) {
e.sendImageHttp(e.szHost + ":" + e.oOptions.iPort + "/imghttp/local", i, t, {
success: function n(t) {
e.iGetErrorCount = 0;
if ("timeout" === t) {
setTimeout(function () {
e.imageHttpPolling() }, 100) } else if ("invalid" === t) {
e.bConnected = false;
if (e.oOptions.cbConnectError) {
e.oOptions.cbConnectError() } } else {
var n = JSON.parse(t);
if (typeof n.cmd !== "undefined") {
e.parseCmd(n) } else {} setTimeout(function () {
e.imageHttpPolling() }, 100) } }, error: function r() {
if (5 === e.iGetErrorCount) {
e.bNormalClose = false;
e.bConnected = false;
if (e.oOptions.cbConnectClose) {
e.oOptions.cbConnectClose(e.bNormalClose) } } else {
setTimeout(function () {
e.iGetErrorCount++;
e.imageHttpPolling() }, 100) } } }) } } }, {
key: "sendRequest", value: function m(e) {
var t = this;
var n = new Promise(function (n, i) {
var r = e.cmd.split(".");
var a = "";
if (r.length > 1) {
a = "laputa" === r[0] ? "laputa" : "local" } else {
i() }
var s = o["default"].v4();
e.sequence = s;
e.uuid = t.szUUID;
e.timestamp = (new Date).getTime() + "";
var u = JSON.stringify(e);
if (t.bConnected) {
t.sendImageHttp(t.szHost + ":" + t.oOptions.iPort + "/imghttp/" + a, u, s, {
success: function e(t) {
if (!t) {
return }
var r = JSON.parse(t);
if (0 === r.errorCode) {
n(r) } else {
i(r) } }, error: function r() {
i() } }) } else {
i() } });
return n } }, {
key: "parseCmd", value: function y(e) {
var t = e.cmd;
var n = t.split(".");
var i = n[1];
if ("window" === n[0] || "video" === n[0]) {
if (this.oWindowControlCallback[i]) {
this.oWindowControlCallback[i](e) } } } }]);
return e }();
return e }();
t.ImageHttpRequest = c }, function (e, t, n) {
"use strict";
var i = n(0).assign;
var r = n(33);
var o = n(36);
var a = n(11);
var s = {};
i(s, r, o, a);
e.exports = s }, function (e, t, n) {
"use strict";
var i = n(34);
var r = n(0);
var o = n(9);
var a = n(3);
var s = n(10);
var u = Object.prototype.toString;
var l = 0;
var f = 4;
var c = 0;
var h = 1;
var d = 2;
var v = -1;
var p = 0;
var m = 8;
function y(e) {
if (!(this instanceof y))
return new y(e);
this.options = r.assign({
level: v, method: m, chunkSize: 16384, windowBits: 15, memLevel: 8, strategy: p, to: "" }, e || {});
var t = this.options;
if (t.raw && t.windowBits > 0) {
t.windowBits = -t.windowBits } else if (t.gzip && t.windowBits > 0 && t.windowBits < 16) {
t.windowBits += 16 } this.err = 0;
this.msg = "";
this.ended = false;
this.chunks = [];
this.strm = new s;
this.strm.avail_out = 0;
var n = i.deflateInit2(this.strm, t.level, t.method, t.windowBits, t.memLevel, t.strategy);
if (n !== c) {
throw new Error(a[n]) } if (t.header) {
i.deflateSetHeader(this.strm, t.header) } if (t.dictionary) {
var l;
if (typeof t.dictionary === "string") {
l = o.string2buf(t.dictionary) } else if (u.call(t.dictionary) === "[object ArrayBuffer]") {
l = new Uint8Array(t.dictionary) } else {
l = t.dictionary } n = i.deflateSetDictionary(this.strm, l);
if (n !== c) {
throw new Error(a[n]) } this._dict_set = true } } y.prototype.push = function (e, t) {
var n = this.strm;
var a = this.options.chunkSize;
var s, v;
if (this.ended) {
return false } v = t === ~~t ? t : t === true ? f : l;
if (typeof e === "string") {
n.input = o.string2buf(e) } else if (u.call(e) === "[object ArrayBuffer]") {
n.input = new Uint8Array(e) } else {
n.input = e } n.next_in = 0;
n.avail_in = n.input.length;
do {
if (n.avail_out === 0) {
n.output = new r.Buf8(a);
n.next_out = 0;
n.avail_out = a } s = i.deflate(n, v);
if (s !== h && s !== c) {
this.onEnd(s);
this.ended = true;
return false } if (n.avail_out === 0 || n.avail_in === 0 && (v === f || v === d)) {
if (this.options.to === "string") {
this.onData(o.buf2binstring(r.shrinkBuf(n.output, n.next_out))) } else {
this.onData(r.shrinkBuf(n.output, n.next_out)) } } } while ((n.avail_in > 0 || n.avail_out === 0) && s !== h);
if (v === f) {
s = i.deflateEnd(this.strm);
this.onEnd(s);
this.ended = true;
return s === c } if (v === d) {
this.onEnd(c);
n.avail_out = 0;
return true }
return true };
y.prototype.onData = function (e) {
this.chunks.push(e) };
y.prototype.onEnd = function (e) {
if (e === c) {
if (this.options.to === "string") {
this.result = this.chunks.join("") } else {
this.result = r.flattenChunks(this.chunks) } } this.chunks = [];
this.err = e;
this.msg = this.strm.msg };
function S(e, t) {
var n = new y(t);
n.push(e, true);
if (n.err) {
throw n.msg || a[n.err] }
return n.result } function g(e, t) {
t = t || {};
t.raw = true;
return S(e, t) } function _(e, t) {
t = t || {};
t.gzip = true;
return S(e, t) } t.Deflate = y;
t.deflate = S;
t.deflateRaw = g;
t.gzip = _ }, function (e, t, n) {
"use strict";
var i = n(0);
var r = n(35);
var o = n(7);
var a = n(8);
var s = n(3);
var u = 0;
var l = 1;
var f = 3;
var c = 4;
var h = 5;
var d = 0;
var v = 1;
var p = -2;
var m = -3;
var y = -5;
var S = -1;
var g = 1;
var _ = 2;
var P = 3;
var w = 4;
var b = 0;
var k = 2;
var C = 8;
var R = 9;
var T = 15;
var I = 8;
var x = 29;
var D = 256;
var z = D + 1 + x;
var M = 30;
var E = 19;
var O = 2 * z + 1;
var F = 15;
var q = 3;
var J = 258;
var W = J + q + 1;
var L = 32;
var A = 42;
var B = 69;
var U = 73;
var $ = 91;
var H = 103;
var N = 113;
var G = 666;
var j = 1;
var V = 2;
var X = 3;
var Y = 4;
var Z = 3;
function K(e, t) {
e.msg = s[t];
return t } function Q(e) {
return (e << 1) - (e > 4 ? 9 : 0) } function ee(e) {
var t = e.length;
while (--t >= 0) {
e[t] = 0 } } function te(e) {
var t = e.state;
var n = t.pending;
if (n > e.avail_out) {
n = e.avail_out } if (n === 0) {
return } i.arraySet(e.output, t.pending_buf, t.pending_out, n, e.next_out);
e.next_out += n;
t.pending_out += n;
e.total_out += n;
e.avail_out -= n;
t.pending -= n;
if (t.pending === 0) {
t.pending_out = 0 } } function ne(e, t) {
r._tr_flush_block(e, e.block_start >= 0 ? e.block_start : -1, e.strstart - e.block_start, t);
e.block_start = e.strstart;
te(e.strm) } function ie(e, t) {
e.pending_buf[e.pending++] = t } function re(e, t) {
e.pending_buf[e.pending++] = t >>> 8 & 255;
e.pending_buf[e.pending++] = t & 255 } function oe(e, t, n, r) {
var s = e.avail_in;
if (s > r) {
s = r } if (s === 0) {
return 0 } e.avail_in -= s;
i.arraySet(t, e.input, e.next_in, s, n);
if (e.state.wrap === 1) {
e.adler = o(e.adler, t, s, n) } else if (e.state.wrap === 2) {
e.adler = a(e.adler, t, s, n) } e.next_in += s;
e.total_in += s;
return s } function ae(e, t) {
var n = e.max_chain_length;
var i = e.strstart;
var r;
var o;
var a = e.prev_length;
var s = e.nice_match;
var u = e.strstart > e.w_size - W ? e.strstart - (e.w_size - W) : 0;
var l = e.window;
var f = e.w_mask;
var c = e.prev;
var h = e.strstart + J;
var d = l[i + a - 1];
var v = l[i + a];
if (e.prev_length >= e.good_match) {
n >>= 2 } if (s > e.lookahead) {
s = e.lookahead } do {
r = t;
if (l[r + a] !== v || l[r + a - 1] !== d || l[r] !== l[i] || l[++r] !== l[i + 1]) {
continue } i += 2;
r++;
do {} while (l[++i] === l[++r] && l[++i] === l[++r] && l[++i] === l[++r] && l[++i] === l[++r] && l[++i] === l[++r] && l[++i] === l[++r] && l[++i] === l[++r] && l[++i] === l[++r] && i < h);
o = J - (h - i);
i = h - J;
if (o > a) {
e.match_start = t;
a = o;
if (o >= s) {
break } d = l[i + a - 1];
v = l[i + a] } } while ((t = c[t & f]) > u && --n !== 0);
if (a <= e.lookahead) {
return a }
return e.lookahead } function se(e) {
var t = e.w_size;
var n, r, o, a, s;
do {
a = e.window_size - e.lookahead - e.strstart;
if (e.strstart >= t + (t - W)) {
i.arraySet(e.window, e.window, t, t, 0);
e.match_start -= t;
e.strstart -= t;
e.block_start -= t;
r = e.hash_size;
n = r;
do {
o = e.head[--n];
e.head[n] = o >= t ? o - t : 0 } while (--r);
r = t;
n = r;
do {
o = e.prev[--n];
e.prev[n] = o >= t ? o - t : 0 } while (--r);
a += t } if (e.strm.avail_in === 0) {
break } r = oe(e.strm, e.window, e.strstart + e.lookahead, a);
e.lookahead += r;
if (e.lookahead + e.insert >= q) {
s = e.strstart - e.insert;
e.ins_h = e.window[s];
e.ins_h = (e.ins_h << e.hash_shift ^ e.window[s + 1]) & e.hash_mask;
while (e.insert) {
e.ins_h = (e.ins_h << e.hash_shift ^ e.window[s + q - 1]) & e.hash_mask;
e.prev[s & e.w_mask] = e.head[e.ins_h];
e.head[e.ins_h] = s;
s++;
e.insert--;
if (e.lookahead + e.insert < q) {
break } } } } while (e.lookahead < W && e.strm.avail_in !== 0) } function ue(e, t) {
var n = 65535;
if (n > e.pending_buf_size - 5) {
n = e.pending_buf_size - 5 } for (;
;) {
if (e.lookahead <= 1) {
se(e);
if (e.lookahead === 0 && t === u) {
return j } if (e.lookahead === 0) {
break } } e.strstart += e.lookahead;
e.lookahead = 0;
var i = e.block_start + n;
if (e.strstart === 0 || e.strstart >= i) {
e.lookahead = e.strstart - i;
e.strstart = i;
ne(e, false);
if (e.strm.avail_out === 0) {
return j } } if (e.strstart - e.block_start >= e.w_size - W) {
ne(e, false);
if (e.strm.avail_out === 0) {
return j } } } e.insert = 0;
if (t === c) {
ne(e, true);
if (e.strm.avail_out === 0) {
return X }
return Y } if (e.strstart > e.block_start) {
ne(e, false);
if (e.strm.avail_out === 0) {
return j } }
return j } function le(e, t) {
var n;
var i;
for (;
;) {
if (e.lookahead < W) {
se(e);
if (e.lookahead < W && t === u) {
return j } if (e.lookahead === 0) {
break } } n = 0;
if (e.lookahead >= q) {
e.ins_h = (e.ins_h << e.hash_shift ^ e.window[e.strstart + q - 1]) & e.hash_mask;
n = e.prev[e.strstart & e.w_mask] = e.head[e.ins_h];
e.head[e.ins_h] = e.strstart } if (n !== 0 && e.strstart - n <= e.w_size - W) {
e.match_length = ae(e, n) } if (e.match_length >= q) {
i = r._tr_tally(e, e.strstart - e.match_start, e.match_length - q);
e.lookahead -= e.match_length;
if (e.match_length <= e.max_lazy_match && e.lookahead >= q) {
e.match_length--;
do {
e.strstart++;
e.ins_h = (e.ins_h << e.hash_shift ^ e.window[e.strstart + q - 1]) & e.hash_mask;
n = e.prev[e.strstart & e.w_mask] = e.head[e.ins_h];
e.head[e.ins_h] = e.strstart } while (--e.match_length !== 0);
e.strstart++ } else {
e.strstart += e.match_length;
e.match_length = 0;
e.ins_h = e.window[e.strstart];
e.ins_h = (e.ins_h << e.hash_shift ^ e.window[e.strstart + 1]) & e.hash_mask } } else {
i = r._tr_tally(e, 0, e.window[e.strstart]);
e.lookahead--;
e.strstart++ } if (i) {
ne(e, false);
if (e.strm.avail_out === 0) {
return j } } } e.insert = e.strstart < q - 1 ? e.strstart : q - 1;
if (t === c) {
ne(e, true);
if (e.strm.avail_out === 0) {
return X }
return Y } if (e.last_lit) {
ne(e, false);
if (e.strm.avail_out === 0) {
return j } }
return V } function fe(e, t) {
var n;
var i;
var o;
for (;
;) {
if (e.lookahead < W) {
se(e);
if (e.lookahead < W && t === u) {
return j } if (e.lookahead === 0) {
break } } n = 0;
if (e.lookahead >= q) {
e.ins_h = (e.ins_h << e.hash_shift ^ e.window[e.strstart + q - 1]) & e.hash_mask;
n = e.prev[e.strstart & e.w_mask] = e.head[e.ins_h];
e.head[e.ins_h] = e.strstart } e.prev_length = e.match_length;
e.prev_match = e.match_start;
e.match_length = q - 1;
if (n !== 0 && e.prev_length < e.max_lazy_match && e.strstart - n <= e.w_size - W) {
e.match_length = ae(e, n);
if (e.match_length <= 5 && (e.strategy === g || e.match_length === q && e.strstart - e.match_start > 4096)) {
e.match_length = q - 1 } } if (e.prev_length >= q && e.match_length <= e.prev_length) {
o = e.strstart + e.lookahead - q;
i = r._tr_tally(e, e.strstart - 1 - e.prev_match, e.prev_length - q);
e.lookahead -= e.prev_length - 1;
e.prev_length -= 2;
do {
if (++e.strstart <= o) {
e.ins_h = (e.ins_h << e.hash_shift ^ e.window[e.strstart + q - 1]) & e.hash_mask;
n = e.prev[e.strstart & e.w_mask] = e.head[e.ins_h];
e.head[e.ins_h] = e.strstart } } while (--e.prev_length !== 0);
e.match_available = 0;
e.match_length = q - 1;
e.strstart++;
if (i) {
ne(e, false);
if (e.strm.avail_out === 0) {
return j } } } else if (e.match_available) {
i = r._tr_tally(e, 0, e.window[e.strstart - 1]);
if (i) {
ne(e, false) } e.strstart++;
e.lookahead--;
if (e.strm.avail_out === 0) {
return j } } else {
e.match_available = 1;
e.strstart++;
e.lookahead-- } } if (e.match_available) {
i = r._tr_tally(e, 0, e.window[e.strstart - 1]);
e.match_available = 0 } e.insert = e.strstart < q - 1 ? e.strstart : q - 1;
if (t === c) {
ne(e, true);
if (e.strm.avail_out === 0) {
return X }
return Y } if (e.last_lit) {
ne(e, false);
if (e.strm.avail_out === 0) {
return j } }
return V } function ce(e, t) {
var n;
var i;
var o, a;
var s = e.window;
for (;
;) {
if (e.lookahead <= J) {
se(e);
if (e.lookahead <= J && t === u) {
return j } if (e.lookahead === 0) {
break } } e.match_length = 0;
if (e.lookahead >= q && e.strstart > 0) {
o = e.strstart - 1;
i = s[o];
if (i === s[++o] && i === s[++o] && i === s[++o]) {
a = e.strstart + J;
do {} while (i === s[++o] && i === s[++o] && i === s[++o] && i === s[++o] && i === s[++o] && i === s[++o] && i === s[++o] && i === s[++o] && o < a);
e.match_length = J - (a - o);
if (e.match_length > e.lookahead) {
e.match_length = e.lookahead } } } if (e.match_length >= q) {
n = r._tr_tally(e, 1, e.match_length - q);
e.lookahead -= e.match_length;
e.strstart += e.match_length;
e.match_length = 0 } else {
n = r._tr_tally(e, 0, e.window[e.strstart]);
e.lookahead--;
e.strstart++ } if (n) {
ne(e, false);
if (e.strm.avail_out === 0) {
return j } } } e.insert = 0;
if (t === c) {
ne(e, true);
if (e.strm.avail_out === 0) {
return X }
return Y } if (e.last_lit) {
ne(e, false);
if (e.strm.avail_out === 0) {
return j } }
return V } function he(e, t) {
var n;
for (;
;) {
if (e.lookahead === 0) {
se(e);
if (e.lookahead === 0) {
if (t === u) {
return j }
break } } e.match_length = 0;
n = r._tr_tally(e, 0, e.window[e.strstart]);
e.lookahead--;
e.strstart++;
if (n) {
ne(e, false);
if (e.strm.avail_out === 0) {
return j } } } e.insert = 0;
if (t === c) {
ne(e, true);
if (e.strm.avail_out === 0) {
return X }
return Y } if (e.last_lit) {
ne(e, false);
if (e.strm.avail_out === 0) {
return j } }
return V } function de(e, t, n, i, r) {
this.good_length = e;
this.max_lazy = t;
this.nice_length = n;
this.max_chain = i;
this.func = r }
var ve;
ve = [new de(0, 0, 0, 0, ue), new de(4, 4, 8, 4, le), new de(4, 5, 16, 8, le), new de(4, 6, 32, 32, le), new de(4, 4, 16, 16, fe), new de(8, 16, 32, 32, fe), new de(8, 16, 128, 128, fe), new de(8, 32, 128, 256, fe), new de(32, 128, 258, 1024, fe), new de(32, 258, 258, 4096, fe)];
function pe(e) {
e.window_size = 2 * e.w_size;
ee(e.head);
e.max_lazy_match = ve[e.level].max_lazy;
e.good_match = ve[e.level].good_length;
e.nice_match = ve[e.level].nice_length;
e.max_chain_length = ve[e.level].max_chain;
e.strstart = 0;
e.block_start = 0;
e.lookahead = 0;
e.insert = 0;
e.match_length = e.prev_length = q - 1;
e.match_available = 0;
e.ins_h = 0 } function me() {
this.strm = null;
this.status = 0;
this.pending_buf = null;
this.pending_buf_size = 0;
this.pending_out = 0;
this.pending = 0;
this.wrap = 0;
this.gzhead = null;
this.gzindex = 0;
this.method = C;
this.last_flush = -1;
this.w_size = 0;
this.w_bits = 0;
this.w_mask = 0;
this.window = null;
this.window_size = 0;
this.prev = null;
this.head = null;
this.ins_h = 0;
this.hash_size = 0;
this.hash_bits = 0;
this.hash_mask = 0;
this.hash_shift = 0;
this.block_start = 0;
this.match_length = 0;
this.prev_match = 0;
this.match_available = 0;
this.strstart = 0;
this.match_start = 0;
this.lookahead = 0;
this.prev_length = 0;
this.max_chain_length = 0;
this.max_lazy_match = 0;
this.level = 0;
this.strategy = 0;
this.good_match = 0;
this.nice_match = 0;
this.dyn_ltree = new i.Buf16(O * 2);
this.dyn_dtree = new i.Buf16((2 * M + 1) * 2);
this.bl_tree = new i.Buf16((2 * E + 1) * 2);
ee(this.dyn_ltree);
ee(this.dyn_dtree);
ee(this.bl_tree);
this.l_desc = null;
this.d_desc = null;
this.bl_desc = null;
this.bl_count = new i.Buf16(F + 1);
this.heap = new i.Buf16(2 * z + 1);
ee(this.heap);
this.heap_len = 0;
this.heap_max = 0;
this.depth = new i.Buf16(2 * z + 1);
ee(this.depth);
this.l_buf = 0;
this.lit_bufsize = 0;
this.last_lit = 0;
this.d_buf = 0;
this.opt_len = 0;
this.static_len = 0;
this.matches = 0;
this.insert = 0;
this.bi_buf = 0;
this.bi_valid = 0 } function ye(e) {
var t;
if (!e || !e.state) {
return K(e, p) } e.total_in = e.total_out = 0;
e.data_type = k;
t = e.state;
t.pending = 0;
t.pending_out = 0;
if (t.wrap < 0) {
t.wrap = -t.wrap } t.status = t.wrap ? A : N;
e.adler = t.wrap === 2 ? 0 : 1;
t.last_flush = u;
r._tr_init(t);
return d } function Se(e) {
var t = ye(e);
if (t === d) {
pe(e.state) }
return t } function ge(e, t) {
if (!e || !e.state) {
return p } if (e.state.wrap !== 2) {
return p } e.state.gzhead = t;
return d } function _e(e, t, n, r, o, a) {
if (!e) {
return p }
var s = 1;
if (t === S) {
t = 6 } if (r < 0) {
s = 0;
r = -r } else if (r > 15) {
s = 2;
r -= 16 } if (o < 1 || o > R || n !== C || r < 8 || r > 15 || t < 0 || t > 9 || a < 0 || a > w) {
return K(e, p) } if (r === 8) {
r = 9 }
var u = new me;
e.state = u;
u.strm = e;
u.wrap = s;
u.gzhead = null;
u.w_bits = r;
u.w_size = 1 << u.w_bits;
u.w_mask = u.w_size - 1;
u.hash_bits = o + 7;
u.hash_size = 1 << u.hash_bits;
u.hash_mask = u.hash_size - 1;
u.hash_shift = ~~((u.hash_bits + q - 1) / q);
u.window = new i.Buf8(u.w_size * 2);
u.head = new i.Buf16(u.hash_size);
u.prev = new i.Buf16(u.w_size);
u.lit_bufsize = 1 << o + 6;
u.pending_buf_size = u.lit_bufsize * 4;
u.pending_buf = new i.Buf8(u.pending_buf_size);
u.d_buf = 1 * u.lit_bufsize;
u.l_buf = (1 + 2) * u.lit_bufsize;
u.level = t;
u.strategy = a;
u.method = n;
return Se(e) } function Pe(e, t) {
return _e(e, t, C, T, I, b) } function we(e, t) {
var n, i;
var o, s;
if (!e || !e.state || t > h || t < 0) {
return e ? K(e, p) : p } i = e.state;
if (!e.output || !e.input && e.avail_in !== 0 || i.status === G && t !== c) {
return K(e, e.avail_out === 0 ? y : p) } i.strm = e;
n = i.last_flush;
i.last_flush = t;
if (i.status === A) {
if (i.wrap === 2) {
e.adler = 0;
ie(i, 31);
ie(i, 139);
ie(i, 8);
if (!i.gzhead) {
ie(i, 0);
ie(i, 0);
ie(i, 0);
ie(i, 0);
ie(i, 0);
ie(i, i.level === 9 ? 2 : i.strategy >= _ || i.level < 2 ? 4 : 0);
ie(i, Z);
i.status = N } else {
ie(i, (i.gzhead.text ? 1 : 0) + (i.gzhead.hcrc ? 2 : 0) + (!i.gzhead.extra ? 0 : 4) + (!i.gzhead.name ? 0 : 8) + (!i.gzhead.comment ? 0 : 16));
ie(i, i.gzhead.time & 255);
ie(i, i.gzhead.time >> 8 & 255);
ie(i, i.gzhead.time >> 16 & 255);
ie(i, i.gzhead.time >> 24 & 255);
ie(i, i.level === 9 ? 2 : i.strategy >= _ || i.level < 2 ? 4 : 0);
ie(i, i.gzhead.os & 255);
if (i.gzhead.extra && i.gzhead.extra.length) {
ie(i, i.gzhead.extra.length & 255);
ie(i, i.gzhead.extra.length >> 8 & 255) } if (i.gzhead.hcrc) {
e.adler = a(e.adler, i.pending_buf, i.pending, 0) } i.gzindex = 0;
i.status = B } } else {
var m = C + (i.w_bits - 8 << 4) << 8;
var S = -1;
if (i.strategy >= _ || i.level < 2) {
S = 0 } else if (i.level < 6) {
S = 1 } else if (i.level === 6) {
S = 2 } else {
S = 3 } m |= S << 6;
if (i.strstart !== 0) {
m |= L } m += 31 - m % 31;
i.status = N;
re(i, m);
if (i.strstart !== 0) {
re(i, e.adler >>> 16);
re(i, e.adler & 65535) } e.adler = 1 } } if (i.status === B) {
if (i.gzhead.extra) {
o = i.pending;
while (i.gzindex < (i.gzhead.extra.length & 65535)) {
if (i.pending === i.pending_buf_size) {
if (i.gzhead.hcrc && i.pending > o) {
e.adler = a(e.adler, i.pending_buf, i.pending - o, o) } te(e);
o = i.pending;
if (i.pending === i.pending_buf_size) {
break } } ie(i, i.gzhead.extra[i.gzindex] & 255);
i.gzindex++ } if (i.gzhead.hcrc && i.pending > o) {
e.adler = a(e.adler, i.pending_buf, i.pending - o, o) } if (i.gzindex === i.gzhead.extra.length) {
i.gzindex = 0;
i.status = U } } else {
i.status = U } } if (i.status === U) {
if (i.gzhead.name) {
o = i.pending;
do {
if (i.pending === i.pending_buf_size) {
if (i.gzhead.hcrc && i.pending > o) {
e.adler = a(e.adler, i.pending_buf, i.pending - o, o) } te(e);
o = i.pending;
if (i.pending === i.pending_buf_size) {
s = 1;
break } } if (i.gzindex < i.gzhead.name.length) {
s = i.gzhead.name.charCodeAt(i.gzindex++) & 255 } else {
s = 0 } ie(i, s) } while (s !== 0);
if (i.gzhead.hcrc && i.pending > o) {
e.adler = a(e.adler, i.pending_buf, i.pending - o, o) } if (s === 0) {
i.gzindex = 0;
i.status = $ } } else {
i.status = $ } } if (i.status === $) {
if (i.gzhead.comment) {
o = i.pending;
do {
if (i.pending === i.pending_buf_size) {
if (i.gzhead.hcrc && i.pending > o) {
e.adler = a(e.adler, i.pending_buf, i.pending - o, o) } te(e);
o = i.pending;
if (i.pending === i.pending_buf_size) {
s = 1;
break } } if (i.gzindex < i.gzhead.comment.length) {
s = i.gzhead.comment.charCodeAt(i.gzindex++) & 255 } else {
s = 0 } ie(i, s) } while (s !== 0);
if (i.gzhead.hcrc && i.pending > o) {
e.adler = a(e.adler, i.pending_buf, i.pending - o, o) } if (s === 0) {
i.status = H } } else {
i.status = H } } if (i.status === H) {
if (i.gzhead.hcrc) {
if (i.pending + 2 > i.pending_buf_size) {
te(e) } if (i.pending + 2 <= i.pending_buf_size) {
ie(i, e.adler & 255);
ie(i, e.adler >> 8 & 255);
e.adler = 0;
i.status = N } } else {
i.status = N } } if (i.pending !== 0) {
te(e);
if (e.avail_out === 0) {
i.last_flush = -1;
return d } } else if (e.avail_in === 0 && Q(t) <= Q(n) && t !== c) {
return K(e, y) } if (i.status === G && e.avail_in !== 0) {
return K(e, y) } if (e.avail_in !== 0 || i.lookahead !== 0 || t !== u && i.status !== G) {
var g = i.strategy === _ ? he(i, t) : i.strategy === P ? ce(i, t) : ve[i.level].func(i, t);
if (g === X || g === Y) {
i.status = G } if (g === j || g === X) {
if (e.avail_out === 0) {
i.last_flush = -1 }
return d } if (g === V) {
if (t === l) {
r._tr_align(i) } else if (t !== h) {
r._tr_stored_block(i, 0, 0, false);
if (t === f) {
ee(i.head);
if (i.lookahead === 0) {
i.strstart = 0;
i.block_start = 0;
i.insert = 0 } } } te(e);
if (e.avail_out === 0) {
i.last_flush = -1;
return d } } } if (t !== c) {
return d } if (i.wrap <= 0) {
return v } if (i.wrap === 2) {
ie(i, e.adler & 255);
ie(i, e.adler >> 8 & 255);
ie(i, e.adler >> 16 & 255);
ie(i, e.adler >> 24 & 255);
ie(i, e.total_in & 255);
ie(i, e.total_in >> 8 & 255);
ie(i, e.total_in >> 16 & 255);
ie(i, e.total_in >> 24 & 255) } else {
re(i, e.adler >>> 16);
re(i, e.adler & 65535) } te(e);
if (i.wrap > 0) {
i.wrap = -i.wrap }
return i.pending !== 0 ? d : v } function be(e) {
var t;
if (!e || !e.state) {
return p } t = e.state.status;
if (t !== A && t !== B && t !== U && t !== $ && t !== H && t !== N && t !== G) {
return K(e, p) } e.state = null;
return t === N ? K(e, m) : d } function ke(e, t) {
var n = t.length;
var r;
var a, s;
var u;
var l;
var f;
var c;
var h;
if (!e || !e.state) {
return p } r = e.state;
u = r.wrap;
if (u === 2 || u === 1 && r.status !== A || r.lookahead) {
return p } if (u === 1) {
e.adler = o(e.adler, t, n, 0) } r.wrap = 0;
if (n >= r.w_size) {
if (u === 0) {
ee(r.head);
r.strstart = 0;
r.block_start = 0;
r.insert = 0 } h = new i.Buf8(r.w_size);
i.arraySet(h, t, n - r.w_size, r.w_size, 0);
t = h;
n = r.w_size } l = e.avail_in;
f = e.next_in;
c = e.input;
e.avail_in = n;
e.next_in = 0;
e.input = t;
se(r);
while (r.lookahead >= q) {
a = r.strstart;
s = r.lookahead - (q - 1);
do {
r.ins_h = (r.ins_h << r.hash_shift ^ r.window[a + q - 1]) & r.hash_mask;
r.prev[a & r.w_mask] = r.head[r.ins_h];
r.head[r.ins_h] = a;
a++ } while (--s);
r.strstart = a;
r.lookahead = q - 1;
se(r) } r.strstart += r.lookahead;
r.block_start = r.strstart;
r.insert = r.lookahead;
r.lookahead = 0;
r.match_length = r.prev_length = q - 1;
r.match_available = 0;
e.next_in = f;
e.input = c;
e.avail_in = l;
r.wrap = u;
return d } t.deflateInit = Pe;
t.deflateInit2 = _e;
t.deflateReset = Se;
t.deflateResetKeep = ye;
t.deflateSetHeader = ge;
t.deflate = we;
t.deflateEnd = be;
t.deflateSetDictionary = ke;
t.deflateInfo = "pako deflate (from Nodeca project)" }, function (e, t, n) {
"use strict";
var i = n(0);
var r = 4;
var o = 0;
var a = 1;
var s = 2;
function u(e) {
var t = e.length;
while (--t >= 0) {
e[t] = 0 } }
var l = 0;
var f = 1;
var c = 2;
var h = 3;
var d = 258;
var v = 29;
var p = 256;
var m = p + 1 + v;
var y = 30;
var S = 19;
var g = 2 * m + 1;
var _ = 15;
var P = 16;
var w = 7;
var b = 256;
var k = 16;
var C = 17;
var R = 18;
var T = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0];
var I = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13];
var x = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7];
var D = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
var z = 512;
var M = new Array((m + 2) * 2);
u(M);
var E = new Array(y * 2);
u(E);
var O = new Array(z);
u(O);
var F = new Array(d - h + 1);
u(F);
var q = new Array(v);
u(q);
var J = new Array(y);
u(J);
function W(e, t, n, i, r) {
this.static_tree = e;
this.extra_bits = t;
this.extra_base = n;
this.elems = i;
this.max_length = r;
this.has_stree = e && e.length }
var L;
var A;
var B;
function U(e, t) {
this.dyn_tree = e;
this.max_code = 0;
this.stat_desc = t } function $(e) {
return e < 256 ? O[e] : O[256 + (e >>> 7)] } function H(e, t) {
e.pending_buf[e.pending++] = t & 255;
e.pending_buf[e.pending++] = t >>> 8 & 255 } function N(e, t, n) {
if (e.bi_valid > P - n) {
e.bi_buf |= t << e.bi_valid & 65535;
H(e, e.bi_buf);
e.bi_buf = t >> P - e.bi_valid;
e.bi_valid += n - P } else {
e.bi_buf |= t << e.bi_valid & 65535;
e.bi_valid += n } } function G(e, t, n) {
N(e, n[t * 2], n[t * 2 + 1]) } function j(e, t) {
var n = 0;
do {
n |= e & 1;
e >>>= 1;
n <<= 1 } while (--t > 0);
return n >>> 1 } function V(e) {
if (e.bi_valid === 16) {
H(e, e.bi_buf);
e.bi_buf = 0;
e.bi_valid = 0 } else if (e.bi_valid >= 8) {
e.pending_buf[e.pending++] = e.bi_buf & 255;
e.bi_buf >>= 8;
e.bi_valid -= 8 } } function X(e, t) {
var n = t.dyn_tree;
var i = t.max_code;
var r = t.stat_desc.static_tree;
var o = t.stat_desc.has_stree;
var a = t.stat_desc.extra_bits;
var s = t.stat_desc.extra_base;
var u = t.stat_desc.max_length;
var l;
var f, c;
var h;
var d;
var v;
var p = 0;
for (h = 0;
h <= _;
h++) {
e.bl_count[h] = 0 } n[e.heap[e.heap_max] * 2 + 1] = 0;
for (l = e.heap_max + 1;
l < g;
l++) {
f = e.heap[l];
h = n[n[f * 2 + 1] * 2 + 1] + 1;
if (h > u) {
h = u;
p++ } n[f * 2 + 1] = h;
if (f > i) {
continue } e.bl_count[h]++;
d = 0;
if (f >= s) {
d = a[f - s] } v = n[f * 2];
e.opt_len += v * (h + d);
if (o) {
e.static_len += v * (r[f * 2 + 1] + d) } } if (p === 0) {
return } do {
h = u - 1;
while (e.bl_count[h] === 0) {
h-- } e.bl_count[h]--;
e.bl_count[h + 1] += 2;
e.bl_count[u]--;
p -= 2 } while (p > 0);
for (h = u;
h !== 0;
h--) {
f = e.bl_count[h];
while (f !== 0) {
c = e.heap[--l];
if (c > i) {
continue } if (n[c * 2 + 1] !== h) {
e.opt_len += (h - n[c * 2 + 1]) * n[c * 2];
n[c * 2 + 1] = h } f-- } } } function Y(e, t, n) {
var i = new Array(_ + 1);
var r = 0;
var o;
var a;
for (o = 1;
o <= _;
o++) {
i[o] = r = r + n[o - 1] << 1 } for (a = 0;
a <= t;
a++) {
var s = e[a * 2 + 1];
if (s === 0) {
continue } e[a * 2] = j(i[s]++, s) } } function Z() {
var e;
var t;
var n;
var i;
var r;
var o = new Array(_ + 1);
n = 0;
for (i = 0;
i < v - 1;
i++) {
q[i] = n;
for (e = 0;
e < 1 << T[i];
e++) {
F[n++] = i } } F[n - 1] = i;
r = 0;
for (i = 0;
i < 16;
i++) {
J[i] = r;
for (e = 0;
e < 1 << I[i];
e++) {
O[r++] = i } } r >>= 7;
for (;
i < y;
i++) {
J[i] = r << 7;
for (e = 0;
e < 1 << I[i] - 7;
e++) {
O[256 + r++] = i } } for (t = 0;
t <= _;
t++) {
o[t] = 0 } e = 0;
while (e <= 143) {
M[e * 2 + 1] = 8;
e++;
o[8]++ } while (e <= 255) {
M[e * 2 + 1] = 9;
e++;
o[9]++ } while (e <= 279) {
M[e * 2 + 1] = 7;
e++;
o[7]++ } while (e <= 287) {
M[e * 2 + 1] = 8;
e++;
o[8]++ } Y(M, m + 1, o);
for (e = 0;
e < y;
e++) {
E[e * 2 + 1] = 5;
E[e * 2] = j(e, 5) } L = new W(M, T, p + 1, m, _);
A = new W(E, I, 0, y, _);
B = new W(new Array(0), x, 0, S, w) } function K(e) {
var t;
for (t = 0;
t < m;
t++) {
e.dyn_ltree[t * 2] = 0 } for (t = 0;
t < y;
t++) {
e.dyn_dtree[t * 2] = 0 } for (t = 0;
t < S;
t++) {
e.bl_tree[t * 2] = 0 } e.dyn_ltree[b * 2] = 1;
e.opt_len = e.static_len = 0;
e.last_lit = e.matches = 0 } function Q(e) {
if (e.bi_valid > 8) {
H(e, e.bi_buf) } else if (e.bi_valid > 0) {
e.pending_buf[e.pending++] = e.bi_buf } e.bi_buf = 0;
e.bi_valid = 0 } function ee(e, t, n, r) {
Q(e);
if (r) {
H(e, n);
H(e, ~n) } i.arraySet(e.pending_buf, e.window, t, n, e.pending);
e.pending += n } function te(e, t, n, i) {
var r = t * 2;
var o = n * 2;
return e[r] < e[o] || e[r] === e[o] && i[t] <= i[n] } function ne(e, t, n) {
var i = e.heap[n];
var r = n << 1;
while (r <= e.heap_len) {
if (r < e.heap_len && te(t, e.heap[r + 1], e.heap[r], e.depth)) {
r++ } if (te(t, i, e.heap[r], e.depth)) {
break } e.heap[n] = e.heap[r];
n = r;
r <<= 1 } e.heap[n] = i } function ie(e, t, n) {
var i;
var r;
var o = 0;
var a;
var s;
if (e.last_lit !== 0) {
do {
i = e.pending_buf[e.d_buf + o * 2] << 8 | e.pending_buf[e.d_buf + o * 2 + 1];
r = e.pending_buf[e.l_buf + o];
o++;
if (i === 0) {
G(e, r, t) } else {
a = F[r];
G(e, a + p + 1, t);
s = T[a];
if (s !== 0) {
r -= q[a];
N(e, r, s) } i--;
a = $(i);
G(e, a, n);
s = I[a];
if (s !== 0) {
i -= J[a];
N(e, i, s) } } } while (o < e.last_lit) } G(e, b, t) } function re(e, t) {
var n = t.dyn_tree;
var i = t.stat_desc.static_tree;
var r = t.stat_desc.has_stree;
var o = t.stat_desc.elems;
var a, s;
var u = -1;
var l;
e.heap_len = 0;
e.heap_max = g;
for (a = 0;
a < o;
a++) {
if (n[a * 2] !== 0) {
e.heap[++e.heap_len] = u = a;
e.depth[a] = 0 } else {
n[a * 2 + 1] = 0 } } while (e.heap_len < 2) {
l = e.heap[++e.heap_len] = u < 2 ? ++u : 0;
n[l * 2] = 1;
e.depth[l] = 0;
e.opt_len--;
if (r) {
e.static_len -= i[l * 2 + 1] } } t.max_code = u;
for (a = e.heap_len >> 1;
a >= 1;
a--) {
ne(e, n, a) } l = o;
do {
a = e.heap[1];
e.heap[1] = e.heap[e.heap_len--];
ne(e, n, 1);
s = e.heap[1];
e.heap[--e.heap_max] = a;
e.heap[--e.heap_max] = s;
n[l * 2] = n[a * 2] + n[s * 2];
e.depth[l] = (e.depth[a] >= e.depth[s] ? e.depth[a] : e.depth[s]) + 1;
n[a * 2 + 1] = n[s * 2 + 1] = l;
e.heap[1] = l++;
ne(e, n, 1) } while (e.heap_len >= 2);
e.heap[--e.heap_max] = e.heap[1];
X(e, t);
Y(n, u, e.bl_count) } function oe(e, t, n) {
var i;
var r = -1;
var o;
var a = t[0 * 2 + 1];
var s = 0;
var u = 7;
var l = 4;
if (a === 0) {
u = 138;
l = 3 } t[(n + 1) * 2 + 1] = 65535;
for (i = 0;
i <= n;
i++) {
o = a;
a = t[(i + 1) * 2 + 1];
if (++s < u && o === a) {
continue } else if (s < l) {
e.bl_tree[o * 2] += s } else if (o !== 0) {
if (o !== r) {
e.bl_tree[o * 2]++ } e.bl_tree[k * 2]++ } else if (s <= 10) {
e.bl_tree[C * 2]++ } else {
e.bl_tree[R * 2]++ } s = 0;
r = o;
if (a === 0) {
u = 138;
l = 3 } else if (o === a) {
u = 6;
l = 3 } else {
u = 7;
l = 4 } } } function ae(e, t, n) {
var i;
var r = -1;
var o;
var a = t[0 * 2 + 1];
var s = 0;
var u = 7;
var l = 4;
if (a === 0) {
u = 138;
l = 3 } for (i = 0;
i <= n;
i++) {
o = a;
a = t[(i + 1) * 2 + 1];
if (++s < u && o === a) {
continue } else if (s < l) {
do {
G(e, o, e.bl_tree) } while (--s !== 0) } else if (o !== 0) {
if (o !== r) {
G(e, o, e.bl_tree);
s-- } G(e, k, e.bl_tree);
N(e, s - 3, 2) } else if (s <= 10) {
G(e, C, e.bl_tree);
N(e, s - 3, 3) } else {
G(e, R, e.bl_tree);
N(e, s - 11, 7) } s = 0;
r = o;
if (a === 0) {
u = 138;
l = 3 } else if (o === a) {
u = 6;
l = 3 } else {
u = 7;
l = 4 } } } function se(e) {
var t;
oe(e, e.dyn_ltree, e.l_desc.max_code);
oe(e, e.dyn_dtree, e.d_desc.max_code);
re(e, e.bl_desc);
for (t = S - 1;
t >= 3;
t--) {
if (e.bl_tree[D[t] * 2 + 1] !== 0) {
break } } e.opt_len += 3 * (t + 1) + 5 + 5 + 4;
return t } function ue(e, t, n, i) {
var r;
N(e, t - 257, 5);
N(e, n - 1, 5);
N(e, i - 4, 4);
for (r = 0;
r < i;
r++) {
N(e, e.bl_tree[D[r] * 2 + 1], 3) } ae(e, e.dyn_ltree, t - 1);
ae(e, e.dyn_dtree, n - 1) } function le(e) {
var t = 4093624447;
var n;
for (n = 0;
n <= 31;
n++ , t >>>= 1) {
if (t & 1 && e.dyn_ltree[n * 2] !== 0) {
return o } } if (e.dyn_ltree[9 * 2] !== 0 || e.dyn_ltree[10 * 2] !== 0 || e.dyn_ltree[13 * 2] !== 0) {
return a } for (n = 32;
n < p;
n++) {
if (e.dyn_ltree[n * 2] !== 0) {
return a } }
return o }
var fe = false;
function ce(e) {
if (!fe) {
Z();
fe = true } e.l_desc = new U(e.dyn_ltree, L);
e.d_desc = new U(e.dyn_dtree, A);
e.bl_desc = new U(e.bl_tree, B);
e.bi_buf = 0;
e.bi_valid = 0;
K(e) } function he(e, t, n, i) {
N(e, (l << 1) + (i ? 1 : 0), 3);
ee(e, t, n, true) } function de(e) {
N(e, f << 1, 3);
G(e, b, M);
V(e) } function ve(e, t, n, i) {
var o, a;
var u = 0;
if (e.level > 0) {
if (e.strm.data_type === s) {
e.strm.data_type = le(e) } re(e, e.l_desc);
re(e, e.d_desc);
u = se(e);
o = e.opt_len + 3 + 7 >>> 3;
a = e.static_len + 3 + 7 >>> 3;
if (a <= o) {
o = a } } else {
o = a = n + 5 } if (n + 4 <= o && t !== -1) {
he(e, t, n, i) } else if (e.strategy === r || a === o) {
N(e, (f << 1) + (i ? 1 : 0), 3);
ie(e, M, E) } else {
N(e, (c << 1) + (i ? 1 : 0), 3);
ue(e, e.l_desc.max_code + 1, e.d_desc.max_code + 1, u + 1);
ie(e, e.dyn_ltree, e.dyn_dtree) } K(e);
if (i) {
Q(e) } } function pe(e, t, n) {
e.pending_buf[e.d_buf + e.last_lit * 2] = t >>> 8 & 255;
e.pending_buf[e.d_buf + e.last_lit * 2 + 1] = t & 255;
e.pending_buf[e.l_buf + e.last_lit] = n & 255;
e.last_lit++;
if (t === 0) {
e.dyn_ltree[n * 2]++ } else {
e.matches++;
t--;
e.dyn_ltree[(F[n] + p + 1) * 2]++;
e.dyn_dtree[$(t) * 2]++ }
return e.last_lit === e.lit_bufsize - 1 } t._tr_init = ce;
t._tr_stored_block = he;
t._tr_flush_block = ve;
t._tr_tally = pe;
t._tr_align = de }, function (e, t, n) {
"use strict";
var i = n(37);
var r = n(0);
var o = n(9);
var a = n(11);
var s = n(3);
var u = n(10);
var l = n(40);
var f = Object.prototype.toString;
function c(e) {
if (!(this instanceof c))
return new c(e);
this.options = r.assign({
chunkSize: 16384, windowBits: 0, to: "" }, e || {});
var t = this.options;
if (t.raw && t.windowBits >= 0 && t.windowBits < 16) {
t.windowBits = -t.windowBits;
if (t.windowBits === 0) {
t.windowBits = -15 } } if (t.windowBits >= 0 && t.windowBits < 16 && !(e && e.windowBits)) {
t.windowBits += 32 } if (t.windowBits > 15 && t.windowBits < 48) {
if ((t.windowBits & 15) === 0) {
t.windowBits |= 15 } } this.err = 0;
this.msg = "";
this.ended = false;
this.chunks = [];
this.strm = new u;
this.strm.avail_out = 0;
var n = i.inflateInit2(this.strm, t.windowBits);
if (n !== a.Z_OK) {
throw new Error(s[n]) } this.header = new l;
i.inflateGetHeader(this.strm, this.header) } c.prototype.push = function (e, t) {
var n = this.strm;
var s = this.options.chunkSize;
var u = this.options.dictionary;
var l, c;
var h, d, v;
var p;
var m = false;
if (this.ended) {
return false } c = t === ~~t ? t : t === true ? a.Z_FINISH : a.Z_NO_FLUSH;
if (typeof e === "string") {
n.input = o.binstring2buf(e) } else if (f.call(e) === "[object ArrayBuffer]") {
n.input = new Uint8Array(e) } else {
n.input = e } n.next_in = 0;
n.avail_in = n.input.length;
do {
if (n.avail_out === 0) {
n.output = new r.Buf8(s);
n.next_out = 0;
n.avail_out = s } l = i.inflate(n, a.Z_NO_FLUSH);
if (l === a.Z_NEED_DICT && u) {
if (typeof u === "string") {
p = o.string2buf(u) } else if (f.call(u) === "[object ArrayBuffer]") {
p = new Uint8Array(u) } else {
p = u } l = i.inflateSetDictionary(this.strm, p) } if (l === a.Z_BUF_ERROR && m === true) {
l = a.Z_OK;
m = false } if (l !== a.Z_STREAM_END && l !== a.Z_OK) {
this.onEnd(l);
this.ended = true;
return false } if (n.next_out) {
if (n.avail_out === 0 || l === a.Z_STREAM_END || n.avail_in === 0 && (c === a.Z_FINISH || c === a.Z_SYNC_FLUSH)) {
if (this.options.to === "string") {
h = o.utf8border(n.output, n.next_out);
d = n.next_out - h;
v = o.buf2string(n.output, h);
n.next_out = d;
n.avail_out = s - d;
if (d) {
r.arraySet(n.output, n.output, h, d, 0) } this.onData(v) } else {
this.onData(r.shrinkBuf(n.output, n.next_out)) } } } if (n.avail_in === 0 && n.avail_out === 0) {
m = true } } while ((n.avail_in > 0 || n.avail_out === 0) && l !== a.Z_STREAM_END);
if (l === a.Z_STREAM_END) {
c = a.Z_FINISH } if (c === a.Z_FINISH) {
l = i.inflateEnd(this.strm);
this.onEnd(l);
this.ended = true;
return l === a.Z_OK } if (c === a.Z_SYNC_FLUSH) {
this.onEnd(a.Z_OK);
n.avail_out = 0;
return true }
return true };
c.prototype.onData = function (e) {
this.chunks.push(e) };
c.prototype.onEnd = function (e) {
if (e === a.Z_OK) {
if (this.options.to === "string") {
this.result = this.chunks.join("") } else {
this.result = r.flattenChunks(this.chunks) } } this.chunks = [];
this.err = e;
this.msg = this.strm.msg };
function h(e, t) {
var n = new c(t);
n.push(e, true);
if (n.err) {
throw n.msg || s[n.err] }
return n.result } function d(e, t) {
t = t || {};
t.raw = true;
return h(e, t) } t.Inflate = c;
t.inflate = h;
t.inflateRaw = d;
t.ungzip = h }, function (e, t, n) {
"use strict";
var i = n(0);
var r = n(7);
var o = n(8);
var a = n(38);
var s = n(39);
var u = 0;
var l = 1;
var f = 2;
var c = 4;
var h = 5;
var d = 6;
var v = 0;
var p = 1;
var m = 2;
var y = -2;
var S = -3;
var g = -4;
var _ = -5;
var P = 8;
var w = 1;
var b = 2;
var k = 3;
var C = 4;
var R = 5;
var T = 6;
var I = 7;
var x = 8;
var D = 9;
var z = 10;
var M = 11;
var E = 12;
var O = 13;
var F = 14;
var q = 15;
var J = 16;
var W = 17;
var L = 18;
var A = 19;
var B = 20;
var U = 21;
var $ = 22;
var H = 23;
var N = 24;
var G = 25;
var j = 26;
var V = 27;
var X = 28;
var Y = 29;
var Z = 30;
var K = 31;
var Q = 32;
var ee = 852;
var te = 592;
var ne = 15;
var ie = ne;
function re(e) {
return (e >>> 24 & 255) + (e >>> 8 & 65280) + ((e & 65280) << 8) + ((e & 255) << 24) } function oe() {
this.mode = 0;
this.last = false;
this.wrap = 0;
this.havedict = false;
this.flags = 0;
this.dmax = 0;
this.check = 0;
this.total = 0;
this.head = null;
this.wbits = 0;
this.wsize = 0;
this.whave = 0;
this.wnext = 0;
this.window = null;
this.hold = 0;
this.bits = 0;
this.length = 0;
this.offset = 0;
this.extra = 0;
this.lencode = null;
this.distcode = null;
this.lenbits = 0;
this.distbits = 0;
this.ncode = 0;
this.nlen = 0;
this.ndist = 0;
this.have = 0;
this.next = null;
this.lens = new i.Buf16(320);
this.work = new i.Buf16(288);
this.lendyn = null;
this.distdyn = null;
this.sane = 0;
this.back = 0;
this.was = 0 } function ae(e) {
var t;
if (!e || !e.state) {
return y } t = e.state;
e.total_in = e.total_out = t.total = 0;
e.msg = "";
if (t.wrap) {
e.adler = t.wrap & 1 } t.mode = w;
t.last = 0;
t.havedict = 0;
t.dmax = 32768;
t.head = null;
t.hold = 0;
t.bits = 0;
t.lencode = t.lendyn = new i.Buf32(ee);
t.distcode = t.distdyn = new i.Buf32(te);
t.sane = 1;
t.back = -1;
return v } function se(e) {
var t;
if (!e || !e.state) {
return y } t = e.state;
t.wsize = 0;
t.whave = 0;
t.wnext = 0;
return ae(e) } function ue(e, t) {
var n;
var i;
if (!e || !e.state) {
return y } i = e.state;
if (t < 0) {
n = 0;
t = -t } else {
n = (t >> 4) + 1;
if (t < 48) {
t &= 15 } } if (t && (t < 8 || t > 15)) {
return y } if (i.window !== null && i.wbits !== t) {
i.window = null } i.wrap = n;
i.wbits = t;
return se(e) } function le(e, t) {
var n;
var i;
if (!e) {
return y } i = new oe;
e.state = i;
i.window = null;
n = ue(e, t);
if (n !== v) {
e.state = null }
return n } function fe(e) {
return le(e, ie) }
var ce = true;
var he, de;
function ve(e) {
if (ce) {
var t;
he = new i.Buf32(512);
de = new i.Buf32(32);
t = 0;
while (t < 144) {
e.lens[t++] = 8 } while (t < 256) {
e.lens[t++] = 9 } while (t < 280) {
e.lens[t++] = 7 } while (t < 288) {
e.lens[t++] = 8 } s(l, e.lens, 0, 288, he, 0, e.work, {
bits: 9 });
t = 0;
while (t < 32) {
e.lens[t++] = 5 } s(f, e.lens, 0, 32, de, 0, e.work, {
bits: 5 });
ce = false } e.lencode = he;
e.lenbits = 9;
e.distcode = de;
e.distbits = 5 } function pe(e, t, n, r) {
var o;
var a = e.state;
if (a.window === null) {
a.wsize = 1 << a.wbits;
a.wnext = 0;
a.whave = 0;
a.window = new i.Buf8(a.wsize) } if (r >= a.wsize) {
i.arraySet(a.window, t, n - a.wsize, a.wsize, 0);
a.wnext = 0;
a.whave = a.wsize } else {
o = a.wsize - a.wnext;
if (o > r) {
o = r } i.arraySet(a.window, t, n - r, o, a.wnext);
r -= o;
if (r) {
i.arraySet(a.window, t, n - r, r, 0);
a.wnext = r;
a.whave = a.wsize } else {
a.wnext += o;
if (a.wnext === a.wsize) {
a.wnext = 0 } if (a.whave < a.wsize) {
a.whave += o } } }
return 0 } function me(e, t) {
var n;
var ee, te;
var ne;
var ie;
var oe, ae;
var se;
var ue;
var le, fe;
var ce;
var he;
var de;
var me = 0;
var ye, Se, ge;
var _e, Pe, we;
var be;
var ke;
var Ce = new i.Buf8(4);
var Re;
var Te;
var Ie = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
if (!e || !e.state || !e.output || !e.input && e.avail_in !== 0) {
return y } n = e.state;
if (n.mode === E) {
n.mode = O } ie = e.next_out;
te = e.output;
ae = e.avail_out;
ne = e.next_in;
ee = e.input;
oe = e.avail_in;
se = n.hold;
ue = n.bits;
le = oe;
fe = ae;
ke = v;
e: for (;
;) {
switch (n.mode) {
case w: if (n.wrap === 0) {
n.mode = O;
break } while (ue < 16) {
if (oe === 0) {
break e } oe--;
se += ee[ne++] << ue;
ue += 8 } if (n.wrap & 2 && se === 35615) {
n.check = 0;
Ce[0] = se & 255;
Ce[1] = se >>> 8 & 255;
n.check = o(n.check, Ce, 2, 0);
se = 0;
ue = 0;
n.mode = b;
break } n.flags = 0;
if (n.head) {
n.head.done = false } if (!(n.wrap & 1) || (((se & 255) << 8) + (se >> 8)) % 31) {
e.msg = "incorrect header check";
n.mode = Z;
break } if ((se & 15) !== P) {
e.msg = "unknown compression method";
n.mode = Z;
break } se >>>= 4;
ue -= 4;
be = (se & 15) + 8;
if (n.wbits === 0) {
n.wbits = be } else if (be > n.wbits) {
e.msg = "invalid window size";
n.mode = Z;
break } n.dmax = 1 << be;
e.adler = n.check = 1;
n.mode = se & 512 ? z : E;
se = 0;
ue = 0;
break;
case b: while (ue < 16) {
if (oe === 0) {
break e } oe--;
se += ee[ne++] << ue;
ue += 8 } n.flags = se;
if ((n.flags & 255) !== P) {
e.msg = "unknown compression method";
n.mode = Z;
break } if (n.flags & 57344) {
e.msg = "unknown header flags set";
n.mode = Z;
break } if (n.head) {
n.head.text = se >> 8 & 1 } if (n.flags & 512) {
Ce[0] = se & 255;
Ce[1] = se >>> 8 & 255;
n.check = o(n.check, Ce, 2, 0) } se = 0;
ue = 0;
n.mode = k;
case k: while (ue < 32) {
if (oe === 0) {
break e } oe--;
se += ee[ne++] << ue;
ue += 8 } if (n.head) {
n.head.time = se } if (n.flags & 512) {
Ce[0] = se & 255;
Ce[1] = se >>> 8 & 255;
Ce[2] = se >>> 16 & 255;
Ce[3] = se >>> 24 & 255;
n.check = o(n.check, Ce, 4, 0) } se = 0;
ue = 0;
n.mode = C;
case C: while (ue < 16) {
if (oe === 0) {
break e } oe--;
se += ee[ne++] << ue;
ue += 8 } if (n.head) {
n.head.xflags = se & 255;
n.head.os = se >> 8 } if (n.flags & 512) {
Ce[0] = se & 255;
Ce[1] = se >>> 8 & 255;
n.check = o(n.check, Ce, 2, 0) } se = 0;
ue = 0;
n.mode = R;
case R: if (n.flags & 1024) {
while (ue < 16) {
if (oe === 0) {
break e } oe--;
se += ee[ne++] << ue;
ue += 8 } n.length = se;
if (n.head) {
n.head.extra_len = se } if (n.flags & 512) {
Ce[0] = se & 255;
Ce[1] = se >>> 8 & 255;
n.check = o(n.check, Ce, 2, 0) } se = 0;
ue = 0 } else if (n.head) {
n.head.extra = null } n.mode = T;
case T: if (n.flags & 1024) {
ce = n.length;
if (ce > oe) {
ce = oe } if (ce) {
if (n.head) {
be = n.head.extra_len - n.length;
if (!n.head.extra) {
n.head.extra = new Array(n.head.extra_len) } i.arraySet(n.head.extra, ee, ne, ce, be) } if (n.flags & 512) {
n.check = o(n.check, ee, ce, ne) } oe -= ce;
ne += ce;
n.length -= ce } if (n.length) {
break e } } n.length = 0;
n.mode = I;
case I: if (n.flags & 2048) {
if (oe === 0) {
break e } ce = 0;
do {
be = ee[ne + ce++];
if (n.head && be && n.length < 65536) {
n.head.name += String.fromCharCode(be) } } while (be && ce < oe);
if (n.flags & 512) {
n.check = o(n.check, ee, ce, ne) } oe -= ce;
ne += ce;
if (be) {
break e } } else if (n.head) {
n.head.name = null } n.length = 0;
n.mode = x;
case x: if (n.flags & 4096) {
if (oe === 0) {
break e } ce = 0;
do {
be = ee[ne + ce++];
if (n.head && be && n.length < 65536) {
n.head.comment += String.fromCharCode(be) } } while (be && ce < oe);
if (n.flags & 512) {
n.check = o(n.check, ee, ce, ne) } oe -= ce;
ne += ce;
if (be) {
break e } } else if (n.head) {
n.head.comment = null } n.mode = D;
case D: if (n.flags & 512) {
while (ue < 16) {
if (oe === 0) {
break e } oe--;
se += ee[ne++] << ue;
ue += 8 } if (se !== (n.check & 65535)) {
e.msg = "header crc mismatch";
n.mode = Z;
break } se = 0;
ue = 0 } if (n.head) {
n.head.hcrc = n.flags >> 9 & 1;
n.head.done = true } e.adler = n.check = 0;
n.mode = E;
break;
case z: while (ue < 32) {
if (oe === 0) {
break e } oe--;
se += ee[ne++] << ue;
ue += 8 } e.adler = n.check = re(se);
se = 0;
ue = 0;
n.mode = M;
case M: if (n.havedict === 0) {
e.next_out = ie;
e.avail_out = ae;
e.next_in = ne;
e.avail_in = oe;
n.hold = se;
n.bits = ue;
return m } e.adler = n.check = 1;
n.mode = E;
case E: if (t === h || t === d) {
break e } case O: if (n.last) {
se >>>= ue & 7;
ue -= ue & 7;
n.mode = V;
break } while (ue < 3) {
if (oe === 0) {
break e } oe--;
se += ee[ne++] << ue;
ue += 8 } n.last = se & 1;
se >>>= 1;
ue -= 1;
switch (se & 3) {
case 0: n.mode = F;
break;
case 1: ve(n);
n.mode = B;
if (t === d) {
se >>>= 2;
ue -= 2;
break e }
break;
case 2: n.mode = W;
break;
case 3: e.msg = "invalid block type";
n.mode = Z }se >>>= 2;
ue -= 2;
break;
case F: se >>>= ue & 7;
ue -= ue & 7;
while (ue < 32) {
if (oe === 0) {
break e } oe--;
se += ee[ne++] << ue;
ue += 8 } if ((se & 65535) !== (se >>> 16 ^ 65535)) {
e.msg = "invalid stored block lengths";
n.mode = Z;
break } n.length = se & 65535;
se = 0;
ue = 0;
n.mode = q;
if (t === d) {
break e } case q: n.mode = J;
case J: ce = n.length;
if (ce) {
if (ce > oe) {
ce = oe } if (ce > ae) {
ce = ae } if (ce === 0) {
break e } i.arraySet(te, ee, ne, ce, ie);
oe -= ce;
ne += ce;
ae -= ce;
ie += ce;
n.length -= ce;
break } n.mode = E;
break;
case W: while (ue < 14) {
if (oe === 0) {
break e } oe--;
se += ee[ne++] << ue;
ue += 8 } n.nlen = (se & 31) + 257;
se >>>= 5;
ue -= 5;
n.ndist = (se & 31) + 1;
se >>>= 5;
ue -= 5;
n.ncode = (se & 15) + 4;
se >>>= 4;
ue -= 4;
if (n.nlen > 286 || n.ndist > 30) {
e.msg = "too many length or distance symbols";
n.mode = Z;
break } n.have = 0;
n.mode = L;
case L: while (n.have < n.ncode) {
while (ue < 3) {
if (oe === 0) {
break e } oe--;
se += ee[ne++] << ue;
ue += 8 } n.lens[Ie[n.have++]] = se & 7;
se >>>= 3;
ue -= 3 } while (n.have < 19) {
n.lens[Ie[n.have++]] = 0 } n.lencode = n.lendyn;
n.lenbits = 7;
Re = {
bits: n.lenbits };
ke = s(u, n.lens, 0, 19, n.lencode, 0, n.work, Re);
n.lenbits = Re.bits;
if (ke) {
e.msg = "invalid code lengths set";
n.mode = Z;
break } n.have = 0;
n.mode = A;
case A: while (n.have < n.nlen + n.ndist) {
for (;
;) {
me = n.lencode[se & (1 << n.lenbits) - 1];
ye = me >>> 24;
Se = me >>> 16 & 255;
ge = me & 65535;
if (ye <= ue) {
break } if (oe === 0) {
break e } oe--;
se += ee[ne++] << ue;
ue += 8 } if (ge < 16) {
se >>>= ye;
ue -= ye;
n.lens[n.have++] = ge } else {
if (ge === 16) {
Te = ye + 2;
while (ue < Te) {
if (oe === 0) {
break e } oe--;
se += ee[ne++] << ue;
ue += 8 } se >>>= ye;
ue -= ye;
if (n.have === 0) {
e.msg = "invalid bit length repeat";
n.mode = Z;
break } be = n.lens[n.have - 1];
ce = 3 + (se & 3);
se >>>= 2;
ue -= 2 } else if (ge === 17) {
Te = ye + 3;
while (ue < Te) {
if (oe === 0) {
break e } oe--;
se += ee[ne++] << ue;
ue += 8 } se >>>= ye;
ue -= ye;
be = 0;
ce = 3 + (se & 7);
se >>>= 3;
ue -= 3 } else {
Te = ye + 7;
while (ue < Te) {
if (oe === 0) {
break e } oe--;
se += ee[ne++] << ue;
ue += 8 } se >>>= ye;
ue -= ye;
be = 0;
ce = 11 + (se & 127);
se >>>= 7;
ue -= 7 } if (n.have + ce > n.nlen + n.ndist) {
e.msg = "invalid bit length repeat";
n.mode = Z;
break } while (ce--) {
n.lens[n.have++] = be } } } if (n.mode === Z) {
break } if (n.lens[256] === 0) {
e.msg = "invalid code -- missing end-of-block";
n.mode = Z;
break } n.lenbits = 9;
Re = {
bits: n.lenbits };
ke = s(l, n.lens, 0, n.nlen, n.lencode, 0, n.work, Re);
n.lenbits = Re.bits;
if (ke) {
e.msg = "invalid literal/lengths set";
n.mode = Z;
break } n.distbits = 6;
n.distcode = n.distdyn;
Re = {
bits: n.distbits };
ke = s(f, n.lens, n.nlen, n.ndist, n.distcode, 0, n.work, Re);
n.distbits = Re.bits;
if (ke) {
e.msg = "invalid distances set";
n.mode = Z;
break } n.mode = B;
if (t === d) {
break e } case B: n.mode = U;
case U: if (oe >= 6 && ae >= 258) {
e.next_out = ie;
e.avail_out = ae;
e.next_in = ne;
e.avail_in = oe;
n.hold = se;
n.bits = ue;
a(e, fe);
ie = e.next_out;
te = e.output;
ae = e.avail_out;
ne = e.next_in;
ee = e.input;
oe = e.avail_in;
se = n.hold;
ue = n.bits;
if (n.mode === E) {
n.back = -1 }
break } n.back = 0;
for (;
;) {
me = n.lencode[se & (1 << n.lenbits) - 1];
ye = me >>> 24;
Se = me >>> 16 & 255;
ge = me & 65535;
if (ye <= ue) {
break } if (oe === 0) {
break e } oe--;
se += ee[ne++] << ue;
ue += 8 } if (Se && (Se & 240) === 0) {
_e = ye;
Pe = Se;
we = ge;
for (;
;) {
me = n.lencode[we + ((se & (1 << _e + Pe) - 1) >> _e)];
ye = me >>> 24;
Se = me >>> 16 & 255;
ge = me & 65535;
if (_e + ye <= ue) {
break } if (oe === 0) {
break e } oe--;
se += ee[ne++] << ue;
ue += 8 } se >>>= _e;
ue -= _e;
n.back += _e } se >>>= ye;
ue -= ye;
n.back += ye;
n.length = ge;
if (Se === 0) {
n.mode = j;
break } if (Se & 32) {
n.back = -1;
n.mode = E;
break } if (Se & 64) {
e.msg = "invalid literal/length code";
n.mode = Z;
break } n.extra = Se & 15;
n.mode = $;
case $: if (n.extra) {
Te = n.extra;
while (ue < Te) {
if (oe === 0) {
break e } oe--;
se += ee[ne++] << ue;
ue += 8 } n.length += se & (1 << n.extra) - 1;
se >>>= n.extra;
ue -= n.extra;
n.back += n.extra } n.was = n.length;
n.mode = H;
case H: for (;
;) {
me = n.distcode[se & (1 << n.distbits) - 1];
ye = me >>> 24;
Se = me >>> 16 & 255;
ge = me & 65535;
if (ye <= ue) {
break } if (oe === 0) {
break e } oe--;
se += ee[ne++] << ue;
ue += 8 } if ((Se & 240) === 0) {
_e = ye;
Pe = Se;
we = ge;
for (;
;) {
me = n.distcode[we + ((se & (1 << _e + Pe) - 1) >> _e)];
ye = me >>> 24;
Se = me >>> 16 & 255;
ge = me & 65535;
if (_e + ye <= ue) {
break } if (oe === 0) {
break e } oe--;
se += ee[ne++] << ue;
ue += 8 } se >>>= _e;
ue -= _e;
n.back += _e } se >>>= ye;
ue -= ye;
n.back += ye;
if (Se & 64) {
e.msg = "invalid distance code";
n.mode = Z;
break } n.offset = ge;
n.extra = Se & 15;
n.mode = N;
case N: if (n.extra) {
Te = n.extra;
while (ue < Te) {
if (oe === 0) {
break e } oe--;
se += ee[ne++] << ue;
ue += 8 } n.offset += se & (1 << n.extra) - 1;
se >>>= n.extra;
ue -= n.extra;
n.back += n.extra } if (n.offset > n.dmax) {
e.msg = "invalid distance too far back";
n.mode = Z;
break } n.mode = G;
case G: if (ae === 0) {
break e } ce = fe - ae;
if (n.offset > ce) {
ce = n.offset - ce;
if (ce > n.whave) {
if (n.sane) {
e.msg = "invalid distance too far back";
n.mode = Z;
break } } if (ce > n.wnext) {
ce -= n.wnext;
he = n.wsize - ce } else {
he = n.wnext - ce } if (ce > n.length) {
ce = n.length } de = n.window } else {
de = te;
he = ie - n.offset;
ce = n.length } if (ce > ae) {
ce = ae } ae -= ce;
n.length -= ce;
do {
te[ie++] = de[he++] } while (--ce);
if (n.length === 0) {
n.mode = U }
break;
case j: if (ae === 0) {
break e } te[ie++] = n.length;
ae--;
n.mode = U;
break;
case V: if (n.wrap) {
while (ue < 32) {
if (oe === 0) {
break e } oe--;
se |= ee[ne++] << ue;
ue += 8 } fe -= ae;
e.total_out += fe;
n.total += fe;
if (fe) {
e.adler = n.check = n.flags ? o(n.check, te, fe, ie - fe) : r(n.check, te, fe, ie - fe) } fe = ae;
if ((n.flags ? se : re(se)) !== n.check) {
e.msg = "incorrect data check";
n.mode = Z;
break } se = 0;
ue = 0 } n.mode = X;
case X: if (n.wrap && n.flags) {
while (ue < 32) {
if (oe === 0) {
break e } oe--;
se += ee[ne++] << ue;
ue += 8 } if (se !== (n.total & 4294967295)) {
e.msg = "incorrect length check";
n.mode = Z;
break } se = 0;
ue = 0 } n.mode = Y;
case Y: ke = p;
break e;
case Z: ke = S;
break e;
case K:
return g;
case Q: default:
return y } } e.next_out = ie;
e.avail_out = ae;
e.next_in = ne;
e.avail_in = oe;
n.hold = se;
n.bits = ue;
if (n.wsize || fe !== e.avail_out && n.mode < Z && (n.mode < V || t !== c)) {
if (pe(e, e.output, e.next_out, fe - e.avail_out)) {
n.mode = K;
return g } } le -= e.avail_in;
fe -= e.avail_out;
e.total_in += le;
e.total_out += fe;
n.total += fe;
if (n.wrap && fe) {
e.adler = n.check = n.flags ? o(n.check, te, fe, e.next_out - fe) : r(n.check, te, fe, e.next_out - fe) } e.data_type = n.bits + (n.last ? 64 : 0) + (n.mode === E ? 128 : 0) + (n.mode === B || n.mode === q ? 256 : 0);
if ((le === 0 && fe === 0 || t === c) && ke === v) {
ke = _ }
return ke } function ye(e) {
if (!e || !e.state) {
return y }
var t = e.state;
if (t.window) {
t.window = null } e.state = null;
return v } function Se(e, t) {
var n;
if (!e || !e.state) {
return y } n = e.state;
if ((n.wrap & 2) === 0) {
return y } n.head = t;
t.done = false;
return v } function ge(e, t) {
var n = t.length;
var i;
var o;
var a;
if (!e || !e.state) {
return y } i = e.state;
if (i.wrap !== 0 && i.mode !== M) {
return y } if (i.mode === M) {
o = 1;
o = r(o, t, n, 0);
if (o !== i.check) {
return S } } a = pe(e, t, n, n);
if (a) {
i.mode = K;
return g } i.havedict = 1;
return v } t.inflateReset = se;
t.inflateReset2 = ue;
t.inflateResetKeep = ae;
t.inflateInit = fe;
t.inflateInit2 = le;
t.inflate = me;
t.inflateEnd = ye;
t.inflateGetHeader = Se;
t.inflateSetDictionary = ge;
t.inflateInfo = "pako inflate (from Nodeca project)" }, function (e, t, n) {
"use strict";
var i = 30;
var r = 12;
e.exports = function o(e, t) {
var n;
var o;
var a;
var s;
var u;
var l;
var f;
var c;
var h;
var d;
var v;
var p;
var m;
var y;
var S;
var g;
var _;
var P;
var w;
var b;
var k;
var C;
var R;
var T, I;
n = e.state;
o = e.next_in;
T = e.input;
a = o + (e.avail_in - 5);
s = e.next_out;
I = e.output;
u = s - (t - e.avail_out);
l = s + (e.avail_out - 257);
f = n.dmax;
c = n.wsize;
h = n.whave;
d = n.wnext;
v = n.window;
p = n.hold;
m = n.bits;
y = n.lencode;
S = n.distcode;
g = (1 << n.lenbits) - 1;
_ = (1 << n.distbits) - 1;
e: do {
if (m < 15) {
p += T[o++] << m;
m += 8;
p += T[o++] << m;
m += 8 } P = y[p & g];
t: for (;
;) {
w = P >>> 24;
p >>>= w;
m -= w;
w = P >>> 16 & 255;
if (w === 0) {
I[s++] = P & 65535 } else if (w & 16) {
b = P & 65535;
w &= 15;
if (w) {
if (m < w) {
p += T[o++] << m;
m += 8 } b += p & (1 << w) - 1;
p >>>= w;
m -= w } if (m < 15) {
p += T[o++] << m;
m += 8;
p += T[o++] << m;
m += 8 } P = S[p & _];
n: for (;
;) {
w = P >>> 24;
p >>>= w;
m -= w;
w = P >>> 16 & 255;
if (w & 16) {
k = P & 65535;
w &= 15;
if (m < w) {
p += T[o++] << m;
m += 8;
if (m < w) {
p += T[o++] << m;
m += 8 } } k += p & (1 << w) - 1;
if (k > f) {
e.msg = "invalid distance too far back";
n.mode = i;
break e } p >>>= w;
m -= w;
w = s - u;
if (k > w) {
w = k - w;
if (w > h) {
if (n.sane) {
e.msg = "invalid distance too far back";
n.mode = i;
break e } } C = 0;
R = v;
if (d === 0) {
C += c - w;
if (w < b) {
b -= w;
do {
I[s++] = v[C++] } while (--w);
C = s - k;
R = I } } else if (d < w) {
C += c + d - w;
w -= d;
if (w < b) {
b -= w;
do {
I[s++] = v[C++] } while (--w);
C = 0;
if (d < b) {
w = d;
b -= w;
do {
I[s++] = v[C++] } while (--w);
C = s - k;
R = I } } } else {
C += d - w;
if (w < b) {
b -= w;
do {
I[s++] = v[C++] } while (--w);
C = s - k;
R = I } } while (b > 2) {
I[s++] = R[C++];
I[s++] = R[C++];
I[s++] = R[C++];
b -= 3 } if (b) {
I[s++] = R[C++];
if (b > 1) {
I[s++] = R[C++] } } } else {
C = s - k;
do {
I[s++] = I[C++];
I[s++] = I[C++];
I[s++] = I[C++];
b -= 3 } while (b > 2);
if (b) {
I[s++] = I[C++];
if (b > 1) {
I[s++] = I[C++] } } } } else if ((w & 64) === 0) {
P = S[(P & 65535) + (p & (1 << w) - 1)];
continue n } else {
e.msg = "invalid distance code";
n.mode = i;
break e }
break } } else if ((w & 64) === 0) {
P = y[(P & 65535) + (p & (1 << w) - 1)];
continue t } else if (w & 32) {
n.mode = r;
break e } else {
e.msg = "invalid literal/length code";
n.mode = i;
break e }
break } } while (o < a && s < l);
b = m >> 3;
o -= b;
m -= b << 3;
p &= (1 << m) - 1;
e.next_in = o;
e.next_out = s;
e.avail_in = o < a ? 5 + (a - o) : 5 - (o - a);
e.avail_out = s < l ? 257 + (l - s) : 257 - (s - l);
n.hold = p;
n.bits = m;
return } }, function (e, t, n) {
"use strict";
var i = n(0);
var r = 15;
var o = 852;
var a = 592;
var s = 0;
var u = 1;
var l = 2;
var f = [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0];
var c = [16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18, 19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78];
var h = [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577, 0, 0];
var d = [16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 64, 64];
e.exports = function v(e, t, n, p, m, y, S, g) {
var _ = g.bits;
var P = 0;
var w = 0;
var b = 0, k = 0;
var C = 0;
var R = 0;
var T = 0;
var I = 0;
var x = 0;
var D = 0;
var z;
var M;
var E;
var O;
var F;
var q = null;
var J = 0;
var W;
var L = new i.Buf16(r + 1);
var A = new i.Buf16(r + 1);
var B = null;
var U = 0;
var $, H, N;
for (P = 0;
P <= r;
P++) {
L[P] = 0 } for (w = 0;
w < p;
w++) {
L[t[n + w]]++ } C = _;
for (k = r;
k >= 1;
k--) {
if (L[k] !== 0) {
break } } if (C > k) {
C = k } if (k === 0) {
m[y++] = 1 << 24 | 64 << 16 | 0;
m[y++] = 1 << 24 | 64 << 16 | 0;
g.bits = 1;
return 0 } for (b = 1;
b < k;
b++) {
if (L[b] !== 0) {
break } } if (C < b) {
C = b } I = 1;
for (P = 1;
P <= r;
P++) {
I <<= 1;
I -= L[P];
if (I < 0) {
return -1 } } if (I > 0 && (e === s || k !== 1)) {
return -1 } A[1] = 0;
for (P = 1;
P < r;
P++) {
A[P + 1] = A[P] + L[P] } for (w = 0;
w < p;
w++) {
if (t[n + w] !== 0) {
S[A[t[n + w]]++] = w } } if (e === s) {
q = B = S;
W = 19 } else if (e === u) {
q = f;
J -= 257;
B = c;
U -= 257;
W = 256 } else {
q = h;
B = d;
W = -1 } D = 0;
w = 0;
P = b;
F = y;
R = C;
T = 0;
E = -1;
x = 1 << C;
O = x - 1;
if (e === u && x > o || e === l && x > a) {
return 1 } for (;
;) {
$ = P - T;
if (S[w] < W) {
H = 0;
N = S[w] } else if (S[w] > W) {
H = B[U + S[w]];
N = q[J + S[w]] } else {
H = 32 + 64;
N = 0 } z = 1 << P - T;
M = 1 << R;
b = M;
do {
M -= z;
m[F + (D >> T) + M] = $ << 24 | H << 16 | N | 0 } while (M !== 0);
z = 1 << P - 1;
while (D & z) {
z >>= 1 } if (z !== 0) {
D &= z - 1;
D += z } else {
D = 0 } w++;
if (--L[P] === 0) {
if (P === k) {
break } P = t[n + S[w]] } if (P > C && (D & O) !== E) {
if (T === 0) {
T = C } F += b;
R = P - T;
I = 1 << R;
while (R + T < k) {
I -= L[R + T];
if (I <= 0) {
break } R++;
I <<= 1 } x += 1 << R;
if (e === u && x > o || e === l && x > a) {
return 1 } E = D & O;
m[E] = C << 24 | R << 16 | F - y | 0 } } if (D !== 0) {
m[F + D] = P - T << 24 | 64 << 16 | 0 } g.bits = C;
return 0 } }, function (e, t, n) {
"use strict";
function i() {
this.text = 0;
this.time = 0;
this.xflags = 0;
this.os = 0;
this.extra = null;
this.extra_len = 0;
this.name = "";
this.comment = "";
this.hcrc = 0;
this.done = false } e.exports = i }, function (e, t, n) {
"use strict";
Object.defineProperty(t, "__esModule", {
value: true });
t.WebChannelRequest = undefined;
var i = function () {
function e(e, t) {
for (var n = 0;
n < t.length;
n++) {
var i = t[n];
i.enumerable = i.enumerable || false;
i.configurable = true;
if ("value" in i) i.writable = true;
Object.defineProperty(e, i.key, i) } }
return function (t, n, i) {
if (n) e(t.prototype, n);
if (i) e(t, i);
return t } }();
var r = n(1);
var o = a(r);
function a(e) {
return e && e.__esModule ? e : {
"default": e } } function s(e, t) {
if (!(e instanceof t)) {
throw new TypeError("Cannot call a class as a function") } }
var u = function () {
var e = function () {
function e(t) {
s(this, e);
var n = {
iPort: -1, cbConnectSuccess: null, cbConnectError: null, cbConnectClose: null };
this.oOptions = $.extend(n, t);
this.oWebChannel = null;
this.szUUID = "";
this.szVersion = "";
this.oRequestList = {};
this.bNormalClose = false;
this.oChannleObj = null;
this.oWindowControlCallback = {};
this.init() } i(e, [{
key: "init", value: function t() {
var e = this;
this.oChannleObj = new window.QWebChannel(window.qt.webChannelTransport, function (t) {
e.oWebChannel = t.objects.document;
var n = o["default"].v4();
setTimeout(function () {
var t = {
sequence: n, cmd: "system.webconnect" };
var i = JSON.stringify(t);
e.oWebChannel.receiveText(i) }, 500);
e.oWebChannel.textSent.connect(function (t) {
if (!t) {
return }
var i = JSON.parse(t);
n = i.sequence;
if (typeof n === "undefined" && typeof i.cmd === "undefined") {
e.szUUID = i.uuid;
e.szVersion = i.version;
if (e.oOptions.cbConnectSuccess) {
e.oOptions.cbConnectSuccess() } } else {
if (typeof i.cmd !== "undefined") {
e.parseCmd(i) } else {
if (typeof e.oRequestList[n] !== "undefined") {
if (0 === i.errorCode) {
e.oRequestList[n].resolve(i) } else {
e.oRequestList[n].reject(i) } delete e.oRequestList[n] } } } }) }) } }, {
key: "setWindowControlCallback", value: function n(e) {
this.oWindowControlCallback = e } }, {
key: "getServiceVersion", value: function r() {
return this.szVersion } }, {
key: "getRequestUUID", value: function a() {
return this.szUUID } }, {
key: "disconnect", value: function u() {} }, {
key: "sendRequest", value: function l(e) {
var t = this;
var n = new Promise(function (n, i) {
var r = o["default"].v4();
e.sequence = r;
t.oRequestList[r] = {
resolve: n, reject: i };
e.uuid = t.szUUID;
e.timestamp = (new Date).getTime() + "";
var a = JSON.stringify(e);
if (t.oWebChannel) {
t.oWebChannel.receiveText(a) } else {
i() } });
return n } }, {
key: "parseCmd", value: function f(e) {
var t = e.cmd;
var n = t.split(".");
var i = n[1];
if ("window" === n[0] || "video" === n[0]) {
if (this.oWindowControlCallback[i]) {
this.oWindowControlCallback[i](e) } } } }]);
return e }();
return e }();
t.WebChannelRequest = u }, function (e, t, n) {
"use strict";
Object.defineProperty(t, "__esModule", {
value: true });
t.ActiveXControl = undefined;
var i = function () {
function e(e, t) {
for (var n = 0;
n < t.length;
n++) {
var i = t[n];
i.enumerable = i.enumerable || false;
i.configurable = true;
if ("value" in i) i.writable = true;
Object.defineProperty(e, i.key, i) } }
return function (t, n, i) {
if (n) e(t.prototype, n);
if (i) e(t, i);
return t } }();
var r = n(12);
function o(e, t) {
if (!(e instanceof t)) {
throw new TypeError("Cannot call a class as a function") } }
var a = function () {
var e = function () {
function e(t) {
o(this, e);
var n = {
szId: "playWnd", iType: 0, iWidth: 400, iHeight: 300, iMaxSplit: 4, iCurrentSplit: 2, szPlayMode: "normal" };
this.szClassId = "E7EF736D-B4E6-4A5A-BA94-732D71107808";
this.oOptions = $.extend(n, t);
if (this.oOptions.szIframeId && $("#" + this.oOptions.szIframeId).length) {
this.oOptions.oId = $("#" + this.oOptions.szId, $("#" + this.oOptions.szIframeId)[0].contentWindow.document) } else {
this.oOptions.oId = $("#" + this.oOptions.szId) } this.oOptions.oId.html("<object classid='clsid:" + this.szClassId + "' codebase='' standby='Waiting...' " + "id='" + this.oOptions.szId + "_multiVideoActiveX' width='100%' height='100%' name='ocx' align='center' ><param name='wndtype' value='" + this.oOptions.iCurrentSplit + "'><param name='playmode' value='" + this.oOptions.szPlayMode + "'></object>");
this.oPlugin = this.oOptions.oId.find("#" + this.oOptions.szId + "_multiVideoActiveX")[0];
if (this.oPlugin === null || this.oPlugin.object === null) {
this.oPlugin = null } this.fCurrentCallback = null;
this.afCurrentCallback = [];
this.iProtocolType = 0;
this.szPluginVersion = "V3.0.6.46" } i(e, [{
key: "JS_CreateWnd", value: function t(e, n, i) {
var r = this;
var o = $.Deferred();
setTimeout(function () {
r.oOptions.oId.html("<object classid='clsid:" + r.szClassId + "' codebase='' standby='Waiting...' " + "id='" + r.oOptions.szId + "_multiVideoActiveX' width='" + n + "' height='" + i + "' name='ocx' align='center' ><param name='wndtype' value='" + r.oOptions.iCurrentSplit + "'><param name='playmode' value='" + r.oOptions.szPlayMode + "'></object>");
r.oPlugin = r.oOptions.oId.find("#" + r.oOptions.szId + "_multiVideoActiveX")[0];
if (r.oPlugin === null || r.oPlugin.object === null) {
r.oPlugin = null } o.resolve() }, 100);
return o.promise() } }, {
key: "JS_ShowWnd", value: function n() {
var e = this;
var t = $.Deferred();
setTimeout(function () {
$("#" + e.oOptions.szId + "_multiVideoActiveX").show();
t.resolve() }, 100);
return t.promise() } }, {
key: "JS_HideWnd", value: function a() {
var e = this;
var t = $.Deferred();
setTimeout(function () {
$("#" + e.oOptions.szId + "_multiVideoActiveX").hide();
t.resolve() }, 100);
return t.promise() } }, {
key: "JS_SetWndCover", value: function s() {
var e = $.Deferred();
setTimeout(function () {
e.resolve() }, 100);
return e.promise() } }, {
key: "JS_SetWindowControlCallback", value: function u(e) {
var t = this;
var n = t.oOptions.szIframeId && $("#" + t.oOptions.szIframeId).length ? $("#" + t.oOptions.szIframeId)[0].contentWindow : window;
n.GetSelectWndInfo = function (n) {
var i = r.oUtils.parseXmlFromStr(n);
var o = parseInt($(i).find("SelectWnd").eq(0).text(), 10);
if (0 <= o) {
t.fCurrentCallback = t.afCurrentCallback[o] } if (e.onGetSelectWndInfo) {
e.onGetSelectWndInfo(o) } };
n.PluginEventHandler = function (n, i, o) {
if (n === 69) {
var a = t.oPlugin.HWP_GetDrawLineInfo(i);
var s = r.oUtils.parseXmlFromStr(a);
var u = [];
$(s).find("RegionCoordinates").each(function () {
var e = parseFloat($(this).find("positionX").text());
var t = 1 - parseFloat($(this).find("positionY").text());
u.push([e, t]) });
var l = "Line";
if (u.length > 3) {
l = "Polygon" } if (t.fCurrentCallback) {
t.fCurrentCallback({
id: 1, type: l, points: u }) } } else if (n === 14) {
e.onPluginEventHandler && e.onPluginEventHandler(n, i) } else if (n === 68) {
var f = "Polygon";
if (0 === parseInt(o, 10)) {
f = "Rect" } e.onDrawEvent && e.onDrawEvent({
id: parseInt(i, 10), type: f, event: "choosed" }) } else if (n === 70) {
var c = "Polygon";
if (0 === parseInt(o, 10)) {
c = "Rect" } e.onDrawEvent && e.onDrawEvent({
id: parseInt(i, 10), type: c, event: "drawEnd" }) } else {
e.onPluginEventHandler && e.onPluginEventHandler(i, n) } };
n.ZoomInfoCallback = function (e) {
var n = r.oUtils.parseXmlFromStr(e);
var i = [];
var o = 0;
var a = 0;
var s = 0;
var u = 0;
o = parseInt($(n).find("StartPoint").eq(0).find("positionX").eq(0).text(), 10) / 255;
a = parseInt($(n).find("StartPoint").eq(0).find("positionY").eq(0).text(), 10) / 255;
s = parseInt($(n).find("EndPoint").eq(0).find("positionX").eq(0).text(), 10) / 255;
u = parseInt($(n).find("EndPoint").eq(0).find("positionY").eq(0).text(), 10) / 255;
i = [[o, a], [s, a], [s, u], [o, u]];
if (t.fCurrentCallback) {
t.fCurrentCallback({
id: 1, type: "Rect", points: i }) } };
n.GetFishPTZInfo = function (t) {
var n = r.oUtils.parseXmlFromStr(t);
var i = parseInt($(n).find("infoType").eq(0).text(), 10);
var o = parseInt($(n).find("WndType").eq(0).text(), 10);
var a = $(n).find("id").eq(0).text();
var s = [parseFloat($(n).find("posX").eq(0).text()), parseFloat($(n).find("posY").eq(0).text())];
var u = [parseFloat($(n).find("pos2X").eq(0).text()), parseFloat($(n).find("pos2Y").eq(0).text())];
var l = {
type: i, windowType: o, id: a, position: s, originPosition: u };
if (e.onFisheyePTZInfo) {
e.onFisheyePTZInfo(l) } };
n.KeyBoardEvent = function (t) {
var n = r.oUtils.parseXmlFromStr(t);
var i = parseInt($(n).find("keyCode").eq(0).text(), 10);
if (i === 27) {
if (e.onFullScreenChange) {
e.onFullScreenChange(false) } } };
n.MouseEvent = function (t) {
var n = r.oUtils.parseXmlFromStr(t);
var i = parseInt($(n).find("WndIndex").eq(0).text(), 10);
var o = parseInt($(n).find("EventType").eq(0).text(), 10);
var a = parseFloat($(n).find("Position").eq(0).find("x").eq(0).text());
var s = parseFloat($(n).find("Position").eq(0).find("y").eq(0).text());
if (e.onMouseEvent) {
e.onMouseEvent({
wndIndex: i, eventType: o, point: [a, s] }) } } } }, {
key: "JS_ArrangeWindow", value: function l(e) {
var t = $.Deferred();
this.oPlugin.HWP_ArrangeWindow(e);
setTimeout(function () {
t.resolve() }, 100);
return t.promise() } }, {
key: "JS_SetSecretKey", value: function f(e, t, n) {
var i = $.Deferred();
var r = this.oPlugin.HWP_SetSecretKey(n, t);
setTimeout(function () {
if (r < 0) {
i.reject() } else {
i.resolve() } }, 100);
return i.promise() } }, {
key: "JS_GetEncryptString", value: function c(e, t, n) {
var i = $.Deferred();
var r = 0;
r = this.oPlugin.HWP_SetOriginalString(t, n, "");
var o = this.oPlugin.HWP_GetEncryptString(e);
setTimeout(function () {
if (r < 0) {
i.reject() } else {
i.resolve(o) } }, 100);
return i.promise() } }, {
key: "JS_GetDecryptString", value: function h(e, t, n) {
var i = this;
var r = $.Deferred();
setTimeout(function () {
if (!n) {
r.reject();
return }
var o = i.oPlugin.HWP_GetDecryptString(e, t, n);
r.resolve(o) }, 100);
return r.promise() } }, {
key: "JS_SetOriginalString", value: function d(e, t) {
var n = $.Deferred();
var i = this.oPlugin.HWP_SetOriginalString(e, t, "");
setTimeout(function () {
if (i < 0) {
n.reject() } else {
n.resolve() } }, 100);
return n.promise() } }, {
key: "JS_DestroyPlugin", value: function v() {
var e = $.Deferred();
$("#" + this.oOptions.szId + "_multiVideoActiveX").remove();
this.oPlugin = null;
setTimeout(function () {
e.resolve() }, 100);
return e.promise() } }, {
key: "JS_Play", value: function p(e, t, n, i, r) {
var o = $.Deferred();
var a = this;
var s = this.oPlugin.HWP_Play(e, t.auth, n, i, r);
setTimeout(function () {
if (s < 0) {
s = a.oPlugin.HWP_GetLastError();
o.reject(s) } else {
o.resolve() } }, 100);
return o.promise() } }, {
key: "JS_ReversePlay", value: function m(e, t, n, i, r) {
var o = this;
var a = $.Deferred();
var s = o.oPlugin.HWP_ReversePlay(e, t.auth, n, i, r);
setTimeout(function () {
if (s < 0) {
s = o.oPlugin.HWP_GetLastError();
a.reject(s) } else {
a.resolve() } }, 100);
return a.promise() } }, {
key: "JS_Stop", value: function y(e) {
var t = $.Deferred();
var n = this.oPlugin.HWP_Stop(e);
setTimeout(function () {
if (n < 0) {
t.reject() } else {
t.resolve() } }, 100);
return t.promise() } }, {
key: "JS_Seek", value: function S() {
var e = $.Deferred();
setTimeout(function () {
e.resolve() }, 100);
return e.promise() } }, {
key: "JS_StopRealPlayAll", value: function g() {
var e = $.Deferred();
var t = this.oPlugin.StopRealPlayAll();
setTimeout(function () {
if (t < 0) {
e.reject() } else {
e.resolve() } }, 100);
return e.promise() } }, {
key: "JS_Pause", value: function _(e) {
var t = $.Deferred();
var n = this.oPlugin.HWP_Pause(e);
setTimeout(function () {
if (n < 0) {
t.reject() } else {
t.resolve() } }, 100);
return t.promise() } }, {
key: "JS_Resume", value: function P(e) {
var t = $.Deferred();
var n = this.oPlugin.HWP_Resume(e);
setTimeout(function () {
if (n < 0) {
t.reject() } else {
t.resolve() } }, 100);
return t.promise() } }, {
key: "JS_Slow", value: function w(e) {
var t = $.Deferred();
var n = this.oPlugin.HWP_Slow(e);
setTimeout(function () {
if (n < 0) {
t.reject() } else {
t.resolve() } }, 100);
return t.promise() } }, {
key: "JS_Fast", value: function b(e) {
var t = $.Deferred();
var n = this.oPlugin.HWP_Fast(e);
setTimeout(function () {
if (n < 0) {
t.reject() } else {
t.resolve() } }, 100);
return t.promise() } }, {
key: "JS_Transmission", value: function k() {
var e = $.Deferred();
setTimeout(function () {
e.resolve() }, 100);
return e.promise() } }, {
key: "JS_FrameForward", value: function C(e) {
var t = $.Deferred();
var n = this.oPlugin.HWP_FrameForward(e);
setTimeout(function () {
if (n < 0) {
t.reject() } else {
t.resolve() } }, 100);
return t.promise() } }, {
key: "JS_GetOSDTime", value: function R(e) {
var t = $.Deferred();
var n = -1;
n = this.oPlugin.HWP_GetOSDTime(e);
setTimeout(function () {
if (n < 0 || !n) {
t.reject() } else {
t.resolve(n) } }, 100);
return t.promise() } }, {
key: "JS_OpenSound", value: function T(e) {
var t = $.Deferred();
var n = this.oPlugin.HWP_OpenSound(e);
setTimeout(function () {
if (n < 0) {
t.reject() } else {
t.resolve() } }, 100);
return t.promise() } }, {
key: "JS_CloseSound", value: function I() {
var e = $.Deferred();
var t = this.oPlugin.HWP_CloseSound();
setTimeout(function () {
if (t < 0) {
e.reject() } else {
e.resolve() } }, 100);
return e.promise() } }, {
key: "JS_GetVolume", value: function x(e) {
var t = $.Deferred();
var n = this.oPlugin.HWP_GetVolume(e);
setTimeout(function () {
if (n < 0) {
t.reject() } else {
t.resolve(n) } }, 100);
return t.promise() } }, {
key: "JS_SetVolume", value: function D(e, t) {
var n = $.Deferred();
var i = this.oPlugin.HWP_SetVolume(e, t);
setTimeout(function () {
if (i < 0) {
n.reject() } else {
n.resolve() } }, 100);
return n.promise() } }, {
key: "JS_EnableZoom", value: function z(e, t) {
var n = $.Deferred();
var i = this.oPlugin.HWP_EnableZoom(e, t);
setTimeout(function () {
if (i < 0) {
n.reject() } else {
n.resolve() } }, 100);
return n.promise() } }, {
key: "JS_DisableZoom", value: function M(e) {
var t = $.Deferred();
this.oPlugin.HWP_DisableZoom(e);
setTimeout(function () {
t.resolve() }, 100);
return t.promise() } }, {
key: "JS_CapturePicture", value: function E(e, t) {
var n = this;
var i = $.Deferred();
t = t.replace(/playback_/g, "");
var r = n.oPlugin.HWP_CapturePicture(e, t);
setTimeout(function () {
if (r < 0) {
r = n.oPlugin.HWP_GetLastError();
i.reject(r) } else {
i.resolve() } }, 100);
return i.promise() } }, {
key: "JS_StartSave", value: function O(e, t) {
var n = this;
var i = $.Deferred();
var r = n.oPlugin.HWP_StartSave(e, t);
setTimeout(function () {
if (r < 0) {
r = n.oPlugin.HWP_GetLastError();
i.reject(r) } else {
i.resolve() } }, 100);
return i.promise() } }, {
key: "JS_StopSave", value: function F(e) {
var t = $.Deferred();
var n = this.oPlugin.HWP_StopSave(e);
setTimeout(function () {
if (n < 0) {
t.reject() } else {
t.resolve() } }, 100);
return t.promise() } }, {
key: "JS_StartTalk", value: function q(e, t, n, i, r, o, a, s, u) {
var l = $.Deferred();
var f = this.oPlugin.HWP_StartVoiceTalk_V20(e, t, n, i, r, o, a, s, u);
setTimeout(function () {
if (f < 0) {
l.reject() } else {
l.resolve() } }, 100);
return l.promise() } }, {
key: "JS_StopTalk", value: function J() {
var e = $.Deferred();
this.oPlugin.HWP_StopVoiceTalk();
setTimeout(function () {
e.resolve() }, 100);
return e.promise() } }, {
key: "JS_SetPlayMode", value: function W(e) {
var t = $.Deferred();
var n = this.oPlugin.HWP_SetPlayModeType(e);
setTimeout(function () {
if (n < 0) {
t.reject() } else {
t.resolve() } }, 100);
return t.promise() } }, {
key: "JS_SetFullScreenCapability", value: function L(e) {
var t = $.Deferred();
var n = this.oPlugin.HWP_SetCanFullScreen(e);
setTimeout(function () {
if (n < 0) {
t.reject() } else {
t.resolve() } }, 100);
return t.promise() } }, {
key: "JS_FullScreenDisplay", value: function A(e) {
var t = $.Deferred();
var n = this.oPlugin.HWP_FullScreenDisplay(e);
setTimeout(function () {
if (n < 0) {
t.reject() } else {
t.resolve() } }, 100);
return t.promise() } }, {
key: "JS_EnableIVS", value: function B(e, t, n) {
var i = $.Deferred();
var r = this.oPlugin.HWP_EnableIVS(e, t, n);
setTimeout(function () {
if (r < 0) {
i.reject() } else {
i.resolve() } }, 100);
return i.promise() } }, {
key: "JS_SRInit", value: function U(e, t) {
var n = $.Deferred();
var i = this.oPlugin.HWP_SR_Init(e, t);
setTimeout(function () {
if (i < 0) {
n.reject() } else {
n.resolve() } }, 100);
return n.promise() } }, {
key: "JS_SRPTZ", value: function H(e, t, n) {
var i = $.Deferred();
var r = 0;
if (t === 4 || t === 5) {
r = this.oPlugin.HWP_SR_Zoom(e, 5 - t, n) } else {
r = this.oPlugin.HWP_SR_PTZ(e, t, n) } setTimeout(function () {
if (r < 0) {
i.reject() } else {
i.resolve() } }, 100);
return i.promise() } }, {
key: "JS_SetPlaybackDrawType", value: function N(e, t) {
var n = $.Deferred();
var i = this.oPlugin.HWP_SetPlaybackDrawType(e, t);
setTimeout(function () {
if (i < 0) {
n.reject() } else {
n.resolve() } }, 100);
return n.promise() } }, {
key: "JS_SetPlayBackType", value: function G(e) {
var t = $.Deferred();
var n = this.oPlugin.HWP_SetPlayBackType(e);
setTimeout(function () {
if (n < 0) {
t.reject() } else {
t.resolve() } }, 100);
return t.promise() } }, {
key: "JS_SetTrsPlayBackParam", value: function j(e, t) {
var n = $.Deferred();
var i = '<?xml version="1.0" encoding="utf-8"?><CompressionInfo>' + "<TransBitrate>" + t.transBitrate + "</TransBitrate>" + "<TransFrameRate>" + t.transFrameRate + "</TransFrameRate>" + "<TransResolution>" + t.transResolution + "</TransResolution></CompressionInfo>";
var r = this.oPlugin.HWP_SetTrsPlayBackParam(e, i);
setTimeout(function () {
if (r < 0) {
n.reject() } else {
n.resolve() } }, 100);
return n.promise() } }, {
key: "JS_GetLocalConfig", value: function V() {
var e = $.Deferred();
var t = this.oPlugin.HWP_GetLocalConfig();
var n = r.oUtils.parseXmlFromStr(t);
var i = {
protocolType: $(n).find("ProtocolType").eq(0).text(), streamType: $(n).find("StreamType").eq(0).text(), packgeSize: $(n).find("PackgeSize").eq(0).text(), playWndType: $(n).find("PlayWndType").eq(0).text(), buffNumberType: $(n).find("BuffNumberType").eq(0).text(), recordPath: $(n).find("RecordPath").eq(0).text(), capturePath: $(n).find("CapturePath").eq(0).text(), playbackFilePath: $(n).find("PlaybackFilePath").eq(0).text(), playbackPicPath: $(n).find("PlaybackPicPath").eq(0).text(), downloadPath: $(n).find("DownloadPath").eq(0).text(), snapScenePicPath: $(n).find("SnapScenePicPath").eq(0).text(), snapViewPicPath: $(n).find("SnapViewPicPath").eq(0).text(), ivsMode: $(n).find("IVSMode").eq(0).text(), realPlayAll: $(n).find("RealPlayAll").eq(0).text(), captureFileFormat: $(n).find("CaptureFileFormat").eq(0).text(), osdPosInfo: $(n).find("OSDPosInfo").eq(0).text(), osdPicInfo: $(n).find("OSDPicInfo").eq(0).text(), showWizard: $(n).find("ShowWizard").eq(0).text(), secretKey: $(n).find("SecretKey").eq(0).text(), showFireBox: $(n).find("ShowFireBox").eq(0).text(), showFireDistance: $(n).find("ShowFireDistance").eq(0).text(), showFireMaxTemperature: $(n).find("ShowFireMaxTemp").eq(0).text(), showFireMaxTemperaturePos: $(n).find("ShowFireMaxTempPos").eq(0).text(), showTemperaturePoint: $(n).find("ShowTemPoint").eq(0).text(), showTemperatureLine: $(n).find("ShowTemLine").eq(0).text(), showTemperatureBox: $(n).find("ShowTemBox").eq(0).text(), captureIncludeTemperatureInfo: $(n).find("CaptureTemp").eq(0).text(), customBuffNumber: $(n).find("CustomBuffNumber").eq(0).text(), faceSnapPicPath: $(n).find("FaceSnapPicPath").eq(0).text() };
this.iProtocolType = parseInt(i.protocolType, 10);
setTimeout(function () {
if (!i) {
e.reject() } else {
e.resolve(i) } }, 100);
return e.promise() } }, {
key: "JS_SetLocalConfig", value: function X(e) {
var t = $.Deferred();
var n = '<?xml version="1.0" encoding="utf-8"?><LocalConfigInfo>' + "<ProtocolType>" + e.protocolType + "</ProtocolType><StreamType>" + e.streamType + "</StreamType>" + "<PackgeSize>" + e.packgeSize + "</PackgeSize><PlayWndType>" + e.playWndType + "</PlayWndType>" + "<BuffNumberType>" + e.buffNumberType + "</BuffNumberType><RecordPath>" + e.recordPath + "</RecordPath>" + "<CapturePath>" + e.capturePath + "</CapturePath><PlaybackFilePath>" + e.playbackFilePath + "</PlaybackFilePath>" + "<PlaybackPicPath>" + e.playbackPicPath + "</PlaybackPicPath><DownloadPath>" + e.downloadPath + "</DownloadPath>" + "<SnapScenePicPath>" + e.snapScenePicPath + "</SnapScenePicPath><SnapViewPicPath>" + e.snapViewPicPath + "</SnapViewPicPath>" + "<IVSMode>" + e.ivsMode + "</IVSMode><RealPlayAll>" + e.realPlayAll + "</RealPlayAll>" + "<CaptureFileFormat>" + e.captureFileFormat + "</CaptureFileFormat><OSDPosInfo>" + e.osdPosInfo + "</OSDPosInfo>" + "<OSDPicInfo>" + e.osdPicInfo + "</OSDPicInfo><ShowWizard>" + e.showWizard + "</ShowWizard>" + "<SecretKey>" + e.secretKey + "</SecretKey><ShowFireBox>" + e.showFireBox + "</ShowFireBox>" + "<ShowFireDistance>" + e.showFireDistance + "</ShowFireDistance><ShowFireMaxTemp>" + e.showFireMaxTemperature + "</ShowFireMaxTemp>" + "<ShowFireMaxTempPos>" + e.showFireMaxTemperaturePos + "</ShowFireMaxTempPos><ShowTemPoint>" + e.showTemperaturePoint + "</ShowTemPoint>" + "<ShowTemLine>" + e.showTemperatureLine + "</ShowTemLine><ShowTemBox>" + e.showTemperatureBox + "</ShowTemBox>" + "<CaptureTemp>" + e.captureIncludeTemperatureInfo + "</CaptureTemp>" + "<CustomBuffNumber>" + e.customBuffNumber + "</CustomBuffNumber>" + "<FaceSnapPicPath>" + e.faceSnapPicPath + "</FaceSnapPicPath>" + "</LocalConfigInfo>";
var i = this.oPlugin.HWP_SetLocalConfig(n);
setTimeout(function () {
if (i < 0) {
t.reject() } else {
this.iProtocolType = parseInt(e.protocolType, 10);
t.resolve() } }, 100);
return t.promise() } }, {
key: "JS_GetLastError", value: function Y() {
var e = $.Deferred();
var t = this.oPlugin.HWP_GetLastError();
setTimeout(function () {
if (t < 0) {
e.reject() } else {
e.resolve(t) } }, 100);
return e.promise() } }, {
key: "JS_OpenFileBrowser", value: function Z(e, t) {
var n = $.Deferred();
var i = this.oPlugin.HWP_OpenFileBrowser(e, t);
setTimeout(function () {
n.resolve(i) }, 100);
return n.promise() } }, {
key: "JS_OpenDirectory", value: function K(e) {
var t = $.Deferred();
var n = this.oPlugin.HWP_OpenDirectory(e);
setTimeout(function () {
if (n < 0) {
t.reject() } else {
t.resolve() } }, 100);
return t.promise() } }, {
key: "JS_StartAsynUpload", value: function Q(e, t, n, i) {
var r = $.Deferred();
var o = this;
var a = this.oPlugin.HWP_StartAsynUpload(e, t, n, i, 0);
setTimeout(function () {
if (a < 0) {
a = o.oPlugin.HWP_GetLastError();
r.reject(a) } else {
r.resolve() } }, 100);
return r.promise() } }, {
key: "JS_StopAsynUpload", value: function ee() {
var e = $.Deferred();
var t = this.oPlugin.HWP_StopAsynUpload();
setTimeout(function () {
if (t < 0) {
e.reject() } else {
e.resolve() } }, 100);
return e.promise() } }, {
key: "JS_GetUploadErrorInfo", value: function te() {
var e = $.Deferred();
var t = this.oPlugin.HWP_GetUploadErrorInfo();
setTimeout(function () {
e.resolve(t) }, 100);
return e.promise() } }, {
key: "JS_UploadFile", value: function ne(e, t, n, i) {
var o = this;
var a = $.Deferred();
var s = o.oPlugin.HWP_UploadFile(e, t, n, i, 0);
setTimeout(function () {
if (s < 0) {
var e = o.oPlugin.HWP_GetHttpErrorInfo();
s = o.oPlugin.HWP_GetLastError();
a.reject({
readyState: 4, status: s, responseXML: e ? r.oUtils.parseXmlFromStr(e) : null }) } else {
a.resolve() } }, 100);
return a.promise() } }, {
key: "JS_GetIpcImportErrorInfo", value: function ie() {
var e = $.Deferred();
var t = this.oPlugin.HWP_GetIpcImportErrorInfo();
setTimeout(function () {
e.resolve(t) }, 100);
return e.promise() } }, {
key: "JS_DownloadFile", value: function re(e, t, n, i, o, a) {
var s = this;
var u = $.Deferred();
var l = 0;
if (i === 2) {
l = this.oPlugin.HWP_ExportFile(e, t, n, i, a) } else {
l = this.oPlugin.HWP_ExportDeviceConfig(e, t, "", o) } setTimeout(function () {
if (l < 0) {
var e = s.oPlugin.HWP_GetHttpErrorInfo();
l = s.oPlugin.HWP_GetLastError();
u.reject({
readyState: 4, status: l, responseXML: e ? r.oUtils.parseXmlFromStr(e) : null }) } else {
u.resolve(l) } }, 100);
return u.promise() } }, {
key: "JS_StartUpgrade", value: function oe(e, t, n, i, r) {
var o = this;
var a = $.Deferred();
var s = o.oPlugin.HWP_StartUpgradeEx(e, t, n, i, r, "");
setTimeout(function () {
if (s < 0) {
s = o.oPlugin.HWP_GetLastError();
a.reject(s) } else {
a.resolve() } }, 100);
return a.promise() } }, {
key: "JS_StopUpgrade", value: function ae() {
var e = $.Deferred();
var t = this.oPlugin.HWP_StopUpgrade();
setTimeout(function () {
if (t < 0) {
e.reject() } else {
e.resolve() } }, 100);
return e.promise() } }, {
key: "JS_GetUpgradeStatus", value: function se() {
var e = $.Deferred();
var t = this.oPlugin.HWP_UpgradeStatus();
setTimeout(function () {
if (t < 0) {
e.reject() } else {
e.resolve(t) } }, 100);
return e.promise() } }, {
key: "JS_GetUpgradeProgress", value: function ue() {
var e = $.Deferred();
var t = this.oPlugin.HWP_UpgradeStatus();
if (t >= 0) {
t = this.oPlugin.HWP_UpgradeProgress() } setTimeout(function () {
if (t < 0) {
e.reject() } else {
e.resolve(t) } }, 100);
return e.promise() } }, {
key: "JS_ExportDeviceLog", value: function le(e, t, n) {
var i = $.Deferred();
var r = this.oPlugin.HWP_ExportDeviceLog(e, t, n);
setTimeout(function () {
if (r < 0) {
i.reject() } else {
i.resolve() } }, 100);
return i.promise() } }, {
key: "JS_ExportReport", value: function fe(e, t, n) {
var i = $.Deferred();
var r = this.oPlugin.HWP_ExportReport(e, t, n);
setTimeout(function () {
if (r < 0) {
i.reject() } else {
i.resolve() } }, 100);
return i.promise() } }, {
key: "JS_StartAsyncDownload", value: function ce(e, t, n, i) {
var o = this;
var a = $.Deferred();
var s = o.oPlugin.HWP_StartDownloadEx(e, t, n, i, "");
setTimeout(function () {
if (s !== 0) {
var e = o.oPlugin.HWP_GetHttpErrorInfo();
s = o.oPlugin.HWP_GetLastError();
a.reject({
readyState: 4, status: s, responseXML: e ? r.oUtils.parseXmlFromStr(e) : null }) } else {
a.resolve(s) } }, 100);
return a.promise() } }, {
key: "JS_StopAsyncDownload", value: function he(e) {
var t = $.Deferred();
var n = this.oPlugin.HWP_StopDownload(e);
setTimeout(function () {
if (n < 0) {
t.reject() } else {
t.resolve() } }, 100);
return t.promise() } }, {
key: "JS_GetDownloadStatus", value: function de(e) {
var t = $.Deferred();
var n = this.oPlugin.HWP_GetDownloadStatus(e);
setTimeout(function () {
if (n < 0) {
t.reject() } else {
t.resolve(n) } }, 100);
return t.promise() } }, {
key: "JS_GetDownloadProgress", value: function ve(e) {
var t = $.Deferred();
var n = this.oPlugin.HWP_GetDownloadStatus(e);
if (n >= 0) {
n = this.oPlugin.HWP_GetDownloadProgress(e) } setTimeout(function () {
if (n < 0) {
t.reject() } else {
t.resolve(n) } }, 100);
return t.promise() } }, {
key: "JS_EnablePDC", value: function pe(e, t) {
var n = $.Deferred();
var i = this.oPlugin.HWP_EnablePDC(e, t);
setTimeout(function () {
if (i < 0) {
n.reject() } else {
n.resolve() } }, 100);
return n.promise() } }, {
key: "JS_Resize", value: function me() {
var e = $.Deferred();
setTimeout(function () {
e.resolve() }, 100);
return e.promise() } }, {
key: "JS_SetDrawCallback", value: function ye(e, t, n, i, r) {
var o = this;
var a = $.Deferred();
o.fCurrentCallback = null;
o.afCurrentCallback[e] = null;
var s = 0;
var u = 0;
if (n !== "Rect") {
if (n === "Line") {
u = 2 } else if (n === "Polygon") {
u = 4 } else {
u = 0 } if (t) {
s = o.oPlugin.HWP_SetPlaybackDrawType(e, u) } else {
s = o.oPlugin.HWP_ClearDrawLineInfo(e) } } else {
if (t) {
s = o.oPlugin.HWP_EnableZoom(e, 1) } else {
o.oPlugin.HWP_DisableZoom(e) } } setTimeout(function () {
if (s < 0) {
a.reject() } else {
o.fCurrentCallback = r;
o.afCurrentCallback[e] = r;
a.resolve() } }, 100);
return a.promise() } }, {
key: "JS_SetDrawStatus", value: function Se(e, t) {
var n = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
var i = $.Deferred();
var r = 0;
r = this.oPlugin.HWP_SetDrawStatus(e);
if (e) {
if (t) {
r = this.oPlugin.HWP_SetSnapDrawMode(n, t) } else {
r = this.oPlugin.HWP_SetSnapDrawMode(n, 3) } } else {
r = this.oPlugin.HWP_SetSnapDrawMode(n, -1) } setTimeout(function () {
i.resolve(r) }, 100);
return i.promise() } }, {
key: "JS_ClearRegion", value: function ge() {
var e = $.Deferred();
var t = this.oPlugin.HWP_ClearRegion();
setTimeout(function () {
e.resolve(t) }, 100);
return e.promise() } }, {
key: "JS_SetDrawShapeInfo", value: function _e(e, t) {
var n = $.Deferred();
var i = 0;
if (e === "Rect") {
i = this.oPlugin.HWP_SetSnapDrawMode(0, 1);
if (i >= 0) {
if (t.type === 0) {
var o = "<?xml version='1.0' encoding='utf-8'?><DetectionRegionInfo><videoFormat>PAL</videoFormat><RegionType>roi</RegionType><ROI>";
o += "<HorizontalResolution>704</HorizontalResolution>" + "<VerticalResolution>576</VerticalResolution></ROI>" + "<DisplayMode>" + (t.translucent !== 1 ? "transparent" : "shelter") + "</DisplayMode>" + "<DetectionRegionList></DetectionRegionList><MaxRegionNum>" + t.maxShapeSupport + "</MaxRegionNum></DetectionRegionInfo>";
i = this.oPlugin.HWP_SetRegionInfo(o) } else if (t.type === 1) {
var a = "<?xml version='1.0' encoding='utf-8'?><SnapPolygonList>";
a += "<SnapPolygon>";
a += "<id>" + t.id + "</id>";
a += "<tips>" + t.tips + "</tips>";
a += "<tipsPos>" + (t.tipsPos || 0) + "</tipsPos>";
a += "<isClosed>false</isClosed>";
a += "<polygonType>0</polygonType>";
a += "<showSquare>" + t.widthHeightRate + "</showSquare>";
a += "<pointList></pointList>";
a += "<color><r>" + r.oUtils.colorRgb(t.drawColor)[0] + "</r><g>" + r.oUtils.colorRgb(t.drawColor)[1] + "</g><b>" + r.oUtils.colorRgb(t.drawColor)[2] + "</b></color>";
a += "</SnapPolygon>";
a += "</SnapPolygonList>";
i = this.oPlugin.HWP_SetSnapPolygonInfo(a) } } } else if (e === "Grid") {
i = this.oPlugin.HWP_SetSnapDrawMode(0, 1);
if (i >= 0) {
var s = "<?xml version='1.0'?><MoveDetection><videoFormat>PAL</videoFormat>";
s += "<RegionType>grid</RegionType><Grid><rowGranularity>" + t.gridRowNum + "</rowGranularity>";
s += "<columnGranularity>" + t.gridColNum + "</columnGranularity></Grid>";
s += "<DisplayMode>transparent</DisplayMode><gridMap></gridMap></MoveDetection>";
i = this.oPlugin.HWP_SetRegionInfo(s) } } else if (e === "Polygon") {
i = this.oPlugin.HWP_SetSnapDrawMode(0, 2);
if (i >= 0) {
var u = "<?xml version='1.0' encoding='utf-8'?><SnapPolygonList>";
u += "<SnapPolygon>";
u += "<id>" + t.id + "</id>";
u += "<tips>" + t.tips + "</tips>";
u += "<isClosed>false</isClosed>";
u += "<polygonType>1</polygonType>";
u += "<PointNumMax>" + (t.maxPointSupport + 1) + "</PointNumMax>";
u += "<MinClosed>" + (t.minPointSupport + 1) + "</MinClosed>";
u += "<pointList></pointList>";
u += "<color><r>" + r.oUtils.colorRgb(t.drawColor)[0] + "</r><g>" + r.oUtils.colorRgb(t.drawColor)[1] + "</g><b>" + r.oUtils.colorRgb(t.drawColor)[2] + "</b></color>";
u += "</SnapPolygon>";
u += "</SnapPolygonList>";
i = this.oPlugin.HWP_SetSnapPolygonInfo(u) } } else if (e === "Line") {
var l = '<?xml version="1.0" encoding="utf-8"?><SnapLineList>';
l += "<SnapLine>";
l += "<id>" + t.id + "</id>";
l += "<editType>" + t.editType + "</editType>";
l += "<LineTypeEx>" + t.lineType + "</LineTypeEx>";
l += "<Tips>" + t.tips + "</Tips>";
l += "<CustomType>" + t.direction + "</CustomType><MoveChange>" + t.mode + "</MoveChange><ArrowType>" + t.direction + "</ArrowType>";
if (t.lineType !== 2) {
l += "<StartPos><x>" + t.points[0][0] + "</x><y>" + t.points[0][1] + "</y></StartPos><EndPos><x>" + t.points[1][0] + "</x><y>" + t.points[1][1] + "</y></EndPos>" } else {
l += "<BreakLine><PointList>";
var f = t.points.length;
for (var c = 0;
c < f;
c++) {
l += "<point><x>" + t.points[c][0] + "</x><y>" + t.points[c][1] + "</y></point>" } l += "</PointList><isClosed>" + (f > 0).toString() + "</isClosed>";
l += "<isShowArrow>" + (t.direction === 0 ? "false" : "true") + "</isShowArrow>";
l += "</BreakLine>" } l += "<LineSelected>false</LineSelected>";
l += "<color><r>" + r.oUtils.colorRgb(t.drawColor)[0] + "</r><g>" + r.oUtils.colorRgb(t.drawColor)[1] + "</g><b>" + r.oUtils.colorRgb(t.drawColor)[2] + "</b></color>";
l += "</SnapLine>";
l += "</SnapLineList>";
i = this.oPlugin.HWP_SetSnapLineInfo(l) } else if (e === "Point") {
var h = "<?xml version='1.0' encoding='utf-8'?><SnapPointList>";
var d = !t.replace ? 0 : 1;
h += "<mode>" + d + "</mode>";
h += "<SnapPoint>";
if (t.id) {
h += "<id>" + t.id + "</id>" } if (t.type) {
h += "<type>" + (t.type === "cross" ? 1 : 2) + "</type>" } if (t.drawColor) {
var v = r.oUtils.colorRgb(t.drawColor);
h += "<color>";
h += "<r>" + v[0] + "</r>";
h += "<g>" + v[1] + "</g>";
h += "<b>" + v[2] + "</b>";
h += "</color>" } h += "</SnapPoint>";
h += "</SnapPointList>";
i = this.oPlugin.HWP_SetSnapPointInfo(0, h);
return h } setTimeout(function () {
if (i < 0) {
n.reject() } else {
n.resolve() } }, 100);
return n.promise() } }, {
key: "JS_SetGridInfo", value: function Pe(e) {
var t = $.Deferred();
var n = "<?xml version='1.0'?><MoveDetection><videoFormat>PAL</videoFormat>";
n += "<RegionType>grid</RegionType><Grid><rowGranularity>" + e.gridRowNum + "</rowGranularity>";
n += "<columnGranularity>" + e.gridColNum + "</columnGranularity></Grid>";
n += "<DisplayMode>transparent</DisplayMode><gridMap>" + e.gridMap + "</gridMap></MoveDetection>";
var i = this.oPlugin.HWP_SetRegionInfo(n);
setTimeout(function () {
if (i < 0) {
t.reject() } else {
t.resolve() } }, 100);
return t.promise() } }, {
key: "JS_GetGridInfo", value: function we() {
var e = $.Deferred();
var t = this.oPlugin.HWP_GetRegionInfo();
var n = r.oUtils.parseXmlFromStr(t);
var i = parseInt($(n).find("columnGranularity").text(), 10);
var o = parseInt($(n).find("rowGranularity").text(), 10);
var a = {
gridColNum: i, gridRowNum: o, gridMap: $(n).find("gridMap").text() };
setTimeout(function () {
e.resolve(a) }, 100);
return e.promise() } }, {
key: "JS_SetRectInfo", value: function be(e) {
var t = $.Deferred();
var n = -1;
if (e[0].type === 0) {
var i = "<?xml version='1.0' encoding='utf-8'?><DetectionRegionInfo><videoFormat>PAL</videoFormat><RegionType>roi</RegionType><ROI>";
var o = "transparent";
if (e[0].translucent === 1) {
o = "shelter" } else if (e[0].translucent === 2) {
o = "quadrilateral" } i += "<HorizontalResolution>704</HorizontalResolution>" + "<VerticalResolution>576</VerticalResolution></ROI>" + "<DisplayMode>" + o + "</DisplayMode>" + "<DetectionRegionList>";
$.each(e, function (t) {
i += "<DetectionRegion>";
i += "<RegionCoordinatesList>";
$.each(e[t].points, function (e, t) {
i += "<RegionCoordinates><positionX>" + Math.round(t[0] * 704) + "</positionX>" + "<positionY>" + Math.round((1 - t[1]) * 576) + "</positionY></RegionCoordinates>" });
i += "</RegionCoordinatesList>";
i += "</DetectionRegion>" });
i += "</DetectionRegionList><MaxRegionNum>" + e[0].maxShapeSupport + "</MaxRegionNum></DetectionRegionInfo>";
n = this.oPlugin.HWP_SetRegionInfo(i) } else if (e[0].type === 1) {
var a = "<?xml version='1.0' encoding='utf-8'?><SnapPolygonList>";
$.each(e, function (e, t) {
a += "<SnapPolygon>";
a += "<id>" + t.id + "</id>";
a += "<EditType>" + t.editType + "</EditType>";
a += "<tips>" + t.tips + "</tips>";
a += "<tipsPos>" + (t.tipsPos || 0) + "</tipsPos>";
a += "<isClosed>true</isClosed>";
a += "<polygonType>0</polygonType>";
a += "<showSquare>" + t.widthHeightRate + "</showSquare>";
a += "<pointList>";
$.each(t.points, function (e, t) {
a += "<point><x>" + t[0] + "</x><y>" + t[1] + "</y></point>" });
a += "</pointList>";
a += "<color><r>" + r.oUtils.colorRgb(t.drawColor)[0] + "</r><g>" + r.oUtils.colorRgb(t.drawColor)[1] + "</g><b>" + r.oUtils.colorRgb(t.drawColor)[2] + "</b></color>";
a += "</SnapPolygon>" });
a += "</SnapPolygonList>";
n = this.oPlugin.HWP_SetSnapPolygonInfo(a) } setTimeout(function () {
if (n < 0) {
t.reject() } else {
t.resolve() } }, 100);
return t.promise() } }, {
key: "JS_GetRectInfo", value: function ke() {
var e = $.Deferred();
var t = [];
var n = this.oPlugin.HWP_GetRegionInfo();
var i = r.oUtils.parseXmlFromStr(n);
$(i).find("DetectionRegion").each(function (e) {
var n = [];
$(this).find("RegionCoordinatesList").find("RegionCoordinates").each(function () {
n.push([parseInt($(this).find("positionX").text(), 10) / 704, 1 - parseInt($(this).find("positionY").text(), 10) / 576]) });
t.push({
id: e + 1, points: n }) });
var o = [];
var a = this.oPlugin.HWP_GetSnapPolygonInfo();
var s = r.oUtils.parseXmlFromStr(a);
$(s).find("SnapPolygon").each(function () {
var e = parseInt($(this).find("polygonType").text(), 10);
if (e === 0) {
var t = $(this).find("id").text();
var n = $(this).find("tips").text();
var i = [];
$(this).find("pointList").find("point").each(function () {
i.push([parseFloat($(this).find("x").text()), parseFloat($(this).find("y").text())]) });
var r = {
id: t, points: i, tips: n };
o.push(r) } });
setTimeout(function () {
if (t.length > 0) {
e.resolve(t) } else if (o.length > 0) {
e.resolve(o) } else {
e.resolve([]) } }, 100);
return e.promise() } }, {
key: "JS_SetPolygonInfo", value: function Ce(e) {
var t = $.Deferred();
var n = "<?xml version='1.0' encoding='utf-8'?><SnapPolygonList>";
$.each(e, function (e, t) {
n += "<SnapPolygon>";
n += "<id>" + t.id + "</id>";
n += "<EditType>" + t.editType + "</EditType>";
n += "<tips>" + t.tips + "</tips>";
n += "<isClosed>" + t.closed.toString() + "</isClosed>";
n += "<polygonType>1</polygonType>";
n += "<pointList>";
$.each(t.points, function (e, t) {
n += "<point><x>" + t[0] + "</x><y>" + t[1] + "</y></point>" });
n += "</pointList>";
n += "<color><r>" + r.oUtils.colorRgb(t.drawColor)[0] + "</r><g>" + r.oUtils.colorRgb(t.drawColor)[1] + "</g><b>" + r.oUtils.colorRgb(t.drawColor)[2] + "</b></color>";
n += "</SnapPolygon>" });
n += "</SnapPolygonList>";
var i = this.oPlugin.HWP_SetSnapPolygonInfo(n);
setTimeout(function () {
if (i < 0) {
t.reject() } else {
t.resolve() } }, 100);
return t.promise() } }, {
key: "JS_GetPolygonInfo", value: function Re() {
var e = $.Deferred();
var t = [];
var n = this.oPlugin.HWP_GetSnapPolygonInfo();
var i = r.oUtils.parseXmlFromStr(n);
$(i).find("SnapPolygon").each(function () {
var e = parseInt($(this).find("polygonType").text(), 10);
if (e === 1) {
var n = $(this).find("id").text();
var i = $(this).find("isClosed").text() === "true";
var o = $(this).find("tips").text();
var a = "#" + r.oUtils.colorTransfer($(this).find("r").text()) + r.oUtils.colorTransfer($(this).find("g").text()) + r.oUtils.colorTransfer($(this).find("b").text());
var s = parseInt($(this).find("PointNumMax").text(), 10);
var u = parseInt($(this).find("MinClosed").text(), 10);
var l = [];
$(this).find("pointList").find("point").each(function () {
l.push([parseFloat($(this).find("x").text()), parseFloat($(this).find("y").text())]) });
var f = {
id: n, points: l, closed: i, tips: o, drawColor: a, polygonType: e, pointNumMax: s, minClosed: u };
t.push(f) } });
setTimeout(function () {
e.resolve(t) }, 100);
return e.promise() } }, {
key: "JS_SetLineInfo", value: function Te(e) {
var t = $.Deferred();
var n = '<?xml version="1.0" encoding="utf-8"?><SnapLineList>';
$.each(e, function (e, t) {
n += "<SnapLine>";
n += "<id>" + t.id + "</id>";
n += "<editType>" + t.editType + "</editType>";
n += "<LineTypeEx>" + t.lineType + "</LineTypeEx>";
n += "<Tips>" + t.tips + "</Tips>";
if (t.lineType !== 2) {
n += "<MoveChange>" + t.mode + "</MoveChange>";
n += "<ArrowType>" + t.direction + "</ArrowType><CustomType>" + t.direction + "</CustomType><StartPos><x>" + t.points[0][0] + "</x><y>" + t.points[0][1] + "</y></StartPos><EndPos><x>" + t.points[1][0] + "</x><y>" + t.points[1][1] + "</y></EndPos>";
if (t.cutOffPositions) {
n += "<ParkingNoShow>true</ParkingNoShow><ParkingPointList>";
$.each(t.cutOffPositions, function (e, t) {
n += "<parkingWidth>" + t + "</parkingWidth>" });
n += "</ParkingPointList>" } } else {
n += "<ArrowType>" + (!t.direction ? 0 : t.direction - 1) + "</ArrowType><BreakLine><PointList>";
var i = t.points.length;
for (var o = 0;
o < i;
o++) {
n += "<point><x>" + t.points[o][0] + "</x><y>" + t.points[o][1] + "</y></point>" } n += "</PointList><isClosed>" + (i > 0).toString() + "</isClosed>";
n += "<isShowArrow>" + (t.direction === 0 ? "false" : "true") + "</isShowArrow>";
n += "<PointNumMax>1</PointNumMax>";
n += "<MinClosed>1</MinClosed>";
n += "</BreakLine>" } n += "<LineSelected>false</LineSelected>";
n += "<color><r>" + r.oUtils.colorRgb(t.drawColor)[0] + "</r><g>" + r.oUtils.colorRgb(t.drawColor)[1] + "</g><b>" + r.oUtils.colorRgb(t.drawColor)[2] + "</b></color>";
n += "</SnapLine>" });
n += "</SnapLineList>";
var i = this.oPlugin.HWP_SetSnapLineInfo(n);
setTimeout(function () {
if (i < 0) {
t.reject() } else {
t.resolve() } }, 100);
return t.promise() } }, {
key: "JS_GetLineInfo", value: function Ie() {
var e = $.Deferred();
var t = this.oPlugin.HWP_GetSnapLineInfo();
var n = r.oUtils.parseXmlFromStr(t);
var i = [];
$(n).find("SnapLine").each(function () {
var e = parseInt($(this).find("id").text(), 10);
var t = parseInt($(this).find("LineTypeEx").text(), 10);
var n = $(this).find("tips").text();
var r = void 0;
if (t === 3) {
r = parseInt($(this).find("CustomType").text(), 10) || parseInt($(this).find("LineType").text(), 10) } else if (t === 1 || t === 4) {
r = parseInt($(this).find("ArrowType").text(), 10) } else if (t === 2) {
var o = parseInt($(this).find("ArrowType").text(), 10);
if (isNaN(o)) {
o = 1 } else {
o += 1 } r = o }
var a = [];
var s = [];
var u = [];
var l = false;
var f = [];
var c = false;
var h = false;
var d = {
bShow: false, aPoints: [] };
if (t !== 2) {
a.push([parseFloat($(this).find("StartPos").find("x").text()), parseFloat($(this).find("StartPos").find("y").text())]);
a.push([parseFloat($(this).find("EndPos").find("x").text()), parseFloat($(this).find("EndPos").find("y").text())]);
if (t === 4) {
s.push([parseFloat($(this).find("Demarcation").find("Sp_x").text()), parseFloat($(this).find("Demarcation").find("Sp_y").text())]);
s.push([parseFloat($(this).find("Demarcation").find("Ep_x").text()), parseFloat($(this).find("Demarcation").find("Ep_y").text())]);
u.push([parseFloat($(this).find("PDCArrow").find("Sp_x").text()), parseFloat($(this).find("PDCArrow").find("Sp_y").text())]);
u.push([parseFloat($(this).find("PDCArrow").find("Ep_x").text()), parseFloat($(this).find("PDCArrow").find("Ep_y").text())]);
l = "true" === $(this).find("PDCShowMark").text() } if ($(this).find("ParkingNoShow").text() === "true") {
d.bShow = true;
d.aPoints.length = 0;
$(this).find("parkingWidth").each(function () {
d.aPoints.push(parseFloat($(this).text())) }) } } else {
$(this).find("BreakLine").find("point").each(function () {
a.push([parseFloat($(this).find("x").text()), parseFloat($(this).find("y").text())]) });
c = "true" === $(this).find("isShowArrow").text();
h = "true" === $(this).find("isClosed").text();
if (c) {
$(this).find("BreakLine").find("BLArrow").each(function () {
f.push([[parseFloat($(this).find("Sp_x").text()), parseFloat($(this).find("Sp_y").text())], [parseFloat($(this).find("Ep_x").text()), parseFloat($(this).find("Ep_y").text())]]) }) } }
var v = {
id: e, lineType: t, tips: n, points: a, direction: r, demarcation: s, pdcArrow: u, showMark: l, showArrow: c, arrowList: f, bClosed: h };
if (d.bShow) {
v.cutOffPositions = d.aPoints } i.push(v) });
setTimeout(function () {
e.resolve(i) }, 100);
return e.promise() } }, {
key: "JS_SetTextOverlay", value: function xe(e) {
var t = $.Deferred();
var n = e.channelName.name.replace(/&/g, "&amp;");
n = n.replace(/</g, "&lt;");
var i = e.width ? e.width : 704;
var r = e.height ? e.height : 576;
var o = "<?xml version='1.0' encoding='UTF-8'?><OSD>" + "<videoResolutionWidth>" + i + "</videoResolutionWidth><videoResolutionHeight>" + r + "</videoResolutionHeight>" + "<channelNameOverlay><enabled>" + e.channelName.enable + "</enabled><ChannelName>" + n + "</ChannelName>" + "<alignment>" + e.channelName.alignment + "</alignment>" + "<minMoveValue>" + e.minMoveValue + "</minMoveValue>" + "<positionX>" + Math.round(e.channelName.point[0] * i) + "</positionX>" + "<positionY>" + Math.round(e.channelName.point[1] * r) + "</positionY></channelNameOverlay>" + "<DateTimeOverlay><enabled>" + e.date.enable + "</enabled><type>" + e.date.dateType + "</type>" + "<clockType>" + e.date.timeFormat + "</clockType><displayWeek>" + e.date.showWeekDay + "</displayWeek>" + "<alignment>" + e.date.alignment + "</alignment>" + "<minMoveValue>" + e.minMoveValue + "</minMoveValue>" + "<positionX>" + Math.round(e.date.point[0] * i) + "</positionX>" + "<positionY>" + Math.round(e.date.point[1] * r) + "</positionY></DateTimeOverlay>" + "<TextOverlayList>";
for (var a = 0, s = e.text.length;
a < s;
a++) {
var u = e.text[a].text.replace(/&/g, "&amp;");
u = u.replace(/</g, "&lt;");
o += "<TextOverlay>";
o += "<id>" + e.text[a].id + "</id><enabled>" + e.text[a].enable + "</enabled>" + "<alignment>" + e.text[a].alignment + "</alignment>" + "<minMoveValue>" + e.minMoveValue + "</minMoveValue>" + "<positionX>" + Math.round(e.text[a].point[0] * i) + "</positionX>" + "<positionY>" + Math.round(e.text[a].point[1] * r) + "</positionY>" + "<displayText>" + u + "</displayText>";
o += "</TextOverlay>" } o += "</TextOverlayList></OSD>";
var l = this.oPlugin.HWP_SetTextOverlay(o);
setTimeout(function () {
if (l < 0) {
t.reject() } else {
t.resolve() } }, 100);
return t.promise() } }, {
key: "JS_GetTextOverlay", value: function De() {
var e = $.Deferred();
var t = this.oPlugin.HWP_GetTextOverlay();
var n = r.oUtils.parseXmlFromStr(t);
var i = {};
var o = $(n).find("channelNameOverlay").eq(0);
var a = $(n).find("DateTimeOverlay").eq(0);
var s = $(n).find("TextOverlayList").eq(0);
var u = parseInt($(n).find("videoResolutionWidth").eq(0).text(), 10);
var l = parseInt($(n).find("videoResolutionHeight").eq(0).text(), 10);
i.channelName = {
enable: $(o).find("enabled").eq(0).text() === "true", name: $(o).find("name").eq(0).text(), alignment: 0, point: [$(o).find("positionX").eq(0).text() / u, $(o).find("positionY").eq(0).text() / l] };
i.date = {
enable: $(a).find("enabled").eq(0).text() === "true", alignment: parseInt($(a).find("alignment").eq(0).text(), 10) || 0, dateType: parseInt($(a).find("type").eq(0).text(), 10) || 0, timeFormat: $(a).find("clockType").eq(0).text(), showWeekDay: $(a).find("displayWeek").eq(0).text() === "true", point: [$(a).find("positionX").eq(0).text() / u, $(a).find("positionY").eq(0).text() / l] };
i.text = [];
for (var f = 0, c = $(s).find("TextOverlay").length;
f < c;
f++) {
var h = $(s).find("TextOverlay").eq(f);
var d = {
id: $(h).find("id").eq(0).text(), enable: $(h).find("enabled").eq(0).text() === "true", alignment: parseInt($(h).find("alignment").eq(0).text(), 10) || 0, text: $(h).find("displayText").eq(0).text(), point: [$(h).find("positionX").eq(0).text() / u, $(h).find("positionY").eq(0).text() / l] };
i.text.push(d) } setTimeout(function () {
e.resolve(i) }, 100);
return e.promise() } }, {
key: "JS_ClearShapeByType", value: function ze(e, t) {
var n = $.Deferred();
var i = 0;
var r = 0;
if (e === "Rect") {
r = 0 } else if (e === "Polygon") {
r = 1 } else if (e === "Line") {
r = 2 } else if (e === "All") {
r = 4;
this.oPlugin.HWP_ClearDrawLineInfo(0) } else if (e === "Choosed") {
r = 6 } else if (e === "Point") {
r = 5 } if (t && t.length > 0 && (r === 0 || r === 1)) {
var o = '<?xml version="1.0" encoding="utf-8"?><SnapPolygonList>';
for (var a = 0, s = t.length;
a < s;
a++) {
o += "<SnapPolygon><id>" + t[a] + "</id><polygonType>" + r + "</polygonType></SnapPolygon>" } o += "</SnapPolygonList>";
i = this.oPlugin.HWP_ClearTargetPolygon(o);
setTimeout(function () {
if (i < 0) {
n.reject() } else {
n.resolve() } }, 100) } else {
i = this.oPlugin.HWP_ClearSnapInfo(r);
setTimeout(function () {
if ("Choosed" === e) {
n.resolve(i);
return } if (i < 0) {
n.reject() } else {
n.resolve(i) } }, 100) }
return n.promise() } }, {
key: "JS_SetCorrectionType", value: function Me(e) {
var t = $.Deferred();
var n = 0;
if (e === 1) {
n = this.oPlugin.HWP_SetPlayModeType(7) } else {
n = this.oPlugin.HWP_SetPlayModeType(7) } n = this.oPlugin.HWP_SetCorrectionType(e);
setTimeout(function () {
if (n < 0) {
t.reject(n) } else {
t.resolve() } }, 100);
return t.promise() } }, {
key: "JS_SetPlaceType", value: function Ee(e) {
var t = $.Deferred();
var n = this.oPlugin.HWP_SetPlaceType(e);
setTimeout(function () {
if (n < 0) {
t.reject(n) } else {
t.resolve() } }, 100);
return t.promise() } }, {
key: "JS_StartFishListener", value: function Oe(e, t, n) {
var i = $.Deferred();
var r = this.oPlugin.HWP_StartFishListener(e, t, n);
setTimeout(function () {
if (r < 0) {
i.reject(r) } else {
i.resolve() } }, 100);
return i.promise() } }, {
key: "JS_StopFishListener", value: function Fe() {
var e = $.Deferred();
var t = this.oPlugin.HWP_StopFishListener();
setTimeout(function () {
if (t < 0) {
e.reject(t) } else {
e.resolve() } }, 100);
return e.promise() } }, {
key: "JS_SetFishBoxListInfo", value: function qe(e) {
var t = $.Deferred();
var n = '<?xml version="1.0" encoding="utf-8"?><FishBoxList>';
$.each(e, function (e, t) {
n += "<PointPos>";
n += "<id>" + t.id + "</id>";
n += "<xPoint>" + t.xPoint + "</xPoint>";
n += "<yPoint>" + t.yPoint + "</yPoint>";
n += "<zPoint>" + t.zPoint + "</zPoint>";
n += "</PointPos>" });
n += "</FishBoxList>";
var i = this.oPlugin.HWP_SetFishBoxListInfo(n);
setTimeout(function () {
if (i < 0) {
t.reject(i) } else {
t.resolve() } }, 100);
return t.promise() } }, {
key: "JS_GetFishBoxListInfo", value: function Je() {
var e = $.Deferred();
var t = this.oPlugin.HWP_FECGetBoxPosList();
var n = r.oUtils.parseXmlFromStr(t);
var i = [];
$(n).find("PointPos").each(function () {
var e = parseInt($(this).find("id").text(), 10);
var t = parseFloat($(this).find("xPoint").text());
var n = parseFloat($(this).find("yPoint").text());
var r = parseFloat($(this).find("zPoint").text());
i.push({
id: e, xPoint: t, yPoint: n, zPoint: r }) });
setTimeout(function () {
e.resolve(i) }, 100);
return e.promise() } }, {
key: "JS_ClearAllWndFishBoxInfo", value: function We() {
var e = $.Deferred();
this.oPlugin.HWP_ClearAllWndFishBoxInfo();
setTimeout(function () {
e.resolve() }, 100);
return e.promise() } }, {
key: "JS_SetFishWndProperty", value: function Le(e, t, n) {
var i = $.Deferred();
var r = this.oPlugin.HWP_SetFishWndPty(e, t, n);
setTimeout(function () {
if (r < 0) {
i.reject(r) } else {
i.resolve() } }, 100);
return i.promise() } }, {
key: "JS_SetFishParams", value: function Ae(e, t, n, i) {
var r = $.Deferred();
var o = '<?xml version="1.0" encoding="utf-8"?><FishParams><CoreParams>';
o += "<top>" + e + "</top>";
o += "<right>" + t + "</right>";
o += "<bottom>" + n + "</bottom>";
o += "<left>" + i + "</left>";
o += "</CoreParams></FishParams>";
var a = this.oPlugin.HWP_SetFishParams(o);
setTimeout(function () {
if (a < 0) {
r.reject(a) } else {
r.resolve() } }, 100);
return r.promise() } }, {
key: "JS_ArrangeFECWindow", value: function Be(e) {
var t = $.Deferred();
var n = this.oPlugin.HWP_ArrangeFECWindow(e, "");
setTimeout(function () {
if (n < 0) {
t.reject(n) } else {
t.resolve() } }, 100);
return t.promise() } }, {
key: "JS_StartFECScan", value: function Ue(e) {
var t = $.Deferred();
var n = this.oPlugin.HWP_StartFECScan(e);
setTimeout(function () {
if (n < 0) {
t.reject(n) } else {
t.resolve() } }, 100);
return t.promise() } }, {
key: "JS_StopFECScan", value: function $e() {
var e = $.Deferred();
var t = this.oPlugin.HWP_StopFECScan();
setTimeout(function () {
if (t < 0) {
e.reject(t) } else {
e.resolve() } }, 100);
return e.promise() } }, {
key: "JS_FishEyePTZ", value: function He(e, t) {
var n = $.Deferred();
var i = 0;
if (e === 4) {
i = this.oPlugin.HWP_FECZoomIn(t) } else if (e === 5) {
i = this.oPlugin.HWP_FECZoomOut(t) } else {
i = this.oPlugin.HWP_FECPTZ(t) } setTimeout(function () {
if (i < 0) {
n.reject(i) } else {
n.resolve() } }, 100);
return n.promise() } }, {
key: "JS_FishEyeGetPreset", value: function Ne() {
var e = $.Deferred();
var t = this.oPlugin.HWP_FECGetPreset();
var n = r.oUtils.parseXmlFromStr(t);
var i = parseFloat($(n).find("xPoint").text());
var o = parseFloat($(n).find("yPoint").text());
var a = parseFloat($(n).find("zPoint").text());
var s = {
xPoint: i, yPoint: o, zPoint: a };
setTimeout(function () {
e.resolve(s) }, 100);
return e.promise() } }, {
key: "JS_FishEyeSetPreset", value: function Ge(e) {
var t = $.Deferred();
var n = '<?xml version="1.0" encoding="utf-8"?><FishEyePreset>';
n += "<xPoint>" + e.xPoint + "</xPoint>";
n += "<yPoint>" + e.yPoint + "</yPoint>";
n += "<zPoint>" + e.zPoint + "</zPoint>";
n += "</FishEyePreset>";
var i = this.oPlugin.HWP_FECSetPreset(n);
setTimeout(function () {
if (i < 0) {
t.reject(i) } else {
t.resolve() } }, 100);
return t.promise() } }, {
key: "JS_StartFECCruise", value: function je(e) {
var t = $.Deferred();
var n = '<?xml version="1.0" encoding="utf-8"?><FishEyePresetList>';
$.each(e, function (e, t) {
n += "<Preset>";
n += "<xPoint>" + t.xPoint + "</xPoint>";
n += "<yPoint>" + t.yPoint + "</yPoint>";
n += "<zPoint>" + t.zPoint + "</zPoint>";
n += "<time>" + t.time + "</time>";
n += "</Preset>" });
n += "</FishEyePresetList>";
var i = this.oPlugin.HWP_StartFECCruise(n);
setTimeout(function () {
if (i < 0) {
t.reject(i) } else {
t.resolve() } }, 100);
return t.promise() } }, {
key: "JS_StopFECCruise", value: function Ve() {
var e = $.Deferred();
var t = this.oPlugin.HWP_StopFECCruise();
setTimeout(function () {
if (t < 0) {
e.reject(t) } else {
e.resolve() } }, 100);
return e.promise() } }, {
key: "JS_SetIsHttps", value: function Xe(e) {
var t = $.Deferred();
var n = this.oPlugin.HWP_SetIsHttps(e);
setTimeout(function () {
if (n < 0) {
t.reject(n) } else {
t.resolve() } }, 100);
return t.promise() } }, {
key: "JS_SetReconnectInfo", value: function Ye(e, t) {
var n = $.Deferred();
var i = this.oPlugin.HWP_SetReconnectInfo(e, t);
setTimeout(function () {
if (i < 0) {
n.reject(i) } else {
n.resolve() } }, 100);
return n.promise() } }, {
key: "JS_CheckUpdate", value: function Ze(e) {
var t = $.Deferred();
var n = e.replace(/<\blocalServiceControl.*<\/localServiceControl\b>/, "");
var i = this.oPlugin.HWP_CheckPluginUpdate(n);
setTimeout(function () {
t.resolve(i) }, 100);
return t.promise() } }, {
key: "JS_SelectShape", value: function Ke(e, t) {
var n = $.Deferred();
var i = 0;
if (e === "Rect") {
i = 0 } else if (e === "Polygon") {
i = 1 } else if (e === "Line") {
i = 2 } else if (e === "All") {
i = 4;
this.oPlugin.HWP_ClearDrawLineInfo(0) }
var r = this.oPlugin.HWP_SelectDraw(0, i, t);
setTimeout(function () {
n.resolve(r) }, 100);
return n.promise() } }, {
key: "JS_GetPictureSize", value: function Qe(e) {
var t = $.Deferred();
var n = this.oPlugin.HWP_GetPictureSize(e);
setTimeout(function () {
t.resolve({
width: parseInt(n.split("*")[0], 10), height: parseInt(n.split("*")[1], 10) }) }, 100);
return t.promise() } }, {
key: "JS_SetOriginResolution", value: function et(e, t, n) {
var i = $.Deferred();
var r = this.oPlugin.HWP_setOriginResolution(e, t, n);
setTimeout(function () {
i.resolve(r) }, 100);
return i.promise() } }, {
key: "JS_SetPlayWndMode", value: function tt(e, t, n) {
var i = $.Deferred();
if (n) {
e = 64 }
var r = this.oPlugin.HWP_setPlayWndMode(e, t);
setTimeout(function () {
i.resolve(r) }, 100);
return i.promise() } }, {
key: "JS_UpdateWindowStyle", value: function nt() {
var e = new Promise(function (e) {
e() });
return e } }, {
key: "JS_CuttingPartWindow", value: function it() {
var e = new Promise(function (e) {
e() });
return e } }, {
key: "JS_RepairPartWindow", value: function rt() {
var e = new Promise(function (e) {
e() });
return e } }, {
key: "JS_SetPointInfo", value: function ot(e, t) {
var n = '<?xml version="1.0" encoding="utf-8"?><SnapLineList>';
var i = "<?xml version='1.0' encoding='utf-8'?><SnapPointList>";
t = t ? t : 0;
i += "<mode>" + t + "</mode>";
i += "<maxPointNum>1</maxPointNum>";
var o = false;
if (e) {
$.each(e, function () {
var e = "";
if (this.id > 0) {
e += "<id>" + this.id + "</id>" } if (this.drawColor) {
var t = r.oUtils.colorRgb(this.drawColor);
e += "<color>";
e += "<r>" + t[0] + "</r>";
e += "<g>" + t[1] + "</g>";
e += "<b>" + t[2] + "</b>";
e += "</color>" } if (this.tips) {
e += "<Tips>" + this.tips + "</Tips>" } if (this.editType) {
e += "<editType>" + this.editType + "</editType>" } if (this.lineType === 2) {
o = true;
n += "<SnapLine>";
n += e + "<LineTypeEx>2</LineTypeEx>" + "<StartPos>" + "<x></x>" + "<y></y>" + "</StartPos>" + "<EndPos>" + "<x></x>" + "<y></y>" + "</EndPos>" + "<BreakLine>" + "<isClosed>true</isClosed>" + "<MinClosed>1</MinClosed>" + "<PointNumMax>1</PointNumMax>";
n += "<pointList><point><x>" + this.points[0] + "</x><y>" + this.points[1] + "</y></point></pointList>";
n += "</BreakLine>" + "</SnapLine>" } else {
i += "<SnapPoint>" + e;
if (this.type) {
i += "<type>" + (this.type === "circle" ? 2 : 1) + "</type>" } if (this.points) {
i += "<position>";
i += "<positionX>" + this.points[0] + "</positionX>";
i += "<positionY>" + this.points[1] + "</positionY>";
i += "</position>" } i += "</SnapPoint>" } }) } i += "</SnapPointList>";
n += "</SnapLineList>";
var a = $.Deferred();
var s = void 0;
if (o) {
s = this.oPlugin.HWP_SetSnapLineInfo(n) } else {
s = this.oPlugin.HWP_SetSnapPointInfo(0, i) } setTimeout(function () {
a.resolve(s) }, 100);
return a.promise() } }, {
key: "JS_GetPointInfo", value: function at() {
var e = r.oUtils.parseXmlFromStr(this.oPlugin.HWP_GetSnapPointInfo(0));
var t = r.oUtils.parseXmlFromStr(this.oPlugin.HWP_GetSnapLineInfo());
var n = [];
$(e).find("SnapPoint").each(function () {
n.push({
id: parseInt($(this).find("id").text(), 10), drawColor: "#" + r.oUtils.colorTransfer($(this).find("color r").text()) + r.oUtils.colorTransfer($(this).find("color g").text()) + r.oUtils.colorTransfer($(this).find("color b").text()), type: $(this).find("type").text() === "2" ? "circle" : "cross", replace: parseInt($(e).find("mode").text(), 10) === 1, point: [parseFloat($(e).find("positionX").text()), parseFloat($(e).find("positionY").text())] }) });
$(t).find("SnapLine").each(function () {
if ($(this).find("BreakLine point").length === 1) {
n.push({
id: parseInt($(this).find("id").text(), 10), drawColor: "#" + r.oUtils.colorTransfer($(this).find("color r").text()) + r.oUtils.colorTransfer($(this).find("color g").text()) + r.oUtils.colorTransfer($(this).find("color b").text()), type: "cross", replace: false, point: [parseFloat($(this).find("BreakLine x").text()), parseFloat($(this).find("BreakLine y").text())] }) } });
var i = $.Deferred();
setTimeout(function () {
i.resolve(n) }, 100);
return i.promise() } }]);
return e }();
return e }();
t.ActiveXControl = a }]) });