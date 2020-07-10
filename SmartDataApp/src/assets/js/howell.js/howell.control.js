/// <reference path="howell.js" />
/// <reference path="../jquery/jquery-1.10.2.min.js" />

var ControlModel =
        {
            Value: 0,
            Enum: 1,
            Language: 2,
            EnumAndLanguage: 3

        };

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
    return false;
}

function DropDownList(id, model, Enum, language) {
    this.Model = model;
    var select = document.getElementById(id);

    for (var item in Enum) {
        var option = document.createElement("option");
        switch (model) {
            case ControlModel.Language:
                option.innerHTML = language[item];
                break;
            case ControlModel.Value:
                option.innerHTML = Enum[item];
                break;
            case ControlModel.EnumAndLanguage:
                option.innerHTML = item
                if (language[item])
                    option.innerHTML += " - " + language[item];
                break;
            case ControlModel.Enum:
                option.innerHTML = item;
                break;
            default:
                break;
        }
        option.value = Enum[item];

        select.appendChild(option);

        //$(option).appendTo($(select));
    }

    return select;
}
DropDownList.Create = function (id, model, Enum, language) {
    return new DropDownList(id, model, Enum, language);
}


function RadioButtons(id, name, model, Enum, language) {
    var parent = document.getElementById(id);
    for (var item in Enum) {
        var lbl = document.createElement("label");
        lbl.className = "radio-inline";
        var input = document.createElement("input");
        input.name = name;
        input.type = "radio";
        input.value = Enum[item];
        var span = document.createElement("span");
        switch (model) {
            case ControlModel.Language:
                span.innerText = language[item];
                break;
            case ControlModel.Value:
                span.innerText = Enum[item];
                break;
            case ControlModel.EnumAndLanguage:
                span.innerText = item + " - " + language[item];
                break;
            case ControlModel.Enum:
                span.innerText = item;
                break;
            default:
                break;
        }
        lbl.appendChild(input);
        lbl.appendChild(span);
        parent.appendChild(lbl);
    }
}

RadioButtons.Create = function (id, name, model, Enum, language) {
    return new RadioButtons(id, name, model, Enum, language);
}

function Table(id, head, body, params) {
    var table = document.createElement("table");
    table.className = "table table-bordered table-striped";
    table.appendChild(head);
    table.appendChild(body);
    table.id = id;

    if (params) {
        for (var key in params) {
            table[key] = params[key];
        }
    }
    return table;
}
Table.Create = function (tableId, body, columTarget, count) {
    var TableCheckboxInit = function (tableId, columnTarget) {

        $("#" + tableId).dataTable({
            "sPaginationType": "full_numbers",
            aoColumnDefs: [{ bSortable: false, aTargets: columnTarget }]
        });
    }

    var wrapper = document.getElementById(tableId + "_wrapper");
    if (wrapper) {
        var tab = document.getElementById(tableId);
        wrapper.parentElement.appendChild(tab);
        wrapper.parentElement.removeChild(wrapper);
    }

    var head = TableHead.createByElementId(tableId);

    var parent = document.getElementById(tableId).parentElement;
    parent.removeChild(document.getElementById(tableId));
    var table = new Table(tableId, head, body);
    parent.appendChild(table);
    TableCheckboxInit(tableId, columTarget);

    var length = document.getElementById(tableId + "_length");
    if (length && count) {
        length.innerHTML = "共 " + count + " 条记录";
    }
}

function TableHead(tableHeadItems, thCheckbox, params) {
    var head = document.createElement("thead");
    var tr = document.createElement("tr");

    if (thCheckbox) {
        tr.appendChild(thCheckbox);
    }

    if (tableHeadItems) {
        for (var i = 0; i < tableHeadItems.length; i++) {
            if (tableHeadItems[i].toHtml)
                tr.appendChild(tableHeadItems[i].toHtml());
            else
                tr.appendChild(tableHeadItems[i]);
        }
    }

    head.appendChild(tr);
    return head;
}
function TableHeadItem(inner, className) {
    var th = document.createElement("th");
    th.className = className;
    th.innerHTML = inner;
    return th;
}
TableHead.createByElementId = function (id) {
    var headItems = new Array();
    var obj = document.getElementById(id);
    var th = null;
    if (obj.nodeName.toLowerCase() == "thead")
        th = obj;
    else {
        for (var i = 0; i < obj.childNodes.length; i++) {
            if (obj.childNodes[i].nodeName.toLowerCase() == "thead") {
                th = obj.childNodes[i];
                break;
            }
        }
    }
    if (th == null)
        return null;

    for (var i = 0; i < th.children[0].children.length; i++) {
        var td = th.children[0].children[i];
        headItems.push(new TableHeadItem(td.innerHTML, td.className));
    }
    th.parentElement.style.display = "none";

    return new TableHead(headItems);
}

function TableBody(tableBodyTrs) {
    var body = document.createElement("tbody");
    if (tableBodyTrs) {
        for (var i = 0; i < tableBodyTrs.length; i++) {
            if (tableBodyTrs[i].toHtml)
                body.appendChild(tableBodyTrs[i].toHtml());
            else
                body.appendChild(tableBodyTrs[i]);
        }
    }
    return body;
}
function TableBodyTr(tds, params) {
    var tr = document.createElement("tr");

    if (tds) {
        for (var i = 0; i < tds.length; i++) {
            if (tds[i].toHtml)
                tr.appendChild(tds[i].toHtml());
            else
                tr.appendChild(tds[i]);
        }
    }

    if (params) {
        for (var key in params) {
            tr[key] = params[key];
        }
    }

    tr.onclick = function () {
        if (this.className.indexOf("selected") >= 0)
            $(this).removeClass("selected")
        else
            $(this).addClass("selected");
        if (fn)
            fn(this);
        return false;
    }

    return tr;
}
function TableBodyTrs() { }
TableBodyTrs.prototype = new Array();

function TableBodyTd(inner, className) {
    var td = document.createElement("td");
    td.className = className;
    td.innerHTML = inner;
    return td;
}
function TableBodyTds() { }
TableBodyTds.prototype = new Array();

function Pagination(id, index, size, count, record, totalRecord, fn) {
    function createPrevious(index, fn) {
        //if (index == 1)
        //    return null;
        var li = document.createElement("li");
        var a = document.createElement("a");
        a.style.cursor = "pointer";
        a.setAttribute("onclick", "PageJumpEvent(this," + (index - 1) + "," + getFuncName(fn) + ");return stopPropagation();");
        var i = document.createElement("i");
        i.className = "icon-long-arrow-left";
        a.appendChild(i);
        li.appendChild(a);

        if (index == 1)
            li.style.visibility = "hidden";

        return li;
    }
    function createNext(index, max, fn) {
        //if (index == max)
        //    return null;
        var li = document.createElement("li");
        var a = document.createElement("a");
        a.style.cursor = "pointer";
        a.setAttribute("onclick", "PageJumpEvent(this," + (index + 1) + "," + getFuncName(fn) + ");return stopPropagation();");
        var i = document.createElement("i");
        i.className = "icon-long-arrow-right";
        a.appendChild(i);
        li.appendChild(a);

        if (index == max)
            li.style.visibility = "hidden";

        return li;
    }
    function whetherOmit(i, index, max, omit) {
        if (i == index ||
            i == index - 1 ||
            i == index - 2 ||
            i == index + 1 ||
            i == index + 2 ||
            i == 1 ||
            i == max ||
            (index == 1 && i <= 7) ||
            (index == 2 && i <= 7) ||
            (index == 3 && i <= 7) ||
            (index == 4 && i <= 7) ||
            (index == (max) && i >= (max - 7)) ||
            (index == (max - 1) && i >= (max - 7)) ||
            (index == (max - 2) && i >= (max - 7)) ||
            (index == (max - 3) && i >= (max - 7))) {

            return false;
        }
        return true;
    }
    var div = document.createElement("div");
    div.id = id;
    div.className = "col-lg-12 text-center";
    div.style.float = "left";
    var ul = document.createElement("ul");
    ul.className = "pagination";

    if ((!count) || count <= 1)
        return div;

    var pre = createPrevious(index, fn);
    if (pre)
        ul.appendChild(pre);

    for (var i = 1; i <= count; i++) {
        var li = document.createElement("li");
        if (i == index)
            li.className = "active";

        var a = document.createElement("a");

        if (whetherOmit(i, index, count)) {
            a.innerText = "...";
            if (i < index) {
                if (count - index > 4)
                    i = index - 3;
                else
                    i = count - 7;
            }
            else
                i = count - 1;
        }
        else {
            //a.style.width = "35px";
            a.style.cursor = "pointer";
            a.style.textAlign = "center";
            a.setAttribute("onclick", "PageJumpEvent(this," + i + "," + getFuncName(fn) + ");return stopPropagation();");
            a.innerHTML = i;
        }
        li.appendChild(a);
        ul.appendChild(li);
    }
    var next = createNext(index, count, fn);
    if (next)
        ul.appendChild(next);
    div.appendChild(ul);
    return div;
}
var PageJumpEvent = function (element, index, fn) {
    var acts = element.parentElement.parentElement.getElementsByClassName("active");
    if (acts) {
        for (var i = 0; i < acts.length; i++) {
            if (acts[i].nodeName.toLowerCase() == "li") {
                acts[i].className = "";
                break;
            }
        }
    }
    element.parentElement.className = "active";
    fn(index);
}
function PaginationPanel(id) {

    var panel = document.getElementById(id);
    if (panel) {
        panel.parentElement.removeChild(panel);
    }
    panel = document.createElement("div");
    panel.id = id;
    return panel;
}

function TaskList(id, head, body, scroll) {
    var task = new PaginationPanel(id);

    task.className = "widget-container " + (scroll ? "scrollable " : "") + "list task-widget";
    task.appendChild(head);
    task.appendChild(body);
    return task;
}
function TaskListHead(content) {
    var head = document.createElement("div");
    head.className = "heading";
    head.appendChild(content);
    return head;
}
function TaskListBody(items) {
    var ul = document.createElement("ul")
    ul.className = "widget-content";
    for (var i = 0; i < items.length; i++) {
        if (items[i].toHtml)
            ul.appendChild(items[i].toHtml());
        else
            ul.appendChild(items[i]);
    }
    return ul;

}
function TaskListBodyItems() { }
TaskListBodyItems.prototype = new Array();
function TaskListBodyItem(content) {
    var li = document.createElement("li");
    li.appendChild(content);
    return li;
}

function TaskLabel(text, checkBox, tags) {
    var label = document.createElement("label");

    if (checkBox) {
        checkBox.type = "checkbox";
        checkBox.className = "task-input"
        label.appendChild(checkBox);
        label.appendChild(document.createElement("span"));
    }

    if (tags) {
        for (var i = 0; i < tags.length; i++) {
            if (tags[i].toHtml)
                label.appendChild(tags[i].toHtml());
            else
                label.appendChild(tags[i]);
        }
    }
    label.innerHTML += text;

    return label;
}

//标签列表
function LabelTags() { }
LabelTags.prototype = new Array();
//标签
function LabelTag(value, color) {
    var tag = document.createElement("div");
    tag.className = "label " + color + " pull-right";
    tag.innerHTML = value;
    return tag;
}
//标签颜色
var LabelTagColor =
{
    Red: "label-danger",
    Green: "label-success",
    Yellow: "label-warning",
    LightBlue: "label-lightblue",
    DarkGray: "label-darkgray",
    DoderBlue: "label-doderblue",
    Tomato: "label-tomato",//番茄
    Magenta: "label-magenta",//洋红
    Taro: "label-taro",//香芋
    Prunus: "label-prunus",//紫红
    Teal: "label-teal",//深青色
    Color_66cc99: "label-66cc99",//淡绿
    Color_ffae71: "label-ffae71"//肉
}

//全选按钮
function CheckAllBox(id) {
    var input = document.createElement("input");
    input.type = "checkbox";
    input.id = id;
    input.name = "chkAll";


    input.addEventListener("onclick", function () {
        var chks = getTag(this.name, getTagType.Name);
        for (var i = 0; i < chks.length; i++) {
            chks[i].checked = this.checked;
        }
    });
    return input;
}



//初始化全选按钮
CheckAllBox.Init = function () {
    var all = getTag("chkAll", getTagType.Name);
    for (var i = 0; i < all.length; i++) {
        all[i].onclick = function () {
            var chks = getTag(this.id, getTagType.Name);
            for (var j = 0; j < chks.length; j++) {
                chks[j].checked = this.checked;
            }
        }
    }
}
//反选控件
function CheckInverseBox(name) {
    var input = document.createElement("input");
    input.type = "checkbox";
    input.name = "chkInverse";
    input.value = name;
    return input;
}
CheckInverseBox.Init = function () {
    var inverse = getTag("chkInverse", getTagType.Name);
    for (var i = 0; i < inverse.length; i++) {
        inverse[i].onclick = function () {
            var chks = getTag(this.value, getTagType.Name);
            for (var j = 0; j < chks.length; j++) {
                chks[j].checked = !chks[j].checked;
            }
        }
    }
}

function CheckBox(name, id) {
    var input = document.createElement("input");
    input.type = "checkbox";
    input.id = id;
    input.name = name;
    return input;
}

function Accordion(id, panels) {
    var accordion = new PaginationPanel(id);
    accordion.className = "panel-group";
    accordion.id = id;
    if (panels) {
        for (var i = 0; i < panels.length; i++) {
            if (panels[i].toHtml)
                accordion.appendChild(panels[i].toHtml());
            else
                accordion.appendChild(panels[i]);
        }
    }
    return accordion;

}
function AccordionPanel(head, body) {
    var panel = document.createElement("div");
    panel.className = "panel";
    panel.appendChild(head);
    panel.appendChild(body);
    return panel;
}
function AccordionPanelHead(panelId, bodyId, title, isClosed) {
    var pHead = document.createElement("div");
    pHead.className = "panel-heading";

    var pTitle = document.createElement("div");
    pTitle.className = "panel-title";

    var a = document.createElement("a");
    a.className = "accordion-toggle" + (isClosed ? " collapsed" : "");
    a.setAttribute("data-parent", "#" + panelId);
    a.setAttribute("data-toggle", "collapse");
    a.href = "#" + bodyId;
    var caret = document.createElement("div");
    caret.className = "caret pull-right";
    a.appendChild(caret);

    var lbl = document.createElement("label");
    lbl.innerHTML = title;
    a.appendChild(lbl);

    pTitle.appendChild(a);
    pHead.appendChild(pTitle);

    return pHead;
}
function AccordionPanelBody(id, value, isClosed) {
    var body = document.createElement("div");
    body.className = "panel-collapse collapse" + (isClosed ? "" : " in");
    body.id = id;
    var eValue = document.createElement("div");
    eValue.className = "panel-body";
    eValue.innerHTML = value;

    body.appendChild(eValue);
    return body;
}


function Breadcrumb(items) {

    var ul = document.createElement("ul");
    ul.className = "breadcrumb"
    if (items) {
        for (var i = 0; i < items.length; i++) {
            if (items[i].toHtml)
                ul.appendChild(items[i].toHtml());
            else {
                var li = document.createElement("li");
                li.appendChild(items[i]);
                ul.appendChild(li);
            }
        }
    }
    return ul;
}

function BreadcrumbItem(id, text, href) {
    var a = document.createElement("a");
    a.id = id;
    a.innerHTML = text;
    if (href)
        a.href = href;
    return a;
}
function BreadcrumbItems() { }
BreadcrumbItems.prototype = new Array();

function GroupList(id, items) {
    var group = new PaginationPanel(id);
    group.className = "list-group";
    //widget-container scrollable list task-widget
    if (items) {
        for (var i = 0; i < items.length; i++) {
            if (items[i].toHtml)
                group.appendChild(items[i].toHtml());
            else
                group.appendChild(items[i]);
        }
    }
    return group;
}

function GroupListItem(name, fn, disable) {
    var a = document.createElement("a");
    a.className = "list-group-item";

    var p = document.createElement("p");
    a.appendChild(p);
    a.Content = a.firstChild;
    a.name = name;

    if (!disable) {
        a.onclick = function () {
            result = true;
            if (is.Array(fn) && fn.length > 0 && fn[0]) {
                result = fn[0](this);
            }
            if (result == undefined || result == true) {
                if (this.className.indexOf("selected") >= 0)
                    $(this).removeClass("selected")
                else
                    $(this).addClass("selected");
            }
            if (is.Array(fn)) {
                if (fn.length > 1 && fn[1])
                    fn[1](this);
            }
            else {
                if (fn)
                    fn(this);
            }
            return false;
        }
    }
    return a;
}

function GroupListView(id, items) {
    var group = document.createElement("table");
    group.id = id;
    group.className = "list-group";
    //widget-container scrollable list task-widget
    if (items) {
        for (var i = 0; i < items.length; i++) {
            if (items[i].toHtml)
                group.appendChild(items[i].toHtml());
            else
                group.appendChild(items[i]);
        }
    }
    return group;
}
function GroupListRow(name, fn) {
    var tr = document.createElement("tr");
    tr.className = "list-group-item";
    tr.name = name;
    tr.onclick = function () {
        if (this.className.indexOf("selected") >= 0)
            $(this).removeClass("selected")
        else
            $(this).addClass("selected");
        if (fn)
            fn(this);
        return false;
    }
    return tr;
}

HTMLTableRowElement.prototype.AppendChild = function (obj) {
    var td = obj.isPrototypeOf("HTMLTableColElement") ? obj : new GroupListColumn(obj);
    this.appendChild(td);
}

function GroupListColumn(inner) {
    var td = document.createElement("td");
    if (is.String(inner) || is.Number(inner) || is.Boolean(inner))
        td.innerHTML = inner;
    else
        td.appendChild(inner)

    return td;
}



GroupList.Select = {
    All: function (name, fn, name_is_class) {

        var items = name_is_class ? document.getElementsByClassName(name) : getTag(name, getTagType.Name);
        for (var i = 0; i < items.length; i++) {

            if (items[i].className.indexOf("selected") < 0)
                $(items[i]).addClass("selected");
        }
        if (fn)
            fn(items);
    },
    Cancel: function (name, fn, name_is_class) {
        var items = name_is_class ? document.getElementsByClassName(name) : getTag(name, getTagType.Name);
        for (var i = 0; i < items.length; i++) {
            if (items[i].className.indexOf("selected") >= 0)
                $(items[i]).removeClass("selected");
        }
        if (fn)
            fn(items);
    },
    Inverse: function (name, name_is_class, fn, event) {
        var items = name_is_class ? document.getElementsByClassName(name) : getTag(name, getTagType.Name);
        for (var i = 0; i < items.length; i++) {
            if (!event) {
                items[i].click();
                continue;
            }
            event(items[i]);
        }
        if (fn)
            fn(items);
    },
    Clean: function (name, event) {
        var items = getTag(name, getTagType.Name);
        for (var i = 0; i < items.length; i++) {
            event(items[i].id, items[i]);
        }
    },
};


function GroupListItemArray() { }
GroupListItemArray.prototype = new Array();



function Badge(value, color) {
    var badge = document.createElement("span");

    badge.className = "badge";
    if (color) {
        badge.className += " " + color;
    }
    if (value) {
        if (is.String(value) || is.Number(value)) {
            badge.innerHTML = value;
        }
        else {
            badge.appendChild(value);
        }
    }
    return badge;
}
var BadgeColor =
{
    Red: "red",
    Green: "green",
    Yellow: "yellow",
    LightBlue: "lightblue",
    DarkGray: "darkgray",
    DoderBlue: "doderblue"
}


function Popover(id, inner, href, title, head) {
    var controlId = "popover_control";
    var a = document.createElement("a");
    if (is.String(inner))
        a.innerHTML = inner;
    else
        a.appendChild(inner);
    a.href = href;
    a.title = title;
    a.id = id;

    a.onclick = function (e) {
        try {
            Trigger = this;
            PopoverWindow.Show(this, controlId, head, e);

        }
        catch (e) {
            alert(e.message);
        }
        finally {
            return stopPropagation(e);
        }
    }
    return a;
}
var Trigger = null;
//Targate
//var PopoverEventActivate = {};
PopoverWindow.CanClose = true;
PopoverWindow.Show = function (trigger, id, head, e) {
    var win = document.getElementById(id);
    if (win) {
        win.parentElement.removeChild(win);
    }

    if (trigger.href && trigger.href != "#") {
        PopoverParams = (new Uri(trigger.href)).Querys;
    }

    //    var x, y;
    //    x = trigger.offsetLeft + trigger.offsetWidth-(screen.width-document.body.offsetWidth);
    //    y = trigger.offsetTop + (trigger.offsetHeight / 2) + 350;
    win = new PopoverWindow(id, head, loadPage(trigger.href), Direction.Right, e);
    win.style.display = "block";
    //win.style.top = y+"px";
    //win.style.left = x+"px";
    win.style.position = "absolute";
    //win.style.top = window.event.clientY-35 + "px";
    //win.style.left = window.event.clientX+20 + "px";

    //$($.parseHTML(win.outerHTML, document, true)).insertAfter(trigger);

    $($.parseHTML(win.outerHTML, document, true)).insertAfter($("body")[0].lastChild);
}



function PopoverWindow(id, title, content, direction, e) {
    if (!direction)
        direction = Direction.Right;
    var evt = e || window.event;
    var div = document.createElement("div");
    div.id = id;
    div.className = "popover fade " + direction + " in";

    var arrow = document.createElement("div");
    arrow.className = "arrow top";
    div.appendChild(arrow);

    //关闭按钮
    var span = document.createElement("div");
    span.className = "icon-remove";
    span.setAttribute("onclick", "this.parentElement.parentElement.removeChild(this.parentElement);");

    div.appendChild(span);

    if (title) {
        var head = document.createElement("div");
        head.className = "popover-title";

        //head.appendChild(span);

        if (title && is.String(title)) {
            head.innerHTML += title;
        }
        else {
            head.appendChild(title);
        }
        div.appendChild(head);
    }

    var body = document.createElement("div");
    body.className = "popover-content";

    if (is.String(content))
        body.innerHTML = content;
    else
        body.appendChild(content);


    this.Body = body;
    this.Head = head;

    div.appendChild(body);

    function getRealHeight(element) {
        return element.offsetTop > 21 ? element.offsetTop : getRealHeight(element.parentElement);
    }


    function getTop() {
        var p = window.innerHeight;// document.body.clientHeight;
        if (!p) p = document.body.clientHeight;

        var s = 0;
        if (document.documentElement.scrollTop > 0)
            s = document.documentElement.scrollTop;
        else if (document.body.scrollTop > 0)
            s = document.body.scrollTop;
        else
            s = 0;
        var m = evt.clientY;

        var top = getRealHeight(Trigger);
        var bodyPaddingTop = 140;

        var dist = p - m - (800 - bodyPaddingTop);
        if (dist < 0) {
            arrow.style.top = 730 - (p + s - getRealHeight(Trigger)) + 135 + "px";
            return p + s - 730 + 35;
        }
        return top + bodyPaddingTop + (getHeight(Trigger) / 2) - 33;
    }
    function getArrowTop() {
        var p = document.documentElement.clientHeight;
        var s = document.documentElement.scrollTop;
        var m = evt.clientY;
    }

    function getWidth(trigger) {

        if (trigger.offsetWidth > 0) {
            return trigger.offsetWidth;
        }
        return getWidth(trigger.parentElement);
    }
    function getHeight(trigger) {
        if (trigger.offsetHeight > 0) {
            return trigger.offsetHeight;
        }
        return getWidth(trigger.parentElement);
    }


    if (Trigger) {
        div.style.left = Trigger.offsetLeft + getWidth(Trigger) + $(".page-main")[0].offsetLeft + 10 + "px";
        div.style.top = getTop() + "px";
    }
    div.setAttribute("onclick", "return stopPropagation();");



    document.body.onclick = function () {
        //        var d = document.getElementById("popover_control");
        //        d.style.display = "none";
        try {
            if (PopoverWindow.CanClose)
                PopoverWindow.Close();
        } finally {
            PopoverWindow.CanClose = true;
        }
    }

    return div;
}

function AlertWindow(id, inner, href, top, isKeep) {
    if (!top) top = -1;
    var result = document.createElement("a");
    result.id = id;


    $(result).append(inner);
    //if (is.String(inner) || is.Number(inner))
    //    result.innerHTML = inner;

    //else
    //    result.appendChild(inner);

    result.href = href;
    result.target = isKeep ? true : false;
    result.onclick = function () {
        if (result.target == false.toString())
            WindowClose();
        Trigger = this;

        $.confirm({
            footer: false,
            top: top,
            text: loadPage(href),
            onclosed: AlertWindow.Close
        });

        return stopPropagation();
    }
    return result;
}

AlertWindow.Bind = function (trigger, top) {

}

AlertWindow.Show = function (trigger, top, fn, closeBtn) {
    /// <signature>
    /// <summary>静态的a标签需要添加弹框事件</summary>
    /// <param name='trigger' type='tag'>需要弹框的a标签</param>
    /// <param name='top' type='int'>弹框到顶部的间距,传-1高度垂直居中</param>
    /// <param name='fn' type='function'>弹框结束时需要执行的方法</param>
    /// </signature>
    Trigger = trigger;
    var cBtn = false;
    if (closeBtn)
        cBtn = true;
    $.confirm({
        footer: false,
        top: top,
        text: loadPage(trigger.href),
        hasCloseButton: cBtn,
        onclosed: function () {
            if (fn)
                fn();
        }
    });
}

AlertWindow.Close = function (fn, args) {
    if ($('.confirmation-modal').length > 0) {
        $(document.body).removeClass("modal-open");
        $('.confirmation-modal').remove();
        $('.modal-backdrop').remove();
    }
    if (fn) fn(args);
    return false;
}

PopoverWindow.Close = function () {
    if ($('.popover').length > 0) {
        $('.popover').remove();
    }
}

function WindowClose() {
    try {
        PopoverWindow.Close();
    } catch (e) {

    }
    try {
        AlertWindow.Close();
    } catch (e) {

    }
    try {
        CheckListWindow.Close();
    } catch (e) {

    }
}

var Direction =
{
    Right: "right",
    Left: "lift",
    Top: "top",
    Bottom: "bottom"
}

//图标控件
function IconButton(id, iconClass, spacing, value, iconTitle) {
    var div = document.createElement("div");
    div.className = "icon_btn";
    div.id = id;

    var icon = document.createElement("div");

    if (spacing)
        icon.style.paddingRight = spacing + "px";
    if (iconClass)
        icon.className = iconClass;
    if (iconTitle)
        icon.title = iconTitle;
    div.appendChild(icon);


    if (is.String(value) || is.Number(value))
        div.innerHTML += value;
    else
        div.appendChild(value);

    return div;
}

//水平控件列表
function TransverseButtonList(buttons, width, spacing, float) {
    var result = document.createElement("div");
    if (!float)
        float = "right";
    if (!spacing)
        spacing = 0;

    if (buttons) {
        for (var i = 0; i < buttons.length; i++) {
            var div = document.createElement("div");
            div.style.width = width + "px";
            div.style.styleFloat = "left";
            div.style.cssFloat = "left";
            result.style.marginRight = spacing + "px";
            div.appendChild(buttons[i]);

            result.appendChild(div);
        }
    }
    result.className = "pull-right";

    return result;
}
var isOnscroll = false;
//延迟加载
function LazyLoadControl(id, text, fn, scrollId) {
    var result = document.createElement("div");
    result.className = "btn btn-lg btn-block btn-default";
    result.id = id;
    result.style.display = "none";
    var i = document.createElement("i");
    i.className = "icon-spinner icon-spin";
    result.appendChild(i);
    result.innerHTML += text;

    var tur = true;

    var tag = window;
    var scrollSource = document.documentElement;
    if (scrollId) {
        tag = document.getElementById(scrollId);
        scrollSource = document.getElementById(scrollId);
    }

    tag.onscroll = function () {
        if (isOnscroll != false) {
            var scrollTop;
            if (scrollSource.scrollTop > 0)
                scrollTop = scrollSource.scrollTop;
            else if (document.body.scrollTop > 0)
                scrollTop = document.body.scrollTop;
            else
                scrollTop = 0;

            if ((scrollSource.clientHeight + scrollTop) >= scrollSource.scrollHeight) {
                if (LazyLoadPage.PageIndex > 0 && LazyLoadPage.PageIndex < LazyLoadPage.PageCount) {
                    var loadDiv = document.getElementById(id);
                    var body = document.getElementsByTagName("body");
                    body[0].style.overflowY = "hidden";
                    loadDiv.style.display = "block";

                    if (tur) {
                        window.setTimeout(function () {
                            fn(LazyLoadPage.PageIndex);
                            window.setTimeout(function () {
                                body[0].style.overflowY = "auto";
                                loadDiv.style.display = "none";
                            }, 500);
                            tur = true;
                        }, 500);
                        tur = false;
                    }
                }
            }
            var top = $(".to-top");
            if (top) {
                top[0].style.display = scrollTop > 0 && !scrollId ? "block" : "";
            }
        }
    }
    return result;
}
var LazyLoadPage = null;//new Page();


function IconColorButton(id, iconClass, color, spacing, inner, iconTitle) {
    var result = document.createElement("div");
    result.id = id;
    result.className = "icon_btn color";

    var background = document.createElement("div");
    background.className = "icon-color-btn-background " + color;
    background.style.marginRight = spacing + "px";

    var arrow = document.createElement("div");
    arrow.className = "arrow-left icon-color-btn-triangle";
    background.appendChild(arrow);

    var img = document.createElement("div");
    img.className = iconClass;
    if (iconTitle)
        img.title = iconTitle;
    background.appendChild(img);



    result.appendChild(background);

    if (is.String(inner) || is.Number(inner))
        result.innerHTML += inner;
    else
        result.appendChild(inner);

    return result;
}

function Accordion(id, items) {
    var result = document.createElement("div");
    result.className = "panel-group";
    result.id = id;
    if (items) {
        for (var i = 0; i < items.length; i++) {
            if (items[i].toHtml)
                result.appendChild(items[i].toHtml());
            else
                result.appendChild(items[i]);
        }
    }
    return result;
}

function AccordionItem(head, body) {
    var result = document.createElement("div");
    result.className = "panel";

    result.appendChild(head);
    result.appendChild(body);

    return result;
}
function AccordionItemHead(parentId, bodyId) {

    var result = document.createElement("div");
    result.className = "panel-heading";

    var title = document.createElement("div");
    title.className = "panel-title";

    var a = document.createElement("a");
    a.className = "accordion-toggle  collapsed";

    a.setAttribute("data-parent", "#" + parentId);

    a.setAttribute("data-toggle", "collapse");
    a.href = "#" + bodyId;

    var span = document.createElement("span");
    span.className = "caret pull-right";

    a.appendChild(span);
    var content = document.createElement("div");
    a.appendChild(content);

    result.content = content;
    title.appendChild(a);
    result.appendChild(title);
    return result;

}
function AccordionItemBody(id) {
    /// <summary>AccordionItemBody</summary>
    /// <param name="id" type="String">id</param>
    /// <field name='content' type='div'>body's content</field>
    /// <returns type="div">AccordionItemBody</returns>

    var result = document.createElement("div");
    result.className = "panel-collapse collapse";
    result.id = id;
    var div = document.createElement("div");
    div.className = "panel-body";
    result.appendChild(div);
    result.content = div;
    return result;
}

function CheckListWindow(checkListAttributes) {
    var divChks = document.createElement("div");
    divChks.className = "div-search-chks";
    divChks.style.width = checkListAttributes.Width + "px";
    divChks.id = checkListAttributes.DivId;
    var chksCount = checkListAttributes.Dic.toArray().length + 1;
    var chksRowCount = Math.ceil(chksCount / checkListAttributes.ColumnCount);
    var chksColumnWidth = 100 / checkListAttributes.ColumnCount;
    for (var i = 0; i < chksRowCount; i++) {
        var rowDiv = document.createElement("div");
        rowDiv.className = "row";
        //        //span.onclick = new Function("var chkInput = document.getElementById('" + chkInput.id + "'); if(chkInput.checked){chkInput.checked = false}else{chkInput.checked = true}");
        for (var j = 0; j < checkListAttributes.ColumnCount; j++) {
            if ((i + 1) * (j + 1) > chksCount)
                break;
            var chkObj = null;
            if (i != 0 || j != 0) {
                chkObj = new Object();
                for (var key in checkListAttributes.Dic) {
                    chkObj["key"] = key
                    chkObj["value"] = checkListAttributes.Dic[key];
                    delete checkListAttributes.Dic[key];
                    break;
                }
            }
            var columnDiv = document.createElement("div");
            columnDiv.className = "col-md-6";
            columnDiv.style.width = chksColumnWidth + "%";
            var label = document.createElement("label");
            label.className = "checkbox-inline";
            var span = document.createElement("span");
            span.innerHTML = "所有";
            if (chkObj) {
                var chkInput = document.createElement("input");
                chkInput.type = "checkbox";
                chkInput.name = checkListAttributes.Name;
                chkInput.id = chkObj.key;
                span.innerHTML = chkObj.value;
                span.id = "span_" + chkInput.id;
                span.onclick = function () {
                    var chk = document.getElementById(this.id.substr(5));
                    chk.checked = !chk.checked;
                }
                label.appendChild(chkInput);
            }
            else {
                var chkAllInput = document.createElement("input");
                chkAllInput.type = "checkbox";
                span.onclick = function () {
                    chkAllInput.checked = !chkAllInput.checked;
                    var chks = getTag(checkListAttributes.Name, getTagType.Name);
                    for (var i = 0; i < chks.length; i++) {
                        chks[i].checked = chkAllInput.checked;
                    }
                }
                label.appendChild(chkAllInput);
            }
            label.appendChild(span);
            columnDiv.appendChild(label);
            rowDiv.appendChild(columnDiv);
        }
        divChks.appendChild(rowDiv);
    }
    return divChks;
}
CheckListWindow.Close = function () {
    var chks = getTag("div-search-chks", getTagType.Class);
    if (chks) {
        for (var i = 0; i < chks.length; i++) {
            chks[i].style.display = "none";
        }
    }
    var divSearchBackground = getTag("divSearchBackground");
    if (divSearchBackground)
        divSearchBackground.style.display = "none";
}

function SearchControl(id, fn, checkDiv) {
    var div = document.createElement("div");
    div.id = id;
    div.onclick = stopPropagation;
    div.className = "div-search";

    var inputDiv = document.createElement("div");
    inputDiv.style.zIndex = "1033";
    inputDiv.className = "input-group";

    var input = document.createElement("input");
    input.type = "text";
    input.className = "form-control";
    if (checkDiv) {
        input.onclick = function (id) {
            WindowClose();
            getTag(checkDiv.id).style.display = "block";
            getTag("divSearchBackground").style.display = "block";
        };
    }
    input.onkeydown = function (event_e) {
        if (window.event)
            event_e = window.event;
        var int_keycode = event_e.charCode || event_e.keyCode;
        if (int_keycode == 13) {
            fn();
        }
    }
    inputDiv.appendChild(input);

    var btnDiv = document.createElement("div");
    btnDiv.className = "input-group-btn"
    var btnContentDiv = document.createElement("div");
    btnContentDiv.className = "btn btn-primary-outline";
    btnContentDiv.onclick = fn;
    var btn = document.createElement("i");
    btn.className = "icon-search";
    btnContentDiv.appendChild(btn);
    btnDiv.appendChild(btnContentDiv);
    inputDiv.appendChild(btnDiv);
    div.appendChild(inputDiv);
    if (checkDiv) {
        div.appendChild(checkDiv);
        if (document.getElementsByClassName("divSearchBackground").length == 0) {
            var divBackground = document.createElement("div");
            divBackground.className = "divSearchBackground";
            divBackground.id = "divSearchBackground";
            divBackground.onclick = CheckListWindow.Close;
            document.body.appendChild(divBackground);
        }
    }
    this.Input = input;
    this.Div = div;
}

function CheckListAttributes(dic, chkName, divChksId, chksColumnCount, divChksWidth) {
    this.Dic = dic;
    this.Name = chkName;
    this.DivId = divChksId;
    if (!chksColumnCount)
        chksColumnCount = 2;
    this.ColumnCount = chksColumnCount;
    if (!divChksWidth)
        divChksWidth = 302;
    this.Width = divChksWidth;
}

function DropDownListAttributes(caretId, ulId, liObj, ulCss) {
    this.CaretId = caretId;
    this.UlId = ulId;
    this.LiObj = liObj;
    this.UlCss = ulCss
}

function DropDownListWindow(dropDownListAttributes) {
    var caretDiv = document.createElement("div");
    caretDiv.id = dropDownListAttributes.CaretId;
    caretDiv.className = "btn btn-xs dropdown-toggle control btn-primary-outline btn-xsgroup-toggle";
    caretDiv.dataset.toggle = "dropdown";
    var caretSpan = document.createElement("span");
    caretSpan.className = "caret";
    caretSpan.style.margin = "0";
    caretDiv.style.paddingLeft = "8px";
    caretDiv.style.paddingRight = "8px";
    caretDiv.style.paddingTop = "10px";
    caretDiv.style.lineHeight = "0px";
    caretDiv.appendChild(caretSpan);
    var ul = document.createElement("ul");
    ul.style.left = "-1px";
    ul.id = dropDownListAttributes.UlId
    ul.className = "dropdown-menu association-dropdown-menu";
    if (dropDownListAttributes.UlCss) {
        ul.className = ul.className + " " + dropDownListAttributes.UlCss;
    }
    for (var key in dropDownListAttributes.LiObj) {
        (function () {
            var li = document.createElement("li");
            li.className = "dropdown-menu-li";
            var a = document.createElement("a");
            a.className = "association-dropdown-men-item mouse_pointer";
            a.innerHTML = key;
            a.onclick = function () {
                dropDownListAttributes.LiObj[key](a);
            };
            li.appendChild(a);
            ul.appendChild(li);
        })();
    }
    this.CaretDiv = caretDiv;
    this.Ul = ul;
}

function SearchDropDownControl(id, fn, caret) {
    var div = document.createElement("div");
    div.id = id;
    div.className = "div-search";

    var inputDiv = document.createElement("div");
    inputDiv.style.zIndex = "1033";
    inputDiv.className = "input-group";

    var input = document.createElement("input");
    input.type = "text";
    input.className = "form-control";
    inputDiv.appendChild(input);

    input.onkeydown = function (event_e) {
        if (window.event)
            event_e = window.event;
        var int_keycode = event_e.charCode || event_e.keyCode;
        if (int_keycode == 13) {
            fn();
        }
    }

    var btnDiv = document.createElement("div");
    btnDiv.className = "input-group-btn"
    var btnContentDiv = document.createElement("div");
    btnContentDiv.className = "btn btn-primary-outline";
    btnContentDiv.onclick = fn;
    var btn = document.createElement("i");
    btn.className = "icon-search";
    btnContentDiv.appendChild(btn);
    btnDiv.appendChild(btnContentDiv);
    btnDiv.appendChild(caret.CaretDiv);
    btnDiv.appendChild(caret.Ul);
    inputDiv.appendChild(btnDiv);
    div.appendChild(inputDiv);
    this.Icon = btn;
    this.Input = input;
    this.Div = div;
}


function DropDownListSearchControl(id, fn, dropDownListAttributes) {
    var caret = new DropDownListWindow(dropDownListAttributes);
    var searchDiv = new SearchDropDownControl(id, fn, caret);
    this.Icon = searchDiv.Icon
    this.Input = searchDiv.Input;
    this.Div = searchDiv.Div;
}

function DropDownCheckListSearchControl(id, fn, checkListAttributes) {
    var checkDiv = new CheckListWindow(checkListAttributes);
    var searchDiv = new SearchControl(id, fn, checkDiv);
    this.Input = searchDiv.Input;
    this.Div = searchDiv.Div;
}

function IPTextControl(inputIdFont, fn) {
    this.Text1;
    this.Text2;
    this.Text3;
    this.Text4;
    this.div;
    var div = document.createElement("div");
    div.className = "form-control";
    for (var i = 1; i < 4 + 1; i++) {
        var text = new IPTextItem(inputIdFont + i.toString(), fn, i == 1 ? null : inputIdFont + (i - 1).toString(), i == 4 ? null : inputIdFont + (i + 1).toString());
        this["Text" + i] = text;
        div.appendChild(text);
        if (i != 4) {
            var span = document.createElement("span");
            span.innerText = ".";
            span.style.cssFloat = "left";
            span.style.styleFloat = "left";
            span.style.fontWeight = "bolder";
            div.appendChild(span);
        }
    }
    this.div = div;
}

IPTextControl.prototype.toString = function () {
    if (this.Text1.value && this.Text2.value && this.Text3.value && this.Text4.value)
        return this.Text1.value + "." + this.Text2.value + "." + this.Text3.value + "." + this.Text4.value;
    return null;
}

IPTextControl.prototype.toIntArray = function () {
    if (this.Text1.value && this.Text2.value && this.Text3.value && this.Text4.value) {
        var arr = new Array();
        for (var i = 1; i < 4 + 1; i++) {
            arr.push(parseInt(this["Text" + i].value));
        }
        return arr;
    }
    return null;
}

function IPTextItem(inputId, fn, afterInputId, nextInputId) {
    var text = document.createElement("input");
    text.id = inputId;
    text.style.border = "0";
    text.style.width = "22.1%";
    text.style.height = "22px";
    text.style.cssFloat = "left";
    text.style.styleFloat = "left";
    text.style.textAlign = "center";
    text.maxLength = 3;
    text.type = "text";
    text.onkeyup = function () {
        textIP_onkeyup(text, afterInputId, nextInputId, fn);
    }
    return text;
}

function textIP_onkeyup(sender, after, next, fn) {
    var reg1 = /^([0-9]+)$/;
    var reg2 = /^\s*$/g;
    var nextTag = document.getElementById(next);
    var afterTag = document.getElementById(after);

    if (sender.value.length == 1 && sender.value == "." && next) {
        sender.value = 0;
        nextTag.focus();
    }
    if (sender.value.length <= 3 && sender.value.length >= 2) {
        var strs = sender.value.split("."); //字符分割 
        if (strs.length == 2 && sender.value.indexOf(".") == sender.value.length - 1) {
            var str = sender.value.substring(0, sender.value.length - 1);
            if (reg1.test(str) && next) {
                sender.value = str;
                nextTag.focus();
            }
        }
    }
    if (!reg1.test(sender.value) && !reg2.test(sender.value))
        sender.value = 0;
    if (parseInt(sender.value) > 255)
        sender.value = 255;
    if (sender.value.length == 3 && next && window.event.keyCode != 37 && window.event.keyCode != 39)
        nextTag.focus();
    if (sender.selectionStart == 0 && after && window.event.keyCode == 37) {
        afterTag.selectionStart = afterTag.value.length;
        afterTag.focus();
    }
    if (sender.selectionStart == sender.value.length && next && window.event.keyCode == 39) {
        if (nextTag.value.length > 0)
            nextTag.selectionStart = 1;
        nextTag.focus();
    }
    if (sender.selectionStart == 0 && after && window.event.keyCode == 8)
        afterTag.focus();
    if (sender.value.length > 1 && sender.value.substr(0, 1) == "0") {
        sender.value = sender.value.substr(1, sender.value.length - 1);
    }
    if (fn)
        fn(sender, after, next);
}

function SelectList(name) {
    var _this = this;
    var name = name;//列表项的name
    var SelectId = null;//上一次选中的列表项的id
    this.EventAfterItemOnclick = null;//点击列表项之后需要执行的方法
    this.Selected = new Dictionary();//已选中的列表项容器

    this.removeSelected = function (id, tag) {//删除指定的列表项的选中状态
        delete _this.Selected[id];
        if (tag.className.indexOf("selected") >= 0)
            $(tag).removeClass("selected");
    }

    this.addSelected = function (id, tag) {//添加指定的列表项的选中状态
        _this.Selected[id] = id;
        if (tag.className.indexOf("selected") < 0)
            $(tag).addClass("selected");
    }

    this.bindShortcutKeySelectClick = function (tag) {
        tag.onclick = function () {
            var tags = document.getElementsByName(name);//获取所有列表项
            var selectTag = this;//当前点击的标签
            var afterTag = null;//上一次点击的标签
            var bgeinIndex;//开始坐标
            var endIndex;//结束坐标
            if (SelectId) {
                afterTag = document.getElementById(SelectId);
                var afterTagIndex = parseInt($(afterTag).attr("index"));
                var selectTagIndex = parseInt($(selectTag).attr("index"));
                bgeinIndex = Math.min(selectTagIndex, afterTagIndex);
                endIndex = Math.max(selectTagIndex, afterTagIndex);
            }
            else {
                bgeinIndex = 0;
                endIndex = parseInt($(selectTag).attr("index"));
            }
            if (ShortcutKey.shiftKey && ShortcutKey.ctrlKey) {//Ctrl和Shift都按下
                if (SelectId) {
                    for (var i = bgeinIndex; i <= endIndex ; i++) {
                        if ($(tags[i]).attr("index") >= bgeinIndex && $(tags[i]).attr("index") <= endIndex) {
                            if (!_this.Selected[tags[i].id]) {
                                _this.addSelected(tags[i].id, tags[i]);
                            }
                        }
                    }
                }
            }
            else if (ShortcutKey.shiftKey) {//只按下Shift
                GroupList.Select.Clean(name, _this.removeSelected)
                for (var i = bgeinIndex; i <= endIndex ; i++) {
                    if ($(tags[i]).attr("index") >= bgeinIndex && $(tags[i]).attr("index") <= endIndex) {
                        if (!_this.Selected[tags[i].id]) {
                            _this.addSelected(tags[i].id, tags[i]);
                        }
                    }
                }
            }
            else if (ShortcutKey.ctrlKey) {//只按下Ctrl
                SelectId = selectTag.id;
                if (!_this.Selected[selectTag.id]) {
                    _this.addSelected(selectTag.id, selectTag);
                }
                else {
                    _this.removeSelected(selectTag.id, selectTag);
                }
            }
            else {//Ctrl和Shift都没有按下
                GroupList.Select.Clean(name, _this.removeSelected)
                SelectId = selectTag.id;
                if (!_this.Selected[selectTag.id]) {
                    _this.addSelected(selectTag.id, selectTag);
                }
            }
            if (_this.EventAfterItemOnclick)
                _this.EventAfterItemOnclick();
            return false;
        };
        return tag;
    }
}

function GroupListIndexItem(name, index) {
    var a = document.createElement("a");
    a.className = "list-group-item";

    var p = document.createElement("p");
    a.appendChild(p);
    a.Content = a.firstChild;
    a.name = name;
    a.setAttribute("index", index);
    return a;
}

document.addEventListener("keydown", function () {
    if (window.event.shiftKey) {
        ShortcutKey.shiftKey = true;
    }
    if (window.event.ctrlKey) {
        ShortcutKey.ctrlKey = true;
    }
});

document.addEventListener("keyup", function () {
    if (event.keyCode == 16) {
        ShortcutKey.shiftKey = false;
    }
    if (event.keyCode == 17) {
        ShortcutKey.ctrlKey = false;
    }
});

var ShortcutKey = {
    shiftKey: false,
    ctrlKey: false
}