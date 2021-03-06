"use strict";
var vertexYUVShader = [
    "attribute vec4 vertexPos;",
    "attribute vec2 texturePos;",
    "varying vec2 textureCoord;",
    "void main()",
    "{",
    "gl_Position = vertexPos;",
    "textureCoord = texturePos;",
    "}"].join("\n");
var fragmentYUVShader = [
    "precision highp float;",
    "varying highp vec2 textureCoord;",
    "uniform sampler2D ySampler;",
    "uniform sampler2D uSampler;",
    "uniform sampler2D vSampler;",
    "const mat4 YUV2RGB = mat4",
    "(",
    "1.1643828125, 0, 1.59602734375, -.87078515625,",
    "1.1643828125, -.39176171875, -.81296875, .52959375,",
    "1.1643828125, 2.017234375, 0, -1.081390625,",
    "0, 0, 0, 1", ");",
    "void main(void) {",
    "highp float y = texture2D(ySampler,  textureCoord).r;",
    "highp float u = texture2D(uSampler,  textureCoord).r;",
    "highp float v = texture2D(vSampler,  textureCoord).r;",
    "gl_FragColor = vec4(y, u, v, 1) * YUV2RGB;", "}"].join("\n");
(function (e, t) {
    e.SuperRender = t()
})(this, function () {
    function e(e) {
        this.canvasElement = document.getElementById(e);
        this.initContextGL();
        if (this.contextGL) {
            this.YUVProgram = this.initProgram(vertexYUVShader, fragmentYUVShader);
            this.initBuffers();
            this.initTextures()
        }
    }
    e.prototype.initContextGL = function () {
        var e = this.canvasElement;
        var t = null;
        try {
            t = e.getContext("webgl")
        }
        catch (e) {
            t = null
        }
        if (!t || typeof t.getParameter !== "function") {
            t = null
        }
        this.contextGL = t
    };
    e.prototype.initProgram = function (e, t) {
        var r = this.contextGL;
        var a = r.createShader(r.VERTEX_SHADER);
        r.shaderSource(a, e);
        r.compileShader(a);
        if (!r.getShaderParameter(a, r.COMPILE_STATUS)) {
            console.log("Vertex shader failed to compile: " + r.getShaderInfoLog(a))
        }
        var i = r.createShader(r.FRAGMENT_SHADER);
        r.shaderSource(i, t);
        r.compileShader(i);
        if (!r.getShaderParameter(i, r.COMPILE_STATUS)) {
            console.log("Fragment shader failed to compile: " + r.getShaderInfoLog(i))
        }
        var o = r.createProgram();
        r.attachShader(o, a);
        r.attachShader(o, i);
        r.linkProgram(o);
        if (!r.getProgramParameter(o, r.LINK_STATUS)) {
            console.log("Program failed to compile: " + r.getProgramInfoLog(o))
        }
        r.deleteShader(a);
        r.deleteShader(i);
        return o
    };
    e.prototype.initBuffers = function () {
        var e = this.contextGL;
        var t = e.createBuffer();
        e.bindBuffer(e.ARRAY_BUFFER, t);
        e.bufferData(e.ARRAY_BUFFER, new Float32Array([1, 1, -1, 1, 1, -1, -1, -1]), e.STATIC_DRAW);
        e.bindBuffer(e.ARRAY_BUFFER, null);
        var r = e.createBuffer();
        e.bindBuffer(e.ARRAY_BUFFER, r);
        e.bufferData(e.ARRAY_BUFFER, new Float32Array([1, 0, 0, 0, 1, 1, 0, 1]), e.DYNAMIC_DRAW);
        e.bindBuffer(e.ARRAY_BUFFER, null);
        this.vertexPosBuffer = t;
        this.texturePosBuffer = r
    };
    e.prototype.initTextures = function () {
        var e = this.contextGL;
        var t = this.YUVProgram;
        e.useProgram(t);
        var r = this.initTexture();
        var a = e.getUniformLocation(t, "ySampler");
        e.uniform1i(a, 0);
        this.yTextureRef = r;
        var i = this.initTexture();
        var o = e.getUniformLocation(t, "uSampler");
        e.uniform1i(o, 1);
        this.uTextureRef = i;
        var n = this.initTexture();
        var u = e.getUniformLocation(t, "vSampler");
        e.uniform1i(u, 2);
        this.vTextureRef = n;
        e.useProgram(null)
    };
    e.prototype.initTexture = function () {
        var e = this.contextGL;
        var t = e.createTexture();
        e.bindTexture(e.TEXTURE_2D, t);
        e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MAG_FILTER, e.LINEAR);
        e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MIN_FILTER, e.LINEAR);
        e.texParameteri(e.TEXTURE_2D, e.TEXTURE_WRAP_S, e.CLAMP_TO_EDGE);
        e.texParameteri(e.TEXTURE_2D, e.TEXTURE_WRAP_T, e.CLAMP_TO_EDGE);
        e.bindTexture(e.TEXTURE_2D, null);
        return t
    };
    e.prototype.SR_DisplayFrameData = function (e, t, r) {
        if (e <= 0 || t <= 0) {
            return
        }
        var a = this.contextGL;
        if (null == r) {
            a.clearColor(0, 0, 0, 0);
            a.clear(a.COLOR_BUFFER_BIT | a.DEPTH_BUFFER_BIT);
            return
        }
        var i = this.canvasElement;
        this.nWindowWidth = i.width;
        this.nWindowHeight = i.height;
        var o = this.nWindowWidth;
        var n = this.nWindowHeight;
        a.clearColor(.8, .8, 1, 1);
        a.clear(a.COLOR_BUFFER_BIT | a.DEPTH_BUFFER_BIT);
        a.viewport(0, 0, o, n);
        this.updateFrameData(e, t, r);
        var u = this.YUVProgram;
        a.useProgram(u);
        var f = this.vertexPosBuffer;
        a.bindBuffer(a.ARRAY_BUFFER, f);
        var s = a.getAttribLocation(u, "vertexPos");
        a.enableVertexAttribArray(s);
        a.vertexAttribPointer(s, 2, a.FLOAT, false, 0, 0);
        a.bindBuffer(a.ARRAY_BUFFER, null);
        var R = this.texturePosBuffer;
        a.bindBuffer(a.ARRAY_BUFFER, R);
        var T = a.getAttribLocation(u, "texturePos");
        a.enableVertexAttribArray(T);
        a.vertexAttribPointer(T, 2, a.FLOAT, false, 0, 0);
        a.bindBuffer(a.ARRAY_BUFFER, null);
        a.drawArrays(a.TRIANGLE_STRIP, 0, 4);
        a.disableVertexAttribArray(s);
        a.disableVertexAttribArray(T);
        a.useProgram(null)
    };
    e.prototype.updateFrameData = function (e, t, r) {
        var a = this.contextGL;
        var i = this.yTextureRef;
        var o = this.uTextureRef;
        var n = this.vTextureRef;
        var u = r;
        var f = e * t;
        var s = u.subarray(0, f);
        a.activeTexture(a.TEXTURE0);
        a.bindTexture(a.TEXTURE_2D, i);
        a.texImage2D(a.TEXTURE_2D, 0, a.LUMINANCE, e, t, 0, a.LUMINANCE, a.UNSIGNED_BYTE, s);
        var R = e / 2 * t / 2;
        var T = u.subarray(f, f + R);
        a.activeTexture(a.TEXTURE1);
        a.bindTexture(a.TEXTURE_2D, o);
        a.texImage2D(a.TEXTURE_2D, 0, a.LUMINANCE, e / 2, t / 2, 0, a.LUMINANCE, a.UNSIGNED_BYTE, T);
        var l = R;
        var v = u.subarray(f + R, f + R + l);
        a.activeTexture(a.TEXTURE2);
        a.bindTexture(a.TEXTURE_2D, n);
        a.texImage2D(a.TEXTURE_2D, 0, a.LUMINANCE, e / 2, t / 2, 0, a.LUMINANCE, a.UNSIGNED_BYTE, v)
    };
    e.prototype.SR_SetDisplayRect = function (e) {
        var t = this.contextGL;
        var r = this.nWindowWidth;
        var a = this.nWindowHeight;
        var i = null;
        if (e && r > 0 && a > 0) {
            var o = e.fLeft / r;
            var n = e.fTop / a;
            var u = e.fRight / r;
            var f = e.fBottom / a;
            i = new Float32Array([u, n, o, n, u, f, o, f])
        }
        else {
            i = new Float32Array([1, 0, 0, 0, 1, 1, 0, 1])
        }
        var s = this.texturePosBuffer;
        t.bindBuffer(t.ARRAY_BUFFER, s);
        t.bufferSubData(t.ARRAY_BUFFER, 0, i);
        t.bindBuffer(t.ARRAY_BUFFER, null)
    };
    e.prototype.SR_Destroy = function () {
        var e = this.contextGL;
        var t = this.YUVProgram;
        e.deleteProgram(t);
        var r = this.vertexPosBuffer;
        var a = this.texturePosBuffer;
        e.deleteBuffer(r);
        e.deleteBuffer(a);
        var i = this.yTextureRef;
        var o = this.uTextureRef;
        var n = this.vTextureRef;
        e.deleteTexture(i);
        e.deleteTexture(o);
        e.deleteTexture(n)
    };
    return e
});