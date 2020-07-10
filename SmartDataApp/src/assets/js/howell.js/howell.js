/// <reference path="../jquery/jquery-1.10.2.min.js" />
/// <reference path="../imported.js" />
{
    var head = document.getElementsByTagName("HEAD").item(0);
    var $head = $(head)
    var host = document.location.protocol + "//" + document.location.host;
    var scripts = document.getElementsByTagName("script");

    var Import = {
        ext: "/js/howell.js/ext.js",
        base64: "/js/base64.js",
        jquery: "/js/jquery/jquery-1.10.2.min.js",
        bootstrap: "/js/bootstrap/bootstrap.min.js",
        confirm: "/js/jquery/jquery.confirm.js"
    }

    for (var key in Import) {
        var _import = Import[key];
        if (!exist(_import)) {
            try { $head.append($('<script src="' + host + _import + '"></script>')[0]); } catch (e) { }
        }
    }


    //if (!this.imported) {
    //    try { $head.append($('<script src="' + host + '/js/imported.js"></script>')[0]); } catch (e) { }
    //}

    //if (!this.base64encode) {
    //    try { $head.append($('<script src="' + host + '/js/base64.js"></script>')[0]); } catch (e) { }
    //}
    //if (!$.confirm) {
    //    try { $head.append($('<script src="' + host + '/js/jquery/jquery.confirm.js"></script>')[0]); } catch (e) { }
    //}
    if (navigator.userAgent.toUpperCase().indexOf("MSIE 8.0") > 0) {
        try { $head.append($('<script src="' + host + '/js/compatible/excanvas.js"></script>')[0]); } catch (e) { }
        try { $head.append($('<script src="' + host + '/js/compatible/html5shiv.js"></script>')[0]); } catch (e) { }
        try { $head.append($('<script src="' + host + '/js/compatible/respond.js"></script>')[0]); } catch (e) { }
        try { $head.append($('<script src="' + host + '/js/compatible/selectivizr.js"></script>')[0]); } catch (e) { }
    }
}

function exist(_import) {
    if (!scripts)
        return false;

    var result = false;
    for (var i = 0; i < scripts.length; i++) {
        if (scripts[i] && scripts[i].src.indexOf(_import) > 0) {
            result = true;
            break;
        }
    }
    return result;
}



var isGetStatus = false;

var is =
    {
        types: ["Array", "Boolean", "Date", "Number", "Object", "RegExp", "String", "Window", "HTMLDocument"]
    }

for (var i = 0, c; c = is.types[i++];) {
    is[c] = (function (type) {
        return function (obj) {
            return Object.prototype.toString.call(obj) == "[object " + type + "]";
        }
    }
    )(c);
}

function Uri(uri) {
    /// <signature>
    /// <summary>网络连接字符串</summary>
    /// <field name='Origin' type='String'>原始 URI 字符串。</field>
    /// <field name='AbsoluteUri' type='String'>绝对 URI。</field>
    /// <field name='Scheme' type='String'>方案名称</field>
    /// <field name='UserInfo' type='String'>用户名、密码或其他与指定 URI 关联的特定于用户的信息。</field>
    /// <field name='Authority' type='String'>域名系统 (DNS) 主机名或 IP 地址和端口号</field>
    /// <field name='Port' type='Int'>端口号</field>
    /// <field name='Host' type='String'>主机</field>
    /// <field name='PathAndQuery' type='String'>用问号 (?) 分隔的 AbsolutePath 和 Query</field>
    /// <field name='AbsolutePath' type='String'>URI 的绝对路径</field>
    /// <field name='Query' type='String'>URI 中包括的任何查询信息</field>
    /// <field name='Querys' type='Object'>URI 中包括的任何查询信息集合</field>
    /// <field name='Segments' type='String'>构成指定 URI 的路径段的数组</field>
    /// </signature>

    uri = uri.toString();
    if (uri.lastIndexOf("#") == uri.length - 1)
        uri = uri.substr(0, uri.length - 1);
    var temp;
    var schemeIndex = uri.indexOf(":") + 3;
    var userInfoIndex = uri.indexOf("@");
    var authorityIndex = uri.indexOf("/", schemeIndex);
    if (authorityIndex < 0)
        authorityIndex = uri.length;
    var queryIndex = uri.indexOf("?");

    this.Origin = uri;
    if (queryIndex > 0) {
        this.Origin = uri.substr(0, queryIndex);
    }
    this.AbsoluteUri = uri;
    this.Scheme = uri.substr(0, schemeIndex - 3);
    this.UserInfo = null;
    this.Authority = null;
    if (userInfoIndex > 0) {
        this.UserInfo = uri.substr(schemeIndex, userInfoIndex - schemeIndex);
        this.Authority = uri.substr(userInfoIndex + 1, authorityIndex - userInfoIndex - 1);
    } else {
        this.Authority = uri.substr(schemeIndex, authorityIndex - schemeIndex);
    }
    this.Port = 80;
    this.Host = this.Authority;
    if (this.Authority.indexOf(":") > 0) {
        temp = this.Authority.split(":");
        this.Host = temp[0];
        this.Port = temp[1];
    }

    this.PathAndQuery = uri.substr(authorityIndex);

    this.AbsolutePath = this.PathAndQuery;

    this.Query = "";
    this.Querys = {};
    if (queryIndex > 0) {
        temp = this.PathAndQuery.split("?");
        this.AbsolutePath = temp[0];
        this.Query = temp[1];
    }
    if (this.Query) {
        var items = this.Query.split("&");
        for (var i = 0; i < items.length; i++) {
            var index = items[i].indexOf("=");
            this.Querys[items[i].substr(0, index)] = items[i].substr(index + 1);
        }
    }


    this.Segments = null;
    if (this.AbsolutePath != "") {
        this.Segments = this.AbsolutePath.split("/");
    }
}
Uri.prototype.toString = function () {
    var param = "";
    if (this.Querys) {
        var i = 0;
        for (var q in this.Querys) {
            if (i == 0)
                param = "?";
            if (i++ > 0)
                param += "&";
            param += (q + "=" + this.Querys[q]);
        }
    }

    var result = this.Scheme + "://";
    if (this.UserInfo)
        result += this.UserInfo + "@";
    result += this.Host;
    if (this.Origin.indexOf(":", 6) > 0)
        result += ":" + this.Port;

    result += this.AbsolutePath + param;
    return result;
    //return this.Origin + param;
}

var TryProcessDefault = new TryProcess();
TryProcessDefault.Catch = function (e) {
    $(".load5").hide();
    if ($('.confirmation-modal').length > 0) {
        $(document.body).removeClass("modal-open");
        $('.confirmation-modal').remove();
        $('.modal-backdrop').remove();
    }
    //var message = e.name 

    ;
    //var title = null;
    switch (e.number) {
        case 3:
            return false;
        case 401:
            var param = base64encode(document.location.toString());
            document.location = document.location.protocol + "//" + document.location.host + "/default.htm?from=" + param;
            return;
    }
    //if (e.message) {
    //    title = e.name 

    ;
    //    message = e.message;
    //}

    //$.confirm({
    //    title: title,
    //    text: message,
    //    alert: true,
    //    okButton: "确定"
    //});
    var height = document.documentElement.offsetHeight - 300;
    var text = "<div style='overflow-y:auto;max-height:" + height + "px;'>";
    if (e.number || e.number == 0)
        text += "<div>number:" + e.number + "</div>";
    if (e.name

    )
        text += "<div>name:" + e.name

            + "</div>";
    if (e.fileName)
        text += "<div>fileName:" + e.fileName + "</div>";
    if (e.lineNumber)
        text += "<div>lineNumber:" + e.lineNumber + "</div>";
    if (e.stack)
        text += "<div>stack:" + e.stack + "</div>";
    if (e.description && e.message)
        text += "<div>message:" + e.message + "</div>";
    else if (e.message)
        text += "<div>message:" + e.message + "</div>";
    else if (e.description)
        text += "<div>description:" + e.description + "</div>";
    text += "</div>";

    $.confirm({
        title: "报错了",
        text: text,
        okButton: "确定",
        alert: true,
        top: -1,
    });
    return false;
}

function TryProcess() {
    this.Catch = function (ex) {

    }
    this.Finally = function () { }


    this.Run = function (fn) {
        try {
            switch (arguments.length) {
                case 1:
                    return fn();
                case 2:
                    return fn(arguments[1]);
                case 3:
                    return fn(arguments[1], arguments[2]);
                case 4:
                    return fn(arguments[1], arguments[2], arguments[3]);
                case 5:
                    return fn(arguments[1], arguments[2], arguments[3], arguments[4]);
                case 6:
                    return fn(arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
                case 7:
                    return fn(arguments[1], arguments[2], arguments[3], arguments[4], arguments[5], arguments[6]);
            }
            return true;
        } catch (ex) {
            if (this.Catch)
                return this.Catch(ex);
            return false;
        }
        finally {
            if (this.Finally)
                this.Finally();
        }
    }
}


function tryCatch(fn, process) {
    /// <signature>
    /// <summary>捕获异常</summary>
    /// <param name='fn' type='function'>方法</param>    
    /// <param name='[args]'>方法参数，最多6个</param>
    /// <returns>返回方法返回值</returns>
    /// </signature>
    /// <reference path="../jquery/jquery.confirm.js" />

    var t = new TryProcess();
    if (process) {
        t.Catch = process;
    }
    else {
        t.Catch = function (e) {
            if ($('.confirmation-modal').length > 0) {
                $(document.body).removeClass("modal-open");
                $('.confirmation-modal').remove();
                $('.modal-backdrop').remove();
            }
            //var message = e.name 

            ;
            //var title = null;
            switch (e.number) {
                case 3:
                    return false;
                case 401:
                    var param = base64encode(document.location.toString());
                    document.location = document.location.protocol + "//" + document.location.host + "/default.htm?from=" + param;
                    return;
            }
            //if (e.message) {
            //    title = e.name 

            ;
            //    message = e.message;
            //}

            //$.confirm({
            //    title: title,
            //    text: message,
            //    alert: true,
            //    okButton: "确定"
            //});
            var height = document.documentElement.offsetHeight - 300;
            var text = "<div style='overflow-y:auto;max-height:" + height + "px;'>";
            if (e.number || e.number == 0)
                text += "<div>number:" + e.number + "</div>";
            if (e.name

            )
                text += "<div>name:" + e.name

                    + "</div>";
            if (e.fileName)
                text += "<div>fileName:" + e.fileName + "</div>";
            if (e.lineNumber)
                text += "<div>lineNumber:" + e.lineNumber + "</div>";
            if (e.stack)
                text += "<div>stack:" + e.stack + "</div>";
            if (e.description && e.message)
                text += "<div>message:" + e.message + "</div>";
            else if (e.message)
                text += "<div>message:" + e.message + "</div>";
            else if (e.description)
                text += "<div>description:" + e.description + "</div>";
            text += "</div>";

            // $.confirm({
            //     title: "报错了",
            //     text: text,
            //     okButton: "确定",
            //     alert: true,
            //     top: -1,
            // });
            $.toast({
                heading: "报错了",
                text: text,
                position: 'bottom-right',
                loaderBg: '#ff6849',
                icon: 'error',
                hideAfter: 3500,
                stack: 6
            });
            return false;
        }
    }

    return t.Run(fn);
}

// function tryCatch(fn, process) {
//     /// <signature>
//     /// <summary>捕获异常</summary>
//     /// <param name='fn' type='function'>方法</param>    
//     /// <param name='[args]'>方法参数，最多6个</param>
//     /// <returns>返回方法返回值</returns>
//     /// </signature>
//     /// <reference path="../jquery/jquery.confirm.js" />
//     try {
//         switch (arguments.length) {
//             case 1:
//                 return fn();
//             case 2:
//                 return fn(arguments[1]);
//             case 3:
//                 return fn(arguments[1], arguments[2]);
//             case 4:
//                 return fn(arguments[1], arguments[2], arguments[3]);
//             case 5:
//                 return fn(arguments[1], arguments[2], arguments[3], arguments[4]);
//             case 6:
//                 return fn(arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
//             case 7:
//                 return fn(arguments[1], arguments[2], arguments[3], arguments[4], arguments[5], arguments[6]);
//         }
//         return true;
//     } catch (e) {
//         if (process) {
//             try {
//                 process();
//             }
//             catch (ex) {

//             }
//             return false;
//         }
//         if ($('.confirmation-modal').length > 0) {
//             $(document.body).removeClass("modal-open");
//             $('.confirmation-modal').remove();
//             $('.modal-backdrop').remove();
//         }
//         //var message = e.name;
//         //var title = null;
//         var param = "";
//         switch (e.number) {
//             case 3:
//                 return false;

//             case 401:
//                 param = "?from=" + base64encode(document.location.toString());
//                 document.location = document.location.protocol + "//" + document.location.host + "/default.htm" + param;
//                 return;
//             case 412:
//                 var page = getCookie("page");
//                 if (page)
//                     document.location = page;
//                 else
//                     document.location = document.location.protocol + "//" + document.location.host + "/default.htm";
//                 return;
//         }
//         //if (e.message) {
//         //    title = e.name;
//         //    message = e.message;
//         //}

//         //$.confirm({
//         //    title: title,
//         //    text: message,
//         //    alert: true,
//         //    okButton: "确定"
//         //});
//         var height = document.documentElement.offsetHeight - 300;
//         var text = "<div style='overflow-y:auto;max-height:" + height + "px;'>";
//         if (e.number || e.number == 0)
//             text += "<div>number:" + e.number + "</div>";
//         if (e.name)
//             text += "<div>name:" + e.name + "</div>";
//         if (e.fileName)
//             text += "<div>fileName:" + e.fileName + "</div>";
//         if (e.lineNumber)
//             text += "<div>lineNumber:" + e.lineNumber + "</div>";
//         if (e.stack)
//             text += "<div>stack:" + e.stack + "</div>";
//         if (e.description && e.message)
//             text += "<div>message:" + e.message + "</div>";
//         else if (e.message)
//             text += "<div>message:" + e.message + "</div>";
//         else if (e.description)
//             text += "<div>description:" + e.description + "</div>";
//         text += "</div>";

//         $.confirm({
//             title: "报错了",
//             text: text,
//             okButton: "确定",
//             alert: true,
//             top: -1
//         });
//         return false;
//     }
// }
function Try(fn, defaultResult) {
    try {
        switch (arguments.length) {
            case 2:
                return fn();
            case 3:
                return fn(arguments[2]);
            case 4:
                return fn(arguments[2], arguments[3]);
            case 5:
                return fn(arguments[2], arguments[3], arguments[4]);
            case 6:
                return fn(arguments[2], arguments[3], arguments[4], arguments[5]);
            case 7:
                return fn(arguments[2], arguments[3], arguments[4], arguments[5], arguments[6]);
            case 8:
                return fn(arguments[2], arguments[3], arguments[4], arguments[5], arguments[6], arguments[7]);
            default:
                return defaultResult;
        }
    } catch (e) {
        return defaultResult;
    }
}


function loadJS(id, url) {
    var xmlHttp = null;
    if (window.ActiveXObject)//IE
    {
        try {
            //IE6以及以后版本中可以使用
            xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
        }
        catch (e) {
            //IE5.5以及以后版本可以使用
            xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
    }
    else if (window.XMLHttpRequest)//Firefox，Opera 8.0+，Safari，Chrome
    {
        xmlHttp = new XMLHttpRequest();
    }
    //采用同步加载
    xmlHttp.open("GET", url, false);
    //发送同步请求，如果浏览器为Chrome或Opera，必须发布后才能运行，不然会报错
    xmlHttp.send(null);
    //4代表数据发送完毕
    if (xmlHttp.readyState == 4) {
        //0为访问的本地，200到300代表访问服务器成功，304代表没做修改访问的是缓存
        if ((xmlHttp.status >= 200 && xmlHttp.status < 300) || xmlHttp.status == 0 || xmlHttp.status == 304) {
            var myHead = document.getElementsByTagName("HEAD").item(0);
            var myScript = document.createElement("script");
            myScript.language = "javascript";
            myScript.type = "text/javascript";
            myScript.id = id;
            try {
                //IE8以及以下不支持这种方式，需要通过text属性来设置
                myScript.appendChild(document.createTextNode(xmlHttp.responseText));
            }
            catch (ex) {
                myScript.text = xmlHttp.responseText;
            }
            myHead.appendChild(myScript);
            return true;
        }
        else {
            return false;
        }
    }
    else {
        return false;
    }
}


function JSONstringify(obj) {
    obj = JSONSerialization(obj);
    return JSON.stringify(obj);
}

function JSONDeserialization(message) {
    message = message.replace("NaN", "null");
    return $.parseJSON(message);
}

function JSONSerialization(obj) {
    for (var i in obj) {
        if (i.indexOf("Fixed") > 0) {
            var key = i.substr(0, i.indexOf("Fixed"));
            delete obj[key];
            delete obj[i];
        }
        else if (i.indexOf("Specified") > 0) {
            if (!obj[i]) {
                var key = i.substr(0, i.indexOf("Specified"));
                delete obj[key];
            }
            delete obj[i];
        }
        if (is.Object(obj[i])) {
            obj[i] = JSONSerialization(obj[i]);
        }
        if (is.Array(obj[i])) {
            for (var j = 0; j < obj[i].length; j++) {
                obj[i][j] = JSONSerialization(obj[i][j]);
            }
        }
    }
    return obj;
}

function setCookie(name, value, path, expiredays) {
    var exdate = new Date();

    if (expiredays && is.Date(expiredays))
        exdate = expiredays;
    else
        exdate.setDate(exdate.getDate() + expiredays);
    document.cookie = name + "=" + escape(value) +
        ((expiredays) ? ";expires=" + exdate.toGMTString() + ";" : "") +
        ((path) ? ";path=" + path + ";" : "");
}
function getCookie(name) {
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(name + "=");
        if (c_start != -1) {
            c_start = c_start + name.length + 1;
            c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1) c_end = document.cookie.length;
            return unescape(document.cookie.substring(c_start, c_end));
        }
    }
    return "";
}

function getFuncName(_callee) {
    var _text = _callee.toString();
    //var _scriptArr = document.scripts;
    //for (var i = 0; i < _scriptArr.length; i++) {
    //    var _start = _scriptArr[i].text.indexOf(_text);
    //    if (_start != -1) {
    //        if (/^function\s*\(.*\).*\r\n/.test(_text)) {
    //            var _tempArr = _scriptArr[i].text.substr(0, _start).split('\r\n');
    //            return _tempArr[_tempArr.length - 1].replace(/(var)|(\s*)/g, '').replace(/=/g, '');
    //        } else {
    var result = _text.match(/^function\s*([^\(]+).*\r\n/);
    if (result)
        return result[1]
    else
        return _text.match(/^function\s*([^\(]+).*\n/)[1];
    //        }
    //    }
    //}
}


function insertAfter(newElement, targetElement) {
    var parent = targetElement.parentNode;
    if (parent.lastChild == targetElement) {
        parent.insertBefore(newElement);
    }
    else {
        parent.insertBefore(newElement, targetElement.nextSibling);
    }
}

function loadPage(args) {
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

    function load(uri) {
        var request = new XMLHttpRequest();
        request.open("GET", setParams(uri), false);
        request.send(null);
        var page = request.responseText;
        var index = page.indexOf(">", page.indexOf("<body"))
        page = page.substr(index + 1);
        page = page.substr(0, page.indexOf("</body>"));
        return page;
    }
    function loadById(id, uri) {
        var element = document.createElement("div");
        var vessel = document.getElementById(id);
        vessel.innerHTML = "";
        element.innerHTML = loadPage(uri);
        $($.parseHTML(element.outerHTML, document, true)).appendTo(vessel);
    }
    function loadByElement(element, uri) {
        var div = document.createElement("div");
        element.innerHTML = "";
        div.innerHTML = loadPage(uri);
        $($.parseHTML(div.outerHTML, document, true)).appendTo(element);
    }

    switch (arguments.length) {
        case 2:
            if (is.String(arguments[0]))
                loadById(arguments[0], arguments[1]);
            else
                loadByElement(arguments[0], arguments[1]);
            break;
        case 3:
            loadPage(arguments[0], arguments[1]);
            break;
        default:
            return load(arguments[0]);
    }
}


function getTag(id, type) {
    if (!type)
        type = getTagType.ID;
    switch (type) {
        case getTagType.ID:
            return document.getElementById(id);
        case getTagType.Name:
            return $("[name=" + id + "]");
        //return document.getElementsByName(id);
        case getTagType.Class:
            if (document.getElementsByClassName)
                return document.getElementsByClassName(id);
            return $("." + id)
        case getTagType.Tag:
            return document.getElementsByTagName(id);
        default:
            return document.getElementById(id);
    }
}

var getTagType =
    {
        ID: "id",
        Name: "name",
        Class: "class",
        Tag: "tag"
    }

function Dictionary(array, key) {
    if (array && key) {
        for (var i = 0; i < array.length; i++) {
            this[array[i][key]] = array[i];
        }
    }
}

Dictionary.prototype.where = function (fn, outKey) {
    var _key;
    this.forIn(function (key, value) {
        if (fn(value) == true) {
            _key = key;
            return false;
        }
    });
    if (outKey)
        outKey(_key);
    return this[_key];
}

Dictionary.prototype.count = function () {
    return Object.getOwnPropertyNames(this).length;
}

Dictionary.prototype.get = function (index) {
    var i = 0;
    for (var key in this) {
        if (i == index)
            return { key: key, value: this[key] };
        i++;
    }
}

Dictionary.prototype.toArray = function () {
    var array = new Array();
    var temp = this;
    temp.forIn(function (e) { array.push(temp[e]) })
    return array;
}

Dictionary.prototype.Keys = function () {
    var array = new Array();
    var temp = this;
    temp.forIn(function (e) { array.push(e) })
    return array;
}

Dictionary.prototype.forIn = function (code) {
    for (var key in this) {
        if (this[key].constructor.toString().indexOf("Function") > 0)
            continue;
        code(key, this[key]);
    }
}

Dictionary.prototype.search = function (propertys, inner) {
    var newDic = new Dictionary();
    var temp = this;
    temp.forIn(function (key, value) {
        for (var i = 0; i < propertys.length; i++) {
            if (value[propertys[i]].toString().toLowerCase() == inner.toString().toLowerCase()) {
                newDic[key] = value;
                break;
            }
        }
    })
    return newDic;
}

Dictionary.prototype.searchByFuzzy = function (propertys, inner) {
    var newDic = new Dictionary();
    var temp = this;
    temp.forIn(function (key, value) {
        for (var i = 0; i < propertys.length; i++) {
            if (value[propertys[i]].toString().toLowerCase().indexOf(inner.toString().toLowerCase()) > -1) {
                newDic[key] = value;
                break;
            }
        }
    })
    return newDic;
}

Dictionary.prototype.searchByComparer = function (inner, comparer) {
    var newDic = new Dictionary();
    var temp = this;
    temp.forIn(function (key, value) {
        var res = comparer(value, inner);
        if (res == 0) {
            newDic[key] = value;
        }
    })
    return newDic;
}

Dictionary.prototype.order = function (key, desc) {
    // function orderBy(a, b) {
    //        if (is.String(a[key] && is.String(b[key]))) {
    //            var min = Math.min(a[key].length, b[key].length);

    //            var result = 0;
    //            for (var i = 0; i < min; i++) {
    //                if (desc)
    //                    result = b[key][i].charCodeAt() - a[key][i].charCodeAt();
    //                else
    //                    result = a[key][i].charCodeAt() - b[key][i].charCodeAt();

    //                if (result != 0)
    //                    return result;
    //            }
    //            return result;
    //        }
    //        //        if (is.Number(a[key]) && is.Number(b[key]))
    //        if (desc)
    //            return b[key] - a[key];
    //        return a[key] - b[key];
    //    }
    var array = this.toArray();
    //return array.sort(orderBy);
    return array.sortBy(key, desc);
}


function isObjectExist(obj) {
    if (obj)
        return true;
    else
        return false;
}

is.PC = function () {
    var sUserAgent = navigator.userAgent.toLowerCase();
    var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
    var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
    var bIsMidp = sUserAgent.match(/midp/i) == "midp";
    var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
    var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
    var bIsAndroid = sUserAgent.match(/android/i) == "android";
    var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
    var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";

    if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
        return false;
    } else {
        return true;
    }
}

//$(document).ready(function () {
//    $("img").error(function () {
//        this.src = "http://" + document.location.host + "/img/default.png";
//    });
//});

var IntervalManager = {
    handles: new Array(),
    Set: function (fn, time, args) {
        var handle = setInterval(fn, time, args);
        this.handles.push(handle);
        return handle;
    },
    Clear: function (handle) {
        while (handles.length > 0) {
            clearInterval(this.handles.shift());
        }
    },
    Remove: function (handle) {
        var index = this.handles.indexOf(handle);
        handles.splice(index, 1);
        clearInterval(handle);
    }
}

var TimeoutManager = {
    handles: new Array(),
    Set: function (fn, time, args) {
        var handle = setTimeout(fn, time, args);
        this.handles.push(handle);
        return handle;
    },
    Clear: function (handle) {
        while (handles.length > 0) {
            clearTimeout(this.handles.shift());
        }
    },
    Remove: function (handle) {
        var index = this.handles.indexOf(handle);
        handles.splice(index, 1);
        clearTimeout(handle);
    }
}

var handles = new Array();
function toClearInterval(handle) {
    if (handle || handle == 0) {
        clearInterval(handle);
        var index = handles.indexOf(handle);
        handles.splice(index, 1);
        return;
    }
    while (handles.length > 0) {
        clearInterval(handles.shift());
    }
}

function toSetInterval(fn, time, args) {
    var handle = setInterval(fn, time, args)
    handles.push(handle);
    return handle;
}

function stopPropagation(e) {
    function getTopCallerArg(arg) {
        if (!arg.callee.caller)
            return arg;
        return getTopCallerArg(arg.callee.caller.arguments);
    }
    var evt = e || window.event || getTopCallerArg(arguments)[0];
    if (evt.stopPropagation) { //W3C阻止冒泡方法  
        evt.stopPropagation();
    } else {
        evt.cancelBubble = true; //IE阻止冒泡方法  
    }
}

function ElementInfo(id, type, defaultValue) {
    var value, _type = type, _id = id, _defaultValue = defaultValue ? defaultValue : "";

    this.element = new function () {
        var e = document.getElementById(_id);
        this.get = function () {
            if (!e) e = document.getElementById(_id);
            return e;
        }
        this.remove = function () {
            e = null;
        }
    }

    this.onchange = function () { }

    this.get = function () {
        switch (_type) {
            case ElementType.check:
                return this.element.get().checked;
            case ElementType.input:
                if (this.element.get().value == _defaultValue)
                    return null;
                return this.element.get().value;
            case ElementType.default:
            default:
                if (this.element.get().innerHTML == _defaultValue)
                    return null;
                return this.element.get().innerHTML;

        }
    };
    this.set = function (val) {
        value = val ? val : _defaultValue;

        switch (_type) {
            case ElementType.check:
                this.element.get().checked = value;
                break;
            case ElementType.input:
                this.element.get().value = value;
                break;
            case ElementType.default:
            default:
                this.element.get().innerHTML = value;
                break;
        }
        if (onchange) onchange(value);

    };
}

var ElementType = {
    "default": 0,
    "check": 1,
    "input": 2,

}

Array.prototype.toDictionary = function (key) {
    var dic = new Dictionary();
    for (var i = 0; i < this.length; i++) {
        dic[this[i][key]] = this[i];
    }
    return dic;
}

var StatusInfoType = {
    className: "className",
    innerHTML: "innerHTML"
};

function SelectInfo(id) {
    var _id = id;
    this.element = new function () {
        var e = document.getElementById(_id);
        this.get = function () {
            if (!e) e = document.getElementById(_id);
            return e;
        }
    }
    var values = new Array();
    this.add = function (display, value) {
        values.push(value);
        var option = document.createElement("option");
        option.value = value;
        option.innerHTML = display;
        this.element.get().appendChild(option);
        return option;
    }
    this.clear = function () {
        this.element.get().innerHTML = "";
    }
    this.set = function (value) {
        if (values.indexOf(value) < 0) {
            values.push(value);
            var option = document.createElement("option");
            option.value = value;
            option.innerHTML = value;
            this.element.get().appendChild(option);
        }
        this.element.get().value = value;
    }
    this.get = function () {
        return this.element.get().value;
    }
}

function StatusInfo(id, statusJson, defaultStatus) {
    var _id = id, _this = this, _status, _json = statusJson;
    this.element = new function () {
        var e = document.getElementById(_id);
        this.get = function () {
            if (!e) e = document.getElementById(_id);
            return e;
        }
    }

    this.get = function () {
        return _status;
    };
    this.set = function (status) {
        if (_status == status) return;
        if (_status) _this.element.get().className = _this.element.get().className.replace(_json[_status], "");
        _status = status;
        _this.element.get().className += " " + _json[_status];

    };

    this.set(defaultStatus);
};

function getFlagsArray(str) {
    var array = str.split(",");
    for (var i = 0; i < array.length; i++) {
        array[i] = array[i].replace(/(^\s*)|(\s*$)/g, "");
    }
    return array;
}

function TimeSpan(msec) {
    var milliseconds = msec;
    this.getDays = function () {
        return Math.floor(this.getHours() / 24);
    }
    this.getHours = function () {
        return Math.floor(this.getMinutes() / 60);
    }
    this.getMinutes = function () {
        return Math.floor(this.getSeconds() / 60);
    }
    this.getSeconds = function () {
        return Math.floor(milliseconds / 1000);
    }
    //以下是获取时间间隔的具体部分?
    this.getMillisecondPart = function () {
        return milliseconds - this.getSeconds() * 1000;
    }
    this.getSecondPart = function () {
        return this.getSeconds() - 60 * this.getMinutes();
    }
    this.getMinutePart = function () {
        return this.getMinutes() - 60 * this.getHours();
    }
    this.getHourPart = function () {
        return this.getHours() - 24 * this.getDays();
    }

}

function Timer(interval, fn, args) {
    var _this = this;
    var _interval = interval;

    var argNames = getFuncArgNames(this);

    this.Args = new Dictionary();

    for (var i = 2; i < argNames.length; i++) {
        this.Args[argNames[i]] = arguments[i];
    }


    var handle = null;
    this.IsStarted = false;


    this.getInterval = function () {
        return _interval;
    }
    this.setInterval = function (val) {
        if (_interval == val) return;
        _interval = val;
    }

    this.Start = function (callback) {
        if (this.IsStarted) return;
        _this.IsStarted = true;
        run(callback);
    }
    var lock = false;
    this.Stop = function (callback) {
        if (this.IsStarted) {
            clearTimeout(handle);
            _this.IsStarted = false;
            if (callback) callback();
        }
    }

    var run = function (callback) {
        if (callback && !_this.Args.callback) _this.Args["callback"] = callback;

        fn(_this.Args);
        if (_this.IsStarted) {
            handle = setTimeout(run, _this.getInterval(), _this.Args);
        }
    }

    this.Callback = null;
}