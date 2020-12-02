function WSPlayer(args) {
    var that = this;

    this.FullScreen = false;

    this.url = "";

    var wsPlayerMode = {
        vod: "vod",
        live: "live"
    }

    this.soundOpened;
    this.volume = 0;

    var waitStopHandle;
    var waitStopHandle;

    var wsPlayerState = {
        ready: 0,
        playing: 1,
        pause: 2,
        slow: 3,
        fast: 4,
        end: 5,
        opening: 6,
        closing: 7,
        closed: 255
    }

    var default_args = {
        width: "100%",
        height: "100%",
        elementId: "video",
        path: "http://" + document.location.host + "/codebase/",
        mode: wsPlayerMode.live,
        url: ""
    }
    var ss = document.getElementsByTagName("script");
    for (let i = 0; i < ss.length; i++) {
        var index = 0;
        if ((index = ss[i].src.toLowerCase().lastIndexOf("wsplayer.js")) > 0) {
            default_args.path = ss[i].src.substr(0, index) + "codebase/";
            break;
        }
    }

    var current_args = Object.assign(default_args, args);

    if (args.url) {
        if (args.url.indexOf("vod") > 0) {
            current_args.mode = wsPlayerMode.vod;
        }
    }

    this.url = current_args.url;

    var element = document.getElementById(current_args.elementId);
    element.style.backgroundColor = "transparent";
    this.clientWidth = parseFloat(element.offsetWidth);
    this.clientHeight = parseFloat(element.offsetHeight);

    var sizeHandle = setInterval(function () {
        if (that.clientWidth > 0 && that.clientHeight > 0) {
            clearInterval(sizeHandle);
            return;
        }
        that.clientWidth = parseFloat(element.offsetWidth);
        that.clientHeight = parseFloat(element.offsetHeight);
    }, 100);

    var plugin;

    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = current_args.path + "jsPlugin-1.2.0.min.js?v=" + new Date().getTime();
    document.getElementsByTagName("head")[0].appendChild(script);



    function initTools() {

        if (that.tools && that.tools.control)
            that.volume = that.tools.control.volume.value;
        that.tools = new tools(element, current_args.mode);
        that.tools.createElements();
        that.tools.control.volume.value = that.volume;

        if (that.tools.control.play) {
            that.tools.control.play.addEventListener("click", function () {
                switch (that.status) {
                    case wsPlayerState.ready:
                        that.play();
                        break;
                    case wsPlayerState.end:
                        that.seek(0);
                        that.resume();
                        break;
                    case wsPlayerState.fast:
                    case wsPlayerState.slow:
                        //that.play();
                        that.speedResume();

                        break;
                    case wsPlayerState.pause:

                        that.resume();
                        break;
                    case wsPlayerState.playing:
                        if (current_args.mode == wsPlayerMode.vod)
                            that.pause();
                        else
                            that.stop();
                        break;
                    default:
                        break;
                }

            });
        }
        if (that.tools.control.stop) {
            that.tools.control.stop.addEventListener("click", function () {
                that.stop();
            });
        }
        if (that.tools.control.fullscreen) {
            that.tools.control.fullscreen.addEventListener("click", function () {
                if (that.FullScreen)
                    that.fullExit();
                else
                    that.fullScreen();
            });
        }

        if (that.tools.control.capturepicture) {
            that.tools.control.capturepicture.addEventListener("click", function () {
                that.capturePicture();
            });
        }

        if (that.tools.control.slow) {
            that.tools.control.slow.addEventListener("click", function () {
                that.slow();
            });
        }
        if (that.tools.control.fast) {
            that.tools.control.fast.addEventListener("click", function () {
                that.fast();
            });
        }
        if (that.tools.control.forward) {
            that.tools.control.forward.addEventListener("click", function () {
                that.frame();
            });
        }
        if (that.tools.control.position) {
            that.tools.control.position.addEventListener("mousedown", function () {
                that.pause();
                that.tools.control.isMoudseDown = true;
            });
            that.tools.control.position.addEventListener("mouseup", function () {
                that.tools.control.isMoudseDown = false;
                var value = that.tools.control.position.value - that.tools.control.position.min;
                that.seek(value);
                that.resume();
            });
            that.tools.control.position.addEventListener("mousemove", function (evt) {
                if (!evt) return;
                var width = evt.target.offsetWidth;
                var x = evt.offsetX;

                var p = x / width;

                var c = that.tools.control.position.max - that.tools.control.position.min;
                var current = c * p;
                if (current < 0)
                    current = 0;
                var date = new Date(current);
                date.setUTCHours(date.getUTCHours() - 8);
                this.title = date.format("HH:mm:ss");
                if (that.tools.control.isMoudseDown)
                    that.tools.control.begin_time.innerText = date.format("HH:mm:ss");
            });
        }
        if (that.tools.control.jump_back) {
            that.tools.control.jump_back.addEventListener("click", function () {
                if (that.playback_time.current) {
                    var date = new Date(that.playback_time.current.getTime());
                    date.setSeconds(date.getSeconds() - 30);
                    var value = date.getTime() - that.tools.control.position.min;
                    if (value <= 0)
                        value = 0;
                    that.seek(value);
                }
            });
        }
        if (that.tools.control.jump_forward) {
            that.tools.control.jump_forward.addEventListener("click", function () {
                if (that.playback_time.current) {
                    var date = new Date(that.playback_time.current.getTime());
                    date.setSeconds(date.getSeconds() + 30);
                    var value = date.getTime() - that.tools.control.position.min;
                    if (value >= that.tools.control.position.max)
                        return;
                    that.seek(value);
                }
            });
        }

        if (that.tools.control.volume.icon) {
            that.tools.control.volume.icon.addEventListener("click", function () {
                if (that.soundOpened) {
                    that.closeSound();
                }
                else {
                    that.openSound();
                }
                //that.tools.control.volume.value = that.value;

            });
        }


        if (that.tools.control.volume.slide) {
            that.tools.control.volume.slide.addEventListener("input", function () {
                var value = parseInt(this.value)
                if (value > 0) {
                    that.openSound();
                }
                else {
                    that.closeSound();
                }

                that.setVolume(value);
                that.tools.control.volume.value = value;
            })
        }


        var p = element.getElementsByClassName("parent-wnd")[0];
        p.addEventListener("dblclick", function () {
            console.log("dblclick");
            that.fullScreen();
        });

        document.addEventListener('fullscreenchange', function (e) {
            console.log("window fullscreenchange");
            console.log(e);
            plugin.JS_Resize(window.screen.width, window.screen.height);
        });
        document.addEventListener('webkitfullscreenchange', function (e) {
            if (!that.FullScreen) return;
            if (!window.screens) {
                window.screens = {};
            }
            if (e.path) {
                if (!e.path[0].fullscreennumber)
                    e.path[0].fullscreennumber = 1;
                e.path[0].fullscreennumber++;
                var id = e.path[0].id;
                window.screens[id] = e.path[0].fullscreennumber % 2 == 0 || document.fullscreen;

                setTimeout(function () {
                    if (window.screens[id]) {
                        var scale = 1 / getRatio();
                        console.log(window.screen.height);
                        plugin.JS_Resize(window.screen.width * scale, window.screen.height * scale);
                        that.tools.control.fullscreen.title = "退出";
                    }
                    else {
                        that.FullScreen = false;
                        plugin.JS_Resize(that.clientWidth, that.clientHeight);
                        that.tools.control.fullscreen.title = "全屏";
                    }


                    console.log("fullscreenchange id:" + id);

                }, 200);
            }

        });
        document.addEventListener('mozfullscreenchange', function () { console.log('mozfullscreenchange') });
        document.addEventListener('MSFullscreenChange', function () { console.log('MSFullscreenChange') });



    }





    script.onload = script.onreadystatechange = function () {
        !this.readyState || "loaded" === this.readyState || this.readyState;
        plugin = new JSPlugin(inner_args);

        initTools();
    }

    setInterval(function () {
        switch (that.status) {
            case wsPlayerState.pause:
            case wsPlayerState.slow:
            case wsPlayerState.fast:
            case wsPlayerState.end:
                that.tools.control.play.className = "play glyphicon glyphicon-play"
                that.tools.control.play.title = "播放"
                break;
            case wsPlayerState.playing:
                if (current_args.mode == wsPlayerMode.vod) {
                    that.tools.control.play.className = "play glyphicon glyphicon-pause"
                    that.tools.control.play.title = "暂停"
                }
                else {
                    that.tools.control.play.className = "play glyphicon glyphicon-stop"
                    that.tools.control.play.title = "停止"
                }
                break;
            default:
                break;
        }
    }, 0);


    var inner_args = {
        iCurrentSplit: 1,
        iHeight: current_args.height,                                    //高度
        iMaxSplit: 1,                                       //最大分割数量
        iType: 1,
        iWidth: current_args.width,
        szBasePath: current_args.path,
        szId: current_args.elementId
    }
    var timeout = 10;

    function doing(fn, args) {
        setTimeout(function () {

            if (!plugin) {
                doing(fn, args);
                return;
            }
            fn(args);

        }, timeout);
    }



    // this.getTime = function(){
    //     return plugin.JS_GetOSDTime(0);
    // }

    this.status = wsPlayerState.ready;



    function getStatus() {
        return plugin.JS_GetWndStatus(0);
    }



    this.playback_time = {
        begin: null,
        end: null,
        current: null
    }

    // 播放
    this.play = function () {




        console.log("status:", that.status);
        that.status = wsPlayerState.opening;


        element.className += " loading"
        var m_begin = that.url.match(/(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/);
        var begin, end;
        if (m_begin) {
            begin = new Date(m_begin[1], m_begin[2] - 1, m_begin[3], m_begin[4], m_begin[5], m_begin[6]);
            begin.setUTCHours(begin.getUTCHours() + 8);
            that.playback_time.begin = begin;
            current_args.mode = wsPlayerMode.vod;
        }

        var m_end = that.url.match(/_(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/);
        if (m_end) {
            end = new Date(m_end[1], m_end[2] - 1, m_end[3], m_end[4], m_end[5], m_end[6]);
            end.setUTCHours(end.getUTCHours() + 8);
            that.playback_time.end = end;
        }

        if (!m_begin && !m_end)
            current_args.mode = wsPlayerMode.live;

        doing(
            function (args) {

                var t = element.getElementsByClassName("tools")
                if (!t || !t[0]) {
                    initTools();
                }



                plugin.JS_Play(that.url, {
                    onPlaying: function () {
                        element.className = element.className.replace(/ loading/g, "")
                    },
                    getPosition: function (p) {
                        if (p.data) {

                            var u8array = new Uint8Array(p.data);

                            // 2020-02-22T10:11:22Z
                            // 01234567890123456789
                            var year = parseInt((String.fromCharCode.apply(null, u8array.slice(0, 4))));
                            var month = parseInt((String.fromCharCode.apply(null, u8array.slice(5, 7))));
                            var day = parseInt((String.fromCharCode.apply(null, u8array.slice(8, 10))));
                            var hour = parseInt((String.fromCharCode.apply(null, u8array.slice(11, 13))));
                            var minute = parseInt((String.fromCharCode.apply(null, u8array.slice(14, 16))));
                            var second = parseInt((String.fromCharCode.apply(null, u8array.slice(17, 19))));

                            that.playback_time.current = new Date(year, month - 1, day, hour, minute, second);
                            that.playback_time.current.setUTCHours(that.playback_time.current.getUTCHours() + 8);



                            that.tools.control.position.value = that.playback_time.current.getTime();

                            var current = new Date(that.tools.control.position.value - that.tools.control.position.min);
                            current.setUTCHours(current.getUTCHours() - 8);
                            that.tools.control.begin_time.innerText = current.format("HH:mm:ss");
                            // that.tools.control.position.title = current.format("HH:mm:ss");

                            var val = (that.playback_time.current.getTime() - that.tools.control.position.min) / (that.tools.control.position.max - that.tools.control.position.min);

                            var valStr = parseFloat(val) * 100 + "% 100%";
                            that.tools.control.position.style.backgroundSize = valStr;
                            //that.status = p.offset + 1 >= p.count ? that.status = wsPlayerState.end : that.status = wsPlayerState.playing;
                        }
                    },
                    timeout:{
                        loading:function(){
                            element.className += " loading";
                        }
                    }
                }, 0).then(() => {
                    that.status = wsPlayerState.playing;

                });



                if (that.tools.control.begin_time && that.playback_time.begin) {
                    that.tools.control.begin_time.innerText = "00:00:00"
                }
                if (that.tools.control.end_time && that.playback_time.end) {
                    var date = new Date(that.playback_time.end - that.playback_time.begin);
                    date.setUTCHours(date.getUTCHours() - 8);
                    that.tools.control.end_time.innerText = date.format("HH:mm:ss");
                }
                if (that.tools.control.position) {
                    if (that.playback_time.begin)
                        that.tools.control.position.min = that.playback_time.begin.getTime();
                    if (that.playback_time.end)
                        that.tools.control.position.max = that.playback_time.end.getTime();

                    console.log("interval:", that.tools.control.position.max - that.tools.control.position.min);
                }


            },
            {
                begin: that.playback_time.begin ? that.playback_time.begin.toISOString() : null, end: that.playback_time.end ? that.playback_time.end.toISOString() : null
            }
        );


    }


    this.seek = function (value) {


        doing(function () {
            console.log("seek:" + value);
            plugin.JS_Seek(0, value / 1000);
        });
    }
    // 快进
    this.fast = function () {

        var status = getStatus();
        console.log(status);
        if (status.iRate >= 4) return;
        doing(plugin.JS_Fast, 0);
        if (status.iRate > 1)
            that.status = wsPlayerState.fast;
    }
    // 慢放
    this.slow = function () {

        var status = getStatus();
        console.log(status);
        if (status.iRate <= -4) return;
        doing(plugin.JS_Slow, 0);
        if (status.iRate < 1)
            that.status = wsPlayerState.slow;
    }
    this.name = "";
    // 截图
    this.capturePicture = function () {

        //"ws://192.168.21.241:8800/ws/video/howellps/vod/dev_id/slot/stream/begin_end/vod.mp4?user=howell&password=123456";

        doing(function () {
            var name = "picture";

            var name = that.name;
            if (!name && that.url) {
                name = that.url;
                var begin = name.indexOf(current_args.mode) + current_args.mode.length + 1;
                var end = name.lastIndexOf(current_args.mode) - 1;
                name = name.substr(begin, end - begin);
                name = name.replace(/\//g, "_");
            }
            var date = new Date();

            if (that.playback_time.current) {
                date = that.playback_time.current;
            }
            var v;
            name += ("_" + date.getFullYear());
            name += ("_" + ((v = (date.getMonth() + 1)) < 10 ? '0' + v : v));
            name += ("_" + ((v = date.getDate()) < 10 ? '0' + v : v));
            name += ("_" + ((v = date.getHours()) < 10 ? '0' + v : v));
            name += ("_" + ((v = date.getMinutes()) < 10 ? '0' + v : v));
            name += ("_" + ((v = date.getSeconds()) < 10 ? '0' + v : v));

            plugin.JS_CapturePicture(0, name);
        });
    }





    // 暂停
    this.pause = function () {

        doing(plugin.JS_Pause, 0);
        that.status = wsPlayerState.pause;
    }

    this.speedResume = function () {

        doing(function () {
            var status = getStatus();
            if (status.iRate > 1) {
                that.slow();
                setTimeout(that.speedResume, 10);
            }
            else if (status.iRate < 1) {
                that.fast();
                setTimeout(that.speedResume, 10);
            }
            else {
                that.status = wsPlayerState.playing;
            }
        });
    }


    // 恢复
    this.resume = function () {

        doing(plugin.JS_Resume, 0);
        that.status = wsPlayerState.playing;
    }
    // 单帧
    this.frame = function () {

        doing(plugin.JS_FrameForward, 0);
        that.status = wsPlayerState.pause;
    }


    // 停止
    this.stop = function () {

        if (waitStopHandle)
            throw new Error("waiting for stop");
        if (element)
            element.className = element.className.replace(/ loading/g, "")

        that.soundOpened = false;

        if (!plugin) return;

        switch (that.status) {
            case wsPlayerState.closing:
            case wsPlayerState.closed:
                return;
            default: break;
        }


        console.log("stop");

        clearTimeout(waitStopHandle);
        waitStopHandle = null;
        try {
            return plugin.JS_Stop(0).then(() => {
                that.status = wsPlayerState.closed;
                var tools = element.getElementsByClassName("tools");
                if (tools && tools[0]) {
                    element.removeChild(tools[0]);
                    that.tools = null;
                }
            }).catch(ex => {
                that.status = wsPlayerState.closed;
                var tools = element.getElementsByClassName("tools");
                if (tools && tools[0]) {
                    element.removeChild(tools[0]);
                    that.tools = null;
                }
            });
        }
        finally {
            waitStopHandle = setTimeout(() => {
                clearTimeout(waitStopHandle);
                waitStopHandle = null;
            }, 1500);
        }

    }
    // 全屏
    this.fullScreen = function () {

        doing(function () {
            try {
                plugin.JS_FullScreenSingle(0);
            } catch (ex) {
                console.error(ex)
            }
            //plugin.JS_FullScreen(0);
            // plugin.JS_Resize(window.screen.width, window.screen.height);
            // resize();
            // that.FullScreen = true;
            that.FullScreen = true;
        });
    }

    this.resize = function (width, height) {

        if (!width)
            width = that.clientWidth;
        if (!height)
            height = that.clientHeight;
        doing(function (args) {
            var scale = 1 / getRatio();
            plugin.JS_Resize(args.width * scale, args.height * scale);
        }, {
            width: width, height: height
        });
    }


    function resize() {
        var handle = setInterval(function () {
            var scale = 1 / getRatio();
            if (that.FullScreen && !document.fullscreen) {
                that.FullScreen = false;
                plugin.JS_Resize(that.clientWidth, that.clientHeight);
                clearInterval(handle);
                that.tools.control.fullscreen.title = "全屏"
            }
            else if (that.FullScreen == false) {
                that.FullScreen = true;
                plugin.JS_Resize(window.screen.width * scale, window.screen.height * scale);
                that.tools.control.fullscreen.title = "退出"
            }
            else { }
        }, 200)
    }
    this.fullExit = function () {

        var element = document.documentElement;//若要全屏页面中div，var element= document.getElementById("divID");
        //IE ActiveXObject
        if (window.ActiveXObject) {
            var WsShell = new ActiveXObject('WScript.Shell')
            WsShell.SendKeys('{ESC}');
        }
        //HTML5 W3C 提议
        else if (element.requestFullScreen) {
            document.exitFullscreen();
        }
        //IE 11
        else if (element.msRequestFullscreen) {
            document.msExitFullscreen();
        }
        // Webkit (works in Safari5.1 and Chrome 15)
        else if (element.webkitRequestFullScreen) {
            document.webkitCancelFullScreen();
        }
        // Firefox (works in nightly)
        else if (element.mozRequestFullScreen) {
            document.mozCancelFullScreen();
        }
    }

    function getRatio() {
        var ratio = 0;
        var screen = window.screen;
        var ua = navigator.userAgent.toLowerCase();

        if (window.devicePixelRatio !== undefined) {
            ratio = window.devicePixelRatio;
        }
        else if (~ua.indexOf('msie')) {
            if (screen.deviceXDPI && screen.logicalXDPI) {
                ratio = screen.deviceXDPI / screen.logicalXDPI;
            }

        }
        else if (window.outerWidth !== undefined && window.innerWidth !== undefined) {
            ratio = window.outerWidth / window.innerWidth;
        }
        else { }
        return ratio;
    }





    this.download = function (filename, type) {

        if (current_args.mode == wsPlayerMode.vod)
            doing(function (args) {
                plugin.JS_Download(args.filename, args.type);
            },
                { filename: filename, type: type }
            );
    }


    this.openSound = function () {
        doing(function () {
            if (that.soundOpened) return;
            plugin.JS_OpenSound(0);
            that.soundOpened = true;
        });
    }
    this.closeSound = function () {
        doing(function () {
            if (!that.soundOpened) return;
            plugin.JS_CloseSound();
            that.soundOpened = false;
        });
    }


    this.getVolume = function (result) {
        doing(function (result) {
            plugin.JS_GetVolume(0, result);
        }, result)
    }
    this.setVolume = function (value) {
        doing(function (value) {
            plugin.JS_SetVolume(0, value);
            that.volume = value;
        }, value)
    }

    function tools(element, mode) {
        var tools = document.createElement("div");
        tools.className = "tools";
        //tools.style.display = "none";
        element.appendChild(tools);

        var content = document.createElement("div");
        content.className = "tools-content"
        tools.appendChild(content);

        // element.addEventListener("mouseover", function(){
        //     tools.style.display = ""
        // });

        // element.addEventListener("mouseout", function(){
        //     tools.style.display = "none"
        // });
        display = false;


        var that_tools = this;


        function createElement(ul, type, li_styles, ctr_params, ctr_styles) {
            var li = document.createElement("li");
            if (li_styles) {
                for (const key in li_styles) {
                    li.style[key] = li_styles[key];
                }
            }
            ul.appendChild(li);


            var ctr = document.createElement(type);
            if (ctr_params) {
                for (const key in ctr_params) {
                    ctr[key] = ctr_params[key]
                }
            }
            if (ctr_styles) {
                for (const key in ctr_styles) {
                    ctr.style[key] = ctr_styles[key];
                }
            }
            li.appendChild(ctr);
            return ctr;
        }





        this.createElements = function () {
            var ul = document.createElement("ul");
            content.appendChild(ul);


            that_tools.control.play = createElement(ul, "a", { width: "40px" }, { className: "play glyphicon glyphicon-play", title: "播放" });

            //that_tools.control.stop = createElement(ul, "a", {}, { className: "stop glyphicon glyphicon-stop", title: "停止" });
            //that_tools.control.pause = createElement(ul, "a", {}, { className: "pause glyphicon glyphicon-pause", title: "暂停" });
            that_tools.control.slow = createElement(ul, "a", {}, { className: "slow glyphicon glyphicon-backward", title: "慢放" });
            that_tools.control.fast = createElement(ul, "a", {}, { className: "fast glyphicon glyphicon-forward", title: "快进" });
            //that_tools.control.forward = createElement(ul, "a", {}, { className: "glyphicon glyphicon glyphicon-eject", title: "单帧进" });

            that_tools.control.jump_back = createElement(ul, "a", {}, { className: "jump_back glyphicon glyphicon-share-alt", title: "退30秒" });
            that_tools.control.jump_forward = createElement(ul, "a", {}, { className: "jump_forward glyphicon glyphicon-share-alt", title: "进30秒" });

            that_tools.control.begin_time = createElement(ul, "label", { width: "60px" }, {
                className: "begin_time",
                innerText: "00:00:00",
                title: "当前时间"
            });
            that_tools.control.position = createElement(ul, "input", { width: "calc(100% - 371px)" }, {
                className: "position",
                title: "00:00:00",
                type: "range"
            });
            that_tools.control.end_time = createElement(ul, "label", { width: "60px" }, { className: "end_time", title: "结束时间", innerText: "00:00:00", });




            that_tools.control.fullscreen = createElement(ul, "a", { float: "right" }, { className: "fullscreen glyphicon glyphicon-fullscreen", title: "全屏" });
            that_tools.control.capturepicture = createElement(ul, "a", { float: "right" }, { className: "capturepicture glyphicon glyphicon-picture", title: "截图" });



            if (mode == wsPlayerMode.live) {
                //that_tools.control.stop.style.display = "none";
                that_tools.control.slow.style.display = "none";
                that_tools.control.fast.style.display = "none";
                //that_tools.control.forward.style.display = "none";

                that_tools.control.jump_back.style.display = "none";
                that_tools.control.jump_forward.style.display = "none";


                that_tools.control.begin_time.style.display = "none";
                that_tools.control.position.style.display = "none";
                that_tools.control.end_time.style.display = "none";

            }


            that_tools.control.volume.icon = createElement(ul, "a", { float: "right" }, { className: "volume glyphicon glyphicon-volume-off", title: "音量" });
            that_tools.control.volume.panel = document.createElement("div");
            // volume_panel.style.display = "none";
            that_tools.control.volume.panel.className = "volume_panel";
            that_tools.control.volume.panel.style.display = "none";
            tools.appendChild(that_tools.control.volume.panel);

            that_tools.control.volume.slide = document.createElement("input");
            that_tools.control.volume.slide.type = "range";
            that_tools.control.volume.slide.min = 0;
            that_tools.control.volume.slide.max = 100;
            that_tools.control.volume.slide.value = 0;
            that_tools.control.volume.slide.style.backgroundSize = "0% 100%";
            that_tools.control.volume.slide.step = 10;
            that_tools.control.volume.panel.appendChild(that_tools.control.volume.slide);



            function onSlideInput(ctr) {
                var value = (ctr.value - ctr.min) / (ctr.max - ctr.min);
                var valStr = value * 100 + "% 100%";
                ctr.style.backgroundSize = valStr;
                ctr.title = "音量：" + (value * 100) + "%";
                that_tools.control.volume.icon.title = ctr.title;
                that_tools.control.volume.value = parseInt(ctr.value);
                if (value == 0) {
                    ctr.opened = false;
                    that_tools.control.volume.icon.className = "volume glyphicon glyphicon-volume-off";
                }
                else {
                    ctr.opened = true;
                    that_tools.control.volume.icon.className = "volume glyphicon glyphicon-volume-up";
                }
            }

            that_tools.control.volume.slide.addEventListener("input", function () {
                onSlideInput(this);
            });


            that_tools.control.volume.icon.addEventListener("mouseover", function () {
                display = true;
                that_tools.control.volume.panel.style.display = "";
            });

            that_tools.control.volume.icon.addEventListener("click", function () {

                setTimeout(function () {
                    if (that_tools.control.volume.value == 0)
                        that_tools.control.volume.value = 80;
                    var value = parseInt(that_tools.control.volume.value);
                    if (that_tools.control.volume.slide.value > 0) {
                        that_tools.control.volume.slide.value = 0;
                    }
                    else {
                        that_tools.control.volume.slide.value = that_tools.control.volume.value;
                    }
                    onSlideInput(that_tools.control.volume.slide);
                    that_tools.control.volume.value = value;
                }, 10);
            });
            that_tools.control.volume.icon.addEventListener("dblclick", function () {
                if (that_tools.control.volume.value == 0)
                    that_tools.control.volume.value = 80;


                var value = parseInt(that_tools.control.volume.value);

                if (that_tools.control.volume.slide.value > 0) {
                    that_tools.control.volume.slide.value = 0;
                }
                else {
                    that_tools.control.volume.slide.value = that_tools.control.volume.value;
                }
                onSlideInput(that_tools.control.volume.slide);
                that_tools.control.volume.value = value;
                // if (this.opened) {
                //     that_tools.control.volume.icon.className = "volume glyphicon glyphicon-volume-up";
                //     this.opened = true;                    
                //     if(this.value == 0)
                //     {
                //         this.value = that_tools.control.volume.value;
                //     }
                // }
                // else {
                //     that_tools.control.volume.icon.className = "volume glyphicon glyphicon-volume-off";
                //     this.opened = false;
                // }
            });
            that_tools.control.volume.icon.addEventListener("mouseleave", function () {
                setTimeout(function () {
                    if (display == false)
                        that_tools.control.volume.panel.style.display = "none";
                }, 100);
                display = false;

            });
            that_tools.control.volume.panel.addEventListener("mouseleave", function () {

                setTimeout(function () {
                    if (display == false)
                        that_tools.control.volume.panel.style.display = "none";
                }, 100);
                display = false;
            });
            that_tools.control.volume.panel.addEventListener("mouseover", function () {
                display = true;
            });




            // var li_stop = document.createElement("li");
            // ul.appendChild(li_stop);

            // that.control.stop = document.createElement("a");
            // that.control.stop.className = "stop howell-icon-Square"
            // that.control.stop.style.display = "none";
            // li_stop.appendChild(that.control.stop);



            // var li_fullscreen = document.createElement("li");
            // li_fullscreen.style.float = "right";
            // ul.appendChild(li_fullscreen);

            // that.control.fullscreen = document.createElement("a");
            // that.control.fullscreen.className = "fullscreen glyphicon glyphicon-fullscreen"
            // li_fullscreen.appendChild(that.control.fullscreen);


            // that_tools.control.play.addEventListener("click", function () {
            //     that_tools.control.play.className = "play glyphicon glyphicon-pause";
            //     //that_tools.control.pause.style.display = "";
            // });

            // that_tools.control.pause.addEventListener("click", function () {
            //     that_tools.control.play.style.display = "";
            //     that_tools.control.pause.style.display = "none";
            // });

            that_tools.control.position.addEventListener("input", function () {
                var value = (this.value - this.min) / (this.max - this.min);

                var valStr = value * 100 + "% 100%";
                this.style.backgroundSize = valStr;
            });

        };

        this.control = {
            play: null,
            stop: null,
            pause: null,
            forward: null,
            fast: null,
            slow: null,

            begin_time: null,
            end_time: null,
            position: null,
            fullscreen: null,
            capturepicture: null,
            jump_forward: null,
            jump_back: null,
            volume: {
                icon: null,
                panel: null,
                slide: null,
                value: 0
            }

        }


    }


}