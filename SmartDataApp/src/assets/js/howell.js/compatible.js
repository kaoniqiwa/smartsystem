function _(id) {
    if (navigator.userAgent.content("MSIE 8.0"))
        return eval(id);
    else
        return document.getElementById(id);
}