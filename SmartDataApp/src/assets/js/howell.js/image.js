function ImageFilter(filter, innerText) {
    var btn = document.createElement("a");
    btn.className = "btn btn-sm btn-primary-outline";
    btn.href = "#";
    btn.innerHTML = innerText;
    btn.dataset.filter = filter;
    return btn;
}
function ImageFilterList(id, Enum, isAll) {
    var filterDiv = document.createElement("div");
    filterDiv.className = "gallery-filters list-inline btn-group";
    if (isAll) {
        var btnAll = ImageFilter("*", "全部");
        filterDiv.appendChild(btnAll);
    }
    for (var key in Enum) {
        var type = key;
        var filterBtn = ImageFilter("." + type, Enum[key]);
        filterDiv.appendChild(filterBtn);
    }
    document.getElementById(id).appendChild(filterDiv);
    $container = $(".gallery-container");
    $container.isotope({});
    $(".gallery-filters a").click(function () {
        var selector;
        selector = $(this).attr("data-filter");
        $(".gallery-filters a.selected").removeClass("selected");
        $(this).addClass("selected");

        $container.isotope({
            filter: selector
        });

        var name = selector;
        var rel = selector;
        if (selector == "*") {
            name = ".gallery-item";
            rel = "all";
        }
        var tags = $(name);
        var changeRel = function (_tags) {
            for (var i = 0; i < _tags.childNodes.length; i++) {
                changeRel(_tags.childNodes[i]);
            }
            if (_tags.className.indexOf("details") > -1)
                $(_tags).attr("rel", rel);
        }
        for (var i = 0; i < tags.length; i++) {
            changeRel(tags[i]);
        }
        return false;
    });
    if (filterDiv.childNodes.length > 0)
        filterDiv.childNodes[0].click();
    return filterDiv;
}

function ImageBoxObject() {
    this.Id = "";
    this.Src = "";
    this.Rel = "default";
    this.OtherBtns = new Array();
}
function ImageBoxActionBtn(btnClassName) {
    var a = document.createElement("a");
    var i = document.createElement("i");
    i.className = btnClassName;
    a.appendChild(i);
    return a;
}

function ImageZoomBtn(imgObj) {
    var zoom_in = ImageBoxActionBtn("icon-zoom-in");
    zoom_in.href = imgObj.Src;
    zoom_in.rel = imgObj.Rel;
    zoom_in.className = "details";
    return zoom_in;
}

function ImageBox(imgObj, fancybox_options) {
    var result = document.createElement("a");
    result.className = "gallery-item";
    if (imgObj.Rel != "default")
        $(result).addClass(imgObj.Rel);
    result.id = imgObj.Id;

    var img = document.createElement("img");
    img.src = imgObj.Src;

    result.appendChild(img);

    var actions = document.createElement("div");
    actions.className = "actions";

    actions.appendChild(new ImageZoomBtn(imgObj));

    if (imgObj.OtherBtns.length > 0) {
        for (var i = 0; i < imgObj.OtherBtns.length; i++) {
            actions.appendChild(imgObj.OtherBtns[i]);
        }
    }
    result.appendChild(actions)

    if (fancybox_options)
        $(zoom_in).fancybox(fancybox_options);

    return result;
}

function ImageBoxList(id, objArray, fancybox_options) {
    var result = document.createElement("div");
    result.className = "gallery-container";
    result.id = id;
    for (var i = 0; i < objArray.length; i++) {
        var box = new ImageBoxObject()
        for (var key in objArray[i]) {
            if (objArray[i][key])
                box[key] = objArray[i][key];
        }
        result.appendChild(new ImageBox(box));
    }
    $("#" + id + " .details").fancybox(fancybox_options);
    return result;
}

//function _load() {
//    var ImageType = {
//        type1: "类型1",
//        type2: "类型2",
//        type3: "类型3",
//    }
//    var imgs = new Array();
//    for (var i = 0; i < 9; i++) {
//        (function () {
//            var img = new ImageBoxObject();
//            img.Id = i.toString();
//            img.Src = "images/image-iso" + i + ".png";
//            img.Rel = "type" + (i % 3 + 1);

//            var trashBtn = new ImageBoxActionBtn("icon-trash");
//            trashBtn.onclick = (function () {
//                alert("删除:" + img.Src);
//            });
//            img.OtherBtns.push(trashBtn);

//            var pencilBtn = new ImageBoxActionBtn("icon-pencil");
//            pencilBtn.onclick = (function () {
//                alert("修改:" + img.Src);
//            });
//            img.OtherBtns.push(pencilBtn);

//            imgs.push(img);
//        })();
//    }
//    var test = document.getElementById("test");
//    var imgs = new ImageBoxList("img_box", imgs, {
//        maxWidth: 700,
//        height: 'auto',
//        fitToView: false,
//        autoSize: true,
//        padding: 15,
//        nextEffect: 'fade',
//        prevEffect: 'fade',
//        helpers: {
//            title: {
//                type: "outside"
//            }
//        }
//    });
//    test.appendChild(imgs);
//    $(imgs).isotope({});
//    var filter = new ImageFilterList("heading", ImageType, true);
//}
//onload = _load;