
//rootEl 传div dom 对象
//type 传 print 或 excel 字符串
var dataToExport$ = function (rootEl, type) {
    this.init = function (title, headers, bodys) {
        var oldTitle = $("title").html();
        $("title").html(title.replace('$',' '));
        var div = $('<div />');
        var t = title.split('$');
        var table = $('<table />').appendTo(div);;
        var thead = $('<thead />').appendTo(table);

        var tbody = $('<tbody />').appendTo(table);
        var tfoot = $('<tfoot />').appendTo(table);

        var tr = $('<tr />').appendTo(thead);
        headers.forEach(function (item, i) {
            $('<th />', {
                text: item
            }).appendTo(tr);
        });


        bodys.forEach(function (item, i) {
            tr = $('<tr />').appendTo(tbody);
            item.forEach(function (td, i) {
                $('<td />', {
                    text: td
                }).appendTo(tr);
            });
        });

        tr = $('<tr />').appendTo(tfoot);
       
        headers.forEach(function (item, i) {
            if (i == 0)
                $('<th />', {
                    text: t[0]
                }).appendTo(tr);
            else if (i == 1)
                $('<th />', {
                    text: t[1]
                }).appendTo(tr);
            else
                $('<th />').appendTo(tr);
        });



        $(rootEl).html(div.html());
        $(rootEl).find('table').DataTable({
            dom: 'Bfrtip',
            ordering: false,
            buttons: [
                type
            ]

        });
        $(rootEl).find('a').click();
        $("title").html(oldTitle);
    }
}