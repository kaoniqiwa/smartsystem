/**
 * Developer 施文斌
 * LastUpdateTime  
 */

export class Guid {
    arr = new Array();
    constructor(g: any) {
        if (typeof (g) == 'string') {
            this.InitByString(this.arr, g);
        }
        else {
            this.InitByOther(this.arr);
        }
    }
    Equals(o) {

        if (o && o.IsGuid) {

            return this.ToString('D') == o.ToString();

        }

        else {

            return false;

        }

    }

    IsGuid() { }

    ToString(format) {
        if (typeof (format) == "string") {

            if (format == "N" || format == "D" || format == "B" || format == "P") {

                return this.ToStringWithFormat(this.arr, format);

            }

            else {

                return this.ToStringWithFormat(this.arr, "D");

            }

        }

        else {

            return this.ToStringWithFormat(this.arr, "D");

        }

    }

    InitByString(arr, g) {
        g = g.replace(/\{|\(|\)|\}|-/g, "");
        g = g.toLowerCase();
        if (g.length != 32 || g.search(/[^0-9,a-f]/i) != -1) {
            this.InitByOther(arr);
        }

        else {
            for (var i = 0; i < g.length; i++) {
                arr.push(g[i]);
            }
        }
    }

    InitByOther(arr) {
        var i = 32;
        while (i--) {
            arr.push("0");
        }
    }

    /*

   根据所提供的格式说明符，返回此 Guid 实例值的 String 表示形式。

   N  32 位： xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

   D  由连字符分隔的 32 位数字 xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

   B  括在大括号中、由连字符分隔的 32 位数字：{xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx}

   P  括在圆括号中、由连字符分隔的 32 位数字：(xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)

   */

    ToStringWithFormat(arr, format) {
        var str;
        switch (format) {

            case "N":

                return arr.toString().replace(/,/g, "");

            case "D":

                str = arr.slice(0, 8) + "-" + arr.slice(8, 12) + "-" + arr.slice(12, 16) + "-" + arr.slice(16, 20) + "-" + arr.slice(20, 32);

                str = str.replace(/,/g, "");

                return str;

            case "B":

                str = this.ToStringWithFormat(arr, "D");

                str = "{" + str + "}";

                return str;

            case "P":

                var str = this.ToStringWithFormat(arr, "D");

                str = "(" + str + ")";

                return str;

            default:

                return new Guid('');

        }

    }

    NewGuid() {

        var g = "";
    
        var i = 32;
    
        while (i--) {
    
            g += Math.floor(Math.random() * 16.0).toString(16);
    
        }
    
        return new Guid(g);
    
    }
}