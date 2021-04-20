'use strict';
var WSPlayerProxy = function (iframe) {

    if (typeof (iframe) == 'string')
        iframe = document.getElementById(iframe);

    var queue = {};

    /** 播放视频 */
    this.play = function () {
        iframe.contentWindow.aPlayer.play();
    }
    this.seek = function (value) {
        iframe.contentWindow.aPlayer.seek(value);
    }
    /** 快进 */
    this.fast = function () {
        iframe.contentWindow.aPlayer.fast();
    }
    /** 慢放 */
    this.slow = function () {
        iframe.contentWindow.aPlayer.slow();
    }
    /** 截图 */
    this.capturePicture = function () {
        iframe.contentWindow.aPlayer.capturePicture();
    }
    /** 暂停 */
    this.pause = function () {
        iframe.contentWindow.aPlayer.pause();
    }
    /** 回复播放速度 */
    this.speedResume = function () {
        iframe.contentWindow.aPlayer.speedResume();
    }
    /** 恢复 */
    this.resume = function () {
        iframe.contentWindow.aPlayer.resume();
    }
    /** 单帧 */
    this.frame = function () {
        iframe.contentWindow.aPlayer.frame();
    }
    /** 停止 */
    this.stop = function () {
        return iframe.contentWindow.aPlayer.stop();
    };
    /** 全屏 */
    this.fullScreen = function () {
        iframe.contentWindow.aPlayer.fullScreen();
    }
    /** 设置视频尺寸 （参数不会被记录） */
    this.resize = function (width, height) {
        iframe.contentWindow.aPlayer.resize(width, height);
    }
    /** 下载 */
    this.download = function (filename, type) {
        iframe.contentWindow.aPlayer.download(filename, type);
    }
    var _onPlaying;
    /** 视频正在播放 */
    this.__defineGetter__("onPlaying", function () { return _onPlaying; });
    this.__defineSetter__("onPlaying", function (val) {
            _onPlaying = val;
            try {
                iframe.contentWindow.aPlayer.onPlaying = _onPlaying;
            }
            catch (ex) {
                queue.onPlaying = _onPlaying;
                lazy_loading();
            }
    });
    var _onStoping;
    /** 视频正在停止 */
    this.__defineGetter__("onStoping", function () { return _onStoping; });
    this.__defineSetter__("onStoping", function (val) {
        _onStoping = val;
            try {
                iframe.contentWindow.aPlayer.onStoping = _onStoping;
            }
            catch (ex) {
                queue.onStoping = _onStoping;
                lazy_loading();
            }
    });
    var _getPosition;
    /** 获取已播放未知 */
    this.__defineGetter__("getPosition", function () { return _getPosition; });
    this.__defineSetter__("getPosition", function (val) {
        _getPosition = val;
            try {
                iframe.contentWindow.aPlayer.getPosition = _getPosition;
            }
            catch (ex) {
                queue.getPosition = _getPosition;
                lazy_loading();
            }
    });
    var _onButtonClicked;
    this.__defineGetter__("onButtonClicked", function () { return _onButtonClicked; });
    this.__defineSetter__("onButtonClicked", function (val) {
        _onButtonClicked = val;
            try {
                iframe.contentWindow.aPlayer.onButtonClicked = _onButtonClicked;
            }
            catch (ex) {
                queue.onButtonClicked = _onButtonClicked;
                lazy_loading();
            }
    });
    var _onViewerDoubleClicked;
    /** 双击全屏 返回值：是否触发全屏 */
    this.__defineGetter__("onViewerDoubleClicked", function () { return _onViewerDoubleClicked; });
    this.__defineSetter__("onViewerDoubleClicked", function (val) {
        _onViewerDoubleClicked = val;
            try {
                iframe.contentWindow.aPlayer.onViewerDoubleClicked = _onViewerDoubleClicked;
            }
            catch (ex) {
                queue.onViewerDoubleClicked = _onViewerDoubleClicked;
                lazy_loading();
            }
    });

    function lazy_loading() {
        try {
            for (var key in queue) {
                iframe.contentWindow.aPlayer[key] = queue[key];
                delete queue[key];
            }
        } catch (ex) {
            setTimeout(lazy_loading, 5);
        }
    }
}