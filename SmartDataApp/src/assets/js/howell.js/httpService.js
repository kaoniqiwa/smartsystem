/// <reference path="../client/struct.js" />

var ContentType = {
    Json: "application/json; charset=utf-8",
    Html: "text/html",
    Stream: "application/octet-stream",
    Xml: "text/xml"
}
var HttpMethod =
{
    Post: "POST",
    Delete: "DELETE",
    Put: "PUT",
    Get: "GET"
}
function getHttpRequest() {
    //    var xhr = new XMLHttpRequest();
    //    if ("open" in xhr) {
    //        xhr.withCredentials
    //    } else if (typeof XDomainRequest != "undefined") {
    //        // 检测是否XDomainRequest可用
    //        xhr = new XDomainRequest();
    //    } else {
    //        // 看起来CORS根本不被支持
    //        xhr = null;
    //    }
    var xhr = null;

    if (window.XMLHttpRequest) {// code for IE7, Firefox, Opera, etc.
        xhr = new XMLHttpRequest();
    }
    else if (window.ActiveXObject) {// code for IE6, IE5
        xhr = new ActiveXObject("Microsoft.XMLHTTP");
    }


    return xhr;
}

//function Browser() {
//    this.Chrome = navigator.userAgent.toLowerCase().indexOf("chrome") > 0;

//    
//    
//}


function HttpService(contentType) {
    var xmlHttp = getHttpRequest();

    //function setParams(url, index, args) {
    //    if (args > index) {
    //        url += "?";
    //        for (var i = index; i < args.length; i++) {
    //            if (i > index)
    //                url += "&";
    //            url += args[i];
    //        }
    //    }
    //    return url;
    //}

    function setParams(url, param) {
        var i = 0;
        for (var p in param) {
            url += i++ > 0 ? "&" : "?";
            url += p + "=" + param[p];
        }

        url += i == 0 ? "?" : "&";
        url += "r=" + Math.random();

        return url;
    }


    function setContentHeader() {
        for (var item in m_Headers) {
            xmlHttp.setRequestHeader(item.replace("_", "-"), m_Headers[item]);
        }
        //try {
        //    xmlHttp.withCredentials = true;
        //} catch (e) { }
    }
    function showMsg(msg) {
        var inner = document.getElementById("inner");
        inner.innerHTML += (msg + "<br/>");
    }
    var i = 0;
    function pushEvent() {
        var inner = document.getElementById("inner");
        inner.innerHTML += (++i + "<br/>" + xmlHttp.responseText);
    }
    var m_Headers =
    {
        Accept: "application/json, text/javascript, */*; q=0.01",
        If_Modified_Since: 0,
        Cache_Control: "no-cache"
    }

    this.ContentType = contentType;


    this.setTimeout = function (time) {
        xmlHttp.timeout = time;
    }


    this.getResponseHeaders = function () {
        return xmlHttp.getAllResponseHeaders();
    }
    this.getResponseHeaders = function (key) {
        return xmlHttp.getResponseHeader(key);
    }
    this.addHeaders = function (key, value) {
        m_Headers[key] = value;
    }
    this.removeHeaders = function (key) {
        delete m_Headers[key];
    }

    this.servicePushClient = function (url, param) {
        if (validateParam(param)) {
            url += ("?" + param);
        }
        xmlHttp.multipart = true;
        xmlHttp.open(HttpMethod.Get, url, false);
        xmlHttp.onload = showMsg;
        //        xmlHttp.onreadystatechange = function () {
        //            var inner = document.getElementById("inner");
        //            inner.innerHTML += (xmlHttp.status+ ":"+xmlHttp.responseText + "<br/>");
        //        }
        xmlHttp.send("");


    }

    this.httpGet = function (url, param) {
        url = setParams(url, param);
        try {
            if (!xmlHttp)
                xmlHttp = getHttpRequest();


            //if (m_Headers.Cookie) {
            //    xmlHttp.open("OPTIONS", url, false);
            //    setContentHeader();
            //    xmlHttp.setRequestHeader("Set-Cookie",m_Headers.Cookie);
            //    xmlHttp.withCredentials = true;
            //    xmlHttp.send();
            //    if (xmlHttp.status != 200)
            //        return;
            //}



            xmlHttp.open(HttpMethod.Get, url, false);

            setContentHeader();

            xmlHttp.send();
            if (xmlHttp.status == 200) return xmlHttp.responseText;
            throw new howellException(xmlHttp.status, xmlHttp.statusText, xmlHttp.responseText);
        } finally {
        }
    }


    this.httpPost = function (url, data, args) {
        url = setParams(url, args);
        try {
            if (!xmlHttp)
                xmlHttp = getHttpRequest();

            xmlHttp.open(HttpMethod.Post, url, false);
            setContentHeader();
            if (this.ContentType != null)
                xmlHttp.setRequestHeader("Content-Type", this.ContentType);
            if (!data && data != false) data = null;
            xmlHttp.send(data);

            if (xmlHttp.status == 200) return xmlHttp.responseText;
            throw new howellException(xmlHttp.status, xmlHttp.statusText, xmlHttp.responseText);
        } finally {
            //xmlHttp.abort();
        }
    }

    this.httpPut = function (url, data, args) {
        url = setParams(url, args);
        try {
            if (!xmlHttp)
                xmlHttp = getHttpRequest();

            xmlHttp.open(HttpMethod.Put, url, false);
            setContentHeader();
            if (this.ContentType != null)
                xmlHttp.setRequestHeader("Content-Type", this.ContentType);
            if (!data && data != false) data = null;
            xmlHttp.send(data);

            if (xmlHttp.status == 200) return xmlHttp.responseText;
            throw new howellException(xmlHttp.status, xmlHttp.statusText, xmlHttp.responseText);
        } finally {
            //xmlHttp.abort();
        }

    }

    this.httpDelete = function (url, param) {
        url = setParams(url, param);
        if (!xmlHttp)
            xmlHttp = getHttpRequest();
        xmlHttp.open(HttpMethod.Delete, url, false);
        setContentHeader();
        xmlHttp.send(null);
        if (xmlHttp.status == 200) return xmlHttp.responseText;
        throw new howellException(xmlHttp.status, xmlHttp.statusText, xmlHttp.responseText);
    }

}

function UploadService() {
    var _this = this;
    var data = "";
    var _url;

    var reader = new FileReader();
    reader.onload = function () {
        data = this.result;
        var xhr = new XMLHttpRequest();

        xhr.upload.addEventListener("progress", _this.OnSending, false);
        //xhr.addEventListener("load", _this.OnCompleted, false);
        //xhr.addEventListener("error", _this.OnError, false);
        //xhr.addEventListener("abort", _this.OnCanceled, false);

        xhr.onreadystatechange = function () {
            //根据xmlHttp.readyState返回值不同调用不同的方法。                
            if (ReadyStateChange)
                ReadyStateChange(xhr);
        };

        xhr.open("POST", _url);
        xhr.setRequestHeader("Content-Type", "application/octet-stream");
        xhr.send(data);
    }

    var ReadyStateChange = function (xmlHttp) {
        //第五步：判断和服务器交互是否完成，还要判断服务器端是否正确返回数据

        switch (xmlHttp.readyState) {
            //xmlHttp.readyState == 0初始化状态。XMLHttpRequest 对象已创建或已被 abort() 方法重置。
            case HttpAsynState.Uninitialized:
                break;
                //open() 方法已调用，但是 send() 方法未调用。请求还没有被发送。
            case HttpAsynState.Open:
                if (_this.OnLoading)
                    _this.OnLoading();
                break;
                //Send() 方法已调用，HTTP 请求已发送到 Web 服务器。未接收到响应。
            case HttpAsynState.Sent:
                if (_this.OnLoaded)
                    _this.OnLoaded();
                break;
                //Receiving	所有响应头部都已经接收到。响应体开始接收但未完成。
            case HttpAsynState.Receiving:
                if (_this.OnInteractive)
                    _this.OnInteractive();
                break;
                //Loaded	HTTP 响应已经完全接收。
            case HttpAsynState.Loaded:
                if (xmlHttp.status == 0) {
                    if (_this.OnCanceled)
                        _this.OnCanceled(xmlHttp.responseText, xmlHttp.responseXML);
                }
                else if (xmlHttp.status == 200) {
                    if (_this.OnCompleted)
                        _this.OnCompleted(xmlHttp.responseText, xmlHttp.responseXML);
                }
                else {
                    if (_this.OnError)
                        _this.OnError(xmlHttp.status, xmlHttp.statusText, xmlHttp.responseText);
                }
                break;
            default:
                break;
        }
    };

    this.Upload = function (url, file) {
        if (_this.OnBegining)
            _this.OnBegining();

        _url = url;
        reader.readAsArrayBuffer(file);
    }

    this.OnBegining = function () {

    }

    this.OnSending = function (evt) {

    }
    this.OnError = function (evt) {

    }
    this.OnCanceled = function (evt) {

    }
    this.OnCompleted = function (evt) {

    }
}


function howellException(code, message, text) {
    this.number = code;
    this.message = message;
    this.description = text;
}

///<var>HTTP异步状态</var>
var HttpAsynState = {
    /// <field type='String'>0,请求未初始化（还没有调用 open()）。</field> 
    Uninitialized: 0,
    /// <field type='String'>1,请求已经建立，但是还没有发送（还没有调用 send()）。</field> 
    Open: 1,
    /// <field type='String'>2,请求已发送，正在处理中（通常现在可以从响应中获取内容头）。</field> 
    Sent: 2,
    /// <field type='String'>3,请求在处理中；通常响应中已有部分数据可用了，但是服务器还没有完成响应的生成。</field> 
    Receiving: 3,
    /// <field type='String'>4,响应已完成；您可以获取并使用服务器的响应了。</field> 
    Loaded: 4
};

function AsynHttpService(contentType, timeout) {
    var xmlHttp = getHttpRequest();


    var _this = this;
    function setParams(url, param) {
        var i = 0;
        for (var p in param) {
            url += i++ > 0 ? "&" : "?";
            url += p + "=" + param[p];
        }

        url += i == 0 ? "?" : "&";
        url += "r=" + Math.random();

        return url;
    }
    this.setTimeout = function (val) {
        try {
            xmlHttp.timeout = val;
        } catch (e) {

        }
    }
    this.setTimeout(timeout ? timeout : 0.5 * 1000);


    function setContentHeader() {
        for (var item in m_Headers) {
            xmlHttp.setRequestHeader(item.replace("_", "-"), m_Headers[item]);
        }
        //try {
        //    xmlHttp.withCredentials = true;
        //} catch (e) { }
    }



    var i = 0;
    var m_Headers =
    {
        Accept: "application/json, text/javascript, */*; q=0.01",
        If_Modified_Since: 0,
        Cache_Control: "no-cache"
    }



    var ReadyStateChange = function () {
        //第五步：判断和服务器交互是否完成，还要判断服务器端是否正确返回数据

        switch (xmlHttp.readyState) {
            //xmlHttp.readyState == 0初始化状态。XMLHttpRequest 对象已创建或已被 abort() 方法重置。
            case HttpAsynState.Uninitialized:
                break;
                //open() 方法已调用，但是 send() 方法未调用。请求还没有被发送。
            case HttpAsynState.Open:
                if (_this.OnLoading)
                    _this.OnLoading();
                break;
                //Send() 方法已调用，HTTP 请求已发送到 Web 服务器。未接收到响应。
            case HttpAsynState.Sent:
                if (_this.OnLoaded)
                    _this.OnLoaded();
                break;
                //Receiving	所有响应头部都已经接收到。响应体开始接收但未完成。
            case HttpAsynState.Receiving:
                if (_this.OnInteractive)
                    _this.OnInteractive();
                break;
                //Loaded	HTTP 响应已经完全接收。
            case HttpAsynState.Loaded:
                if (xmlHttp.status == 0) {
                    if (_this.OnAbort)
                        _this.OnAbort(xmlHttp.responseText, xmlHttp.responseXML);
                }
                else if (xmlHttp.status == 200) {
                    if (_this.OnComplete)
                        _this.OnComplete(xmlHttp.responseText, xmlHttp.responseXML);
                }
                else {
                    if (_this.OnError)
                        _this.OnError(xmlHttp.status, xmlHttp.statusText, xmlHttp.responseText);
                }
                break;
            default:
                break;
        }
    };


    this.ContentType = contentType;


    this.getResponseHeaders = function () {
        return xmlHttp.getAllResponseHeaders();
    }
    this.getResponseHeaders = function (key) {
        return xmlHttp.getResponseHeader(key);
    }
    this.addHeaders = function (key, value) {
        m_Headers[key] = value;
    }
    this.removeHeaders = function (key) {
        delete m_Headers[key];
    }

    this.httpGet = function (url, param) {
        docallback(url, param, HttpMethod.Get, null, null, ReadyStateChange);
    }
    this.httpDelete = function (url, param) {
        docallback(url, param, HttpMethod.Delete, null, null, ReadyStateChange);
    }
    this.httpPut = function (url, data, param) {
        var contentType
        if (this.ContentType)
            contentType = this.ContentType;
        if (!data && data != false) data = null;
        docallback(url, param, HttpMethod.Put, data, contentType, ReadyStateChange)
    }

    this.httpPost = function (url, data, param) {
        var contentType
        if (this.ContentType)
            contentType = this.ContentType;
        if (!data && data != false) data = null;
        docallback(url, param, HttpMethod.Post, data, contentType, ReadyStateChange)
    }

    this.Upload = function (url, file) {
        var req
    }



    this.AbortCallBack = function () {
        if (xmlHttp)
            xmlHttp.abort();
    }


    function docallback(url, param, method, data, contentType, readystatechange) {

        if (!data && data != false) data = null;
        url = setParams(url, param);

        if (!xmlHttp)
            xmlHttp = getHttpRequest();


        if (xmlHttp.readyState == HttpAsynState.Loaded || xmlHttp.readyState == HttpAsynState.Uninitialized) {

            //第二步：注册回调方法，当服务器处理结束返回数据以后利用回调方法实现局部的页面刷新数据
            //这个回调方法实际上在每次XMLHttpRequest对象的readyState属性的值发生变化的时候都会被调用
            xmlHttp.onreadystatechange = function () {
                //根据xmlHttp.readyState返回值不同调用不同的方法。                
                if (readystatechange)
                    readystatechange();
            };
            //第三步：设置和服务器交互的相应参数
            xmlHttp.open(method, url, true);

            setContentHeader();

            if (contentType)
                xmlHttp.setRequestHeader("Content-Type", contentType);


            //第四步：设置向服务器发送的数据，启动和服务器端交互
            xmlHttp.send(data);
        }

    }


    this.OnLoading = function () {        // Loading    
    }

    this.OnLoaded = function () {        // Loaded    
    }

    this.OnInteractive = function () {        // Interactive    
    }

    this.OnComplete = function (responseText, responseXml) {        // Complete    
    }

    this.OnAbort = function () {        // Abort    
    }

    this.OnError = function (status, statusText) {        // Error    
    }
}



