

(function () {

    var hadScript =
    {
        md5: "/js/md5.js"
    };
    for (var id in hadScript) {
        if (!document.getElementById(id)) {
            loadJS(id, document.location.protocol + "//" + document.location.host + hadScript[id]);
        }
    }
})();


function setCookie(name, value, expiredays) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + expiredays);
    document.cookie = name + "=" + escape(value) + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString());
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

function Digest(httpResponse) {
    var Authenticate = getAuthenticateByHttp(httpResponse);
    var cnonce = hex_md5((new Date()).getTime());
    var _username, ha1, ha2, method, uri;


    this.CookieExisted = function () {
        return getCookie(this.Name) ? true : false;
    }

    //根据第一次连接的返回信息，生成验证信息
    function getAuthenticateByHttp(httpResponse) {
        var result = new Object();
        var header = httpResponse.getResponseHeaders("WWW-Authenticate");
        header = header.replace("Digest1 ", "");
        while (header.indexOf("\"") >= 0) {
            header = header.replace("\"", "");
        }
        var items = header.split(",");
        for (var i = 0; i < items.length; i++) {
            var index = items[i].trim().indexOf("=");
            result[items[i].trim().substr(0, index)] = items[i].trim().substr(index + 1, items[i].length - index - 1);
        }
        return result;
    }
    //生成Response
    function getResponse(ha1, nonce, cnonce, qop, ha2) {
        return hex_md5(ha1 + ":" + nonce + ":00000001:" + cnonce + ":" + qop + ":" + ha2).toLowerCase();
    }

    //Digest名称
    this.Name = "Digest1";

    //登录（获取用户名密码，从而生成HA1）
    this.login = function (username, password) {
        _username = username;
        ha1 = hex_md5(username + ":" + Authenticate.realm + ":" + password).toLowerCase();
        setCookie(this.Name, "ha1:" + ha1 + ";username:" + username, 1);

    }
    //登录（获取在cookie中的HA1）
    this.loginByCookie = function () {
        var result = false;
        var cookieValue = getCookie(this.Name);
        if (cookieValue == "")
            return null;
        var items = cookieValue.split(";");
        var obj = new Object();
        for (var i = 0; i < items.length; i++) {
            var index = items[i].trim().indexOf(":");
            obj[items[i].trim().substr(0, index)] = items[i].trim().substr(index + 1, items[i].length - index - 1);
        }
        if (obj && obj.username && obj.ha1) {
            _username = obj.username;
            ha1 = obj.ha1;
            result = true;
        }
        return result;
    }
    //获取URL
    this.goto = function (httpMethod, url) {
        method = httpMethod;
        uri = new Uri(url);
        ha2 = hex_md5(httpMethod + ":" + uri.AbsolutePath).toLowerCase();
    }
    //获取验证信息
    this.getAuthorization = function () {
        var response = getResponse(ha1, Authenticate.nonce, cnonce, Authenticate.qop, ha2);
        return this.Name + " username=\"" + _username + "\",realm=\"" + Authenticate.realm + "\",nonce=\"" + Authenticate.nonce + "\",uri=\"" + uri.AbsolutePath + "\",qop=\"" + Authenticate.qop + "\",nc=00000001,cnonce=\"" + cnonce + "\",response=\"" + response + "\"";
    }
}