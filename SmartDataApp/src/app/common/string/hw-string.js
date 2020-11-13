
String.prototype.naturalCompare = function (a, b) {
    var i, codeA
        , codeB = 1
        , posA = 0
        , posB = 0
        , alphabet = String.alphabet

    function getCode(str, pos, code) {
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

String.prototype.validIP = function () {
    var reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
    return reg.test(this);
}

String.prototype.validIPPort = function(){
    var reg = /^([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-5]{2}[0-3][0-5])$/;
    return reg.test(this);
}

String.prototype.toIP= function () { 
     return this.substring(0,this.lastIndexOf(':')).replace('http://','').replace('https://','');
}

String.prototype.toIPPort= function () {  
    return this.substr(this.lastIndexOf(':')+1,6).replace('/','');
}

String.prototype.dateTimePickerZC = function(){
    return this.replace('年','-').replace('月','-').replace('日','') 
}
 