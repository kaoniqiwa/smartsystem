var Convert = function (response, obj, name, orderKey, orderDesc) {
    if (!obj) obj = new Object();
    if (is.Date(obj))
        return Convert.ToDate(response);
    for (var key in response) {
        if (key == "sortBy") continue;
        if (is.Date(obj[key])) {
            obj[key] = Convert(response[key], new Date())
        }
        else if (is.Array(obj[key])) {
            obj[key] = Convert(response[key], new Array(), key, orderKey, orderDesc)
        }
        else {
            if (name && this[name])
                obj[key] = Convert(response[key], eval("new " + name + "()"));
            else
                obj[key] = response[key];
        }

        if (obj[key + "Specified"] == false)
            obj[key + "Specified"] = true;
    }
    if (is.Array(obj)) {
        obj = obj.sortBy(orderKey ? orderKey : "Id", orderDesc);
    }
    return obj;
}

Convert.toJson = function (json) {
    var result = "{";
    var i = 0;
    for (var item in json) {
        if (i > 0)
            result += " ,";
        result += " " + item + " : " + json[item];
        ++i;
    }
    result += "}";
    return result;
}

Convert.ToDate = function (value) {
    //1970-01-01T00:00:00Z
    if (is.Date(value))
        return value;
    var re1 = '((?:(?:\\d{1}\\d{1}\\d{1}\\d{1})|(?:[2]{1}\\d{3}))[-:\\/.](?:[0]?[1-9]|[1][012])[-:\\/.](?:(?:[0-2]?\\d{1})|(?:[3][01]{1})))(?![\\d])'; // YYYYMMDD
    var re2 = '(T|\x20)'; // T
    var re3 = '((?:(?:[0-1][0-9])|(?:[2][0-3])|(?:[0-9])):(?:[0-5][0-9])(?::[0-5][0-9])?(?:\\s?(?:am|AM|pm|PM))?)'; // HHmmss
    var re4 = '((\\.\\d+)?)';
    var re5 = '(Z)'; // Z

    var p = new RegExp(re1 + re2 + re3 + re4 + re5, ["i"]);
    var m = p.exec(value);



    if (m != null) {
        var date = m[1].split('-');

        var time = m[3].split(':');

        var result = new Date();
        result.setTime(Date.UTC(date[0], date[1] - 1, date[2], time[0], time[1], time[2]));
        return result;
    }

    p = new RegExp(re1 + re2 + re3 + re4, ["i"]);
    m = p.exec(value);
    if (m != null) {
        var date = m[1].split('-');
        var time = m[3].split(':');
        return new Date(date[0], date[1] - 1, date[2], time[0], time[1], time[2]);
    }

    p = new RegExp(re1);
    m = p.exec(value);
    if (m != null) {
        var date = m[1].split('-');
        return new Date(date[0], date[1] - 1, date[2], 0, 0, 0);
    }

    return null;
}