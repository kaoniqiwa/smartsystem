String.prototype.content = function (v) {
  if (this.indexOf(v) < 0)
    return false;
  return true;
}
//获取中文字
String.prototype.gb2812_length = function () {
  return this.gblen();
}

String.prototype.gblen = function () {
  var len = 0;
  for (var i = 0; i < this.length; i++) {
    if (this.charCodeAt(i) > 127 || this.charCodeAt(i) == 94) {
      len += 2;
    } else {
      len++;
    }
  }
  return len;
}
Object.Equals = function (a, b) { return a == b; }
Array.prototype.remove = function (val) {
  var index = this.indexOf(val);
  if (index > -1) {
    this.splice(index, 1);
  }
};
//Date.prototype.fromJSON = function (json) {
//    var start = json.indexOf("(") + 1;
//    var count = json.lastIndexOf(")") - start - 1;
//    var value = json.substr(start, count);

//    var utcValue;
//    var temp;
//    if (value.indexOf("+") >= 0) {
//        temp = value.split("+");
//        utcValue = parseInt(temp[0]) + 60 * 60 * 1000 * parseInt(temp[1]);
//    }
//    else if (value.indexOf("-") >= 0) {
//        var temp = value.split("-");
//        utcValue = parseInt(temp[0]) - 60 * 60 * 1000 * parseInt(temp[1]);
//    }

//    this.setTime(utcValue);
//}


if (!Date.prototype.toISOString) {
  Date.prototype.toISOString = function () {
    function pad (n) { return n < 10 ? '0' + n : n }
    return this.getUTCFullYear() + '-'
      + pad(this.getUTCMonth() + 1) + '-'
      + pad(this.getUTCDate()) + 'T'
      + pad(this.getUTCHours()) + ':'
      + pad(this.getUTCMinutes()) + ':'
      + pad(this.getUTCSeconds()) + '.'
      + pad(this.getUTCMilliseconds()) + 'Z';
  }
}

Date.prototype.fromJSON = function (json) {
  var date = new Date();
  //json = "";
  var yearIndex = json.indexOf("-");
  var year = json.substr(0, yearIndex);

  var monthIndex = json.indexOf("-", yearIndex + 1);
  var month = json.substr(yearIndex + 1, 2);

  var dayIndex = json.indexOf(" ", monthIndex + 1);
  if (dayIndex < 0)
    dayIndex = json.indexOf("T", monthIndex + 1);
  var day = json.substr(monthIndex + 1, 2);

  var hourIndex = json.indexOf(":", dayIndex + 1);
  var hour = json.substr(dayIndex + 1, 2);

  var minuteIndex = json.indexOf(":", hourIndex + 1);
  var minute = json.substr(hourIndex + 1, 2);

  var secondIndex = json.indexOf("Z", minuteIndex + 1);
  var second = json.substr(minuteIndex + 1, 2);

  var temp = new Date(year, month, day, hour, minute, second);
  temp.setMonth(temp.getMonth() - 1);
  this.setTime(temp.getTime());

}

Date.prototype.toLocalJSON = function () {

  function fullZero (value) {
    return value < 10 ? "0" + value : value;
  }

  var year = this.getFullYear();
  var month = this.getMonth() + 1;
  var day = this.getDate();

  var hour = this.getHours();
  var minute = this.getMinutes();
  var second = this.getSeconds();

  return year.toString() + fullZero(month).toString() + fullZero(day).toString() + "T" + fullZero(hour).toString() + fullZero(minute).toString() + fullZero(second).toString() + "Z";

}


Date.prototype.format = function (fmt) {
  var o = {
    "M+": this.getMonth() + 1, //月份          
    "d+": this.getDate(), //日          
    "h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //小时          
    "H+": this.getHours(), //小时          
    "m+": this.getMinutes(), //分          
    "s+": this.getSeconds(), //秒          
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度          
    "S": this.getMilliseconds() //毫秒          
  };
  var week = {
    "0": "\u65e5",
    "1": "\u4e00",
    "2": "\u4e8c",
    "3": "\u4e09",
    "4": "\u56db",
    "5": "\u4e94",
    "6": "\u516d"
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  if (/(E+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "\u661f\u671f" : "\u5468") : "") + week[this.getDay() + ""]);
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    }
  }
  return fmt;
}

if (!Array.prototype.indexOf) {
  Array.prototype.indexOf = function (elt /*, from*/) {
    var len = this.length >>> 0;
    var from = Number(arguments[1]) || 0;
    from = (from < 0)
      ? Math.ceil(from)
      : Math.floor(from);
    if (from < 0)
      from += len;
    for (; from < len; from++) {
      if (from in this &&
        this[from] === elt)
        return from;
    }
    return -1;
  };
}
if (!this.WebSocket) {
  var WebSocket = WebSocket || function (url) {
    var SRC = "WebSocket.swf";
    var id = Math.random() * 1E9 | 0, events = {}, s, i;
    //事件关联
    s = ["onopen", "onmessage", "onclose", "onerror"];
    for (i = 0; i < s.length; i++) (function (o, n) {
      var s = events[n] = [];
      window[n + id] = function (e) {
        if (typeof o["on" + n] == "function") o["on" + n](e);
        for (var i = 0; i < s.length; i++) s[i](e);
      };
    })(this, s[i]);
    //绑定事件操作函数
    this.addEventListener = function (e, f) {
      events[e].push(f);
    }, this.removeEventListener = function (e, f) {
      for (var i = 0, s = events[e]; i < s.length; i++)
        if (s[i] == f) s.splice(i, 1), i = s.length;
    };
    //绑定AS接口方法
    this.send = function (e) {
      window["WebSocket" + id].send(e);
    }, this.close = function () {
      window["WebSocket" + id].close();
    };
    //解析构造参数，加载SWF
    var o = url.match(/\/\/([\w.]+)(?::(\d+))?(.*$)/);
    o = [
      "id=" + id, "port=" + (o[2] || 80),
      "host=" + o[1], "path=" + (o[3] || "/")
    ].join("&");
    //var data = [
    //  '<object width="0" height="0" ',
    //  'type="application/x-shockwave-flash" ',
    //  'id="WebSocket' + id + '" data="' + SRC + '">',
    //  '<param name="Movie" value="' + SRC + '" />',
    //  '<param name="FlashVars" value="' + o + '" />',
    //  '</object>'
    //].join("");

    var data = document.createElement("object");

    data.type = "application/x-shockwave-flash";
    data.id = "WebSocket" + id;
    data.data = SRC;

    var param = document.createElement("param");
    param.name = "Movie";
    param.value = SRC;
    data.appendChild(param);

    param = document.createElement("param");
    param.name = "FlashVars";
    param.value = o;
    data.appendChild(param);

    document.body.appendChild(data);

    this.CONNECTING = "CONNECTING";

    this.readyState = "";

    //document.body
    //  ? document.body.insertAdjacentHTML("beforeend", data)
    //  : document.write(data);

  };
}


String.prototype.trim = function () {
  return this.replace(/(^\s*)|(\s*$)/g, "");
}

if (/firefox/.test(window.navigator.userAgent.toLowerCase())) {
  HTMLElement.prototype.__defineGetter__("innerText",
    function () {
      var anyString = "";
      var childS = this.childNodes;
      for (var i = 0; i < childS.length; i++) {
        if (childS[i].nodeType == 1)
          anyString += childS[i].tagName == "BR" ? '\n' : childS[i].textContent;
        else if (childS[i].nodeType == 3)
          anyString += childS[i].nodeValue;
      }
      return anyString;
    }
  );
  HTMLElement.prototype.__defineSetter__("innerText",
    function (sText) {
      this.textContent = sText;
    }
  );
}

Array.prototype.sortBy = function (key, desc) {
  function orderBy (a, b) {

    if (typeof a[key] === 'string' && typeof b[key] === 'string') {
      var min = Math.min(a[key].length, b[key].length);

      var result = 0;
      for (var i = 0; i < min; i++) {
        if (desc)
          result = b[key][i].charCodeAt() - a[key][i].charCodeAt();
        else
          result = a[key][i].charCodeAt() - b[key][i].charCodeAt();

        if (result != 0)
          return result;
      }

      if (a[key].length < b[key].length)
        return -1;
      return result;
    }
    if (desc)
      return b[key] - a[key];
    return a[key] - b[key];
  }
  return this.sort(orderBy);
}

String.prototype.naturalCompare = function (a, b) {
  return String.naturalCompare(a, b)
}
String.naturalCompare = function (a, b) {
  var i, codeA
    , codeB = 1
    , posA = 0
    , posB = 0
    , alphabet = String.alphabet

  function getCode (str, pos, code) {
    if (code) {
      for (i = pos; code = getCode(str, i), code < 76 && code > 65;)++i;
      return +str.slice(pos - 1, i)
    }
    code = alphabet && alphabet.indexOf(str.charAt(pos))
    return code > -1 ? code + 76 : ((code = str.charCodeAt(pos) || 0), code < 45 || code > 127) ? code
      : code < 46 ? 65               // -
        : code < 48 ? code - 1
          : code < 58 ? code + 18        // 0-9
            : code < 65 ? code - 11
              : code < 91 ? code + 11        // A-Z
                : code < 97 ? code - 37
                  : code < 123 ? code + 5        // a-z
                    : code - 63
  }


  if ((a += "") != (b += "")) for (; codeB;) {
    codeA = getCode(a, posA++)
    codeB = getCode(b, posB++)

    if (codeA < 76 && codeB < 76 && codeA > 66 && codeB > 66) {
      codeA = getCode(a, posA, posA)
      codeB = getCode(b, posB, posA = i)
      posB = i
    }

    if (codeA != codeB) return (codeA < codeB) ? -1 : 1
  }
  return 0
}

Array.prototype.find = function (fn) {
  for (var i = 0; i < this.length; i++) {
    if (fn(this[i]))
      return this[i];
  }
  return null;
}

Array.prototype.search = function (propertys, inner) {
  var newArr = new Array();
  var temp = this;
  for (var i = 0; i < temp.length; i++) {
    for (var j = 0; j < propertys.length; j++) {
      if (temp[i][propertys[j]].toString().toLowerCase() == inner.toString().toLowerCase()) {
        newArr.push(temp[i]);
        break;
      }
    }
  }
  return newArr;
}

Array.prototype.searchByFuzzy = function (propertys, inner) {
  var newArr = new Array();
  var temp = this;
  for (var i = 0; i < temp.length; i++) {
    for (var j = 0; j < propertys.length; j++) {
      if (temp[i][propertys[j]].toString().toLowerCase().indexOf(inner.toString().toLowerCase()) > -1) {
        newArr.push(temp[i]);
        break;
      }
    }
  }
  return newArr;
}

Array.prototype.searchByComparer = function (inner, comparer) {
  var newArr = new Array();
  var temp = this;
  for (var i = 0; i < temp.length; i++) {
    var res = comparer(temp[i], inner);
    if (res == 0) {
      newArr.push(temp[i]);
    }
  }
  return newArr;
}

if (navigator.userAgent.toLowerCase().indexOf('firefox') >= 0) {
  //firefox支持onmousewheel
  addEventListener('DOMMouseScroll', function (e) {
    var onmousewheel = e.target.getAttribute('onmousewheel');
    if (onmousewheel) {
      if (e.preventDefault) e.preventDefault();
      e.returnValue = false;    //禁止页面滚动

      if (typeof e.target.onmousewheel != 'function') {
        //将onmousewheel转换成function
        eval('window._tmpFun = function(event){' + onmousewheel + '}');
        e.target.onmousewheel = window._tmpFun;
        window._tmpFun = null;
      }
      // 不直接执行是因为若onmousewheel(e)运行时间较长的话，会导致锁定滚动失效，使用setTimeout可避免
      setTimeout(function () {
        e.target.onmousewheel(e);
      }, 1);
    }
  }, false);
}

var ie8_Elements = ["HTMLTableRowElement", "HTMLTableSectionElement"];


for (var i = 0; i < ie8_Elements.length; i++) {
  var element = eval(ie8_Elements[i]);
  element.prototype.clear = function () {
    try {
      this.innerHTML = "";
    } catch (ex) {
      for (var i = 0; ; i++) {
        if (this.childNodes.length == 0)
          break;
        var node = this.childNodes[0];
        node.parentNode.removeChild(node);
      }
    }
  }

}

function getTimeSpan (dateObj, type) {
  var data = [];

  if (type == 'Month') {
    var monthsCount = 11 - dateObj.getMonth();
    if (monthsCount > 0) {
      for (var i = 0; i <= monthsCount; i++) {
        var days = getCountDays(dateObj);
        for (var a = 0; a < days; a++) {
          data.push(dateObj.format('yyyy-MM-dd'));
          dateObj.addDays(1);
        }
      }
    }

  }
  else if (type == 'Day') {
    var days = getCountDays(dateObj);
    for (var a = 0; a < days; a++) {
      data.push(dateObj.format('yyyy-MM-dd'));
      dateObj.addDays(1);
    }
  }
  else if (type == 'Hour') {
    for (var a = 0; a <= 23; a++) {
      data.push(a + ':00');
    }
    data.push('24:00');
  }
  else if (type == 'Minute') {
    for (var i = 1; i <= 60; i++) {
      data.push(dateObj.format('HH:mm'));
      dateObj.addMinutes(1);
    }
  }
  else if (type == 'Year') {
    dateObj.setMonth(0, 1);
    for (var i = 1; i <= 12; i++) {
      data.push(dateObj.format('yyyy-MM'));
      dateObj.addMonths(1);
    }
  }
  else if (type == 'Week') {
    var date = getOneWeekDate(dateObj)

    data.push(date.monday.format('yyyy-MM-dd'));
    date = new Date(date.monday);
    for (var i = 1; i < 7; i++) {
      date.addDays(1);
      data.push(date.format('yyyy-MM-dd'));
    }
  }
  return data;
}

function timeOfCompletion (arr) {
  var times = new Array();
  for (var i = 0; i < arr.length; i++) {
    var time = arr[i].split(":");
    if (time[0].length == 1) {
      time[0] = "0" + time[0];
    }
    times.push(time[0] + ":" + time[1]);
  }
  return times;
}

Date.prototype.addMinutes = function (m) {
  this.setMinutes(this.getMinutes() + m);
}

Date.prototype.addMonths = function (m) {
  var d = this.getDate();
  this.setMonth(this.getMonth() + m);
  if (this.getDate() < d)
    this.setDate(0);
};
Date.prototype.addDays = function (d) {
  this.setDate(this.getDate() + d);
};

//获取月有多少天
function getCountDays (dateObj) {
  /* 获取当前月份 */
  var curMonth = dateObj.getMonth();
  /*  生成实际的月份: 由于curMonth会比实际月份小1, 故需加1 */
  dateObj.setMonth(curMonth + 1);
  /* 将日期设置为0 */
  dateObj.setDate(0);
  /* 返回当月的天数 */
  var days = dateObj.getDate();
  dateObj.addDays(-(days - 1));
  return days;
}

//获取周1 - 周7
function getOneWeekDate (now) {
  var nowTime = now.getTime();
  var day = now.getDay();
  var oneDayLong = 24 * 60 * 60 * 1000;
  var MondayTime = nowTime - (day - 1) * oneDayLong;
  var SundayTime = nowTime + (7 - day) * oneDayLong;
  return {
    monday: new Date(MondayTime),
    sunday: new Date(SundayTime)
  }
}

function getYearMonthDayHour (date, type) {
  debugger
  if (type == 'Day') {

    var nowDays = getCountDays(new Date());
    var firstDays = getCountDays(new Date(date.format('yyyy-MM-dd')));
    if (nowDays > firstDays) { // 31 > 30 > 28
      date.setDate(firstDays);
    }
    return date;
  } else if (type == 'Week') {
    var tempDay = date.format('dd');
    var days = getCountDays(new Date(date.format('yyyy-MM-dd')));
    if (tempDay > days) { // 31 > 30 > 28
      date.setDate(days);
    }
    return getOneWeekDate(date);
  } else if (type == 'Month') {
    return date;
  }
}

String.prototype.isValidIP = function () {
  var reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
  return reg.test(this);
}

String.prototype.format = function (args) {
  var result = this;
  if (arguments.length > 0) {
    if (arguments.length == 1 && typeof (args) == "object") {
      for (var key in args) {
        if (args[key] != undefined) {
          var reg = new RegExp("({" + key + "})", "g");
          result = result.replace(reg, args[key]);
        }
      }
    }
    else {
      for (var i = 0; i < arguments.length; i++) {
        if (arguments[i] != undefined) {
          //var reg = new RegExp("({[" + i + "]})", "g");//这个在索引大于9时会有问题，谢谢何以笙箫的指出
          var reg = new RegExp("({)" + i + "(})", "g");
          result = result.replace(reg, arguments[i]);
        }
      }
    }
  }
  return result;
}